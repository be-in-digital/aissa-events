import "server-only";

import * as Sentry from "@sentry/node";

/**
 * Couche d'observabilité légère pour l'assistante virtuelle.
 *
 * Stratégie :
 *  - Si `SENTRY_DSN` est configuré → Sentry initialisé une seule fois,
 *    erreurs capturées avec tags utiles (canal, kind, contactRef hashed).
 *  - Sinon → fallback sur `console.error` (capturé par Vercel Logs).
 *
 * Pour passer au full `@sentry/nextjs` plus tard (avec source maps, browser
 * monitoring, etc.), il suffira de :
 *  1. `pnpm add @sentry/nextjs`
 *  2. Créer `sentry.server.config.ts`, `sentry.client.config.ts`, `instrumentation.ts`
 *  3. Wrapper `next.config.ts` avec `withSentryConfig`
 *  4. Remplacer les imports `@sentry/node` par `@sentry/nextjs`
 */

let initialised = false;

function ensureInitialised(): boolean {
  if (initialised) return true;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return false;

  try {
    Sentry.init({
      dsn,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
      release: process.env.VERCEL_GIT_COMMIT_SHA,
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0,
      // Anonymise IPs et nettoie les données PII par défaut
      sendDefaultPii: false,
    });
    initialised = true;
    return true;
  } catch (err) {
    console.error("[observability] échec init Sentry :", err);
    return false;
  }
}

type Severity = "fatal" | "error" | "warning" | "info";

export interface LogContext {
  scope?: string;
  channel?: "whatsapp" | "instagram";
  contactRef?: string | null;
  replyKind?: "ai" | "handover" | "optout" | "pause" | "silent" | "error";
  extra?: Record<string, unknown>;
}

/**
 * Hash léger d'un identifiant (numéro / handle) pour Sentry — évite de fuiter
 * la PII directe tout en gardant une dimension de regroupement.
 */
function hashIdent(ident: string | null | undefined): string | undefined {
  if (!ident) return undefined;
  // Implementation simple FNV-1a 32 bits (Node-side only)
  let hash = 0x811c9dc5;
  for (let i = 0; i < ident.length; i++) {
    hash ^= ident.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return `c_${(hash >>> 0).toString(16)}`;
}

export function logError(
  message: string,
  error: unknown,
  ctx: LogContext = {},
): void {
  const ok = ensureInitialised();
  const fullMessage = ctx.scope ? `[${ctx.scope}] ${message}` : message;

  if (ok) {
    Sentry.withScope((scope) => {
      if (ctx.scope) scope.setTag("scope", ctx.scope);
      if (ctx.channel) scope.setTag("channel", ctx.channel);
      if (ctx.replyKind) scope.setTag("reply_kind", ctx.replyKind);
      const contactHash = hashIdent(ctx.contactRef ?? undefined);
      if (contactHash) scope.setTag("contact_hash", contactHash);
      if (ctx.extra) scope.setContext("extra", ctx.extra);
      scope.setLevel("error" as Severity);
      Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
        contexts: { message: { value: fullMessage } },
      });
    });
  }

  // Toujours logger en console (Vercel Logs capture) — utile aussi sans Sentry
  console.error(fullMessage, error instanceof Error ? error.stack : error);
}

export function logWarning(message: string, ctx: LogContext = {}): void {
  const ok = ensureInitialised();
  const fullMessage = ctx.scope ? `[${ctx.scope}] ${message}` : message;

  if (ok) {
    Sentry.withScope((scope) => {
      if (ctx.scope) scope.setTag("scope", ctx.scope);
      if (ctx.channel) scope.setTag("channel", ctx.channel);
      if (ctx.replyKind) scope.setTag("reply_kind", ctx.replyKind);
      const contactHash = hashIdent(ctx.contactRef ?? undefined);
      if (contactHash) scope.setTag("contact_hash", contactHash);
      if (ctx.extra) scope.setContext("extra", ctx.extra);
      Sentry.captureMessage(fullMessage, "warning" as Severity);
    });
  }
  console.warn(fullMessage, ctx.extra ?? "");
}

/**
 * Capture un évènement métier (sans erreur), utile pour les métriques :
 * « combien de handovers cette semaine », « combien d'opt-outs », etc.
 */
export function logEvent(
  name: string,
  ctx: LogContext = {},
): void {
  const ok = ensureInitialised();
  if (ok) {
    Sentry.addBreadcrumb({
      category: "assistant",
      message: name,
      level: "info",
      data: {
        scope: ctx.scope,
        channel: ctx.channel,
        reply_kind: ctx.replyKind,
        contact_hash: hashIdent(ctx.contactRef ?? undefined),
        ...ctx.extra,
      },
    });
  }
  console.info(
    `[event] ${name}`,
    JSON.stringify({
      channel: ctx.channel,
      reply_kind: ctx.replyKind,
      ...ctx.extra,
    }),
  );
}
