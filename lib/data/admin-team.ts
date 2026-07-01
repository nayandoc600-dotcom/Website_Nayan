import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { TeamMember } from "@/lib/types";

const COLUMNS = "id, name, title, photo_path, sort_order, created_at, updated_at";

export async function getAllTeamMembers(): Promise<TeamMember[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("team_members")
    .select(COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getAllTeamMembers:", error.message);
    return [];
  }
  return (data ?? []).map((m) => ({
    ...m,
    photo_url: supabase.storage.from("team").getPublicUrl(m.photo_path).data.publicUrl,
  }));
}

export async function getTeamMember(id: string): Promise<TeamMember | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("team_members")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getTeamMember:", error.message);
    return null;
  }
  if (!data) return null;
  return {
    ...data,
    photo_url: supabase.storage.from("team").getPublicUrl(data.photo_path).data.publicUrl,
  };
}
