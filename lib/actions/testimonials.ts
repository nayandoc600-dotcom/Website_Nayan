"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export type TestimonialSubmitState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; error: string };

const SubmitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().max(150).optional().transform((v) => v || ""),
  body: z.string().min(10, "Please write at least 10 characters.").max(1000),
});

export async function submitTestimonial(
  _prev: TestimonialSubmitState,
  formData: FormData,
): Promise<TestimonialSubmitState> {
  if (formData.get("website")) return { status: "success" }; // honeypot

  const parsed = SubmitSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { status: "error", error: parsed.error.issues[0].message };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("testimonials").insert({
    name: parsed.data.name,
    role: parsed.data.role,
    body: parsed.data.body,
    approved: false,
  });

  if (error) {
    console.error("submitTestimonial:", error.message);
    return { status: "error", error: "Something went wrong. Please try again." };
  }

  return { status: "success" };
}

async function assertAuthenticated(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

const IdSchema = z.string().uuid();

export async function approveTestimonial(id: string): Promise<void> {
  if (!(await assertAuthenticated())) return;
  if (!IdSchema.safeParse(id).success) return;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ approved: true })
    .eq("id", id);

  if (error) { console.error("approveTestimonial:", error.message); return; }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function hideTestimonial(id: string): Promise<void> {
  if (!(await assertAuthenticated())) return;
  if (!IdSchema.safeParse(id).success) return;

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ approved: false })
    .eq("id", id);

  if (error) { console.error("hideTestimonial:", error.message); return; }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!(await assertAuthenticated())) return;
  if (!IdSchema.safeParse(id).success) return;

  const supabase = createServiceClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) { console.error("deleteTestimonial:", error.message); return; }

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
