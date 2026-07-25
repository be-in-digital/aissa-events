/**
 * Répare les covers pixelisées des réalisations.
 *
 * PROBLÈME : l'import a mis une MINIATURE (256×192) en `cover`, alors que les
 * vraies photos HD (≈1080×1350) sont déjà présentes dans `gallery`. Résultat :
 * les vignettes du bento sont agrandies 2-3× → pixelisées.
 *
 * FIX : pour chaque réalisation dont la cover fait < 800px, remplacer la cover
 * par la 1re photo de galerie ≥ 800px (haute résolution). Aucun ré-upload : on
 * réutilise l'asset HD déjà uploadé. L'alt existant est conservé.
 *
 * Usage : pnpm tsx scripts/fix-realisation-covers.ts
 */
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity env (project/dataset/write token).");
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

type AssetRef = { _ref: string; _type: string };
type Row = {
  _id: string;
  title?: string;
  coverAlt?: string | null;
  hdAsset?: AssetRef | null;
  hdAlt?: string | null;
};

async function main() {
  const rows = await client.fetch<Row[]>(`
    *[_type == "realisation" && cover.asset->metadata.dimensions.width < 800]{
      _id,
      title,
      "coverAlt": cover.alt,
      "hdAsset": gallery[asset->metadata.dimensions.width >= 800][0].asset,
      "hdAlt": gallery[asset->metadata.dimensions.width >= 800][0].alt
    }
  `);

  const fixable = rows.filter((r) => r.hdAsset?._ref);
  const manual = rows.filter((r) => !r.hdAsset?._ref);

  console.log(
    `→ ${rows.length} réalisation(s) à cover pixelisée · ${fixable.length} réparables automatiquement · ${manual.length} sans photo HD.`,
  );

  const tx = client.transaction();
  for (const r of fixable) {
    tx.patch(r._id, {
      set: {
        cover: {
          _type: "imageWithAlt",
          asset: { _type: "reference", _ref: r.hdAsset!._ref },
          alt: r.coverAlt || r.hdAlt || r.title || "Réalisation Aïssa Events",
        },
      },
    });
  }
  await tx.commit();
  console.log(`✅ ${fixable.length} cover(s) remplacée(s) par la photo HD de galerie.`);

  if (manual.length) {
    console.log(`⚠️  ${manual.length} réalisation(s) sans photo HD (ré-upload manuel) :`);
    for (const r of manual) console.log(`   - ${r.title ?? r._id}`);
  }
  console.log("→ Pense à revalider le site (tag 'realisation').");
}

main().catch((err) => {
  console.error("❌ Échec :", err);
  process.exit(1);
});
