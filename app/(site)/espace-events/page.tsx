import type { Metadata } from "next";
import { sanityFetch } from "@/lib/sanity/fetch";
import { espaceEventsPageQuery } from "@/lib/sanity/queries";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";
import { buildMetadata } from "@/lib/seo/metadata";
import { safeJsonLd } from "@/lib/seo/json-ld";
import { env } from "@/env";

import { EspaceHero } from "@/components/espace/hero";
import { EspaceTrustBar } from "@/components/espace/trust-bar";
import { EspaceIntro } from "@/components/espace/intro";
import { EspaceGallery } from "@/components/espace/gallery";
import { EspaceOccasions } from "@/components/espace/occasions";
import { PackCelebration } from "@/components/espace/pack-celebration";
import { PackFiesta } from "@/components/espace/pack-fiesta";
import { NotYetDecided } from "@/components/espace/not-yet-decided";
import { ALaCarte } from "@/components/espace/alacarte";
import { LocationOnly } from "@/components/espace/location-only";
import { TestimonialsEspace } from "@/components/espace/testimonials-espace";
import { Conditions } from "@/components/espace/conditions";
import { FaqEspace } from "@/components/espace/faq-espace";
import { CtaFinal } from "@/components/espace/cta-final";
import { OtherServices } from "@/components/espace/other-services";
import { StickyCta } from "@/components/espace/sticky-cta";
import { AvailabilitySection } from "@/components/availability/section";

const PATH = "/espace-events";

async function getEspaceData() {
  return sanityFetch<EspaceEventsPageQueryResult>({
    query: espaceEventsPageQuery,
    tags: ["espaceEventsPage", "siteSettings"],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getEspaceData();
  return buildMetadata({
    seo: data?.seo,
    fallbackTitle: "Espace Events — Le lieu · Émerainville · Aïssa Events",
    fallbackDescription:
      "Espace Events à Émerainville (77) : un lieu modulable jusqu'à 50 personnes pour mariages civils, cérémonies, anniversaires, baby showers, afterworks. Pack Célébration dès 1 250 €, Pack Fiesta dès 1 000 €, location seule dès 350 €.",
    pathname: PATH,
  });
}

export default async function EspaceEmerainvillePage() {
  const data = await getEspaceData();

  return (
    <>
      <LocalBusinessJsonLd />
      <EspaceHero data={data?.hero} />
      <EspaceTrustBar data={data?.trustBar} />
      <EspaceIntro data={data?.intro} />
      <EspaceGallery data={data?.gallery} />
      <EspaceOccasions data={data?.occasions} />
      <PackCelebration data={data?.packs} />
      <PackFiesta data={data?.packsFiesta} />
      <NotYetDecided data={data?.notYetDecided} />
      <ALaCarte data={data?.alacarte} />
      <LocationOnly data={data?.locationOnly} />
      <AvailabilitySection
        utmSource="espace-events"
        utmContent="calendar-espace"
        eyebrow="Disponibilités"
        title="Quel jour vous tente ?"
        description="L'agenda d'Aïssa, mis à jour en quasi-temps réel. Cliquez sur une date pour bloquer un appel découverte (15 min) — elle confirme la dispo sous 48 h."
        nextSlotsEyebrow="Prochaines dates"
        nextSlotsTitle="Les samedis encore libres à l'Espace"
      />
      <TestimonialsEspace data={data?.testimonials} />
      <Conditions data={data?.conditions} />
      <FaqEspace data={data?.faq} />
      <CtaFinal data={data?.finalCta} />
      <OtherServices data={data?.otherServices} />
      <StickyCta data={data?.stickyCta} />
    </>
  );
}

function LocalBusinessJsonLd() {
  const payload = {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    name: "Espace Events Émerainville",
    description:
      "Lieu de réception privatisable à Émerainville (Seine-et-Marne) pour mariages, anniversaires et événements professionnels.",
    url: `${env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}${PATH}`,
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
    maximumAttendeeCapacity: 50,
    priceRange: "€€",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(payload) }}
    />
  );
}
