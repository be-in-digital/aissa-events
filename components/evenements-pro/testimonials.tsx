"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";

/**
 * Témoignages décideurs B2B.
 *
 * USAGE — actuellement commenté dans `app/(site)/evenement/page.tsx`.
 * À activer dès qu'on a 3 témoignages signés par des décideurs (Head of Marketing,
 * COO, CEO, Office Manager…). Procédure :
 *
 *   1. Récupérer 3 témoignages écrits + accord d'usage public (mail explicite).
 *   2. Renseigner le tableau `TESTIMONIALS` ci-dessous : prénom + initiale du nom,
 *      fonction, secteur (jamais le nom de l'entreprise sauf accord explicite),
 *      mois/année de l'événement.
 *   3. Décommenter `<EvenementTestimonials />` dans `page.tsx`.
 *
 * Chaque témoignage doit être validé par le client avant publication.
 */
type Testimonial = {
  text: string;
  name: string;
  role: string;
  context: string;
  date: string;
};

const TESTIMONIALS: Testimonial[] = [
  // Exemples de structure — à remplacer par vrais témoignages signés
  // {
  //   text: "Aïssa Events a complètement transformé notre soirée annuelle. ...",
  //   name: "Marie L.",
  //   role: "Head of Marketing",
  //   context: "Tech start-up · Soirée annuelle 180 collaborateurs",
  //   date: "Décembre 2025",
  // },
  // {
  //   text: "Lancement d'une nouvelle collection en 6 semaines de prep. ...",
  //   name: "Antoine P.",
  //   role: "Brand Director",
  //   context: "Marque luxe · Lancement collection 150 invités",
  //   date: "Mars 2026",
  // },
  // {
  //   text: "Les afterworks Aïssa Events sont devenus notre rendez-vous mensuel. ...",
  //   name: "Sophie R.",
  //   role: "Office Manager",
  //   context: "Cabinet conseil · Afterworks récurrents 60 pers.",
  //   date: "Tous les mois depuis 2024",
  // },
];

export function EvenementTestimonials() {
  if (TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <section className="relative bg-cream-soft py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-[760px] text-center"
        >
          <div className="mb-6">
            <Eyebrow align="center">Côté décideurs</Eyebrow>
          </div>
          <h2
            className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
            style={{ fontWeight: 300 }}
          >
            Trois retours
            <br />
            <em className="italic text-bordeaux">qui valent un brief.</em>
          </h2>
          <p
            className="mt-5 font-serif text-[17px] italic text-ink-soft"
            style={{ fontWeight: 300 }}
          >
            Trois fonctions différentes — marketing, brand, office management
            — trois manières de travailler avec Aïssa Events. Tous nos
            témoignages sont validés par les clients avant publication.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.12,
              }}
              whileHover={{ y: -6 }}
              className="group relative flex h-full flex-col rounded-[24px] border border-[var(--rule-soft)] bg-cream p-9 transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)]"
            >
              <Quote
                aria-hidden
                className="absolute right-7 top-7 size-9 -scale-x-100 text-bordeaux/15"
                strokeWidth={1.25}
                fill="currentColor"
              />
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                — {t.context}
              </p>
              <blockquote
                className="mb-7 flex-1 font-serif text-[17px] italic leading-[1.6] text-ink"
                style={{ fontWeight: 300 }}
              >
                {t.text}
              </blockquote>
              <figcaption className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--rule)] pt-5">
                <div>
                  <p
                    className="font-serif text-[18px] leading-tight text-ink"
                    style={{ fontWeight: 500 }}
                  >
                    {t.name}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                    {t.role}
                  </p>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink">
                  {t.date}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
