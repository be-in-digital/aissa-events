"use client";

import { motion } from "motion/react";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EvenementPageQueryResult } from "@/sanity.types";

type IntroData = NonNullable<EvenementPageQueryResult>["intro"];

const FALLBACK_EYEBROW = "Notre approche pro";
const FALLBACK_TITLE = "Un événement\npro qui _marque._";

export function EvenementIntro({ data }: { data?: IntroData }) {
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
                  Nous produisons{" "}
                  <strong className="font-medium text-ink">
                    des événements professionnels
                  </strong>{" "}
                  en Île-de-France : 30+ projets livrés, du cocktail 40 personnes
                  à la convention 2 jours.
                </p>
                <p>
                  Aïssa Events est née au sein d&apos;
                  <strong className="font-medium text-ink">Art Academy</strong>.
                  Notre métier s&apos;est construit au contact direct des artistes
                  et de la production live. Cette double culture, artistique et
                  opérationnelle, change la façon dont nous lisons un brief B2B :
                  la marque, le public, ce qu&apos;on veut qu&apos;il en reste.
                </p>
                <p>
                  Sur chaque projet, vous avez{" "}
                  <strong className="font-medium text-ink">
                    un seul interlocuteur
                  </strong>{" "}
                  du brief au debrief. Aïssa pilote, nos alternants exécutent, nos
                  partenaires (sécurité, traiteur, photo, vidéo) sont activés selon
                  le format. Photos et captation vidéo réutilisables en com
                  post-event, prévues dès le rétroplanning.
                </p>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
