"use client";

import { motion } from "motion/react";
import { Eyebrow } from "./eyebrow";
import { TestimonialsCarousel } from "@/components/testimonials/carousel";
import { TestimonialCard } from "@/components/testimonials/card";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { HomePageQueryResult } from "@/sanity.types";

type TestimonialsData = NonNullable<HomePageQueryResult>["testimonials"];

type Item = {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
};

export function Testimonials({ data }: { data?: TestimonialsData }) {
  if (data?.enabled === false) return null;
  const list = data?.testimonials ?? [];
  if (list.length === 0) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;

  const items: Item[] = list.map((t, i) => ({
    id: t?._id ?? String(i),
    quote: t?.quote ?? "",
    name: t?.authorName ?? "",
    role: t?.authorRole ?? "",
    rating: t?.rating ?? 5,
  }));

  return (
    <section id="testimonials" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 text-center"
        >
          {eyebrow && (
            <div className="mb-5">
              <Eyebrow align="center">{eyebrow}</Eyebrow>
            </div>
          )}
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

        <TestimonialsCarousel
          items={items}
          itemKey={(item) => item.id}
          maxWidth={900}
          renderItem={(item) => (
            <TestimonialCard
              data={{
                quote: item.quote,
                name: item.name,
                meta: item.role,
                rating: item.rating,
              }}
            />
          )}
        />
      </div>
    </section>
  );
}
