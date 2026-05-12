"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EvenementPageQueryResult } from "@/sanity.types";

type UseCasesData = NonNullable<EvenementPageQueryResult>["usecases"];

type UseCase = {
  num: string;
  italic: string;
  rest: string;
  desc: string;
};

export function EvenementUseCases({ data }: { data?: UseCasesData }) {
  if (data?.enabled === false) return null;
  if (!data?.steps?.length) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;

  const usecases: UseCase[] = data.steps.map((s, i) => ({
    num: String(i + 1).padStart(2, "0"),
    italic: s.italic ?? "",
    rest: s.rest ?? "",
    desc: s.description ?? "",
  }));

  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-[700px] text-center"
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {usecases.map((u, i) => (
            <motion.article
              key={`${u.num}-${i}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.08,
              }}
              whileHover={{ y: -6 }}
              className="group rounded-[24px] border border-[var(--rule)] bg-cream-soft p-9 transition-all duration-500 hover:border-bordeaux hover:bg-cream hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)]"
            >
              <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.28em] text-bordeaux">
                — {u.num}
              </p>
              <h3
                className="mb-3 font-serif text-[24px] leading-[1.1]"
                style={{ fontWeight: 400 }}
              >
                <em className="italic text-bordeaux">{u.italic}</em>
                <br />
                {u.rest}
              </h3>
              <p className="text-[13px] leading-[1.65] text-ink-soft">
                {u.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
