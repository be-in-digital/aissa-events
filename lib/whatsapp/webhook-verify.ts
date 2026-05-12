import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Vérifie la signature HMAC SHA256 d'un webhook Meta.
 *
 * Meta envoie un header `X-Hub-Signature-256: sha256=<hex>` qui est le HMAC
 * SHA256 du corps brut de la requête, signé avec l'App Secret Meta.
 *
 * @param rawBody Corps brut de la requête (lu via `await req.text()`).
 * @param signature Valeur du header `X-Hub-Signature-256`.
 * @returns true si la signature est valide.
 */
export function verifyMetaSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  if (!signature) return false;
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) return false;

  const match = signature.match(/^sha256=([a-f0-9]+)$/i);
  if (!match) return false;

  const expectedHex = createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex");

  const expected = Buffer.from(expectedHex, "hex");
  const received = Buffer.from(match[1], "hex");

  if (expected.length !== received.length) return false;
  return timingSafeEqual(expected, received);
}

/**
 * Vérifie le handshake GET de Meta (subscription du webhook).
 * Meta envoie `hub.mode=subscribe`, `hub.verify_token=<token>` et `hub.challenge=<random>`.
 * On retourne le challenge si le token matche `META_WEBHOOK_VERIFY_TOKEN`.
 */
export function handleHandshake(
  searchParams: URLSearchParams,
): { ok: true; challenge: string } | { ok: false; reason: string } {
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expected = process.env.META_WEBHOOK_VERIFY_TOKEN;
  if (!expected) {
    return { ok: false, reason: "META_WEBHOOK_VERIFY_TOKEN non configuré." };
  }
  if (mode !== "subscribe") {
    return { ok: false, reason: `mode invalide (${mode}).` };
  }
  if (token !== expected) {
    return { ok: false, reason: "verify_token invalide." };
  }
  if (!challenge) {
    return { ok: false, reason: "challenge manquant." };
  }
  return { ok: true, challenge };
}
