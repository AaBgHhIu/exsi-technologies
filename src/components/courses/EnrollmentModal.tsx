"use client";

import { useState } from "react";
import { X, CheckCircle2, AlertCircle, Laptop, Clock, Calendar, Sparkles } from "lucide-react";

interface EnrollmentModalProps {
  courseTitle: string;
  courseSlug: string;
  fee: string;
  duration: string;
  batchStart: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrollmentModal({
  courseTitle,
  courseSlug,
  fee,
  duration,
  batchStart,
  isOpen,
  onClose,
}: EnrollmentModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    year: "3rd Year",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    // Client-side validation
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.college.trim()) {
      setStatus("error");
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    // Phone validation (simple check for 10 digits)
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setStatus("error");
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    // Simulate registration submission (in Step 3/4 this will connect directly to Supabase action)
    setTimeout(() => {
      setStatus("success");
    }, 600);
  }

  function handleReset() {
    setStatus("idle");
    setErrorMessage("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#dce6ef] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-brand-navyDark text-white p-6 relative">
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
          <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-brand-cyan uppercase mb-1">
            <Sparkles size={14} /> Course Registration
          </div>
          <h2 className="text-xl font-black text-white">{courseTitle}</h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#c4d5e7] mt-2">
            <span>Duration: {duration}</span>
            <span>•</span>
            <span className="font-bold text-white">Fee: {fee} (Offline)</span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black text-brand-navy mb-1">Registration Received!</h3>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 my-2">
                Status: Pending Approval
              </div>
              <p className="text-[#53677e] text-sm max-w-md mx-auto my-3 leading-relaxed">
                Thank you, <strong>{formData.fullName}</strong>. We have registered your interest for{" "}
                <strong>{courseTitle}</strong>.
              </p>
              <div className="bg-[#f8fbfe] border border-[#dce6ef] rounded-xl p-4 text-xs text-[#4e6077] text-left max-w-md mx-auto my-4 space-y-1">
                <div><strong>Email:</strong> {formData.email}</div>
                <div><strong>Phone:</strong> {formData.phone}</div>
                <div><strong>College:</strong> {formData.college} ({formData.year})</div>
                <div><strong>Batch Schedule:</strong> {batchStart}</div>
              </div>
              <p className="text-xs text-[#63748a] max-w-sm mx-auto mb-6">
                Our coordinator will contact you directly via WhatsApp / Email to finalize your offline payment and onboard you before classes begin.
              </p>
              <button
                onClick={handleReset}
                className="w-full py-3 rounded-full text-sm font-bold text-white bg-brand-blue hover:bg-brand-blueHover transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {status === "error" && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-xl border border-[#dce6ef] px-4 py-2.5 text-sm text-brand-navy placeholder:text-[#a0b0c0] focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-[#dce6ef] px-4 py-2.5 text-sm text-brand-navy placeholder:text-[#a0b0c0] focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#dce6ef] px-4 py-2.5 text-sm text-brand-navy placeholder:text-[#a0b0c0] focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                    College / Institute <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NIT Calicut"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full rounded-xl border border-[#dce6ef] px-4 py-2.5 text-sm text-brand-navy placeholder:text-[#a0b0c0] focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-navy uppercase tracking-wider mb-1">
                    Year of Study <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full rounded-xl border border-[#dce6ef] px-3 py-2.5 text-sm text-brand-navy bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduated">Graduated / Working</option>
                  </select>
                </div>
              </div>

              <div className="bg-[#f1f9fd] border-l-4 border-brand-cyan p-3 rounded-r-xl text-xs text-[#41546b] mt-1">
                <strong>Offline Fee Notice:</strong> You do not need to pay anything right now. After reviewing your details, our team will coordinate the fee payment and unlock your live classroom links.
              </div>

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#dce6ef]">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-full text-xs font-bold text-brand-navy border border-[#dce6ef] hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="flex-1 py-3 rounded-full text-xs font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(110deg,#0878d1,#0755a3)",
                    boxShadow: "0 8px 20px rgba(8,120,209,.22)",
                  }}
                >
                  {status === "submitting" ? "Submitting..." : "Confirm Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
