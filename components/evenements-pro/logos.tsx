"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";

/**
 * Mur de logos clients pros.
 *
 * USAGE — actuellement commenté dans `app/(site)/evenement/page.tsx`.
 * À activer dès qu'on a 6-10 logos clients dispo. Procédure :
 *
 *   1. Déposer les logos en SVG (ou PNG transparent 200×80) dans `public/logos/`.
 *   2. Renseigner le tableau `LOGOS` ci-dessous (name + path + accord client si possible).
 *   3. Décommenter `<EvenementLogos />` dans `page.tsx`.
 *   4. Vérifier visuellement : les logos doivent rester lisibles en greyscale
 *      (filter `grayscale(1) opacity-60`) avec un revealing au hover.
 *
 * Si vous n'avez pas l'autorisation explicite d'afficher un logo, ne l'utilisez pas.
 */
const LOGOS: { name: string; src: string }[] = [
  // Exemples — à remplacer
  // { name: "Marque luxe", src: "/logos/marque-luxe.svg" },
  // { name: "Banque privée", src: "/logos/banque-privee.svg" },
  // { name: "Tech start-up", src: "/logos/tech-startup.svg" },
  // { name: "Cabinet conseil", src: "/logos/cabinet-conseil.svg" },
  // { name: "Agence créative", src: "/logos/agence-creative.svg" },
  // { name: "Marque mode", src: "/logos/marque-mode.svg" },
  // { name: "Distributeur premium", src: "/logos/distributeur-premium.svg" },
  // { name: "Maison média", src: "/logos/maison-media.svg" },
];

const SECTORS = [
  "Luxe & mode",
  "Banque & finance",
  "Tech & start-up",
  "Conseil & cabinet",
  "Agences créatives",
  "Médias & édition",
];

export function EvenementLogos() {
  return (
    <section className="relative bg-cream py-24 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-12 max-w-[700px] text-center"
        >
          <div className="mb-6">
            <Eyebrow align="center">Ils nous ont fait confiance</Eyebrow>
          </div>
          <h2
            className="font-serif text-[34px] leading-[1.05] tracking-[-0.03em] sm:text-[44px] lg:text-[56px]"
            style={{ fontWeight: 300 }}
          >
            Une signature
            <br />
            <em className="italic text-bordeaux">multi-secteurs.</em>
          </h2>
          <p
            className="mt-5 font-serif text-[16px] italic text-ink-soft"
            style={{ fontWeight: 300 }}
          >
            Plus de 60 événements professionnels pour des marques de luxe, des
            cabinets, des banques privées, des start-ups tech et des agences
            créatives.
          </p>
        </motion.div>

        {LOGOS.length > 0 ? (
          <ul className="grid grid-cols-2 items-center gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {LOGOS.map((logo, i) => (
              <motion.li
                key={logo.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.05,
                }}
                className="grid h-16 place-items-center transition-all duration-500 hover:scale-105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-[44px] w-auto opacity-60 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0"
                />
              </motion.li>
            ))}
          </ul>
        ) : (
          <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2.5">
            {SECTORS.map((sector, i) => (
              <motion.li
                key={sector}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.06,
                }}
                className="rounded-full border border-[var(--rule)] bg-cream-soft px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft"
              >
                {sector}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
