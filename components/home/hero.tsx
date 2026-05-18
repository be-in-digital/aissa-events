"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "./eyebrow";
import { resolveCta } from "@/lib/sanity/cta";
import { urlForImageString } from "@/lib/sanity/image";
import { KineticTitle } from "@/components/site/kinetic-title";
import { Magnetic } from "@/components/site/magnetic";
import { CountUp } from "@/components/site/count-up";
import { Parallax } from "@/components/site/parallax";
import type { HomePageQueryResult } from "@/sanity.types";

type HeroData = NonNullable<HomePageQueryResult>["hero"];

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

export function Hero({ data }: { data?: HeroData }) {
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
  const imageAlt = data?.image?.alt ?? "";

  const stats = data?.stats ?? [];
  const quoteBadge = data?.quoteBadge;

  return (
    <section className="relative pt-24 pb-24 sm:pt-28 sm:pb-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20"
        >
          <div>
            {eyebrow && (
              <motion.div variants={fadeUp} className="mb-8">
                <Eyebrow>{eyebrow}</Eyebrow>
              </motion.div>
            )}

            <h1
              className="font-serif text-[56px] leading-[0.92] tracking-[-0.04em] text-ink sm:text-[80px] lg:text-[124px]"
              style={{ fontWeight: 300 }}
            >
              <KineticTitle
                text={title}
                italicClassName="font-normal italic text-bordeaux"
              />
            </h1>

            {subtitle && (
              <motion.p
                variants={fadeUp}
                className="mt-8 max-w-[520px] font-serif text-[20px] italic leading-[1.5] text-ink-soft sm:text-[22px]"
                style={{ fontWeight: 300 }}
              >
                {subtitle}
              </motion.p>
            )}

            {ctas.length > 0 && (
              <motion.div
                variants={fadeUp}
                className="mt-12 flex flex-wrap items-center gap-4"
              >
                {ctas.map((cta, i) => {
                  const isPrimary = i === 0 && cta.variant !== "secondary" && cta.variant !== "ghost";
                  return (
                    <Magnetic
                      key={cta.href + cta.label}
                      strength={isPrimary ? 0.22 : 0.16}
                      rippleColor={
                        isPrimary
                          ? "rgba(253, 247, 235, 0.55)"
                          : "rgba(44, 31, 51, 0.18)"
                      }
                    >
                      <a
                        href={cta.href}
                        target={cta.external ? "_blank" : undefined}
                        rel={cta.external ? "noopener noreferrer" : undefined}
                        className={
                          isPrimary
                            ? "group inline-flex items-center gap-2 rounded-full bg-bordeaux px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-bordeaux-deep hover:shadow-[0_18px_42px_rgba(61,37,73,0.32)]"
                            : "inline-flex items-center gap-2 rounded-full border border-ink px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-cream"
                        }
                      >
                        {cta.label}
                        {isPrimary && (
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        )}
                      </a>
                    </Magnetic>
                  );
                })}
              </motion.div>
            )}

            {stats.length > 0 && (
              <motion.div
                variants={fadeUp}
                className="mt-14 grid gap-x-12 gap-y-6 border-t border-[var(--rule)] pt-8 sm:flex"
              >
                {stats.map((item) => (
                  <div
                    key={`${item?.value}-${item?.label}`}
                    className="font-mono text-[12px] uppercase tracking-[0.15em] text-muted-ink"
                  >
                    <strong className="mb-1 block font-serif text-[28px] font-normal italic tracking-[-0.02em] normal-case text-bordeaux">
                      {item?.value ? <CountUp value={item.value} /> : null}
                    </strong>
                    {item?.label}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {(imageUrl || quoteBadge?.quote) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="relative h-[70vh] max-h-[720px] min-h-[480px]"
            >
              {imageUrl && (
                <div className="absolute inset-0 overflow-hidden rounded-[20px] shadow-[0_30px_80px_rgba(44,31,51,0.15)]">
                  <Parallax className="absolute inset-0" speed={0.08} zoom={0.04}>
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
                    />
                  </Parallax>
                  <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-b from-transparent via-transparent to-ink/25" />
                </div>
              )}

              {quoteBadge?.quote && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-10 -left-6 w-[280px] rounded-3xl border border-[var(--rule)] bg-cream px-7 py-6 shadow-[0_30px_80px_rgba(44,31,51,0.12)] sm:-left-10"
                >
                  {quoteBadge.label && (
                    <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-bordeaux">
                      {quoteBadge.label}
                    </p>
                  )}
                  <p className="font-serif text-[17px] italic leading-snug text-ink">
                    « {quoteBadge.quote} »
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
