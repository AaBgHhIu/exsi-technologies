import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET() {
  const supabase = createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: "Sign in to export registrations." }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return NextResponse.json({ error: "Could not verify administrator access." }, { status: 500 });
  }
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Administrator access is required." }, { status: 403 });
  }

  const { data: enrollments, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("student_name,email,phone,college,year,status,created_at,courses!inner(title)")
    .order("created_at", { ascending: false });

  if (enrollmentError) {
    return NextResponse.json({ error: "Could not load registrations for export." }, { status: 500 });
  }

  const headers = [
    "Course",
    "Student Name",
    "Email",
    "Phone",
    "College",
    "Year",
    "Status",
    "Date",
  ];
  const rows = (enrollments || []).map((enrollment) => {
    const course = Array.isArray(enrollment.courses)
      ? enrollment.courses[0]
      : enrollment.courses;
    return [
      course?.title || "",
      enrollment.student_name,
      enrollment.email,
      enrollment.phone,
      enrollment.college,
      enrollment.year,
      enrollment.status,
      new Date(enrollment.created_at).toLocaleDateString("en-IN"),
    ]
      .map(csvCell)
      .join(",");
  });
  const csvContent = [headers.map(csvCell).join(","), ...rows].join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="exsi-registrations-${Date.now()}.csv"`,
    },
  });
}
