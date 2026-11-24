import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "EXSi Technologies terms and conditions for educational programmes.",
};

export default function TermsPage() {
  return (
    <div className="bg-white text-[#14243a] min-h-screen">
      <section
        className="py-14 text-white"
        style={{
          background: "linear-gradient(125deg, #06152b 0%, #0a294c 58%, #073b68 100%)",
        }}
      >
        <div className="w-[min(900px,calc(100%-32px))] mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Service</h1>
          <p className="text-xs text-slate-300 mt-2">Last updated: November 2026</p>
        </div>
      </section>

      <div className="w-[min(900px,calc(100%-32px))] mx-auto py-12 space-y-8 text-sm text-slate-700 leading-relaxed">
        <section className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#071a33] mb-2">1. Programme Enrolment</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Submitting a course registration reserves your seat in the batch with a status of &apos;Pending&apos;. Your enrolment is confirmed once the offline course fee is coordinated and verified by the EXSi team.
          </p>
        </section>

        <section className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#071a33] mb-2">2. Intellectual Property</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            All curriculum materials, course notes, presentations, and exercise specifications are the intellectual property of {siteConfig.name}. Students retain full ownership of their original capstone design code.
          </p>
        </section>

        <section className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#071a33] mb-2">3. Governing Law</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            These terms are governed by the laws of India. Any legal disputes shall be subject to the jurisdiction of courts in {siteConfig.state}, India.
          </p>
        </section>
      </div>
    </div>
  );
}
