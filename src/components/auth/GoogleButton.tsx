"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              type?: "standard" | "icon";
              shape?: "rectangular" | "pill" | "circle" | "square";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              width?: number;
              logo_alignment?: "left" | "center";
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export function GoogleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

interface GoogleButtonProps {
  onClick?: () => void;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "outline";
}

export function GoogleButton({
  onClick,
  label = "Sign in with Google",
  loading = false,
  disabled = false,
  className = "",
  variant = "outline",
}: GoogleButtonProps) {
  const { signInWithGoogleCredential, signInWithGoogle, hasRealGoogleConfigured } = useAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [gisLoaded, setGisLoaded] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Initialize official Google Identity Services if Client ID exists
  useEffect(() => {
    if (typeof window === "undefined" || !clientId || clientId.includes("your-google-client-id")) {
      return;
    }

    function initGis() {
      if (window.google?.accounts?.id && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId as string,
          callback: (response) => {
            if (response.credential) {
              signInWithGoogleCredential(response.credential);
            }
          },
        });

        // Render official Google button inside the container
        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "pill",
          text: "continue_with",
          width: 320,
          logo_alignment: "left",
        });

        setGisLoaded(true);
      }
    }

    if (window.google?.accounts?.id) {
      initGis();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGis();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [clientId, signInWithGoogleCredential]);

  const baseStyles =
    "w-full inline-flex items-center justify-center gap-3 py-3 px-5 rounded-full font-semibold text-sm transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

  const variantStyles =
    variant === "primary"
      ? "bg-[#0e6fd0] text-white hover:bg-[#0a58a8] border border-transparent shadow-[0_8px_20px_rgba(14,111,208,0.25)]"
      : "bg-white text-[#0b1f45] border border-[#cfdef2] hover:bg-[#f5f9ff] hover:border-[#b5d6f3] hover:shadow-md";

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          setGisLoaded(true);
        }}
      />

      {/* If official GIS rendered button is available, show it */}
      {clientId && !clientId.includes("your-google-client-id") ? (
        <div className="flex flex-col items-center justify-center w-full">
          <div ref={buttonRef} className="w-full flex justify-center min-h-[44px]" />
        </div>
      ) : (
        <button
          type="button"
          onClick={onClick || (() => signInWithGoogle())}
          disabled={disabled || loading}
          className={`${baseStyles} ${variantStyles} ${className}`}
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-[#0e6fd0] border-t-transparent rounded-full animate-spin" />
          ) : (
            <GoogleIcon className="w-5 h-5 shrink-0" />
          )}
          <span>{loading ? "Connecting Google..." : label}</span>
        </button>
      )}
    </>
  );
}
