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

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function uploadVisaApproval(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return auth;

  const file = formData.get("image") as File | null;
  const student = (formData.get("student") as string | null)?.trim() || null;

  if (!file || file.size === 0) return { ok: false, error: "No file selected." };
  if (file.size > MAX_SIZE) return { ok: false, error: "File must be under 5 MB." };

  const mime = await detectMime(file, ["image/jpeg", "image/png", "image/webp"]);
  if (!mime.ok) return { ok: false, error: mime.error };

  const ext = mime.mime.split("/")[1];
  const path = `${crypto.randomUUID()}.${ext}`;

  const supabase = createServiceClient();

  const { error: uploadError } = await supabase.storage
    .from("visa-approvals")
    .upload(path, file, { contentType: mime.mime, upsert: false });

  if (uploadError) return { ok: false, error: uploadError.message };

  const {
    data: { publicUrl },
  } = supabase.storage.from("visa-approvals").getPublicUrl(path);

  const { error: dbError } = await supabase
    .from("visa_approvals")
    .insert({ image_url: publicUrl, student });

  if (dbError) return { ok: false, error: dbError.message };

  revalidatePath("/admin/visa-approvals");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteVisaApproval(id: string): Promise<void> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return;

  if (!z.string().uuid().safeParse(id).success) return;

  const supabase = createServiceClient();

  // Get the row so we can also remove the storage object
  const { data: row } = await supabase
    .from("visa_approvals")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("visa_approvals").delete().eq("id", id);
  if (error) { console.error("deleteVisaApproval:", error.message); return; }

  // Best-effort: remove from storage
  if (row?.image_url) {
    const url = new URL(row.image_url);
    const parts = url.pathname.split("/storage/v1/object/public/visa-approvals/");
    if (parts[1]) {
      await supabase.storage.from("visa-approvals").remove([parts[1]]);
    }
  }

  revalidatePath("/admin/visa-approvals");
  revalidatePath("/");
}
