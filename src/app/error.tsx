"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl grid place-items-center mb-5 text-2xl bg-red-50 text-red-500 border border-red-200">
        !
      </div>
      <h2 className="text-brand-navy text-2xl font-black mb-2">Something went wrong</h2>
      <p className="text-[#63748a] mb-6 max-w-sm">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-full text-white font-bold"
        style={{ background: "linear-gradient(110deg,#0878d1,#0755a3)" }}
      >
        Try again
      </button>
    </div>
  );
}
