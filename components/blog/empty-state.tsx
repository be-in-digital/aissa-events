"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, BookOpen } from "lucide-react";
import { buildCalendlyUrl } from "@/lib/calendly";

export function BlogEmptyState() {
  return (
    <section className="relative bg-cream-soft py-24 sm:py-32">
      <div className="mx-auto max-w-[840px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[28px] border border-[var(--rule)] bg-cream p-10 text-center sm:p-16"
        >
          <span className="mx-auto mb-7 grid size-16 place-items-center rounded-full border border-bordeaux/20 bg-cream-soft text-bordeaux">
            <BookOpen className="size-7" strokeWidth={1.5} />
          </span>
          <p className="mb-6 inline-flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-bordeaux">
            <span className="size-2 animate-pulse rounded-full bg-bordeaux" />
            Le journal arrive bientôt
          </p>
          <h2
            className="mx-auto max-w-[640px] font-serif text-[36px] leading-[1.05] tracking-[-0.03em] sm:text-[48px] lg:text-[60px]"
            style={{ fontWeight: 300 }}
          >
            Inspirations &amp; conseils,
            <br />
            <em className="italic text-bordeaux">en préparation.</em>
          </h2>
          <p
            className="mx-auto mt-7 max-w-[520px] font-serif text-[17px] italic leading-[1.6] text-ink-soft"
            style={{ fontWeight: 300 }}
          >
            On y partagera des coulisses de mariages, des conseils d&apos;organisation,
            des inspirations déco. Premier article publié sous peu — en attendant,
            parlons de votre projet.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={buildCalendlyUrl({
                source: "blog",
                content: "empty-state",
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-bordeaux px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-bordeaux-deep"
            >
              Réserver un appel
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              href="/realisations"
              className="inline-flex items-center gap-2 rounded-full border border-ink px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-ink hover:text-cream"
            >
              Voir nos réalisations
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
