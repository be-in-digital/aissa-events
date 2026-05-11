"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { Eyebrow } from "./eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { HomePageQueryResult } from "@/sanity.types";

type TestimonialsData = NonNullable<HomePageQueryResult>["testimonials"];

const FALLBACK_EYEBROW = "Avis clients";
const FALLBACK_TITLE = "Ce qu'ils\nen _disent._";

export function Testimonials({ data }: { data?: TestimonialsData }) {
  if (data?.enabled === false) return null;
  const items = data?.testimonials ?? [];
  if (items.length === 0) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;

  return (
    <section id="testimonials" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <div className="mb-5">
            <Eyebrow align="center">{eyebrow}</Eyebrow>
          </div>
          <h2
            className="mx-auto font-serif text-[44px] leading-[0.95] tracking-[-0.03em] sm:text-[60px] lg:text-[88px]"
            style={{ fontWeight: 300 }}
          >
            {title.split("\n").map((line, i, arr) => (
              <span key={i}>
                {renderInlineItalic(line)}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </motion.div>

        <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-2 lg:gap-8">
          {items.slice(0, 4).map((t, i) => {
            const rating = t?.rating ?? 5;
            return (
              <motion.figure
                key={t?._id ?? i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.15,
                }}
                className="relative flex h-full flex-col rounded-3xl border border-[var(--rule-soft)] bg-cream-soft p-10 sm:p-12"
              >
                <Quote
                  aria-hidden
                  className="absolute right-10 top-10 size-10 -scale-x-100 text-bordeaux/15"
                  strokeWidth={1.25}
                  fill="currentColor"
                />
                <p className="mb-6 font-mono text-[14px] tracking-[0.32em] text-gold">
                  {"★ ".repeat(rating).trim()}
                </p>
                <blockquote
                  className="font-serif text-[17px] italic leading-[1.6] text-ink sm:text-[18px]"
                  style={{ fontWeight: 300 }}
                >
                  {t?.quote}
                </blockquote>
                <figcaption className="mt-auto flex items-end justify-between gap-4 border-t border-[var(--rule)] pt-6 sm:pt-8">
                  <span className="font-script text-[36px] leading-none text-bordeaux">
                    {t?.authorName}
                  </span>
                  {t?.authorRole && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink">
                      {t.authorRole}
                    </span>
                  )}
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
