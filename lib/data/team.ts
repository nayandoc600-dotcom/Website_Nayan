import { createClient } from "@/lib/supabase/server";
import type { TeamMember } from "@/lib/types";

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("id, name, title, photo_path, sort_order, created_at, updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getTeamMembers:", error.message);
    return [];
  }
  return (data ?? []).map((m) => ({
    ...m,
    photo_url: supabase.storage.from("team").getPublicUrl(m.photo_path).data.publicUrl,
  }));
}
