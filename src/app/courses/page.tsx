import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";
import { courses } from "@/config/courses";

export const metadata: Metadata = {
  title: "Verilog, RTL & Digital Design Projects",
  description: "A practical engineering programme covering Verilog HDL, RTL design, verification, and digital hardware projects.",
};

export default function CoursesPage() {
  return (
    <div className="py-16 md:py-20 bg-white">
      <div className="wrap">
        {/* Header */}
        <div className="max-w-[720px] mb-12">
          <span className="kicker">Course Catalog</span>
          <h1 className="text-[#0b1f45] font-semibold text-3xl sm:text-4xl mb-4">
            Verilog, RTL &amp; Digital Design Programme
          </h1>
          <p className="text-[#5b6e86] text-base sm:text-lg leading-relaxed">
            Hands-on learning for undergraduate students in ECE, EEE, and related fields. Build synthesizable digital designs, verification testbenches, and practical hardware projects.
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
          {courses.map((course) => (
            <div
              key={course.slug}
              className="flex flex-col border border-[#dde8f5] rounded-[24px] bg-white shadow-[0_4px_16px_rgba(18,38,63,0.04)] transition-all hover:shadow-[0_12px_34px_rgba(14,111,208,0.12)] hover:border-[#b5d6f3] overflow-hidden"
            >
              {/* Course Image Banner */}
              <div className="relative aspect-[16/9] w-full bg-[#f4f9ff]">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <span className="absolute top-4 right-4 py-1 px-3 rounded-full bg-white/95 backdrop-blur-sm text-[#0a58a8] text-[0.78rem] font-medium shadow-sm">
                  {course.level}
                </span>
              </div>

              <div className="flex flex-col flex-1 p-7 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#0b1f45] mb-2.5">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="hover:text-[#0e6fd0] transition-colors"
                  >
                    {course.title}
                  </Link>
                </h2>

                <p className="text-[#5b6e86] text-[0.95rem] leading-relaxed mb-6">
                  {course.shortDesc}
                </p>

                {/* Meta details */}
                <div className="space-y-2.5 py-4 border-y border-[#dde8f5] text-xs text-[#5b6e86] mb-6">
                  {course.duration && (
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#0e6fd0]" />
                      <span>Duration: {course.duration}</span>
                    </div>
                  )}
                  {course.batchStart && <div className="flex items-center gap-2"><Calendar size={14} className="text-[#0e6fd0]" /><span>Batch: {course.batchStart}</span></div>}
                </div>

                {/* Highlights */}
                <div className="mb-6 flex-1">
                  <span className="block text-xs font-semibold text-[#0b1f45] uppercase tracking-wider mb-3">
                    Key Topics:
                  </span>
                  <ul className="space-y-2 text-xs text-[#5b6e86]">
                    {course.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-[#0a58a8] shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-[#dde8f5] flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-[#5b6e86] uppercase tracking-wider block">
                      Tuition Fee
                    </span>
                    <span className="text-sm font-semibold text-[#0b1f45]">Fee on enquiry</span>
                  </div>

                  <Link
                    href={`/courses/${course.slug}`}
                    className="btn btn-primary !py-2.5 !px-5 text-xs font-semibold"
                  >
                    {course.enquiryOnly ? "View Programme" : "Register for Course"} &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Notice Strip */}
        <div className="mt-12 p-6 rounded-[16px] bg-[#e8f4fd] border border-[#d3eafb] text-sm text-[#1f4a7a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <strong className="block font-semibold">Programme enquiries:</strong>
            <span className="text-xs sm:text-sm">
              Contact the EXSI team to confirm current availability, schedule, and fee.
            </span>
          </div>
          <Link
            href="/#contact"
            className="btn btn-outline text-xs whitespace-nowrap self-start sm:self-auto"
          >
            Ask a Question
          </Link>
        </div>
      </div>
    </div>
  );
}
