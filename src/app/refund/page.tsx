import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "EXSi Technologies refund and cancellation terms.",
};

export default function RefundPage() {
  return (
    <div className="bg-white text-[#14243a] min-h-screen">
      <section
        className="py-14 text-white"
        style={{
          background: "linear-gradient(125deg, #06152b 0%, #0a294c 58%, #073b68 100%)",
        }}
      >
        <div className="w-[min(900px,calc(100%-32px))] mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Refund Policy</h1>
          <p className="text-xs text-slate-300 mt-2">Last updated: November 2026</p>
        </div>
      </section>

      <div className="w-[min(900px,calc(100%-32px))] mx-auto py-12 space-y-8 text-sm text-slate-700 leading-relaxed">
        <section className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#071a33] mb-2">1. Online Fee Payment</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Tuition fees for EXSi Technologies programmes are processed securely online through Razorpay (supporting UPI, Credit/Debit Cards, and NetBanking).
          </p>
        </section>

        <section className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#071a33] mb-2">2. Cancellation Prior to Batch Start</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            If an enrolled student requests cancellation at least 48 hours prior to the first scheduled live lecture, a full refund of the fee paid will be processed via direct bank transfer or UPI within 5-7 business days.
          </p>
        </section>

        <section className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#071a33] mb-2">3. Post-Commencement Policy</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Once live lectures have commenced and private classroom links are issued, tuition payments become non-refundable. Students with genuine medical or academic emergencies may request a seat transfer to the next available batch.
          </p>
        </section>
      </div>
    </div>
  );
}
