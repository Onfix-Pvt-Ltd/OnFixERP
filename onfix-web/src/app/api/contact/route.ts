import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface ContactPayload {
  fullName?: string;
  email?: string;
  venueType?: string;
  integrations?: string[];
  message?: string;
}

function badRequest(message: string) {
  return NextResponse.json({ ok: false, message }, { status: 400 });
}

export async function POST(req: Request) {
  let body: ContactPayload;
  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return badRequest("Invalid request body.");
  }

  const fullName = body.fullName?.trim();
  const email = body.email?.trim();
  const venueType = body.venueType?.trim();
  const integrations = Array.isArray(body.integrations)
    ? body.integrations.map((s) => String(s).trim()).filter(Boolean)
    : [];
  const message = body.message?.trim();

  if (!fullName || fullName.length < 2) return badRequest("Name is required.");
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return badRequest("A valid email is required.");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_DESTINATION_EMAIL ?? "hello@onfixpos.com";

  // Without RESEND_API_KEY we still accept the submission but log it server-side
  // and tell the client we got it. Wire a real provider before launch.
  if (!apiKey) {
    console.log("[contact] new lead (no email provider configured)", {
      fullName,
      email,
      venueType,
      integrations,
      message,
    });
    return NextResponse.json({ ok: true, mode: "logged" });
  }

  const subject = `New lead: ${fullName} (${venueType ?? "no venue type"})`;
  const body_text = [
    `Name: ${fullName}`,
    `Email: ${email}`,
    venueType ? `Venue: ${venueType}` : null,
    integrations.length ? `Integrations: ${integrations.join(", ")}` : null,
    message ? `\nMessage:\n${message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "OnFix Marketing <noreply@onfixpos.com>",
        to: [to],
        reply_to: email,
        subject,
        text: body_text,
      }),
    });
    if (!res.ok) {
      const errPayload = await res.text();
      console.error("[contact] resend failed", res.status, errPayload);
      return NextResponse.json(
        { ok: false, message: "Couldn't send right now. Please try again." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, mode: "email" });
  } catch (err) {
    console.error("[contact] resend exception", err);
    return NextResponse.json(
      { ok: false, message: "Network error. Please try again." },
      { status: 502 }
    );
  }
}
