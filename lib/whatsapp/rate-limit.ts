import "server-only";
import { checkRateLimit, Ratelimit, type RateLimitResult } from "@/lib/rate-limit";

/**
 * Rate-limit du webhook Meta : 60 messages / minute / numéro.
 *
 * La signature Meta est déjà vérifiée en amont — ce rate-limit ne sert pas à
 * bloquer un attaquant externe (impossible sans le secret) mais à se protéger
 * contre un abus côté utilisateur (flood depuis un même numéro) qui pourrait
 * faire exploser les coûts LLM en aval.
 */
export async function checkMetaWebhookRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  return checkRateLimit({
    identifier,
    prefix: "aissa:meta-webhook",
    limiter: Ratelimit.slidingWindow(60, "1 m"),
  });
}
