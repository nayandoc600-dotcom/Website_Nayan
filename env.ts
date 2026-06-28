import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    // Who enquiry notifications are sent from / to. Defaults suit production
    // (a verified nayanedu.com domain). For local testing on Resend's free tier
    // without a verified domain, set RESEND_FROM="onboarding@resend.dev" and
    // RESEND_TO=<your Resend account email>.
    RESEND_FROM: z.string().min(1).default("Nayan Website <noreply@nayanedu.com>"),
    RESEND_TO: z.string().email().default("info@nayanedu.com"),
    GOOGLE_SHEETS_CREDENTIALS: z.string().min(1),
    GOOGLE_SHEETS_SPREADSHEET_ID: z.string().min(1),
    CLOUDFLARE_TURNSTILE_SECRET_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY: z.string().min(1),
  },
  runtimeEnv: {
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    RESEND_TO: process.env.RESEND_TO,
    GOOGLE_SHEETS_CREDENTIALS: process.env.GOOGLE_SHEETS_CREDENTIALS,
    GOOGLE_SHEETS_SPREADSHEET_ID: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    CLOUDFLARE_TURNSTILE_SECRET_KEY:
      process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY:
      process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY,
  },
  skipValidation: process.env.NODE_ENV === "test",
});
