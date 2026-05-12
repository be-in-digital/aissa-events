import "server-only";

import { sanityClient } from "@/lib/sanity/client";

import { getActiveConnection } from "./token-store";

/**
 * Health checks pour la page `/admin/agent-health`.
 * Chaque check est best-effort et timeout-safe.
 */

export type HealthStatus = "ok" | "warning" | "error" | "not_configured";

export interface HealthCheck {
  name: string;
  status: HealthStatus;
  detail: string;
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  fallback: T,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

async function checkWhatsAppConnection(): Promise<HealthCheck> {
  const required = ["META_APP_SECRET", "META_ENCRYPTION_KEY", "META_WEBHOOK_VERIFY_TOKEN"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    return {
      name: "WhatsApp / Meta API",
      status: "not_configured",
      detail: `Variables manquantes : ${missing.join(", ")}.`,
    };
  }
  try {
    const active = await withTimeout(getActiveConnection(), 2500, null);
    if (!active) {
      return {
        name: "WhatsApp / Meta API",
        status: "warning",
        detail: "Aucun numéro WhatsApp connecté. Va dans Sanity Studio → Assistante virtuelle pour connecter.",
      };
    }
    const expiringSoon =
      active.expiresAt &&
      new Date(active.expiresAt).getTime() - Date.now() < 7 * 24 * 3600 * 1000;
    return {
      name: "WhatsApp / Meta API",
      status: expiringSoon ? "warning" : "ok",
      detail: `Connecté à ${active.displayPhoneNumber}${expiringSoon ? " — token expire bientôt" : ""}.`,
    };
  } catch (err) {
    return {
      name: "WhatsApp / Meta API",
      status: "error",
      detail: err instanceof Error ? err.message : "Erreur Upstash.",
    };
  }
}

async function checkHubspot(): Promise<HealthCheck> {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) {
    return {
      name: "HubSpot CRM",
      status: "not_configured",
      detail: "HUBSPOT_PRIVATE_APP_TOKEN manquant.",
    };
  }
  try {
    const res = await withTimeout(
      fetch("https://api.hubapi.com/account-info/v3/details", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      2500,
      null,
    );
    if (!res || !res.ok) {
      return {
        name: "HubSpot CRM",
        status: "error",
        detail: `HTTP ${res?.status ?? "timeout"}.`,
      };
    }
    return { name: "HubSpot CRM", status: "ok", detail: "API accessible." };
  } catch (err) {
    return {
      name: "HubSpot CRM",
      status: "error",
      detail: err instanceof Error ? err.message : "Erreur réseau.",
    };
  }
}

async function checkSanity(): Promise<HealthCheck> {
  try {
    const data = await withTimeout(
      sanityClient.fetch<{ _id: string } | null>(`*[_type == "agentSettings"][0]{_id}`),
      2500,
      null,
    );
    return {
      name: "Sanity CMS",
      status: data ? "ok" : "warning",
      detail: data
        ? "Singleton agentSettings publié."
        : "Singleton agentSettings non publié — édite-le dans Sanity Studio.",
    };
  } catch (err) {
    return {
      name: "Sanity CMS",
      status: "error",
      detail: err instanceof Error ? err.message : "Échec fetch Sanity.",
    };
  }
}

async function checkUpstash(): Promise<HealthCheck> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    return {
      name: "Upstash Redis (KV)",
      status: "not_configured",
      detail: "KV_REST_API_URL / KV_REST_API_TOKEN manquants.",
    };
  }
  try {
    const res = await withTimeout(
      fetch(`${url}/ping`, { headers: { Authorization: `Bearer ${token}` } }),
      2000,
      null,
    );
    return {
      name: "Upstash Redis (KV)",
      status: res?.ok ? "ok" : "error",
      detail: res?.ok ? "Ping OK." : "Échec ping.",
    };
  } catch (err) {
    return {
      name: "Upstash Redis (KV)",
      status: "error",
      detail: err instanceof Error ? err.message : "Erreur réseau.",
    };
  }
}

function checkResend(): HealthCheck {
  const ok = Boolean(process.env.RESEND_API_KEY);
  return {
    name: "Resend (notifications)",
    status: ok ? "ok" : "not_configured",
    detail: ok ? "Clé API présente." : "RESEND_API_KEY manquante.",
  };
}

function checkAiGateway(): HealthCheck {
  // Vercel AI Gateway : OIDC en prod, AI_GATEWAY_API_KEY en dev local.
  const ok = Boolean(
    process.env.AI_GATEWAY_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN ||
      process.env.VERCEL,
  );
  return {
    name: "Vercel AI Gateway (Haiku)",
    status: ok ? "ok" : "warning",
    detail: ok
      ? "Configuration disponible (OIDC ou API key)."
      : "En dev local : configure AI_GATEWAY_API_KEY pour tester l'agent.",
  };
}

export async function runHealthChecks(): Promise<HealthCheck[]> {
  return Promise.all([
    checkWhatsAppConnection(),
    checkHubspot(),
    checkSanity(),
    checkUpstash(),
    Promise.resolve(checkResend()),
    Promise.resolve(checkAiGateway()),
  ]);
}
