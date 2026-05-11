"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { HOME_IMAGES } from "@/lib/images";

const CATALOGUES = [
  {
    title: "Mariages",
    subtitle: "Wedding planning · 2026",
    cover: HOME_IMAGES.catalogues.mariage,
    rotate: "-3deg",
  },
  {
    title: "Ambiance",
    subtitle: "Événements pro · 2026",
    cover: HOME_IMAGES.catalogues.ambiance,
    rotate: "1.5deg",
  },
  {
    title: "Espace Events",
    subtitle: "Le lieu · 2026",
    cover: HOME_IMAGES.catalogues.espace,
    rotate: "4deg",
  },
];

export function LeadMagnet() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="relative overflow-hidden bg-ink py-32 text-cream sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 80% 30%, rgba(212,178,122,0.18) 0%, transparent 45%), radial-gradient(circle at 10% 80%, rgba(61,37,73,0.5) 0%, transparent 45%)",
        }}
      />

      <div className="relative z-[2] mx-auto grid max-w-[1320px] items-center gap-16 px-6 sm:px-14 lg:grid-cols-[1.05fr_1fr] lg:gap-24">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-gold-soft">
            <span className="size-2 animate-pulse rounded-full bg-gold-soft" />
            Catalogues 2026 · Édition limitée
          </span>
          <h2
            className="mt-6 font-serif text-[44px] leading-[0.95] tracking-[-0.03em] sm:text-[60px] lg:text-[76px]"
            style={{ fontWeight: 300 }}
          >
            Recevez nos
            <br />
            <em className="italic text-gold-soft">trois catalogues</em>
            <br />
            par email.
          </h2>
          <p className="mt-8 max-w-[480px] text-[16px] leading-[1.75] text-cream/70">
            Mariages, événements professionnels, Espace Events. 36 pages de
            photos réelles, de prix transparents et de formules détaillées.
            Vous les recevez en moins d&apos;une minute. Aucun spam, aucune
            relance commerciale ensuite.
          </p>

          <ul className="mt-10 space-y-3">
            {[
              "Les 4 thèmes signatures + grilles de prix mariages",
              "Le détail du Pack Ambiance pour les événements pro",
              "Plans, modulations & packs de l'Espace Events",
            ].map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 text-[14px] leading-[1.65] text-cream/75"
              >
                <Check
                  className="mt-1 size-4 shrink-0 text-gold-soft"
                  strokeWidth={2}
                />
                {line}
              </li>
            ))}
          </ul>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="mt-10 flex max-w-[520px] flex-col gap-3 sm:flex-row"
          >
            {submitted ? (
              <div className="flex w-full items-center justify-between gap-3 rounded-full border border-gold-soft/40 bg-gold-soft/10 px-7 py-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-soft">
                  ✓ C&apos;est parti — vérifiez vos emails dans 1 min
                </span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  required
                  placeholder="vous@exemple.com"
                  aria-label="Adresse email"
                  className="w-full rounded-full border border-cream/20 bg-cream/5 px-6 py-4 font-sans text-[15px] text-cream placeholder:italic placeholder:text-cream/40 focus:border-gold-soft focus:outline-none focus:ring-2 focus:ring-gold-soft/30"
                />
                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gold px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
                >
                  Recevoir
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              </>
            )}
          </form>
          <p className="mt-3 max-w-[520px] text-[11px] text-cream/45">
            Vos données restent privées. Désinscription en un clic. Aïssa lit
            chaque email.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="relative mx-auto h-[420px] w-full max-w-[520px] sm:h-[520px]"
        >
          {CATALOGUES.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 60, rotate: 0 }}
              whileInView={{
                opacity: 1,
                y: 0,
                rotate: parseFloat(c.rotate),
              }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 1,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3 + i * 0.15,
              }}
              whileHover={{
                rotate: parseFloat(c.rotate) * 0.4,
                y: -6,
                transition: { duration: 0.4 },
              }}
              className="absolute aspect-[3/4] overflow-hidden rounded-2xl border border-cream/10 bg-cream shadow-[0_30px_80px_rgba(0,0,0,0.4)]"
              style={{
                width: "60%",
                left: `${10 + i * 14}%`,
                top: `${i * 6}%`,
                zIndex: 10 + i,
              }}
            >
              <Image
                src={c.cover}
                alt={`Catalogue ${c.title} 2026`}
                fill
                sizes="(max-width: 1024px) 60vw, 320px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent px-5 py-4">
                <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-gold-soft">
                  {c.subtitle}
                </p>
                <p
                  className="font-serif text-[20px] italic leading-tight text-cream"
                  style={{ fontWeight: 400 }}
                >
                  {c.title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
