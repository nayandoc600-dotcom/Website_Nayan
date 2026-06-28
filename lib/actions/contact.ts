"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { verifyTurnstile } from "@/lib/integrations/turnstile";
import { sendContactNotification } from "@/lib/integrations/email";
import { appendToSheet } from "@/lib/integrations/sheets";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; error: string };

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().max(30).optional().transform((v) => v || null),
  country: z.string().max(100).optional().transform((v) => v || null),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  consented: z.literal("on", { error: "You must accept the privacy notice." }),
  "cf-turnstile-response": z.string().min(1, "Please complete the security check."),
});

async function hashIp(ip: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const RATE_LIMIT = 3; // max submissions per IP per hour

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot — silent reject (bots fill this, humans don't see it)
  if (formData.get("website")) {
    return { status: "success" }; // fake success so bots don't retry
  }

  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0].message };
  }

  const { "cf-turnstile-response": turnstileToken, consented: _, ...fields } =
    parsed.data;

  // Get client IP
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Verify Turnstile
  const turnstileOk = await verifyTurnstile(turnstileToken, ip);
  if (!turnstileOk) {
    return { status: "error", error: "Security check failed. Please try again." };
  }

  // Rate limit by IP (3 submissions per hour)
  const ipHash = await hashIp(ip);
  const supabase = createServiceClient();

  const { count } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gt("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());

  if ((count ?? 0) >= RATE_LIMIT) {
    return {
      status: "error",
      error: "Too many submissions. Please try again later or call us directly.",
    };
  }

  // Write to Supabase — source of truth, must succeed
  const { error: dbError } = await supabase.from("contact_submissions").insert({
    name: fields.name,
    email: fields.email,
    phone: fields.phone,
    country: fields.country,
    message: fields.message,
    consented: true,
    ip_hash: ipHash,
  });

  if (dbError) {
    console.error("contact_submissions insert:", dbError.message);
    return { status: "error", error: "Something went wrong. Please try again." };
  }

  // Mirror to Sheets + notify via email — non-blocking, failures are logged.
  // The email includes the raw IP + submission time (admin-only); the DB only
  // ever stores the hashed IP.
  void Promise.allSettled([
    sendContactNotification({
      ...fields,
      ip: ip === "unknown" ? null : ip,
      submittedAt: new Date().toISOString(),
    }),
    appendToSheet(fields),
  ]);

  return { status: "success" };
}
