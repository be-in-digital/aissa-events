import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { sanityFetch } from "@/lib/sanity/fetch";
import { homePageQuery } from "@/lib/sanity/queries";
import type { HomePageQueryResult } from "@/sanity.types";
import { buildMetadata } from "@/lib/seo/metadata";
import { env } from "@/env";
import { getSiteSettings } from "@/lib/sanity/site";

import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { Pillars } from "@/components/home/pillars";
import { CaseStudies } from "@/components/home/case-studies";
import { Universes } from "@/components/home/universes";
import { Process } from "@/components/home/process";
import { About } from "@/components/home/about";
import { Testimonials } from "@/components/home/testimonials";
import { Faq } from "@/components/home/faq";
import { HomeAvailability } from "@/components/home/availability";
import { ContactSection } from "@/components/home/contact-section";

/** Ordre par défaut utilisé lorsque sectionsOrder n'est pas défini dans Sanity. */
const DEFAULT_ORDER = [
  "hero",
  "marquee",
  "caseStudies",
  "universes",
  "process",
  "about",
  "pillars",
  "testimonials",
  "faq",
  "leadMagnet",
  "contact",
] as const;

async function getHomeData() {
  return sanityFetch<HomePageQueryResult>({
    query: homePageQuery,
    tags: ["homePage", "siteSettings"],
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomeData();
  return buildMetadata({
    seo: data?.seo,
    fallbackTitle:
      "Aïssa Events · Agence événementielle à Émerainville (77)",
    fallbackDescription:
      "Agence événementielle à Émerainville (Seine-et-Marne), depuis 2020. Notre lieu (Espace Events) accueille mariages, baptêmes, anniversaires, henné, événements pros et soirées jusqu'à 50 personnes. Pour les autres formats, nous nous déplaçons partout en Île-de-France. Devis sous 48 h.",
    pathname: "/",
  });
}

export default async function HomePage() {
  const [data, settings] = await Promise.all([getHomeData(), getSiteSettings()]);
  const calendlyUrl = settings?.calendlyUrl ?? env.NEXT_PUBLIC_CALENDLY_URL;

  // Ordre éditable depuis le Studio Sanity ; retombe sur DEFAULT_ORDER si absent/vide.
  const order: string[] =
    data?.sectionsOrder && data.sectionsOrder.length > 0
      ? data.sectionsOrder
      : [...DEFAULT_ORDER];

  /**
   * Dictionnaire des sections rendues.
   * "leadMagnet" n'a pas de composant dédié dans la home pour l'instant ;
   * il est conservé dans le schema pour extension future.
   */
  const sectionMap: Record<string, ReactNode> = {
    hero: <Hero data={data?.hero} />,
    marquee: <Marquee data={data?.marquee} />,
    caseStudies: <CaseStudies data={data?.caseStudies} />,
    universes: <Universes data={data?.universes} />,
    process: <Process data={data?.process} />,
    about: <About data={data?.about} founder={settings?.founder} />,
    pillars: <Pillars data={data?.pillars} />,
    testimonials: <Testimonials data={data?.testimonials} />,
    faq: <Faq data={data?.faq} />,
    // "availability" est toujours en dernier avant contact — pas réorganisable via sectionsOrder
    contact: (
      <ContactSection
        data={data?.contact}
        calendlyUrl={calendlyUrl}
        settings={settings}
      />
    ),
  };

  return (
    <>
      {order.map((key) => {
        const node = sectionMap[key];
        if (!node) return null;
        return <Fragment key={key}>{node}</Fragment>;
      })}
      {/* Section disponibilités : toujours rendue après les sections ordonnables */}
      <HomeAvailability />
      {/* Si "contact" n'était pas dans sectionsOrder, on le force en fin de page */}
      {!order.includes("contact") && (
        <ContactSection
          data={data?.contact}
          calendlyUrl={calendlyUrl}
          settings={settings}
        />
      )}
    </>
  );
}
