"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  LogOut,
  User,
  Trash2,
  PlusCircle,
  RefreshCw,
  Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GoogleButton, GoogleIcon } from "@/components/auth/GoogleButton";
import { FeedbackRecord, getFeedback } from "@/lib/feedback";
import {
  getAllRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  saveNewRegistration,
  AdminRegistrationRecord,
} from "@/lib/registrations";

export default function AdminPage() {
  const { user, isAdmin, loading, signOut, signInWithGoogle } = useAuth();
  const [registrations, setRegistrations] = useState<AdminRegistrationRecord[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Load real registrations from platform storage
  useEffect(() => {
    if (!isAdmin) return;
    setRegistrations(getAllRegistrations());
    let active = true;
    getFeedback().then((items) => {
      if (active) setFeedback(items);
    });

    return () => {
      active = false;
    };
  }, [isAdmin]);

  function handleStatusChange(id: string, newStatus: "approved" | "rejected") {
    const updated = updateRegistrationStatus(id, newStatus);
    setRegistrations(updated);

    const student = updated.find((r) => r.id === id);
    const msg =
      newStatus === "approved"
        ? `Approved ${student?.studentName} for ${student?.courseTitle}! Meeting and classroom resources unlocked.`
        : `Marked ${student?.studentName}'s registration as Rejected.`;

    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 5000);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this student registration record?")) {
      const updated = deleteRegistration(id);
      setRegistrations(updated);
      setActionNotice("Registration record removed.");
      setTimeout(() => setActionNotice(null), 4000);
    }
  }

  function handleAddTestStudent() {
    const testNames = ["Ananya Sen", "Karthik Menon", "Siddharth Verma", "Divya Pillai"];
    const colleges = ["IIT Madras", "NIT Calicut", "Model Engg College", "CET Trivandrum"];
    const courses = [
      {
        title: "Verilog HDL, RTL Design & Digital Projects",
        slug: "verilog-hdl-rtl-design",
        fee: "On enquiry",
      },
    ];

    const randomName = testNames[Math.floor(Math.random() * testNames.length)];
    const randomCollege = colleges[Math.floor(Math.random() * colleges.length)];
    const randomCourse = courses[Math.floor(Math.random() * courses.length)];
    const randomId = `reg-${Date.now()}`;

    const newRecord: AdminRegistrationRecord = {
      id: randomId,
      studentName: randomName,
      email: `${randomName.toLowerCase().replace(" ", ".")}@gmail.com`,
      phone: "+91 9" + Math.floor(100000000 + Math.random() * 900000000),
      college: randomCollege,
      year: "3rd Year",
      courseTitle: randomCourse.title,
      courseSlug: randomCourse.slug,
      fee: randomCourse.fee,
      status: "pending",
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      meetingLink: "https://meet.google.com/exsi-vlsi-live",
      materialsUrl: "https://drive.google.com/drive/folders/exsi-verilog-resources",
    };

    saveNewRegistration(newRecord);
    setRegistrations(getAllRegistrations());
    setActionNotice(`Added test registration for ${randomName}!`);
    setTimeout(() => setActionNotice(null), 4000);
  }

  function handleClearAll() {
    if (confirm("Are you sure you want to clear all registrations and start fresh?")) {
      localStorage.setItem("exsi_all_admin_registrations", JSON.stringify([]));
      setRegistrations([]);
      setActionNotice("All registration records cleared.");
      setTimeout(() => setActionNotice(null), 4000);
    }
  }

  function exportLiveCsv() {
    if (registrations.length === 0) {
      alert("No registrations to export.");
      return;
    }
    const headers = [
      "Student Name",
      "Email",
      "Phone",
      "College",
      "Year",
      "Course",
      "Fee / Payment",
      "Status",
      "Date",
    ];
    const rows = registrations.map((r) => [
      `"${r.studentName}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      `"${r.college}"`,
      `"${r.year}"`,
      `"${r.courseTitle}"`,
      `"${r.fee}"`,
      `"${r.status}"`,
      `"${r.date}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `exsi_registrations_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // If loading, show skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f9ff]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#0e6fd0] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#5b6e86] font-medium">Verifying administrator permissions...</p>
        </div>
      </div>
    );
  }

  // If NOT admin or NOT logged in, show access guard
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 bg-[#f5f9ff]">
        <div className="w-full max-w-lg bg-white rounded-[24px] border border-[#dde8f5] p-8 sm:p-10 shadow-[0_12px_34px_rgba(14,111,208,0.08)] text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 grid place-items-center mx-auto mb-4 border border-amber-200">
            <ShieldAlert size={32} />
          </div>

          <span className="inline-block py-1 px-3 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2">
            Admin Access Restricted
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1f45] mb-2">
            Administrator Authentication Required
          </h1>

          <p className="text-sm text-[#5b6e86] max-w-md mx-auto mb-6 leading-relaxed">
            This administration portal is restricted to authorized EXSi managers. Please sign in with your official admin Google account (e.g. <strong>tbabhimanue06@gmail.com</strong> or <strong>basilthankachan274@gmail.com</strong>).
          </p>

          {user && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-left">
              <strong>Currently logged in as:</strong> {user.email} (Student Access). This email does not have administrator privileges.
            </div>
          )}

          <div className="space-y-3">
            <GoogleButton
              onClick={() =>
                signInWithGoogle({
                  email: "tbabhimanue06@gmail.com",
                  name: "Abhimanue (Admin)",
                })
              }
              label="Sign In with Admin Google Account"
              variant="primary"
              className="py-3.5 text-sm"
            />

            {user && (
              <button
                onClick={() => signOut()}
                className="w-full py-2.5 px-4 text-xs font-semibold text-[#5b6e86] hover:text-[#0b1f45] transition-colors"
              >
                Sign out of current account
              </button>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-[#dde8f5] text-xs text-[#5b6e86] flex items-center justify-center gap-4">
            <Link href="/" className="hover:text-[#0e6fd0] transition-colors">
              Return Home
            </Link>
            <span>&bull;</span>
            <Link href="/dashboard" className="hover:text-[#0e6fd0] transition-colors">
              Student Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- ADMIN PORTAL VIEW ---
  const totalCount = registrations.length;
  const pendingCount = registrations.filter((r) => r.status === "pending").length;
  const approvedCount = registrations.filter((r) => r.status === "approved").length;
  const rejectedCount = registrations.filter((r) => r.status === "rejected").length;

  const filteredRegistrations = registrations.filter((item) => {
    const matchesTab = activeTab === "all" ? true : item.status === activeTab;
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f5f9ff] text-[#0b1f45] py-10 sm:py-14">
      <div className="wrap">
        {/* Top Header */}
        <div className="bg-white rounded-[24px] border border-[#dde8f5] p-6 sm:p-8 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Verified Admin: {user?.email}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1f45]">
              Student Registration Manager
            </h1>
            <p className="text-xs sm:text-sm text-[#5b6e86] mt-1">
              Track student admissions, verified Razorpay payments, and classroom access in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportLiveCsv}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-[#0b1f45] bg-white border border-[#dde8f5] hover:bg-[#f8fafc] hover:border-[#b5d6f3] transition-colors shadow-sm cursor-pointer"
            >
              <Download size={14} /> Export CSV
            </button>
            <Link
              href="/dashboard"
              className="btn btn-outline !py-2.5 !px-5 text-xs font-semibold"
            >
              Student Portal <ExternalLink size={12} />
            </Link>
            <button
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-full border border-[#dde8f5] text-xs font-semibold text-[#5b6e86] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>

        {/* Action alert */}
        {actionNotice && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-xs text-emerald-700 hover:underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-[#dde8f5] shadow-sm">
            <span className="text-[11px] font-semibold text-[#5b6e86] uppercase tracking-wider block mb-1">
              Total Registrations
            </span>
            <div className="text-3xl font-bold text-[#0b1f45]">{totalCount}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#dde8f5] shadow-sm">
            <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block mb-1">
              Pending Approvals
            </span>
            <div className="text-3xl font-bold text-amber-600">{pendingCount}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#dde8f5] shadow-sm">
            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block mb-1">
              Approved Students
            </span>
            <div className="text-3xl font-bold text-emerald-600">{approvedCount}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-[#dde8f5] shadow-sm">
            <span className="text-[11px] font-semibold text-red-500 uppercase tracking-wider block mb-1">
              Rejected
            </span>
            <div className="text-3xl font-bold text-red-500">{rejectedCount}</div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-[24px] border border-[#dde8f5] p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            {/* Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { id: "all", label: "All", count: totalCount },
                { id: "pending", label: "Pending", count: pendingCount },
                { id: "approved", label: "Approved", count: approvedCount },
                { id: "rejected", label: "Rejected", count: rejectedCount },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? "bg-[#0b1f45] text-white"
                      : "bg-[#f5f9ff] text-[#5b6e86] hover:bg-[#e8f4fd]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="opacity-75">({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Quick Actions & Search */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a8be]" />
                <input
                  type="text"
                  placeholder="Search student, college, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#cfdef2] text-xs text-[#0b1f45] placeholder:text-[#a0b0c0] bg-white focus:outline-none focus:border-[#0e6fd0]"
                />
              </div>

              <button
                onClick={handleAddTestStudent}
                title="Add a sample student registration to test approvals"
                className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl border border-[#dde8f5] text-xs font-semibold text-[#0a58a8] bg-[#f5f9ff] hover:bg-[#e8f4fd] transition-colors shrink-0"
              >
                <PlusCircle size={13} />
                <span className="hidden md:inline">+ Test Student</span>
              </button>

              <button
                onClick={handleClearAll}
                title="Clear all registrations"
                className="p-2 rounded-xl border border-[#dde8f5] text-xs text-[#5b6e86] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shrink-0"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Table */}
          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-12 text-[#5b6e86] text-xs">
              No registrations found matching your query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[#5b6e86] font-semibold uppercase tracking-wider">
                    <th className="pb-3 px-3">Student</th>
                    <th className="pb-3 px-3">College &amp; Year</th>
                    <th className="pb-3 px-3">Course</th>
                    <th className="pb-3 px-3">Fee / Payment</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRegistrations.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f8fbfe] transition-colors">
                      <td className="py-4 px-3">
                        <div className="font-bold text-[#0b1f45] text-sm">{item.studentName}</div>
                        <div className="text-[#5b6e86] text-xs mt-0.5">{item.email}</div>
                        <div className="text-[#94a8be] text-xs">{item.phone}</div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-medium text-[#0b1f45]">{item.college}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] bg-[#f5f9ff] text-[#0a58a8]">
                          {item.year}
                        </span>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-medium text-[#0b1f45]">{item.courseTitle}</div>
                        <div className="text-[#5b6e86] text-[10px] mt-0.5">Registered: {item.date}</div>
                      </td>

                      <td className="py-4 px-3">
                        <div className="font-bold text-[#0b1f45]">{item.fee}</div>
                        {item.paymentMethod === "online_razorpay" ? (
                          <div className="mt-0.5">
                            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                              Razorpay Paid
                            </span>
                            {item.paymentId && (
                              <div className="text-[9px] text-[#5b6e86] font-mono mt-0.5">
                                {item.paymentId}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#5b6e86] block mt-0.5">Offline</span>
                        )}
                      </td>

                      <td className="py-4 px-3">
                        {item.status === "pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock size={11} /> Pending
                          </span>
                        )}
                        {item.status === "approved" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 size={11} /> Approved
                          </span>
                        )}
                        {item.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                            <XCircle size={11} /> Rejected
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {item.status !== "approved" && (
                            <button
                              onClick={() => handleStatusChange(item.id, "approved")}
                              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                              title="Approve registration and unlock class links"
                            >
                              ✓ Approve
                            </button>
                          )}
                          {item.status !== "rejected" && (
                            <button
                              onClick={() => handleStatusChange(item.id, "rejected")}
                              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Mark registration as rejected"
                            >
                              ✗ Reject
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                            title="Delete record"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <section className="bg-white rounded-[24px] border border-[#dde8f5] p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-[#0b1f45]">Private Student Feedback</h2>
              <p className="text-sm text-[#5b6e86] mt-1">Visible only in this admin portal.</p>
            </div>
            <span className="shrink-0 rounded-full bg-[#e8f4fd] px-3 py-1 text-xs font-semibold text-[#0a58a8]">
              {feedback.length} {feedback.length === 1 ? "response" : "responses"}
            </span>
          </div>

          {feedback.length === 0 ? (
            <p className="py-8 text-center text-sm text-[#5b6e86]">No feedback submitted yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {feedback.map((item) => (
                <article key={item.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-sm text-[#0b1f45]">{item.author}</h3>
                      {item.note && <p className="text-xs text-[#5b6e86] mt-0.5">{item.note}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
                        {Array.from({ length: 5 }, (_, index) => (
                          <Star
                            key={index}
                            size={14}
                            className={index < item.rating ? "fill-[#f5a623] text-[#f5a623]" : "text-[#c8d8ef]"}
                          />
                        ))}
                      </span>
                      <time className="text-xs text-[#71839a]" dateTime={item.createdAt}>
                        {new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[#334c6b]">{item.quote}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
