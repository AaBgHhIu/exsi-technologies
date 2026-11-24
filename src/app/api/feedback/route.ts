import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = [
  "tbabhimanue06@gmail.com",
  "tbabhimanue6@gmail.com",
  "basilthankachan274@gmail.com",
  "admin@exsitechnologies.com",
];

export async function GET() {
  const supabase = createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Feedback storage is not configured." }, { status: 503 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user?.email) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  if (!ADMIN_EMAILS.includes(user.email.toLowerCase().trim())) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("student_feedback")
    .select("id, quote, author, note, rating, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load student feedback:", error.message);
    return NextResponse.json({ error: "Could not load feedback." }, { status: 500 });
  }

  return NextResponse.json(
    data.map((item) => ({
      id: item.id,
      quote: item.quote,
      author: item.author,
      note: item.note,
      rating: item.rating,
      createdAt: item.created_at,
    }))
  );
}

export async function POST(request: Request) {
  let payload: { quote?: unknown; author?: unknown; note?: unknown; rating?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const quote = typeof payload.quote === "string" ? payload.quote.trim() : "";
  const author = typeof payload.author === "string" ? payload.author.trim() : "";
  const note = typeof payload.note === "string" ? payload.note.trim() : "";
  const rating = Number(payload.rating);

  if (!quote || quote.length > 3000 || !author || author.length > 120 || note.length > 160 || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Feedback details are invalid." }, { status: 400 });
  }

  const supabase = createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Feedback storage is not configured." }, { status: 503 });
  }

  const { error } = await supabase.from("student_feedback").insert({ quote, author, note, rating });
  if (error) {
    console.error("Failed to save student feedback:", error.message);
    return NextResponse.json({ error: "Could not save feedback." }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}