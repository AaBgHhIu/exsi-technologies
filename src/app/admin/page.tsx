"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Trash2,
  Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { FeedbackRecord, getFeedback } from "@/lib/feedback";
import {
  getAllRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  AdminRegistrationRecord,
} from "@/lib/registrations";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [registrations, setRegistrations] = useState<AdminRegistrationRecord[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.replace(user ? "/dashboard" : "/login");
    }
  }, [isAdmin, loading, router, user]);

  // Load registrations shared through Supabase.
  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    getAllRegistrations()
      .then((items) => {
        if (active) setRegistrations(items);
      })
      .catch((error: unknown) => {
        if (active) {
          setActionNotice(
            error instanceof Error ? error.message : "Could not load registrations."
          );
        }
      });

    getFeedback().then((items) => {
      if (active) setFeedback(items);
    });

    return () => {
      active = false;
    };
  }, [isAdmin]);

  async function handleStatusChange(id: string, newStatus: "approved" | "rejected") {
    try {
      const updated = await updateRegistrationStatus(id, newStatus);
      setRegistrations(updated);

      const student = updated.find((r) => r.id === id);
      const msg =
        newStatus === "approved"
          ? `Approved ${student?.studentName} for ${student?.courseTitle}.`
          : `Marked ${student?.studentName}'s registration as rejected.`;

      setActionNotice(msg);
      setTimeout(() => setActionNotice(null), 5000);
    } catch (error) {
      setActionNotice(
        error instanceof Error ? error.message : "Could not update registration status."
      );
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this student registration record?")) {
      try {
        const updated = await deleteRegistration(id);
        setRegistrations(updated);
        setActionNotice("Registration record removed.");
        setTimeout(() => setActionNotice(null), 4000);
      } catch (error) {
        setActionNotice(
          error instanceof Error ? error.message : "Could not delete registration."
        );
      }
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

  // Keep the admin portal hidden while a non-admin is redirected.
  if (!isAdmin) {
    return null;
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
                          <span className="text-[10px] text-[#5b6e86] block mt-0.5">
                            {item.paymentMethod === "offline" ? "Offline" : "Awaiting payment"}
                          </span>
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
                              title="Approve registration"
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
