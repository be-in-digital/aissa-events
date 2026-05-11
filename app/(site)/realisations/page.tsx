import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  realisationsPageQuery,
  realisationsListQuery,
} from "@/lib/sanity/queries";
import type {
  RealisationsListQueryResult,
  RealisationsPageQueryResult,
} from "@/sanity.types";
import { buildMetadata } from "@/lib/seo/metadata";

import { RealisationsHero } from "@/components/realisations/hero";
import { RealisationsTrustBar } from "@/components/realisations/trust-bar";
import { RealisationsGallery } from "@/components/realisations/gallery";
import { RealisationsCaseStudies } from "@/components/realisations/case-studies";
import { RealisationsCtaFinal } from "@/components/realisations/cta-final";
import { RealisationsStickyCta } from "@/components/realisations/sticky-cta";

const PATH = "/realisations";

async function getRealisationsData() {
  return sanityFetch<RealisationsPageQueryResult>({
    query: realisationsPageQuery,
    tags: ["realisationsPage", "realisation", "siteSettings"],
  });
}

async function getRealisationsList() {
  return sanityFetch<RealisationsListQueryResult>({
    query: realisationsListQuery,
    tags: ["realisation"],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getRealisationsData();
  return buildMetadata({
    seo: data?.seo,
    fallbackTitle:
      "Réalisations — Mariages · Événements pro · Célébrations · Aïssa Events",
    fallbackDescription:
      "Toutes nos réalisations : mariages multi-cérémonies, lancements de marque, soirées clients, séminaires, anniversaires. Une sélection filtrable + 3 études de cas en détail.",
    pathname: PATH,
  });
}

export default async function RealisationsPage() {
  const [data, realisations] = await Promise.all([
    getRealisationsData(),
    getRealisationsList(),
  ]);

  return (
    <>
      <RealisationsHero data={data?.hero} />
      <RealisationsTrustBar data={data?.trustBar} />
      <RealisationsGallery
        data={{
          galleryEyebrow: data?.galleryEyebrow,
          galleryTitle: data?.galleryTitle,
          filters: data?.filters,
          introText: data?.introText,
        }}
        realisations={realisations}
      />
      <RealisationsCaseStudies data={data?.caseStudies} />
      <RealisationsCtaFinal data={data?.finalCta} />
      <RealisationsStickyCta data={data?.stickyCta} />
    </>
  );
}
