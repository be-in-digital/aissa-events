/**
 * Script de seed Sanity. Pousse tout le contenu initial du site dans Sanity,
 * y compris les images (uploadées automatiquement depuis le catalogue).
 *
 * Prérequis : SANITY_API_WRITE_TOKEN dans .env.local
 *   1. Allez sur https://www.sanity.io/manage
 *   2. Sélectionnez le projet "aissa-events" (ID 6ue0b6jo)
 *   3. API → Tokens → "Add API token", permission "Editor"
 *   4. Copiez le token dans .env.local : SANITY_API_WRITE_TOKEN=sk...
 *
 * Usage : pnpm seed
 *
 * Les images sont uploadées une fois et cachées dans `.sanity-image-cache.json`
 * (gitignored). Supprimer ce fichier pour forcer un ré-upload.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });
import { createClient } from "@sanity/client";
import { uploadAllImages, resolveImagePlaceholders } from "./upload-images";
import {
  siteSettingsDoc,
  homePageDoc,
  realisationDocs,
  testimonialDocs,
  faqItemDocs,
  packDocs,
  serviceDocs,
  mentionsLegalesDoc,
  politiqueConfidentialiteDoc,
  blogPageDoc,
} from "./seed-data";
import {
  mariagePageDoc,
  evenementPageDoc,
  espaceEventsPageDoc,
  realisationsPageDoc,
} from "./seed-pages";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "6ue0b6jo";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error(
    "\n❌ SANITY_API_WRITE_TOKEN manquant dans .env.local\n\n" +
      "Pour le créer :\n" +
      "  1. https://www.sanity.io/manage\n" +
      "  2. Projet 'aissa-events' (ID 6ue0b6jo)\n" +
      "  3. API → Tokens → Add API token\n" +
      "  4. Permission : Editor\n" +
      "  5. Copier le token dans .env.local : SANITY_API_WRITE_TOKEN=sk...\n",
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

async function seed() {
  console.log(`\n→ Seeding Sanity dataset "${dataset}" (project ${projectId})\n`);

  // 1. Upload toutes les images (avec cache local)
  console.log("  🖼  Upload des images");
  const images = await uploadAllImages(client);
  console.log();

  // 2. Documents qui peuvent être référencés (créés en premier pour les refs)
  const collections = [
    { label: "Réalisations", docs: realisationDocs },
    { label: "Témoignages", docs: testimonialDocs },
    { label: "FAQ items", docs: faqItemDocs },
    { label: "Packs", docs: packDocs },
    { label: "Services à la carte", docs: serviceDocs },
  ];

  for (const { label, docs } of collections) {
    console.log(`  📄 ${label} (${docs.length})`);
    for (const doc of docs) {
      const resolved = resolveImagePlaceholders(doc, images);
      await client.createOrReplace(resolved as never);
      console.log(`     ✓ ${doc._id}`);
    }
  }

  // 3. Singletons
  const singletons = [
    { label: "Réglages du site", doc: siteSettingsDoc },
    { label: "Page Accueil", doc: homePageDoc },
    { label: "Page Mariage", doc: mariagePageDoc },
    { label: "Page Événements pro", doc: evenementPageDoc },
    { label: "Page Espace Events", doc: espaceEventsPageDoc },
    { label: "Page Réalisations", doc: realisationsPageDoc },
    { label: "Page Blog", doc: blogPageDoc },
    { label: "Mentions légales", doc: mentionsLegalesDoc },
    { label: "Politique de confidentialité", doc: politiqueConfidentialiteDoc },
  ];

  for (const { label, doc } of singletons) {
    console.log(`\n  ⚙ ${label}`);
    const resolved = resolveImagePlaceholders(doc, images);
    await client.createOrReplace(resolved as never);
    console.log(`     ✓ ${doc._id}`);
  }

  console.log("\n✅ Seed terminé. Visite /studio pour voir les données.\n");
}

seed().catch((err) => {
  console.error("\n❌ Erreur pendant le seed :", err);
  process.exit(1);
});
