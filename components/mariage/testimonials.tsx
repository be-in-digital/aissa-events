"use client";

import { MotionConfig, motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { TestimonialsCarousel } from "@/components/testimonials/carousel";
import { TestimonialCard } from "@/components/testimonials/card";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { MariagePageQueryResult } from "@/sanity.types";

type TestimonialsData = NonNullable<MariagePageQueryResult>["testimonials"];

type Item = {
  id: string;
  quote: string;
  name: string;
  meta: string;
  rating: number;
};

function buildMeta(role: string | null | undefined): string {
  return (role ?? "").trim();
}

export function MariageTestimonials({ data }: { data?: TestimonialsData }) {
  if (data?.enabled === false) return null;

  const list = data?.testimonials ?? [];
  if (list.length === 0) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;

  const items: Item[] = list.map((t, i) => ({
    id: `${t.authorName ?? "anon"}-${i}`,
    quote: t.quote ?? "",
    name: t.authorName ?? "",
    meta: buildMeta(t.authorRole),
    rating: 5,
  }));

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative bg-cream-soft py-28 sm:py-36">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-14 max-w-[760px] text-center"
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

          <TestimonialsCarousel
            items={items}
            itemKey={(item) => item.id}
            maxWidth={900}
            renderItem={(item) => (
              <TestimonialCard
                data={{
                  quote: item.quote,
                  name: item.name,
                  meta: item.meta,
                  rating: item.rating,
                }}
              />
            )}
          />
        </div>
      </section>
    </MotionConfig>
  );
}
