"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveNewRegistration } from "@/lib/registrations";

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
  status: "approved" | "pending";
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
  signInWithGoogle: (customData?: { name?: string; email?: string }) => Promise<void>;
  signInWithGoogleCredential: (jwtCredential: string) => void;
  signInWithEmail: (email: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  registerCourse: (course: {
    slug: string;
    title: string;
    duration: string;
    fee: string;
    batchStart: string;
    college?: string;
    phone?: string;
    year?: string;
    status?: "approved" | "pending";
    paymentId?: string;
    orderId?: string;
    paymentMethod?: "online_razorpay" | "offline";
  }) => boolean;
  isRegistered: (slug: string) => boolean;
  removeRegistration: (slug: string) => void;
  markCoursePaid: (slug: string, paymentId: string, orderId?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to decode JWT payload:", err);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentUser | null>(null);
  const [enrollments, setEnrollments] = useState<EnrolledCourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasRealGoogleConfigured = Boolean(
    (googleClientId && googleClientId.length > 10 && !googleClientId.includes("your-google-client-id")) ||
    (supabaseUrl && !supabaseUrl.includes("your-project") && supabaseUrl.startsWith("https://"))
  );

  const isAdmin = checkIsAdmin(user?.email);

  // Initialize auth state from localStorage and Supabase session
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("exsi_student_user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        loadEnrollmentsForUser(parsed.email);
      }
    } catch {
      // ignore JSON parse errors
    }

    // Check Supabase session if configured
    const supabase = createClient();
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
            loadEnrollmentsForUser(su.email);
          } else {
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
          loadEnrollmentsForUser(su.email);
        } else if (!storedUserExists()) {
          setUser(null);
          setEnrollments([]);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }

    setLoading(false);
  }, []);

  function storedUserExists(): boolean {
    try {
      return !!localStorage.getItem("exsi_student_user");
    } catch {
      return false;
    }
  }

  function loadEnrollmentsForUser(email: string) {
    try {
      const key = `exsi_enrollments_${email.toLowerCase()}`;
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

  // Real Google Sign-In via Google Identity Services JWT token
  const signInWithGoogleCredential = (jwtCredential: string) => {
    const payload = decodeJwtPayload(jwtCredential);
    if (!payload || !payload.email) {
      console.error("Invalid Google JWT Credential");
      return;
    }

    const realGoogleUser: StudentUser = {
      id: payload.sub || "google-" + Math.random().toString(36).substring(2, 9),
      name: payload.name || payload.email.split("@")[0],
      email: payload.email.toLowerCase(),
      image: payload.picture,
      provider: "google",
    };

    setUser(realGoogleUser);
    localStorage.setItem("exsi_student_user", JSON.stringify(realGoogleUser));
    loadEnrollmentsForUser(realGoogleUser.email);
    setLoading(false);
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
    loadEnrollmentsForUser(googleUser.email);
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
    loadEnrollmentsForUser(emailUser.email);
    setLoading(false);
  };

  // Sign Out
  const signOut = async () => {
    const supabase = createClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    localStorage.removeItem("exsi_student_user");
    setUser(null);
    setEnrollments([]);
  };

  // Register Course
  const registerCourse = (course: {
    slug: string;
    title: string;
    duration: string;
    fee: string;
    batchStart: string;
    college?: string;
    phone?: string;
    year?: string;
    status?: "approved" | "pending";
    paymentId?: string;
    orderId?: string;
    paymentMethod?: "online_razorpay" | "offline";
  }): boolean => {
    if (!user) return false;

    const key = `exsi_enrollments_${user.email.toLowerCase()}`;
    const current = [...enrollments];

    const existingIndex = current.findIndex((c) => c.courseSlug === course.slug);
    if (existingIndex >= 0) {
      return true;
    }

    const initialStatus = course.status || "pending";

    const newEnrollment: EnrolledCourseItem = {
      id: `enr-${Date.now()}`,
      courseSlug: course.slug,
      courseTitle: course.title,
      duration: course.duration,
      fee: course.fee,
      batchStart: course.batchStart,
      status: initialStatus,
      registeredAt: new Date().toISOString().split("T")[0],
      college: course.college || user.college || "Engineering College",
      phone: course.phone || user.phone || "",
      year: course.year || user.year || "3rd Year",
      paymentId: course.paymentId,
      paymentMethod: course.paymentMethod,
    };

    const updated = [newEnrollment, ...current];
    setEnrollments(updated);
    try {
      localStorage.setItem(key, JSON.stringify(updated));

      // Also save to global admin registration database
      saveNewRegistration({
        id: newEnrollment.id,
        studentName: user.name || user.email.split("@")[0],
        email: user.email,
        phone: course.phone || user.phone || "",
        college: course.college || user.college || "Engineering College",
        year: course.year || user.year || "3rd Year",
        courseTitle: course.title,
        courseSlug: course.slug,
        fee: course.fee,
        status: initialStatus,
        paymentId: course.paymentId,
        orderId: course.orderId,
        paymentMethod: course.paymentMethod,
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        meetingLink: "https://meet.google.com/exsi-vlsi-live",
        materialsUrl: "https://drive.google.com/drive/folders/exsi-verilog-resources",
      });
    } catch {
      // ignore
    }
    return true;
  };

  const isRegistered = (slug: string): boolean => {
    return enrollments.some((c) => c.courseSlug === slug);
  };

  const removeRegistration = (slug: string) => {
    if (!user) return;
    const key = `exsi_enrollments_${user.email.toLowerCase()}`;
    const filtered = enrollments.filter((c) => c.courseSlug !== slug);
    setEnrollments(filtered);
    try {
      localStorage.setItem(key, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  };

  const markCoursePaid = (slug: string, paymentId: string, orderId?: string) => {
    if (!user) return;
    const key = `exsi_enrollments_${user.email.toLowerCase()}`;
    const updated = enrollments.map((c) => {
      if (c.courseSlug === slug) {
        return {
          ...c,
          status: "approved" as const,
          paymentId,
          paymentMethod: "online_razorpay" as const,
          meetingLink: c.meetingLink || "https://meet.google.com/exsi-vlsi-live",
          materialsUrl: c.materialsUrl || "https://drive.google.com/drive/folders/exsi-verilog-resources",
        };
      }
      return c;
    });
    setEnrollments(updated);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        enrollments,
        hasRealGoogleConfigured,
        signInWithGoogle,
        signInWithGoogleCredential,
        signInWithEmail,
        signOut,
        registerCourse,
        isRegistered,
        removeRegistration,
        markCoursePaid,
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
