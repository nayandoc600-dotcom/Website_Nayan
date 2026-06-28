import "server-only";
import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY);

type ContactPayload = {
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  message: string;
  ip?: string | null;
  submittedAt?: string;
};

// Escape user-supplied values before interpolating into the HTML email so a
// crafted enquiry can't inject markup into the admin's inbox (defence in depth).
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactNotification(data: ContactPayload): Promise<void> {
  const submittedAt = data.submittedAt
    ? new Date(data.submittedAt).toLocaleString("en-GB", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Kathmandu",
      })
    : new Date().toLocaleString("en-GB", { timeZone: "Asia/Kathmandu" });

  const rows: Array<[string, string]> = [
    ["Name", esc(data.name)],
    ["Email", `<a href="mailto:${esc(data.email)}" style="color:#004F84">${esc(data.email)}</a>`],
    ["Phone", data.phone ? esc(data.phone) : "—"],
    ["Preferred Country", data.country ? esc(data.country) : "—"],
    ["Message", esc(data.message).replace(/\n/g, "<br>")],
    ["Submission Time", esc(submittedAt)],
    ["IP", data.ip ? esc(data.ip) : "—"],
  ];

  try {
    const { error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to: env.RESEND_TO,
      replyTo: data.email,
      subject: `New Enquiry Received – ${data.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <p style="color:#0C2A44;font-size:15px">A new enquiry has been received from the website.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:8px">
            ${rows
              .map(
                ([label, value]) =>
                  `<tr><td style="padding:8px 0;color:#5C6B79;width:150px;vertical-align:top">${label}</td><td style="padding:8px 0;color:#0C2A44">${value}</td></tr>`,
              )
              .join("")}
          </table>
          <hr style="border:none;border-top:1px solid #ECE3D2;margin:24px 0">
          <p style="color:#5C6B79;font-size:12px">This enquiry was submitted through the official Nayan Educational Consultancy website.</p>
        </div>
      `,
    });
    // Resend returns errors in the payload (not as throws), so surface them.
    if (error) {
      console.error("sendContactNotification (Resend):", error);
    } else {
      console.log(`Enquiry email sent to ${env.RESEND_TO}`);
    }
  } catch (err) {
    // Non-fatal — submission is already saved in Supabase
    console.error("sendContactNotification failed:", err);
  }
}
