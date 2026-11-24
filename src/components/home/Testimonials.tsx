"use client";

import { useState } from "react";
import { Send, CheckCircle2, Star } from "lucide-react";
import { saveFeedback } from "@/lib/feedback";

export function Testimonials() {
  const [form, setForm] = useState({ quote: "", author: "", note: "", rating: 5 });
  const [submitted, setSubmitted] = useState<"shared" | "local" | null>(null);
  const [submitError, setSubmitError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.quote.trim() || !form.author.trim()) return;
    const saved = await saveFeedback({
      id: `feedback-${Date.now()}`,
      quote: form.quote.trim(),
      author: form.author.trim(),
      note: form.note.trim(),
      rating: form.rating,
      createdAt: new Date().toISOString(),
    });
    if (!saved) {
      setSubmitError(true);
      return;
    }
    setForm({ quote: "", author: "", note: "", rating: 5 });
    setSubmitError(false);
    setSubmitted(saved);
    setTimeout(() => setSubmitted(null), 6000);
  }

  return (
    <section id="feedback" className="py-14 sm:py-16 md:py-20 bg-white scroll-mt-20">
      <div className="wrap">
        <div className="max-w-[640px] mb-12">
          <span className="kicker">Learner feedback</span>
          <h2 className="text-[#0b1f45] font-semibold leading-tight">
            Your learning experience matters to us.
          </h2>
          <p className="text-[#5b6e86] text-[1.05rem] mt-4">
            We believe in continuous improvement through learner feedback. Stay connected for updates and experiences from the EXSI learning community.
          </p>
        </div>

        <div className="max-w-[680px]">
          <div className="p-6 sm:p-8 rounded-[16px] bg-[#f5f9ff] border border-[#dde8f5] shadow-sm">
            <h3 className="text-[#0b1f45] font-semibold text-lg mb-1">Share your feedback</h3>
            <p className="text-[#5b6e86] text-sm mb-6">
              Feedback is sent privately to the EXSI team and is not published on the website.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircle2 size={40} className="text-emerald-500" />
                <p className="text-[#0b1f45] font-semibold">Thank you for your feedback!</p>
                <p className="text-sm text-[#5b6e86]">
                  {submitted === "shared"
                    ? "Your feedback was submitted privately to the EXSI team."
                    : "Your feedback is saved in this browser. Shared admin access requires feedback storage configuration."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <p role="alert" className="text-sm text-red-600">
                    Feedback could not be saved in this browser. Please try again.
                  </p>
                )}
                <div>
                  <label className="block font-medium text-[0.86rem] text-[#0b1f45] mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setForm({ ...form, rating })}
                        className="p-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0e6fd0]"
                        aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
                        aria-pressed={form.rating === rating}
                      >
                        <Star size={22} className={rating <= form.rating ? "fill-[#f5a623] text-[#f5a623]" : "text-[#c8d8ef]"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-[0.86rem] text-[#0b1f45] mb-1.5">
                      Your name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      className="w-full p-[11px_14px] border-[1.5px] border-[#cfdef2] rounded-[12px] bg-white text-[#0b1f45] text-sm focus:border-[#0e6fd0] focus:outline-none focus:ring-4 focus:ring-[#0e6fd0]/15"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[0.86rem] text-[#0b1f45] mb-1.5">
                      Course / College
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Verilog HDL, NIT Calicut"
                      value={form.note}
                      onChange={(e) => setForm({ ...form, note: e.target.value })}
                      className="w-full p-[11px_14px] border-[1.5px] border-[#cfdef2] rounded-[12px] bg-white text-[#0b1f45] text-sm focus:border-[#0e6fd0] focus:outline-none focus:ring-4 focus:ring-[#0e6fd0]/15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-[0.86rem] text-[#0b1f45] mb-1.5">
                    Your feedback <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us about your experience with EXSI…"
                    value={form.quote}
                    onChange={(e) => setForm({ ...form, quote: e.target.value })}
                    className="w-full p-[11px_14px] border-[1.5px] border-[#cfdef2] rounded-[12px] bg-white text-[#0b1f45] text-sm min-h-[90px] focus:border-[#0e6fd0] focus:outline-none focus:ring-4 focus:ring-[#0e6fd0]/15 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 btn btn-primary"
                >
                  <Send size={15} />
                  Send Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
