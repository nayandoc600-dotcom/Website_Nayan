"use server";

import { cookies, headers } from "next/headers";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/service";
import { QUALIFICATIONS } from "@/lib/study-material-options";

export type DownloadState =
  | { status: "idle" }
  // No unlock cookie yet — the client should open the lead form.
  | { status: "need_form" }
  | { status: "success"; url: string }
  | { status: "error"; error: string };

const COOKIE_NAME = "nayan_sm_lead";
const COOKIE_DAYS = 30;
const SIGNED_URL_TTL = 60; // seconds — short-lived by design
const RATE_LIMIT = 30; // downloads per IP per hour

const LeadSchema = z.object({
  material_id: z.string().uuid(),
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(5, "Enter a valid phone number").max(30),
  preferred_country: z.string().trim().max(100).optional().transform((v) => v || null),
  qualification: z.enum(QUALIFICATIONS),
});

async function hashIp(ip: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signFor(materialId: string): Promise<
  { ok: true; url: string; title: string } | { ok: false; error: string }
> {
  const supabase = createServiceClient();
  const { data: material } = await supabase
    .from("study_materials")
    .select("storage_path, file_url, title")
    .eq("id", materialId)
    .maybeSingle();

  if (!material) return { ok: false, error: "This material is no longer available." };

  if (material.storage_path) {
    const { data: signed } = await supabase.storage
      .from("study-materials")
      .createSignedUrl(material.storage_path, SIGNED_URL_TTL, { download: true });
    if (signed?.signedUrl) {
      return { ok: true, url: signed.signedUrl, title: material.title };
    }
  }
  // Legacy rows that predate storage_path keep a stored URL.
  if (material.file_url) return { ok: true, url: material.file_url, title: material.title };
  return { ok: false, error: "This material is no longer available." };
}

export async function requestStudyMaterial(
  _prev: DownloadState,
  formData: FormData,
): Promise<DownloadState> {
  const materialId = String(formData.get("material_id") ?? "");
  if (!z.string().uuid().safeParse(materialId).success) {
    return { status: "error", error: "Invalid request." };
  }

  const supabase = createServiceClient();
  const cookieStore = await cookies();
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = headersList.get("user-agent")?.slice(0, 500) ?? null;

  // Rate limit downloads per IP (defence against scraping the whole library).
  const ipHash = await hashIp(ip);
  const { count } = await supabase
    .from("study_material_leads")
    .select("*", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gt("created_at", new Date(Date.now() - 60 * 60 * 1000).toISOString());
  if ((count ?? 0) >= RATE_LIMIT) {
    return { status: "error", error: "Too many downloads. Please try again later." };
  }

  // ── Already unlocked? (valid lead cookie) ──────────────────────────────────
  const existingLeadId = cookieStore.get(COOKIE_NAME)?.value;
  if (existingLeadId && z.string().uuid().safeParse(existingLeadId).success) {
    const { data: lead } = await supabase
      .from("study_material_leads")
      .select("name, email, phone, preferred_country, qualification")
      .eq("id", existingLeadId)
      .maybeSingle();

    if (lead) {
      const signed = await signFor(materialId);
      if (!signed.ok) return { status: "error", error: signed.error };

      // Log this download against the known person (one row per download).
      await supabase.from("study_material_leads").insert({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        preferred_country: lead.preferred_country,
        qualification: lead.qualification,
        material_id: materialId,
        material_title: signed.title,
        ip_hash: ipHash,
        user_agent: userAgent,
      });
      return { status: "success", url: signed.url };
    }
    // Stale/invalid cookie — fall through to the form.
  }

  // ── No form data yet → tell the client to show the lead form ───────────────
  if (!formData.get("name") && !formData.get("phone")) {
    return { status: "need_form" };
  }

  // ── First-time unlock: validate + record the lead ──────────────────────────
  const parsed = LeadSchema.safeParse({
    material_id: materialId,
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    preferred_country: formData.get("preferred_country") || undefined,
    qualification: formData.get("qualification"),
  });
  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0].message };
  }

  const signed = await signFor(materialId);
  if (!signed.ok) return { status: "error", error: signed.error };

  const { data: inserted, error: insErr } = await supabase
    .from("study_material_leads")
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      preferred_country: parsed.data.preferred_country,
      qualification: parsed.data.qualification,
      material_id: materialId,
      material_title: signed.title,
      ip_hash: ipHash,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (insErr || !inserted) {
    console.error("study_material_leads insert:", insErr?.message);
    return { status: "error", error: "Something went wrong. Please try again." };
  }

  // Remember this person on the device so they don't refill the form. httpOnly
  // so it can't be read/forged in the browser; the value is an unguessable UUID.
  cookieStore.set(COOKIE_NAME, inserted.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_DAYS * 24 * 60 * 60,
  });

  return { status: "success", url: signed.url };
}
