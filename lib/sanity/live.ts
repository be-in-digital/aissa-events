import { defineLive } from "next-sanity/live";
import { sanityClient } from "./client";

/**
 * Branche le client Sanity sur l'API Live Content (mode strict, requis sous
 * Next.js Cache Components).
 *
 * - `liveFetch` exige désormais `perspective` + `stega` à chaque appel — la
 *   résolution dynamique (draftMode + cookie de preview) est faite dans
 *   `sanityFetch` (cf. `./fetch.ts`).
 * - `SanityLive` exige `includeDrafts` — passé depuis `app/layout.tsx`.
 *
 * Token :
 *  - `serverToken` (lecture drafts côté serveur) → SANITY_API_READ_TOKEN
 *  - `browserToken` est volontairement vide pour ne jamais exposer de token
 *    au navigateur. Le preview drafts ne fonctionne que via Presentation tool.
 */
export const { sanityFetch: liveFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  strict: true,
});

export { resolvePerspectiveFromCookies } from "next-sanity/live";
