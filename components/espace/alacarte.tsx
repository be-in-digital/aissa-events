"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type ALaCarteData = NonNullable<EspaceEventsPageQueryResult>["alacarte"];

type Item = { name: string; price: string };

type Category = {
  num: string;
  titleStart: string;
  titleItalic: string;
  items: Item[];
};

const CATEGORY_LABELS: Record<string, string> = {
  decoration: "Décoration",
  talent: "Talent",
  logistique: "Logistique",
  coordination: "Coordination",
  lieu: "Lieu",
  autre: "Autre",
};

export function ALaCarte({ data }: { data?: ALaCarteData }) {
  if (data?.enabled === false) return null;
  if (!data?.title) return null;
  if (!data.services?.length) return null;

  const eyebrow = data.eyebrow;
  const title = data.title;
  const intro = data.intro;
  const services = data.services;

  // Group sanity services by category
  const grouped: Record<string, typeof services> = {};
  for (const s of services) {
    const cat = s?.category ?? "autre";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  }

  const categories: Category[] = Object.entries(grouped).map(
    ([cat, list], i) => ({
      num: String(i + 1).padStart(2, "0"),
      titleStart: CATEGORY_LABELS[cat] ?? cat,
      titleItalic: "",
      items: list
        .map((s): Item | null => {
          const name = s?.title;
          const price = s?.priceLabel;
          if (!name) return null;
          return {
            name,
            price: price ?? "",
          };
        })
        .filter((x): x is Item => x !== null),
    }),
  );

  if (categories.length === 0) return null;

  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-14 max-w-[700px] text-center"
        >
          {eyebrow && (
            <div className="mb-6">
              <Eyebrow align="center">{eyebrow}</Eyebrow>
            </div>
          )}
          <h2
            className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
            style={{ fontWeight: 300 }}
          >
            {renderInlineItalic(title)}
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

        <div className="grid gap-7 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.article
              key={cat.num}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.1,
              }}
              whileHover={{ y: -6 }}
              className="rounded-[24px] border border-[var(--rule)] bg-cream-soft p-9 transition-all duration-500 hover:border-bordeaux hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)]"
            >
              <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.28em] text-bordeaux">
                — {cat.num}
              </p>
              <h3
                className="mb-6 border-b border-[var(--rule)] pb-4 font-serif text-[26px] leading-[1.1]"
                style={{ fontWeight: 400 }}
              >
                {cat.titleStart}
                {cat.titleItalic && (
                  <>
                    <br />
                    <em className="italic text-bordeaux">{cat.titleItalic}</em>
                  </>
                )}
              </h3>

              <ul className="divide-y divide-dashed divide-[var(--rule)]">
                {cat.items.map((item, idx) => (
                  <li
                    key={`${item.name}-${idx}`}
                    className="flex items-baseline justify-between gap-4 py-3 text-[13px] text-ink-soft"
                  >
                    <span className="flex-1">{item.name}</span>
                    <span
                      className="whitespace-nowrap font-serif text-[15px] italic text-bordeaux"
                      style={{ fontWeight: 500 }}
                    >
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        {data.footerNote && (
          <p className="mx-auto mt-10 max-w-2xl text-center font-serif text-[15px] italic text-muted-ink">
            {data.footerNote}
          </p>
        )}
      </div>
    </section>
  );
}
