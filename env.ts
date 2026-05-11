import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  SANITY_API_READ_TOKEN: z.string().min(1).optional(),
  SANITY_API_WRITE_TOKEN: z.string().min(1).optional(),

  RESEND_API_KEY: z.string().startsWith("re_").optional(),
  RESEND_FROM_EMAIL: z.string().email().default("contact@aissaevents.com"),
  RESEND_TO_EMAIL: z.string().email().default("contact@aissaevents.com"),

  HUBSPOT_PRIVATE_APP_TOKEN: z.string().min(1).optional(),

  MUX_TOKEN_ID: z.string().min(1).optional(),
  MUX_TOKEN_SECRET: z.string().min(1).optional(),

  KV_REST_API_URL: z.string().url().optional(),
  KV_REST_API_TOKEN: z.string().min(1).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1).default("6ue0b6jo"),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1).default("production"),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().min(1).default("2026-05-09"),
  NEXT_PUBLIC_CALENDLY_URL: z
    .string()
    .url()
    .default("https://calendly.com/aissaevents/appel-decouverte"),
});

const clientEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
  NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  NEXT_PUBLIC_CALENDLY_URL: process.env.NEXT_PUBLIC_CALENDLY_URL,
};

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
