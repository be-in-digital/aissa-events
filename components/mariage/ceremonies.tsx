"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { MARIAGE_IMAGES } from "@/lib/images";
import { renderInlineItalic } from "@/lib/sanity/text";
import { urlForImageString } from "@/lib/sanity/image";
import type { MariagePageQueryResult } from "@/sanity.types";

type CeremoniesData = NonNullable<MariagePageQueryResult>["ceremonies"];

const FALLBACK_EYEBROW = "Multi-cérémonies · notre spécialité";
const FALLBACK_TITLE = "Quatre cérémonies,\n_une seule équipe._";
const FALLBACK_INTRO =
  "Civil, religieux, laïque, henné : chaque cérémonie a ses codes, ses prestataires et son rythme. On les prend toutes, parfois la même semaine, sans sous-traiter d'un format à l'autre.";

const FALLBACK_ITEMS = [
  {
    title: "Mariage civil",
    description:
      "Mairie, vin d'honneur, repas. On prend le relais à la sortie du bureau du maire (souvent en retard, jamais grave) et on tient jusqu'à la fin de la soirée. Coordination, scéno, prestataires.",
    highlights: ["Vin d'honneur", "Cocktail", "Repas servi"],
    image: MARIAGE_IMAGES.ceremonies.civil,
    accent: false,
  },
  {
    title: "Cérémonie religieuse",
    description:
      "Musulmane, chrétienne, juive, mixte. Mise en relation avec l'officiant qui correspond (on connaît ceux qui acceptent les cérémonies inter-confessions, c'est rare), déco aux codes, traiteur halal, casher ou végé. Pas de couac sur les rituels qu'on ne connaît pas.",
    highlights: ["Halal · Casher", "Officiant", "Tradition"],
    image: MARIAGE_IMAGES.ceremonies.religieux,
    accent: false,
  },
  {
    title: "Cérémonie henné",
    description:
      "Soirée henné, fiançailles, pré-mariage oriental. Lanternes, drapés, bougies au sol, mise en scène des mariés sur estrade. Le plus souvent la veille du civil : il faut prévoir le sommeil de la mariée derrière, on en a vu défaillir au cocktail.",
    highlights: ["Oriental", "Drapés", "Lanternes"],
    image: MARIAGE_IMAGES.ceremonies.henne,
    accent: false,
  },
  {
    title: "Cérémonie laïque ou plein air",
    description:
      "Cérémonie laïque en jardin, baptême civil, renouvellement de vœux, fiançailles. Officiant·e laïque, déroulé écrit avec vous (vraiment avec vous, pas un template), plan B météo prêt à dégainer. En IDF, on apprend vite à toujours avoir un plan B.",
    highlights: ["Laïque", "Plein air", "Jardin"],
    image: MARIAGE_IMAGES.ceremonies.fete,
    accent: true,
  },
];

export function MariageCeremonies({ data }: { data?: CeremoniesData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const items = data?.items?.length
    ? data.items.map((item, idx) => ({
        title: item?.title ?? "",
        description: item?.description ?? "",
        highlights: item?.highlights ?? [],
        image: item?.image?.asset
          ? urlForImageString(item.image, { width: 900, quality: 85 })
          : FALLBACK_ITEMS[idx % FALLBACK_ITEMS.length].image,
        imageAlt: item?.image?.alt || item?.title || "",
        accent: false,
      }))
    : FALLBACK_ITEMS.map((it) => ({
        title: it.title,
        description: it.description,
        highlights: it.highlights,
        image: it.image,
        imageAlt: it.title,
        accent: it.accent,
      }));

  return (
    <section className="relative py-28 sm:py-36">
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
          {intro && (
            <p
              className="mt-5 font-serif text-[17px] italic text-ink-soft"
              style={{ fontWeight: 300 }}
            >
              {intro}
            </p>
          )}
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((c, i) => {
            const isSage = c.accent;
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.article
                key={`${c.title}-${i}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
                whileHover={{ y: -8 }}
                className={`group relative flex flex-col overflow-hidden rounded-[24px] border border-[var(--rule)] bg-cream transition-all duration-500 hover:shadow-[0_30px_80px_rgba(44,31,51,0.10)] ${
                  isSage ? "hover:border-sage" : "hover:border-bordeaux"
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    style={{
                      filter: "contrast(1.06) saturate(0.95) sepia(0.05)",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
                  <span
                    className={`absolute left-4 top-4 rounded-full bg-cream/95 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] backdrop-blur-sm ${
                      isSage ? "text-sage" : "text-bordeaux"
                    }`}
                  >
                    — {num}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <h3
                    className="font-serif text-[26px] leading-[1.05]"
                    style={{ fontWeight: 400 }}
                  >
                    {renderInlineItalic(c.title, {
                      italicClassName: isSage
                        ? "italic text-sage"
                        : "italic text-bordeaux",
                    })}
                  </h3>
                  <p className="mt-3 text-[13.5px] leading-[1.65] text-ink-soft">
                    {c.description}
                  </p>
                  {c.highlights && c.highlights.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-1.5">
                      {c.highlights.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full border border-[var(--rule)] bg-cream-soft px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
