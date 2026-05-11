"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import { urlForImageString } from "@/lib/sanity/image";
import type { RealisationsPageQueryResult } from "@/sanity.types";

type CaseStudiesData = NonNullable<RealisationsPageQueryResult>["caseStudies"];

const FALLBACK_EYEBROW = "Études de cas · long format";
const FALLBACK_TITLE = "Trois projets,\n_trois briefs._";
const FALLBACK_INTRO =
  "Trois exemples concrets de projets que nous avons accompagnés. Un mariage multi-cérémonies, un lancement de marque, une célébration privée. Le brief reçu, ce qui a été décidé, comment ça s'est passé.";

type FallbackCase = {
  badge: string;
  type: string;
  title: string;
  italic: string;
  meta: { label: string; value: string }[];
  story: string;
  quote: { text: string; author: string };
  hero: string;
  moodBoard: string[];
  align: "left" | "right";
};

const FALLBACK_CASES: FallbackCase[] = [
  {
    badge: "Cas n°01",
    type: "Mariage · multi-cérémonies",
    title: "Yasmine & Amine —",
    italic: "trois jours, trois ambiances",
    meta: [
      { label: "Lieu", value: "Domaine du Plessis (78)" },
      { label: "Date", value: "Septembre 2025" },
      { label: "Invités", value: "120 convives" },
      { label: "Cérémonies", value: "Henné · Civil · Religieux" },
    ],
    story:
      "Yasmine et Amine voulaient honorer leur double héritage sur trois jours, sans qu'aucune des cérémonies ne paraisse en sous-régime. On a posé un fil conducteur (palette ocre, nude, or, fleurs séchées, drapés) décliné en trois scénographies. Henné le vendredi, format oriental en petit comité. Civil le samedi matin, lumineux et sobre. Religieux le samedi soir, suivi du repas et d'une scène musicale live mêlant chaâbi et house. On a coordonné officiants, traiteur halal partenaire, photographe et vidéaste pour que les mariés ne se posent aucune question logistique.",
    quote: {
      text: "On a eu un seul interlocuteur pendant 9 mois, et la même personne était là chaque matin du mariage. C'est ce qu'on cherchait sans savoir le nommer.",
      author: "Yasmine & Amine",
    },
    hero: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1400&q=85",
    moodBoard: [
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=85",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=85",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=85",
    ],
    align: "left",
  },
  {
    badge: "Cas n°02",
    type: "Lancement de marque · luxe",
    title: "Maison Côté Sud —",
    italic: "un lancement de marque",
    meta: [
      { label: "Lieu", value: "Loft privé · Paris 11ᵉ" },
      { label: "Date", value: "Mars 2026" },
      { label: "Invités", value: "120 prescripteurs" },
      { label: "Format", value: "Reveal + cocktail + DJ" },
    ],
    story:
      "Maison Côté Sud, marque de mobilier qui sortait sa première collection grand public. Brief : un événement de lancement pour 120 prescripteurs (presse, influenceurs déco, distributeurs), avec un budget serré et trois semaines de prep. On a privatisé un loft à Paris 11ᵉ, découpé en six zones reprenant la palette de la collection. DJ live (un des artistes de leur campagne pub), cocktails signés avec leur chef ambassadeur. On a coordonné traiteur, fleurs, photo, vidéo et sécurité, monté la scénographie en deux jours, puis livré sous 72 h le recap visuel utilisable en com presse et sur LinkedIn.",
    quote: {
      text: "On a brieffé Aïssa une fois. Trois semaines après, on avait la soirée qu'on avait imaginée, dans le budget annoncé. Bilan trois mois plus tard : couverture AD France, 180 000 vues Instagram cumulées, trois nouveaux distributeurs.",
      author: "Camille L. · Brand Director",
    },
    hero: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1400&q=85",
    moodBoard: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=85",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=85",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=85",
    ],
    align: "right",
  },
  {
    badge: "Cas n°03",
    type: "Célébration privée · Espace Events",
    title: "Mélissa B. —",
    italic: "trente ans, format magazine",
    meta: [
      { label: "Lieu", value: "Espace Events · Émerainville" },
      { label: "Date", value: "Mars 2026" },
      { label: "Invités", value: "40 proches" },
      { label: "Formule", value: "Location seule + déco maison" },
    ],
    story:
      "Mélissa avait trois exigences claires : un lieu qui ne ressemble pas à une salle des fêtes, la liberté de gérer sa déco elle-même, et une équipe qui s'efface pendant la fête. On lui a ouvert l'Espace Events en location seule, fourni la sono, le mobilier et les éclairages, et laissé la main sur le reste. Briefing équipe en amont, accueil des invités en début de soirée, puis on s'est éclipsés. Le rendu photo correspondait exactement à ce qu'elle voulait. Format reproductible pour anniversaires, baby showers, EVJF, fêtes de famille.",
    quote: {
      text: "Espace très bien équipé, sono nickel, terrasse parfaite pour les photos. Aïssa nous a laissé une totale autonomie tout en restant joignable. Rapport qualité-prix imbattable pour la région.",
      author: "Mélissa B.",
    },
    hero: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&q=85",
    moodBoard: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=85",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=85",
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=85",
    ],
    align: "left",
  },
];

