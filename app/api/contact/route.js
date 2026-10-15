const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
// Formspree form IDs are public identifiers used in form action URLs.
const DEFAULT_FORMSPREE_FORM_ID = "xvkzdavg";

function clean(value, limit) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function isRateLimited(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > MAX_ATTEMPTS;
}

export async function POST(request) {
  if (isRateLimited(request)) return Response.json({ error: "Too many attempts. Please try again later." }, { status: 429 });

  let payload;
  try { payload = await request.json(); }
  catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (clean(payload.website, 200)) return Response.json({ ok: true });

  const name = clean(payload.name, 80);
  const email = clean(payload.email, 254).toLowerCase();
  const phone = clean(payload.phone, 30);
  const message = clean(payload.message, 5000);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return Response.json({ error: "Please check all three fields." }, { status: 400 });
  }

  const formspreeId = process.env.FORMSPREE_FORM_ID === undefined
    ? DEFAULT_FORMSPREE_FORM_ID
    : process.env.FORMSPREE_FORM_ID.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const useFormspree = Boolean(formspreeId && /^[a-zA-Z0-9]+$/.test(formspreeId));
  if (!useFormspree && (!apiKey || !to || !from)) {
    console.error("Contact form: Formspree form ID or Resend settings are not configured.");
    return Response.json({ error: "Email delivery is not configured yet." }, { status: 503 });
  }

  if (useFormspree) {
    try {
      const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (formspreeResponse.status === 429) {
        return Response.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
      }
      if (!formspreeResponse.ok) {
        console.error("Contact form: Formspree rejected the request.", formspreeResponse.status);
        return Response.json({ error: "Delivery failed. Please use the email link." }, { status: 502 });
      }
      return Response.json({ ok: true });
    } catch (error) {
      console.error("Contact form: delivery request failed.", error);
      return Response.json({ error: "Delivery failed. Please use the email link." }, { status: 502 });
    }
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>\n");
  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio enquiry from ${name}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><h1 style="font-size:24px">New portfolio enquiry</h1><p><strong>From:</strong> ${safeName}<br><strong>Email:</strong> ${safeEmail}${safePhone ? `<br><strong>Phone:</strong> ${safePhone}` : ""}</p><hr style="border:0;border-top:1px solid #ddd"><p>${safeMessage}</p></div>`,
        text: `New portfolio enquiry\n\nFrom: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}\n\n${message}`,
      }),
    });
    const result = await resendResponse.json().catch(() => ({}));
    if (!resendResponse.ok || !result.id) {
      console.error("Contact form: Resend rejected the request.", result);
      return Response.json({ error: "Delivery failed. Please use the email link." }, { status: 502 });
    }
    return Response.json({ ok: true, id: result.id });
  } catch (error) {
    console.error("Contact form: delivery request failed.", error);
    return Response.json({ error: "Delivery failed. Please use the email link." }, { status: 502 });
  }
}
