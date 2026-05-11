"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type ConditionsData = NonNullable<EspaceEventsPageQueryResult>["conditions"];

const FALLBACK_EYEBROW = "Comment réserver";
const FALLBACK_TITLE = "Quatre étapes,\n_c'est tout._";
const FALLBACK_INTRO =
  "Devis 48h, contrat en ligne, acompte 50 %, solde 15 jours avant. La date n'est bloquée qu'à réception de l'acompte.";

const FALLBACK_STEPS = [
  {
    title: "Devis personnalisé sous 48h",
    description:
      "Appel découverte gratuit (15-30 min) pour cadrer votre format, votre date, votre budget. Devis envoyé par mail dans les 48h.",
  },
  {
    title: "Contrat signé en ligne",
    description:
      "Devis validé ? Contrat envoyé par mail, signature électronique, archivage automatique.",
  },
  {
    title: "Acompte 50 % à la réservation",
    description:
      "Virement ou CB. La date est bloquée dans l'agenda dès réception. Acompte non remboursable mais reportable une fois sur 12 mois.",
  },
  {
    title: "Solde à régler 15 jours avant",
    description:
      "Le solde est dû 15 jours avant l'événement. Pas de paiement le Jour J, pas de mauvaise surprise sur la facture.",
  },
];

export function Conditions({ data }: { data?: ConditionsData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const sanityItems = data?.items ?? [];
  const items = sanityItems.length > 0 ? sanityItems : FALLBACK_STEPS;

  return (
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
            <div className="mb-6">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
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
                  key={`${s?.title}-${i}`}
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
                    {s?.title && (
                      <h3
                        className="mb-2 font-serif text-[20px] leading-[1.2]"
                        style={{ fontWeight: 500 }}
                      >
                        {s.title}
                      </h3>
                    )}
                    {s?.description && (
                      <p className="text-[14px] leading-[1.65] text-ink-soft">
                        {s.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {data?.footnote && (
          <p className="mt-12 text-center font-serif text-[14px] italic text-muted-ink">
            {data.footnote}
          </p>
        )}
      </div>
    </section>
  );
}
