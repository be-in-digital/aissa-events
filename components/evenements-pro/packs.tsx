"use client";

import { motion } from "motion/react";
import { Check, Star } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { buildCalendlyUrl } from "@/lib/calendly";
import { resolveCta } from "@/lib/sanity/cta";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EvenementPageQueryResult } from "@/sanity.types";

type PacksData = NonNullable<EvenementPageQueryResult>["packs"];

type Pack = {
  num: string;
  name: string;
  tagline: string;
  priceLabel: string;
  priceFrom: string;
  capacity: string;
  featured?: boolean;
  badge?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
};

const FALLBACK_EYEBROW = "Solutions clé en main";
const FALLBACK_TITLE = "Trois packs, _trois formats._";
const FALLBACK_INTRO =
  "Du cocktail 30 personnes au lancement 200 personnes. Chaque pack inclut direction artistique, production et coordination jour J. Vous gardez la main sur les variantes (lieu, durée, prestataires en sus).";

const FALLBACK_PACKS: [Pack, Pack, Pack] = [
  {
    num: "Pack 01",
    name: "Afterwork",
    tagline:
      "Format cocktail, 3-4 h. Idéal afterworks clients, vernissages, soirées partenaires.",
    priceLabel: "1 750 €",
    priceFrom: "30 à 50 pers.",
    capacity: "Espace Events ou hors lieu",
    features: [
      "Direction artistique brand-aligned",
      "DJ Aïssa Events (set 3 h)",
      "Mise en lumière d'ambiance",
      "Décoration scénographique",
      "Coordination jour J",
    ],
    ctaLabel: "Réserver le Pack Afterwork",
    ctaHref: buildCalendlyUrl({
      source: "evenement",
      content: "pack-afterwork",
    }),
  },
  {
    num: "Pack 02",
    name: "Séminaire",
    tagline:
      "Plénière + cocktail + soirée, 1 jour. Conventions, kick-offs, soirées de fin d'année.",
    priceLabel: "Dès 4 000 €",
    priceFrom: "50 à 150 pers.",
    capacity: "Hors lieu (vos locaux ou partenaire)",
    featured: true,
    badge: "Le plus demandé",
    features: [
      "Tout le Pack Afterwork, plus :",
      "Régie son & lumière scène plénière",
      "Captation vidéo recap (post-event)",
      "Hôtesses d'accueil bilingues",
      "Coord. prestataires (traiteur, sécu)",
      "Mise en scène brand sur mesure",
    ],
    ctaLabel: "Réserver le Pack Séminaire",
    ctaHref: buildCalendlyUrl({
      source: "evenement",
      content: "pack-seminaire",
    }),
  },
  {
    num: "Pack 03",
    name: "Lancement",
    tagline:
      "Reveal produit + cocktail + soirée. Lancements collection, marques, contenus brand.",
    priceLabel: "Dès 6 000 €",
    priceFrom: "80 à 200 pers.",
    capacity: "Lieu signature ou vos locaux",
    features: [
      "Tout le Pack Séminaire, plus :",
      "Scénographie reveal sur mesure",
      "Photographe corporate",
      "Vidéaste teaser & recap",
      "Direction artistique étendue (com)",
      "Sécurité & gestion VIP",
    ],
    ctaLabel: "Réserver le Pack Lancement",
    ctaHref: buildCalendlyUrl({
      source: "evenement",
      content: "pack-lancement",
    }),
  },
];

const EXAMPLES = [
  {
    title: "Afterwork client · 30 pers.",
    sub: "Espace Events · 4 h cocktail debout · DJ + déco",
    price: "1 750 €",
    note: "Pack Afterwork",
  },
  {
    title: "Séminaire annuel · 80 pers.",
    sub: "Domaine partenaire · plénière + cocktail + dîner + soirée",
    price: "≈ 5 000 €",
    note: "Pack Séminaire + traiteur en sus",
  },
  {
    title: "Lancement collection · 150 pers.",
    sub: "Showroom privatisé · reveal + cocktail + DJ set",
    price: "≈ 10 000 €",
    note: "Pack Lancement",
  },
];

