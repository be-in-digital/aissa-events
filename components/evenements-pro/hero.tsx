"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import { urlForImageString } from "@/lib/sanity/image";
import type { EvenementPageQueryResult } from "@/sanity.types";

type HeroData = NonNullable<EvenementPageQueryResult>["hero"];

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

export function EvenementHero({ data }: { data?: HeroData }) {
  if (data?.enabled === false) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;
  const subtitle = data?.subtitle;

  const ctas = (data?.ctas ?? [])
    .map((c) => resolveCta(c))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const imageUrl = data?.image?.asset
    ? urlForImageString(data.image, { width: 1200, quality: 85 })
    : null;
  const imageAlt = data?.image?.alt || "";

  return (
    <MotionConfig reducedMotion="user">
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
            Événements Professionnels
          </motion.nav>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20"
          >
            <div>
              {eyebrow && (
                <motion.div variants={fadeUp} className="mb-8">
                  <Eyebrow>{eyebrow}</Eyebrow>
                </motion.div>
              )}

              <motion.h1
                variants={fadeUp}
                className="font-serif text-[clamp(2.5rem,8vw,7.5rem)] leading-[0.92] tracking-[-0.04em] text-ink"
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
                            ? "group inline-flex items-center gap-2 rounded-full bg-bordeaux px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition-all hover:-translate-y-0.5 hover:bg-bordeaux-deep hover:shadow-[0_12px_32px_rgba(61,37,73,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                            : "inline-flex items-center gap-2 rounded-full border border-ink px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
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
            </div>

            {imageUrl && (
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
            )}
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
