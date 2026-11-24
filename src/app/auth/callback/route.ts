import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");

  if (code) {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.session?.user) {
        const email = (data.session.user.email || "").toLowerCase().trim();
        const adminList = ["tbabhimanue06@gmail.com", "tbabhimanue6@gmail.com", "basilthankachan274@gmail.com", "admin@exsitechnologies.com"];
        const isAdmin = adminList.includes(email) || email.includes("tbabhimanue");
        const destination = requestedNext || (isAdmin ? "/admin" : "/dashboard");
        return NextResponse.redirect(`${origin}${destination}`);
      }
    }
  }

  // Return the user to an error page or back to login
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
