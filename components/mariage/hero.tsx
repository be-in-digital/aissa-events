"use client";

import Image from "next/image";
import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { resolveCta } from "@/lib/sanity/cta";
import { urlForImageString } from "@/lib/sanity/image";
import { buildCalendlyUrl } from "@/lib/calendly";
import { KineticTitle } from "@/components/site/kinetic-title";
import { Magnetic } from "@/components/site/magnetic";
import { CountUp } from "@/components/site/count-up";
import { Parallax } from "@/components/site/parallax";
import type { MariagePageQueryResult } from "@/sanity.types";

type HeroData = NonNullable<MariagePageQueryResult>["hero"];

const FALLBACK_EYEBROW = "Univers 02 · Wedding Planner Diplômée";
const FALLBACK_TITLE = "Le plus beau jour\nde votre _vie._";
const FALLBACK_SUBTITLE =
  "Mariages, fiançailles, henné, baptêmes, cérémonies religieuses ou laïques. Wedding planning sur mesure : organisation complète ou à la carte, à l'Espace Events, dans un lieu partenaire, ou chez vous.";

const FALLBACK_STATS = [
  { value: "2 modes", label: "Complète · à la carte" },
  { value: "4 thèmes", label: "de décoration" },
  { value: "Dès 1 250 €", label: "selon projet" },
];

const FALLBACK_CTAS = [
  {
    label: "Prendre rendez-vous",
    href: buildCalendlyUrl({ source: "mariage", content: "hero-primary" }),
    external: true,
    variant: "primary" as const,
  },
  {
    label: "Voir les formules",
    href: "#packs",
    external: false,
    variant: "secondary" as const,
  },
];

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

export function MariageHero({ data }: { data?: HeroData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const subtitle = data?.subtitle ?? FALLBACK_SUBTITLE;

  const sanityCtas = (data?.ctas ?? [])
    .map((c) => resolveCta(c))
    .filter((c): c is NonNullable<typeof c> => c !== null);
  const ctas = sanityCtas.length > 0 ? sanityCtas : FALLBACK_CTAS;

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
            Mariages & Cérémonies
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

              <h1
                className="font-serif text-[clamp(2.5rem,8vw,7.5rem)] leading-[0.92] tracking-[-0.04em] text-ink"
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
                    const isExternal = cta.external;
                    const className = isPrimary
                      ? "group inline-flex items-center gap-2 rounded-full bg-bordeaux px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-bordeaux-deep hover:shadow-[0_18px_42px_rgba(61,37,73,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                      : "inline-flex items-center gap-2 rounded-full border border-ink px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream";
                    const inner = (
                      <>
                        {cta.label}
                        {isPrimary && (
                          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        )}
                      </>
                    );
                    const button = isExternal ? (
                      <a
                        href={cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={cta.href} className={className}>
                        {inner}
                      </Link>
                    );
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
                        {button}
                      </Magnetic>
                    );
                  })}
                </motion.div>
              )}

              <motion.dl
                variants={fadeUp}
                className="mt-14 grid max-w-[520px] grid-cols-1 gap-6 border-t border-[var(--rule)] pt-7 sm:grid-cols-3"
              >
                {FALLBACK_STATS.map((s) => (
                  <div key={s.value}>
                    <dt
                      className="font-serif text-[24px] italic leading-none text-bordeaux sm:text-[28px]"
                      style={{ fontWeight: 500 }}
                    >
                      <CountUp value={s.value} />
                    </dt>
                    <dd className="mt-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-muted-ink">
                      {s.label}
                    </dd>
                  </div>
                ))}
              </motion.dl>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-cream-soft shadow-[0_30px_80px_rgba(44,31,51,0.15)]"
            >
              <Parallax className="absolute inset-0" speed={0.08} zoom={0.04}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
                  />
                ) : (
                  <Image
                    src="/images/catalogues/mariage.png"
                    alt="Mariage organisé par Aïssa Events"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
                  />
                )}
              </Parallax>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/30" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
