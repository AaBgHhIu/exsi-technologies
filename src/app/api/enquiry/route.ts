import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import { sendEmail } from "@/lib/email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof payload.website === "string" && payload.website.trim()) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const interest = typeof payload.interest === "string" ? payload.interest.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const budget = typeof payload.budget === "string" ? payload.budget.trim() : "";

  if (
    !name ||
    name.length > 120 ||
    !EMAIL_PATTERN.test(email) ||
    email.length > 254 ||
    !interest ||
    interest.length > 120 ||
    !message ||
    message.length > 4000 ||
    phone.length > 40 ||
    budget.length > 80
  ) {
    return NextResponse.json({ error: "Please check your enquiry details and try again." }, { status: 400 });
  }

  const missingConfig = [
    !process.env.RESEND_API_KEY?.trim() && "RESEND_API_KEY",
    !process.env.RESEND_FROM_EMAIL?.trim() && "RESEND_FROM_EMAIL",
    !process.env.ADMIN_NOTIFICATION_EMAIL?.trim() && "ADMIN_NOTIFICATION_EMAIL",
  ].filter(Boolean);

  if (missingConfig.length) {
    return NextResponse.json(
      {
        error: `Email delivery is not configured. Add ${missingConfig.join(", ")} in the deployment environment, or email us at ${siteConfig.email}.`,
      },
      { status: 503 }
    );
  }

  const fields = [
    ["Name", name],
    ["Email", email],
    ["Interest", interest],
    ...(phone ? [["Phone", phone] as [string, string]] : []),
    ...(budget ? [["Estimated budget", budget] as [string, string]] : []),
  ];
  const details = fields
    .map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`)
    .join("");
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const reference = randomUUID().slice(0, 8).toUpperCase();
  const logoUrl = "https://www.exsitechnologies.com/images/logo.png";
  const subjectInterest = interest.replace(/\s+/g, " ").slice(0, 120);

  try {
    const result = await sendEmail({
      to: process.env.ADMIN_NOTIFICATION_EMAIL!.trim(),
      replyTo: email,
      subject: `EXSI website enquiry [${reference}]: ${subjectInterest}`,
      html: `<div style="max-width:640px;margin:0 auto;font-family:Arial,Helvetica,sans-serif;color:#14243a;line-height:1.6">
        <div style="padding:20px 0;border-bottom:1px solid #dce5ef">
          <img src="${logoUrl}" alt="EXSi Technologies" width="180" style="display:block;width:180px;height:auto" />
        </div>
        <div style="padding:20px 0">
          <h2 style="margin:0 0 8px;color:#0b1f45">New website enquiry</h2>
          <p style="margin:0 0 18px;color:#5b6e86;font-size:13px">Reference: ${reference}</p>
          ${details}
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        </div>
      </div>`,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "We could not send your enquiry right now. Please email us directly at " + siteConfig.email + "." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to send website enquiry:", error);
    return NextResponse.json(
      { error: "We could not send your enquiry right now. Please email us directly at " + siteConfig.email + "." },
      { status: 502 }
    );
  }
}
