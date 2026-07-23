import posthog from "posthog-js";

/**
 * Initialisation PostHog côté client.
 *
 * En Next.js 15.3+/16, `instrumentation-client.ts` est le point d'init
 * recommandé (à NE PAS combiner avec un PostHogProvider).
 *
 * - Les **pages vues** et l'**autocapture** (clics, formulaires) sont activés
 *   par défaut → le « nombre de visites » et le trafic sont trackés
 *   automatiquement, sans code supplémentaire.
 * - Ingestion via le **reverse-proxy `/ingest`** (rewrites dans next.config) :
 *   tout passe en same-origin → compatible avec la CSP stricte du site et
 *   résistant aux bloqueurs de pub.
 *
 * Garde `if (key)` : tant que `NEXT_PUBLIC_POSTHOG_KEY` n'est pas défini
 * (avant que le projet PostHog « Aïssa Events » soit créé), PostHog ne
 * s'initialise pas — aucun crash, aucun événement parasite.
 */
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (key) {
  posthog.init(key, {
    api_host: "/ingest",
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ?? "https://us.posthog.com",
    defaults: "2026-01-30",
    capture_exceptions: true, // Error Tracking (exceptions non gérées)
    debug: process.env.NODE_ENV === "development",
  });
}
