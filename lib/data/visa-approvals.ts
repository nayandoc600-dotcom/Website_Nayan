import { createClient } from "@/lib/supabase/server";
import type { VisaApproval } from "@/lib/types";

/**
 * Every visa approval, newest first. Approvals used to drop off the public site
 * after 7 days; they now stay up until an admin deletes them.
 */
export async function getVisaApprovals(): Promise<VisaApproval[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("visa_approvals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getVisaApprovals:", error.message);
    return [];
  }
  return data ?? [];
}
