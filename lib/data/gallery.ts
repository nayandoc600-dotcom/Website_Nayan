import { createClient } from "@/lib/supabase/server";
import type { GalleryPhoto } from "@/lib/types";

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("id, image_path, caption, category, sort_order, created_at, updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getGalleryPhotos:", error.message);
    return [];
  }
  return (data ?? []).map((p) => ({
    ...p,
    image_url: supabase.storage.from("gallery").getPublicUrl(p.image_path).data.publicUrl,
  }));
}
