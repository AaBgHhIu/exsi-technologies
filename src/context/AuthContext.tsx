"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export const ADMIN_EMAILS = [
  "tbabhimanue06@gmail.com",
  "tbabhimanue6@gmail.com",
  "basilthankachan274@gmail.com",
];

export function checkIsAdmin(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  provider: "google" | "email";
  college?: string;
  phone?: string;
  year?: string;
}

export interface EnrolledCourseItem {
  id: string;
  courseSlug: string;
  courseTitle: string;
  duration: string;
  fee: string;
  batchStart: string;
  status: "approved" | "pending" | "rejected";
  registeredAt: string;
  meetingLink?: string;
  materialsUrl?: string;
  college?: string;
  phone?: string;
  year?: string;
  paymentId?: string;
  paymentMethod?: "online_razorpay" | "offline";
}

interface AuthContextType {
  user: StudentUser | null;
  loading: boolean;
  isAdmin: boolean;
  enrollments: EnrolledCourseItem[];
  hasRealGoogleConfigured: boolean;
  refreshEnrollments: () => Promise<void>;
  signInWithGoogle: (customData?: { name?: string; email?: string }) => Promise<void>;
  signInWithEmail: (email: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  registerCourse: (course: {
    slug: string;
    title: string;
    duration: string;
    fee: string;
    batchStart: string;
    studentName?: string;
    college?: string;
    phone?: string;
    year?: string;
  }) => Promise<EnrolledCourseItem>;
  isRegistered: (slug: string) => boolean;
  removeRegistration: (slug: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface EnrollmentDbRow {
  id: string;
  status: "approved" | "pending" | "rejected";
  created_at: string;
  student_name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  fee_amount: number;
  payment_id: string | null;
  payment_method: "online_razorpay" | "offline" | null;
  courses:
    | {
        slug: string;
        title: string;
        duration: string;
        batch_start_date: string;
        course_private:
          | { meeting_link: string; materials_url: string }
          | { meeting_link: string; materials_url: string }[]
          | null;
      }
    | {
        slug: string;
        title: string;
        duration: string;
        batch_start_date: string;
        course_private:
          | { meeting_link: string; materials_url: string }
          | { meeting_link: string; materials_url: string }[]
          | null;
      }[]
    | null;
}

function mapEnrollment(row: EnrollmentDbRow): EnrolledCourseItem {
  const course = Array.isArray(row.courses) ? row.courses[0] : row.courses;
  const privateData = Array.isArray(course?.course_private)
    ? course.course_private[0]
    : course?.course_private;

  return {
    id: row.id,
    courseSlug: course?.slug || "",
    courseTitle: course?.title || "Course",
    duration: course?.duration || "",
    fee: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(row.fee_amount),
    batchStart: course?.batch_start_date
      ? new Date(`${course.batch_start_date}T00:00:00`).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        })
      : "",
    status: row.status,
    registeredAt: row.created_at.slice(0, 10),
    meetingLink: privateData?.meeting_link || undefined,
    materialsUrl: privateData?.materials_url || undefined,
    college: row.college,
    phone: row.phone,
    year: row.year,
    paymentId: row.payment_id || undefined,
    paymentMethod: row.payment_method || undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(null);
  const [enrollments, setEnrollments] = useState<EnrolledCourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasRealGoogleConfigured = Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      !supabaseUrl.includes("your-project") &&
      supabaseUrl.startsWith("https://")
  );

  const isAdmin = checkIsAdmin(user?.email);

  // Initialize from Supabase; local storage remains a demo-only fallback.
  useEffect(() => {
    const supabase = createClient();

    try {
      const storedUser = localStorage.getItem("exsi_student_user");
      if (storedUser && !supabase) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        void loadEnrollmentsForUser(parsed);
      }
    } catch {
      // ignore JSON parse errors
    }

    // Check Supabase session if configured
    if (supabase) {
      supabase.auth
        .getSession()
        .then(({ data: { session }, error }) => {
          if (error) {
            console.error("Failed to load Supabase session:", error.message);
          }

          if (session?.user) {
            const su: StudentUser = {
              id: session.user.id,
              name:
                session.user.user_metadata?.full_name ||
                session.user.user_metadata?.name ||
                session.user.email?.split("@")[0] ||
                "Student",
              email: session.user.email || "",
              image: session.user.user_metadata?.avatar_url,
              provider: (session.user.app_metadata?.provider as "google" | "email") || "google",
            };
            setUser(su);
            localStorage.setItem("exsi_student_user", JSON.stringify(su));
            void loadEnrollmentsForUser(su);
          } else {
            setUser(null);
            setEnrollments([]);
            setLoading(false);
          }
        })
        .catch((error: unknown) => {
          console.error("Failed to load Supabase session:", error);
          setLoading(false);
        });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const su: StudentUser = {
            id: session.user.id,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              session.user.email?.split("@")[0] ||
              "Student",
            email: session.user.email || "",
            image: session.user.user_metadata?.avatar_url,
            provider: (session.user.app_metadata?.provider as "google" | "email") || "google",
          };
          setUser(su);
          localStorage.setItem("exsi_student_user", JSON.stringify(su));
          void loadEnrollmentsForUser(su);
        } else {
          setUser(null);
          setEnrollments([]);
          setLoading(false);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }

    setLoading(false);
  }, []);

