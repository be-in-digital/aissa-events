"use client";

import { motion } from "motion/react";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { MariagePageQueryResult } from "@/sanity.types";

type IntroData = NonNullable<MariagePageQueryResult>["intro"];

const FALLBACK_EYEBROW = "Notre approche";
const FALLBACK_TITLE = "Un mariage,\n_cent décisions._";

export function MariageIntro({ data }: { data?: IntroData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const body = data?.body;

  return (
    <section className="relative bg-cream-soft py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
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
            {body && body.length > 0 ? (
              <PortableText value={body} />
            ) : (
              <>
                <p>
                  Un mariage, c&apos;est environ cent décisions à prendre sur 9
                  mois. Lieu, traiteur, fleurs, photographe, DJ, déco, timing,
                  plan B météo, gestion des familles. Une vingtaine sont vraiment
                  lourdes (budget, contrats, choix des prestataires) ; le reste,
                  c&apos;est de la coordination quotidienne qui finit par
                  épuiser.
                </p>
                <p>
                  On en prend le maximum à votre place. Pour les autres, on vous
                  donne ce qu&apos;il faut pour trancher vite, sans avoir à
                  comparer cinq devis le soir après le boulot. Civil, religieux,
                  laïque, henné, fiançailles : on a déjà fait les quatre
                  cérémonies dans le même week-end, plus d&apos;une fois. Les
                  codes, les ordres de passage, les contraintes des officiants
                  (halal, casher, multi-confessions) : c&apos;est devenu une
                  routine pour nous, jamais pour vous.
                </p>
                <p>
                  Aïssa, wedding planner diplômée, est votre interlocutrice du
                  premier brief à la fin du dernier service. La même personne. Pas
                  un commercial qui vous lâche dès la signature.{" "}
                  <strong className="font-medium text-ink">
                    Le jour J, vous êtes invités à votre mariage. C&apos;est nous
                    qui travaillons.
                  </strong>
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
