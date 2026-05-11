import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Webhook Sanity → revalidation Next.js.
 *
 * Configuration côté Sanity (https://www.sanity.io/manage → projet → API → Webhooks) :
 *   - URL          : https://<votre-domaine>/api/revalidate
 *   - Trigger on   : Create, Update, Delete
 *   - Filter       : `_type in ["homePage","mariagePage","evenementPage",
 *                    "espaceEventsPage","realisationsPage","blogPage",
 *                    "siteSettings","mentionsLegales","politiqueConfidentialite",
 *                    "post","realisation","pack","testimonial","faqItem",
 *                    "service","category","partner"]`
 *   - Projection   : `{_type, "slug": slug.current}`
 *   - HTTP method  : POST
 *   - HTTP headers : `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`
 *
 * Le secret doit correspondre à la variable d'env `SANITY_REVALIDATE_SECRET`.
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Secret de revalidation non configuré sur le serveur." },
      { status: 500 },
    );
  }

  // Vérification du secret via Authorization Bearer (préféré) ou query ?secret=
  const authHeader = request.headers.get("authorization");
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");

  const providedSecret = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : querySecret;

  if (providedSecret !== secret) {
    return NextResponse.json(
      { ok: false, error: "Secret invalide." },
      { status: 401 },
    );
  }

  let payload: { _type?: string; slug?: string } = {};
  try {
    payload = await request.json();
  } catch {
    // Si pas de payload JSON, on revalide tout en best-effort
  }

  const tags = new Set<string>();
  const docType = payload._type;
  const slug = payload.slug;

  if (docType) {
    tags.add(docType);

    // Tag granulaire pour les docs slugés (purge ciblée d'un article/réalisation)
    if (slug && (docType === "post" || docType === "realisation")) {
      tags.add(`${docType}:${slug}`);
    }
  } else {
    // Pas de _type → on purge tout (mode panique / test webhook depuis Studio)
    const allTags = [
      "homePage",
      "mariagePage",
      "evenementPage",
      "espaceEventsPage",
      "realisationsPage",
      "blogPage",
      "siteSettings",
      "mentionsLegales",
      "politiqueConfidentialite",
      "post",
      "realisation",
      "pack",
      "testimonial",
      "faqItem",
      "service",
      "category",
      "partner",
    ];
    for (const t of allTags) tags.add(t);
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({
    ok: true,
    revalidated: Array.from(tags),
    docType,
    slug,
    at: new Date().toISOString(),
  });
}

/**
 * GET pour pouvoir tester la route manuellement (curl) ou vérifier qu'elle est vivante.
 * Ne révèle pas le secret, juste le statut.
 */
export async function GET() {
  const configured = Boolean(process.env.SANITY_REVALIDATE_SECRET);
  return NextResponse.json({
    ok: true,
    route: "/api/revalidate",
    method: "POST",
    secretConfigured: configured,
  });
}
