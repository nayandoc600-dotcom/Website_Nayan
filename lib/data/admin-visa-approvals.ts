import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { VisaApproval } from "@/lib/types";

export async function getAllVisaApprovals(): Promise<VisaApproval[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("visa_approvals")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllVisaApprovals:", error.message);
    return [];
  }
  return data ?? [];
}
