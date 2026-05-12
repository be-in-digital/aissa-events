"use client";

import { motion } from "motion/react";
import type { RealisationsPageQueryResult } from "@/sanity.types";

type TrustBarData = NonNullable<RealisationsPageQueryResult>["trustBar"];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function RealisationsTrustBar({ data }: { data?: TrustBarData }) {
  if (data?.enabled === false) return null;
  if (!data?.items?.length) return null;

  const stats = data.items
    .map((item) => ({ strong: item?.value, label: item?.label }))
    .filter(
      (s): s is { strong: string; label: string } =>
        Boolean(s.strong) && Boolean(s.label),
    );

  if (stats.length === 0) return null;

  return (
    <section aria-label="Chiffres clés" className="relative pb-16 sm:pb-20">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-14">
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={containerVariants}
          className="grid divide-y divide-[var(--rule-soft)] overflow-hidden rounded-[20px] border border-[var(--rule)] bg-cream-soft shadow-[0_18px_60px_rgba(44,31,51,0.05)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4"
        >
          {stats.map((s, i) => (
            <motion.li
              key={`${s.label}-${i}`}
              variants={itemVariants}
              className={`px-7 py-6 sm:px-8 sm:py-7 ${
                i === 1 ? "sm:border-l-0 lg:border-l" : ""
              } ${i === 2 ? "sm:border-t lg:border-t-0" : ""} ${
                i === 3 ? "sm:border-t lg:border-t-0" : ""
              }`}
              style={{
                borderColor: "var(--rule-soft)",
              }}
            >
              <p
                className="whitespace-nowrap font-serif text-[36px] italic leading-none tracking-[-0.02em] text-bordeaux sm:text-[44px]"
                style={{ fontWeight: 500 }}
              >
                {s.strong}
              </p>
              <p
                className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-ink"
                style={{ fontWeight: 500 }}
              >
                {s.label}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
