"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { buildCalendlyUrl } from "@/lib/calendly";

export function RealisationDetailCta() {
  return (
    <section className="relative bg-cream-soft py-20 sm:py-28">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[28px] border border-[var(--rule)] bg-cream p-10 sm:p-14 lg:p-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-[-10%] size-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(184, 146, 78, 0.10) 0%, transparent 70%)",
            }}
          />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
            <div>
              <p className="mb-4 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-bordeaux">
                <span className="size-2 animate-pulse rounded-full bg-bordeaux" />
                Et pour votre projet ?
              </p>
              <h2
                className="font-serif text-[32px] leading-[1.05] tracking-[-0.03em] sm:text-[40px] lg:text-[52px]"
                style={{ fontWeight: 300 }}
              >
                On en parle <em className="italic text-bordeaux">en 30 minutes ?</em>
              </h2>
              <p
                className="mt-5 max-w-[480px] font-serif text-[16px] italic leading-[1.6] text-ink-soft sm:text-[18px]"
                style={{ fontWeight: 300 }}
              >
                Appel découverte gratuit. Aïssa cadre le brief, partage des
                pistes, et vous renvoie un devis sous 48 h.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href={buildCalendlyUrl({
                  source: "realisations",
                  content: "detail-cta",
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full bg-bordeaux px-6 py-4 text-cream transition-all duration-500 hover:-translate-y-0.5 active:translate-y-0 hover:bg-bordeaux-deep hover:shadow-[0_14px_40px_rgba(122,46,67,0.20)]"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
                  Réserver un appel
                </span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/realisations"
                className="group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full border border-bordeaux/30 bg-cream px-6 py-4 transition-all duration-500 hover:-translate-y-0.5 active:translate-y-0 hover:border-bordeaux"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                  Voir toutes les réalisations
                </span>
                <ArrowRight className="size-3.5 text-bordeaux transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
