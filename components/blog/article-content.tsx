"use client";

import { motion } from "motion/react";
import { Tag } from "lucide-react";
import { RichText } from "@/components/site/portable-text";
import type { PostBySlugQueryResult } from "@/sanity.types";

export function BlogArticleContent({
  post,
}: {
  post: NonNullable<PostBySlugQueryResult>;
}) {
  return (
    <section className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-[760px] px-6 sm:px-14">
        <motion.article
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[17px] leading-[1.8] text-ink-soft sm:text-[18px]"
        >
          <RichText value={post.body} />
        </motion.article>

        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 border-t border-[var(--rule)] pt-8"
          >
            <p className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
              <Tag className="size-3" strokeWidth={1.5} />
              Tags
            </p>
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-[var(--rule)] bg-cream-soft px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </section>
  );
}
