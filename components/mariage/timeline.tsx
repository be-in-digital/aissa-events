"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { MariagePageQueryResult } from "@/sanity.types";

type TimelineData = NonNullable<MariagePageQueryResult>["timeline"];

const FALLBACK_EYEBROW = "Comment se déroule un mariage avec nous";
const FALLBACK_TITLE = "Six étapes,\ndu brief à la _fin de la fête._";
const FALLBACK_INTRO =
  "Du premier mail jusqu'au moment où on rend les clés du lieu au gardien à 3h du mat'. Sans flou sur qui fait quoi, ni quand.";

const FALLBACK_ITEMS = [
  {
    when: "J-9 à J-3 mois",
    title: "Préparation _et design_",
    description:
      "Brief, chasse du lieu, prestataires, scénographie. Un Google Sheet partagé (rien de plus, les outils sophistiqués finissent toujours abandonnés) qu'on met à jour ensemble. Point mensuel d'une heure ; entre deux, on s'envoie ce qu'il faut par WhatsApp.",
  },
  {
    when: "J-1 / Veille",
    title: "Henné _et pré-mariage_",
    description:
      "Installation de l'espace henné, accueil des proches, déco orientale, ambiance famille. On monte pendant que vous riez avec vos cousines, c'est le but.",
  },
  {
    when: "Jour J · Matin",
    title: "Préparatifs _et cérémonie civile_",
    description:
      "Coiffure, maquillage, premières photos. Direction la mairie (avec le créneau à respecter, parce qu'ils ne nous attendent pas) puis retour vers le lieu.",
  },
  {
    when: "Jour J · Après-midi",
    title: "Cérémonie _religieuse ou laïque_",
    description:
      "Accompagnement de l'officiant, placement des invités, photos de groupe (la partie qu'on déteste tous mais qu'il faut faire). Rituels respectés à la lettre. Le timing, on le tient en coulisses.",
  },
  {
    when: "Jour J · Soirée",
    title: "Cocktail _et vin d'honneur_",
    description:
      "Buffet, DJ ou orchestre, animations photo. Vous parlez à vos invités, on surveille l'heure et on signale au DJ quand il faut basculer en repas.",
  },
  {
    when: "Jour J · Nuit",
    title: "Repas _et fête_",
    description:
      "Service à table, discours (et témoin imprévu qui demande le micro à 23h45, ça arrive), ouverture de bal, piste pleine. Aïssa et l'équipe restent jusqu'au démontage. Vous, vous rentrez vous coucher.",
  },
];

export function MariageTimeline({ data }: { data?: TimelineData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const items = data?.items?.length
    ? data.items.map((item) => ({
        when: item?.when ?? "",
        title: item?.title ?? "",
        description: item?.description ?? "",
      }))
    : FALLBACK_ITEMS;

  return (
    <section className="relative bg-cream py-28 sm:py-36">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-[760px] text-center"
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

        <ol className="relative">
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-[15px] top-2 hidden h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-bordeaux via-bordeaux/30 to-transparent sm:block lg:left-1/2"
          />

          {items.map((s, i) => (
            <motion.li
              key={`${s.when}-${i}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.08,
              }}
              className={`relative grid gap-5 pb-12 last:pb-0 sm:grid-cols-[40px_1fr] sm:gap-7 lg:grid-cols-2 lg:gap-12 ${
                i % 2 === 1
                  ? "lg:[&>div:first-of-type]:order-2 lg:[&>div:last-of-type]:order-1 lg:text-right"
                  : ""
              }`}
            >
              <div
                className={`relative flex items-start gap-5 ${
                  i % 2 === 1 ? "lg:justify-end" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="relative z-10 mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-bordeaux/20 bg-cream-soft font-mono text-[10px] font-medium text-bordeaux sm:mt-0 lg:hidden"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={`min-w-0 ${i % 2 === 1 ? "lg:text-right" : ""}`}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                    — {s.when}
                  </p>
                  <h3
                    className="mt-3 font-serif text-[26px] leading-[1.05] sm:text-[32px]"
                    style={{ fontWeight: 400 }}
                  >
                    {renderInlineItalic(s.title)}
                  </h3>
                </div>
              </div>

              <div className="hidden sm:block">
                <span
                  aria-hidden
                  className="absolute left-[15px] top-1.5 z-10 grid size-8 -translate-x-[15px] place-items-center rounded-full border border-bordeaux/30 bg-cream font-mono text-[10px] font-medium text-bordeaux lg:left-1/2 lg:-translate-x-1/2"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className={`max-w-[440px] text-[14px] leading-[1.7] text-ink-soft ${
                    i % 2 === 1 ? "lg:ml-auto" : ""
                  }`}
                >
                  {s.description}
                </p>
              </div>

              <p className="text-[14px] leading-[1.7] text-ink-soft sm:hidden">
                {s.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
