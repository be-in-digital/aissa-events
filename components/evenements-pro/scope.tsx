"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EvenementPageQueryResult } from "@/sanity.types";

type ScopeData = NonNullable<EvenementPageQueryResult>["scope"];

type ScopeItem = {
  num: string;
  title: string;
  desc: string;
};

const FALLBACK_EYEBROW = "Sur-mesure · hors pack";
const FALLBACK_TITLE = "Tout ou partie\nde votre _événement._";
const FALLBACK_INTRO =
  "Vous avez un brief atypique, un format hors pack ou un besoin précis ? Aïssa Events peut intervenir sur l'intégralité de l'organisation ou sur des prestations ciblées.";

const ITEMS: ScopeItem[] = [
  {
    num: "01",
    title: "Recherche & sélection du lieu",
    desc: "Identification du lieu idéal selon votre brief, votre nombre d'invités, votre image de marque et vos contraintes (accessibilité, sécurité ERP, parking).",
  },
  {
    num: "02",
    title: "Coordination globale",
    desc: "Pilotage de A à Z, gestion du planning, supervision du jour J. Un interlocuteur unique de bout en bout.",
  },
  {
    num: "03",
    title: "Gestion des prestataires",
    desc: "Sélection, négociation, suivi de tous les intervenants externes (traiteur, fleuriste, captation, sécurité, vestiaires, hôtesses).",
  },
  {
    num: "04",
    title: "Traiteur & service",
    desc: "Buffet, cocktail, repas assis. Halal / casher / végé / sans gluten possibles. Tarifs négociés via partenariats récurrents.",
  },
  {
    num: "05",
    title: "Staff événementiel",
    desc: "Hôtesses d'accueil bilingues, serveurs, vestiaire, agents de sécurité. Tenue alignée à votre charte si demandé.",
  },
  {
    num: "06",
    title: "Captation & com post-event",
    desc: "Photographe corporate + vidéaste teaser/recap pour réutilisation sur LinkedIn, intranet, communication client. Livraison sous 72 h.",
  },
];

export function EvenementScope({ data }: { data?: ScopeData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const sanityItems = data?.items ?? [];
  const items: ScopeItem[] = sanityItems.length
    ? sanityItems.map((it, i) => ({
        num: String(i + 1).padStart(2, "0"),
        title: it.title ?? "",
        desc: it.description ?? "",
      }))
    : ITEMS;

  return (
    <section className="relative bg-cream-soft py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-14 max-w-[760px] text-center"
        >
          <div className="mb-6">
            <Eyebrow align="center">{eyebrow}</Eyebrow>
          </div>
          <h2
            className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
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
              className="mt-5 font-serif text-[17px] italic text-ink-soft"
              style={{ fontWeight: 300 }}
            >
              {intro}
            </p>
          )}
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.article
              key={`${it.num}-${i}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.06,
              }}
              whileHover={{ y: -4 }}
              className="grid gap-5 rounded-[20px] border border-[var(--rule)] bg-cream p-7 transition-all duration-500 hover:border-bordeaux hover:shadow-[0_30px_80px_rgba(44,31,51,0.06)] sm:grid-cols-[44px_1fr]"
            >
              <span
                className="font-serif text-[40px] italic leading-none text-bordeaux"
                style={{ fontWeight: 400 }}
              >
                {it.num}
              </span>
              <div>
                <h3
                  className="mb-2 font-serif text-[18px] leading-[1.25]"
                  style={{ fontWeight: 500 }}
                >
                  {it.title}
                </h3>
                <p className="text-[13.5px] leading-[1.65] text-ink-soft">
                  {it.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
