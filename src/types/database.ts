export type UserRole = "student" | "admin";
export type EnrollmentStatus = "pending" | "approved" | "rejected";
export type QuoteStatus = "new" | "contacted" | "archived";

export interface Profile {
  id: string; // references auth.users
  full_name: string;
  email: string;
  phone: string;
  college: string;
  year: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  short_desc: string;
  description: string;
  syllabus: { module: string; topics: string[] }[];
  fee: number;
  duration: string;
  mode: string;
  batch_start_date: string;
  is_active: boolean;
  created_at: string;
}

export interface CoursePrivate {
  course_id: string;
  meeting_link: string;
  materials_url: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  created_at: string;
  approved_at?: string | null;
  // Join fields for convenience in UI:
  profile?: Profile;
  course?: Course;
  course_private?: CoursePrivate;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  project_idea: string;
  budget: string;
  deadline: string;
  status: QuoteStatus;
  created_at: string;
}
