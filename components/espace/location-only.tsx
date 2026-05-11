"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type LocationOnlyData = NonNullable<EspaceEventsPageQueryResult>["locationOnly"];

type Row = { day: string; hours: string; hoursNote?: string; price: string };

const FALLBACK_ROWS: Row[] = [
  { day: "Lundi — Jeudi", hours: "18h – 22h", price: "350 €" },
  { day: "Vendredi", hours: "17h – 5h", price: "620 €" },
  { day: "Samedi", hours: "12h – 3h ou 15h – 5h (12h)", price: "790 €" },
  { day: "Dimanche", hours: "10h – 20h ou 12h – 22h", price: "590 €" },
  {
    day: "Jour férié",
    hours: "15h – 5h",
    hoursNote: "1 000 € le 31/12",
    price: "900 €",
  },
];

const FALLBACK_EYEBROW = "Location seule";
const FALLBACK_TITLE = "Juste _la salle._";
const FALLBACK_INTRO =
  "Vous arrivez avec vos prestataires (traiteur, DJ, déco) ? Location seule à partir de 350 €. Cuisine équipée, sono et mobilier disponibles en option.";

export function LocationOnly({ data }: { data?: LocationOnlyData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const rows: Row[] = data?.rows?.length
    ? data.rows.map((r) => ({
        day: r.day ?? "",
        hours: r.hours ?? "",
        hoursNote: r.hoursNote ?? undefined,
        price: r.price ?? "",
      }))
    : FALLBACK_ROWS;

  return (
    <section className="relative bg-cream-soft py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-12 max-w-[700px] text-center"
        >
          <div className="mb-6">
            <Eyebrow align="center">{eyebrow}</Eyebrow>
          </div>
          <h2
            className="font-serif text-[36px] leading-[1] tracking-[-0.03em] sm:text-[48px] lg:text-[56px]"
            style={{ fontWeight: 300 }}
          >
            {renderInlineItalic(title)}
          </h2>
          {intro && (
            <p
              className="mt-4 font-serif text-[16px] italic text-ink-soft"
              style={{ fontWeight: 300 }}
            >
              {intro}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-[860px] overflow-hidden rounded-[24px] border border-[var(--rule)] bg-cream"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-cream-deep px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                  Jour
                </th>
                <th className="bg-cream-deep px-6 py-4 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                  Horaire
                </th>
                <th className="bg-cream-deep px-6 py-4 text-right font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
                  Tarif
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.day}
                  className="border-t border-[var(--rule-soft)] transition-colors hover:bg-cream-soft"
                >
                  <td className="px-6 py-4 font-serif text-[16px] italic text-ink">
                    {r.day}
                  </td>
                  <td className="px-6 py-4 text-[14px] text-ink-soft">
                    {r.hours}
                    {r.hoursNote && (
                      <span className="ml-2 font-mono text-[11px] text-muted-ink">
                        ({r.hoursNote})
                      </span>
                    )}
                  </td>
                  <td
                    className="px-6 py-4 text-right font-serif text-[18px] italic text-bordeaux"
                    style={{ fontWeight: 500 }}
                  >
                    {r.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
