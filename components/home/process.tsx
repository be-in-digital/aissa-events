"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "./eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import type { HomePageQueryResult } from "@/sanity.types";

type ProcessData = NonNullable<HomePageQueryResult>["process"];

export function Process({ data }: { data?: ProcessData }) {
  if (data?.enabled === false) return null;
  if (!data?.steps?.length) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;
  const steps = data.steps;
  const cta = resolveCta(data?.cta ?? null);

  return (
    <section className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          {eyebrow && (
            <div className="mb-7">
              <Eyebrow align="center">{eyebrow}</Eyebrow>
            </div>
          )}
          <h2
            className="mx-auto max-w-[1100px] font-serif text-[40px] leading-[1.05] tracking-[-0.025em] sm:text-[58px] lg:text-[76px]"
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.1,
              }}
              className="flex flex-col rounded-[28px] bg-cream-soft p-9 sm:p-10"
            >
              <div
                className="mb-10 font-serif text-[64px] italic leading-none tracking-[-0.02em] text-ink"
                style={{ fontWeight: 400 }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className="mb-4 font-serif text-[20px] leading-[1.3] text-ink sm:text-[21px]"
                style={{ fontWeight: 500 }}
              >
                {s?.italic && <em className="italic">{s.italic}</em>}
                {s?.italic && s?.rest && " "}
                {s?.rest}
              </h3>
              {s?.description && (
                <p className="text-[14px] leading-[1.65] text-ink-soft">
                  {s.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="mt-14 flex justify-center"
          >
            <a
              href={cta.href}
              target={cta.external ? "_blank" : undefined}
              rel={cta.external ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-2 rounded-full bg-bordeaux px-9 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-cream transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-bordeaux-deep hover:shadow-[0_12px_32px_rgba(61,37,73,0.3)]"
            >
              {cta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
