import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (handles conditional and duplicate classes). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Indian Rupees: formatCurrency(5000) → "₹5,000" */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format a date string as "1 Jan 2025" */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Build a WhatsApp click-to-chat URL from a phone number (digits only) and optional message. */
export function buildWhatsAppUrl(number: string, message?: string): string {
  const encoded = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${number}${encoded ? `?text=${encoded}` : ""}`;
}
