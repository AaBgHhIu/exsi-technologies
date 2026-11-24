import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  // If Supabase is connected, query real data; otherwise provide sample export
  let rows: string[][] = [];

  if (supabase) {
    const { data: enrollments } = await supabase
      .from("enrollments")
      .select(`
        id,
        status,
        created_at,
        profiles (full_name, email, phone, college, year),
        courses (title, fee)
      `)
      .order("created_at", { ascending: false });

    if (enrollments && enrollments.length > 0) {
      rows = enrollments.map((e: any) => [
        `"${e.courses?.title || "N/A"}"`,
        `"${e.profiles?.full_name || "N/A"}"`,
        `"${e.profiles?.email || "N/A"}"`,
        `"${e.profiles?.phone || "N/A"}"`,
        `"${e.profiles?.college || "N/A"}"`,
        `"${e.profiles?.year || "N/A"}"`,
        `"${e.status}"`,
        `"${new Date(e.created_at).toLocaleDateString("en-IN")}"`,
      ]);
    }
  }

  // Fallback demo data if no records exist yet
  if (rows.length === 0) {
    rows = [
      ['"Verilog HDL & RTL Design"', '"Rahul Sharma"', '"rahul@nitc.edu"', '"+91 9876543210"', '"NIT Calicut"', '"3rd Year"', '"pending"', '"17 Nov 2026"'],
      ['"ASIC & Semiconductor Fundamentals"', '"Priya Nair"', '"priya@cet.ac.in"', '"+91 9812345678"', '"CET Trivandrum"', '"4th Year"', '"approved"', '"16 Nov 2026"'],
      ['"Digital Design & FPGA Projects"', '"Anand Kumar"', '"anand@gect.ac.in"', '"+91 9456781234"', '"GEC Thrissur"', '"2nd Year"', '"pending"', '"15 Nov 2026"'],
    ];
  }

  const headers = ["Course", "Student Name", "Email", "Phone", "College", "Year", "Status", "Date"];
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="exsi-registrations-${Date.now()}.csv"`,
    },
  });
}
