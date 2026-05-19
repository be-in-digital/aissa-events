import type { ResolvedCta } from "@/lib/sanity/cta";

export type NavItem = {
  label: string;
  href: string;
  external: boolean;
};

/**
 * Fallback navigation utilisé si aucun menu n'est défini dans Sanity.
 * En production, le menu vient de siteSettings.headerNav.
 */
export const FALLBACK_NAV: NavItem[] = [
  { label: "Espace Events", href: "/espace-emerainville", external: false },
  { label: "Événements pro", href: "/evenements-pro", external: false },
  { label: "Mariage", href: "/mariage", external: false },
  { label: "Réalisations", href: "/realisations", external: false },
  { label: "Blog", href: "/blog", external: false },
];

export const FALLBACK_HEADER_CTA: ResolvedCta = {
  label: "Réserver un appel",
  href: "/#contact",
  external: false,
  variant: "primary",
};
