import Link from "next/link";
import { ArrowLeft, BookOpen, Home } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#f8fafc] py-16">
      <div className="w-full max-w-md bg-white border border-[#dce6ef] rounded-3xl p-8 sm:p-10 shadow-sm text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#0878d1] bg-[#eef7fd] border border-[#d2ebfc] mb-5">
          <span>Error 404</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#071a33] tracking-tight mb-3">
          Page Not Found
        </h1>

        <p className="text-sm text-[#556982] leading-relaxed mb-8">
          The page you are looking for doesn&apos;t exist or has been moved. Explore our VLSI courses or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm font-semibold">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white transition-all shadow-sm"
            style={{ background: "linear-gradient(110deg,#0878d1,#0755a3)" }}
          >
            <Home size={16} /> Go Home
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[#071a33] bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#dce6ef] transition-colors"
          >
            <BookOpen size={16} /> View Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
