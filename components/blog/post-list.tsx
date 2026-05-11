"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BlogPostCard } from "./post-card";
import type { PostsListQueryResult } from "@/sanity.types";

type Props = {
  posts: PostsListQueryResult;
};

export function BlogPostList({ posts }: Props) {
  const [filter, setFilter] = useState<string>("all");

  const categories = useMemo(() => {
    const map = new Map<string, { slug: string; title: string; count: number }>();
    for (const p of posts) {
      const c = p.category;
      if (!c?.slug || !c?.title) continue;
      const existing = map.get(c.slug);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(c.slug, { slug: c.slug, title: c.title, count: 1 });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.title.localeCompare(b.title, "fr"),
    );
  }, [posts]);

  const filtered = useMemo(() => {
    if (filter === "all") return posts;
    return posts.filter((p) => p.category?.slug === filter);
  }, [posts, filter]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section className="relative bg-cream-soft py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 flex flex-wrap items-center gap-2 sm:gap-3"
            role="tablist"
            aria-label="Filtrer les articles"
          >
            <FilterButton
              label="Tous"
              count={posts.length}
              active={filter === "all"}
              onClick={() => setFilter("all")}
            />
            {categories.map((c) => (
              <FilterButton
                key={c.slug}
                label={c.title}
                count={c.count}
                active={filter === c.slug}
                onClick={() => setFilter(c.slug)}
              />
            ))}
          </motion.div>
        )}

        <motion.div layout className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {featured && (
              <BlogPostCard
                key={featured._id}
                post={featured}
                featured
                index={0}
              />
            )}
            {rest.map((post, i) => (
              <BlogPostCard key={post._id} post={post} index={i + 1} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center font-serif text-[15px] italic text-muted-ink">
            Aucun article dans cette catégorie pour le moment.
          </p>
        )}
      </div>
    </section>
  );
}

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.22em] transition-all duration-300 sm:px-5 sm:py-3 ${
        active
          ? "border-bordeaux bg-bordeaux text-cream"
          : "border-[var(--rule)] bg-cream text-ink-soft hover:border-bordeaux/40 hover:text-ink"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-2 py-0.5 font-sans text-[10px] tabular-nums leading-none transition-colors ${
          active
            ? "bg-cream/20 text-cream"
            : "bg-cream-soft text-muted-ink group-hover:text-bordeaux"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
