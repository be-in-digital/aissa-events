"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import type { MariagePageQueryResult } from "@/sanity.types";

type ALaCarteData = NonNullable<MariagePageQueryResult>["alacarte"];

const CATEGORY_LABELS: Record<string, { titleStart: string; titleItalic: string }> = {
  decoration: { titleStart: "Décoration", titleItalic: "& scénographie" },
  talent: { titleStart: "DJ, son", titleItalic: "& éclairage" },
  coordination: { titleStart: "Service", titleItalic: "& staff" },
  logistique: { titleStart: "Logistique", titleItalic: "& sécurité" },
  lieu: { titleStart: "Lieu", titleItalic: "& espace" },
  autre: { titleStart: "Autres", titleItalic: "prestations" },
};

export function MariageALaCarte({ data }: { data?: ALaCarteData }) {
  if (data?.enabled === false) return null;

  const services = data?.services ?? [];
  if (!services.length) return null;

  const eyebrow = data?.eyebrow;
  const title = data?.title;
  const intro = data?.intro;
  const footerNote = data?.footerNote;
  const cta = resolveCta(data?.cta ?? null);

  // Group services by category
  const categories = Object.entries(
    services.reduce<Record<string, typeof services>>((acc, s) => {
      const key = s?.category ?? "autre";
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {}),
  ).map(([key, list], idx) => {
    const labels = CATEGORY_LABELS[key] ?? CATEGORY_LABELS.autre;
    return {
      num: String(idx + 1).padStart(2, "0"),
      titleStart: labels.titleStart,
      titleItalic: labels.titleItalic,
      items: list.map((s) => ({
        name: s?.title ?? "",
        price: s?.priceLabel ?? "Sur devis",
      })),
    };
  });

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
          {title && (
            <h2
              className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
              style={{ fontWeight: 300 }}
            >
              {renderInlineItalic(title)}
            </h2>
          )}
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
              key={`${cat.num}-${cat.titleStart}`}
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
                <br />
                <em className="italic text-bordeaux">{cat.titleItalic}</em>
              </h3>

              <ul className="divide-y divide-dashed divide-[var(--rule)]">
                {cat.items.map((item) => (
                  <li
                    key={item.name}
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

        {(footerNote || cta) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col items-center gap-3 text-center"
          >
            {footerNote && (
              <p className="max-w-[680px] font-serif text-[14px] italic leading-[1.55] text-muted-ink">
                {footerNote}
              </p>
            )}
            {cta && (
              <a
                href={cta.href}
                target={cta.external ? "_blank" : undefined}
                rel={cta.external ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center gap-2 rounded-full border border-ink px-7 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-ink transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream"
              >
                {cta.label}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
