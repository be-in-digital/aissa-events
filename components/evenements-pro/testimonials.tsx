"use client";

import { MotionConfig, motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { TestimonialsCarousel } from "@/components/testimonials/carousel";
import { TestimonialCard } from "@/components/testimonials/card";

/**
 * Témoignages décideurs B2B.
 *
 * USAGE — actuellement commenté dans `app/(site)/evenements-pro/page.tsx`.
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
  // Exemples — à remplacer par vrais témoignages signés.
];

export function EvenementTestimonials() {
  if (TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative bg-cream-soft py-28 sm:py-36">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-14 max-w-[760px] text-center"
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

          <TestimonialsCarousel
            items={TESTIMONIALS}
            itemKey={(t) => t.name}
            maxWidth={900}
            renderItem={(t) => (
              <TestimonialCard
                data={{
                  quote: t.text,
                  name: t.name,
                  meta: [t.role, t.context, t.date]
                    .filter(Boolean)
                    .join(" · "),
                  rating: 5,
                }}
              />
            )}
          />
        </div>
      </section>
    </MotionConfig>
  );
}
