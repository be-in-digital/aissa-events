"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { urlForImageString } from "@/lib/sanity/image";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { RealisationBySlugQueryResult } from "@/sanity.types";

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=85";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function RealisationDetailHero({
  realisation,
}: {
  realisation: NonNullable<RealisationBySlugQueryResult>;
}) {
  const cover = realisation.cover?.asset
    ? urlForImageString(realisation.cover, { width: 1800 })
    : FALLBACK_COVER;
  const alt = realisation.cover?.alt || realisation.title || "";
  const typeLabel = realisation.typeLabel ?? realisation.type ?? "Réalisation";

  return (
    <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-14">
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
          <Link
            href="/realisations"
            className="transition-colors hover:text-bordeaux"
          >
            Réalisations
          </Link>
          <span className="mx-3">/</span>
          <span className="text-ink-soft">{typeLabel}</span>
        </motion.nav>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <Eyebrow align="center">{typeLabel}</Eyebrow>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mx-auto max-w-[860px] font-serif text-[40px] leading-[1.05] tracking-[-0.03em] text-ink sm:text-[60px] lg:text-[80px]"
            style={{ fontWeight: 300 }}
          >
            {renderInlineItalic(realisation.title)}
          </motion.h1>

          {realisation.italicSubtitle && (
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-7 max-w-[680px] font-serif text-[19px] italic leading-[1.55] text-ink-soft sm:text-[22px]"
              style={{ fontWeight: 300 }}
            >
              {realisation.italicSubtitle}
            </motion.p>
          )}

          <motion.dl
            variants={fadeUp}
            className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink"
          >
            {realisation.eventDate && (
              <div className="inline-flex items-center gap-1.5">
                <Calendar className="size-3" strokeWidth={1.5} />
                <dt className="sr-only">Date</dt>
                <dd>{formatDate(realisation.eventDate)}</dd>
              </div>
            )}
            {realisation.location && (
              <>
                <span aria-hidden className="text-muted-ink/40">
                  ·
                </span>
                <div className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3" strokeWidth={1.5} />
                  <dt className="sr-only">Lieu</dt>
                  <dd>{realisation.location}</dd>
                </div>
              </>
            )}
            {realisation.guestCount ? (
              <>
                <span aria-hidden className="text-muted-ink/40">
                  ·
                </span>
                <div className="inline-flex items-center gap-1.5">
                  <Users className="size-3" strokeWidth={1.5} />
                  <dt className="sr-only">Invités</dt>
                  <dd>{realisation.guestCount} invités</dd>
                </div>
              </>
            ) : null}
            {realisation.theme && (
              <>
                <span aria-hidden className="text-muted-ink/40">
                  ·
                </span>
                <div className="inline-flex items-center gap-1.5">
                  <Sparkles className="size-3" strokeWidth={1.5} />
                  <dt className="sr-only">Thème</dt>
                  <dd>{realisation.theme}</dd>
                </div>
              </>
            )}
          </motion.dl>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-16 max-w-[1320px] px-6 sm:px-14"
      >
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] shadow-[0_30px_80px_rgba(44,31,51,0.12)]">
          <Image
            src={cover}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1320px) 100vw, 1320px"
            className="object-cover"
            style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
