import "server-only";
import { createServiceClient } from "@/lib/supabase/service";
import type { Testimonial } from "@/lib/types";

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllTestimonials:", error.message);
    return [];
  }
  return data ?? [];
}
