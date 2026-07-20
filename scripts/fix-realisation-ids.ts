/**
 * Corrige les réalisations invisibles sur le site.
 *
 * CAUSE : les 40 réalisations ont un `_id` contenant un point
 * (`realisation.realisation-2025-...`). Sanity traite tout document dont l'ID
 * contient un point comme PRIVÉ : il n'est lisible qu'avec un token et n'est
 * PAS servi par l'API/CDN publique. Or le site lit via le CDN public sans
 * token → 0 réalisation → la galerie affiche l'état vide.
 *
 * FIX : recréer chaque réalisation avec un ID public valide (sans point),
 * puis supprimer l'ancien document privé. Aucune réalisation n'est référencée
 * ailleurs (vérifié) → pas de lien à mettre à jour.
 *
 * Sûr : on CRÉE d'abord la version publique (même contenu), on SUPPRIME
 * l'ancienne dans la même transaction. Idempotent (relançable).
 *
 * Usage : pnpm tsx scripts/fix-realisation-ids.ts
 */
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });

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
  perspective: "raw",
});

/** ID public valide : retire le préfixe jusqu'au 1er point, puis tout point restant → tiret. */
function toPublicId(oldId: string): string {
  return oldId.replace(/^[^.]*\./, "").replace(/\./g, "-");
}

async function main() {
  console.log(`→ Connecté à Sanity ${projectId}/${dataset}.`);
  const docs = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(
    `*[_type == "realisation"]`,
  );
  const toMigrate = docs.filter((d) => d._id.includes("."));
  console.log(
    `   ${docs.length} réalisation(s) au total, dont ${toMigrate.length} à ID privé (avec point).`,
  );
  if (toMigrate.length === 0) {
    console.log("✔ Rien à migrer — toutes les réalisations ont déjà un ID public.");
    return;
  }

  const tx = client.transaction();
  for (const d of toMigrate) {
    const newId = toPublicId(d._id);
    // Copie du contenu sans les champs système (_rev/_createdAt/_updatedAt).
    const { _id, _rev, _createdAt, _updatedAt, ...content } = d as Record<string, unknown>;
    void _rev;
    void _createdAt;
    void _updatedAt;
    tx.createOrReplace({ ...(content as object), _id: newId } as { _id: string; _type: string });
    tx.delete(_id as string);
    console.log(`   ${_id}  →  ${newId}`);
  }

  await tx.commit({ autoGenerateArrayKeys: false });
  console.log(`✅ ${toMigrate.length} réalisation(s) migrée(s) vers des IDs publics.`);
  console.log("   → Visible sur le site après revalidation (~60 s).");
}

main().catch((err) => {
  console.error("❌ Migration échouée :", err);
  process.exit(1);
});
