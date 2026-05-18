"use client";

import Image from "next/image";
import { MotionConfig, motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { urlForImageString } from "@/lib/sanity/image";
import type { MariagePageQueryResult } from "@/sanity.types";

type ThemesData = NonNullable<MariagePageQueryResult>["themes"];

const FALLBACK_EYEBROW = "Décoration de table";
const FALLBACK_TITLE = "Quatre univers\nau _choix._";
const FALLBACK_INTRO =
  "Inclus dans les packs Premium et Prestige · Disponible à la carte sur tout pack · 55 € la table.";

type FallbackTheme = {
  name: string;
  description: string;
  accentColor: "bordeaux" | "sage";
  tags: string[];
};

const FALLBACK_ITEMS: FallbackTheme[] = [
  {
    name: "Chic",
    description:
      "Touches dorées, lignes épurées, blancs nacrés. Une élégance intemporelle qui sublime cérémonies civiles et soirées smoking.",
    accentColor: "bordeaux",
    tags: ["Doré", "Épuré"],
  },
  {
    name: "Bohème",
    description:
      "Fleurs séchées, bois flotté, tons doux et beige naturel. Ambiance romantique pour mariage en plein air ou champêtre.",
    accentColor: "sage",
    tags: ["Végétal"],
  },
  {
    name: "Orientale",
    description:
      "Lanternes dorées, tissus drapés, coussins moelleux. L'atmosphère des mille et une nuits pour henné, fiançailles ou mariage maghrébin.",
    accentColor: "bordeaux",
    tags: ["Lanternes"],
  },
  {
    name: "Afro Chic",
    description:
      "Ocre, terracotta, doré chaud. Authenticité et raffinement pour célébrer vos racines avec caractère.",
    accentColor: "bordeaux",
    tags: ["Terracotta"],
  },
];

export function MariageThemes({ data }: { data?: ThemesData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const sanityItems = data?.items ?? [];
  const items = sanityItems.length
    ? sanityItems.map((item) => ({
        name: item?.name ?? "",
        description: item?.description ?? "",
        image: item?.image?.asset
          ? urlForImageString(item.image, { width: 900, quality: 85 })
          : null,
        imageAlt: item?.image?.alt || `Thème ${item?.name ?? ""}`,
        accentColor: item?.accentColor ?? null,
        tags: item?.tags ?? null,
      }))
    : FALLBACK_ITEMS.map((t) => ({
        name: t.name,
        description: t.description,
        image: null as string | null,
        imageAlt: `Thème ${t.name}`,
        accentColor: t.accentColor as string,
        tags: t.tags as string[] | null,
      }));

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative bg-cream-soft py-28 sm:py-36">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mb-14 max-w-[720px] text-center"
          >
            {eyebrow && (
              <div className="mb-6">
                <Eyebrow align="center">{eyebrow}</Eyebrow>
              </div>
            )}
            {title && (
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
            )}
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
                  {t.image ? (
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
                  ) : (
                    <div
                      className={`relative flex aspect-[4/5] w-full items-end justify-start overflow-hidden border-b border-[var(--rule)] ${
                        isSage
                          ? "bg-[linear-gradient(180deg,#E9EBE0_0%,#D6DBC8_60%,#B4B996_100%)]"
                          : "bg-[linear-gradient(180deg,#F4ECE2_0%,#E8D4C7_60%,#C9A192_100%)]"
                      }`}
                    >
                      {t.tags && t.tags.length > 0 && (
                        <span
                          className={`absolute left-4 top-4 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-cream backdrop-blur-sm ${
                            isSage ? "bg-sage/95" : "bg-bordeaux/95"
                          }`}
                        >
                          {t.tags[0]}
                        </span>
                      )}
                      <span
                        aria-hidden
                        className={`m-6 font-serif text-[110px] italic leading-[0.8] opacity-25 ${
                          isSage ? "text-sage" : "text-bordeaux"
                        }`}
                      >
                        {t.name.charAt(0)}
                      </span>
                    </div>
                  )}
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
    </MotionConfig>
  );
}
