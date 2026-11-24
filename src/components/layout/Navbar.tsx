"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, LogIn, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, enrollments } = useAuth();

  const links = [
    { label: "About", href: "/#about" },
    { label: "What we do", href: "/#services" },
    { label: "Courses", href: "/#courses" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Feedback", href: "/#feedback" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#dde8f5]">
      <div className="wrap flex items-center justify-between min-h-[82px] gap-5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3" aria-label="EXSI Technologies home">
          <Image
            src="/images/logo.svg"
            alt="EXSI Technologies"
            width={166}
            height={52}
            priority
            className="h-[48px] w-[152px] sm:h-[52px] sm:w-[166px] object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 font-medium text-[0.86rem] xl:text-[0.92rem] text-[#3d5170]">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-[#0e6fd0]"
            >
              {link.label}
            </Link>
          ))}

          {/* Admin Portal Pill (Only visible for tbabhimanue@gmail.com) */}
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-[#0b1f45] text-white text-xs font-semibold hover:bg-[#071a33] transition-colors shadow-sm"
              title="EXSi Administration Portal"
            >
              <ShieldCheck size={14} className="text-[#09b3e6]" />
              <span>Admin Portal</span>
            </Link>
          )}

          {/* User Auth Status or Sign In Link */}
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#0e6fd0] text-[#0a58a8]"
            >
              <GraduationCap size={15} />
              <span>My Courses ({enrollments.length})</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#0e6fd0]"
            >
              <LogIn size={14} />
              <span>Student Login</span>
            </Link>
          )}

          <Link
            href="/#courses"
            className="btn btn-primary !py-2.5 !px-5 text-sm"
          >
            Explore courses
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden border-0 bg-transparent text-2xl text-[#0b1f45] cursor-pointer p-1"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden bg-white border-b border-[#dde8f5] px-6 py-5 flex flex-col gap-3 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-1.5 font-medium text-[0.95rem] text-[#3d5170] hover:text-[#0e6fd0] transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-[#dde8f5] flex flex-col gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-[#0b1f45] text-white text-sm font-semibold flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#09b3e6]" /> Admin Portal
                </span>
                <span className="text-xs text-[#9fdcf5]">Manager</span>
              </Link>
            )}

            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-[#e8f4fd] text-[#0a58a8] text-sm font-semibold flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap size={16} /> My Registered Courses
                </span>
                <span className="py-0.5 px-2 bg-white rounded-full text-xs">
                  {enrollments.length}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-semibold text-[#0a58a8] flex items-center gap-2"
              >
                <LogIn size={16} /> Student Login
              </Link>
            )}

            <Link
              href="/#courses"
              onClick={() => setOpen(false)}
              className="btn btn-primary text-center mt-1 py-2.5 text-sm"
            >
              Explore courses
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
