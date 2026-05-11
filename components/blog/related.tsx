"use client";

import { motion } from "motion/react";
import { BlogPostCard } from "./post-card";
import { Eyebrow } from "@/components/home/eyebrow";
import type { PostsListQueryResult } from "@/sanity.types";

export function BlogRelated({ posts }: { posts: PostsListQueryResult }) {
  if (posts.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 grid items-end gap-8 lg:grid-cols-[1fr_1fr]"
        >
          <div>
            <div className="mb-5">
              <Eyebrow>À lire aussi</Eyebrow>
            </div>
            <h2
              className="font-serif text-[36px] leading-[1.05] tracking-[-0.03em] sm:text-[48px] lg:text-[56px]"
              style={{ fontWeight: 300 }}
            >
              D&apos;autres
              <br />
              <em className="italic text-bordeaux">inspirations.</em>
            </h2>
          </div>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {posts.map((post, i) => (
            <BlogPostCard key={post._id} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
