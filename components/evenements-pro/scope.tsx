"use client";

import { MotionConfig, motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EvenementPageQueryResult } from "@/sanity.types";

type ScopeData = NonNullable<EvenementPageQueryResult>["scope"];

type ScopeItem = {
  num: string;
  title: string;
  desc: string;
};

export function EvenementScope({ data }: { data?: ScopeData }) {
  if (data?.enabled === false) return null;
  if (!data?.items?.length) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;
  const intro = data?.intro;

  const items: ScopeItem[] = data.items.map((it, i) => ({
    num: String(i + 1).padStart(2, "0"),
    title: it.title ?? "",
    desc: it.description ?? "",
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
            {intro && (
              <p
                className="mt-5 font-serif text-[17px] italic text-ink-soft"
                style={{ fontWeight: 300 }}
              >
                {intro}
              </p>
            )}
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <motion.article
                key={`${it.num}-${i}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.06,
                }}
                whileHover={{ y: -4 }}
                className="grid gap-5 rounded-[20px] border border-[var(--rule)] bg-cream p-7 transition-all duration-500 hover:border-bordeaux hover:shadow-[0_30px_80px_rgba(44,31,51,0.06)] sm:grid-cols-[44px_1fr]"
              >
                <span
                  className="font-serif text-[40px] italic leading-none text-bordeaux"
                  style={{ fontWeight: 400 }}
                >
                  {it.num}
                </span>
                <div>
                  <h3
                    className="mb-2 font-serif text-[18px] leading-[1.25]"
                    style={{ fontWeight: 500 }}
                  >
                    {it.title}
                  </h3>
                  <p className="text-[13.5px] leading-[1.65] text-ink-soft">
                    {it.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
