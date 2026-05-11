"use client";

import { motion } from "motion/react";
import { Briefcase, Music2, Sparkles, TrainFront } from "lucide-react";
import type { EvenementPageQueryResult } from "@/sanity.types";

type TrustBarData = NonNullable<EvenementPageQueryResult>["trustBar"];

const FALLBACK_ITEMS = [
  {
    Icon: Sparkles,
    label: "Formation Art Academy",
    sub: "Direction artistique pro",
  },
  {
    Icon: Briefcase,
    label: "30+ événements pro",
    sub: "Afterworks · lancements · séminaires",
  },
  {
    Icon: Music2,
    label: "Équipe interne + partenaires",
    sub: "DJ · scéno · production · staff",
  },
  {
    Icon: TrainFront,
    label: "Île-de-France",
    sub: "Émerainville (77) · Paris · 25 min RER E",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function EvenementTrustBar({ data }: { data?: TrustBarData }) {
  if (data?.enabled === false) return null;

  const sanityItems = data?.items ?? [];
  const items =
    sanityItems.length > 0
      ? sanityItems.map((item, i) => ({
          Icon: FALLBACK_ITEMS[i % FALLBACK_ITEMS.length].Icon,
          label: item?.value ?? "",
          sub: item?.label ?? "",
        }))
      : FALLBACK_ITEMS;

  return (
    <section
      aria-label="Pourquoi nous"
      className="relative -mt-12 pb-16 sm:-mt-14 sm:pb-20"
    >
      <div className="mx-auto max-w-[1280px] px-6 sm:px-14">
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="grid divide-y divide-[var(--rule-soft)] overflow-hidden rounded-[20px] border border-[var(--rule)] bg-cream shadow-[0_18px_60px_rgba(44,31,51,0.06)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4"
        >
          {items.map(({ Icon, label, sub }, i) => (
            <motion.li
              key={`${label}-${i}`}
              variants={itemVariants}
              className={`flex items-center gap-4 px-6 py-5 sm:px-7 sm:py-6 ${
                i === 1 ? "sm:border-l-0 lg:border-l" : ""
              } ${i === 2 ? "sm:border-t lg:border-t-0" : ""} ${
                i === 3 ? "sm:border-t lg:border-t-0" : ""
              }`}
              style={{
                borderColor: "var(--rule-soft)",
              }}
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full border border-bordeaux/15 bg-cream-soft text-bordeaux">
                <Icon className="size-[18px]" strokeWidth={1.5} />
              </span>
              <div className="min-w-0">
                <p
                  className="font-mono text-[11px] uppercase leading-[1.3] tracking-[0.2em] text-ink"
                  style={{ fontWeight: 500 }}
                >
                  {label}
                </p>
                <p className="mt-1 font-serif text-[13px] italic leading-[1.35] text-muted-ink">
                  {sub}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
