"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Building2, Home } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import { urlForImageString } from "@/lib/sanity/image";
import type { EvenementPageQueryResult } from "@/sanity.types";

type LieuxData = NonNullable<EvenementPageQueryResult>["lieux"];

const ICONS = [Home, Building2];

export function EvenementLieux({ data }: { data?: LieuxData }) {
  if (data?.enabled === false) return null;
  if (!data?.items?.length) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;
  const intro = data?.intro;

  const items = data.items.map((item, idx) => ({
    Icon: ICONS[idx % ICONS.length],
    title: item?.title ?? "",
    description: item?.description ?? "",
    highlights: item?.highlights ?? [],
    image: item?.image?.asset
      ? urlForImageString(item.image, { width: 900, quality: 85 })
      : null,
    imageAlt: item?.image?.alt || item?.title || "",
    cta: resolveCta(item?.cta ?? null),
    featured: idx === 0,
  }));

  return (
    <section className="relative py-28 sm:py-36">
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
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          )}
          <h2
            className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
            style={{ fontWeight: 300 }}
          >
            {renderInlineItalic(title)}
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

        <div className="grid gap-6 lg:grid-cols-2">
          {items.map((p, i) => {
            const num = `Option ${String(i + 1).padStart(2, "0")}`;
            const ctaIsExternal = p.cta?.external ?? false;
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
                className={`group relative flex flex-col rounded-[24px] border p-9 transition-all duration-500 sm:p-10 ${
                  p.featured
                    ? "border-bordeaux/30 bg-cream-soft hover:border-bordeaux"
                    : "border-[var(--rule)] bg-cream hover:border-bordeaux/40 hover:bg-cream-soft"
                }`}
              >
                {p.image && (
                  <div className="relative -mt-2 mb-6 h-44 w-full overflow-hidden rounded-2xl">
                    <Image
                      src={p.image}
                      alt={p.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      style={{
                        filter: "contrast(1.06) saturate(0.95) sepia(0.05)",
                      }}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-12 place-items-center rounded-full border border-bordeaux/20 bg-cream text-bordeaux">
                    <p.Icon className="size-[20px]" strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
                    — {num}
                  </span>
                </div>
                <h3
                  className="mt-7 font-serif text-[30px] leading-[1] tracking-[-0.02em] sm:text-[36px]"
                  style={{ fontWeight: 400 }}
                >
                  {renderInlineItalic(p.title)}
                </h3>
                <p className="mt-4 text-[14.5px] leading-[1.7] text-ink-soft">
                  {p.description}
                </p>

                {p.highlights && p.highlights.length > 0 && (
                  <ul className="mt-7 space-y-2.5 border-t border-[var(--rule)] pt-6">
                    {p.highlights.map((d) => (
                      <li
                        key={d}
                        className="flex items-start gap-2.5 text-[13.5px] leading-[1.55] text-ink-soft"
                      >
                        <span
                          aria-hidden
                          className="mt-2 size-1 shrink-0 rounded-full bg-bordeaux"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}

                {p.cta && (
                  ctaIsExternal ? (
                    <a
                      href={p.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-bordeaux/30 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bordeaux transition-all hover:-translate-y-0.5 hover:border-bordeaux hover:bg-bordeaux hover:text-cream"
                    >
                      {p.cta.label}
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <Link
                      href={p.cta.href}
                      className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-bordeaux/30 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] text-bordeaux transition-all hover:-translate-y-0.5 hover:border-bordeaux hover:bg-bordeaux hover:text-cream"
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
    </section>
  );
}
