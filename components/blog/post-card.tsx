"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Clock } from "lucide-react";
import { urlForImageString } from "@/lib/sanity/image";
import type { PostsListQueryResult } from "@/sanity.types";

type Post = PostsListQueryResult[number];

const FALLBACK =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=85";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BlogPostCard({
  post,
  index = 0,
  featured = false,
}: {
  post: Post;
  index?: number;
  featured?: boolean;
}) {
  const slug = post.slug ?? "";
  const cover = post.cover?.asset
    ? urlForImageString(post.cover, { width: featured ? 1600 : 900 })
    : FALLBACK;
  const alt = post.cover?.alt || post.title || "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08,
      }}
      whileHover={{ y: -6 }}
      className={`group relative ${featured ? "lg:col-span-2" : ""}`}
    >
      <Link
        href={`/blog/${slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        <div
          className={`relative overflow-hidden rounded-[24px] ${
            featured ? "aspect-[16/9]" : "aspect-[4/5]"
          }`}
        >
          <Image
            src={cover}
            alt={alt}
            fill
            sizes={
              featured
                ? "(max-width: 1024px) 100vw, 60vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
          {featured && (
            <span className="absolute left-5 top-5 rounded-full bg-cream/95 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-bordeaux backdrop-blur-sm">
              ★ À la une
            </span>
          )}
          <span className="absolute right-5 top-5 inline-flex size-10 items-center justify-center rounded-full bg-cream/90 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
          {post.category?.title && <span>{post.category.title}</span>}
          {post.publishedAt && (
            <>
              <span className="text-muted-ink/40">·</span>
              <span className="text-muted-ink">
                {formatDate(post.publishedAt)}
              </span>
            </>
          )}
          {post.readingTime ? (
            <>
              <span className="text-muted-ink/40">·</span>
              <span className="inline-flex items-center gap-1.5 text-muted-ink">
                <Clock className="size-3" strokeWidth={1.5} />
                {post.readingTime} min
              </span>
            </>
          ) : null}
        </div>

        <h3
          className={`mt-3 font-serif tracking-[-0.02em] text-ink transition-colors group-hover:text-bordeaux ${
            featured
              ? "text-[28px] leading-[1.1] sm:text-[36px] lg:text-[44px]"
              : "text-[22px] leading-[1.2] sm:text-[26px]"
          }`}
          style={{ fontWeight: 400 }}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p
            className={`mt-3 leading-[1.65] text-ink-soft ${
              featured ? "max-w-[640px] text-[16px]" : "text-[14px]"
            }`}
          >
            {post.excerpt}
          </p>
        )}

        <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bordeaux transition-all group-hover:gap-3.5">
          Lire l&apos;article
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 active:translate-y-0 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.article>
  );
}
