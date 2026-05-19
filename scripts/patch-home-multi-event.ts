/* eslint-disable no-console */
/**
 * Patch ciblé du contenu Sanity pour basculer la home + navigation
 * d'une posture "wedding planner" vers "agence événementielle multi-événement"
 * et réordonner le menu (Espace Events / Événements pro / Mariage / Réalisations / Blog).
 *
 * Idempotent : peut être relancé sans effet de bord.
 * Ne touche QUE les champs ci-dessous — le reste du contenu Sanity est préservé.
 *
 * Usage : pnpm tsx scripts/patch-home-multi-event.ts
 */
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const NEW_HEADER_NAV = [
  { _key: "nav-espace-events", label: "Espace Events", cta: { _type: "cta", label: "Espace Events", type: "internal", internalPath: "/espace-events", variant: "ghost" } },
  { _key: "nav-espace-pro", label: "Événements pro", cta: { _type: "cta", label: "Événements pro", type: "internal", internalPath: "/evenements-pro", variant: "ghost" } },
  { _key: "nav-mariage", label: "Mariage", cta: { _type: "cta", label: "Mariage", type: "internal", internalPath: "/mariage", variant: "ghost" } },
  { _key: "nav-realisations", label: "Réalisations", cta: { _type: "cta", label: "Réalisations", type: "internal", internalPath: "/realisations", variant: "ghost" } },
  { _key: "nav-blog", label: "Blog", cta: { _type: "cta", label: "Blog", type: "internal", internalPath: "/blog", variant: "ghost" } },
];

const NEW_UNIVERSE_LINKS = [
  { _key: "univers-espace-events", label: "Espace Events · le lieu", cta: { _type: "cta", label: "Espace Events", type: "internal", internalPath: "/espace-events", variant: "ghost" } },
  { _key: "univers-espace-pro", label: "Événements pro", cta: { _type: "cta", label: "Événements pro", type: "internal", internalPath: "/evenements-pro", variant: "ghost" } },
  { _key: "univers-mariage", label: "Mariages & cérémonies", cta: { _type: "cta", label: "Mariages & cérémonies", type: "internal", internalPath: "/mariage", variant: "ghost" } },
];

async function patchSiteSettings() {
  const existing = await client.fetch<{
    _id: string;
    footerColumns?: Array<{ _key: string; title?: string }>;
  } | null>(`*[_id == "siteSettings"][0]{_id, footerColumns}`);

  if (!existing) {
    console.warn("⚠️  siteSettings introuvable — sautée. Lance `pnpm seed` d'abord ou édite manuellement.");
    return;
  }

  const patch = client.patch("siteSettings")
    .set({
      headerNav: NEW_HEADER_NAV,
      footerTagline:
        "Agence événementielle à Émerainville (77), depuis 2020. Notre lieu (Espace Events) accueille mariages, baptêmes, anniversaires, henné, événements pros et soirées jusqu'à 50 personnes. Pour les autres formats, nous nous déplaçons partout en Île-de-France.",
      "defaultSeo.title": "Aïssa Events · Agence événementielle à Émerainville (77)",
      "defaultSeo.description":
        "Agence événementielle à Émerainville (Seine-et-Marne), depuis 2020. Mariages, baptêmes, anniversaires, henné, événements pros, séminaires. Espace Events — votre lieu de réception en Île-de-France.",
    });

  // Patch la colonne "Univers" du footer si elle existe (sans toucher les autres colonnes)
  const universCol = existing.footerColumns?.find((c) => c.title === "Univers");
  if (universCol) {
    patch.set({ [`footerColumns[_key=="${universCol._key}"].links`]: NEW_UNIVERSE_LINKS });
  }

  const result = await patch.commit();
  console.log("✅ siteSettings patché —", result._id);
}

async function patchHomePage() {
  const existing = await client.fetch<{
    _id: string;
    hero?: { stats?: Array<{ _key?: string }> };
  } | null>(`*[_id == "homePage"][0]{_id, hero{stats}}`);

  if (!existing) {
    console.warn("⚠️  homePage introuvable — sautée. Lance `pnpm seed` d'abord ou édite manuellement.");
    return;
  }

  const patch = client.patch("homePage")
    .set({
      "hero.eyebrow": "Agence événementielle · Émerainville 77 · Depuis 2020",
      "hero.title": "Vos événements à _votre image._",
      "hero.subtitle":
        "Mariages, baptêmes, anniversaires, henné, événements pro, séminaires. Dans notre lieu à Émerainville (77) ou chez vous, partout en Île-de-France.",
      "caseStudies.footerEyebrow": "+ 60 événements orchestrés depuis 2020",
      "about.title": "Agence événementielle\nà _Émerainville_\ndepuis 2020.",
    });

  // Patch ciblé du premier stat (sans toucher aux autres) si possible
  const firstStat = existing.hero?.stats?.[0];
  if (firstStat?._key) {
    patch.set({ [`hero.stats[_key=="${firstStat._key}"].label`]: "Événements orchestrés" });
  } else {
    // Fallback : remplace l'array entier
    patch.set({
      "hero.stats": [
        { _key: "stat-events", value: "+60", label: "Événements orchestrés" },
        { _key: "stat-emerainville", value: "Émerainville", label: "Notre lieu (77)" },
        { _key: "stat-idf", value: "IDF", label: "& au-delà" },
      ],
    });
  }

  const result = await patch.commit();
  console.log("✅ homePage patché —", result._id);
}

async function main() {
  console.log(`Projet ${projectId} · dataset ${dataset}\n`);
  await patchSiteSettings();
  await patchHomePage();
  console.log("\nFait. Vérifie le rendu : http://localhost:3000");
  console.log("⚠️  Si un draft existait en Studio pour ces documents, il prime sur le published patché — pense à le publier ou le rejeter.");
}

main().catch((e) => {
  console.error("❌ Erreur :", e);
  process.exit(1);
});
