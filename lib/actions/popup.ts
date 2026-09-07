"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { detectMime } from "@/lib/utils/mime";

type ActionResult = { ok: true } | { ok: false; error: string };

async function assertAuthenticated(): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };
  return { ok: true };
}

function revalidate() {
  revalidatePath("/admin/popup");
  // Popups are rendered in the marketing layout (every page), so revalidate the
  // whole tree under the root layout — not just the homepage.
  revalidatePath("/", "layout");
}

const MAX_IMAGE = 5 * 1024 * 1024; // 5 MB
const MAX_PDF = 10 * 1024 * 1024; // 10 MB

const PopupSchema = z.object({
  id: z.string().uuid().optional(),
  // Title and body are optional — many popups are just an image or a PDF.
  title: z.string().optional(),
  body: z.string().optional(),
  cta_label: z.string().optional(),
  // Accept either a relative path (e.g. /contact) or a full http(s) URL.
  cta_url: z
    .string()
    .trim()
    .refine(
      (v) => v === "" || v.startsWith("/") || /^https?:\/\/.+/.test(v),
      "CTA URL must be a path like /contact or a full https:// URL",
    )
    .optional(),
  active: z.boolean(),
  // Lowest first — decides the order visitors see multiple popups in.
  sort_order: z.coerce.number().int().min(0).max(999).optional(),
});

/**
 * Resolves what a media column should become:
 *   - a string  → a newly uploaded file's public URL
 *   - null      → the admin asked to remove the existing file
 *   - undefined → no change (keep whatever is already stored)
 */
async function resolveMedia(
  file: File | null,
  remove: boolean,
  allowed: Parameters<typeof detectMime>[1],
  maxSize: number,
  label: string,
): Promise<{ value: string | null | undefined } | { error: string }> {
  if (file && file.size > 0) {
    if (file.size > maxSize) {
      return { error: `${label} must be under ${Math.round(maxSize / 1024 / 1024)} MB.` };
    }
    const mime = await detectMime(file, allowed);
    if (!mime.ok) return { error: mime.error };

    const ext = mime.mime.split("/")[1] === "pdf" ? "pdf" : mime.mime.split("/")[1];
    const path = `${crypto.randomUUID()}.${ext}`;
    const supabase = createServiceClient();
    const { error: upErr } = await supabase.storage
      .from("popup-media")
      .upload(path, file, { contentType: mime.mime, upsert: false });
    if (upErr) return { error: upErr.message };

    const { data } = supabase.storage.from("popup-media").getPublicUrl(path);
    return { value: data.publicUrl };
  }
  if (remove) return { value: null };
  return { value: undefined };
}

export async function upsertPopup(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return auth;

  const parsed = PopupSchema.safeParse({
    id: formData.get("id") || undefined,
    title: formData.get("title"),
    body: formData.get("body"),
    cta_label: formData.get("cta_label") || undefined,
    cta_url: formData.get("cta_url") || undefined,
    active: formData.get("active") === "true",
    sort_order: formData.get("sort_order") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const { id, cta_label, cta_url, sort_order, ...rest } = parsed.data;

  // Resolve uploaded media (image + PDF)
  const image = await resolveMedia(
    formData.get("image") as File | null,
    formData.get("remove_image") === "on",
    ["image/jpeg", "image/png", "image/webp"],
    MAX_IMAGE,
    "Image",
  );
  if ("error" in image) return { ok: false, error: image.error };

  const pdf = await resolveMedia(
    formData.get("pdf") as File | null,
    formData.get("remove_pdf") === "on",
    ["application/pdf"],
    MAX_PDF,
    "PDF",
  );
  if ("error" in pdf) return { ok: false, error: pdf.error };

  const title = rest.title?.trim() ?? "";
  const body = rest.body?.trim() ?? "";

  // Don't allow creating a brand-new popup with no content at all.
  if (!id && !title && !body && typeof image.value !== "string" && typeof pdf.value !== "string") {
    return { ok: false, error: "Add a title, body, image, or PDF." };
  }

  const supabase = createServiceClient();

  if (id) {
    // Explicit payload — every editable column gets a concrete value so that
    // cleared fields actually persist (Supabase ignores `undefined`).
    const payload: Record<string, unknown> = {
      title,
      body,
      cta_label: cta_label || null,
      cta_url: cta_url || null,
      active: rest.active,
      sort_order: sort_order ?? 0,
      updated_at: new Date().toISOString(),
    };
    // Only touch media columns when the admin changed them.
    if (image.value !== undefined) payload.image_url = image.value;
    if (pdf.value !== undefined) payload.pdf_url = pdf.value;

    const { error } = await supabase.from("popup_notice").update(payload).eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    // New popup. Any other active popups stay active — visitors are shown all
    // of them in turn, ordered by sort_order.
    const { error } = await supabase.from("popup_notice").insert({
      title,
      body,
      cta_label: cta_label || null,
      cta_url: cta_url || null,
      active: rest.active,
      sort_order: sort_order ?? 0,
      image_url: image.value ?? null,
      pdf_url: pdf.value ?? null,
    });
    if (error) return { ok: false, error: error.message };
  }

  revalidate();
  return { ok: true };
}

/** Turns a popup-media public URL back into its storage object path. */
function storagePath(url: string | null | undefined): string | null {
  if (!url) return null;
  const marker = "/popup-media/";
  const at = url.indexOf(marker);
  return at === -1 ? null : decodeURIComponent(url.slice(at + marker.length));
}

export async function deletePopup(id: string): Promise<void> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return;
  if (!z.string().uuid().safeParse(id).success) return;

  const supabase = createServiceClient();

  const { data: row } = await supabase
    .from("popup_notice")
    .select("image_url, pdf_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("popup_notice").delete().eq("id", id);
  if (error) {
    console.error("deletePopup:", error.message);
    return;
  }

  // Drop the popup's uploaded media so the bucket doesn't collect orphans.
  const paths = [storagePath(row?.image_url), storagePath(row?.pdf_url)].filter(
    (p): p is string => Boolean(p),
  );
  if (paths.length) await supabase.storage.from("popup-media").remove(paths);

  revalidate();
}
