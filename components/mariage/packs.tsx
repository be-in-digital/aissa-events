"use client";

import Link from "next/link";
import { MotionConfig, motion } from "motion/react";
import { ArrowRight, Check, Plus, Star } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { buildCalendlyUrl } from "@/lib/calendly";
import { resolveCta } from "@/lib/sanity/cta";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { MariagePageQueryResult } from "@/sanity.types";

type PacksData = NonNullable<MariagePageQueryResult>["packs"];

type Mode = {
  num: string;
  name: string;
  tagline: string;
  priceLabel: string;
  priceFrom: string;
  featured?: boolean;
  badge?: string;
  features: { label: string; option?: boolean }[];
  ctaLabel: string;
  ctaHref: string;
  ctaExternal: boolean;
};

const FALLBACK_EYEBROW = "Wedding planning · Île-de-France";
const FALLBACK_TITLE = "Deux _formules,_\nselon votre besoin.";
const FALLBACK_INTRO =
  "Soit vous nous lâchez tout (et vous gagnez vos soirées), soit vous nous appelez à la rescousse sur les morceaux qui vous mangent la tête. Pas de pack rigide, on adapte au dossier.";

const FALLBACK_CONTEXT_LABEL = "Dans tous les cas";
const FALLBACK_CONTEXT_TEXT =
  "Aïssa au bout du fil. Pas de standardiste, pas de chargé d'affaires.";
const FALLBACK_CONTEXT_NOTE = "Devis sous 48 h, premier RDV offert";

const FALLBACK_MODES: Mode[] = [
  {
    num: "Mode 01",
    name: "Organisation complète",
    tagline:
      "Vous avez signé, on s'occupe du reste. Du premier brief jusqu'au moment où le dernier invité monte dans son Uber.",
    priceLabel: "Sur devis",
    priceFrom: "à partir de 3 500 €",
    featured: true,
    badge: "Le plus complet",
    features: [
      { label: "Cadrage du projet et du budget réel" },
      { label: "Recherche du lieu (Espace Events ou ailleurs)" },
      { label: "Sélection et négo des prestataires" },
      { label: "Suivi mensuel, plus du SMS quand ça bloque" },
      { label: "Scénographie et décoration de table" },
      { label: "Direction artistique de bout en bout" },
      { label: "Aïssa sur place le jour J, 8h-23h" },
    ],
    ctaLabel: "Demander un devis complet",
    ctaHref: buildCalendlyUrl({
      source: "mariage",
      content: "pack-organisation-complete",
    }),
    ctaExternal: true,
  },
  {
    num: "Mode 02",
    name: "À la carte",
    tagline:
      "Vous avez déjà fait la moitié du boulot. On débarque là où ça coince.",
    priceLabel: "Sur devis",
    priceFrom: "à partir de 800 €",
    features: [
      { label: "Coordination du jour J seule" },
      { label: "Décoration et scénographie" },
      { label: "Chasse de prestataires précis" },
      { label: "Gestion logistique et planning" },
      { label: "Conseil et direction artistique" },
      { label: "À combiner selon votre projet", option: true },
    ],
    ctaLabel: "Demander un devis ciblé",
    ctaHref: buildCalendlyUrl({
      source: "mariage",
      content: "pack-a-la-carte",
    }),
    ctaExternal: true,
  },
];

// PLACEHOLDER — fourchettes tarifaires à valider avec Aïssa sur 3 dossiers réels
const EXAMPLES = [
  {
    title: "Mariage 80 invités",
    sub: "Espace Events · civil + repas servi",
    price: "≈ 3 500 €",
    note: "Pack lieu + wedding planning ciblé",
  },
  {
    title: "Mariage 120 invités",
    sub: "Lieu partenaire · civil + religieux + cocktail",
    price: "≈ 8 500 €",
    note: "Organisation complète A à Z",
  },
  {
    title: "Coordination jour J",
    sub: "Tout est prêt, on prend le relais le jour même",
    price: "dès 800 €",
    note: "À la carte · 1 coordinatrice présente",
  },
];

function formatPrice(value: number): string {
  return `à partir de ${value.toLocaleString("fr-FR")} €`;
}

