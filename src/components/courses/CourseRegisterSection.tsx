"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  School,
  GraduationCap,
  CreditCard,
  ShieldCheck,
  Zap,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GoogleIcon } from "@/components/auth/GoogleButton";
import { initiateRazorpayPayment } from "@/lib/razorpayClient";

interface CourseRegisterSectionProps {
  courseTitle: string;
  courseSlug: string;
  fee: string;
  duration: string;
  batchStart: string;
}

export default function CourseRegisterSection({
  courseTitle,
  courseSlug,
  fee,
  duration,
  batchStart,
}: CourseRegisterSectionProps) {
  const { user, enrollments, registerCourse, isRegistered, refreshEnrollments } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    year: "3rd Year",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    paymentId?: string;
  }>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [missingRazorpayConfig, setMissingRazorpayConfig] = useState(false);

  // Auto-populate user's Google info if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const alreadyRegistered = isRegistered(courseSlug);
  const existingEnrollment = enrollments.find((item) => item.courseSlug === courseSlug);

  function validateForm(): boolean {
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.college.trim()
    ) {
      setStatus("error");
      setErrorMessage("Please fill in all required fields (Name, Email, Phone, College).");
      return false;
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setStatus("error");
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return false;
    }

    return true;
  }

  // ONLINE PAYMENT VIA RAZORPAY & AUTO-APPROVAL
  async function handlePaymentAndRegistration() {
    if (!validateForm()) return;
    if (!user) {
      setStatus("error");
      setErrorMessage("Sign in with Google before completing your registration.");
      return;
    }
    if (formData.email.trim().toLowerCase() !== user.email.toLowerCase()) {
      setStatus("error");
      setErrorMessage("Use the email address from your signed-in Google account.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");
    setMissingRazorpayConfig(false);

    try {
      const enrollment = await registerCourse({
        slug: courseSlug,
        title: courseTitle,
        duration,
        fee,
        batchStart,
        studentName: formData.fullName.trim(),
        college: formData.college.trim(),
        phone: formData.phone.trim(),
        year: formData.year,
      });

      const result = await initiateRazorpayPayment({
        enrollmentId: enrollment.id,
        courseTitle,
        courseSlug,
        fee,
        studentName: formData.fullName.trim(),
        studentEmail: formData.email.trim(),
        studentPhone: formData.phone.trim(),
      });

      if (!result.success) {
        setStatus("error");
        if (result.missingConfig) {
          setMissingRazorpayConfig(true);
          setErrorMessage(result.error || "Payment setup is incomplete on the server.");
        } else {
          setErrorMessage(result.error || "Payment was not completed.");
        }
        return;
      }

      setPaymentSuccessData({
        paymentId: result.paymentId,
      });
      await refreshEnrollments();
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred during payment."
      );
    }
  }

  return (
    <section
      id="register-section"
      className="py-20 bg-[#f5f9ff] border-t border-[#dde8f5] scroll-mt-20 text-[#0b1f45]"
    >
      <div className="wrap max-w-2xl">
        <div className="text-center mb-8">
          <span className="kicker">Course Admission</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0b1f45] tracking-tight mb-2">
            Enroll in {courseTitle}
          </h2>
          <p className="text-[#5b6e86] text-sm max-w-md mx-auto">
            Pay securely online via UPI, Credit/Debit Cards or NetBanking for instant admission.
          </p>
        </div>

        {alreadyRegistered && status !== "success" && status !== "submitting" ? (
          <div className="bg-white rounded-[24px] border border-[#bbf7d0] p-8 text-center shadow-sm">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mx-auto mb-3">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#0b1f45] mb-1">
              {existingEnrollment?.status === "approved"
                ? "You are enrolled in this course!"
                : existingEnrollment?.status === "rejected"
                  ? "This registration was not approved."
                  : "Your registration is saved."}
            </h3>
            <p className="text-sm text-[#5b6e86] max-w-md mx-auto mb-6">
              {existingEnrollment?.status === "pending"
                ? "Complete payment from your student dashboard to confirm your seat."
                : `Your registration is linked to your account (${user?.email}).`}
            </p>
            <Link href="/dashboard" className="btn btn-primary !py-2.5 !px-6 text-sm">
              View in My Courses Dashboard &rarr;
            </Link>
          </div>
        ) : status === "success" ? (
          <div className="rounded-[24px] bg-white border border-[#dde8f5] p-8 sm:p-10 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-bold text-[#0b1f45] mb-1">
              Payment Verified &amp; Admission Confirmed!
            </h3>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 my-3">
              <ShieldCheck size={14} />
              <span>Instant Seat Confirmed &bull; Verified via Razorpay</span>
            </div>

            <p className="text-[#5b6e86] text-sm max-w-md mx-auto my-3 leading-relaxed">
              Thank you, <strong>{formData.fullName || user?.name}</strong>. Your enrollment for{" "}
              <strong>{courseTitle}</strong> is active and recorded in your student dashboard.
            </p>

            <div className="bg-[#f5f9ff] border border-[#dde8f5] rounded-xl p-4 text-xs text-[#0b1f45] text-left max-w-md mx-auto my-4 space-y-1.5">
              <div>
                <strong>Student:</strong> {formData.fullName} ({formData.email})
              </div>
              <div>
                <strong>Batch Start:</strong> {batchStart}
              </div>
              <div>
                <strong>Tuition Fee:</strong> {fee} (Paid Online)
              </div>
              {paymentSuccessData.paymentId && (
                <div>
                  <strong>Transaction ID:</strong>{" "}
                  <code className="text-[#0e6fd0] font-mono">{paymentSuccessData.paymentId}</code>
                </div>
              )}
              <div>
                <strong>Status:</strong>{" "}
                <span className="text-emerald-600 font-bold">Approved &bull; Confirmed</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Link href="/dashboard" className="btn btn-primary !py-2.5 !px-6 text-sm">
                Open Student Dashboard &rarr;
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] border border-[#dde8f5] p-7 sm:p-9 shadow-sm">
            {/* GOOGLE AUTO-FILL HELPER */}
            {!user ? (
              <div className="mb-6 p-4 rounded-2xl bg-[#f5f9ff] border border-[#dde8f5] flex items-center justify-between gap-4">
                <div className="text-xs">
                  <strong className="text-[#0b1f45] block">Have a Google Account?</strong>
                  <span className="text-[#5b6e86]">
                    Sign in with Google to pre-fill your details and track your courses.
                  </span>
                </div>
                <Link
                  href={`/login?redirect=${encodeURIComponent(`/courses/${courseSlug}#register-section`)}`}
                  className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-full text-xs font-semibold bg-white border border-[#cfdef2] hover:bg-[#e8f4fd] hover:border-[#0e6fd0] text-[#0b1f45] transition-all shadow-sm shrink-0"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>Google Sign In</span>
                </Link>
              </div>
            ) : (
              <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                <span>
                  Signed in as <strong>{user.name}</strong> ({user.email})
                </span>
                <span className="font-semibold text-emerald-700">Account Connected</span>
              </div>
            )}

            {missingRazorpayConfig && (
              <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <strong>Razorpay Setup Note:</strong>
                <p>
                  To accept online payments, add your free Razorpay Key ID and Secret to{" "}
                  <code>.env.local</code> (<code>NEXT_PUBLIC_RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code>).
                </p>
              </div>
            )}

            {status === "error" && !missingRazorpayConfig && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePaymentAndRegistration();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-[#0b1f45] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a8be]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dde8f5] text-sm text-[#0b1f45] placeholder:text-[#a0b0c0] bg-white focus:outline-none focus:border-[#0e6fd0]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1f45] uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a8be]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="student@gmail.com"
                      value={formData.email}
                      readOnly={Boolean(user)}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dde8f5] text-sm text-[#0b1f45] placeholder:text-[#a0b0c0] bg-white focus:outline-none focus:border-[#0e6fd0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b1f45] uppercase tracking-wider mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a8be]"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dde8f5] text-sm text-[#0b1f45] placeholder:text-[#a0b0c0] bg-white focus:outline-none focus:border-[#0e6fd0]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0b1f45] uppercase tracking-wider mb-1">
                    College / Institute *
                  </label>
                  <div className="relative">
                    <School
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a8be]"
                    />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Govt Engineering College"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dde8f5] text-sm text-[#0b1f45] placeholder:text-[#a0b0c0] bg-white focus:outline-none focus:border-[#0e6fd0]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0b1f45] uppercase tracking-wider mb-1">
                    Year of Study
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#dde8f5] text-sm text-[#0b1f45] bg-white focus:outline-none focus:border-[#0e6fd0]"
                  >
                    <option value="1st Year">1st Year B.Tech / BE</option>
                    <option value="2nd Year">2nd Year B.Tech / BE</option>
                    <option value="3rd Year">3rd Year B.Tech / BE</option>
                    <option value="4th Year">4th Year B.Tech / BE</option>
                    <option value="Graduated">Graduated / Working Professional</option>
                  </select>
                </div>
              </div>

              {/* PAYMENT ACTION */}
              <div className="pt-3 border-t border-[#dde8f5] space-y-3">
                <button
                  type="submit"
                  disabled={status === "submitting" || !user}
                  className="w-full py-4 px-6 rounded-full font-bold text-sm sm:text-base text-white bg-[#0e6fd0] hover:bg-[#0a58a8] shadow-[0_8px_24px_rgba(14,111,208,0.3)] transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                >
                  <CreditCard size={18} />
                  <span>
                    {status === "submitting"
                      ? "Connecting to Razorpay..."
                      : user
                        ? `Pay ${fee} & Enroll Now`
                        : "Sign in with Google to enroll"}
                  </span>
                  <Zap size={15} className="text-amber-300" />
                </button>

                <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#5b6e86] pt-1">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck size={13} /> Instant Seat Auto-Approval
                  </span>
                  <span className="flex items-center gap-1">
                    <Lock size={12} /> UPI, Cards, NetBanking via Razorpay
                  </span>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
