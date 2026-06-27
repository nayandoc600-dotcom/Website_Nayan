"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function deleteContactSubmission(id: string): Promise<void> {
  // Auth check — only signed-in admins may delete.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  if (!z.string().uuid().safeParse(id).success) return;

  const service = createServiceClient();
  const { error } = await service
    .from("contact_submissions")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("deleteContactSubmission:", error.message);
    return;
  }

  revalidatePath("/admin/queries");
}
