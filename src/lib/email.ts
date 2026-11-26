/**
 * Transactional Email Dispatcher via Resend
 *
 * Email is sent through Resend. Missing configuration and delivery failures
 * are returned to the caller so it can report them to the user.
 */

export async function sendEmail({
  to,
  replyTo,
  subject,
  html,
}: {
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    return { success: false, reason: "configuration" as const };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.error("Resend rejected an email request:", res.status, await res.text());
    return { success: false, reason: "provider" as const };
  }

  return { success: true as const };
}