export function RealisationsCaseStudies({ data }: { data?: CaseStudiesData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;
  const footerEyebrow = data?.footerEyebrow;
  const footerCta = resolveCta(data?.footerCta ?? null);

  const items = data?.items ?? [];
  const useFallback = items.length === 0;

  return (
    <section
      id="etudes-de-cas"
      className="relative bg-cream-soft py-32 sm:py-40"
    >
      <div className="mx-auto max-w-[1320px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24 max-w-[1100px]"
        >
          <div className="mb-7">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <h2
            className="font-serif text-[44px] leading-[0.95] tracking-[-0.03em] sm:text-[60px] lg:text-[88px]"
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
              className="mt-8 max-w-2xl font-serif text-[18px] italic leading-[1.55] text-ink-soft sm:text-[19px]"
              style={{ fontWeight: 300 }}
            >
              {intro}
            </p>
          )}
        </motion.div>

        <div className="space-y-32 sm:space-y-40">
          {useFallback
            ? FALLBACK_CASES.map((c, idx) => (
                <article key={c.title} className="relative">
                  <div
                    className={`grid items-start gap-10 lg:grid-cols-12 lg:gap-16 ${
                      c.align === "right" ? "lg:[direction:rtl]" : ""
                    }`}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className="relative lg:col-span-7 lg:[direction:ltr]"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] sm:aspect-[5/6]">
                        <Image
                          src={c.hero}
                          alt={c.title + " " + c.italic}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover"
                          style={{
                            filter:
                              "contrast(1.06) saturate(0.95) sepia(0.05)",
                          }}
                        />
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                        {c.moodBoard.map((src, i) => (
                          <motion.div
                            key={src}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{
                              duration: 0.8,
                              delay: 0.2 + i * 0.08,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="relative aspect-square overflow-hidden rounded-2xl"
                          >
                            <Image
                              src={src}
                              alt=""
                              fill
                              sizes="(max-width: 640px) 33vw, 200px"
                              className="object-cover"
                              style={{
                                filter:
                                  "contrast(1.06) saturate(0.95) sepia(0.05)",
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{
                        duration: 1,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.15,
                      }}
                      className="lg:col-span-5 lg:[direction:ltr] lg:pt-6"
                    >
                      <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                        <span className="rounded-full bg-bordeaux px-3 py-1.5 text-cream">
                          {c.badge}
                        </span>
                        <span>·</span>
                        <span className="text-ink-soft">{c.type}</span>
                      </div>

                      <h3
                        className="font-serif text-[34px] leading-[1.05] tracking-[-0.02em] sm:text-[44px] lg:text-[52px]"
                        style={{ fontWeight: 400 }}
                      >
                        {c.title}{" "}
                        <em className="italic text-bordeaux">{c.italic}</em>
                      </h3>

                      <dl className="mt-8 grid grid-cols-2 gap-y-4 border-y border-[var(--rule)] py-6">
                        {c.meta.map((m) => (
                          <div key={m.label}>
                            <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink">
                              {m.label}
                            </dt>
                            <dd className="mt-1 font-serif text-[15px] italic text-ink">
                              {m.value}
                            </dd>
                          </div>
                        ))}
                      </dl>

                      <p className="mt-8 text-[15px] leading-[1.75] text-ink-soft sm:text-[16px]">
                        {c.story}
                      </p>

                      <blockquote className="mt-8 border-l-2 border-bordeaux pl-6">
                        <p
                          className="font-serif text-[18px] italic leading-[1.55] text-ink"
                          style={{ fontWeight: 300 }}
                        >
                          « {c.quote.text} »
                        </p>
                        <footer className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                          — {c.quote.author}
                        </footer>
                      </blockquote>
                    </motion.div>
                  </div>

                  {idx < FALLBACK_CASES.length - 1 && (
                    <div className="mt-32 flex justify-center sm:mt-40">
                      <span className="text-[20px] text-bordeaux/50">✦</span>
                    </div>
                  )}
                </article>
              ))
            : items.map((c, idx) => {
                const align = c?.alignment ?? (idx % 2 === 0 ? "left" : "right");
                const heroUrl = c?.cover?.asset
                  ? urlForImageString(c.cover, { width: 1400, quality: 85 })
                  : null;
                const moodBoard = c?.moodBoard ?? [];
                const badge =
                  c?.badge ??
                  `Cas n°${String(idx + 1).padStart(2, "0")}`;
                const typeLabel = c?.typeLabel ?? c?.type ?? "";
                const heading = c?.shortTitle ?? c?.title ?? "";
                const italicSubtitle = c?.italicSubtitle;

                return (
                  <article key={c?._id ?? idx} className="relative">
                    <div
                      className={`grid items-start gap-10 lg:grid-cols-12 lg:gap-16 ${
                        align === "right" ? "lg:[direction:rtl]" : ""
                      }`}
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative lg:col-span-7 lg:[direction:ltr]"
                      >
                        {heroUrl && (
                          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] sm:aspect-[5/6]">
                            <Image
                              src={heroUrl}
                              alt={c?.cover?.alt || heading}
                              fill
                              sizes="(max-width: 1024px) 100vw, 60vw"
                              className="object-cover"
                              style={{
                                filter:
                                  "contrast(1.06) saturate(0.95) sepia(0.05)",
                              }}
                            />
                          </div>
                        )}

                        {moodBoard.length > 0 && (
                          <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
                            {moodBoard.slice(0, 3).map((img, i) => {
                              const url = img?.asset
                                ? urlForImageString(img, {
                                    width: 600,
                                    quality: 85,
                                  })
                                : null;
                              if (!url) return null;
                              return (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 24 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true, margin: "-40px" }}
                                  transition={{
                                    duration: 0.8,
                                    delay: 0.2 + i * 0.08,
                                    ease: [0.16, 1, 0.3, 1],
                                  }}
                                  className="relative aspect-square overflow-hidden rounded-2xl"
                                >
                                  <Image
                                    src={url}
                                    alt={img?.alt || ""}
                                    fill
                                    sizes="(max-width: 640px) 33vw, 200px"
                                    className="object-cover"
                                    style={{
                                      filter:
                                        "contrast(1.06) saturate(0.95) sepia(0.05)",
                                    }}
                                  />
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{
                          duration: 1,
                          ease: [0.16, 1, 0.3, 1],
                          delay: 0.15,
                        }}
                        className="lg:col-span-5 lg:[direction:ltr] lg:pt-6"
                      >
                        <div className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                          <span className="rounded-full bg-bordeaux px-3 py-1.5 text-cream">
                            {badge}
                          </span>
                          {typeLabel && (
                            <>
                              <span>·</span>
                              <span className="text-ink-soft">{typeLabel}</span>
                            </>
                          )}
                        </div>

                        <h3
                          className="font-serif text-[34px] leading-[1.05] tracking-[-0.02em] sm:text-[44px] lg:text-[52px]"
                          style={{ fontWeight: 400 }}
                        >
                          {heading}
                          {italicSubtitle && (
                            <>
                              {" "}
                              <em className="italic text-bordeaux">
                                {italicSubtitle}
                              </em>
                            </>
                          )}
                        </h3>

                        {c?.metaItems && c.metaItems.length > 0 && (
                          <dl className="mt-8 grid grid-cols-2 gap-y-4 border-y border-[var(--rule)] py-6">
                            {c.metaItems.map((m, mi) => (
                              <div key={`${m?.label}-${m?.value}-${mi}`}>
                                <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink">
                                  {m?.label}
                                </dt>
                                <dd className="mt-1 font-serif text-[15px] italic text-ink">
                                  {m?.value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        )}

                        {c?.story && (
                          <p className="mt-8 text-[15px] leading-[1.75] text-ink-soft sm:text-[16px]">
                            {c.story}
                          </p>
                        )}

                        {c?.quote?.text && (
                          <blockquote className="mt-8 border-l-2 border-bordeaux pl-6">
                            <p
                              className="font-serif text-[18px] italic leading-[1.55] text-ink"
                              style={{ fontWeight: 300 }}
                            >
                              « {c.quote.text} »
                            </p>
                            {c.quote.author && (
                              <footer className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink">
                                — {c.quote.author}
                              </footer>
                            )}
                          </blockquote>
                        )}
                      </motion.div>
                    </div>

                    {idx < items.length - 1 && (
                      <div className="mt-32 flex justify-center sm:mt-40">
                        <span className="text-[20px] text-bordeaux/50">✦</span>
                      </div>
                    )}
                  </article>
                );
              })}
        </div>

        {(footerEyebrow || footerCta) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-32 flex flex-col items-center gap-3 text-center"
          >
            {footerEyebrow && (
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-ink">
                {footerEyebrow}
              </p>
            )}
            {footerCta && (
              <a
                href={footerCta.href}
                target={footerCta.external ? "_blank" : undefined}
                rel={footerCta.external ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center gap-2 rounded-full border border-ink px-9 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-ink transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream"
              >
                {footerCta.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