export function MariagePacks({ data }: { data?: PacksData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const sanityPacks = data?.packs ?? [];
  const modes: Mode[] = sanityPacks.length
    ? sanityPacks.map((p, i) => {
        const cta = resolveCta(p.cta ?? null);
        const features = [
          ...(p.includedItems ?? []).map((label) => ({
            label,
            option: false,
          })),
          ...(p.excludedItems ?? []).map((label) => ({
            label,
            option: true,
          })),
        ];
        return {
          num: `Mode ${String(i + 1).padStart(2, "0")}`,
          name: p.title ?? "",
          tagline: p.tagline ?? "",
          priceLabel: p.priceLabel ?? (p.priceFrom ? `${p.priceFrom} €` : "Sur devis"),
          priceFrom: p.priceFrom ? formatPrice(p.priceFrom) : "",
          featured: p.featured ?? false,
          badge: p.featured ? "Le plus complet" : undefined,
          features,
          ctaLabel: cta?.label ?? "Demander un devis",
          ctaHref:
            cta?.href ??
            buildCalendlyUrl({
              source: "mariage",
              content: `pack-${(p.title ?? "").toLowerCase().replace(/\s+/g, "-")}`,
            }),
          ctaExternal: cta?.external ?? true,
        };
      })
    : FALLBACK_MODES;

  return (
    <MotionConfig reducedMotion="user">
      <section id="packs" className="relative bg-cream-soft py-28 sm:py-36">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-14 max-w-[820px] text-center"
          >
            <div className="mb-6">
              <Eyebrow align="center">{eyebrow}</Eyebrow>
            </div>
            <h2
              className="font-serif text-[44px] leading-[0.95] tracking-[-0.03em] sm:text-[64px] lg:text-[88px]"
              style={{ fontWeight: 300 }}
            >
              {title.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {renderInlineItalic(line)}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>
            {intro && (
              <p
                className="mt-6 font-serif text-[17px] italic leading-[1.55] text-ink-soft sm:text-[18px]"
                style={{ fontWeight: 300 }}
              >
                {intro}
              </p>
            )}
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
                — {FALLBACK_CONTEXT_LABEL}
              </p>
              <p className="mt-1 font-serif text-[15px] italic text-ink sm:text-[16px]">
                {FALLBACK_CONTEXT_TEXT}
              </p>
            </div>
            <p className="font-serif text-[14px] italic text-bordeaux">
              {FALLBACK_CONTEXT_NOTE}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {modes.map((m, i) => (
              <motion.article
                key={`${m.name}-${i}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.12,
                }}
                whileHover={{ y: -8 }}
                className={`relative flex flex-col rounded-[24px] border transition-all duration-500 ${
                  m.featured
                    ? "border-ink bg-ink text-cream shadow-[0_30px_80px_rgba(44,31,51,0.18)]"
                    : "border-[var(--rule)] bg-cream hover:border-bordeaux hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)]"
                }`}
              >
                {m.badge && (
                  <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gold px-4 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-ink">
                    <Star className="size-3 fill-current" />
                    {m.badge}
                  </span>
                )}

                <div
                  className={`border-b px-9 pt-10 pb-7 ${
                    m.featured ? "border-cream/15" : "border-[var(--rule)]"
                  }`}
                >
                  <p
                    className={`mb-3 font-mono text-[10px] uppercase tracking-[0.22em] ${
                      m.featured ? "text-gold-soft" : "text-bordeaux"
                    }`}
                  >
                    — {m.num}
                  </p>
                  <h3
                    className="font-serif text-[32px] leading-[1] tracking-[-0.02em] sm:text-[36px]"
                    style={{ fontWeight: 400 }}
                  >
                    {m.name}
                  </h3>
                  {m.tagline && (
                    <p
                      className={`mt-2 font-serif text-[14.5px] italic leading-snug ${
                        m.featured ? "text-gold-soft" : "text-muted-ink"
                      }`}
                      style={{ fontWeight: 300 }}
                    >
                      {m.tagline}
                    </p>
                  )}

                  <div className="mt-7 flex items-baseline gap-3">
                    <span
                      className={`font-serif text-[44px] italic leading-none tracking-[-0.02em] ${
                        m.featured ? "text-cream" : "text-bordeaux"
                      }`}
                      style={{ fontWeight: 500 }}
                    >
                      {m.priceLabel}
                    </span>
                    {m.priceFrom && (
                      <span
                        className={`whitespace-nowrap font-mono text-[10.5px] uppercase tracking-[0.22em] ${
                          m.featured ? "text-cream/55" : "text-muted-ink"
                        }`}
                      >
                        {m.priceFrom}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 px-9 py-8">
                  <p
                    className={`mb-4 border-b pb-2 font-mono text-[9px] uppercase tracking-[0.28em] ${
                      m.featured
                        ? "border-cream/20 text-gold-soft"
                        : "border-[var(--rule)] text-bordeaux"
                    }`}
                  >
                    — {m.featured ? "Pris en charge" : "Prestations possibles"}
                  </p>
                  <ul>
                    {m.features.map((f, idx) => (
                      <li
                        key={`${f.label}-${idx}`}
                        className={`flex items-start gap-3 border-b py-2.5 text-[14px] leading-[1.5] last:border-b-0 ${
                          m.featured
                            ? "border-cream/10 text-cream/85"
                            : "border-[var(--rule-soft)] text-ink-soft"
                        }`}
                      >
                        {f.option ? (
                          <span
                            className={`mt-0.5 inline-flex size-4 flex-shrink-0 items-center justify-center rounded-full border border-dashed ${
                              m.featured
                                ? "border-cream/40 text-cream/50"
                                : "border-muted-ink text-muted-ink"
                            }`}
                          >
                            <Plus className="size-2.5" />
                          </span>
                        ) : (
                          <span
                            className={`mt-0.5 inline-flex size-4 flex-shrink-0 items-center justify-center rounded-full ${
                              m.featured
                                ? "bg-gold text-ink"
                                : "bg-bordeaux text-cream"
                            }`}
                          >
                            <Check className="size-2.5 stroke-[3]" />
                          </span>
                        )}
                        <span className={f.option ? "italic" : ""}>
                          {f.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-9 pb-9">
                  {m.ctaExternal ? (
                    <a
                      href={m.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group block rounded-full px-6 py-4 text-center font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        m.featured
                          ? "bg-gold text-ink hover:bg-gold-soft focus-visible:ring-gold focus-visible:ring-offset-ink"
                          : "bg-bordeaux text-cream hover:bg-bordeaux-deep focus-visible:ring-bordeaux focus-visible:ring-offset-cream"
                      }`}
                    >
                      {m.ctaLabel}
                    </a>
                  ) : (
                    <Link
                      href={m.ctaHref}
                      className={`group block rounded-full px-6 py-4 text-center font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        m.featured
                          ? "bg-gold text-ink hover:bg-gold-soft focus-visible:ring-gold focus-visible:ring-offset-ink"
                          : "bg-bordeaux text-cream hover:bg-bordeaux-deep focus-visible:ring-bordeaux focus-visible:ring-offset-cream"
                      }`}
                    >
                      {m.ctaLabel}
                    </Link>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="mt-16"
          >
            <div className="mb-6 flex items-end justify-between gap-4">
              <p className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-bordeaux">
                <span className="size-2 animate-pulse rounded-full bg-bordeaux" />
                Repères tarifaires · 3 cas concrets
              </p>
              <Link
                href="/#contact"
                className="hidden items-center gap-1.5 rounded-sm font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-ink transition-colors hover:text-bordeaux focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream-soft sm:inline-flex"
              >
                Voir tous les exemples
                <ArrowRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {EXAMPLES.map((ex) => (
                <article
                  key={ex.title}
                  className="rounded-[20px] border border-[var(--rule)] bg-cream-soft p-7 transition-all duration-500 hover:border-bordeaux/40 hover:shadow-[0_18px_50px_rgba(44,31,51,0.06)]"
                >
                  <p className="font-serif text-[20px] leading-tight text-ink">
                    {ex.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.6] text-muted-ink">
                    {ex.sub}
                  </p>
                  <div className="mt-5 flex items-baseline justify-between border-t border-[var(--rule)] pt-4">
                    <span className="font-serif text-[26px] italic leading-none text-bordeaux">
                      {ex.price}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                      {ex.note}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
