"use client";

import { MotionConfig, motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EvenementPageQueryResult } from "@/sanity.types";

type TimelineData = NonNullable<EvenementPageQueryResult>["timeline"];

export function EvenementTimeline({ data }: { data?: TimelineData }) {
  if (data?.enabled === false) return null;
  if (!data?.items?.length) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;
  const intro = data?.intro;

  const items = data.items.map((item) => ({
    when: item?.when ?? "",
    title: item?.title ?? "",
    description: item?.description ?? "",
  }));

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative bg-cream py-28 sm:py-36">
        <div className="mx-auto max-w-[1320px] px-6 sm:px-14">
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
            {intro && (
              <p
                className="mt-5 font-serif text-[17px] italic text-ink-soft"
                style={{ fontWeight: 300 }}
              >
                {intro}
              </p>
            )}
          </motion.div>

          <ol className="relative">
            <motion.span
              aria-hidden
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-[15px] top-2 hidden h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-bordeaux via-bordeaux/30 to-transparent sm:block lg:left-1/2"
            />

            {items.map((s, i) => (
              <motion.li
                key={`${s.when}-${i}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.08,
                }}
                className={`relative grid gap-5 pb-12 last:pb-0 sm:grid-cols-[40px_1fr] sm:gap-7 lg:grid-cols-2 lg:gap-12 ${
                  i % 2 === 1
                    ? "lg:[&>div:first-of-type]:order-2 lg:[&>div:last-of-type]:order-1 lg:text-right"
                    : ""
                }`}
              >
                <div
                  className={`relative flex items-start gap-5 ${
                    i % 2 === 1 ? "lg:justify-end" : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className="relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-bordeaux/20 bg-cream-soft font-mono text-[10px] font-medium text-bordeaux sm:mt-0 lg:hidden"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className={`min-w-0 ${i % 2 === 1 ? "lg:text-right" : ""}`}>
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                      — {s.when}
                    </p>
                    <h3
                      className="mt-3 font-serif text-[26px] leading-[1.05] sm:text-[32px]"
                      style={{ fontWeight: 400 }}
                    >
                      {renderInlineItalic(s.title)}
                    </h3>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <span
                    aria-hidden
                    className="absolute left-[15px] top-1.5 z-10 grid size-8 -translate-x-[15px] place-items-center rounded-full border border-bordeaux/30 bg-cream font-mono text-[10px] font-medium text-bordeaux lg:left-1/2 lg:-translate-x-1/2"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className={`max-w-[440px] text-[14px] leading-[1.7] text-ink-soft ${
                      i % 2 === 1 ? "lg:ml-auto" : ""
                    }`}
                  >
                    {s.description}
                  </p>
                </div>

                <p className="text-[14px] leading-[1.7] text-ink-soft sm:hidden">
                  {s.description}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>
    </MotionConfig>
  );
}
