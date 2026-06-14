import { createClient } from "@/lib/supabase/server";
import type { PopupNotice } from "@/lib/types";

export async function getActivePopup(): Promise<PopupNotice | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("popup_notice")
    .select("*")
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getActivePopup:", error.message);
    return null;
  }
  return data;
}
