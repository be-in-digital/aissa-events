import "server-only";

import { Redis } from "@upstash/redis";

import type { Channel } from "./types";
import type { HistoryEntry } from "./hubspot-history";

/**
 * Historique conversationnel court-terme stocké dans Upstash Redis.
 *
 * Pourquoi pas HubSpot : le scope `crm.objects.notes.*` n'est pas dispo en
 * Free tier. Upstash est de toute façon plus rapide (~10ms vs ~200ms pour
 * HubSpot) et adapté à un cache court-terme.
 *
 * Clé Redis : `whatsapp:history:{contactRef}` → liste de N derniers tours
 * (entrée user + sortie assistant). TTL 7 jours, glissant à chaque écriture.
 *
 * HubSpot reste la source canonique du CRM (contact + deal + props), mais
 * l'historique conversationnel vit dans Upstash.
 */

const MAX_TURNS = 30;
const HISTORY_TTL_SECONDS = 7 * 24 * 3600; // 7 jours

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

function key(contactRef: string): string {
  return `whatsapp:history:${contactRef}`;
}

interface StoredEntry {
  role: "user" | "assistant";
  text: string;
  channel?: Channel;
  ts: string;
}

function toHistoryEntry(stored: StoredEntry): HistoryEntry {
  return {
    role: stored.role,
    text: stored.text,
    channel: stored.channel,
    timestamp: new Date(stored.ts),
  };
}

function safeParseEntry(raw: unknown): StoredEntry | null {
  // Le SDK @upstash/redis auto-parse normalement les objets stockés via rpush,
  // mais selon la version certaines listes reviennent en strings. On gère les
  // deux cas pour rester robuste.
  if (raw && typeof raw === "object" && "role" in raw) {
    return raw as StoredEntry;
  }
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as StoredEntry;
    } catch {
      return null;
    }
  }
  return null;
}

export async function getConversationHistory(
  contactRef: string,
): Promise<HistoryEntry[]> {
  const r = getRedis();
  if (!r) return [];
  try {
    const raw = await r.lrange(key(contactRef), 0, -1);
    return (raw ?? [])
      .map(safeParseEntry)
      .filter((e): e is StoredEntry => e !== null)
      .map(toHistoryEntry);
  } catch (err) {
    console.error("[conversation-store] lecture échouée :", err);
    return [];
  }
}

async function append(
  contactRef: string,
  entry: StoredEntry,
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  const k = key(contactRef);
  await r.rpush(k, entry);
  // garde uniquement les MAX_TURNS dernières entrées
  await r.ltrim(k, -MAX_TURNS, -1);
  await r.expire(k, HISTORY_TTL_SECONDS);
}

export async function appendIncoming(args: {
  contactRef: string;
  text: string;
  channel: Channel;
  timestamp: Date;
}): Promise<void> {
  await append(args.contactRef, {
    role: "user",
    text: args.text,
    channel: args.channel,
    ts: args.timestamp.toISOString(),
  });
}

export async function appendOutgoing(args: {
  contactRef: string;
  text: string;
  channel: Channel;
}): Promise<void> {
  await append(args.contactRef, {
    role: "assistant",
    text: args.text,
    channel: args.channel,
    ts: new Date().toISOString(),
  });
}
