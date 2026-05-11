"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type ALaCarteData = NonNullable<EspaceEventsPageQueryResult>["alacarte"];

const FALLBACK_EYEBROW = "Composez votre événement";
const FALLBACK_TITLE = "Options _à la carte._";
const FALLBACK_INTRO =
  "Tout ce qu'on peut ajouter à un pack ou à une location seule. Tarifs fermes, à composer selon votre format.";

type Item = { name: string; price: string; highlight?: boolean };

type Category = {
  num: string;
  titleStart: string;
  titleItalic: string;
  items: Item[];
};

const FALLBACK_CATEGORIES: Category[] = [
  {
    num: "01",
    titleStart: "Décoration",
    titleItalic: "anniversaire",
    items: [
      {
        name: "Pack complet (arche + lumineux + colonnes)",
        price: "180 €",
        highlight: true,
      },
      { name: "Set de 3 colonnes décoratives", price: "10 € / unité" },
      { name: "Chiffre lumineux", price: "30 € / unité" },
      { name: "25 ballons hélium", price: "60 €" },
      { name: "Arche rectangle / ronde / ovale (×2)", price: "15 €" },
    ],
  },
  {
    num: "02",
    titleStart: "DJ, son",
    titleItalic: "& éclairage",
    items: [
      { name: "DJ AïssaEvents", price: "À partir de 400 €" },
      { name: "2 enceintes + régie + micro", price: "150 €" },
      { name: "Enceinte JBL + micro", price: "100 €" },
      { name: "Lumière supplémentaire", price: "50 €" },
      { name: "Mise en ambiance (chanteuse, karaoké)", price: "Sur devis" },
    ],
  },
  {
    num: "03",
    titleStart: "Mobilier",
    titleItalic: "& vaisselle",
    items: [
      { name: "Table rectangle / Table ronde", price: "10 € / 12 €" },
      { name: "Mange-debout (avec nappe)", price: "8 € / 8 €" },
      { name: "Chaise Napoléon · Housse blanche", price: "4 € / 2 €" },
      { name: "Ensemble vaisselle (4 € si dorée)", price: "3 €" },
      { name: "Coupe de champagne", price: "0,50 €" },
      { name: "Heure supplémentaire", price: "100 €" },
      { name: "Chicha", price: "20 €" },
    ],
  },
];

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

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const services = data?.services ?? [];
  const useFallback = services.length === 0;

  // Group sanity services by category
  const grouped: Record<string, typeof services> = {};
  for (const s of services) {
    const cat = s?.category ?? "autre";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  }

  const sanityCategories: Category[] = Object.entries(grouped).map(
    ([cat, list], i) => ({
      num: String(i + 1).padStart(2, "0"),
      titleStart: CATEGORY_LABELS[cat] ?? cat,
      titleItalic: "",
      items: list.map((s) => ({
        name: s?.title ?? "",
        price: s?.priceLabel ?? "",
      })),
    }),
  );

  const categories = useFallback ? FALLBACK_CATEGORIES : sanityCategories;

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
          <div className="mb-6">
            <Eyebrow align="center">{eyebrow}</Eyebrow>
          </div>
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
          {categories.map((cat, i) => {
            const highlight = cat.items.find((it) => it.highlight);
            const regular = cat.items.filter((it) => !it.highlight);

            return (
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
                      <em className="italic text-bordeaux">
                        {cat.titleItalic}
                      </em>
                    </>
                  )}
                </h3>

                {highlight && (
                  <div className="mb-5 rounded-2xl bg-bordeaux/[0.04] px-4 py-3.5 ring-1 ring-bordeaux/15">
                    <p className="mb-1.5 inline-flex items-center gap-1.5 font-mono text-[8.5px] font-semibold uppercase tracking-[0.26em] text-bordeaux">
                      <Star className="size-2.5 fill-current" />
                      Pack populaire · clé en main
                    </p>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="text-[13.5px] font-medium leading-tight text-ink">
                        {highlight.name}
                      </span>
                      <span
                        className="whitespace-nowrap font-serif text-[20px] italic text-bordeaux"
                        style={{ fontWeight: 600 }}
                      >
                        {highlight.price}
                      </span>
                    </div>
                  </div>
                )}

                <ul className="divide-y divide-dashed divide-[var(--rule)]">
                  {regular.map((item, idx) => (
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
            );
          })}
        </div>

        {data?.footerNote && (
          <p className="mx-auto mt-10 max-w-2xl text-center font-serif text-[15px] italic text-muted-ink">
            {data.footerNote}
          </p>
        )}
      </div>
    </section>
  );
}
