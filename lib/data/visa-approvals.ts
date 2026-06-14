import { createClient } from "@/lib/supabase/server";
import type { VisaApproval } from "@/lib/types";

export async function getRecentVisaApprovals(): Promise<VisaApproval[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_approvals")
    .select("*")
    .gt("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getRecentVisaApprovals:", error.message);
    return [];
  }
  return data ?? [];
}
