"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, KeyRound } from "lucide-react";
import { useAuth, checkIsAdmin } from "@/context/AuthContext";
import { GoogleButton } from "@/components/auth/GoogleButton";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const {
    user,
    signInWithGoogle,
    hasRealGoogleConfigured,
    loading: authLoading,
  } = useAuth();

  const [showConfigGuide, setShowConfigGuide] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");

  // If already logged in, redirect to admin if admin, else dashboard
  if (user) {
    if (checkIsAdmin(user.email) && !searchParams.get("redirect")) {
      router.replace("/admin");
    } else {
      router.replace(redirectTarget);
    }
    return null;
  }

  async function handleGoogleLogin() {
    setIsSubmitting(true);
    setAuthError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setAuthError(
        err instanceof Error ? err.message : "Could not start Google sign-in. Please try again."
      );
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 bg-[#f5f9ff]">
      <div className="w-full max-w-md bg-white rounded-[24px] border border-[#dde8f5] p-8 sm:p-10 shadow-[0_12px_34px_rgba(14,111,208,0.08)]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <Image
              src="/images/logo.svg"
              alt="EXSI Technologies"
              width={160}
              height={50}
              priority
              className="h-[44px] w-auto mx-auto object-contain"
            />
          </Link>
          <span className="inline-block py-1 px-3 rounded-full bg-[#e8f4fd] text-[#0a58a8] text-xs font-semibold mb-2">
            Student & Learner Portal
          </span>
          <h1 className="text-2xl sm:text-[1.7rem] font-bold text-[#0b1f45] tracking-tight">
            Sign In with Google
          </h1>
          <p className="text-sm text-[#5b6e86] mt-2 leading-relaxed">
            Sign in with your Google account to view your registered courses, batch schedule, and classroom access.
          </p>
        </div>

        {/* Supabase Google sign-in setup */}
        {!hasRealGoogleConfigured && (
          <div className="mb-6 p-4 rounded-xl bg-[#fffbeb] border border-[#fef3c7] text-xs">
            <div className="flex items-start gap-2 text-amber-900 font-semibold mb-1">
              <KeyRound size={15} className="shrink-0 text-amber-600 mt-0.5" />
              <span>Google sign-in setup required:</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Connect Supabase and enable Google under Authentication &rarr; Sign In / Providers.
            </p>
            <button
              type="button"
              onClick={() => setShowConfigGuide(!showConfigGuide)}
              className="mt-2 text-[#0e6fd0] font-semibold underline hover:text-[#0a58a8]"
            >
              {showConfigGuide ? "Hide setup instructions" : "Click here for setup instructions &rarr;"}
            </button>

            {showConfigGuide && (
              <div className="mt-3 pt-3 border-t border-[#fde68a] space-y-2 text-[11px] text-amber-900">
                <p>1. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</p>
                <p>2. Add your Google OAuth client ID and secret in Supabase&apos;s Google provider settings.</p>
                <p>3. Allow your site URL and <code>/auth/callback</code> in Supabase Auth URL settings.</p>
              </div>
            )}
          </div>
        )}

        {/* Google Sign-In Action */}
        <div className="space-y-4 mb-6">
          <GoogleButton
            onClick={handleGoogleLogin}
            loading={isSubmitting || authLoading}
            label="Continue with Google"
            className="text-[0.95rem] py-3.5"
          />
          {authError && (
            <p role="alert" className="text-center text-sm text-red-600">
              {authError}
            </p>
          )}
        </div>

        {/* Features preview */}
        <div className="mt-8 pt-6 border-t border-[#dde8f5] space-y-2 text-xs text-[#5b6e86]">
          <div className="flex items-center gap-2 text-[#0b1f45] font-medium">
            <CheckCircle2 size={14} className="text-[#0e6fd0] shrink-0" />
            <span>View all your registered courses & live status</span>
          </div>
          <div className="flex items-center gap-2 text-[#0b1f45] font-medium">
            <CheckCircle2 size={14} className="text-[#0e6fd0] shrink-0" />
            <span>Instant 1-click registration using Google account</span>
          </div>
          <div className="flex items-center gap-2 text-[#0b1f45] font-medium">
            <CheckCircle2 size={14} className="text-[#0e6fd0] shrink-0" />
            <span>Access Google Meet links & course materials</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-[#5b6e86]">
          Looking for courses?{" "}
          <Link href="/courses" className="text-[#0e6fd0] font-semibold hover:underline">
            Browse Course Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
