import type { MetadataRoute } from "next";
import { env } from "@/env";
import { sanityFetch } from "@/lib/sanity/fetch";
import { sitemapQuery } from "@/lib/sanity/queries";
import type { SitemapQueryResult } from "@/sanity.types";

const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/mariage", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/evenements-pro", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/espace-emerainville", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/realisations", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/politique-confidentialite", priority: 0.2, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const now = new Date();

  const dynamic = await sanityFetch<SitemapQueryResult>({
    query: sitemapQuery,
    tags: ["realisation", "post"],
  }).catch(() => ({ realisations: [], posts: [] }));

  const realisationEntries: MetadataRoute.Sitemap = (dynamic?.realisations ?? [])
    .filter((r) => r.slug)
    .map((r) => ({
      url: `${baseUrl}/realisations/${r.slug}`,
      lastModified: r._updatedAt ? new Date(r._updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  const postEntries: MetadataRoute.Sitemap = (dynamic?.posts ?? [])
    .filter((p) => p.slug)
    .map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p._updatedAt ? new Date(p._updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${baseUrl}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...realisationEntries,
    ...postEntries,
  ];
}
