"use client";

import { motion } from "motion/react";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { HomePageQueryResult } from "@/sanity.types";

type PillarsData = NonNullable<HomePageQueryResult>["pillars"];

export function Pillars({ data }: { data?: PillarsData }) {
  if (data?.enabled === false) return null;
  if (!data?.items?.length) return null;

  const items = data.items;
  const quote = data?.quote;
  const quoteAuthor = data?.quoteAuthor;

  return (
    <section className="relative overflow-hidden bg-ink py-32 text-cream sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(61,37,73,0.4) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(212,178,122,0.18) 0%, transparent 40%)",
        }}
      />

      <div className="relative z-[2] mx-auto max-w-[1440px] px-6 sm:px-14">
        {(quote || quoteAuthor) && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {quote && (
              <p
                className="mx-auto mb-6 max-w-[1100px] text-center font-serif text-[28px] italic leading-[1.2] tracking-[-0.02em] sm:text-[44px] lg:text-[60px]"
                style={{ fontWeight: 300 }}
              >
                «{" "}
                {renderMultilineWithItalic(quote)}
                {" »"}
              </p>
            )}
            {quoteAuthor && (
              <p className="mb-24 text-center font-mono text-[10px] uppercase tracking-[0.32em] text-cream/55">
                {quoteAuthor}
              </p>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 border-y border-cream/15 lg:grid-cols-3">
          {items.map((p, i) => (
            <motion.div
              key={p?.title ?? i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.15,
              }}
              className="border-b border-cream/15 px-10 py-14 text-center transition-colors hover:bg-cream/[0.03] last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <div
                className="mb-6 font-serif text-[64px] italic leading-none text-gold-soft"
                style={{ fontWeight: 300 }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className="mb-4 font-serif text-[26px] leading-[1.2]"
                style={{ fontWeight: 400 }}
              >
                {p?.title}{" "}
                {p?.italic && <em className="italic">{p.italic}</em>}
              </h3>
              {p?.description && (
                <p className="mx-auto max-w-[300px] text-[14px] leading-[1.7] text-cream/65">
                  {p.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderMultilineWithItalic(text: string) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {renderInlineItalic(line, { italicClassName: "italic text-gold-soft" })}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}
