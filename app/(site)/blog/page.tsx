import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/lib/sanity/fetch";
import { blogPageQuery, postsListQuery } from "@/lib/sanity/queries";
import type {
  BlogPageQueryResult,
  PostsListQueryResult,
} from "@/sanity.types";

import { BlogIndexHero } from "@/components/blog/index-hero";
import { BlogPostList } from "@/components/blog/post-list";
import { BlogEmptyState } from "@/components/blog/empty-state";

const PATH = "/blog";

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<BlogPageQueryResult>({
    query: blogPageQuery,
    tags: ["blogPage"],
  });

  return buildMetadata({
    seo: data?.seo ?? null,
    fallbackTitle:
      data?.title ?? "Inspirations & conseils — Aïssa Events",
    fallbackDescription:
      data?.intro ??
      "Le journal d'Aïssa Events : inspirations, coulisses, conseils pratiques pour mariages, événements pros et célébrations privées.",
    pathname: PATH,
  });
}

export default async function BlogPage() {
  const [page, posts] = await Promise.all([
    sanityFetch<BlogPageQueryResult>({
      query: blogPageQuery,
      tags: ["blogPage"],
    }),
    sanityFetch<PostsListQueryResult>({
      query: postsListQuery,
      tags: ["post"],
    }),
  ]);

  const title = page?.title ?? "Inspirations & conseils";
  const intro =
    page?.intro ??
    "Inspirations, coulisses, conseils pratiques. Le journal d'Aïssa Events pour celles et ceux qui préparent un événement qui leur ressemble.";

  return (
    <>
      <BlogIndexHero title={title} intro={intro} count={posts.length} />
      {posts.length > 0 ? (
        <BlogPostList posts={posts} />
      ) : (
        <BlogEmptyState />
      )}
    </>
  );
}
