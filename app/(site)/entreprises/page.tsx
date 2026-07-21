import type { Metadata } from "next";
import { Suspense } from "react";
import { sanityFetch } from "@/lib/sanity/fetch";
import { evenementPageQuery } from "@/lib/sanity/queries";
import type { EvenementPageQueryResult } from "@/sanity.types";
import { buildMetadata } from "@/lib/seo/metadata";
import { safeJsonLd } from "@/lib/seo/json-ld";
import { env } from "@/env";

// Page Entreprises reconstruite selon les « Directives webmaster — Page Business »
// (juillet 2026). Ordre exact : Bandeau → Lieux → Packs → Budget → Pourquoi →
// Méthode → Preuves → CTA final → Formulaire de qualification.
//
// Les sections héritées de l'ancienne page pro (bandeau crédibilité, intro
// signature musicale, formats, fondatrice, timeline, à la carte, FAQ, sticky
// CTA) sont conservées dans le repo mais retirées de cette page pour respecter
// la structure demandée. Réactivables en décommentant l'import + le rendu.
import { EvenementHero } from "@/components/evenements-pro/hero";
// import { EvenementTrustBar } from "@/components/evenements-pro/trust-bar";
// import { EvenementIntro } from "@/components/evenements-pro/intro";
// import { EvenementLogos } from "@/components/evenements-pro/logos";
// import { EvenementUseCases } from "@/components/evenements-pro/usecases";
// import { EvenementFounder } from "@/components/evenements-pro/founder";
import { EvenementPacks } from "@/components/evenements-pro/packs";
import { EvenementBudget } from "@/components/evenements-pro/budget";
import { EvenementLieux } from "@/components/evenements-pro/lieux";
// import { EvenementTimeline } from "@/components/evenements-pro/timeline";
import { EvenementScope } from "@/components/evenements-pro/scope";
// import { EvenementALaCarte } from "@/components/evenements-pro/alacarte";
import { EvenementPortfolio } from "@/components/evenements-pro/portfolio";
// import { EvenementTestimonials } from "@/components/evenements-pro/testimonials";
import { EvenementProcess } from "@/components/evenements-pro/process";
// import { EvenementFaq } from "@/components/evenements-pro/faq";
import { EvenementCtaFinal } from "@/components/evenements-pro/cta-final";
import { QualificationForm } from "@/components/evenements-pro/qualification-form";
// import { EvenementStickyCta } from "@/components/evenements-pro/sticky-cta";
import { AvailabilitySection } from "@/components/availability/section";

const PATH = "/entreprises";

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
      "Organisation d'événements professionnels en Île-de-France | Aïssa Events",
    fallbackDescription:
      "Aïssa Events conçoit, organise et coordonne vos séminaires, afterworks et événements d'entreprise à Émerainville, dans vos locaux ou dans un lieu partenaire en Île-de-France.",
    pathname: PATH,
  });
}

export default async function EvenementPage() {
  const data = await getEvenementData();

  return (
    <>
      <ProServiceJsonLd />

      {/* Section 1 — Bandeau d'ouverture */}
      <EvenementHero data={data?.hero} />

      {/* Section 2 — Trois lieux d'intervention */}
      <EvenementLieux data={data?.lieux} />

      {/* Section 3 — Les quatre packs (une seule ligne en desktop) */}
      <EvenementPacks data={data?.packs} quoteAnchor="#devis" />

      {/* Section 4 — Comment est construit le budget ? */}
      <EvenementBudget data={data?.budget} />

      {/* Section 5 — Pourquoi Aïssa Events ? (slot « scope ») */}
      <EvenementScope data={data?.scope} />

      {/* Section 6 — Notre méthode */}
      <EvenementProcess data={data?.process} />

      {/* Preuves professionnelles, rapprochées du CTA (cf. directives §9) */}
      <EvenementPortfolio data={data?.portfolio} />

      {/* Disponibilités / agenda — conservé (cf. audit §9) */}
      <AvailabilitySection
        utmSource="entreprises"
        utmContent="calendar-pro"
        eyebrow="Disponibilités"
        title="Votre date butoir tient-elle ?"
        description="L'agenda d'Aïssa pour les événements pro. Cliquez sur votre date cible pour bloquer un appel cadrage — confirmation sous 48 h."
        nextSlotsEyebrow="Prochaines dates"
        nextSlotsTitle="Les vendredis et samedis encore libres"
      />

      {/* Section 7 — Appel à l'action final */}
      <EvenementCtaFinal data={data?.finalCta} />

      {/* Formulaire de qualification (un seul, en bas de page) */}
      <Suspense fallback={null}>
        <QualificationForm data={data?.qualificationForm} />
      </Suspense>
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(payload) }}
    />
  );
}
