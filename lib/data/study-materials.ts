import { createClient } from "@/lib/supabase/server";
import type { StudyMaterial } from "@/lib/types";

export async function getStudyMaterials(): Promise<StudyMaterial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_materials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getStudyMaterials:", error.message);
    return [];
  }
  return data ?? [];
}
