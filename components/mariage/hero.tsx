"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { MARIAGE_IMAGES } from "@/lib/images";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import { urlForImageString } from "@/lib/sanity/image";
import type { MariagePageQueryResult } from "@/sanity.types";

type HeroData = NonNullable<MariagePageQueryResult>["hero"];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const FALLBACK_EYEBROW = "Univers 02 · Wedding planner diplômée";
const FALLBACK_TITLE = "Wedding\nplanning en _IDF._";
const FALLBACK_SUBTITLE =
  "Mariages civils, henné, fiançailles, cérémonies religieuses ou laïques. Organisation complète ou coordination à la carte. Dans notre lieu à Émerainville (77), chez vous, ou dans un lieu partenaire.";
const FALLBACK_META = [
  { value: "2 formules", label: "Complète ou à la carte" },
  { value: "+60 mariages", label: "Réalisés depuis 2020" },
  { value: "Sous 48 h", label: "Devis après le 1er échange" },
];
const FALLBACK_IMAGE_ALT =
  "Décor de mariage organisé par Aïssa Events en Île-de-France";

export function MariageHero({ data }: { data?: HeroData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const subtitle = data?.subtitle ?? FALLBACK_SUBTITLE;

  const ctas = (data?.ctas ?? [])
    .map((c) => resolveCta(c))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const imageUrl = data?.image?.asset
    ? urlForImageString(data.image, { width: 1200, quality: 85 })
    : MARIAGE_IMAGES.hero;
  const imageAlt = data?.image?.alt || FALLBACK_IMAGE_ALT;

  return (
    <section className="relative pt-24 pb-24 sm:pt-28 sm:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink"
          aria-label="Fil d'Ariane"
        >
          <Link href="/" className="transition-colors hover:text-bordeaux">
            Accueil
          </Link>
          <span className="mx-3">/</span>
          Mariages & Cérémonies
        </motion.nav>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20"
        >
          <div>
            <motion.div variants={fadeUp} className="mb-8">
              <Eyebrow>{eyebrow}</Eyebrow>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-[56px] leading-[0.92] tracking-[-0.04em] text-ink sm:text-[80px] lg:text-[120px]"
              style={{ fontWeight: 300 }}
            >
              {title.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {renderInlineItalic(line, {
                    italicClassName: "font-normal italic text-bordeaux",
                  })}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </motion.h1>

            {subtitle && (
              <motion.p
                variants={fadeUp}
                className="mt-9 max-w-[480px] font-serif text-[20px] italic leading-[1.5] text-ink-soft sm:text-[22px]"
                style={{ fontWeight: 300 }}
              >
                {subtitle}
              </motion.p>
            )}

            {ctas.length > 0 && (
              <motion.div
                variants={fadeUp}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                {ctas.map((cta, i) => {
                  const isPrimary =
                    i === 0 && cta.variant !== "secondary" && cta.variant !== "ghost";
                  return (
                    <a
                      key={cta.href + cta.label}
                      href={cta.href}
                      target={cta.external ? "_blank" : undefined}
                      rel={cta.external ? "noopener noreferrer" : undefined}
                      className={
                        isPrimary
                          ? "group inline-flex items-center gap-2 rounded-full bg-bordeaux px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition-all hover:-translate-y-0.5 hover:bg-bordeaux-deep hover:shadow-[0_12px_32px_rgba(61,37,73,0.3)]"
                          : "inline-flex items-center gap-2 rounded-full border border-ink px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream"
                      }
                    >
                      {cta.label}
                      {isPrimary && (
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      )}
                    </a>
                  );
                })}
              </motion.div>
            )}

            <motion.div
              variants={fadeUp}
              className="mt-12 grid gap-x-10 gap-y-6 border-t border-[var(--rule)] pt-8 sm:flex sm:flex-wrap"
            >
              {FALLBACK_META.map((item) => (
                <div
                  key={item.label}
                  className="font-mono text-[12px] uppercase tracking-[0.18em] text-muted-ink"
                >
                  <strong className="mb-1 block font-serif text-[24px] font-normal italic tracking-[-0.02em] normal-case text-bordeaux">
                    {item.value}
                  </strong>
                  {item.label}
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] shadow-[0_30px_80px_rgba(44,31,51,0.15)]"
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/30" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
