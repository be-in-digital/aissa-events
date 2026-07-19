/**
 * Masque les prix sur les cartes packs de la page Business (evenementPage).
 *
 * Directive cliente (« Directives webmaster — Page Business ») : aucun prix ne
 * doit être affiché publiquement sur la page entreprises — tout se chiffre sur
 * devis. On bascule donc le réglage `packs.showPrices` à `false`.
 *
 * Le réglage reste pilotable depuis le Studio (Page Événement → 5. Packs →
 * « Afficher les prix sur les cartes ? »). Ce script ne fait que poser la
 * valeur conforme par défaut, sans que la cliente ait à y toucher.
 *
 * Idempotent : relançable sans effet de bord.
 *
 * Usage : pnpm tsx scripts/patch-pro-hide-prices.ts
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
  perspective: "published",
});

async function main() {
  console.log(
    `→ Connecté à Sanity ${projectId}/${dataset}. Lecture de evenementPage…`,
  );

  const doc = await client.fetch<{
    _id: string;
    hasPacks: boolean;
    showPrices: boolean | null;
  } | null>(
    `*[_type == "evenementPage" && !(_id in path("drafts.**"))][0]{
      _id,
      "hasPacks": defined(packs),
      "showPrices": packs.showPrices
    }`,
  );

  if (!doc) {
    console.error(
      "❌ Document evenementPage publié introuvable. Lance d'abord le seed.",
    );
    process.exit(1);
  }
  if (doc._id.startsWith("drafts.")) {
    console.error(`❌ Doc reçu est un draft (${doc._id}) — refus de patcher.`);
    process.exit(1);
  }
  console.log(`   Doc cible : ${doc._id} (publié)`);

  if (!doc.hasPacks) {
    console.log(
      "ℹ️  Aucune section « Packs » sur la page — rien à masquer. Rien à faire.",
    );
    return;
  }
  if (doc.showPrices === false) {
    console.log("✅ Prix déjà masqués sur la page Business — rien à faire.");
    return;
  }

  await client
    .patch(doc._id)
    .set({ "packs.showPrices": false })
    .commit({ autoGenerateArrayKeys: false });

  console.log("✅ evenementPage patché : prix des packs masqués (showPrices = false).");
  console.log(
    "   → Réactivable à tout moment depuis le Studio (Page Événement → Packs).",
  );
  console.log(
    "   → La modif apparaît sur le site après la prochaine revalidation (~60 s).",
  );
}

main().catch((err) => {
  console.error("❌ Patch échoué :", err);
  process.exit(1);
});
