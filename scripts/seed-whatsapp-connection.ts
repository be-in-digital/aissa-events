/**
 * Seed manuel d'une connexion WhatsApp Cloud API dans Upstash Redis.
 *
 * Contourne le flow Embedded Signup (qui n'est pas encore configuré) en
 * écrivant directement le token Meta chiffré dans le KV store. Permet de
 * tester l'agent IA en local avec un token temporaire 24h.
 *
 * Prérequis dans .env.local :
 *   - WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_BUSINESS_ACCOUNT_ID
 *   - WHATSAPP_TEST_SENDER_NUMBER (pour displayPhoneNumber)
 *   - META_ENCRYPTION_KEY (64 hex chars)
 *   - KV_REST_API_URL, KV_REST_API_TOKEN
 *
 * Usage : pnpm seed:whatsapp
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import {
  createCipheriv,
  randomBytes,
  type CipherGCM,
} from "node:crypto";
import { Redis } from "@upstash/redis";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

function encryptSecret(plaintext: string, keyHex: string): string {
  const key = Buffer.from(keyHex, "hex");
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv) as CipherGCM;
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return [
    "v1",
    iv.toString("base64url"),
    ciphertext.toString("base64url"),
    authTag.toString("base64url"),
  ].join(".");
}

async function main() {
  const required = [
    "WHATSAPP_ACCESS_TOKEN",
    "WHATSAPP_PHONE_NUMBER_ID",
    "WHATSAPP_BUSINESS_ACCOUNT_ID",
    "META_ENCRYPTION_KEY",
    "KV_REST_API_URL",
    "KV_REST_API_TOKEN",
  ] as const;

  for (const key of required) {
    if (!process.env[key]) {
      console.error(`❌ ${key} manquant dans .env.local`);
      process.exit(1);
    }
  }

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN!;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
  const wabaId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID!;
  const displayPhoneNumber = process.env.WHATSAPP_TEST_SENDER_NUMBER ?? "";
  const encryptionKey = process.env.META_ENCRYPTION_KEY!;

  const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });

  const connectedAt = new Date().toISOString();
  // Token temporaire de la WA Cloud API console expire en 24h
  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

  const stored = {
    phoneNumberId,
    wabaId,
    encryptedToken: encryptSecret(accessToken, encryptionKey),
    displayPhoneNumber,
    verifiedName: null,
    scopes: ["whatsapp_business_messaging", "whatsapp_business_management"],
    expiresAt,
    connectedAt,
    sanityUserId: null,
  };

  const connectionKey = `whatsapp:connection:${phoneNumberId}`;
  const activeKey = "whatsapp:active";

  await redis.set(connectionKey, stored);
  await redis.set(activeKey, phoneNumberId);

  console.log("✓ Connexion WhatsApp seedée dans Upstash :");
  console.log(`  - Active phone_number_id : ${phoneNumberId}`);
  console.log(`  - WABA id                : ${wabaId}`);
  console.log(`  - Display number         : ${displayPhoneNumber}`);
  console.log(`  - Expire le              : ${expiresAt}`);
  console.log(`  - Key                    : ${connectionKey}`);
}

main().catch((err) => {
  console.error("❌ Erreur seed :", err);
  process.exit(1);
});
