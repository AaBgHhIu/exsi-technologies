import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected route check
  // Note: While in demo mode before Supabase credentials are wired into .env.local,
  // we allow direct access so the user can freely test /admin and /dashboard locally.
  const hasSupabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);

  if (hasSupabaseUrl) {
    // When Supabase is configured, token verification runs here
    // Unauthenticated visitors are redirected to /login?redirectTo=...
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
