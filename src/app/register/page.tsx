"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, User, Phone, School, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { GoogleButton } from "@/components/auth/GoogleButton";

export default function RegisterPage() {
  const router = useRouter();
  const { signInWithGoogle, signInWithEmail, user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    year: "3rd Year",
  });
  const [loading, setLoading] = useState(false);

  if (user) {
    router.replace("/dashboard");
    return null;
  }

  async function handleGoogleSignUp() {
    setLoading(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmail(formData.email, formData.fullName);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-14 px-4 bg-[#f5f9ff]">
      <div className="w-full max-w-lg bg-white rounded-[24px] border border-[#dde8f5] p-8 sm:p-10 shadow-[0_12px_34px_rgba(14,111,208,0.08)]">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <Image
              src="/images/logo.svg"
              alt="EXSI Technologies"
              width={160}
              height={50}
              priority
              className="h-[44px] w-auto mx-auto object-contain"
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0b1f45]">
            Create Student Account
          </h1>
          <p className="text-sm text-[#5b6e86] mt-2 leading-relaxed">
            Register with your Google account to track your course enrollments and batch schedules.
          </p>
        </div>

        {/* Primary: 1-Click Google Sign Up */}
        <div className="mb-6">
          <GoogleButton
            onClick={handleGoogleSignUp}
            loading={loading}
            label="Sign up with Google"
            className="py-3.5 text-base"
          />
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#dde8f5]"></div>
          </div>
          <span className="relative px-3 bg-white text-xs text-[#5b6e86] uppercase tracking-wider">
            or fill student details
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#0b1f45] uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a8be]" />
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
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a8be]" />
                <input
                  type="email"
                  required
                  placeholder="student@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#dde8f5] text-sm text-[#0b1f45] placeholder:text-[#a0b0c0] bg-white focus:outline-none focus:border-[#0e6fd0]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0b1f45] uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a8be]" />
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile"
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
                <School size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a8be]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Model Engg College"
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full !py-3 text-sm font-semibold mt-2"
          >
            {loading ? "Creating Account..." : "Create Account &rarr;"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#dde8f5] text-center text-xs text-[#5b6e86]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#0e6fd0] font-semibold hover:underline">
            Sign In with Google
          </Link>
        </div>
      </div>
    </div>
  );
}
