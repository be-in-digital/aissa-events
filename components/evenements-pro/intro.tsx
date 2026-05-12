"use client";

import { motion } from "motion/react";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EvenementPageQueryResult } from "@/sanity.types";

type IntroData = NonNullable<EvenementPageQueryResult>["intro"];

export function EvenementIntro({ data }: { data?: IntroData }) {
  if (data?.enabled === false) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;
  const body = data?.body;

  return (
    <section className="relative bg-cream-soft py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {eyebrow && (
              <div className="mb-6">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            <h2
              className="font-serif text-[36px] leading-[1] tracking-[-0.03em] sm:text-[48px] lg:text-[64px]"
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

          {body && body.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="space-y-5 text-[16px] leading-[1.8] text-ink-soft"
            >
              <PortableText value={body} />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
