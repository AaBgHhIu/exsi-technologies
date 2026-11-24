import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "EXSi Technologies student privacy policy and data protection guidelines.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white text-[#14243a] min-h-screen">
      <section
        className="py-14 text-white"
        style={{
          background: "linear-gradient(125deg, #06152b 0%, #0a294c 58%, #073b68 100%)",
        }}
      >
        <div className="w-[min(900px,calc(100%-32px))] mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-300 mt-2">Last updated: November 2026</p>
        </div>
      </section>

      <div className="w-[min(900px,calc(100%-32px))] mx-auto py-12 space-y-8 text-sm text-slate-700 leading-relaxed">
        <section className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#071a33] mb-2">1. Information We Collect</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            When you register for a course, submit feedback, or request a project quote, we collect the details you provide, such as your name, email address, phone number, college, year of study, and message. Current programme fees and payment options are confirmed during enquiry. If online checkout is enabled, Razorpay processes the payment; EXSI does not store payment card details. We do not sell personal data. Service providers may process information to support hosting, authentication, or payment where configured.
          </p>
        </section>

        <section className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#071a33] mb-2">2. How We Use Student Data</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Your details are used to process course registrations, communicate offline payment instructions, grant verified access to live Google Meet sessions, and issue course completion certificates. We never sell or share student data with third parties.
          </p>
        </section>

        <section className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#071a33] mb-2">3. Data Security &amp; Row-Level Security</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Where Supabase is configured, student records are stored in PostgreSQL with Row-Level Security (RLS) policies so students can access only their own profile and registration data. In local or unconfigured environments, some demo data may be stored in the browser and will not sync between devices. Feedback is available only to EXSI administrators; shared storage requires the feedback database configuration to be applied.
          </p>
        </section>

        <section className="bg-[#f8fafc] rounded-2xl p-6 border border-[#e2e8f0]">
          <h2 className="text-base font-bold text-[#071a33] mb-2">4. Contact For Privacy Requests</h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            If you have questions regarding your data or wish to update your records, please contact us at{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-[#0878d1] font-semibold hover:underline">
              {siteConfig.email}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
