import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { sanityWriteClient } from "@/lib/sanity/client.server";
import { fetchGoogleReviews } from "@/lib/google-reviews";

/**
 * Cron de synchronisation des avis Google → Sanity.
 *
 * Auth : header `Authorization: Bearer <CRON_SECRET>` (injecté par Vercel Cron).
 * Fréquence : tous les jours à 8h UTC (configuré dans vercel.json).
 *
 * Chaque avis est upsert comme document `testimonial` avec un _id déterministe
 * (google-review-<slug-auteur>) pour garantir l'idempotence.
 */

function isAuthorized(req: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = req.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reviews = await fetchGoogleReviews();

    if (reviews.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "Aucun avis récupéré (configuration manquante ou aucun avis).",
        synced: 0,
      });
    }

    // Upsert chaque avis dans Sanity
    const mutations = reviews.map((review) => {
      const slug = review.author
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      return sanityWriteClient.createOrReplace({
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
    });

    await Promise.all(mutations);

    // Invalide le cache Sanity des témoignages
    revalidateTag("testimonial", "max");

    return NextResponse.json({
      ok: true,
      message: `${reviews.length} avis Google synchronisés avec succès.`,
      synced: reviews.length,
      reviews: reviews.map((r) => ({ author: r.author, rating: r.rating })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[cron/sync-reviews] Erreur:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
