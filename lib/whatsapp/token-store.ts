import "server-only";

import { Redis } from "@upstash/redis";

import { decryptSecret } from "./crypto";

let redis: Redis | null = null;
let initialised = false;

function getRedis(): Redis {
  if (initialised && redis) return redis;
  initialised = true;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      "KV_REST_API_URL / KV_REST_API_TOKEN manquants. Configure Upstash Redis dans Vercel.",
    );
  }

  redis = new Redis({ url, token });
  return redis;
}

const CONNECTION_PREFIX = "whatsapp:connection:";
const ACTIVE_KEY = "whatsapp:active";

export interface StoredConnection {
  phoneNumberId: string;
  wabaId: string;
  displayPhoneNumber: string;
  verifiedName: string | null;
  scopes: string[];
  expiresAt: string | null;
  connectedAt: string;
  /** ID du document Sanity ayant déclenché la connexion (audit). */
  sanityUserId: string | null;
}

interface StoredConnectionWithToken extends StoredConnection {
  encryptedToken: string;
}

function key(phoneNumberId: string): string {
  return `${CONNECTION_PREFIX}${phoneNumberId}`;
}

function toPublicView(stored: StoredConnectionWithToken): StoredConnection {
  return {
    phoneNumberId: stored.phoneNumberId,
    wabaId: stored.wabaId,
    displayPhoneNumber: stored.displayPhoneNumber,
    verifiedName: stored.verifiedName,
    scopes: stored.scopes,
    expiresAt: stored.expiresAt,
    connectedAt: stored.connectedAt,
    sanityUserId: stored.sanityUserId,
  };
}

export async function getActiveConnection(): Promise<StoredConnection | null> {
  const r = getRedis();
  const activeId = await r.get<string>(ACTIVE_KEY);
  if (!activeId) return null;

  const stored = await r.get<StoredConnectionWithToken>(key(activeId));
  if (!stored) return null;

  return toPublicView(stored);
}

/**
 * Récupère le token déchiffré pour usage côté worker IA / webhook.
 * Server-only. Ne JAMAIS exposer ce token côté client.
 */
export async function getActiveAccessToken(): Promise<{
  phoneNumberId: string;
  wabaId: string;
  accessToken: string;
} | null> {
  const r = getRedis();
  const activeId = await r.get<string>(ACTIVE_KEY);
  if (!activeId) return null;

  const stored = await r.get<StoredConnectionWithToken>(key(activeId));
  if (!stored) return null;

  return {
    phoneNumberId: stored.phoneNumberId,
    wabaId: stored.wabaId,
    accessToken: decryptSecret(stored.encryptedToken),
  };
}

