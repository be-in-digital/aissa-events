"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { MariagePageQueryResult } from "@/sanity.types";

type ConditionsData = NonNullable<MariagePageQueryResult>["conditions"];

const FALLBACK_EYEBROW = "Comment réserver";
const FALLBACK_TITLE = "Quatre étapes,\nc'est _tout._";
const FALLBACK_INTRO =
  "On ne réserve la date qu'à réception de l'acompte. Avant, vous restez libre de comparer, de réfléchir, de revenir vers nous avec d'autres questions.";

const FALLBACK_ITEMS = [
  {
    title: "Devis personnalisé sous 48 h",
    description:
      "Appel découverte gratuit (30 min), on cadre le projet, on envoie un devis chiffré dans les deux jours ouvrés. Si on a besoin d'infos en plus pour chiffrer, on vous le dit tout de suite.",
  },
  {
    title: "Validation & contrat signé en ligne",
    description:
      "Devis OK, contrat envoyé par mail. Signature électronique en quelques minutes, vous gardez une copie. Pas besoin d'imprimer ni de scanner.",
  },
  {
    title: "Acompte 50 % à la réservation",
    description:
      "L'acompte verrouille votre date. Tant qu'il n'est pas reçu, on ne refuse pas les autres demandes pour ce jour-là (même si on vous prévient par mail si quelqu'un d'autre a brieffé).",
  },
  {
    title: "Solde à régler 15 jours avant",
    description:
      "Le solde tombe deux semaines avant l'événement, par virement ou CB. Si c'est trop court vu votre cycle de paie, on en parle dès la signature et on adapte.",
  },
];

export function MariageConditions({ data }: { data?: ConditionsData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;
  const footnote = data?.footnote;

  const items = data?.items?.length
    ? data.items.map((item) => ({
        title: item?.title ?? "",
        description: item?.description ?? "",
      }))
    : FALLBACK_ITEMS;

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
  );
}
