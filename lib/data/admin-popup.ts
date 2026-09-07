import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { PopupNotice } from "@/lib/types";

/** Every popup, active or not, in the order visitors would see them. */
export async function getPopupNotices(): Promise<PopupNotice[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("popup_notice")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getPopupNotices:", error.message);
    return [];
  }
  return data ?? [];
}
