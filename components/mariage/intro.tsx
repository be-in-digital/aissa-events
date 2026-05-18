"use client";

import { MotionConfig, motion } from "motion/react";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { MariagePageQueryResult } from "@/sanity.types";

type IntroData = NonNullable<MariagePageQueryResult>["intro"];

const FALLBACK_EYEBROW = "Notre approche";
const FALLBACK_TITLE = "Chaque mariage\nest une _histoire._";
const FALLBACK_PARAGRAPHS = [
  "Votre mariage mérite bien plus qu'une simple coordination. Aïssa Events conçoit chaque projet de A à Z avec une exigence quasi obsessionnelle du détail : du choix du lieu jusqu'à la lumière qui tombe sur la table à 21h30.",
  "Depuis le premier appel jusqu'à la dernière danse, vous avez une seule interlocutrice. Pas de chargé de clientèle qui passe le dossier, pas de standardiste. Aïssa orchestre, et vous profitez.",
  "Wedding planner diplômée, elle dirige personnellement chaque mariage avec son équipe : civils, religieux, henné, baptêmes, fiançailles, cérémonies laïques en plein air. Chaque rite est traité avec ses codes et son temps propre.",
];

export function MariageIntro({ data }: { data?: IntroData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const body = data?.body;
  const hasBody = body && body.length > 0;

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative bg-cream-soft py-24 sm:py-28">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {eyebrow && (
                <div className="mb-6">
                  <Eyebrow>{eyebrow}</Eyebrow>
                </div>
              )}
              <h2
                className="font-serif text-[36px] leading-[1] tracking-[-0.03em] sm:text-[48px] lg:text-[64px]"
                style={{ fontWeight: 300 }}
              >
                {title.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {renderInlineItalic(line)}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="space-y-5 text-[16px] leading-[1.8] text-ink-soft"
            >
              {hasBody ? (
                <PortableText value={body} />
              ) : (
                FALLBACK_PARAGRAPHS.map((p, i) => <p key={i}>{p}</p>)
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
