import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/fetch";
import { mariagePageQuery } from "@/lib/sanity/queries";
import type { MariagePageQueryResult } from "@/sanity.types";
import { buildMetadata } from "@/lib/seo/metadata";
import { safeJsonLd } from "@/lib/seo/json-ld";
import { getSiteSettings } from "@/lib/sanity/site";
import { env } from "@/env";

import { MariageHero } from "@/components/mariage/hero";
import { MariageTrustBar } from "@/components/mariage/trust-bar";
import { MariageIntro } from "@/components/mariage/intro";
import { MariageFounder } from "@/components/mariage/founder";
import { MariageCeremonies } from "@/components/mariage/ceremonies";
import { MariagePacks } from "@/components/mariage/packs";
import { MariageLieux } from "@/components/mariage/lieux";
import { MariageTimeline } from "@/components/mariage/timeline";
import { MariageThemes } from "@/components/mariage/themes";
import { MariageALaCarte } from "@/components/mariage/alacarte";
import { MariagePortfolio } from "@/components/mariage/portfolio";
import { MariageTestimonials } from "@/components/mariage/testimonials";
import { MariageConditions } from "@/components/mariage/conditions";
import { MariageFaq } from "@/components/mariage/faq";
import { MariageCtaFinal } from "@/components/mariage/cta-final";
import { MariageStickyCta } from "@/components/mariage/sticky-cta";
import { AvailabilitySection } from "@/components/availability/section";

const PATH = "/mariage";

async function getMariageData() {
  return sanityFetch<MariagePageQueryResult>({
    query: mariagePageQuery,
    tags: ["mariagePage", "siteSettings"],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getMariageData();
  return buildMetadata({
    seo: data?.seo,
    fallbackTitle:
      "Mariages & Cérémonies — Wedding Planner Diplômée · Aïssa Events",
    fallbackDescription:
      "Wedding planning sur mesure : organisation complète ou à la carte. Mariages civils, henné, baptêmes, cérémonies religieuses ou laïques. À l'Espace Events, dans un lieu partenaire ou chez vous. Devis sous 48h.",
    pathname: PATH,
  });
}

export default async function MariagePage() {
  const [data, settings] = await Promise.all([
    getMariageData(),
    getSiteSettings(),
  ]);

  return (
    <>
      <WeddingPlannerJsonLd />
      <MariageHero data={data?.hero} />
      <MariageTrustBar data={data?.trustBar} />
      <MariageIntro data={data?.intro} />
      <MariageCeremonies data={data?.ceremonies} />
      <MariagePacks data={data?.packs} />
      <MariageFounder founder={settings?.founder} />
      <MariageLieux data={data?.lieux} />
      <AvailabilitySection
        utmSource="mariage"
        utmContent="calendar-mariage"
        eyebrow="Disponibilités"
        title="Votre date est-elle libre ?"
        description="L'agenda d'Aïssa pour les mariages, mis à jour en quasi-temps réel. Cliquez sur votre date pour réserver un appel découverte — elle confirme sa disponibilité sous 48 h."
        nextSlotsEyebrow="Prochaines dates"
        nextSlotsTitle="Les samedis de mariage encore libres"
      />
      <MariageThemes data={data?.themes} />
      <MariageALaCarte data={data?.alacarte} />
      <MariagePortfolio data={data?.portfolio} />
      <MariageTestimonials data={data?.testimonials} />
      <MariageTimeline data={data?.timeline} />
      <MariageConditions data={data?.conditions} />
      <MariageFaq data={data?.faq} />
      <MariageCtaFinal data={data?.finalCta} />
      <MariageStickyCta data={data?.stickyCta} />
    </>
  );
}

function WeddingPlannerJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Wedding planning",
    provider: {
      "@type": "LocalBusiness",
      name: "Aïssa Events",
      telephone: "+33661948859",
      email: "contact@aissaevents.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "35 Bd de Beaubourg",
        addressLocality: "Émerainville",
        postalCode: "77184",
        addressRegion: "Île-de-France",
        addressCountry: "FR",
      },
    },
    name: "Wedding planning sur mesure — Aïssa Events",
    description:
      "Organisation complète ou coordination à la carte de mariages civils, religieux, laïques et cérémonies (henné, baptême, fiançailles) en Île-de-France et partout en France.",
    url: `${env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}${PATH}`,
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Organisation complète",
        description:
          "Wedding planning A à Z : recherche du lieu, prestataires, scénographie, coordination jour J.",
      },
      {
        "@type": "Offer",
        name: "À la carte",
        description:
          "Coordination jour J, recherche prestataires, scénographie ou direction artistique seules.",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(payload) }}
    />
  );
}
