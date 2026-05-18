import type { Metadata } from "next";
import { env } from "@/env";
import { urlForImageString } from "@/lib/sanity/image";
import type { Seo } from "@/sanity.types";

/**
 * Fallback Open Graph image utilisée si aucun `seo.ogImage` n'est défini
 * dans Sanity et qu'aucune image (Sanity ou statique) n'est passée à la page.
 *
 * TODO design : remplacer par une vraie image 1200x630 (`/og-image.png`
 * ou équivalent). Le SVG du logo sert de placeholder temporaire — la plupart
 * des plateformes (Twitter/X, LinkedIn, Slack) supportent mal SVG.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/aissa-events-logo.svg",
  width: 1200,
  height: 630,
  alt: "Aïssa Events — Wedding planner & agence événementielle à Émerainville",
};

type FallbackImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

export function buildMetadata({
  seo,
  fallbackTitle,
  fallbackDescription,
  pathname,
  fallbackImage,
}: {
  seo?: Seo | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
  pathname?: string;
  /**
   * Image OG/Twitter à utiliser si `seo.ogImage` est absent.
   * URL absolue ou chemin relatif au site. Si omis, on retombe sur
   * `DEFAULT_OG_IMAGE`.
   */
  fallbackImage?: FallbackImage;
}): Metadata {
  const title = seo?.title ?? fallbackTitle;
  const description = seo?.description ?? fallbackDescription;

  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const url = pathname ? `${baseUrl}${pathname}` : undefined;

  // 1. Image Sanity SEO si dispo
  // 2. Sinon image passée par la page (ex: hero d'un article)
  // 3. Sinon image OG par défaut
  const sanityOg =
    seo?.ogImage && (seo.ogImage as { asset?: unknown }).asset
      ? urlForImageString(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          seo.ogImage as any,
          { width: 1200, height: 630 },
        )
      : null;

  const fb = fallbackImage ?? DEFAULT_OG_IMAGE;
  const fbAbsoluteUrl = fb.url.startsWith("http")
    ? fb.url
    : `${baseUrl}${fb.url.startsWith("/") ? "" : "/"}${fb.url}`;

  const ogImageEntry = sanityOg
    ? {
        url: sanityOg,
        width: 1200,
        height: 630,
        alt: title ?? fb.alt ?? "Aïssa Events",
      }
    : {
        url: fbAbsoluteUrl,
        width: fb.width ?? 1200,
        height: fb.height ?? 630,
        alt: fb.alt ?? title ?? "Aïssa Events",
      };

  const twitterImage = sanityOg ?? fbAbsoluteUrl;

  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: title ?? undefined,
      description: description ?? undefined,
      type: "website",
      locale: "fr_FR",
      url,
      images: [ogImageEntry],
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description: description ?? undefined,
      images: [twitterImage],
    },
  };
}
