import "server-only";
import { env } from "@/env";

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: ip,
        }),
      },
    );
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
