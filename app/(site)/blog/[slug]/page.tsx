import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/lib/sanity/fetch";
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

import { BlogArticleHero } from "@/components/blog/article-hero";
import { BlogArticleContent } from "@/components/blog/article-content";
import { BlogArticleCta } from "@/components/blog/article-cta";
import { BlogRelated } from "@/components/blog/related";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await sanityFetch<AllPostSlugsQueryResult>({
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

  return buildMetadata({
    seo: post.seo ?? null,
    fallbackTitle: post.title ?? "Aïssa Events",
    fallbackDescription: post.excerpt ?? undefined,
    pathname: `/blog/${slug}`,
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
      <ArticleJsonLd post={post} />
      <BlogArticleHero post={post} />
      <BlogArticleContent post={post} />
      <BlogArticleCta data={blogPage?.articleCta} />
      {related.length > 0 && <BlogRelated posts={related} />}
    </>
  );
}

function ArticleJsonLd({ post }: { post: NonNullable<PostBySlugQueryResult> }) {
  const payload = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Aïssa Events",
    },
    publisher: {
      "@type": "Organization",
      name: "Aïssa Events",
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
