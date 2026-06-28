"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

// Admin-only: remove a lead/download record (e.g. obvious spam).
export async function deleteMaterialLead(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  if (!z.string().uuid().safeParse(id).success) return;

  const service = createServiceClient();
  const { error } = await service.from("study_material_leads").delete().eq("id", id);
  if (error) {
    console.error("deleteMaterialLead:", error.message);
    return;
  }
  revalidatePath("/admin/material-leads");
}
