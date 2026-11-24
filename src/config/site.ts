/**
 * EXSi Technologies — Central Site Configuration
 *
 * This is the SINGLE SOURCE OF TRUTH for all brand, contact, and legal info.
 * Edit here and changes propagate everywhere.
 */

export const siteConfig = {
  // ── Brand ─────────────────────────────────────────────────────────────────
  name: "EXSi Technologies",
  shortName: "EXSi",
  tagline: "Excellence in Silicon",
  description:
    "EXSI Technologies is an emerging engineering organisation focused on practical education, digital design, semiconductor technologies, and engineering innovation.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://exsitechnologies.com",

  // ── Contact ───────────────────────────────────────────────────────────────
  email: "hello@exsitechnologies.com",
  phone: "",
  whatsappNumber: "", // digits only; leave blank until verified
  city: "Kerala",
  state: "Kerala",
  country: "India",

  // ── Legal / Footer ────────────────────────────────────────────────────────
  linkedIn: "https://www.linkedin.com/company/exsitechnologies",

  // ── Navigation links ──────────────────────────────────────────────────────
  navLinks: [
    { label: "About", href: "/#about" },
    { label: "What we do", href: "/#services" },
    { label: "Courses", href: "/#courses" },
    { label: "Feedback", href: "/#feedback" },
    { label: "Contact", href: "/#contact" },
  ],

  // ── Footer columns ────────────────────────────────────────────────────────
  footerLinks: {
    explore: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Courses", href: "/courses" },
      { label: "Projects & Services", href: "/projects" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Contact", href: "/contact" },
    ],
  },

  // ── Open Graph / Social ───────────────────────────────────────────────────
  ogImage: "/images/hero-chip-v3.jpg",

  // ── Design colours (reference only — use Tailwind classes in components) ──
  colors: {
    navy: "#071a33",
    navyDark: "#041226",
    blue: "#0878d1",
    cyan: "#16b9df",
  },
};

export type SiteConfig = typeof siteConfig;
