"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

type Props = {
  title: string;
  intro: string;
  count: number;
};

export function BlogIndexHero({ title, intro, count }: Props) {
  return (
    <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-8 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink"
          aria-label="Fil d'Ariane"
        >
          <Link href="/" className="transition-colors hover:text-bordeaux">
            Accueil
          </Link>
          <span className="mx-3">/</span>
          Blog
        </motion.nav>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="grid items-end gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20"
        >
          <div>
            <motion.div variants={fadeUp} className="mb-8">
              <Eyebrow>
                Le journal · {count > 0 ? `${count} article${count > 1 ? "s" : ""}` : "Bientôt"}
              </Eyebrow>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-[56px] leading-[0.92] tracking-[-0.04em] text-ink sm:text-[80px] lg:text-[112px]"
              style={{ fontWeight: 300 }}
            >
              {title.split(" ").map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <em
                    key={i}
                    className="font-normal italic text-bordeaux"
                  >
                    {word}
                    {i === arr.length - 1 ? "." : ""}
                  </em>
                ) : (
                  <span key={i}>{word} </span>
                ),
              )}
            </motion.h1>
          </div>

          <motion.p
            variants={fadeUp}
            className="max-w-[480px] font-serif text-[19px] italic leading-[1.55] text-ink-soft sm:text-[22px]"
            style={{ fontWeight: 300 }}
          >
            {intro}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
