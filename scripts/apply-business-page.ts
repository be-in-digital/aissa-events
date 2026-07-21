/**
 * Applique UNIQUEMENT la page Business (Entreprises) reconstruite et ses quatre
 * packs à Sanity — sans toucher au reste du site.
 *
 * À utiliser à la place de `pnpm seed` (qui, lui, réécrit TOUT le contenu du
 * site et écraserait les retouches faites au Studio). Ce script est chirurgical :
 *   • met à jour le singleton `evenementPage` (page Entreprises) ;
 *   • met à jour / crée les 4 packs `evenement` (Réunion, Afterwork, Ambiance
 *     Signature, Fin d'année) ;
 *   • supprime l'ancien pack « Sur mesure » (démoté en modalité, plus une carte).
 *
 * Prérequis : SANITY_API_WRITE_TOKEN dans .env.local (permission Editor).
 *
 * Usage : pnpm apply:business
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });
import { createClient } from "@sanity/client";
import { uploadAllImages, resolveImagePlaceholders } from "./upload-images";
import { packDocs } from "./seed-data";
import { evenementPageDoc } from "./seed-pages";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "6ue0b6jo";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error(
    "\n❌ SANITY_API_WRITE_TOKEN manquant dans .env.local\n\n" +
      "  1. https://www.sanity.io/manage → projet 'aissa-events' (6ue0b6jo)\n" +
      "  2. API → Tokens → Add API token → permission Editor\n" +
      "  3. .env.local : SANITY_API_WRITE_TOKEN=sk...\n",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-05-09",
  token,
  useCdn: false,
});

async function apply() {
  console.log(
    `\n→ Application de la page Business sur "${dataset}" (projet ${projectId})\n`,
  );

  // Images (cache local .sanity-image-cache.json — aucun ré-upload si déjà fait).
  console.log("  🖼  Vérification des images (hero page Entreprises)");
  const images = await uploadAllImages(client);
  console.log();

  // 1. Les 4 packs Business (ids canoniques).
  const evenementPacks = packDocs.filter((p) => p.type === "evenement");
  const canonicalIds = evenementPacks.map((p) => p._id);
  console.log(`  📦 Packs Business (${evenementPacks.length})`);
  for (const doc of evenementPacks) {
    const resolved = resolveImagePlaceholders(doc, images);
    await client.createOrReplace(resolved as never);
    console.log(`     ✓ ${doc._id} — ${doc.title}`);
  }

  // 2. La page Entreprises (singleton).
  console.log("\n  ⚙ Page Entreprises (evenementPage)");
  const resolvedPage = resolveImagePlaceholders(evenementPageDoc, images);
  await client.createOrReplace(resolvedPage as never);
  console.log(`     ✓ ${evenementPageDoc._id}`);

  // 3. Balayage : tout autre pack « evenement » (ancien « Sur mesure », doublons
  //    créés au Studio) est retiré pour ne garder QUE les 4 packs canoniques.
  //    N'affecte pas les packs mariage / celebration / fiesta.
  console.log("\n  🗑  Doublons / anciens packs evenement à retirer");
  const strays: string[] = await client.fetch(
    '*[_type == "pack" && type == "evenement" && !(_id in $ids)]._id',
    { ids: canonicalIds },
  );
  if (strays.length === 0) {
    console.log("     • aucun (déjà propre)");
  }
  for (const id of strays) {
    await client.delete(id);
    console.log(`     ✓ supprimé : ${id}`);
  }

  console.log(
    "\n✅ Page Business appliquée. Le reste du site n'a pas été touché." +
      "\n   Ouvre /entreprises (ou /studio) pour vérifier.\n",
  );
}

apply().catch((err) => {
  console.error("\n❌ Erreur pendant l'application :", err);
  process.exit(1);
});
