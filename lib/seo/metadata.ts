import type { Metadata } from "next";
import { env } from "@/env";
import { urlForImageString } from "@/lib/sanity/image";
import type { Seo } from "@/sanity.types";

/**
 * Fallback Open Graph image — non utilisée par défaut sur les pages du
 * segment `(site)` qui héritent automatiquement de `app/(site)/opengraph-image.tsx`
 * (PNG 1200×630 généré côté serveur, compatible LinkedIn/Twitter/Slack).
 *
 * Toujours exposée pour les pages qui veulent fournir un fallback explicite
 * (ex: articles blog avec image de hero, réalisations).
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
  // 3. Sinon : on laisse Next utiliser `app/(site)/opengraph-image.tsx`
  //    (PNG 1200×630 auto-généré) en ne mettant PAS de `images` dans
  //    la metadata — sinon notre `images` court-circuite la fichier-based image.
  const sanityOg =
    seo?.ogImage && (seo.ogImage as { asset?: unknown }).asset
      ? urlForImageString(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          seo.ogImage as any,
          { width: 1200, height: 630 },
        )
      : null;

  const fb = fallbackImage;
  const fbAbsoluteUrl = fb
    ? fb.url.startsWith("http")
      ? fb.url
      : `${baseUrl}${fb.url.startsWith("/") ? "" : "/"}${fb.url}`
    : null;

  const ogImageEntry = sanityOg
    ? {
        url: sanityOg,
        width: 1200,
        height: 630,
        alt: title ?? fb?.alt ?? "Aïssa Events",
      }
    : fb && fbAbsoluteUrl
      ? {
          url: fbAbsoluteUrl,
          width: fb.width ?? 1200,
          height: fb.height ?? 630,
          alt: fb.alt ?? title ?? "Aïssa Events",
        }
      : null;

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
      ...(ogImageEntry ? { images: [ogImageEntry] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description: description ?? undefined,
      ...(twitterImage ? { images: [twitterImage] } : {}),
    },
  };
}
