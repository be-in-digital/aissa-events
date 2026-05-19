"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Check, Plus, Star } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";

const isExternal = (href: string) => /^https?:\/\//i.test(href);

export type PackFeature = { label: string; option?: boolean };

export type Pack = {
  num: string;
  name: string;
  tagline: string;
  price: string;
  featured?: boolean;
  badge?: string;
  sectionLabel: string;
  features: PackFeature[];
  ctaLabel: string;
  ctaHref: string;
};

export type PackBlockProps = {
  id: string;
  background?: "cream" | "warm";
  eyebrow: string;
  titleTop: string;
  titleItalic: string;
  intro: string;
  contextLabel: string;
  contextText: string;
  contextNote: string;
  packs: [Pack, Pack, Pack];
};

export function PackBlock({
  id,
  background = "warm",
  eyebrow,
  titleTop,
  titleItalic,
  intro,
  contextLabel,
  contextText,
  contextNote,
  packs,
}: PackBlockProps) {
  return (
    <section
      id={id}
      className={`relative py-28 sm:py-36 ${
        background === "warm" ? "bg-cream-soft" : "bg-cream"
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-[820px] text-center"
        >
          <div className="mb-6">
            <Eyebrow align="center">{eyebrow}</Eyebrow>
          </div>
          <h2
            className="font-serif text-[44px] leading-[0.95] tracking-[-0.03em] sm:text-[64px] lg:text-[88px]"
            style={{ fontWeight: 300 }}
          >
            {titleTop}
            <br />
            les <em className="italic text-bordeaux">{titleItalic}</em>
          </h2>
          <p
            className="mt-6 font-serif text-[17px] italic leading-[1.55] text-ink-soft sm:text-[18px]"
            style={{ fontWeight: 300 }}
          >
            {intro}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[var(--rule)] bg-cream px-6 py-5 sm:px-8"
        >
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
              — {contextLabel}
            </p>
            <p className="mt-1 font-serif text-[15px] italic text-ink sm:text-[16px]">
              {contextText}
            </p>
          </div>
          <p className="font-serif text-[14px] italic text-bordeaux">
            {contextNote}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packs.map((p, i) => (
            <PackCard key={p.num} pack={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PackCard({ pack, index }: { pack: Pack; index: number }) {
  const featured = pack.featured;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.12,
      }}
      whileHover={{ y: -8 }}
      className={`relative flex flex-col rounded-[24px] border transition-all duration-500 ${
        featured
          ? "border-ink bg-ink text-cream shadow-[0_30px_80px_rgba(44,31,51,0.18)] lg:-translate-y-2"
          : "border-[var(--rule)] bg-cream hover:border-bordeaux hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)]"
      }`}
    >
      {pack.badge && (
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.12 + 0.4, duration: 0.5 }}
          className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gold px-4 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-ink"
        >
          <Star className="size-3 fill-current" />
          {pack.badge}
        </motion.span>
      )}

      <div
        className={`border-b px-9 pt-10 pb-7 ${
          featured ? "border-cream/15" : "border-[var(--rule)]"
        }`}
      >
        <p
          className={`mb-3 font-mono text-[10px] uppercase tracking-[0.22em] ${
            featured ? "text-gold-soft" : "text-bordeaux"
          }`}
        >
          — {pack.num}
        </p>
        <h3
          className="font-serif text-[34px] leading-[1] tracking-[-0.02em] sm:text-[36px]"
          style={{ fontWeight: 400 }}
        >
          {pack.name}
        </h3>
        <p
          className={`mt-2 font-serif text-[14px] italic leading-snug ${
            featured ? "text-gold-soft" : "text-muted-ink"
          }`}
          style={{ fontWeight: 300 }}
        >
          {pack.tagline}
        </p>

        <div className="mt-6 flex items-baseline gap-1">
          <span
            className={`font-serif text-[52px] italic leading-none tracking-[-0.03em] ${
              featured ? "text-cream" : "text-bordeaux"
            }`}
            style={{ fontWeight: 500 }}
          >
            {pack.price}
          </span>
          <span
            className={`font-serif text-[26px] italic ${
              featured ? "text-cream/70" : "text-bordeaux"
            }`}
          >
            €
          </span>
        </div>
      </div>

      <div className="flex-1 px-9 py-8">
        <p
          className={`mb-4 border-b pb-2 font-mono text-[9px] uppercase tracking-[0.28em] ${
            featured
              ? "border-cream/20 text-gold-soft"
              : "border-[var(--rule)] text-bordeaux"
          }`}
        >
          — {pack.sectionLabel}
        </p>
        <ul className="space-y-0">
          {pack.features.map((f, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-3 border-b py-2.5 text-[14px] leading-[1.5] last:border-b-0 ${
                featured
                  ? "border-cream/10 text-cream/85"
                  : "border-[var(--rule-soft)] text-ink-soft"
              }`}
            >
              {f.option ? (
                <span
                  className={`mt-0.5 inline-flex size-4 flex-shrink-0 items-center justify-center rounded-full border border-dashed ${
                    featured
                      ? "border-cream/40 text-cream/50"
                      : "border-muted-ink text-muted-ink"
                  }`}
                >
                  <Plus className="size-2.5" />
                </span>
              ) : (
                <span
                  className={`mt-0.5 inline-flex size-4 flex-shrink-0 items-center justify-center rounded-full ${
                    featured ? "bg-gold text-ink" : "bg-bordeaux text-cream"
                  }`}
                >
                  <Check className="size-2.5 stroke-[3]" />
                </span>
              )}
              <span className={f.option ? "italic" : ""}>{f.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-9 pb-9">
        {isExternal(pack.ctaHref) ? (
          <a
            href={pack.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`block rounded-full px-6 py-4 text-center font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
              featured
                ? "bg-gold text-ink hover:bg-gold-soft"
                : "bg-bordeaux text-cream hover:bg-bordeaux-deep"
            }`}
          >
            {pack.ctaLabel}
          </a>
        ) : (
          <Link
            href={pack.ctaHref}
            className={`block rounded-full px-6 py-4 text-center font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
              featured
                ? "bg-gold text-ink hover:bg-gold-soft"
                : "bg-bordeaux text-cream hover:bg-bordeaux-deep"
            }`}
          >
            {pack.ctaLabel}
          </Link>
        )}
      </div>
    </motion.article>
  );
}
