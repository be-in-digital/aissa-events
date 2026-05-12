"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import { urlForImageString } from "@/lib/sanity/image";
import type { RealisationsPageQueryResult } from "@/sanity.types";

type CaseStudiesData = NonNullable<RealisationsPageQueryResult>["caseStudies"];

export function RealisationsCaseStudies({ data }: { data?: CaseStudiesData }) {
  if (data?.enabled === false) return null;
  if (!data?.items?.length) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;
  const intro = data?.intro;
  const footerEyebrow = data?.footerEyebrow;
  const footerCta = resolveCta(data?.footerCta ?? null);

  const items = data.items;

  return (
    <section
      id="etudes-de-cas"
      className="relative bg-cream-soft py-32 sm:py-40"
    >
      <div className="mx-auto max-w-[1320px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 max-w-[1100px]"
        >
          {eyebrow && (
            <div className="mb-7">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          )}
          <h2
            className="font-serif text-[44px] leading-[0.95] tracking-[-0.03em] sm:text-[60px] lg:text-[88px]"
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
              className="mt-8 max-w-2xl font-serif text-[18px] italic leading-[1.55] text-ink-soft sm:text-[19px]"
              style={{ fontWeight: 300 }}
            >
              {intro}
            </p>
          )}
        </motion.div>

        <div className="space-y-32 sm:space-y-40">
          {items.map((c, idx) => {
            const align = c?.alignment ?? (idx % 2 === 0 ? "left" : "right");
            const heroUrl = c?.cover?.asset
              ? urlForImageString(c.cover, { width: 1400, quality: 85 })
              : null;
            const moodBoard = c?.moodBoard ?? [];
            const badge =
              c?.badge ?? `Cas n°${String(idx + 1).padStart(2, "0")}`;
            const typeLabel = c?.typeLabel ?? c?.type ?? "";
            const heading = c?.shortTitle ?? c?.title ?? "";
            const italicSubtitle = c?.italicSubtitle;

            return (
              <article key={c?._id ?? idx} className="relative">
                <div
                  className={`grid items-start gap-10 lg:grid-cols-12 lg:gap-16 ${
                    align === "right" ? "lg:[direction:rtl]" : ""
                  }`}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative lg:col-span-7 lg:[direction:ltr]"
                  >
                    {heroUrl && (
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] sm:aspect-[5/6]">
                        <Image
                          src={heroUrl}
                          alt={c?.cover?.alt || heading}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover"
                          style={{
                            filter:
                              "contrast(1.06) saturate(0.95) sepia(0.05)",
                          }}
                        />
                      </div>
                    )}

                    {moodBoard.length > 0 && (
                      <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                        {moodBoard.slice(0, 3).map((img, i) => {
                          const url = img?.asset
                            ? urlForImageString(img, {
                                width: 600,
                                quality: 85,
                              })
                            : null;
                          if (!url) return null;
                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 24 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true, margin: "-40px" }}
                              transition={{
                                duration: 0.8,
                                delay: 0.2 + i * 0.08,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              className="relative aspect-square overflow-hidden rounded-2xl"
                            >
                              <Image
                                src={url}
                                alt={img?.alt || ""}
                                fill
                                sizes="(max-width: 640px) 33vw, 200px"
                                className="object-cover"
                                style={{
                                  filter:
                                    "contrast(1.06) saturate(0.95) sepia(0.05)",
                                }}
                              />
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      duration: 1,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.15,
                    }}
                    className="lg:col-span-5 lg:[direction:ltr] lg:pt-6"
                  >
                    <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                      <span className="rounded-full bg-bordeaux px-3 py-1.5 text-cream">
                        {badge}
                      </span>
                      {typeLabel && (
                        <>
                          <span>·</span>
                          <span className="text-ink-soft">{typeLabel}</span>
                        </>
                      )}
                    </div>

                    <h3
                      className="font-serif text-[34px] leading-[1.05] tracking-[-0.02em] sm:text-[44px] lg:text-[52px]"
                      style={{ fontWeight: 400 }}
                    >
                      {heading}
                      {italicSubtitle && (
                        <>
                          {" "}
                          <em className="italic text-bordeaux">
                            {italicSubtitle}
                          </em>
                        </>
                      )}
                    </h3>

                    {c?.metaItems && c.metaItems.length > 0 && (
                      <dl className="mt-8 grid grid-cols-2 gap-y-4 border-y border-[var(--rule)] py-6">
                        {c.metaItems.map((m, mi) => (
                          <div key={`${m?.label}-${m?.value}-${mi}`}>
                            <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink">
                              {m?.label}
                            </dt>
                            <dd className="mt-1 font-serif text-[15px] italic text-ink">
                              {m?.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    {c?.story && (
                      <p className="mt-8 text-[15px] leading-[1.75] text-ink-soft sm:text-[16px]">
                        {c.story}
                      </p>
                    )}

                    {c?.quote?.text && (
                      <blockquote className="mt-8 border-l-2 border-bordeaux pl-6">
                        <p
                          className="font-serif text-[18px] italic leading-[1.55] text-ink"
                          style={{ fontWeight: 300 }}
                        >
                          « {c.quote.text} »
                        </p>
                        {c.quote.author && (
                          <footer className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                            — {c.quote.author}
                          </footer>
                        )}
                      </blockquote>
                    )}
                  </motion.div>
                </div>

                {idx < items.length - 1 && (
                  <div className="mt-32 flex justify-center sm:mt-40">
                    <span className="text-[20px] text-bordeaux/50">✦</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {(footerEyebrow || footerCta) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-32 flex flex-col items-center gap-3 text-center"
          >
            {footerEyebrow && (
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-ink">
                {footerEyebrow}
              </p>
            )}
            {footerCta && (
              <a
                href={footerCta.href}
                target={footerCta.external ? "_blank" : undefined}
                rel={footerCta.external ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center gap-2 rounded-full border border-ink px-9 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-ink transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream"
              >
                {footerCta.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
