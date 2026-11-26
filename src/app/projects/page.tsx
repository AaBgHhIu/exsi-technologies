"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { sendEnquiry } from "@/lib/enquiries";

const services = [
  {
    title: "Technical Training & Workshops",
    desc: "Structured learning programmes in digital design, Verilog HDL, RTL architecture, and semiconductor fundamentals.",
    status: "Initial focus",
  },
  {
    title: "Project-Based Learning",
    desc: "Guided hardware exercises, communication peripheral modules, and practical testbenches that help learners build verifiable skills.",
    status: "Learning approach",
  },
  {
    title: "Engineering Services & R&D",
    desc: "Developing technical capabilities in custom digital hardware design, FPGA prototype bring-up, and technology problem solving.",
    status: "Developing Focus",
  },
];

export default function ProjectsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (formData.get("website")) return;
    setIsSubmitting(true);
    setFormStatus("");
    setSubmitError(false);
    try {
      await sendEnquiry({
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        interest: "Project quote request",
        message: String(formData.get("project_idea") || ""),
        phone: String(formData.get("phone") || ""),
        budget: String(formData.get("budget") || ""),
        website: String(formData.get("website") || ""),
      });
      setFormStatus("Your project enquiry has been sent to the EXSI team. We will get back to you soon.");
      setSubmitted(true);
    } catch (error) {
      setSubmitError(true);
      setFormStatus(error instanceof Error ? error.message : "We could not send your enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const whatsappMessage = encodeURIComponent(
    "Hi EXSi Technologies team, I would like to discuss a project / course inquiry."
  );
  const whatsappUrl = /^\d{10,15}$/.test(siteConfig.whatsappNumber)
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMessage}`
    : null;

  return (
    <div className="bg-white text-[#14243a] min-h-screen">
      {/* Header Banner */}
      <section
        className="py-16 md:py-20 text-white"
        style={{
          background: "linear-gradient(125deg, #06152b 0%, #0a294c 58%, #073b68 100%)",
        }}
      >
        <div className="w-[min(1140px,calc(100%-32px))] mx-auto">
          <div className="text-xs font-bold tracking-[0.16em] text-[#8fe4ff] uppercase mb-2">
            What We Do &bull; EXSi Technologies
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Focused on skills. Connected to industry.
          </h1>
          <p className="text-[#c4d5e7] text-base sm:text-lg max-w-2xl mt-3 leading-relaxed">
            Our planned activities bring together technical semiconductor education, hands-on RTL engineering, and collaborative project building.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="w-[min(1140px,calc(100%-32px))] mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {services.map((s, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-7 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f5f9] text-[#475569] uppercase mb-4">
                    {s.status}
                  </div>
                  <h2 className="text-xl font-bold text-[#071a33] mb-2 leading-snug">
                    {s.title}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quote Request Form */}
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-xs font-bold tracking-[0.16em] text-[#0878d1] uppercase mb-2">
                Work With Us
              </div>
              <h2 className="text-3xl font-extrabold text-[#071a33] tracking-tight mb-2">
                Request a Project Quote
              </h2>
              <p className="text-slate-500 text-sm">
                Describe your project, academic collaboration, or engineering idea below.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl bg-white border border-[#e2e8f0] p-8 md:p-10 text-center shadow-md animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-[#071a33] mb-2">Enquiry sent</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed mb-6">
                  {formStatus}
                </p>
                {whatsappUrl && <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  <MessageSquare size={14} /> Chat on WhatsApp
                </a>}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-7 md:p-9 shadow-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Honeypot field */}
                  <div aria-hidden="true" className="hidden">
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#071a33] uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="name"
                        type="text"
                        required
                        placeholder="Your name"
                        className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] placeholder:text-slate-400 focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#071a33] uppercase tracking-wider mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="you@institution.edu"
                        className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] placeholder:text-slate-400 focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#071a33] uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="Your phone number"
                        className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] placeholder:text-slate-400 focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#071a33] uppercase tracking-wider mb-1.5">
                        Estimated Budget
                      </label>
                      <select
                        name="budget"
                        className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] bg-white focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
                      >
                        <option value="Under 25K">Under ₹25,000</option>
                        <option value="25K - 50K">₹25,000 - ₹50,000</option>
                        <option value="50K - 1 Lakh">₹50,000 - ₹1,00,000</option>
                        <option value="1 Lakh+">₹1,00,000+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#071a33] uppercase tracking-wider mb-1.5">
                      Project Specification <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="project_idea"
                      required
                      rows={4}
                      placeholder="Describe your design specifications, requirements, or deadlines..."
                      className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] placeholder:text-slate-400 focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 py-3.5 px-6 rounded-full text-xs font-bold text-white transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      style={{
                        background: "linear-gradient(110deg, #0878d1 0%, #065ea3 100%)",
                      }}
                    >
                      {isSubmitting ? "Sending..." : "Send Enquiry →"}
                    </button>
                    {whatsappUrl && <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto py-3.5 px-6 rounded-full text-xs font-bold text-emerald-700 border border-emerald-300 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={14} /> WhatsApp Us
                    </a>}
                  </div>
                  {submitError && formStatus && (
                    <p className="text-sm text-red-600" role="alert">
                      {formStatus}
                    </p>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
