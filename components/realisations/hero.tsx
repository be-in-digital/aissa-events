"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import type { RealisationsPageQueryResult } from "@/sanity.types";

type HeroData = NonNullable<RealisationsPageQueryResult>["hero"];

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

const FALLBACK_EYEBROW = "Portfolio · 2020-2026";
const FALLBACK_TITLE = "Six ans\nde _projets_\nà Émerainville.";
const FALLBACK_SUBTITLE =
  "Mariages multi-cérémonies, lancements de marque, soirées clients, séminaires, anniversaires en petit comité. Une sélection filtrable par univers, plus trois études de cas détaillées plus bas.";

export function RealisationsHero({ data }: { data?: HeroData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const subtitle = data?.subtitle ?? FALLBACK_SUBTITLE;

  const ctas = (data?.ctas ?? [])
    .map((c) => resolveCta(c))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20">
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
          Réalisations
        </motion.nav>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid items-end gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20"
        >
          <div>
            <motion.div variants={fadeUp} className="mb-8">
              <Eyebrow>{eyebrow}</Eyebrow>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-[56px] leading-[0.92] tracking-[-0.04em] text-ink sm:text-[80px] lg:text-[112px]"
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
          </div>

          <motion.div variants={fadeUp}>
            {subtitle && (
              <p
                className="max-w-[480px] font-serif text-[19px] italic leading-[1.55] text-ink-soft sm:text-[22px]"
                style={{ fontWeight: 300 }}
              >
                {subtitle}
              </p>
            )}
            {ctas.length > 0 ? (
              <div className="mt-7 flex flex-wrap items-center gap-4">
                {ctas.map((cta, i) => {
                  const isPrimary =
                    i === 0 &&
                    cta.variant !== "secondary" &&
                    cta.variant !== "ghost";
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
              </div>
            ) : (
              <div className="mt-7 flex items-center gap-6 border-t border-[var(--rule)] pt-6">
                <a
                  href="#galerie"
                  className="font-mono text-[11px] uppercase tracking-[0.22em] text-bordeaux underline-offset-4 hover:underline"
                >
                  Parcourir la galerie ↓
                </a>
                <span className="text-muted-ink/40">·</span>
                <a
                  href="#etudes-de-cas"
                  className="font-mono text-[11px] uppercase tracking-[0.22em] text-bordeaux underline-offset-4 hover:underline"
                >
                  Lire les études de cas ↓
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
