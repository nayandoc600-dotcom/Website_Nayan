import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { GalleryPhoto } from "@/lib/types";

export async function getAllGalleryPhotos(): Promise<GalleryPhoto[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("id, image_path, caption, category, sort_order, created_at, updated_at")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getAllGalleryPhotos:", error.message);
    return [];
  }
  return (data ?? []).map((p) => ({
    ...p,
    image_url: supabase.storage.from("gallery").getPublicUrl(p.image_path).data.publicUrl,
  }));
}
