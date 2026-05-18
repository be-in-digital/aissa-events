import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/fetch";
import { evenementPageQuery } from "@/lib/sanity/queries";
import type { EvenementPageQueryResult } from "@/sanity.types";
import { buildMetadata } from "@/lib/seo/metadata";
import { safeJsonLd } from "@/lib/seo/json-ld";
import { getSiteSettings } from "@/lib/sanity/site";
import { env } from "@/env";

import { EvenementHero } from "@/components/evenements-pro/hero";
import { EvenementTrustBar } from "@/components/evenements-pro/trust-bar";
import { EvenementIntro } from "@/components/evenements-pro/intro";
// import { EvenementLogos } from "@/components/evenements-pro/logos";
// ↑ À activer dès qu'on a 6-10 logos clients pros à afficher
import { EvenementUseCases } from "@/components/evenements-pro/usecases";
import { EvenementFounder } from "@/components/evenements-pro/founder";
import { EvenementPacks } from "@/components/evenements-pro/packs";
import { EvenementLieux } from "@/components/evenements-pro/lieux";
import { EvenementTimeline } from "@/components/evenements-pro/timeline";
import { EvenementScope } from "@/components/evenements-pro/scope";
import { EvenementALaCarte } from "@/components/evenements-pro/alacarte";
import { EvenementPortfolio } from "@/components/evenements-pro/portfolio";
// import { EvenementTestimonials } from "@/components/evenements-pro/testimonials";
// ↑ À activer dès qu'on a 3 témoignages signés (décideurs B2B)
import { EvenementProcess } from "@/components/evenements-pro/process";
import { EvenementFaq } from "@/components/evenements-pro/faq";
import { EvenementCtaFinal } from "@/components/evenements-pro/cta-final";
import { EvenementStickyCta } from "@/components/evenements-pro/sticky-cta";
import { AvailabilitySection } from "@/components/availability/section";

const PATH = "/evenements-pro";

async function getEvenementData() {
  return sanityFetch<EvenementPageQueryResult>({
    query: evenementPageQuery,
    tags: ["evenementPage", "siteSettings"],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getEvenementData();
  return buildMetadata({
    seo: data?.seo,
    fallbackTitle:
      "Événements professionnels — Soirées clients · Lancements · Séminaires · Aïssa Events",
    fallbackDescription:
      "Direction artistique d'événements pro : afterworks, soirées clients, lancements, séminaires. Pack Ambiance Signature dès 1 750 €. À l'Espace Events ou dans vos locaux. Devis sous 48 h.",
    pathname: PATH,
  });
}

export default async function EvenementPage() {
  const [data, settings] = await Promise.all([
    getEvenementData(),
    getSiteSettings(),
  ]);

  return (
    <>
      <ProServiceJsonLd />
      <EvenementHero data={data?.hero} />
      <EvenementTrustBar data={data?.trustBar} />
      <EvenementIntro data={data?.intro} />
      {/* <EvenementLogos /> — à activer dès logos clients dispo */}
      <EvenementUseCases data={data?.usecases} />
      <EvenementFounder founder={settings?.founder} />
      <EvenementPacks data={data?.packs} />
      <EvenementLieux data={data?.lieux} />
      <EvenementTimeline data={data?.timeline} />
      <EvenementScope data={data?.scope} />
      <EvenementALaCarte data={data?.alacarte} />
      <EvenementPortfolio data={data?.portfolio} />
      {/* <EvenementTestimonials /> — à activer dès témoignages décideurs dispo */}
      <EvenementProcess data={data?.process} />
      <EvenementFaq data={data?.faq} />
      <AvailabilitySection
        utmSource="evenements-pro"
        utmContent="calendar-pro"
        eyebrow="Disponibilités"
        title="Votre date butoir tient-elle ?"
        description="L'agenda d'Aïssa pour les événements pro. Cliquez sur votre date cible pour bloquer un appel cadrage — confirmation sous 48 h."
        nextSlotsEyebrow="Prochaines dates"
        nextSlotsTitle="Les vendredis et samedis encore libres"
      />
      <EvenementCtaFinal data={data?.finalCta} />
      <EvenementStickyCta data={data?.stickyCta} />
    </>
  );
}

function ProServiceJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Corporate event planning",
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
    name: "Direction artistique d'événements professionnels — Aïssa Events",
    description:
      "Pack Ambiance Signature et organisation sur mesure pour soirées clients, afterworks, lancements de produits, séminaires et conventions internes en Île-de-France.",
    url: `${env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}${PATH}`,
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Pack Ambiance Signature",
        price: "1750",
        priceCurrency: "EUR",
        description:
          "Direction artistique, DJ, mise en lumière, décoration et coordination — tout inclus.",
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
