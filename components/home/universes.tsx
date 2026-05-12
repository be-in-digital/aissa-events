"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import { urlForImageString } from "@/lib/sanity/image";
import type { HomePageQueryResult } from "@/sanity.types";

type UniversesData = NonNullable<HomePageQueryResult>["universes"];

export function Universes({ data }: { data?: UniversesData }) {
  if (data?.enabled === false || !data?.items?.length) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;
  const intro = data?.intro;

  return (
    <section id="universes" className="relative bg-cream-soft py-32 sm:py-40">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 grid items-end gap-12 lg:grid-cols-2 lg:gap-20"
        >
          <div>
            {eyebrow && (
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-bordeaux">
                {eyebrow}
              </p>
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
          </div>
          {intro && (
            <p
              className="max-w-xl font-serif text-[18px] italic leading-[1.55] text-ink-soft sm:text-[19px]"
              style={{ fontWeight: 300 }}
            >
              {intro}
            </p>
          )}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {data.items.map((u, i) => {
            const primary = resolveCta(u?.primaryCta ?? null);
            const secondary = resolveCta(u?.secondaryCta ?? null);
            const imageUrl = u?.image?.asset
              ? urlForImageString(u.image, { width: 900, quality: 85 })
              : null;

            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.12,
                }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--rule-soft)] bg-card-soft transition-shadow hover:shadow-[0_30px_80px_rgba(44,31,51,0.12)]"
              >
                {imageUrl && (
                  <div className="relative h-[280px] overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={u?.image?.alt || `${u?.title ?? ""} ${u?.italic ?? ""}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      style={{
                        filter: "contrast(1.06) saturate(0.95) sepia(0.05)",
                      }}
                    />
                  </div>
                )}

                <div className="relative flex flex-1 flex-col p-8 pt-9">
                  <span className="absolute -top-4 right-6 rounded-full bg-bordeaux px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-cream">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3
                    className="mb-3 font-serif text-[30px] leading-[1.05] tracking-[-0.02em] sm:text-[32px]"
                    style={{ fontWeight: 400 }}
                  >
                    {u?.title}
                    {u?.italic && (
                      <>
                        <br />
                        <em className="italic text-bordeaux">{u.italic}</em>
                      </>
                    )}
                  </h3>

                  {u?.shortDesc && (
                    <p className="mb-2 text-[14px] leading-[1.65] text-ink-soft">
                      {u.shortDesc}
                    </p>
                  )}
                  {u?.longDesc && (
                    <p className="mb-5 text-[13px] leading-[1.65] text-muted-ink">
                      {u.longDesc}
                    </p>
                  )}

                  {u?.tags && u.tags.length > 0 && (
                    <div className="mb-6 flex flex-wrap gap-1.5">
                      {u.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[var(--rule)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-ink-soft"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {(u?.price?.value || u?.price?.label) && (
                    <div className="mb-6 border-t border-dashed border-[var(--rule)] pt-5">
                      {u.price.label && (
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                          {u.price.label}
                        </p>
                      )}
                      {u.price.value && (
                        <p
                          className="mt-1 font-serif text-[34px] italic leading-none tracking-[-0.02em] text-bordeaux"
                          style={{ fontWeight: 500 }}
                        >
                          {u.price.value}
                        </p>
                      )}
                      {u.price.note && (
                        <p className="mt-2 text-[12px] leading-snug text-ink-soft">
                          {u.price.note}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-auto flex flex-col gap-3">
                    {primary && (
                      <Link
                        href={primary.href}
                        target={primary.external ? "_blank" : undefined}
                        rel={primary.external ? "noopener noreferrer" : undefined}
                        className="rounded-full bg-bordeaux px-5 py-3 text-center font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-cream transition-colors group-hover:bg-bordeaux-deep"
                      >
                        {primary.label}
                      </Link>
                    )}
                    {secondary && (
                      <Link
                        href={secondary.href}
                        target={secondary.external ? "_blank" : undefined}
                        rel={secondary.external ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center justify-center gap-2 border-b border-ink py-2 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-all group-hover:gap-3.5 group-hover:border-bordeaux group-hover:text-bordeaux"
                      >
                        {secondary.label}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
