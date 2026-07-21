import { cacheLife } from "next/cache";
import { cookies, draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";
import type { LivePerspective } from "next-sanity/live";
import { liveFetch, resolvePerspectiveFromCookies } from "./live";

/**
 * Filet de sécurité de fraîcheur (en secondes).
 *
 * next-sanity fixe en interne un `revalidate` d'UN AN (31 536 000 s) : il
 * compte entièrement sur la purge à la demande (`<SanityLive />` + webhook
 * `/api/revalidate`) pour rafraîchir. Si ces deux chemins ne se déclenchent
 * pas, une modif publiée dans Sanity resterait invisible ~1 an → symptôme
 * « actualiser, actualiser… ça met énormément de temps ».
 *
 * On raccourcit ce revalidate : au pire, une modif apparaît en ~1 min (SWR).
 * La purge instantanée par tag (`cacheTag` → `revalidateTag`) reste prioritaire ;
 * `cacheLife` ne fait que plafonner la péremption. Override explicitement
 * supporté par next-sanity (« userland can still set a shorter revalidate time »).
 */
const SANITY_REVALIDATE_SECONDS = 60;

type FetchOptions = {
  tags?: string[];
  /**
   * Conservé pour la rétro-compatibilité — la revalidation est désormais
   * pilotée par les EventSource Live + le système de cache de Next 16.
   * Pour forcer une revalidation périodique au niveau page, utiliser
   * `export const revalidate = N`.
   */
  revalidate?: number | false;
};

/**
 * Fetch Sanity unifié pour Cache Components.
 *
 * Architecture en 2 couches imposée par cacheComponents :
 *  1. cette fonction (dynamique) lit `draftMode()` + `cookies()` pour résoudre
 *     `perspective` (published/drafts/raw) et `stega` (boolean)
 *  2. elle délègue à `cachedFetch` (déclaré avec `'use cache'`) qui réalise
 *     l'appel `liveFetch` — `liveFetch` utilise `cacheTag()` en interne et
 *     exige donc d'être dans une frontière de cache
 *
 * Les valeurs résolues servent aussi de cache keys → drafts et published
 * sont cachés séparément, et l'invalidation est gérée par `<SanityLive />`.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
} & FetchOptions): Promise<T> {
  const { isEnabled: isDraftMode } = await draftMode();

  let perspective: LivePerspective = "published";
  let stega = false;

  if (isDraftMode) {
    const jar = await cookies();
    const fromCookie = await resolvePerspectiveFromCookies({ cookies: jar });
    perspective = fromCookie ?? "drafts";
    stega = true;
  }

  return cachedFetch<T>({ query, params, perspective, stega, tags });
}

/**
 * Variante "build-time" : à utiliser dans `generateStaticParams`, `sitemap`,
 * `robots`, etc. — contextes qui s'exécutent sans requête HTTP donc sans
 * accès à `draftMode()` / `cookies()`. Toujours en perspective `published`,
 * jamais de stega.
 */
export async function sanityFetchStatic<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<T> {
  return cachedFetch<T>({
    query,
    params,
    perspective: "published",
    stega: false,
    tags,
  });
}

async function cachedFetch<T>({
  query,
  params,
  perspective,
  stega,
  tags,
}: {
  query: string;
  params: QueryParams;
  perspective: LivePerspective;
  stega: boolean;
  tags: string[];
}): Promise<T> {
  "use cache";
  const { data } = await liveFetch({
    query,
    params,
    perspective,
    stega,
    tags: tags.length > 0 ? tags : undefined,
  });
  // Appelé APRÈS liveFetch pour primer sur son `cacheLife({ revalidate: 1 an })`
  // interne (cf. SANITY_REVALIDATE_SECONDS). `cacheTag` posé par liveFetch reste
  // actif → la purge à la demande n'est pas affectée.
  cacheLife({ revalidate: SANITY_REVALIDATE_SECONDS });
  return data as T;
}
