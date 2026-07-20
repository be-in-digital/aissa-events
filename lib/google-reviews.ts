import "server-only";

export interface GoogleReview {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
  profilePhotoUrl: string;
}

/**
 * Récupère les avis Google d'Aïssa Events via Google Places API v1.
 * Retourne un tableau vide en cas d'erreur ou de configuration manquante.
 */
export async function fetchGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    console.warn("[google-reviews] GOOGLE_PLACES_API_KEY ou GOOGLE_PLACE_ID manquant — skip.");
    return [];
  }

  try {
    const url =
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}` +
      `?fields=reviews,rating,userRatingCount&key=${apiKey}`;

    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 }, // cache 1h côté Next.js
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[google-reviews] Erreur API ${res.status}: ${body}`);
      return [];
    }

    const data = await res.json() as {
      reviews?: Array<{
        authorAttribution?: { displayName?: string; photoUri?: string };
        rating?: number;
        text?: { text?: string };
        relativePublishTimeDescription?: string;
      }>;
    };

    const reviews: GoogleReview[] = (data.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Anonyme",
        rating: r.rating ?? 5,
        text: r.text?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "",
        profilePhotoUrl: r.authorAttribution?.photoUri ?? "",
      }))
      .filter((r) => r.text.length > 10) // exclut les avis sans texte
      .sort((a, b) => b.rating - a.rating) // meilleurs avis en premier
      .slice(0, 5);

    return reviews;
  } catch (err) {
    console.error("[google-reviews] Exception:", err);
    return [];
  }
}
