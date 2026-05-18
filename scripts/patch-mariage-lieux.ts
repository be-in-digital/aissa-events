/* eslint-disable no-console */
/**
 * Patch ciblé de la section "Lieu de la cérémonie" sur la page Mariage.
 *
 *  1. Détection sémantique : si aucune carte ne contient "partenaire" (ou
 *     "partner") dans son titre, on en insère une en 2e position.
 *  2. Fix capacité : remplace toute occurrence de "150 personnes/invités/pax"
 *     par "50 …" dans les descriptions et highlights.
 *
 * Préserve intégralement les cartes existantes (clé custom, copy, image,
 * highlights, CTA, etc.). Idempotent : peut être relancé sans effet de bord.
 *
 * Usage : pnpm tsx scripts/patch-mariage-lieux.ts
 */
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });

import { randomUUID } from "node:crypto";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_WRITE_TOKEN",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "published",
});

type LieuItem = {
  _key?: string;
  title?: string;
  description?: string;
  highlights?: string[];
  // Les autres champs (image, cta…) sont préservés tels quels.
  [k: string]: unknown;
};

const PARTNER_CARD: LieuItem = {
  _key: `lieu-partenaire-${randomUUID().slice(0, 8)}`,
  title: "Lieu _partenaire_",
  description:
    "Châteaux, domaines, lofts, salles privatisables. On vous propose 2 ou 3 options selon votre projet, votre budget et votre nombre d'invités.",
  highlights: [
    "Réseau IDF puis France entière",
    "Capacité 30 à 300+ personnes",
    "Repérage technique inclus",
  ],
};

const CAPACITY_150_RE = /\b150\s*(personnes|invit[ée]s?|pax|places|pers\.?)/gi;

function fixCapacityString(input: string | undefined): {
  value: string | undefined;
  changed: boolean;
} {
  if (typeof input !== "string") return { value: input, changed: false };
  if (!CAPACITY_150_RE.test(input)) return { value: input, changed: false };
  CAPACITY_150_RE.lastIndex = 0;
  const next = input.replace(CAPACITY_150_RE, "50 $1");
  return { value: next, changed: next !== input };
}

function hasPartnerCard(items: LieuItem[]): boolean {
  return items.some((it) => /\b(partenaire|partner)\b/i.test(it.title ?? ""));
}

async function main() {
  console.log(
    `→ Connecté à Sanity ${projectId}/${dataset}. Lecture de mariagePage…`,
  );

  const doc = await client.fetch<{
    _id: string;
    lieux?: { items?: LieuItem[] };
  } | null>(
    `*[_type == "mariagePage" && !(_id in path("drafts.**"))][0]{_id, lieux}`,
  );

  if (!doc) {
    console.error("❌ Document mariagePage publié introuvable. Lance d'abord le seed.");
    process.exit(1);
  }

  // Sécurité — on s'assure que l'_id renvoyé ne porte pas le préfixe drafts.*
  // (le filtre du query devrait déjà l'éviter, mais double-check).
  if (doc._id.startsWith("drafts.")) {
    console.error(`❌ Doc reçu est un draft (${doc._id}) — refus de patcher.`);
    process.exit(1);
  }
  console.log(`   Doc cible : ${doc._id} (publié)`);

  const currentItems: LieuItem[] = doc.lieux?.items ?? [];
  console.log(
    `   ${currentItems.length} item(s) actuellement présent(s) :`,
    currentItems
      .map((i) => `"${(i.title ?? "(sans titre)").slice(0, 40)}"`)
      .join(" · ") || "(vide)",
  );

  // 1) Fix 150 → 50 dans toutes les cartes existantes (description + highlights).
  let capacityFixes = 0;
  const fixedExisting: LieuItem[] = currentItems.map((item) => {
    const next: LieuItem = { ...item };
    const desc = fixCapacityString(item.description);
    if (desc.changed) {
      next.description = desc.value;
      capacityFixes++;
      console.log(
        `   🔧 ${item.title ?? "(sans titre)"} : description "150 …" → "50 …"`,
      );
    }
    if (Array.isArray(item.highlights)) {
      next.highlights = item.highlights.map((h) => {
        const fixed = fixCapacityString(h);
        if (fixed.changed) {
          capacityFixes++;
          console.log(
            `   🔧 ${item.title ?? "(sans titre)"} : highlight "${h}" → "${fixed.value}"`,
          );
        }
        return fixed.value ?? h;
      });
    }
    return next;
  });

  // 2) Ajouter la carte "Lieu partenaire" si elle manque.
  let merged: LieuItem[];
  let partnerAdded = false;
  if (hasPartnerCard(fixedExisting)) {
    console.log("   ↪ Carte « partenaire » déjà présente — laissée telle quelle.");
    merged = fixedExisting;
  } else if (fixedExisting.length === 0) {
    merged = [PARTNER_CARD];
    partnerAdded = true;
    console.log("   ➕ Carte « Lieu partenaire » ajoutée (section vide).");
  } else {
    // Insérée en 2e position : Espace Events reste en 1er, le partenaire au
    // milieu, et le « chez vous / vos locaux » naturel en 3e.
    merged = [fixedExisting[0], PARTNER_CARD, ...fixedExisting.slice(1)];
    partnerAdded = true;
    console.log(
      `   ➕ Carte « Lieu partenaire » insérée en position 2 (entre "${
        fixedExisting[0].title ?? "?"
      }" et "${fixedExisting[1]?.title ?? "?"}").`,
    );
  }

  if (!partnerAdded && capacityFixes === 0) {
    console.log("✅ Rien à patcher — la section lieux est déjà conforme.");
    return;
  }

  console.log(
    `→ Application : carte partenaire = ${partnerAdded ? "AJOUTÉE" : "déjà OK"}, ${capacityFixes} correction(s) capacité.`,
  );

  await client
    .patch(doc._id)
    .set({ "lieux.items": merged })
    .commit({ autoGenerateArrayKeys: false });

  console.log("✅ mariagePage patché avec succès.");
  console.log(
    "   → La modif apparaît sur le site après la prochaine revalidation",
    "(quelques secondes si le webhook Sanity → Vercel est branché, sinon ~60 s).",
  );
}

main().catch((err) => {
  console.error("❌ Patch échoué :", err);
  process.exit(1);
});
