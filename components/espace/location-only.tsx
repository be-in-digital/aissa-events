"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type LocationOnlyData = NonNullable<EspaceEventsPageQueryResult>["locationOnly"];

type Row = { day: string; hours: string; hoursNote?: string; price: string };

export function LocationOnly({ data }: { data?: LocationOnlyData }) {
  if (data?.enabled === false) return null;
  if (!data?.title) return null;
  if (!data.rows?.length) return null;

  const eyebrow = data.eyebrow;
  const title = data.title;
  const intro = data.intro;

  const rows: Row[] = data.rows
    .map((r): Row | null => {
      if (!r?.day) return null;
      return {
        day: r.day,
        hours: r.hours ?? "",
        hoursNote: r.hoursNote ?? undefined,
        price: r.price ?? "",
      };
    })
    .filter((x): x is Row => x !== null);

  if (rows.length === 0) return null;

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
          {eyebrow && (
            <div className="mb-6">
              <Eyebrow align="center">{eyebrow}</Eyebrow>
            </div>
          )}
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
