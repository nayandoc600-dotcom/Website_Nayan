import { createClient } from "@/lib/supabase/server";
import type { PublicStudyMaterial } from "@/lib/types";

// Public listing — deliberately excludes file_url / storage_path so the browser
// never receives a direct download link. Access is granted only through the
// lead-gated server action, which mints a short-lived signed URL.
export async function getStudyMaterials(): Promise<PublicStudyMaterial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_materials")
    .select("id, title, country, size_bytes, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getStudyMaterials:", error.message);
    return [];
  }
  return data ?? [];
}
