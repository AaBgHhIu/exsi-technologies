"use client";

import Image from "next/image";
import { Clock, Laptop, Calendar, ArrowDown } from "lucide-react";

interface CourseEnrollCardProps {
  courseTitle: string;
  courseSlug: string;
  image?: string;
  fee: string;
  duration: string;
  mode: string;
  batchStart: string;
}

export default function CourseEnrollCard({
  courseTitle,
  courseSlug,
  image,
  fee,
  duration,
  mode,
  batchStart,
}: CourseEnrollCardProps) {
  const scrollToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById("register-section");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="lg:sticky lg:top-24 bg-white border border-[#dde8f5] rounded-[24px] shadow-sm text-[#0b1f45] overflow-hidden">
      {image && (
        <div className="relative aspect-[16/9] w-full bg-[#f5f9ff]">
          <Image
            src={image}
            alt={courseTitle}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 360px"
          />
        </div>
      )}

      <div className="p-7">
        <div className="mb-5 pb-5 border-b border-[#f1f5f9]">
          <span className="text-[11px] font-semibold text-[#5b6e86] uppercase tracking-wider block mb-1">
            Tuition Fee
          </span>
          <div className="text-3xl sm:text-4xl font-bold text-[#0b1f45]">{fee}</div>
          <p className="text-xs text-[#5b6e86] mt-1.5 leading-relaxed">
            Instant online enrollment via Razorpay (UPI, Credit/Debit Cards, NetBanking).
          </p>
        </div>

        <div className="space-y-3.5 mb-6 text-xs text-[#5b6e86]">
          <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
            <span className="flex items-center gap-2 font-medium">
              <Clock size={15} className="text-[#0e6fd0]" /> Duration
            </span>
            <span className="font-semibold text-[#0b1f45]">{duration}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
            <span className="flex items-center gap-2 font-medium">
              <Laptop size={15} className="text-[#0e6fd0]" /> Delivery Mode
            </span>
            <span className="font-semibold text-[#0b1f45]">{mode}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <Calendar size={15} className="text-[#0e6fd0]" /> Batch Schedule
            </span>
            <span className="font-semibold text-[#0b1f45]">{batchStart}</span>
          </div>
        </div>

        {/* Button to scroll down to register */}
        <a
          href="#register-section"
          onClick={scrollToRegister}
          className="btn btn-primary w-full text-center text-xs font-semibold !py-3.5 flex items-center justify-center gap-2 mb-3"
        >
          Register for this Course <ArrowDown size={14} />
        </a>

        <p className="text-center text-[11px] text-[#5b6e86] leading-relaxed">
          Scrolls down to enroll. Seat is <strong>auto-approved</strong> immediately upon successful payment.
        </p>
      </div>
    </aside>
  );
}
