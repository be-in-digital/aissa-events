import "server-only";
import { Redis } from "@upstash/redis";
import { checkRateLimit, Ratelimit, type RateLimitResult } from "@/lib/rate-limit";

/** Rate-limit des réservations : 5 tentatives / heure / IP. */
export async function checkBookingRateLimit(
  identifier: string,
): Promise<RateLimitResult> {
  return checkRateLimit({
    identifier,
    prefix: "aissa:booking",
    limiter: Ratelimit.slidingWindow(5, "1 h"),
  });
}

let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

/**
 * Verrou court sur un créneau pour réduire la fenêtre de course entre deux POST
 * simultanés sur le même slot. Best-effort : sans Upstash configuré, renvoie
 * `true` (on s'appuie alors sur la re-vérification Sanity au moment de créer).
 *
 * Renvoie `false` si un autre POST détient déjà le verrou → le handler doit
 * répondre 409 (créneau en cours de réservation).
 */
export async function acquireSlotLock(startIso: string): Promise<boolean> {
  const client = getRedis();
  if (!client) return true;
  const key = `aissa:booking:lock:${startIso}`;
  // SET NX EX 30s — si la clé existe déjà, `set` renvoie null.
  const res = await client.set(key, "1", { nx: true, ex: 30 });
  return res === "OK";
}

export async function releaseSlotLock(startIso: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  await client.del(`aissa:booking:lock:${startIso}`).catch(() => {});
}
