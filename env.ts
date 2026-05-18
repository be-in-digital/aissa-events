import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  SANITY_API_READ_TOKEN: z.string().min(1).optional(),
  SANITY_API_WRITE_TOKEN: z.string().min(1).optional(),

  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  RESEND_FROM_EMAIL: z.string().email().default("contact@aissaevents.com"),
  RESEND_TO_EMAIL: z.string().email().default("contact@aissaevents.com"),

  HUBSPOT_PRIVATE_APP_TOKEN: z.string().min(1).optional(),
  HUBSPOT_PORTAL_ID: z.string().min(1).optional(),
  HUBSPOT_PIPELINE_ID: z.string().min(1).optional(),

  MUX_TOKEN_ID: z.string().min(1).optional(),
  MUX_TOKEN_SECRET: z.string().min(1).optional(),

  KV_REST_API_URL: z.string().url().optional(),
  KV_REST_API_TOKEN: z.string().min(1).optional(),

  // Meta / WhatsApp Business Cloud API (Phase 2 — agent IA)
  META_APP_SECRET: z.string().min(1).optional(),
  META_WEBHOOK_VERIFY_TOKEN: z.string().min(1).optional(),
  META_ENCRYPTION_KEY: z
    .string()
    .regex(/^[0-9a-fA-F]{64}$/, "Doit être 64 caractères hexadécimaux (32 octets)")
    .optional(),
  SANITY_REVALIDATE_SECRET: z.string().min(1).optional(),

  // Admin pages (assistante)
  ADMIN_AGENT_HEALTH_SECRET: z.string().min(8).optional(),

  // Blog AI Generator — secret partagé entre Sanity Studio action et routes /api/admin/blog/*
  // MVP : valeur identique côté serveur (BLOG_AI_ADMIN_SECRET) et côté client
  // (NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN). Trade-off documenté dans .context/blog-ai-generator-design.md.
  BLOG_AI_ADMIN_SECRET: z.string().min(16).optional(),

  // GPTZero — détecteur IA externe (legacy, non utilisé après refonte mai 2026).
  GPTZERO_API_KEY: z.string().min(10).optional(),

  // Undetectable.AI — service tiers de paraphrase humanizer.
  // Couche post-process qui réécrit le texte généré pour passer GPTZero.
  // Doc : https://help.undetectable.ai/en/article/humanization-api-v2-p28b2n/
  // Plan Essential ~$15/mois (~10k mots). Sans clé = skip silencieux.
  UNDETECTABLE_API_KEY: z.string().min(10).optional(),

  // Vercel AI Gateway (en local seulement — OIDC en prod)
  AI_GATEWAY_API_KEY: z.string().min(1).optional(),

  // OpenAI direct (Whisper transcription, AI Gateway ne supporte pas audio)
  OPENAI_API_KEY: z.string().startsWith("sk-").optional(),

  // Observabilité (Sentry, optionnel)
  SENTRY_DSN: z.string().url().optional(),

  // Cron secret (Vercel Cron)
  CRON_SECRET: z.string().min(16).optional(),

  // Instagram Business Account ID (pour le send Insta DM)
  META_INSTAGRAM_BUSINESS_ACCOUNT_ID: z.string().min(1).optional(),

  // Numéro WhatsApp d'Aïssa pour recevoir les alertes handover (format E.164 sans +).
  // Ex : "33612345678". Doit être whitelisté en mode dev.
  AISSA_NOTIFY_PHONE: z.string().regex(/^\d{8,15}$/).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1).default("6ue0b6jo"),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1).default("production"),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().min(1).default("2026-05-09"),
  NEXT_PUBLIC_CALENDLY_URL: z
    .string()
    .url()
    .default("https://calendly.com/aissaeventscontact"),

  // Meta / WhatsApp Business Cloud API (Phase 2 — agent IA)
  NEXT_PUBLIC_META_APP_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_META_GRAPH_API_VERSION: z.string().min(1).default("v21.0"),
  NEXT_PUBLIC_META_EMBEDDED_SIGNUP_CONFIG_ID: z.string().min(1).optional(),

  // Blog AI Generator — token Studio (doit matcher BLOG_AI_ADMIN_SECRET côté serveur)
  NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN: z.string().min(16).optional(),
});

const clientEnvRaw: Record<string, string | undefined> = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  NEXT_PUBLIC_CALENDLY_URL: process.env.NEXT_PUBLIC_CALENDLY_URL,
  NEXT_PUBLIC_META_APP_ID: process.env.NEXT_PUBLIC_META_APP_ID,
  NEXT_PUBLIC_META_GRAPH_API_VERSION: process.env.NEXT_PUBLIC_META_GRAPH_API_VERSION,
  NEXT_PUBLIC_META_EMBEDDED_SIGNUP_CONFIG_ID: process.env.NEXT_PUBLIC_META_EMBEDDED_SIGNUP_CONFIG_ID,
  NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN: process.env.NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN,
};

const clientEnv = Object.fromEntries(
  Object.entries(clientEnvRaw).filter(([, value]) => value !== ""),
);

const parsedClient = clientSchema.safeParse(clientEnv);

if (!parsedClient.success) {
  console.error(
    "❌ Variables d'environnement client invalides :",
    z.treeifyError(parsedClient.error),
  );
  throw new Error("Configuration .env client invalide.");
}

const isServer = typeof window === "undefined";

const stripEmpty = (source: NodeJS.ProcessEnv) =>
  Object.fromEntries(
    Object.entries(source).filter(([, value]) => value !== ""),
  );

const parsedServer = isServer
  ? serverSchema.safeParse(stripEmpty(process.env))
  : { success: true as const, data: {} as z.infer<typeof serverSchema> };

if (!parsedServer.success) {
  console.error(
    "❌ Variables d'environnement serveur invalides :",
    z.treeifyError(parsedServer.error),
  );
  throw new Error("Configuration .env serveur invalide.");
}

export const env = {
  ...parsedClient.data,
  ...parsedServer.data,
} as z.infer<typeof clientSchema> & Partial<z.infer<typeof serverSchema>>;
