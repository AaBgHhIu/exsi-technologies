"use client";

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
  orderId?: string;
  paymentMethod?: "online_razorpay" | "offline";
}

const STORAGE_KEY = "exsi_all_admin_registrations";

export const DEFAULT_INITIAL_REGISTRATIONS: AdminRegistrationRecord[] = [
  {
    id: "reg-demo-1",
    studentName: "Rahul Sharma",
    email: "rahul@nitc.edu",
    phone: "+91 98765 43210",
    college: "NIT Calicut",
    year: "3rd Year",
    courseTitle: "Verilog HDL & RTL Design",
    courseSlug: "verilog-hdl-rtl-design",
    fee: "₹4,999",
    status: "pending",
    date: "17 Nov 2026",
    meetingLink: "https://meet.google.com/exsi-vlsi-live",
    materialsUrl: "https://drive.google.com/drive/folders/exsi-verilog-resources",
  },
  {
    id: "reg-demo-2",
    studentName: "Priya Nair",
    email: "priya.nair@cet.ac.in",
    phone: "+91 98123 45678",
    college: "CET Trivandrum",
    year: "4th Year",
    courseTitle: "ASIC & Semiconductor Fundamentals",
    courseSlug: "asic-semiconductor-fundamentals",
    fee: "₹3,999",
    status: "approved",
    date: "16 Nov 2026",
    meetingLink: "https://meet.google.com/exsi-vlsi-live",
    materialsUrl: "https://drive.google.com/drive/folders/exsi-verilog-resources",
  },
];

/**
 * Retrieve all registered students across the platform
 */
export function getAllRegistrations(): AdminRegistrationRecord[] {
  if (typeof window === "undefined") return DEFAULT_INITIAL_REGISTRATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_REGISTRATIONS));
      return DEFAULT_INITIAL_REGISTRATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_INITIAL_REGISTRATIONS;
  }
}

/**
 * Add a new student registration to the admin database
 */
export function saveNewRegistration(record: AdminRegistrationRecord): void {
  if (typeof window === "undefined") return;
  try {
    const all = getAllRegistrations();
    // Prepend new registration so it appears at the top of the admin table
    const updated = [record, ...all.filter((r) => r.id !== record.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also update student's personal account enrollment store
    const studentEmailKey = `exsi_enrollments_${record.email.toLowerCase().trim()}`;
    const rawStudent = localStorage.getItem(studentEmailKey);
    let studentEnrollments = rawStudent ? JSON.parse(rawStudent) : [];
    const exists = studentEnrollments.some((e: any) => e.courseSlug === record.courseSlug);
    if (!exists) {
      studentEnrollments.unshift({
        id: record.id,
        courseSlug: record.courseSlug,
        courseTitle: record.courseTitle,
        duration: "6 Weeks",
        fee: record.fee,
        batchStart: "Saturday & Sunday Batches",
        status: record.status,
        registeredAt: record.date,
        meetingLink: record.meetingLink,
        materialsUrl: record.materialsUrl,
        college: record.college,
        phone: record.phone,
        year: record.year,
      });
      localStorage.setItem(studentEmailKey, JSON.stringify(studentEnrollments));
    }
  } catch (err) {
    console.error("Failed to save registration:", err);
  }
}

/**
 * Update status (Approved / Rejected) and sync back to student dashboard
 */
export function updateRegistrationStatus(
  id: string,
  newStatus: "approved" | "rejected"
): AdminRegistrationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const all = getAllRegistrations();
    let targetEmail = "";
    let targetSlug = "";

    const updated = all.map((item) => {
      if (item.id === id) {
        targetEmail = item.email;
        targetSlug = item.courseSlug;
        return {
          ...item,
          status: newStatus,
          meetingLink:
            newStatus === "approved"
              ? item.meetingLink || "https://meet.google.com/exsi-vlsi-live"
              : undefined,
          materialsUrl:
            newStatus === "approved"
              ? item.materialsUrl || "https://drive.google.com/drive/folders/exsi-verilog-resources"
              : undefined,
        };
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Also update the student's personal dashboard store
    if (targetEmail) {
      const studentEmailKey = `exsi_enrollments_${targetEmail.toLowerCase().trim()}`;
      const raw = localStorage.getItem(studentEmailKey);
      if (raw) {
        const studentEnrollments = JSON.parse(raw);
        const updatedStudent = studentEnrollments.map((enr: any) => {
          if (enr.courseSlug === targetSlug || enr.id === id) {
            return {
              ...enr,
              status: newStatus,
              meetingLink:
                newStatus === "approved"
                  ? "https://meet.google.com/exsi-vlsi-live"
                  : undefined,
              materialsUrl:
                newStatus === "approved"
                  ? "https://drive.google.com/drive/folders/exsi-verilog-resources"
                  : undefined,
            };
          }
          return enr;
        });
        localStorage.setItem(studentEmailKey, JSON.stringify(updatedStudent));
      }
    }

    return updated;
  } catch {
    return [];
  }
}

/**
 * Delete a registration from admin
 */
export function deleteRegistration(id: string): AdminRegistrationRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const all = getAllRegistrations();
    const updated = all.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
