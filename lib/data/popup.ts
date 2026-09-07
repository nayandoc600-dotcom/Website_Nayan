import { createClient } from "@/lib/supabase/server";
import type { PopupNotice } from "@/lib/types";

/**
 * Every active popup, in the order visitors should see them. Several popups can
 * be active at once — the client shows them one after another.
 */
export async function getActivePopups(): Promise<PopupNotice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("popup_notice")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("getActivePopups:", error.message);
    return [];
  }
  return data ?? [];
}
