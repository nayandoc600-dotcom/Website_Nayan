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

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"] as const;

function revalidate() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/about");
}

export async function createGalleryPhoto(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return auth;

  const file = formData.get("image") as File | null;
  const caption = (formData.get("caption") as string | null)?.trim() || null;
  const sortOrder = z.coerce.number().int().min(0).max(9999).default(0)
    .safeParse(formData.get("sort_order") || 0);

  if (!file || file.size === 0) return { ok: false, error: "An image is required." };
  if (file.size > MAX_SIZE) return { ok: false, error: "Image must be under 5 MB." };
  if (caption && caption.length > 200) {
    return { ok: false, error: "Caption must be under 200 characters." };
  }

  const mime = await detectMime(file, [...IMAGE_MIMES]);
  if (!mime.ok) return { ok: false, error: mime.error };

  const path = `${crypto.randomUUID()}.${mime.mime.split("/")[1]}`;
  const supabase = createServiceClient();

  const { error: uploadError } = await supabase.storage
    .from("gallery")
    .upload(path, file, { contentType: mime.mime, upsert: false });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { error: dbError } = await supabase.from("gallery_photos").insert({
    image_path: path,
    caption,
    sort_order: sortOrder.success ? sortOrder.data : 0,
  });
  if (dbError) return { ok: false, error: dbError.message };

  revalidate();
  return { ok: true };
}

export async function updateGalleryCaption(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return auth;

  const id = formData.get("id");
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, error: "Invalid photo." };
  }
  const caption = (formData.get("caption") as string | null)?.trim() || null;
  if (caption && caption.length > 200) {
    return { ok: false, error: "Caption must be under 200 characters." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("gallery_photos")
    .update({ caption, updated_at: new Date().toISOString() })
    .eq("id", id as string);
  if (error) return { ok: false, error: error.message };

  revalidate();
  return { ok: true };
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return;
  if (!z.string().uuid().safeParse(id).success) return;

  const supabase = createServiceClient();

  const { data: row } = await supabase
    .from("gallery_photos")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("gallery_photos").delete().eq("id", id);
  if (error) { console.error("deleteGalleryPhoto:", error.message); return; }

  if (row?.image_path) {
    await supabase.storage.from("gallery").remove([row.image_path]);
  }

  revalidate();
}
