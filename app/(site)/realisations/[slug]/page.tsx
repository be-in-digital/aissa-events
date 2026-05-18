import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch, sanityFetchStatic } from "@/lib/sanity/fetch";
import {
  allRealisationSlugsQuery,
  realisationBySlugQuery,
} from "@/lib/sanity/queries";
import type {
  AllRealisationSlugsQueryResult,
  RealisationBySlugQueryResult,
} from "@/sanity.types";
import { safeJsonLd } from "@/lib/seo/json-ld";
import { urlForImageString } from "@/lib/sanity/image";
import { env } from "@/env";

import { RealisationDetailHero } from "@/components/realisations/detail-hero";
import { RealisationDetailContent } from "@/components/realisations/detail-content";
import { RealisationDetailGallery } from "@/components/realisations/detail-gallery";
import { RealisationDetailTestimonial } from "@/components/realisations/detail-testimonial";
import { RealisationDetailCta } from "@/components/realisations/detail-cta";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await sanityFetchStatic<AllRealisationSlugsQueryResult>({
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

  // Fallback OG : cover de la réalisation si pas d'image SEO dédiée
  const coverFallback =
    realisation.cover && (realisation.cover as { asset?: unknown }).asset
      ? {
          url: urlForImageString(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            realisation.cover as any,
            { width: 1200, height: 630 },
          ),
          width: 1200,
          height: 630,
          alt: realisation.cover.alt || realisation.title || "Aïssa Events",
        }
      : undefined;

  return buildMetadata({
    seo: realisation.seo ?? null,
    fallbackTitle: realisation.title
      ? `${realisation.title} — Aïssa Events`
      : "Aïssa Events",
    fallbackDescription: realisation.italicSubtitle ?? undefined,
    pathname: `/realisations/${slug}`,
    fallbackImage: coverFallback,
  });
}

export default async function RealisationDetailPage({ params }: RouteProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<RealisationSkeleton />}>
      <RealisationContent slug={slug} />
    </Suspense>
  );
}

async function RealisationContent({ slug }: { slug: string }) {
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
      <RealisationJsonLd realisation={realisation} slug={slug} />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Réalisations", path: "/realisations" },
          {
            name: realisation.title ?? "Réalisation",
            path: `/realisations/${slug}`,
          },
        ]}
      />
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

function RealisationSkeleton() {
  return (
    <div aria-hidden className="mx-auto my-16 max-w-5xl space-y-6 px-4">
      <div className="h-[60vh] animate-pulse rounded-2xl bg-neutral-100" />
      <div className="h-8 w-2/3 animate-pulse rounded bg-neutral-100" />
      <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
      <div className="h-4 w-5/6 animate-pulse rounded bg-neutral-100" />
    </div>
  );
}

function RealisationJsonLd({
  realisation,
  slug,
}: {
  realisation: NonNullable<RealisationBySlugQueryResult>;
  slug: string;
}) {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const url = `${baseUrl}/realisations/${slug}`;

  const coverUrl =
    realisation.cover && (realisation.cover as { asset?: unknown }).asset
      ? urlForImageString(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          realisation.cover as any,
          { width: 1200, height: 630 },
        )
      : undefined;

  const payload = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: realisation.title,
    description: realisation.italicSubtitle ?? realisation.story ?? undefined,
    url,
    image: coverUrl ? [coverUrl] : undefined,
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
      url: baseUrl,
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

function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; path: string }>;
}) {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const payload = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(payload) }}
    />
  );
}
