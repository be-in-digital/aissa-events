import { env } from "@/env";

export type CtaShape = {
  label: string | null;
  type: "anchor" | "calendly" | "external" | "form" | "internal" | null;
  internalPath: string | null;
  externalUrl: string | null;
  anchor: string | null;
  variant: "ghost" | "primary" | "secondary" | null;
};

export type ResolvedCta = {
  label: string;
  href: string;
  external: boolean;
  variant: "primary" | "secondary" | "ghost";
};

/**
 * Schémas autorisés pour les URLs externes. Rejette explicitement `javascript:`,
 * `data:`, `vbscript:`, etc. afin de bloquer toute XSS stockée via le CMS.
 */
const SAFE_EXTERNAL_URL = /^(https?:|mailto:|tel:)/i;

/**
 * Valide qu'un chemin interne reste sur le site (commence par "/" mais pas par
 * "//evil.com" ni "\\evil.com") et ne contient pas de schéma exotique.
 */
function sanitizeInternalPath(path: string | null | undefined): string | null {
  if (!path) return null;
  // Doit commencer par "/" et pas par "//" ou "/\\"
  if (!path.startsWith("/")) return null;
  if (path.startsWith("//") || path.startsWith("/\\")) return null;
  // Rejet de tout ce qui ressemble à un schéma (javascript:, data:, etc.)
  if (/^[a-z]+:/i.test(path.slice(1))) return null;
  return path;
}

/**
 * Valide qu'une ancre est un identifiant simple (chiffres, lettres, tiret, underscore).
 */
function sanitizeAnchor(anchor: string | null | undefined): string | null {
  if (!anchor) return null;
  return /^[a-z0-9_-]+$/i.test(anchor) ? anchor : null;
}

export function resolveCta(cta: CtaShape | null | undefined): ResolvedCta | null {
  if (!cta?.label) return null;

  const variant = cta.variant ?? "primary";
  const baseExternal = { label: cta.label, external: true, variant };

  switch (cta.type) {
    case "calendly":
      return { ...baseExternal, href: env.NEXT_PUBLIC_CALENDLY_URL };
    case "external": {
      if (!cta.externalUrl) return null;
      if (!SAFE_EXTERNAL_URL.test(cta.externalUrl)) return null;
      return { ...baseExternal, href: cta.externalUrl };
    }
    case "internal": {
      const safePath = sanitizeInternalPath(cta.internalPath ?? "/") ?? "/";
      return {
        label: cta.label,
        href: safePath,
        external: false,
        variant,
      };
    }
    case "anchor": {
      const safeAnchor = sanitizeAnchor(cta.anchor);
      return {
        label: cta.label,
        href: safeAnchor ? `#${safeAnchor}` : "#",
        external: false,
        variant,
      };
    }
    case "form":
      return {
        label: cta.label,
        href: "#contact",
        external: false,
        variant,
      };
    default:
      return null;
  }
}
