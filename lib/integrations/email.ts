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
};

export async function sendContactNotification(data: ContactPayload): Promise<void> {
  try {
    await resend.emails.send({
      from: "Nayan Website <noreply@nayaneducational.com>",
      to: "info@nayaneducational.com",
      replyTo: data.email,
      subject: `New enquiry from ${data.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#0C2A44">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#5C6B79;width:120px">Name</td><td style="padding:8px 0;color:#0C2A44"><strong>${data.name}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#5C6B79">Email</td><td style="padding:8px 0"><a href="mailto:${data.email}" style="color:#004F84">${data.email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#5C6B79">Phone</td><td style="padding:8px 0;color:#0C2A44">${data.phone ?? "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#5C6B79">Country</td><td style="padding:8px 0;color:#0C2A44">${data.country ?? "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#5C6B79;vertical-align:top">Message</td><td style="padding:8px 0;color:#0C2A44">${data.message.replace(/\n/g, "<br>")}</td></tr>
          </table>
          <hr style="border:1px solid #ECE3D2;margin:24px 0">
          <p style="color:#5C6B79;font-size:12px">Submitted via nayaneducational.com</p>
        </div>
      `,
    });
  } catch (err) {
    // Non-fatal — submission is already saved in Supabase
    console.error("sendContactNotification failed:", err);
  }
}
