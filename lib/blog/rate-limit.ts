import "server-only";
import { checkRateLimit, Ratelimit, type RateLimitResult } from "@/lib/rate-limit";

/**
 * Rate-limit des routes /api/admin/blog/* : 20 requêtes / minute / IP.
 *
 * Le token `BLOG_AI_ADMIN_SECRET` étant partagé entre tous les utilisateurs
 * Studio (et exposé côté client via `NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN`), on
 * couple l'auth Bearer à un rate-limit par IP pour borner les coûts en cas
 * de fuite du token ou d'abus accidentel.
 */
export async function checkBlogAdminRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  return checkRateLimit({
    identifier,
    prefix: "aissa:blog-admin",
    limiter: Ratelimit.slidingWindow(20, "1 m"),
  });
}
