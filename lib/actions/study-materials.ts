"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { detectMime } from "@/lib/utils/mime";

type ActionResult = { ok: true } | { ok: false; error: string };

async function assertAuthenticated(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };
  return { ok: true };
}

const MAX_SIZE = 25 * 1024 * 1024; // 25 MB

export async function uploadStudyMaterial(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return auth;

  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string | null)?.trim();
  const country = (formData.get("country") as string | null)?.trim() || null;

  if (!file || file.size === 0) return { ok: false, error: "No file selected." };
  if (!title) return { ok: false, error: "Title is required." };
  if (file.size > MAX_SIZE) return { ok: false, error: "File must be under 25 MB." };

  const mime = await detectMime(file, [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);
  if (!mime.ok) return { ok: false, error: mime.error };

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const supabase = createServiceClient();

  const { error: uploadError } = await supabase.storage
    .from("study-materials")
    .upload(path, file, { contentType: mime.mime, upsert: false });

  if (uploadError) return { ok: false, error: uploadError.message };

  const { data: signedData } = await supabase.storage
    .from("study-materials")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10); // 10-year signed URL

  const file_url = signedData?.signedUrl ?? path;

  const { error: dbError } = await supabase.from("study_materials").insert({
    title,
    file_url,
    country,
    size_bytes: file.size,
  });

  if (dbError) return { ok: false, error: dbError.message };

  revalidatePath("/admin/study-materials");
  revalidatePath("/study-materials");
  return { ok: true };
}

export async function deleteStudyMaterial(id: string): Promise<void> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return;

  if (!z.string().uuid().safeParse(id).success) return;

  const supabase = createServiceClient();
  const { error } = await supabase.from("study_materials").delete().eq("id", id);
  if (error) { console.error("deleteStudyMaterial:", error.message); return; }

  revalidatePath("/admin/study-materials");
  revalidatePath("/study-materials");
}
