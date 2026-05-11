"use client";

import { motion } from "motion/react";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type IntroData = NonNullable<EspaceEventsPageQueryResult>["intro"];

const FALLBACK_EYEBROW = "Le lieu";
const FALLBACK_TITLE = "Notre maison\nà _Émerainville._";

export function EspaceIntro({ data }: { data?: IntroData }) {
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
                  Espace Events, c&apos;est notre salle à Émerainville (77).{" "}
                  <strong className="font-medium text-ink">
                    65 m² au sol, plus une verrière de 25 m²
                  </strong>
                  , une terrasse, une cuisine équipée et des vestiaires. Capacité :
                  50 personnes assises, 60 debout. À 25 min de Paris en RER E
                  (sortie Émerainville-Pontault), accès direct A4.
                </p>
                <p>
                  On l&apos;a aménagé pour accueillir{" "}
                  <strong className="font-medium text-ink">
                    mariage civil, henné, baptême
                  </strong>
                  , baby shower, anniversaire, EVJF, afterwork ou cocktail pro.
                  Petit lieu mais bien équipé : sono JBL, mobilier (chaises
                  Napoléon, tables, mange-debout), éclairage, climatisation chaud /
                  froid.
                </p>
                <p>
                  Trois manières de réserver : un{" "}
                  <strong className="font-medium text-ink">Pack Célébration</strong>{" "}
                  pour les cérémonies assises, un{" "}
                  <strong className="font-medium text-ink">Pack Fiesta</strong> pour
                  les soirées debout, ou la{" "}
                  <strong className="font-medium text-ink">location seule</strong>{" "}
                  dès 350 € si vous arrivez avec vos prestataires.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
