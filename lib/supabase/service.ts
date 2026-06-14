import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

// Service-role client — server-only. Never import this in client components.
// Has full DB access and bypasses RLS — use only for trusted admin operations.
export function createServiceClient() {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