  async function loadEnrollmentsForUser(authUser: StudentUser) {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase
        .from("enrollments")
        .select(
          "id,status,created_at,student_name,email,phone,college,year,fee_amount,payment_id,payment_method,courses!inner(slug,title,duration,batch_start_date,course_private(meeting_link,materials_url))"
        )
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load Supabase enrollments:", error.message);
        setEnrollments([]);
      } else {
        setEnrollments((data || []).map((row) => mapEnrollment(row as EnrollmentDbRow)));
      }
      setLoading(false);
      return;
    }

    try {
      const key = `exsi_enrollments_${authUser.email.toLowerCase()}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setEnrollments(JSON.parse(saved));
      } else {
        localStorage.setItem(key, JSON.stringify([]));
        setEnrollments([]);
      }
    } catch {
      setEnrollments([]);
    } finally {
      setLoading(false);
    }
  }

  const refreshEnrollments = async () => {
    if (user) {
      await loadEnrollmentsForUser(user);
    }
  };

  // Google Sign-In Handler
  const signInWithGoogle = async (customData?: { name?: string; email?: string }) => {
    setLoading(true);
    const supabase = createClient();

    // 1. If Supabase is configured with real keys, trigger official OAuth
    if (supabase && supabaseUrl && !supabaseUrl.includes("your-project")) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: "offline",
              prompt: "consent",
            },
          },
        });
        if (error) throw error;
        return;
      } catch (err) {
        setLoading(false);
        throw err;
      }
    }

    if (process.env.NODE_ENV === "production") {
      setLoading(false);
      throw new Error("Google sign-in is not configured. Please contact the EXSI team.");
    }

    // 2. No real Google configured — require explicit email to be passed
    if (!customData?.email) {
      setLoading(false);
      return; // Do NOT auto-login anyone without an explicit email
    }
    const email = customData.email.toLowerCase().trim();
    const name = customData?.name || email.split("@")[0];
    const googleUser: StudentUser = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      name,
      email,
      image: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      provider: "google",
    };

    setUser(googleUser);
    localStorage.setItem("exsi_student_user", JSON.stringify(googleUser));
    void loadEnrollmentsForUser(googleUser);
    setLoading(false);
  };

  // Email Sign-In
  const signInWithEmail = async (email: string, name?: string) => {
    setLoading(true);
    const emailUser: StudentUser = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      name: name || email.split("@")[0],
      email: email.toLowerCase(),
      provider: "email",
    };

    setUser(emailUser);
    localStorage.setItem("exsi_student_user", JSON.stringify(emailUser));
    void loadEnrollmentsForUser(emailUser);
    setLoading(false);
  };

  // Sign Out
  const signOut = async () => {
    const supabase = createClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Failed to sign out of Supabase:", error);
      }
    }
    localStorage.removeItem("exsi_student_user");
    setUser(null);
    setEnrollments([]);
  };

  // Register Course
  const registerCourse = async (course: {
    slug: string;
    title: string;
    duration: string;
    fee: string;
    batchStart: string;
    studentName?: string;
    college?: string;
    phone?: string;
    year?: string;
  }) => {
    if (!user) {
      throw new Error("Sign in with Google before registering for a course.");
    }

    const supabase = createClient();
    if (!supabase) {
      throw new Error("Course registration requires a configured Supabase project.");
    }

    const { data: courseRow, error: courseError } = await supabase
      .from("courses")
      .select("id,fee")
      .eq("slug", course.slug)
      .eq("is_active", true)
      .single();

    if (courseError || !courseRow) {
      throw new Error(courseError?.message || "This course is not available for registration.");
    }

    const selection =
      "id,status,created_at,student_name,email,phone,college,year,fee_amount,payment_id,payment_method,courses!inner(slug,title,duration,batch_start_date,course_private(meeting_link,materials_url))";
    const { data: existing, error: existingError } = await supabase
      .from("enrollments")
      .select(selection)
      .eq("user_id", user.id)
      .eq("course_id", courseRow.id)
      .maybeSingle();

    if (existingError) {
      throw new Error(`Could not check your existing registration: ${existingError.message}`);
    }

    if (existing) {
      const existingEnrollment = mapEnrollment(existing as EnrollmentDbRow);
      setEnrollments((current) => [
        existingEnrollment,
        ...current.filter((item) => item.id !== existingEnrollment.id),
      ]);
      return existingEnrollment;
    }

    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        course_id: courseRow.id,
        status: "pending",
        student_name: course.studentName || user.name,
        email: user.email,
        phone: course.phone || user.phone || "",
        college: course.college || user.college || "",
        year: course.year || user.year || "3rd Year",
        fee_amount: courseRow.fee,
      })
      .select(selection)
      .single();

    if (error || !data) {
      throw new Error(
        `Could not create your registration: ${error?.message || "No record returned."}`
      );
    }

    const newEnrollment = mapEnrollment(data as EnrollmentDbRow);
    setEnrollments((current) => [newEnrollment, ...current]);
    return newEnrollment;
  };

  const isRegistered = (slug: string): boolean => {
    return enrollments.some((c) => c.courseSlug === slug);
  };

  const removeRegistration = async (slug: string) => {
    if (!user) {
      throw new Error("Sign in before cancelling a registration.");
    }
    const enrollment = enrollments.find((item) => item.courseSlug === slug);
    if (!enrollment) return;

    const supabase = createClient();
    if (!supabase) {
      throw new Error("Registration changes require a configured Supabase project.");
    }

    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("id", enrollment.id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(`Could not cancel your registration: ${error.message}`);
    }
    setEnrollments((current) => current.filter((item) => item.id !== enrollment.id));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        enrollments,
        hasRealGoogleConfigured,
        refreshEnrollments,
        signInWithGoogle,
        signInWithEmail,
        signOut,
        registerCourse,
        isRegistered,
        removeRegistration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
