import "server-only";
import { checkRateLimit, Ratelimit, type RateLimitResult } from "@/lib/rate-limit";

/**
 * Rate-limit du formulaire de contact : 5 soumissions / heure / IP.
 */
export async function checkContactRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  return checkRateLimit({
    identifier,
    prefix: "aissa:contact",
    limiter: Ratelimit.slidingWindow(5, "1 h"),
  });
}
