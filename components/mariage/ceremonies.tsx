"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { urlForImageString } from "@/lib/sanity/image";
import type { MariagePageQueryResult } from "@/sanity.types";

type CeremoniesData = NonNullable<MariagePageQueryResult>["ceremonies"];

export function MariageCeremonies({ data }: { data?: CeremoniesData }) {
  if (data?.enabled === false) return null;
  if (!data?.items?.length) return null;

  const eyebrow = data?.eyebrow;
  const title = data?.title;
  const intro = data?.intro;

  const items = data.items.map((item) => ({
    title: item?.title ?? "",
    description: item?.description ?? "",
    highlights: item?.highlights ?? [],
    image: item?.image?.asset
      ? urlForImageString(item.image, { width: 900, quality: 85 })
      : null,
    imageAlt: item?.image?.alt || item?.title || "",
    accent: false,
  }));

  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
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
          {title && (
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
          )}
          {intro && (
            <p
              className="mt-5 font-serif text-[17px] italic text-ink-soft"
              style={{ fontWeight: 300 }}
            >
              {intro}
            </p>
          )}
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c, i) => {
            const isSage = c.accent;
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.article
                key={`${c.title}-${i}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
                whileHover={{ y: -8 }}
                className={`group relative flex flex-col overflow-hidden rounded-[24px] border border-[var(--rule)] bg-cream transition-all duration-500 hover:shadow-[0_30px_80px_rgba(44,31,51,0.10)] ${
                  isSage ? "hover:border-sage" : "hover:border-bordeaux"
                }`}
              >
                {c.image && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                      style={{
                        filter: "contrast(1.06) saturate(0.95) sepia(0.05)",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
                    <span
                      className={`absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] backdrop-blur-sm ${
                        isSage ? "text-sage" : "text-bordeaux"
                      }`}
                    >
                      — {num}
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <h3
                    className="font-serif text-[26px] leading-[1.05]"
                    style={{ fontWeight: 400 }}
                  >
                    {renderInlineItalic(c.title, {
                      italicClassName: isSage
                        ? "italic text-sage"
                        : "italic text-bordeaux",
                    })}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.65] text-ink-soft">
                    {c.description}
                  </p>
                  {c.highlights && c.highlights.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {c.highlights.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-[var(--rule)] bg-cream-soft px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
