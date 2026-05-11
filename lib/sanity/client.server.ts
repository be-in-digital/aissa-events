import "server-only";
import { createClient } from "next-sanity";
import { env } from "@/env";

/**
 * Client d'écriture Sanity. Strictement réservé au serveur :
 * - importer ce module depuis un composant `'use client'` ou un module bundlé
 *   pour le navigateur fera échouer le build (grâce au package `server-only`).
 * - Le token `SANITY_API_WRITE_TOKEN` n'est jamais exposé au client (pas de
 *   préfixe NEXT_PUBLIC_).
 */
export const sanityWriteClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
