/**
 * Synchronisation MANUELLE (one-shot) des avis Google → témoignages Sanity.
 *
 * Réplique la logique du cron `app/api/cron/sync-reviews` pour populer les avis
 * immédiatement, sans attendre le cron quotidien ni la config Vercel.
 *
 * Usage :
 *   GOOGLE_PLACES_API_KEY=... GOOGLE_PLACE_ID=... pnpm tsx scripts/sync-google-reviews-once.ts
 */
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiKey = process.env.GOOGLE_PLACES_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID;

if (!projectId || !dataset || !token || !apiKey || !placeId) {
  console.error(
    "Manque : NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_WRITE_TOKEN / GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID",
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

type PlaceReview = {
  authorAttribution?: { displayName?: string; photoUri?: string };
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
};

async function main() {
  console.log(`→ Récupération des avis Google (place ${placeId})…`);
  const url =
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId!)}` +
    `?fields=reviews,rating,userRatingCount&key=${apiKey}&languageCode=fr`;
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) {
    console.error(`❌ API Google ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  const data = (await res.json()) as {
    rating?: number;
    userRatingCount?: number;
    reviews?: PlaceReview[];
  };
  console.log(`   Note ${data.rating} · ${data.userRatingCount} avis au total.`);

  const reviews = (data.reviews ?? [])
    .map((r) => ({
      author: r.authorAttribution?.displayName ?? "Anonyme",
      rating: r.rating ?? 5,
      text: r.text?.text ?? "",
      relativeTime: r.relativePublishTimeDescription ?? "",
    }))
    .filter((r) => r.text.length > 10)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  if (reviews.length === 0) {
    console.log("Aucun avis exploitable renvoyé par l'API.");
    return;
  }

  const tx = client.transaction();
  for (const review of reviews) {
    const slug = review.author
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    tx.createOrReplace({
      _id: `google-review-${slug}`,
      _type: "testimonial",
      authorName: review.author,
      authorRole: "Avis Google ⭐",
      quote: review.text,
      rating: review.rating,
      source: "google",
      featured: review.rating === 5,
      order: 0,
    });
    console.log(`   ✅ ${review.author} (${review.rating}★) — ${review.relativeTime}`);
  }
  await tx.commit();
  console.log(`✅ ${reviews.length} avis Google synchronisés dans Sanity (témoignages).`);
}

main().catch((err) => {
  console.error("❌ Sync échouée :", err);
  process.exit(1);
});
