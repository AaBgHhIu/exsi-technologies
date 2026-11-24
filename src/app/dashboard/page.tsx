"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  Video,
  FileText,
  Calendar,
  AlertCircle,
  ExternalLink,
  BookOpen,
  LogOut,
  User,
  PlusCircle,
  ArrowRight,
  Sparkles,
  CreditCard,
  Trash2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { courses } from "@/config/courses";
import { GoogleButton, GoogleIcon } from "@/components/auth/GoogleButton";
import { initiateRazorpayPayment } from "@/lib/razorpayClient";

export default function StudentDashboardPage() {
  const router = useRouter();
  const {
    user,
    isAdmin,
    enrollments,
    loading,
    signOut,
    registerCourse,
    isRegistered,
    removeRegistration,
    refreshEnrollments,
  } = useAuth();

  // Admin should never be on the student dashboard — redirect them straight to /admin
  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.replace("/admin");
    }
  }, [loading, user, isAdmin, router]);

  const [activeTab, setActiveTab] = useState<"registered" | "available">("registered");
  const [registeredSuccessMsg, setRegisteredSuccessMsg] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [processingSlug, setProcessingSlug] = useState<string | null>(null);

  // If not logged in, prompt to Sign in with Google
  if (!loading && !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[#f5f9ff]">
        <div className="w-full max-w-lg bg-white rounded-[24px] border border-[#dde8f5] p-8 sm:p-10 shadow-[0_12px_34px_rgba(14,111,208,0.08)] text-center">
          <div className="w-16 h-16 rounded-full bg-[#e8f4fd] text-[#0e6fd0] grid place-items-center mx-auto mb-4">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1f45] mb-2">
            Student Course Portal
          </h1>
          <p className="text-sm text-[#5b6e86] max-w-md mx-auto mb-8 leading-relaxed">
            Please sign in with your Google account to view your registered courses, batch schedule, and classroom access links.
          </p>

          <GoogleButton
            onClick={() => {
              window.location.href = "/login?redirect=/dashboard";
            }}
            label="Sign In with Google Account"
            className="py-3.5 text-base"
          />

          <div className="mt-6 pt-6 border-t border-[#dde8f5] text-xs text-[#5b6e86]">
            Looking to explore our syllabus?{" "}
            <Link href="/courses" className="text-[#0e6fd0] font-semibold hover:underline">
              Browse All Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 1. ONLINE PAYMENT VIA RAZORPAY FROM DASHBOARD
  async function handleRazorpayCheckout(
    c: (typeof courses)[0],
    knownEnrollmentId?: string
  ) {
    if (!user) return;
    setProcessingSlug(c.slug);
    setPaymentError(null);

    try {
      const enrollment =
        enrollments.find((item) => item.id === knownEnrollmentId) ||
        (await registerCourse({
          slug: c.slug,
          title: c.title,
          duration: c.duration,
          fee: c.fee,
          batchStart: c.batchStart,
          studentName: user.name,
          college: user.college,
          phone: user.phone,
          year: user.year,
        }));
      const result = await initiateRazorpayPayment({
        enrollmentId: enrollment.id,
        courseTitle: c.title,
        courseSlug: c.slug,
        fee: c.fee,
        studentName: user.name || user.email.split("@")[0],
        studentEmail: user.email,
        studentPhone: user.phone || "",
      });

      if (!result.success) {
        setPaymentError(
          result.missingConfig
            ? result.error || "Payment setup is incomplete on the server."
            : result.error || "Payment was cancelled or failed."
        );
        setProcessingSlug(null);
        return;
      }

      await refreshEnrollments();

      setRegisteredSuccessMsg(`Payment of ${c.fee} verified! Your seat for ${c.title} is now confirmed.`);
      setActiveTab("registered");
      setProcessingSlug(null);
      setTimeout(() => setRegisteredSuccessMsg(null), 6000);
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : "Payment processing error.");
      setProcessingSlug(null);
    }
  }

  async function handleRemoveRegistration(slug: string) {
    try {
      await removeRegistration(slug);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Could not cancel registration.");
    }
  }

  const unEnrolledCourses = courses.filter((c) => !isRegistered(c.slug));

  return (
    <div className="min-h-screen bg-[#f5f9ff] py-10 sm:py-14">
      <div className="wrap">
        {/* User Profile Card */}
        <div className="bg-white rounded-[24px] border border-[#dde8f5] p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full border-2 border-[#b5d6f3] object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#e8f4fd] text-[#0e6fd0] font-bold text-xl grid place-items-center border-2 border-[#b5d6f3]">
                {user?.name.charAt(0).toUpperCase() || "S"}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0b1f45]">
                  {user?.name}
                </h1>
                {user?.provider === "google" && (
                  <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full bg-[#f1f5f9] border border-[#cfdef2] text-[11px] font-semibold text-[#0b1f45]">
                    <GoogleIcon className="w-3.5 h-3.5" />
                    Google Account
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#5b6e86]">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/courses"
              className="btn btn-primary !py-2.5 !px-5 text-xs font-semibold"
            >
              <BookOpen size={14} /> Browse Catalog
            </Link>
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-full border border-[#dde8f5] text-xs font-semibold text-[#5b6e86] hover:text-[#0b1f45] hover:bg-[#f8fafc] transition-colors"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {registeredSuccessMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <span>{registeredSuccessMsg}</span>
            </div>
            <button
              onClick={() => setRegisteredSuccessMsg(null)}
              className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Payment Error Banner */}
        {paymentError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5">
              <AlertCircle size={18} className="text-red-600 shrink-0" />
              <span>{paymentError}</span>
            </div>
            <button
              onClick={() => setPaymentError(null)}
              className="text-xs text-red-600 hover:text-red-800 font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#dde8f5] pb-2">
          <button
            onClick={() => setActiveTab("registered")}
            className={`py-2 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "registered"
                ? "bg-[#0b1f45] text-white shadow-sm"
                : "text-[#5b6e86] hover:text-[#0b1f45] hover:bg-white"
            }`}
          >
            My Registered Courses ({enrollments.length})
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`py-2 px-5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "available"
                ? "bg-[#0b1f45] text-white shadow-sm"
                : "text-[#5b6e86] hover:text-[#0b1f45] hover:bg-white"
            }`}
          >
            Courses to Register ({unEnrolledCourses.length})
          </button>
        </div>

        {/* TAB 1: REGISTERED COURSES */}
        {activeTab === "registered" && (
          <div>
            {enrollments.length === 0 ? (
              <div className="bg-white rounded-[24px] border border-[#dde8f5] p-10 sm:p-14 text-center">
                <div className="w-16 h-16 rounded-full bg-[#f5f9ff] text-[#94a8be] grid place-items-center mx-auto mb-4 border border-[#cfdef2]">
                  <GraduationCap size={32} />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0b1f45] mb-2">
                  No courses registered yet
                </h2>
                <p className="text-xs sm:text-sm text-[#5b6e86] max-w-md mx-auto mb-6">
                  You haven&apos;t enrolled in any semiconductor courses under your Google account yet. Browse open courses and enroll online via Razorpay!
                </p>
                <button
                  onClick={() => setActiveTab("available")}
                  className="btn btn-primary !py-2.5 !px-6 text-xs font-semibold"
                >
                  Explore Available Courses &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {enrollments.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-[24px] border border-[#dde8f5] p-6 sm:p-8 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#f1f5f9]">
                      <div>
                        {/* Status Badge */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          {item.status === "approved" ? (
                            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={13} /> Approved &bull; Confirmed
                            </span>
                          ) : item.status === "rejected" ? (
                            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                              <AlertCircle size={13} /> Registration Rejected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock size={13} /> Registered &bull; Fee Verification Pending
                            </span>
                          )}
                          {item.paymentMethod === "online_razorpay" && (
                            <span className="inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#0e6fd0] border border-blue-200">
                              <ShieldCheck size={12} /> Razorpay Verified
                            </span>
                          )}
                          <span className="text-xs text-[#5b6e86] font-medium">
                            Duration: {item.duration}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl sm:text-2xl font-bold text-[#0b1f45]">
                          <Link
                            href={`/courses/${item.courseSlug}`}
                            className="hover:text-[#0e6fd0] transition-colors"
                          >
                            {item.courseTitle}
                          </Link>
                        </h2>

                        <p className="text-xs sm:text-sm text-[#5b6e86] mt-2 flex items-center gap-2">
                          <Calendar size={14} className="text-[#0e6fd0]" />
                          <span>{item.batchStart}</span>
                        </p>
                      </div>

                      <div className="text-left lg:text-right shrink-0">
                        <span className="text-xs font-semibold text-[#5b6e86] uppercase tracking-wider block mb-1">
                          Tuition Fee
                        </span>
                        <div className="text-2xl font-bold text-[#0b1f45]">{item.fee}</div>
                        <span className="text-[11px] text-[#5b6e86] block mt-0.5">
                          {item.paymentMethod === "online_razorpay"
                            ? "Paid Online"
                            : item.paymentMethod === "offline"
                              ? "Collected offline"
                              : "Payment pending"}
                        </span>
                      </div>
                    </div>

                    {/* Classroom Access / Verification status */}
                    <div className="pt-6">
                      {item.status === "approved" ? (
                        <div className="rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                              <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-1">
                                <Video size={16} className="text-emerald-600" /> Live Classroom Access
                              </h3>
                              <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                                {item.meetingLink || item.materialsUrl
                                  ? "Your registration has been approved. Use the access details provided here."
                                  : "Your registration has been approved. Class access details will appear here once they are added."}
                              </p>
                              {item.paymentId && (
                                <p className="text-[11px] text-emerald-700 mt-1 font-mono">
                                  Transaction Ref: {item.paymentId}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                              {item.meetingLink && (
                                <a
                                  href={item.meetingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                                >
                                  <Video size={14} /> Join Google Meet
                                </a>
                              )}
                              {item.materialsUrl && (
                                <a
                                  href={item.materialsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-[#0b1f45] bg-white border border-[#dde8f5] hover:bg-slate-50 transition-colors"
                                >
                                  <FileText size={14} /> Resources <ExternalLink size={12} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : item.status === "pending" ? (
                        <div className="rounded-2xl bg-[#fffbeb] border border-[#fef3c7] p-5">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <h3 className="text-sm font-bold text-amber-900 mb-1">
                                  Payment Pending &bull; Complete Online Checkout
                                </h3>
                                <p className="text-xs text-amber-800 leading-relaxed max-w-xl">
                                  Your seat request is registered under <strong>{user?.email}</strong>. Complete payment via Razorpay to activate your classroom link and syllabus resources instantly.
                                </p>
                              </div>
                            </div>

                            {/* Actions for pending items: Pay with Razorpay or Cancel */}
                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                              {(() => {
                                const courseObj = courses.find((c) => c.slug === item.courseSlug);
                                if (!courseObj) return null;
                                return (
                                  <button
                                  onClick={() => handleRazorpayCheckout(courseObj, item.id)}
                                    disabled={processingSlug === item.courseSlug}
                                    className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full font-bold text-xs text-white bg-[#0e6fd0] hover:bg-[#0a58a8] shadow-sm transition-all"
                                  >
                                    <CreditCard size={14} />
                                    <span>
                                      {processingSlug === item.courseSlug
                                        ? "Opening Razorpay..."
                                        : `Pay ${item.fee} with Razorpay`}
                                    </span>
                                  </button>
                                );
                              })()}

                              <button
                                onClick={() => handleRemoveRegistration(item.courseSlug)}
                                title="Remove this registration"
                                className="inline-flex items-center gap-1.5 py-2 px-3 rounded-full border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 size={13} />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-red-50 border border-red-200 p-5 text-sm text-red-800">
                          Your registration was rejected. Please contact EXSi Technologies if you need help.
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: COURSES TO REGISTER */}
        {activeTab === "available" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0b1f45]">
                Semiconductor Batches Open for Registration
              </h2>
              <p className="text-sm text-[#5b6e86] mt-1">
                Enroll with instant seat confirmation via Razorpay (UPI / Cards / NetBanking).
              </p>
            </div>

            {unEnrolledCourses.length === 0 ? (
              <div className="bg-white rounded-[24px] border border-[#dde8f5] p-10 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mx-auto mb-3">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-bold text-[#0b1f45] mb-1">
                  You are registered for all currently available courses!
                </h3>
                <p className="text-xs sm:text-sm text-[#5b6e86] max-w-md mx-auto mb-5">
                  Check &ldquo;My Registered Courses&rdquo; tab above to view batch schedules and classroom materials.
                </p>
                <button
                  onClick={() => setActiveTab("registered")}
                  className="btn btn-outline !py-2 !px-5 text-xs font-semibold"
                >
                  View My Courses &rarr;
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unEnrolledCourses.map((c) => (
                  <div
                    key={c.slug}
                    className="bg-white rounded-[24px] border border-[#dde8f5] p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="w-10 h-10 rounded-xl bg-[#e8f4fd] text-[#0e6fd0] font-bold text-lg grid place-items-center">
                          {c.icon}
                        </span>
                        {c.duration && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-[#5b6e86]">{c.duration}</span>}
                      </div>

                      <h3 className="text-lg font-bold text-[#0b1f45] mb-2 leading-snug">
                        {c.title}
                      </h3>
                      <p className="text-xs text-[#5b6e86] line-clamp-3 mb-4 leading-relaxed">
                        {c.shortDesc}
                      </p>

                      <div className="p-3 rounded-xl bg-[#f5f9ff] text-xs text-[#5b6e86] mb-5 space-y-1">
                        <div className="flex justify-between">
                          <span>Tuition Fee:</span>
                          <strong className="text-[#0b1f45]">{c.enquiryOnly ? "On enquiry" : c.fee}</strong>
                        </div>
                        {c.batchStart && <div className="flex justify-between">
                          <span>Batch:</span>
                          <strong className="text-[#0b1f45]">{c.batchStart}</strong>
                        </div>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {c.enquiryOnly ? (
                        <Link href="/#contact" className="btn btn-primary w-full text-center !py-2.5 text-xs">
                          Ask about this programme
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleRazorpayCheckout(c)}
                          disabled={processingSlug === c.slug}
                          className="w-full py-2.5 px-4 rounded-full font-bold text-xs text-white bg-[#0e6fd0] hover:bg-[#0a58a8] transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(14,111,208,0.2)] disabled:opacity-60 cursor-pointer"
                        >
                          <CreditCard size={14} />
                          <span>{processingSlug === c.slug ? "Opening Razorpay..." : `Pay ${c.fee} with Razorpay`}</span>
                          <Zap size={13} className="text-amber-300" />
                        </button>
                      )}

                      <Link
                        href={`/courses/${c.slug}`}
                        className="w-full block text-center py-1 text-[11px] text-[#0e6fd0] hover:underline"
                      >
                        View Full Syllabus & Details &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
