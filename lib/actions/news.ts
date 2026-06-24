"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

type ActionResult = { ok: true } | { ok: false; error: string };

async function assertAuthenticated(): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Unauthorized" };
  return { ok: true };
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  body: z.string().min(1, "Body is required"),
  published: z.boolean(),
});

export async function createNewsPost(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return auth;

  const parsed = PostSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    published: formData.get("published") === "true",
  });

  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const supabase = createServiceClient();
  const base = slugify(parsed.data.title);
  const slug = `${base}-${Date.now()}`;

  const { error } = await supabase.from("news_posts").insert({
    ...parsed.data,
    slug,
    published_at: parsed.data.published ? new Date().toISOString() : null,
  });

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/news");
  revalidatePath("/news");
  redirect("/admin/news");
}

export async function updateNewsPost(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return auth;

  const id = formData.get("id") as string | null;
  if (!z.string().uuid().safeParse(id).success)
    return { ok: false, error: "Invalid ID" };

  const parsed = PostSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    published: formData.get("published") === "true",
  });

  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const supabase = createServiceClient();
  const existing = await supabase
    .from("news_posts")
    .select("published, published_at, slug")
    .eq("id", id!)
    .maybeSingle();

  const wasPublished = existing.data?.published ?? false;
  const publishedAt =
    parsed.data.published && !wasPublished
      ? new Date().toISOString()
      : existing.data?.published_at ?? null;

  const { error } = await supabase
    .from("news_posts")
    .update({ ...parsed.data, published_at: publishedAt })
    .eq("id", id!);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/news");
  revalidatePath("/news");
  if (existing.data?.slug) revalidatePath(`/news/${existing.data.slug}`);
  return { ok: true };
}

export async function deleteNewsPost(id: string): Promise<void> {
  const auth = await assertAuthenticated();
  if (!auth.ok) return;

  if (!z.string().uuid().safeParse(id).success) return;

  const supabase = createServiceClient();
  // Grab the slug first so we can revalidate the public post page too
  const { data: row } = await supabase
    .from("news_posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("news_posts").delete().eq("id", id);
  if (error) { console.error("deleteNewsPost:", error.message); return; }

  revalidatePath("/admin/news");
  revalidatePath("/news");
  if (row?.slug) revalidatePath(`/news/${row.slug}`);
}
