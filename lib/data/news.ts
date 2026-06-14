import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { NewsPost } from "@/lib/types";

export async function getPublishedNewsPosts(): Promise<NewsPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getPublishedNewsPosts:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) return null;
  return data;
}
