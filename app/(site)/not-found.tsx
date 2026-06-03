import { NotFoundContent } from "@/components/site/not-found-content";

/**
 * 404 des routes du site (ex. notFound() depuis /blog/[slug], /realisations/[slug]).
 * Rendue à l'intérieur de (site)/layout.tsx → header + footer présents.
 */
export default function SiteNotFound() {
  return <NotFoundContent />;
}
