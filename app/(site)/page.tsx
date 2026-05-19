import type { Metadata } from "next";
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

  return (
    <>
      <Hero data={data?.hero} />
      <Marquee data={data?.marquee} />
      <CaseStudies data={data?.caseStudies} />
      <Universes data={data?.universes} />
      <Process data={data?.process} />
      <About data={data?.about} founder={settings?.founder} />
      <Pillars data={data?.pillars} />
      <Testimonials data={data?.testimonials} />
      <Faq data={data?.faq} />
      <HomeAvailability />
      <ContactSection
        data={data?.contact}
        calendlyUrl={calendlyUrl}
        settings={settings}
      />
    </>
  );
}
