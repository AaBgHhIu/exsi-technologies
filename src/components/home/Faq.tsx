"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "Who are EXSI courses designed for?",
    a: "Our courses are designed for college students in ECE, EEE, and CSE streams who want to build practical skills in digital hardware design, synthesizable Verilog HDL, and semiconductor fundamentals.",
  },
  {
    q: "Are the classes online or offline?",
    a: "Classes are conducted as live online sessions via Google Meet on weekends. Session schedules and meeting links are shared through your student dashboard after your registration is reviewed.",
  },
  {
    q: "How do I pay the course fee?",
    a: "Please contact the EXSI team to confirm the current programme fee and payment options. Enrolment details are shared during the enquiry process.",
  },
  {
    q: "Will I get a certificate?",
    a: "Yes. A course completion certificate is issued to students who complete the scheduled sessions, hands-on lab exercises, and the mini project.",
  },
  {
    q: "What if my registration is rejected?",
    a: "We will reach out to explain the reason. Once resolved, you are welcome to register again for the subsequent batch.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-14 sm:py-16 md:py-20 bg-white border-t border-[#dde8f5]">
      <div className="wrap max-w-[800px]">
        <div className="text-center mb-12">
          <span className="kicker">FAQ</span>
          <h2 className="text-[#0b1f45] font-semibold leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[#5b6e86] text-[1.05rem] mt-3">
            Common questions about course format, admissions, and programme details.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="border border-[#dde8f5] rounded-[16px] overflow-hidden bg-white"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-[#0b1f45] text-base hover:text-[#0e6fd0] transition-colors"
                aria-expanded={open === i}
              >
                <span>{f.q}</span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "text-[#5b6e86] transition-transform duration-200 shrink-0",
                    open === i && "rotate-180 text-[#0e6fd0]"
                  )}
                />
              </button>
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
                aria-hidden={open !== i}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 text-sm text-[#5b6e86] leading-relaxed border-t border-[#f1f5f9] pt-3">
                    {f.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
