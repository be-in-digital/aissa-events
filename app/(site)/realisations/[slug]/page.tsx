import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  allRealisationSlugsQuery,
  realisationBySlugQuery,
} from "@/lib/sanity/queries";
import type {
  AllRealisationSlugsQueryResult,
  RealisationBySlugQueryResult,
} from "@/sanity.types";
import { safeJsonLd } from "@/lib/seo/json-ld";

import { RealisationDetailHero } from "@/components/realisations/detail-hero";
import { RealisationDetailContent } from "@/components/realisations/detail-content";
import { RealisationDetailGallery } from "@/components/realisations/detail-gallery";
import { RealisationDetailTestimonial } from "@/components/realisations/detail-testimonial";
import { RealisationDetailCta } from "@/components/realisations/detail-cta";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<AllRealisationSlugsQueryResult>({
    query: allRealisationSlugsQuery,
    tags: ["realisation"],
  });
  const params = slugs
    .map((s) => s.slug)
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ slug }));
  return params.length > 0 ? params : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const realisation = await sanityFetch<RealisationBySlugQueryResult>({
    query: realisationBySlugQuery,
    params: { slug },
    tags: ["realisation", `realisation:${slug}`],
  });

  if (!realisation) {
    return buildMetadata({
      fallbackTitle: "Réalisation introuvable — Aïssa Events",
      pathname: `/realisations/${slug}`,
    });
  }

  return buildMetadata({
    seo: realisation.seo ?? null,
    fallbackTitle: realisation.title
      ? `${realisation.title} — Aïssa Events`
      : "Aïssa Events",
    fallbackDescription: realisation.italicSubtitle ?? undefined,
    pathname: `/realisations/${slug}`,
  });
}

export default async function RealisationDetailPage({ params }: RouteProps) {
  const { slug } = await params;

  const realisation = await sanityFetch<RealisationBySlugQueryResult>({
    query: realisationBySlugQuery,
    params: { slug },
    tags: ["realisation", `realisation:${slug}`],
  });

  if (!realisation) {
    notFound();
  }

  return (
    <>
      <RealisationJsonLd realisation={realisation} />
      <RealisationDetailHero realisation={realisation} />
      <RealisationDetailContent realisation={realisation} />
      {realisation.gallery && realisation.gallery.length > 0 && (
        <RealisationDetailGallery gallery={realisation.gallery} />
      )}
      {realisation.linkedTestimonial && (
        <RealisationDetailTestimonial
          testimonial={realisation.linkedTestimonial}
        />
      )}
      <RealisationDetailCta />
    </>
  );
}

function RealisationJsonLd({
  realisation,
}: {
  realisation: NonNullable<RealisationBySlugQueryResult>;
}) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: realisation.title,
    description: realisation.italicSubtitle ?? realisation.story ?? undefined,
    startDate: realisation.eventDate ?? undefined,
    location: realisation.location
      ? {
          "@type": "Place",
          name: realisation.location,
        }
      : undefined,
    organizer: {
      "@type": "Organization",
      name: "Aïssa Events",
    },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    keywords: realisation.tags?.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(payload) }}
    />
  );
}
