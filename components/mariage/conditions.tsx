"use client";

import { MotionConfig, motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { MariagePageQueryResult } from "@/sanity.types";

type ConditionsData = NonNullable<MariagePageQueryResult>["conditions"];

const FALLBACK_EYEBROW = "Conditions & garanties";
const FALLBACK_TITLE = "Pas de surprise,\njamais.";
const FALLBACK_INTRO =
  "Tout est écrit dans le contrat, signé électroniquement, gardé par vous comme par nous. Voici les quatre engagements qu'on prend systématiquement.";
const FALLBACK_FOOTNOTE =
  "Conditions générales détaillées remises avec le devis. Force majeure traitée au cas par cas, sans jamais laisser personne sur le carreau.";

const FALLBACK_ITEMS = [
  {
    title: "Devis sur mesure sous 48 h",
    description:
      "Premier échange offert, 30 minutes en visio ou téléphone. Devis détaillé envoyé sous 48 h avec ventilation poste par poste. Pas de devis automatique ni de tarif caché.",
  },
  {
    title: "Contrat signé en ligne",
    description:
      "Une fois le devis validé, le contrat est généré, signé électroniquement et archivé. Vous gardez une copie PDF. Force juridique identique à un contrat papier.",
  },
  {
    title: "Acompte de 50 % à la réservation",
    description:
      "Bloquer la date passe par un acompte de 50 %, non remboursable mais reportable une fois dans les 12 mois si on a une autre date disponible. Le reste circule via virement.",
  },
  {
    title: "Solde 15 jours avant le jour J",
    description:
      "Le solde est dû 15 jours avant l'événement, parce qu'à ce stade les prestataires sont déjà payés et le lieu bloqué. Plus aucune mauvaise surprise à venir.",
  },
];

export function MariageConditions({ data }: { data?: ConditionsData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;
  const footnote = data?.footnote ?? FALLBACK_FOOTNOTE;

  const sanityItems = data?.items ?? [];
  const items = sanityItems.length
    ? sanityItems.map((item) => ({
        title: item?.title ?? "",
        description: item?.description ?? "",
      }))
    : FALLBACK_ITEMS;

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative py-28 sm:py-36">
        <div className="mx-auto max-w-[1320px] px-6 sm:px-14">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:sticky lg:top-32 lg:self-start"
            >
              {eyebrow && (
                <div className="mb-6">
                  <Eyebrow>{eyebrow}</Eyebrow>
                </div>
              )}
              {title && (
                <h2
                  className="font-serif text-[36px] leading-[1] tracking-[-0.03em] sm:text-[48px] lg:text-[56px]"
                  style={{ fontWeight: 300 }}
                >
                  {title.split("\n").map((line, i, arr) => (
                    <span key={i}>
                      {renderInlineItalic(line)}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
                </h2>
              )}
              {intro && (
                <p
                  className="mt-6 max-w-md font-serif text-[17px] italic leading-[1.6] text-ink-soft"
                  style={{ fontWeight: 300 }}
                >
                  {intro}
                </p>
              )}
            </motion.div>

            <div className="grid gap-5">
              {items.map((s, i) => {
                const num = String(i + 1).padStart(2, "0");
                return (
                  <motion.div
                    key={`${s.title}-${i}`}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.08,
                    }}
                    whileHover={{ y: -4 }}
                    className="group grid gap-6 rounded-[24px] border border-[var(--rule)] bg-cream-soft p-7 transition-all duration-500 hover:border-bordeaux hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)] sm:grid-cols-[68px_1fr] sm:p-8"
                  >
                    <div
                      className="font-serif text-[56px] italic leading-none text-bordeaux transition-transform duration-500 group-hover:scale-110"
                      style={{ fontWeight: 400 }}
                    >
                      {num}
                    </div>
                    <div>
                      <h3
                        className="mb-2 font-serif text-[20px] leading-[1.2]"
                        style={{ fontWeight: 500 }}
                      >
                        {s.title}
                      </h3>
                      <p className="text-[14px] leading-[1.65] text-ink-soft">
                        {s.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              {footnote && (
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-2 max-w-[600px] font-serif text-[14px] italic leading-[1.55] text-muted-ink"
                >
                  {footnote}
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
