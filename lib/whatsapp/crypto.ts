import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  type CipherGCM,
  type DecipherGCM,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY_LENGTH = 32;

function loadKey(): Buffer {
  const hex = process.env.META_ENCRYPTION_KEY;
  if (!hex) {
    throw new Error(
      "META_ENCRYPTION_KEY non configurée. Générer avec : openssl rand -hex 32",
    );
  }
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error(
      "META_ENCRYPTION_KEY doit faire exactement 64 caractères hexadécimaux (32 octets).",
    );
  }
  return Buffer.from(hex, "hex");
}

/**
 * Chiffre un secret via AES-256-GCM.
 * Format de sortie : "v1.{iv_b64}.{ciphertext_b64}.{authTag_b64}".
 * Le préfixe `v1.` permet une rotation de schéma future.
 */
export function encryptSecret(plaintext: string): string {
  const key = loadKey();
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

/**
 * Déchiffre un secret chiffré par `encryptSecret`.
 * Lève une erreur si le format est invalide ou si l'authTag ne matche pas.
 */
export function decryptSecret(payload: string): string {
  const parts = payload.split(".");
  if (parts.length !== 4 || parts[0] !== "v1") {
    throw new Error("Format de payload chiffré invalide.");
  }
  const [, ivB64, ctB64, tagB64] = parts;
  const key = loadKey();
  const iv = Buffer.from(ivB64, "base64url");
  const ciphertext = Buffer.from(ctB64, "base64url");
  const authTag = Buffer.from(tagB64, "base64url");

  if (iv.length !== IV_LENGTH) {
    throw new Error("IV de taille invalide.");
  }
  if (key.length !== KEY_LENGTH) {
    throw new Error("Clé de taille invalide.");
  }

  const decipher = createDecipheriv(ALGORITHM, key, iv) as DecipherGCM;
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);
  return plaintext.toString("utf8");
}
