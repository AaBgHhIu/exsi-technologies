import { createClient } from "@/lib/supabase/client";

export interface AdminRegistrationRecord {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  courseTitle: string;
  courseSlug: string;
  fee: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  meetingLink?: string;
  materialsUrl?: string;
  paymentId?: string;
  paymentMethod?: "online_razorpay" | "offline";
}

interface AdminEnrollmentRow {
  id: string;
  student_name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  fee_amount: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  payment_id: string | null;
  payment_method: "online_razorpay" | "offline" | null;
  courses:
    | {
        slug: string;
        title: string;
        course_private:
          | { meeting_link: string; materials_url: string }
          | { meeting_link: string; materials_url: string }[]
          | null;
      }
    | {
        slug: string;
        title: string;
        course_private:
          | { meeting_link: string; materials_url: string }
          | { meeting_link: string; materials_url: string }[]
          | null;
      }[]
    | null;
}

function mapRegistration(row: AdminEnrollmentRow): AdminRegistrationRecord {
  const course = Array.isArray(row.courses) ? row.courses[0] : row.courses;
  const privateData = Array.isArray(course?.course_private)
    ? course.course_private[0]
    : course?.course_private;

  return {
    id: row.id,
    studentName: row.student_name,
    email: row.email,
    phone: row.phone,
    college: row.college,
    year: row.year,
    courseTitle: course?.title || "Course",
    courseSlug: course?.slug || "",
    fee: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(row.fee_amount),
    status: row.status,
    date: new Date(row.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    meetingLink: privateData?.meeting_link || undefined,
    materialsUrl: privateData?.materials_url || undefined,
    paymentId: row.payment_id || undefined,
    paymentMethod: row.payment_method || undefined,
  };
}

export async function getAllRegistrations(): Promise<AdminRegistrationRecord[]> {
  const supabase = createClient();
  if (!supabase) {
    throw new Error("Registration management requires a configured Supabase project.");
  }

  const { data, error } = await supabase
    .from("enrollments")
    .select(
      "id,student_name,email,phone,college,year,fee_amount,status,created_at,payment_id,payment_method,courses!inner(slug,title,course_private(meeting_link,materials_url))"
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Could not load registrations: ${error.message}`);
  }

  return (data || []).map((row) => mapRegistration(row as AdminEnrollmentRow));
}

export async function updateRegistrationStatus(
  id: string,
  newStatus: "approved" | "rejected"
): Promise<AdminRegistrationRecord[]> {
  const supabase = createClient();
  if (!supabase) {
    throw new Error("Registration management requires a configured Supabase project.");
  }

  const { error } = await supabase
    .from("enrollments")
    .update({
      status: newStatus,
      approved_at: newStatus === "approved" ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Could not update registration status: ${error.message}`);
  }

  return getAllRegistrations();
}

export async function deleteRegistration(id: string): Promise<AdminRegistrationRecord[]> {
  const supabase = createClient();
  if (!supabase) {
    throw new Error("Registration management requires a configured Supabase project.");
  }

  const { error } = await supabase.from("enrollments").delete().eq("id", id);
  if (error) {
    throw new Error(`Could not delete registration: ${error.message}`);
  }

  return getAllRegistrations();
}
