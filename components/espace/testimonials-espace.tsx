"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { urlForImageString } from "@/lib/sanity/image";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type TestimonialsData = NonNullable<EspaceEventsPageQueryResult>["testimonials"];

const FALLBACK_EYEBROW = "Ils ont célébré ici";
const FALLBACK_TITLE = "Trois formats,\nun même _lieu._";
const FALLBACK_INTRO =
  "Mariage civil, anniversaire en location seule, baby shower Pack Fiesta : trois usages réels d'Espace Events.";

type FallbackTestimonial = {
  text: string;
  name: string;
  event: string;
  date: string;
  image: string;
};

const FALLBACK_TESTIMONIALS: FallbackTestimonial[] = [
  {
    text: "On cherchait un lieu pas trop grand pour notre mariage civil (45 invités). On a visité avec Aïssa, on a signé deux jours après. La verrière a fait le job pour les photos, la cuisine équipée a permis à notre traiteur de bosser sans souci. Aïssa était présente le Jour J, on n'a touché à rien.",
    name: "Sarah & Karim",
    event: "Mariage civil · Pack Premium",
    date: "Septembre 2025",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=85",
  },
  {
    text: "Location seule pour les 30 ans de mon mari, je gérais la déco moi-même. Salle bien équipée, sono nickel, terrasse pratique pour les photos. Aïssa m'a laissé totale autonomie tout en restant joignable. Rapport qualité-prix imbattable pour le 77.",
    name: "Mélissa B.",
    event: "Anniversaire · Location seule",
    date: "Mars 2026",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=85",
  },
  {
    text: "Baby shower de 35 personnes en Pack Fiesta. Arche ballons, lumineux « Happy Birthday », colonnes : tout était prêt à l'arrivée. La terrasse a sauvé la journée pour les photos. Le démontage s'est fait pendant qu'on finissait le gâteau.",
    name: "Naïma & Sofia",
    event: "Baby shower · Pack Fiesta",
    date: "Janvier 2026",
    image:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=85",
  },
];

export function TestimonialsEspace({ data }: { data?: TestimonialsData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;

  const sanityItems = data?.testimonials ?? [];
  const useFallback = sanityItems.length === 0;

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
            <Eyebrow align="center">{eyebrow}</Eyebrow>
          </div>
          <h2
            className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
            style={{ fontWeight: 300 }}
          >
            {title.split("\n").map((line, i, arr) => (
              <span key={i}>
                {renderInlineItalic(line)}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p
            className="mt-5 font-serif text-[17px] italic text-ink-soft"
            style={{ fontWeight: 300 }}
          >
            {FALLBACK_INTRO}
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {useFallback
            ? FALLBACK_TESTIMONIALS.map((t, i) => (
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
                  className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--rule-soft)] bg-cream transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)]"
                >
                  <div className="relative aspect-[5/3] w-full overflow-hidden">
                    <Image
                      src={t.image}
                      alt={`${t.event} — ${t.name}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      style={{
                        filter: "contrast(1.06) saturate(0.95) sepia(0.05)",
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full bg-cream/95 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-bordeaux backdrop-blur-sm">
                      {t.event}
                    </span>
                  </div>

                  <div className="relative flex flex-1 flex-col p-8 sm:p-9">
                    <Quote
                      aria-hidden
                      className="absolute right-7 top-7 size-9 -scale-x-100 text-bordeaux/15"
                      strokeWidth={1.25}
                      fill="currentColor"
                    />
                    <p className="mb-5 font-mono text-[12px] tracking-[0.32em] text-gold">
                      ★ ★ ★ ★ ★
                    </p>
                    <blockquote
                      className="mb-7 font-serif text-[16px] italic leading-[1.6] text-ink"
                      style={{ fontWeight: 300 }}
                    >
                      {t.text}
                    </blockquote>
                    <figcaption className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--rule)] pt-5">
                      <span className="font-script text-[28px] leading-none text-bordeaux">
                        {t.name}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink">
                        {t.date}
                      </span>
                    </figcaption>
                  </div>
                </motion.figure>
              ))
            : sanityItems.map((t, i) => {
                const rating = t?.rating ?? 5;
                const imageUrl = t?.authorImage?.asset
                  ? urlForImageString(t.authorImage, {
                      width: 600,
                      quality: 85,
                    })
                  : null;
                return (
                  <motion.figure
                    key={t?._id ?? i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.9,
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.12,
                    }}
                    whileHover={{ y: -6 }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--rule-soft)] bg-cream transition-shadow duration-500 hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)]"
                  >
                    {imageUrl && (
                      <div className="relative aspect-[5/3] w-full overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={`${t?.authorRole ?? ""} — ${t?.authorName ?? ""}`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 33vw"
                          className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                          style={{
                            filter:
                              "contrast(1.06) saturate(0.95) sepia(0.05)",
                          }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                        {t?.authorRole && (
                          <span className="absolute left-5 top-5 rounded-full bg-cream/95 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-bordeaux backdrop-blur-sm">
                            {t.authorRole}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="relative flex flex-1 flex-col p-8 sm:p-9">
                      <Quote
                        aria-hidden
                        className="absolute right-7 top-7 size-9 -scale-x-100 text-bordeaux/15"
                        strokeWidth={1.25}
                        fill="currentColor"
                      />
                      <p className="mb-5 font-mono text-[12px] tracking-[0.32em] text-gold">
                        {"★ ".repeat(rating).trim()}
                      </p>
                      <blockquote
                        className="mb-7 font-serif text-[16px] italic leading-[1.6] text-ink"
                        style={{ fontWeight: 300 }}
                      >
                        {t?.quote}
                      </blockquote>
                      <figcaption className="mt-auto flex items-end justify-between gap-3 border-t border-[var(--rule)] pt-5">
                        <span className="font-script text-[28px] leading-none text-bordeaux">
                          {t?.authorName}
                        </span>
                      </figcaption>
                    </div>
                  </motion.figure>
                );
              })}
        </div>
      </div>
    </section>
  );
}
