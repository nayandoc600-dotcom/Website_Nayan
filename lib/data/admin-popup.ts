import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { PopupNotice } from "@/lib/types";

export async function getPopupNotice(): Promise<PopupNotice | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("popup_notice")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getPopupNotice:", error.message);
    return null;
  }
  return data;
}
