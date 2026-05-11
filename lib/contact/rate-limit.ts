import "server-only";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Rate-limit du formulaire de contact via Upstash Redis (compatible Vercel KV).
 *
 * Variables d'env requises :
 *  - KV_REST_API_URL (URL REST de Upstash/Vercel KV)
 *  - KV_REST_API_TOKEN (token avec permission read+write)
 *
 * Limite : 5 soumissions / heure / IP. Ajuste `slidingWindow()` si besoin.
 *
 * Si les variables sont manquantes, le rate-limit est désactivé (retourne
 * `success: true`). À configurer absolument avant la mise en production.
 */

let ratelimit: Ratelimit | null = null;
let configured = false;

function getRatelimit(): Ratelimit | null {
  if (configured) return ratelimit;
  configured = true;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[rate-limit] KV_REST_API_URL / KV_REST_API_TOKEN manquants : rate-limit DÉSACTIVÉ.",
      );
    }
    return null;
  }

  const redis = new Redis({ url, token });

  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
    prefix: "aissa:contact",
  });

  return ratelimit;
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
  configured: boolean;
};

export async function checkContactRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  const rl = getRatelimit();
  if (!rl) {
    return { success: true, remaining: -1, reset: 0, configured: false };
  }
  const { success, remaining, reset } = await rl.limit(identifier);
  return { success, remaining, reset, configured: true };
}
