import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { StudyMaterial } from "@/lib/types";

export async function getAllStudyMaterials(): Promise<StudyMaterial[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("study_materials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllStudyMaterials:", error.message);
    return [];
  }
  return data ?? [];
}
