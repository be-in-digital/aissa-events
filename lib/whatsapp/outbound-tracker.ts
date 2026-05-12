import "server-only";

import { Redis } from "@upstash/redis";

/**
 * Garde une trace des wamid envoyés par notre API pour pouvoir distinguer
 * les echoes « c'est nous » (à ignorer) des echoes « c'est Aïssa qui répond
 * depuis son téléphone » (qui doivent déclencher human_takeover).
 *
 * TTL de 24h : largement suffisant car les echoes Meta arrivent en
 * quelques secondes après le send.
 */

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

const PREFIX = "whatsapp:sent_wamid:";
const TTL_SECONDS = 24 * 60 * 60;

export async function trackOutboundMessage(wamid: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  await r.set(`${PREFIX}${wamid}`, "1", { ex: TTL_SECONDS });
}

export async function isTrackedOutbound(wamid: string): Promise<boolean> {
  const r = getRedis();
  if (!r) return false;
  const val = await r.get(`${PREFIX}${wamid}`);
  return val !== null;
}
