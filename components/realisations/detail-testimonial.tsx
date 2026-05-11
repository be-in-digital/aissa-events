"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { urlForImageString } from "@/lib/sanity/image";
import type { RealisationBySlugQueryResult } from "@/sanity.types";

type Testimonial = NonNullable<
  NonNullable<RealisationBySlugQueryResult>["linkedTestimonial"]
>;

export function RealisationDetailTestimonial({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  if (!testimonial?.quote) return null;

  const image = testimonial.authorImage?.asset
    ? urlForImageString(testimonial.authorImage, { width: 800, quality: 85 })
    : null;

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <div className="mb-5 inline-block">
            <Eyebrow align="center">Témoignage</Eyebrow>
          </div>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[24px] border border-[var(--rule-soft)] bg-cream-soft p-10 sm:p-14 lg:p-16"
        >
          <Quote
            aria-hidden
            className="absolute right-10 top-10 size-14 -scale-x-100 text-bordeaux/10"
            strokeWidth={1.25}
            fill="currentColor"
          />
          {testimonial.rating ? (
            <p className="mb-5 font-mono text-[12px] tracking-[0.32em] text-gold">
              {"★ ".repeat(testimonial.rating).trim()}
            </p>
          ) : null}
          <blockquote
            className="mb-8 font-serif text-[20px] italic leading-[1.6] text-ink sm:text-[24px]"
            style={{ fontWeight: 300 }}
          >
            « {testimonial.quote} »
          </blockquote>
          <figcaption className="flex items-center gap-4 border-t border-[var(--rule)] pt-6">
            {image && (
              <div className="relative size-12 overflow-hidden rounded-full">
                <Image
                  src={image}
                  alt={testimonial.authorName || ""}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
            )}
            <div>
              {testimonial.authorName && (
                <p className="font-script text-[26px] leading-none text-bordeaux">
                  {testimonial.authorName}
                </p>
              )}
              {testimonial.authorRole && (
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                  {testimonial.authorRole}
                </p>
              )}
            </div>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
