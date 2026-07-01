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

const FieldsSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  title: z.string().trim().min(1, "Title is required").max(100),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

// Uploads an image to the `team` bucket and returns the stored object path.
async function uploadPhoto(
  file: File,
): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  if (file.size > MAX_SIZE) return { ok: false, error: "Image must be under 5 MB." };
  const mime = await detectMime(file, [...IMAGE_MIMES]);
  if (!mime.ok) return { ok: false, error: mime.error };

  const path = `${crypto.randomUUID()}.${mime.mime.split("/")[1]}`;
  const supabase = createServiceClient();
  const { error } = await supabase.storage
    .from("team")
    .upload(path, file, { contentType: mime.mime, upsert: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, path };
}

export async function createTeamMember(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return auth;

  const parsed = FieldsSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title"),
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) return { ok: false, error: "A photo is required." };

  const upload = await uploadPhoto(file);
  if (!upload.ok) return upload;

  const supabase = createServiceClient();
  const { error } = await supabase.from("team_members").insert({
    name: parsed.data.name,
    title: parsed.data.title,
    sort_order: parsed.data.sort_order,
    photo_path: upload.path,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/about");
  return { ok: true };
}

export async function updateTeamMember(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return auth;

  const id = formData.get("id");
  if (!z.string().uuid().safeParse(id).success) {
    return { ok: false, error: "Invalid member." };
  }

  const parsed = FieldsSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title"),
    sort_order: formData.get("sort_order") || 0,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const supabase = createServiceClient();

  const payload: Record<string, unknown> = {
    name: parsed.data.name,
    title: parsed.data.title,
    sort_order: parsed.data.sort_order,
    updated_at: new Date().toISOString(),
  };

  // Optional photo replace: upload the new one, then remove the old object.
  const file = formData.get("photo") as File | null;
  let oldPath: string | null = null;
  if (file && file.size > 0) {
    const { data: row } = await supabase
      .from("team_members")
      .select("photo_path")
      .eq("id", id as string)
      .maybeSingle();
    oldPath = row?.photo_path ?? null;

    const upload = await uploadPhoto(file);
    if (!upload.ok) return upload;
    payload.photo_path = upload.path;
  }

  const { error } = await supabase
    .from("team_members")
    .update(payload)
    .eq("id", id as string);
  if (error) return { ok: false, error: error.message };

  if (oldPath) {
    await supabase.storage.from("team").remove([oldPath]);
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/about");
  return { ok: true };
}

export async function deleteTeamMember(id: string): Promise<void> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return;
  if (!z.string().uuid().safeParse(id).success) return;

  const supabase = createServiceClient();

  const { data: row } = await supabase
    .from("team_members")
    .select("photo_path")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) { console.error("deleteTeamMember:", error.message); return; }

  if (row?.photo_path) {
    await supabase.storage.from("team").remove([row.photo_path]);
  }

  revalidatePath("/admin/team");
  revalidatePath("/team");
  revalidatePath("/about");
}
