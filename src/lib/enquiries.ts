"use client";

export interface EnquiryPayload {
  name: string;
  email: string;
  interest: string;
  message: string;
  phone?: string;
  budget?: string;
  website?: string;
}

export async function sendEnquiry(payload: EnquiryPayload): Promise<void> {
  const response = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) return;

  const result: { error?: string } = await response.json().catch(() => ({}));
  throw new Error(result.error || "We could not send your enquiry. Please try again.");
}
