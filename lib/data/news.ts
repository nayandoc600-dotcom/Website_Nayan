import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { NewsPost } from "@/lib/types";

// These read public, published content and run in contexts that have no HTTP
// request (e.g. generateStaticParams at build time), so they use the cookie-free
// service client rather than the SSR (cookie-based) client. The `published`
// filter keeps the result limited to publicly visible posts.

export async function getPublishedNewsPosts(): Promise<NewsPost[]> {
  const supabase = createServiceClient();
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

export async function getPublishedNewsSlugs(): Promise<string[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("slug")
    .eq("published", true);

  if (error) {
    console.error("getPublishedNewsSlugs:", error.message);
    return [];
  }
  return (data ?? []).map((r) => r.slug);
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("getNewsPost:", error.message);
    return null;
  }
  return data;
}
