import "server-only";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/**
 * Factory de rate-limit Upstash, réutilisable par plusieurs surfaces
 * (formulaire de contact, routes admin blog, webhook Meta, etc.).
 *
 * Si `KV_REST_API_URL` / `KV_REST_API_TOKEN` manquent, retourne `null` et le
 * helper de check renverra `success: true` (rate-limit désactivé, warn en prod).
 */

type Limiter = ReturnType<typeof Ratelimit.slidingWindow>;

type Options = {
  prefix: string;
  limiter: Limiter;
};

const cache = new Map<string, Ratelimit | null>();

function getRatelimit({ prefix, limiter }: Options): Ratelimit | null {
  if (cache.has(prefix)) return cache.get(prefix) ?? null;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        `[rate-limit:${prefix}] KV_REST_API_URL / KV_REST_API_TOKEN manquants : rate-limit DÉSACTIVÉ.`,
      );
    }
    cache.set(prefix, null);
    return null;
  }

  const redis = new Redis({ url, token });
  const rl = new Ratelimit({
    redis,
    limiter,
    analytics: true,
    prefix,
  });
  cache.set(prefix, rl);
  return rl;
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
  configured: boolean;
};

export async function checkRateLimit(
  options: Options & { identifier: string },
): Promise<RateLimitResult> {
  const rl = getRatelimit(options);
  if (!rl) {
    return { success: true, remaining: -1, reset: 0, configured: false };
  }
  const { success, remaining, reset } = await rl.limit(options.identifier);
  return { success, remaining, reset, configured: true };
}

export { Ratelimit };
