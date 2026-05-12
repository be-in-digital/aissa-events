"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { MariagePageQueryResult } from "@/sanity.types";

type ConditionsData = NonNullable<MariagePageQueryResult>["conditions"];

export function MariageConditions({ data }: { data?: ConditionsData }) {
  if (data?.enabled === false) return null;
  if (!data?.items?.length) return null;

  const eyebrow = data?.eyebrow;
  const title = data?.title;
  const intro = data?.intro;
  const footnote = data?.footnote;

  const items = data.items.map((item) => ({
    title: item?.title ?? "",
    description: item?.description ?? "",
  }));

  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-14">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            {eyebrow && (
              <div className="mb-6">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            {title && (
              <h2
                className="font-serif text-[36px] leading-[1] tracking-[-0.03em] sm:text-[48px] lg:text-[56px]"
                style={{ fontWeight: 300 }}
              >
                {title.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {renderInlineItalic(line)}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </h2>
            )}
            {intro && (
              <p
                className="mt-6 max-w-md font-serif text-[17px] italic leading-[1.6] text-ink-soft"
                style={{ fontWeight: 300 }}
              >
                {intro}
              </p>
            )}
          </motion.div>

          <div className="grid gap-5">
            {items.map((s, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <motion.div
                  key={`${s.title}-${i}`}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.08,
                  }}
                  whileHover={{ y: -4 }}
                  className="group grid gap-6 rounded-[24px] border border-[var(--rule)] bg-cream-soft p-7 transition-all duration-500 hover:border-bordeaux hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)] sm:grid-cols-[68px_1fr] sm:p-8"
                >
                  <div
                    className="font-serif text-[56px] italic leading-none text-bordeaux transition-transform duration-500 group-hover:scale-110"
                    style={{ fontWeight: 400 }}
                  >
                    {num}
                  </div>
                  <div>
                    <h3
                      className="mb-2 font-serif text-[20px] leading-[1.2]"
                      style={{ fontWeight: 500 }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-[14px] leading-[1.65] text-ink-soft">
                      {s.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            {footnote && (
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="mt-2 max-w-[600px] font-serif text-[14px] italic leading-[1.55] text-muted-ink"
              >
                {footnote}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
