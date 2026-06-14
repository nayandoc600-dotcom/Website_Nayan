"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

type ActionResult = { ok: true } | { ok: false; error: string };

async function assertAuthenticated(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };
  return { ok: true };
}

const PopupSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
  cta_label: z.string().optional(),
  cta_url: z.string().url("CTA URL must be a valid URL").or(z.literal("")).optional(),
  image_url: z.string().url("Image URL must be a valid URL").or(z.literal("")).optional(),
  active: z.boolean(),
});

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
    image_url: formData.get("image_url") || undefined,
    active: formData.get("active") === "true",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  const { id, ...fields } = parsed.data;
  const supabase = createServiceClient();

  if (id) {
    const { error } = await supabase
      .from("popup_notice")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    // Deactivate any existing active popup first
    await supabase
      .from("popup_notice")
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq("active", true);

    const { error } = await supabase.from("popup_notice").insert(fields);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/admin/popup");
  revalidatePath("/");
  return { ok: true };
}
