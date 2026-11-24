import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#051b4b] text-[#b9cdee] py-12 sm:py-14 pb-7">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-10">
          {/* Brand info */}
          <div>
            <Link href="/" className="inline-block" aria-label="EXSI Technologies home">
              <Image
                src="/images/logo.svg"
                alt="EXSI Technologies"
                width={166}
                height={52}
                className="h-[48px] w-[152px] object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-[0.93rem] leading-relaxed max-w-[38ch] text-[#b9cdee]">
              Building knowledge, strengthening engineering skills and encouraging technology innovation.
            </p>
          </div>

          {/* Explore column */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-[0.95rem] mb-3.5">Explore</h4>
            <Link href="/#about" className="block text-[0.93rem] py-0.5 text-[#b9cdee] hover:text-white transition-colors">
              About us
            </Link>
            <Link href="/#services" className="block text-[0.93rem] py-0.5 text-[#b9cdee] hover:text-white transition-colors">
              What we do
            </Link>
            <Link href="/#courses" className="block text-[0.93rem] py-0.5 text-[#b9cdee] hover:text-white transition-colors">
              Courses
            </Link>
            <Link href="/#gallery" className="block text-[0.93rem] py-0.5 text-[#b9cdee] hover:text-white transition-colors">
              Gallery
            </Link>
          </div>

          {/* Connect column */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold text-[0.95rem] mb-3.5">Connect</h4>
            <Link href="/#contact" className="block text-[0.93rem] py-0.5 text-[#b9cdee] hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/#feedback" className="block text-[0.93rem] py-0.5 text-[#b9cdee] hover:text-white transition-colors">
              Feedback
            </Link>
            <a
              href={siteConfig.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[0.93rem] py-0.5 text-[#b9cdee] hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="block text-[0.93rem] py-0.5 text-[#b9cdee] hover:text-white transition-colors"
            >
              Email us
            </a>
            <span className="block text-[0.93rem] py-0.5 text-[#b9cdee]">{siteConfig.city}, {siteConfig.country}</span>
            <Link href="/privacy" className="block text-[0.93rem] py-0.5 text-[#b9cdee] hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="block text-[0.93rem] py-0.5 text-[#b9cdee] hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/refund" className="block text-[0.93rem] py-0.5 text-[#b9cdee] hover:text-white transition-colors">
              Refund Policy
            </Link>
            <div className="pt-2 text-xs">
              <Link href="/dashboard" className="text-white hover:underline">
                Student Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="flex justify-between flex-wrap gap-3 mt-11 pt-5 border-t border-white/10 text-[0.85rem] text-[#8fa9d4]">
          <span>&copy; {currentYear} EXSI Technologies. All rights reserved.</span>
          <span>Excellence in Silicon</span>
        </div>

      </div>
    </footer>
  );
}
