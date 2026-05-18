/* eslint-disable no-console */
/**
 * Test end-to-end du wizard blog AI : reproduit exactement les appels que
 * `GenerateWizardDialog.injectIntoSanity` effectue, depuis la racine du
 * projet et hors navigateur. Crée un vrai brouillon Sanity qu'on peut
 * ensuite inspecter dans Studio.
 *
 * Usage : pnpm exec tsx scripts/test-blog-wizard.ts
 *
 * Pré-requis :
 *   - dev server qui tourne sur localhost:3000
 *   - .env.local rempli (BLOG_AI_ADMIN_SECRET, NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN,
 *     SANITY_API_WRITE_TOKEN, AI_GATEWAY_API_KEY)
 *   - au moins une catégorie en base (slug "conseils" par défaut)
 */

import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });

import { createClient } from "@sanity/client";

import { markdownToPortableText } from "../lib/blog/markdown-to-portable-text";
import type {
  BriefInput,
  ImageVariant,
  SectionResult,
  Skeleton,
} from "../lib/blog/types";

const BASE = "http://localhost:3000";
const TOKEN = process.env.NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN;
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "6ue0b6jo";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-05-09";
const SANITY_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

if (!TOKEN) throw new Error("NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN manquant");
if (!SANITY_TOKEN) throw new Error("SANITY_API_WRITE_TOKEN manquant");

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  token: SANITY_TOKEN,
  useCdn: false,
});

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${path} → ${res.status} : ${txt.slice(0, 400)}`);
  }
  return (await res.json()) as T;
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

async function main() {
  const brief: BriefInput = {
    subject: "Comment se passe un premier rendez-vous avec une wedding planner",
    audience: "fiancés en début de préparatifs",
    intent: "info",
    angle: "guide pratique étape par étape",
    seoKeywords: ["wedding planner Émerainville", "rendez-vous wedding planner 77"],
    targetWordCount: 900,
    keyPoints: [
      "déroulé concret du premier appel",
      "questions que la wedding planner pose",
      "ce qu'il faut préparer avant",
      "à quoi ça mène concrètement",
    ],
    categorySlug: "conseils",
  };

  console.log("Étape 1/4 — Génération du squelette…");
  const { skeleton } = await post<{ skeleton: Skeleton }>(
    "/api/admin/blog/generate-skeleton",
    { brief },
  );
  console.log("  Titre :", skeleton.title);
  console.log("  Plan  :", skeleton.plan.map((h, i) => `${i + 1}. ${h.title}`).join(" / "));

  console.log("\nÉtape 2/4 — Génération des sections…");
  const sections: SectionResult[] = [];
  for (let i = 0; i < skeleton.plan.length; i += 1) {
    const sid = `h2-${i}`;
    process.stdout.write(`  ${i + 1}/${skeleton.plan.length} ${sid}… `);
    const t0 = Date.now();
    const { section } = await post<{ section: SectionResult }>(
      "/api/admin/blog/generate-section",
      {
        brief,
        skeleton,
        sectionId: sid,
        previousSections: sections.map((s) => ({
          sectionId: s.sectionId,
          markdown: s.markdown,
        })),
      },
    );
    sections.push(section);
    console.log(`${section.markdown.split(/\s+/).length} mots en ${Math.round((Date.now() - t0) / 1000)}s`);
  }

  console.log("\nÉtape 3/4 — Image de couverture (4 variantes)…");
  const { variants: coverVariants } = await post<{ variants: ImageVariant[] }>(
    "/api/admin/blog/generate-images",
    { title: skeleton.title, brief, count: 4 },
  );
  console.log(`  ${coverVariants.length} variantes générées`);
  const chosenCover = coverVariants[0];
  console.log(`  Cover choisie : ${chosenCover.assetId}`);

  console.log("\nÉtape 3bis/4 — Image pour la section 1 (test feature section images)…");
  const sectionTitle = sections[0].markdown.trim().split("\n", 1)[0].replace(/^#+\s+/, "");
  const { variants: secVariants } = await post<{ variants: ImageVariant[] }>(
    "/api/admin/blog/generate-images",
    { title: sectionTitle.slice(0, 200), brief, count: 4 },
  );
  console.log(`  ${secVariants.length} variantes générées pour la section 1`);
  const sectionImages: Record<string, ImageVariant[]> = {
    [sections[0].sectionId]: [secVariants[0]],
  };

  console.log("\nÉtape 4/4 — Injection Sanity (patch sur brouillon)…");

  const categoryId = await sanity.fetch<string | null>(
    `*[_type=="category" && slug.current==$slug][0]._id`,
    { slug: brief.categorySlug },
  );
  if (!categoryId) throw new Error(`Catégorie « ${brief.categorySlug} » introuvable`);

  // Body : section par section, on intercale les images en fin de section
  // (même logique que GenerateWizardDialog.injectIntoSanity).
  const sortedSections = [...sections].sort((a, b) =>
    a.sectionId.localeCompare(b.sectionId, undefined, { numeric: true }),
  );
  const body: unknown[] = [];
  for (const section of sortedSections) {
    const blocks = markdownToPortableText(section.markdown);
    body.push(...blocks);
    const imgs = sectionImages[section.sectionId] ?? [];
    for (const img of imgs) {
      body.push({
        _type: "imageWithAlt",
        alt: skeleton.title,
        asset: { _type: "reference", _ref: img.assetId },
      });
    }
  }

  const generatedSlug = slugify(`test-wizard-${skeleton.title}`);
  const docId = `test-wizard-${Date.now()}`;
  const draftId = `drafts.${docId}`;

  const patch: Record<string, unknown> = {
    title: `[TEST] ${skeleton.title}`,
    excerpt: skeleton.excerpt,
    body,
    tags: skeleton.suggestedTags,
    category: { _type: "reference", _ref: categoryId },
    seo: {
      _type: "seo",
      title: skeleton.seo.metaTitle,
      description: skeleton.seo.metaDescription,
    },
    wasAIAssisted: true,
    cover: {
      _type: "imageWithAlt",
      alt: skeleton.title,
      asset: { _type: "reference", _ref: chosenCover.assetId },
    },
    slug: { _type: "slug", current: generatedSlug },
  };
  const publishedAtFallback = new Date().toISOString();

  await sanity
    .transaction()
    .createIfNotExists({ _id: draftId, _type: "post" })
    .patch(draftId, (p) => p.set(patch).setIfMissing({ publishedAt: publishedAtFallback }))
    .commit({ autoGenerateArrayKeys: true });

  console.log("\nBrouillon créé :", draftId);

  // Sanity a une consistance éventuelle : la lecture juste après écriture
  // peut renvoyer null. On poll jusqu'à 5s.
  let fetched: {
    title: string;
    excerpt: string;
    publishedAt: string | null;
    bodyLength: number;
    imageBlockCount: number;
    cover: { asset: { _ref: string } } | null;
    seo: { title: string; description: string } | null;
    tagsCount: number;
    category: { _ref: string } | null;
    wasAIAssisted: boolean | null;
  } | null = null;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    fetched = await sanity.fetch(
      `*[_id==$id][0]{
        title, excerpt, publishedAt,
        "bodyLength": count(body),
        "imageBlockCount": count(body[_type=="imageWithAlt"]),
        cover, seo, "tagsCount": count(tags), category, wasAIAssisted
      }`,
      { id: draftId },
    );
    if (fetched) break;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!fetched) throw new Error("Document toujours invisible après 5s de polling");

  console.log("\n--- Vérification du brouillon ---");
  console.log(JSON.stringify(fetched, null, 2));

  const issues: string[] = [];
  if (!fetched.publishedAt) issues.push("publishedAt absent");
  else if (Number.isNaN(Date.parse(fetched.publishedAt))) issues.push(`publishedAt invalide : ${fetched.publishedAt}`);
  if (!fetched.title) issues.push("title vide");
  if (!fetched.excerpt) issues.push("excerpt vide");
  if (fetched.bodyLength === 0) issues.push("body vide");
  if (fetched.imageBlockCount === 0) issues.push("aucune image de section dans body");
  if (!fetched.cover) issues.push("cover manquante");
  if (!fetched.seo) issues.push("seo manquant");
  if (!fetched.category) issues.push("category manquante");
  if (fetched.wasAIAssisted !== true) issues.push("wasAIAssisted non posé");

  if (issues.length === 0) {
    console.log("\n✅ TOUT EST OK");
  } else {
    console.log("\n⚠️  Problèmes :");
    for (const i of issues) console.log("  -", i);
  }

  const studioUrl = `http://localhost:3000/studio/desk/post;${docId}`;
  console.log(`\nOuvre dans Studio : ${studioUrl}`);
  console.log(`Doc id (à supprimer après test si tu veux) : ${draftId}`);
}

main().catch((err) => {
  console.error("\n❌ Échec :", err);
  process.exit(1);
});
