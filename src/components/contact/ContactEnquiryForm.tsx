"use client";

import { useState } from "react";
import { sendEnquiry } from "@/lib/enquiries";

export function ContactEnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "Course enquiry",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 text-xs font-semibold text-[#41546b]"
      >
        <div>
          <label className="block mb-1.5">Full name</label>
          <input
            name="name"
            type="text"
            required
            maxLength={120}
            placeholder="Your name"
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] placeholder:text-slate-400 focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
          />
        </div>

        <div>
          <label className="block mb-1.5">Email address</label>
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] placeholder:text-slate-400 focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
          />
        </div>

        <div>
          <label className="block mb-1.5">I am interested in</label>
          <select
            value={formData.interest}
            onChange={(event) => setFormData({ ...formData, interest: event.target.value })}
            className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] bg-white focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
          >
            <option>Course enquiry</option>
            <option>Workshop / institutional collaboration</option>
            <option>Engineering services</option>
            <option>General enquiry</option>
          </select>
        </div>

        <div>
          <label className="block mb-1.5">Message</label>
          <textarea
            required
            maxLength={4000}
            rows={4}
            placeholder="How can we help?"
            value={formData.message}
            onChange={(event) => setFormData({ ...formData, message: event.target.value })}
            className="w-full rounded-xl border border-[#cfdae5] px-4 py-3 text-sm text-[#071a33] placeholder:text-slate-400 focus:outline-none focus:border-[#0878d1] focus:ring-1 focus:ring-[#0878d1] transition"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-6 rounded-full text-xs font-bold text-white transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2 shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: "linear-gradient(110deg, #0878d1 0%, #0755a3 100%)" }}
        >
          {isSubmitting ? "Sending..." : "Send enquiry →"}
        </button>
      </form>
      {status && (
        <p className={`mt-3 text-xs ${hasError ? "text-red-600" : "text-emerald-700"}`} role={hasError ? "alert" : "status"}>
          {status}
        </p>
      )}
    </>
  );
}
