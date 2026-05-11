"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EvenementPageQueryResult } from "@/sanity.types";

type UseCasesData = NonNullable<EvenementPageQueryResult>["usecases"];

type UseCase = {
  num: string;
  italic: string;
  rest: string;
  desc: string;
};

const FALLBACK_EYEBROW = "Nos terrains de jeu";
const FALLBACK_TITLE = "Tous vos formats _pro._";
const FALLBACK_INTRO =
  "Quatre formats que nous produisons régulièrement à Émerainville, Paris et en Île-de-France, en pack ou sur devis selon votre brief.";

const USECASES: UseCase[] = [
  {
    num: "01",
    italic: "Soirées",
    rest: "clients",
    desc: "Format dîner ou cocktail dînatoire pour 30 à 120 invités. Programmation musicale calée sur votre marque, accueil VIP, hôtesses bilingues sur demande. Brief type : fidéliser un top 50 de prescripteurs.",
  },
  {
    num: "02",
    italic: "Afterworks",
    rest: "& cocktails",
    desc: "Cocktails 17h-21h pour 30 à 80 personnes. Format ponctuel ou rendez-vous mensuel récurrent, à l'Espace Events Émerainville ou dans vos locaux. DJ set, mange-debout, bar partenaire.",
  },
  {
    num: "03",
    italic: "Lancements",
    rest: "produits",
    desc: "Reveal produit, espaces brand, parcours invité, captation photo et vidéo pour réutilisation com. Brief type : 120 prescripteurs presse et influence sur 3 semaines de prep, livrables médias sous 7 jours.",
  },
  {
    num: "04",
    italic: "Séminaires",
    rest: "& internes",
    desc: "Conventions, kick-offs, soirées fin d'année. Plénière, ateliers et soirée orchestrés sur 1 ou 2 jours, 50 à 200 collaborateurs. Coordination logistique, transport, hébergement si multi-jours.",
  },
];

export function EvenementUseCases({ data }: { data?: UseCasesData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = FALLBACK_INTRO;

  const sanitySteps = data?.steps ?? [];
  const usecases: UseCase[] = sanitySteps.length
    ? sanitySteps.map((s, i) => ({
        num: String(i + 1).padStart(2, "0"),
        italic: s.italic ?? "",
        rest: s.rest ?? "",
        desc: s.description ?? "",
      }))
    : USECASES;

  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-[700px] text-center"
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {usecases.map((u, i) => (
            <motion.article
              key={`${u.num}-${i}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.08,
              }}
              whileHover={{ y: -6 }}
              className="group rounded-[24px] border border-[var(--rule)] bg-cream-soft p-9 transition-all duration-500 hover:border-bordeaux hover:bg-cream hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)]"
            >
              <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.28em] text-bordeaux">
                — {u.num}
              </p>
              <h3
                className="mb-3 font-serif text-[24px] leading-[1.1]"
                style={{ fontWeight: 400 }}
              >
                <em className="italic text-bordeaux">{u.italic}</em>
                <br />
                {u.rest}
              </h3>
              <p className="text-[13px] leading-[1.65] text-ink-soft">
                {u.desc}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
