import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { ContactSubmissionRow } from "@/lib/types";

// Admin-only: read every contact form submission, newest first.
// ip_hash is deliberately excluded — admins never need it.
export async function getContactSubmissions(): Promise<ContactSubmissionRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("id, name, email, phone, country, message, consented, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getContactSubmissions:", error.message);
    return [];
  }
  return data ?? [];
}
