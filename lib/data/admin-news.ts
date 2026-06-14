import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { NewsPost } from "@/lib/types";

export async function getAllNewsPosts(): Promise<NewsPost[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllNewsPosts:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getNewsPost(id: string): Promise<NewsPost | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("getNewsPost:", error.message);
    return null;
  }
  return data;
}
