import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch, sanityFetchStatic } from "@/lib/sanity/fetch";
import {
  allPostSlugsQuery,
  blogPageQuery,
  postBySlugQuery,
  postsListQuery,
} from "@/lib/sanity/queries";
import type {
  AllPostSlugsQueryResult,
  BlogPageQueryResult,
  PostBySlugQueryResult,
  PostsListQueryResult,
} from "@/sanity.types";
import { safeJsonLd } from "@/lib/seo/json-ld";
import { urlForImageString } from "@/lib/sanity/image";
import { env } from "@/env";

import { BlogArticleHero } from "@/components/blog/article-hero";
import { BlogArticleContent } from "@/components/blog/article-content";
import { BlogArticleCta } from "@/components/blog/article-cta";
import { BlogRelated } from "@/components/blog/related";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await sanityFetchStatic<AllPostSlugsQueryResult>({
    query: allPostSlugsQuery,
    tags: ["post"],
  });
  const params = slugs
    .map((s) => s.slug)
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ slug }));
  return params.length > 0 ? params : [{ slug: "__placeholder__" }];
}

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<PostBySlugQueryResult>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post", `post:${slug}`],
  });

  if (!post) {
    return buildMetadata({
      fallbackTitle: "Article introuvable — Aïssa Events",
      pathname: `/blog/${slug}`,
    });
  }

  // Fallback OG : cover de l'article si pas d'image SEO dédiée
  const coverFallback =
    post.cover && (post.cover as { asset?: unknown }).asset
      ? {
          url: urlForImageString(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            post.cover as any,
            { width: 1200, height: 630 },
          ),
          width: 1200,
          height: 630,
          alt: post.cover.alt || post.title || "Aïssa Events",
        }
      : undefined;

  return buildMetadata({
    seo: post.seo ?? null,
    fallbackTitle: post.title ?? "Aïssa Events",
    fallbackDescription: post.excerpt ?? undefined,
    pathname: `/blog/${slug}`,
    fallbackImage: coverFallback,
  });
}

export default async function BlogArticlePage({ params }: RouteProps) {
  const { slug } = await params;

  const post = await sanityFetch<PostBySlugQueryResult>({
    query: postBySlugQuery,
    params: { slug },
    tags: ["post", `post:${slug}`],
  });

  if (!post) {
    notFound();
  }

  return (
    <>
      <ArticleJsonLd post={post} slug={slug} />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Blog", path: "/blog" },
          {
            name: post.title ?? "Article",
            path: `/blog/${slug}`,
          },
        ]}
      />
      <BlogArticleHero post={post} />
      <BlogArticleContent post={post} />
      <Suspense fallback={<RelatedSkeleton />}>
        <BlogRelatedSection post={post} slug={slug} />
      </Suspense>
    </>
  );
}

async function BlogRelatedSection({
  post,
  slug,
}: {
  post: NonNullable<PostBySlugQueryResult>;
  slug: string;
}) {
  const [allPosts, blogPage] = await Promise.all([
    sanityFetch<PostsListQueryResult>({
      query: postsListQuery,
      tags: ["post"],
    }),
    sanityFetch<BlogPageQueryResult>({
      query: blogPageQuery,
      tags: ["blogPage"],
    }),
  ]);

  const related = allPosts
    .filter((p) => p.slug !== slug)
    .filter((p) =>
      post.category?.slug && p.category?.slug
        ? p.category.slug === post.category.slug
        : true,
    )
    .slice(0, 3);

  return (
    <>
      <BlogArticleCta data={blogPage?.articleCta} />
      {related.length > 0 && <BlogRelated posts={related} />}
    </>
  );
}

function RelatedSkeleton() {
  return (
    <div
      aria-hidden
      className="mx-auto my-16 h-48 max-w-5xl animate-pulse rounded-2xl bg-neutral-100"
    />
  );
}

function ArticleJsonLd({
  post,
  slug,
}: {
  post: NonNullable<PostBySlugQueryResult>;
  slug: string;
}) {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const url = `${baseUrl}/blog/${slug}`;

  const coverUrl =
    post.cover && (post.cover as { asset?: unknown }).asset
      ? urlForImageString(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          post.cover as any,
          { width: 1200, height: 630 },
        )
      : undefined;

  const payload = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: coverUrl ? [coverUrl] : undefined,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post._updatedAt ?? post.publishedAt ?? undefined,
    author: {
      "@type": "Organization",
      name: "Aïssa Events",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Aïssa Events",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/aissa-events-logo.svg`,
      },
    },
    articleSection: post.category?.title ?? undefined,
    keywords: post.tags?.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(payload) }}
    />
  );
}

function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; path: string }>;
}) {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const payload = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(payload) }}
    />
  );
}
