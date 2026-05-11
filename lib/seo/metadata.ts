import type { Metadata } from "next";
import { env } from "@/env";
import { urlForImageString } from "@/lib/sanity/image";
import type { Seo } from "@/sanity.types";

export function buildMetadata({
  seo,
  fallbackTitle,
  fallbackDescription,
  pathname,
}: {
  seo?: Seo | null;
  fallbackTitle?: string;
  fallbackDescription?: string;
  pathname?: string;
}): Metadata {
  const title = seo?.title ?? fallbackTitle;
  const description = seo?.description ?? fallbackDescription;
  const ogImage =
    seo?.ogImage && (seo.ogImage as { asset?: unknown }).asset
      ? urlForImageString(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          seo.ogImage as any,
          { width: 1200, height: 630 },
        )
      : null;

  const url = pathname
    ? `${env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}${pathname}`
    : undefined;

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
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? undefined,
      description: description ?? undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
