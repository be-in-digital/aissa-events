"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { MARIAGE_IMAGES } from "@/lib/images";
import { renderInlineItalic } from "@/lib/sanity/text";
import { urlForImageString } from "@/lib/sanity/image";
import type { MariagePageQueryResult } from "@/sanity.types";

type ThemesData = NonNullable<MariagePageQueryResult>["themes"];

const FALLBACK_EYEBROW = "Décoration de table";
const FALLBACK_TITLE = "Quatre thèmes\n_prêts à servir._";
const FALLBACK_INTRO =
  "Inclus dans la formule Organisation complète. Sinon, 55 € la table, montage et démontage compris : vous arrivez les mains vides, vous repartez les mains vides.";

const FALLBACK_ITEMS = [
  {
    name: "Chic",
    description:
      "Vaisselle dorée, lignes nettes, palette ivoire et bordeaux. Le format qui marche partout, du dîner de 30 personnes au mariage de 200. Notre best-seller, et aussi le moins risqué quand vous hésitez.",
    image: MARIAGE_IMAGES.themes.chic,
    accentColor: null as string | null,
    tags: null as string[] | null,
  },
  {
    name: "Bohème",
    description:
      "Fleurs séchées, bois brut, lin froissé, tons doux. Pensé pour les cérémonies en jardin ou en plein air. Attention si vous êtes plus de 80 invités : ça demande beaucoup de place et beaucoup de bougies.",
    image: MARIAGE_IMAGES.themes.boheme,
    accentColor: "sage",
    tags: ["Végétal"],
  },
  {
    name: "Orientale",
    description:
      "Lanternes dorées, tissus drapés au plafond, bougeoirs en laiton, tapis bas. Parfait pour les henné, les pré-mariages, les fiançailles. On a fini par acheter notre propre stock parce que la location revenait trop cher.",
    image: MARIAGE_IMAGES.themes.orientale,
    accentColor: null,
    tags: null,
  },
  {
    name: "Afro Chic",
    description:
      "Ocre, doré, terracotta, motifs wax. Une déco qui revendique les codes africains sans tomber dans le bric-à-brac touristique. On bosse avec une scénographe qui vit entre Paris et Abidjan, c'est elle qui calibre.",
    image: MARIAGE_IMAGES.themes.afro,
    accentColor: null,
    tags: null,
  },
];

export function MariageThemes({ data }: { data?: ThemesData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const items = data?.items?.length
    ? data.items.map((item, idx) => ({
        name: item?.name ?? "",
        description: item?.description ?? "",
        image: item?.image?.asset
          ? urlForImageString(item.image, { width: 900, quality: 85 })
          : FALLBACK_ITEMS[idx % FALLBACK_ITEMS.length].image,
        imageAlt: item?.image?.alt || `Thème ${item?.name ?? ""}`,
        accentColor: item?.accentColor ?? null,
        tags: item?.tags ?? null,
      }))
    : FALLBACK_ITEMS.map((it) => ({
        name: it.name,
        description: it.description,
        image: it.image,
        imageAlt: `Thème ${it.name}`,
        accentColor: it.accentColor,
        tags: it.tags,
      }));

  return (
    <section className="relative bg-cream-soft py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-14 max-w-[720px] text-center"
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

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t, i) => {
            const isSage = t.accentColor === "sage";
            return (
              <motion.article
                key={`${t.name}-${i}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
                whileHover={{ y: -6 }}
                className={`group overflow-hidden rounded-[24px] border border-[var(--rule)] bg-cream transition-all duration-500 hover:shadow-[0_30px_80px_rgba(44,31,51,0.10)] ${
                  isSage ? "hover:border-sage" : "hover:border-bordeaux"
                }`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={t.image}
                    alt={t.imageAlt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    style={{
                      filter: "contrast(1.06) saturate(0.95) sepia(0.05)",
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                  {t.tags && t.tags.length > 0 && (
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-cream backdrop-blur-sm ${
                        isSage ? "bg-sage/95" : "bg-bordeaux/95"
                      }`}
                    >
                      {t.tags[0]}
                    </span>
                  )}
                </div>
                <div className="px-6 pt-5 pb-7">
                  <h3
                    className={`font-serif text-[24px] italic leading-[1.1] ${
                      isSage ? "text-sage" : "text-bordeaux"
                    }`}
                    style={{ fontWeight: 400 }}
                  >
                    {t.name}
                  </h3>
                  <p className="mt-2 text-[13px] leading-[1.6] text-ink-soft">
                    {t.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
