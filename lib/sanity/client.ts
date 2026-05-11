import { createClient } from "next-sanity";
import { env } from "@/env";

/**
 * Client de lecture (CDN, perspective publiée).
 * Safe pour usage côté serveur ET côté client.
 */
export const sanityClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
  perspective: "published",
  stega: false,
});

// Le client d'écriture vit dans `client.server.ts` (import "server-only")
// pour empêcher toute fuite du SANITY_API_WRITE_TOKEN dans un bundle client.
