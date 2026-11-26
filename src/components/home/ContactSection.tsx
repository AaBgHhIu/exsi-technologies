"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { sendEnquiry } from "@/lib/enquiries";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "Course enquiry",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");
    setHasError(false);
    try {
      await sendEnquiry(formData);
      setStatus("Your enquiry has been sent to the EXSI team. We will get back to you soon.");
      setFormData({ name: "", email: "", interest: "Course enquiry", message: "" });
    } catch (error) {
      setHasError(true);
      setStatus(error instanceof Error ? error.message : "We could not send your enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="py-14 sm:py-16 md:py-20 bg-[#f5f9ff] scroll-mt-20">
      <div className="wrap">
        <div className="max-w-[640px] mb-12">
          <span className="kicker">Get in touch</span>
          <h2 className="text-[#0b1f45] font-semibold leading-tight">
            Let&apos;s start a conversation.
          </h2>
          <p className="text-[#5b6e86] text-[1.05rem] mt-4">
            For course enquiries, collaborations, workshops or engineering discussions, contact the EXSI team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-7 items-start">
          {/* Info Card */}
          <div
            className="p-6 sm:p-8 rounded-[16px] text-white"
            style={{
              background: "linear-gradient(150deg, #051b4b, #0a58a8)",
            }}
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-white">
              Contact EXSI
            </h3>
            <p className="text-[#e0edff] text-[0.95rem] leading-relaxed mt-3 mb-6">
              We would be glad to hear from students, institutions, engineers and potential collaborators.
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3.5">
                <b className="flex-none w-9 h-9 grid place-items-center rounded-[10px] bg-white/20 text-white font-normal text-base">
                  ✉
                </b>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:underline text-white font-medium"
                >
                  {siteConfig.email}
                </a>
              </div>

              {siteConfig.phone && (
                <div className="flex items-center gap-3.5">
                  <b className="flex-none w-9 h-9 grid place-items-center rounded-[10px] bg-white/20 text-white font-normal text-base">☎</b>
                  <a href={`tel:${siteConfig.phone}`} className="hover:underline text-white font-medium">{siteConfig.phone}</a>
                </div>
              )}

              {siteConfig.linkedIn && <div className="flex items-center gap-3.5">
                <b className="flex-none w-9 h-9 grid place-items-center rounded-[10px] bg-white/20 text-white font-normal text-base">
                  ⌖
                </b>
                <span className="text-white font-medium">Kerala, India</span>
              </div>}

              <div className="flex items-center gap-3.5">
                <b className="flex-none w-9 h-9 grid place-items-center rounded-[10px] bg-white/20 text-white font-normal text-base">
                  in
                </b>
                <a
                  href={siteConfig.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-white font-medium"
                >
                  LinkedIn: EXSi Technologies
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-[16px] bg-white border border-[#dde8f5] shadow-[0_12px_34px_rgba(14,111,208,0.12)]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
              <div>
                <label className="block font-medium text-[0.86rem] text-[#0b1f45] mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-[12px_14px] border-[1.5px] border-[#cfdef2] rounded-[12px] bg-white text-[#0b1f45] text-sm focus:border-[#0e6fd0] focus:outline-none focus:ring-4 focus:ring-[#0e6fd0]/15"
                />
              </div>

              <div>
                <label className="block font-medium text-[0.86rem] text-[#0b1f45] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-[12px_14px] border-[1.5px] border-[#cfdef2] rounded-[12px] bg-white text-[#0b1f45] text-sm focus:border-[#0e6fd0] focus:outline-none focus:ring-4 focus:ring-[#0e6fd0]/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-[0.86rem] text-[#0b1f45] mb-1.5">
                  I am interested in
                </label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                  className="w-full p-[12px_14px] border-[1.5px] border-[#cfdef2] rounded-[12px] bg-white text-[#0b1f45] text-sm focus:border-[#0e6fd0] focus:outline-none focus:ring-4 focus:ring-[#0e6fd0]/15"
                >
                  <option>Course enquiry</option>
                  <option>Workshop / institutional collaboration</option>
                  <option>Engineering services</option>
                  <option>General enquiry</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-[0.86rem] text-[#0b1f45] mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-[12px_14px] border-[1.5px] border-[#cfdef2] rounded-[12px] bg-white text-[#0b1f45] text-sm min-h-[120px] focus:border-[#0e6fd0] focus:outline-none focus:ring-4 focus:ring-[#0e6fd0]/15"
                />
              </div>

              <div className="sm:col-span-2">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send enquiry"}
                </button>
                {status && (
                  <p
                    className={`mt-2.5 text-sm font-medium ${hasError ? "text-red-600" : "text-[#0a58a8]"}`}
                    role={hasError ? "alert" : "status"}
                  >
                    {status}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        <p className="mt-5 text-[0.88rem] text-[#5b6e86]">
          You can also contact us directly at {siteConfig.email}.
        </p>
      </div>
    </section>
  );
}
