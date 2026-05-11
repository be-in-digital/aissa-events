"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type OccasionsData = NonNullable<EspaceEventsPageQueryResult>["occasions"];

const FALLBACK_EYEBROW = "Pour quel événement ?";
const FALLBACK_TITLE = "Quatre formats,\nune _salle._";
const FALLBACK_INTRO =
  "Cérémonies assises, soirées debout, fêtes de famille ou cocktails pro. On adapte la disposition (mobilier, sono, déco) selon votre format.";

type FallbackOccasion = {
  num: string;
  title: string;
  desc: React.ReactNode;
};

const FALLBACK_OCCASIONS: FallbackOccasion[] = [
  {
    num: "01",
    title: "_Cérémonies_ assises",
    desc: (
      <>
        Mariage civil, henné, baptêmes, cérémonies religieuses ou laïques. 50
        personnes assises max, repas servi, mobilier inclus — voir le{" "}
        <strong className="font-medium text-ink">Pack Célébration</strong>.
      </>
    ),
  },
  {
    num: "02",
    title: "_Anniversaires_ & baby showers",
    desc: (
      <>
        Anniversaires adultes ou enfants, baby showers, gender reveal, EVJF,
        fêtes privées. 60 personnes debout, sono JBL, arche ballons en option —
        voir le <strong className="font-medium text-ink">Pack Fiesta</strong>.
      </>
    ),
  },
  {
    num: "03",
    title: "_Familiaux_ & associatifs",
    desc: (
      <>
        Fêtes de famille, événements associatifs, repas de baptême. Cuisine
        équipée pour traiteur, parking gratuit, accessible PMR de plain-pied.
      </>
    ),
  },
  {
    num: "04",
    title: "_Afterworks_ & cocktails pro",
    desc: (
      <>
        Soirées clients, lancements, séminaires, afterworks. À 25 min de Paris
        en RER E — voir l&apos;
        <Link
          href="/evenements-pro"
          className="text-bordeaux underline-offset-4 hover:underline"
        >
          accompagnement B2B
        </Link>
        .
      </>
    ),
  },
];

export function EspaceOccasions({ data }: { data?: OccasionsData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const sanityItems = data?.items ?? [];
  const useFallback = sanityItems.length === 0;

  return (
    <section className="relative py-24 sm:py-32">
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
          {useFallback
            ? FALLBACK_OCCASIONS.map((o, i) => (
                <motion.article
                  key={o.num}
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
                    — {o.num}
                  </p>
                  <h3
                    className="mb-3 font-serif text-[24px] leading-[1.1]"
                    style={{ fontWeight: 400 }}
                  >
                    {renderInlineItalic(o.title)}
                  </h3>
                  <p className="text-[13px] leading-[1.65] text-ink-soft">
                    {o.desc}
                  </p>
                </motion.article>
              ))
            : sanityItems.map((o, i) => {
                const num = String(i + 1).padStart(2, "0");
                return (
                  <motion.article
                    key={`${o?.title}-${i}`}
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
                      — {num}
                    </p>
                    {o?.title && (
                      <h3
                        className="mb-3 font-serif text-[24px] leading-[1.1]"
                        style={{ fontWeight: 400 }}
                      >
                        {renderInlineItalic(o.title)}
                      </h3>
                    )}
                    {o?.description && (
                      <p className="text-[13px] leading-[1.65] text-ink-soft">
                        {o.description}
                      </p>
                    )}
                    {o?.highlights && o.highlights.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-1.5">
                        {o.highlights.map((h, hi) => (
                          <li
                            key={hi}
                            className="rounded-full border border-bordeaux/20 bg-cream px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-bordeaux"
                          >
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.article>
                );
              })}
        </div>
      </div>
    </section>
  );
}
