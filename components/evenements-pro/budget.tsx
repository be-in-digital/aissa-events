"use client";

import { MotionConfig, motion } from "motion/react";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EvenementPageQueryResult } from "@/sanity.types";

type BudgetData = NonNullable<EvenementPageQueryResult>["budget"];

export function EvenementBudget({ data }: { data?: BudgetData }) {
  if (data?.enabled === false) return null;
  if (!data?.title) return null;

  const items = data.items ?? [];

  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-cream py-28 sm:py-36">
        <div className="mx-auto max-w-[1080px] px-6 sm:px-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 max-w-[720px]"
          >
            {data.eyebrow && (
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                {data.eyebrow}
              </p>
            )}
            <h2
              className="font-serif text-[32px] leading-[1.05] tracking-[-0.03em] sm:text-[44px]"
              style={{ fontWeight: 300 }}
            >
              {data.title.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {renderInlineItalic(line)}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>
            {data.intro && (
              <p className="mt-5 text-[16px] leading-[1.7] text-ink-soft">
                {data.intro}
              </p>
            )}
          </motion.div>

          {items.length > 0 && (
            <div className="grid gap-5 md:grid-cols-3">
              {items.map((it, i) => (
                <motion.div
                  key={`${it.title}-${i}`}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                  className="rounded-[20px] border border-[var(--rule-soft)] bg-card-soft p-7"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
                    0{i + 1}
                  </p>
                  {it.title && (
                    <h3 className="mt-3 font-serif text-[21px] leading-snug" style={{ fontWeight: 500 }}>
                      {it.title}
                    </h3>
                  )}
                  {it.description && (
                    <p className="mt-3 text-[14px] leading-[1.65] text-ink-soft">
                      {it.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {data.note && (
            <p className="mt-8 max-w-[720px] font-serif text-[14.5px] italic leading-[1.6] text-muted-ink">
              {data.note}
            </p>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
