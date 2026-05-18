import { createClient } from "next-sanity";
import { env } from "@/env";

/**
 * Client de lecture (CDN, perspective publiée).
 * Safe pour usage côté serveur ET côté client.
 *
 * Le switch vers la perspective `drafts` quand `draftMode()` est activé est
 * géré automatiquement par `defineLive` (cf. `lib/sanity/live.ts`).
 */
export const sanityClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
  perspective: "published",
  // Stega désactivé par défaut. Quand `sanityFetch` détecte le draft mode il
  // passe `stega: true` à `liveFetch` → l'encodeur a besoin de `studioUrl`
  // pour générer les liens "click-to-edit" vers Sanity.
  stega: {
    enabled: false,
    studioUrl: "/studio",
  },
});

// Le client d'écriture vit dans `client.server.ts` (import "server-only")
// pour empêcher toute fuite du SANITY_API_WRITE_TOKEN dans un bundle client.
