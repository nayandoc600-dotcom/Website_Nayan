import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/types";

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getApprovedTestimonials:", error.message);
    return [];
  }
  return data ?? [];
}
