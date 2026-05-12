"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Building2, Home, MapPin } from "lucide-react";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import { urlForImageString } from "@/lib/sanity/image";
import type { MariagePageQueryResult } from "@/sanity.types";

type LieuxData = NonNullable<MariagePageQueryResult>["lieux"];

// Icônes mappées par index — restent hardcodées car non-stockables dans Sanity
const ICONS = [Home, Building2, MapPin];

export function MariageLieux({ data }: { data?: LieuxData }) {
  if (data?.enabled === false) return null;
  if (!data?.items?.length) return null;

  const eyebrow = data?.eyebrow;
  const title = data?.title;
  const intro = data?.intro;

  const items = data.items.map((item, idx) => ({
    Icon: ICONS[idx % ICONS.length],
    title: item?.title ?? "",
    description: item?.description ?? "",
    highlights: item?.highlights ?? [],
    image: item?.image?.asset
      ? urlForImageString(item.image, { width: 900, quality: 85 })
      : null,
    cta: resolveCta(item?.cta ?? null),
    featured: idx === 0,
  }));

  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <div className="relative overflow-hidden rounded-[28px] bg-ink px-8 py-16 text-cream sm:px-14 sm:py-20 lg:px-20 lg:py-24">
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4 }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 80% 20%, rgba(184, 146, 78, 0.18) 0%, transparent 55%), radial-gradient(circle at 15% 80%, rgba(61, 37, 73, 0.4) 0%, transparent 50%)",
              backgroundSize: "200% 200%",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-14 max-w-[820px]"
          >
            {eyebrow && (
              <p className="mb-6 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-soft">
                <span className="size-2 animate-pulse rounded-full bg-gold" />
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className="font-serif text-[40px] leading-[0.95] tracking-[-0.03em] sm:text-[56px] lg:text-[80px]"
                style={{ fontWeight: 300 }}
              >
                {renderInlineItalic(title, {
                  italicClassName: "italic text-gold-soft",
                })}
              </h2>
            )}
            {intro && (
              <p className="mt-6 max-w-[640px] font-serif text-[18px] italic leading-[1.55] text-cream/75">
                {intro}
              </p>
            )}
          </motion.div>

          <div className="relative grid gap-5 lg:grid-cols-3">
            {items.map((p, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <motion.article
                  key={`${p.title}-${i}`}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.12,
                  }}
                  whileHover={{ y: -6 }}
                  className={`group relative flex flex-col rounded-[20px] border p-7 backdrop-blur-sm transition-all duration-500 sm:p-8 ${
                    p.featured
                      ? "border-gold/40 bg-gold/[0.06] hover:border-gold/60"
                      : "border-cream/12 bg-cream/[0.04] hover:border-cream/30"
                  }`}
                >
                  {p.image && (
                    <div className="relative -mt-1 mb-5 h-32 w-full overflow-hidden rounded-2xl">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover"
                        style={{
                          filter: "contrast(1.06) saturate(0.95) sepia(0.05)",
                        }}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-full border border-cream/15 bg-cream/[0.06] text-gold-soft">
                      <p.Icon className="size-[18px]" strokeWidth={1.5} />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-soft">
                      — {num}
                    </span>
                  </div>
                  <h3
                    className="mt-7 font-serif text-[28px] leading-[1] tracking-[-0.02em]"
                    style={{ fontWeight: 400 }}
                  >
                    {renderInlineItalic(p.title, {
                      italicClassName: "italic text-gold-soft",
                    })}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.65] text-cream/75">
                    {p.description}
                  </p>
                  {p.highlights && p.highlights.length > 0 && (
                    <ul className="mt-6 space-y-2.5 border-t border-cream/10 pt-5">
                      {p.highlights.map((d) => (
                        <li
                          key={d}
                          className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-cream/80"
                        >
                          <span
                            aria-hidden
                            className="mt-2 size-1 shrink-0 rounded-full bg-gold-soft"
                          />
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.cta && (
                    p.cta.external ? (
                      <a
                        href={p.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-gold transition-all hover:gap-3.5"
                      >
                        {p.cta.label}
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </a>
                    ) : (
                      <Link
                        href={p.cta.href}
                        className="mt-7 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-gold transition-all hover:gap-3.5"
                      >
                        {p.cta.label}
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    )
                  )}
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
