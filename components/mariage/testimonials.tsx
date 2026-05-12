"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { urlForImageString } from "@/lib/sanity/image";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { MariagePageQueryResult } from "@/sanity.types";

type TestimonialsData = NonNullable<MariagePageQueryResult>["testimonials"];

type Testimonial = {
  text: string;
  name: string;
  event: string;
  date: string;
  image: string | null;
};

/**
 * Sépare authorRole en (event, date) si le format est "Event · Date" ou "Event, date".
 * Sinon retourne authorRole comme event et "" comme date.
 */
function splitAuthorRole(role: string | null): { event: string; date: string } {
  if (!role) return { event: "", date: "" };
  const parts = role.split(/\s*[·,]\s*/);
  if (parts.length >= 2) {
    return {
      event: parts.slice(0, -1).join(" · "),
      date: parts[parts.length - 1],
    };
  }
  return { event: role, date: "" };
}

export function MariageTestimonials({ data }: { data?: TestimonialsData }) {
  if (data?.enabled === false) return null;

  const sanityTestimonials = data?.testimonials ?? [];
  if (sanityTestimonials.length === 0) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;

  const testimonials: Testimonial[] = sanityTestimonials.map((t) => {
    const { event, date } = splitAuthorRole(t.authorRole);
    return {
      text: t.quote ?? "",
      name: t.authorName ?? "",
      event,
      date,
      image: t.authorImage?.asset
        ? urlForImageString(t.authorImage, { width: 800, quality: 85 })
        : null,
    };
  });

  return (
    <section className="relative bg-cream-soft py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-[760px] text-center"
        >
          {eyebrow && (
            <div className="mb-6">
              <Eyebrow align="center">{eyebrow}</Eyebrow>
            </div>
          )}
          <h2
            className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
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

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={`${t.name}-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.12,
              }}
              whileHover={{ y: -6 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--rule-soft)] bg-cream transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)]"
            >
              {t.image && (
                <div className="relative aspect-[5/3] w-full overflow-hidden">
                  <Image
                    src={t.image}
                    alt={`${t.event} — ${t.name}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                  {t.event && (
                    <span className="absolute left-5 top-5 rounded-full bg-cream/95 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-bordeaux backdrop-blur-sm">
                      {t.event}
                    </span>
                  )}
                </div>
              )}

              <div className="relative flex flex-1 flex-col p-8 sm:p-9">
                <Quote
                  aria-hidden
                  className="absolute right-7 top-7 size-9 -scale-x-100 text-bordeaux/15"
                  strokeWidth={1.25}
                  fill="currentColor"
                />
                <p className="mb-5 font-mono text-[12px] tracking-[0.32em] text-gold">
                  ★ ★ ★ ★ ★
                </p>
                <blockquote
                  className="mb-7 font-serif text-[16px] italic leading-[1.6] text-ink"
                  style={{ fontWeight: 300 }}
                >
                  {t.text}
                </blockquote>
                <figcaption className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--rule)] pt-5">
                  <span className="font-script text-[28px] leading-none text-bordeaux">
                    {t.name}
                  </span>
                  {t.date && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink">
                      {t.date}
                    </span>
                  )}
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
