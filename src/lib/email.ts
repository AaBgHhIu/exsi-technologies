/**
 * Transactional Email Dispatcher via Resend
 *
 * If RESEND_API_KEY is missing or invalid, email dispatch is skipped
 * gracefully without throwing any runtime errors.
 */

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "re_your_key_here") {
    // Silently skip if key is not configured
    console.info(`[Email skipped - no API key]: To ${to} | Subject: ${subject}`);
    return { success: true, skipped: true };
  }

  try {
    const from = process.env.RESEND_FROM_EMAIL || "EXSi Technologies <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn("[Resend Email Error]:", err);
      return { success: false, error: err };
    }

    return { success: true };
  } catch (err) {
    console.warn("[Resend Email Exception]:", err);
    return { success: false, error: String(err) };
  }
}