export function EvenementPacks({ data }: { data?: PacksData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const sanityPacks = data?.packs ?? [];
  const packs: Pack[] = sanityPacks.length
    ? sanityPacks.map((p, i) => {
        const cta = resolveCta(p.cta ?? null);
        const priceLabel = p.priceLabel ?? (p.priceFrom ? `${p.priceFrom} €` : "Sur devis");
        return {
          num: `Pack ${String(i + 1).padStart(2, "0")}`,
          name: p.title ?? "",
          tagline: p.tagline ?? "",
          priceLabel,
          priceFrom: p.tagline ?? "",
          capacity: "",
          featured: p.featured ?? false,
          badge: p.featured ? "Le plus demandé" : undefined,
          features: (p.includedItems ?? []).map((label) => label),
          ctaLabel: cta?.label ?? "Demander un devis",
          ctaHref:
            cta?.href ??
            buildCalendlyUrl({
              source: "evenement",
              content: `pack-${(p.title ?? "").toLowerCase().replace(/\s+/g, "-")}`,
            }),
        };
      })
    : FALLBACK_PACKS;

  return (
    <section id="packs-pro" className="relative bg-cream-soft py-28 sm:py-36">
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
            className="font-serif text-[44px] leading-[0.95] tracking-[-0.03em] sm:text-[64px] lg:text-[80px]"
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
              className="mt-6 font-serif text-[17px] leading-[1.55] text-ink-soft sm:text-[18px]"
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
              — Dans tous les cas
            </p>
            <p className="mt-1 font-serif text-[15px] italic text-ink sm:text-[16px]">
              Direction artistique · Production · Coordination jour J
            </p>
          </div>
          <p className="font-serif text-[14px] italic text-bordeaux">
            Devis sous 48 h · Facturation entreprise (TVA · SIRET)
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {packs.map((p, i) => (
            <motion.article
              key={`${p.name}-${i}`}
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
                p.featured
                  ? "border-ink bg-ink text-cream shadow-[0_30px_80px_rgba(44,31,51,0.18)] lg:-translate-y-2"
                  : "border-[var(--rule)] bg-cream hover:border-bordeaux hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)]"
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-gold px-4 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-ink">
                  <Star className="size-3 fill-current" />
                  {p.badge}
                </span>
              )}

              <div
                className={`border-b px-9 pt-10 pb-7 ${
                  p.featured ? "border-cream/15" : "border-[var(--rule)]"
                }`}
              >
                <p
                  className={`mb-3 font-mono text-[10px] uppercase tracking-[0.22em] ${
                    p.featured ? "text-gold-soft" : "text-bordeaux"
                  }`}
                >
                  — {p.num}
                </p>
                <h3
                  className="font-serif text-[32px] leading-[1] tracking-[-0.02em] sm:text-[36px]"
                  style={{ fontWeight: 400 }}
                >
                  {p.name}
                </h3>
                <p
                  className={`mt-2 font-serif text-[14.5px] italic leading-snug ${
                    p.featured ? "text-gold-soft" : "text-muted-ink"
                  }`}
                  style={{ fontWeight: 300 }}
                >
                  {p.tagline}
                </p>

                <div className="mt-7 flex items-baseline gap-3">
                  <span
                    className={`whitespace-nowrap font-serif text-[40px] italic leading-none tracking-[-0.02em] ${
                      p.featured ? "text-cream" : "text-bordeaux"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    {p.priceLabel}
                  </span>
                </div>
                {(p.priceFrom || p.capacity) && (
                  <p
                    className={`mt-3 font-mono text-[10.5px] uppercase tracking-[0.22em] ${
                      p.featured ? "text-cream/55" : "text-muted-ink"
                    }`}
                  >
                    {[p.priceFrom, p.capacity].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>

              <div className="flex-1 px-9 py-8">
                <p
                  className={`mb-4 border-b pb-2 font-mono text-[9px] uppercase tracking-[0.28em] ${
                    p.featured
                      ? "border-cream/20 text-gold-soft"
                      : "border-[var(--rule)] text-bordeaux"
                  }`}
                >
                  — Ce qui est inclus
                </p>
                <ul>
                  {p.features.map((f, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-3 border-b py-2.5 text-[14px] leading-[1.5] last:border-b-0 ${
                        p.featured
                          ? "border-cream/10 text-cream/85"
                          : "border-[var(--rule-soft)] text-ink-soft"
                      }`}
                    >
                      <span
                        className={`mt-0.5 inline-flex size-4 flex-shrink-0 items-center justify-center rounded-full ${
                          p.featured
                            ? "bg-gold text-ink"
                            : "bg-bordeaux text-cream"
                        }`}
                      >
                        <Check className="size-2.5 stroke-[3]" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-9 pb-9">
                <a
                  href={p.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-full px-6 py-4 text-center font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                    p.featured
                      ? "bg-gold text-ink hover:bg-gold-soft"
                      : "bg-bordeaux text-cream hover:bg-bordeaux-deep"
                  }`}
                >
                  {p.ctaLabel}
                </a>
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
          <p className="mb-6 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-bordeaux">
            <span className="size-2 animate-pulse rounded-full bg-bordeaux" />
            Repères tarifaires · 3 cas concrets
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {EXAMPLES.map((ex, i) => (
              <motion.div
                key={ex.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.25 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-[20px] border border-[var(--rule)] bg-cream p-6 transition-colors hover:border-bordeaux/40"
              >
                <p
                  className="font-serif text-[18px] italic leading-[1.2] text-ink"
                  style={{ fontWeight: 500 }}
                >
                  {ex.title}
                </p>
                <p className="mt-1.5 text-[13px] leading-[1.55] text-ink-soft">
                  {ex.sub}
                </p>
                <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-[var(--rule-soft)] pt-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                    {ex.note}
                  </span>
                  <span
                    className="whitespace-nowrap font-serif text-[20px] italic text-bordeaux"
                    style={{ fontWeight: 500 }}
                  >
                    {ex.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-5 max-w-[720px] font-serif text-[13.5px] leading-[1.55] text-muted-ink">
            Tarifs indicatifs hors prestataires externes (traiteur, fleuriste,
            photographe). Le devis final dépend de votre brief, du lieu retenu et du budget plafond fixé en kick-off.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
