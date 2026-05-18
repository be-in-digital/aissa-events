"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, MapPin, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { urlForImageString } from "@/lib/sanity/image";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type GalleryData = NonNullable<EspaceEventsPageQueryResult>["gallery"];

type GalleryImage = {
  src: string;
  title: string;
  tag: string;
  description: string;
};

/**
 * Layout éditorial calé sur une grille 12 colonnes, alterné avec deux cartes
 * typographiques d'intermission (stat + citation) qui cassent le rythme et
 * tirent le bento vers une mise en page magazine plutôt qu'une grille SaaS.
 *
 * Chaque slot consomme soit une image (si dispo), soit une carte typo, soit
 * rien (le slot disparaît si pas d'image disponible). On dimensionne assez de
 * slots pour 7 images, mais le composant fonctionne avec n'importe quel
 * nombre (les slots image en trop sont ignorés, les slots manquants ne
 * laissent pas de trou car on filtre avant rendu).
 */
type Slot =
  | { kind: "image"; index: number; cls: string; ratioCls: string }
  | { kind: "stat"; cls: string }
  | { kind: "quote"; cls: string };

const SLOTS: Slot[] = [
  // Ligne 1 — hero dominant + vertical à droite
  {
    kind: "image",
    index: 0,
    cls: "lg:col-span-7 lg:row-span-2",
    ratioCls: "aspect-[4/3] lg:aspect-auto",
  },
  {
    kind: "image",
    index: 1,
    cls: "lg:col-span-5 lg:row-span-2",
    ratioCls: "aspect-[3/4] lg:aspect-auto",
  },
  // Ligne 2 — stat + 2 images
  { kind: "stat", cls: "lg:col-span-4 lg:row-span-1" },
  {
    kind: "image",
    index: 2,
    cls: "lg:col-span-4 lg:row-span-1",
    ratioCls: "aspect-[4/3] lg:aspect-auto",
  },
  {
    kind: "image",
    index: 3,
    cls: "lg:col-span-4 lg:row-span-1",
    ratioCls: "aspect-[4/3] lg:aspect-auto",
  },
  // Ligne 3 — wide image + quote
  {
    kind: "image",
    index: 4,
    cls: "lg:col-span-7 lg:row-span-1",
    ratioCls: "aspect-[16/9] lg:aspect-auto",
  },
  { kind: "quote", cls: "lg:col-span-5 lg:row-span-1" },
  // Ligne 4 — 2 images larges
  {
    kind: "image",
    index: 5,
    cls: "lg:col-span-5 lg:row-span-1",
    ratioCls: "aspect-[4/3] lg:aspect-auto",
  },
  {
    kind: "image",
    index: 6,
    cls: "lg:col-span-7 lg:row-span-1",
    ratioCls: "aspect-[16/9] lg:aspect-auto",
  },
];

// Repli si Sanity ne fournit pas encore les chiffres clés sur la galerie.
const STAT_FALLBACK = {
  eyebrow: "Le lieu en chiffres",
  number: "65",
  unit: "m²",
  caption: "modulables, lumière naturelle, jusqu'à 50 invités assis · 60 debout",
  context: "25 min de Paris · RER E · A4",
};

const QUOTE_FALLBACK = {
  text: "Un lieu qui respire — sans clinquant, sans bruit. Juste ce qu'il faut pour que la fête se souvienne d'elle-même.",
  source: "— Aïssa",
};

export function EspaceGallery({ data }: { data?: GalleryData }) {
  const [active, setActive] = useState<number | null>(null);

  if (data?.enabled === false) return null;
  if (!data?.title) return null;
  if (!data.images?.length) return null;

  const eyebrow = data.eyebrow;
  const title = data.title;

  const images: GalleryImage[] = data.images
    .map((img, i): GalleryImage | null => {
      if (!img?.asset) return null;
      return {
        src: urlForImageString(img, { width: 1600, quality: 85 }),
        title: img.alt || `Image ${i + 1}`,
        tag: img.caption || "",
        description: img.caption || "",
      };
    })
    .filter((x): x is GalleryImage => x !== null);

  if (images.length === 0) return null;

  // Ne garde que les slots dont l'image existe.
  const usable = SLOTS.filter(
    (s) => s.kind !== "image" || s.index < images.length,
  );

  const item = active !== null ? images[active] : null;

  return (
    <section id="galerie" className="relative bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <div>
            {eyebrow && (
              <div className="mb-6">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            <h2
              className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[52px] lg:text-[68px]"
              style={{ fontWeight: 300 }}
            >
              {title.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {renderInlineItalic(line)}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>
          </div>
        </motion.div>

        <div className="grid auto-rows-[280px] grid-cols-2 gap-3 sm:gap-4 lg:auto-rows-[300px] lg:grid-cols-12 lg:gap-5">
          {usable.map((slot, slotIdx) => {
            if (slot.kind === "image") {
              const img = images[slot.index];
              return (
                <ImageTile
                  key={`img-${slot.index}`}
                  item={img}
                  span={slot.cls}
                  ratio={slot.ratioCls}
                  delay={slotIdx * 0.06}
                  hero={slotIdx === 0}
                  onOpen={() => setActive(slot.index)}
                />
              );
            }
            if (slot.kind === "stat") {
              return (
                <StatTile
                  key="stat"
                  span={slot.cls}
                  delay={slotIdx * 0.06}
                />
              );
            }
            return (
              <QuoteTile
                key="quote"
                span={slot.cls}
                delay={slotIdx * 0.06}
              />
            );
          })}
        </div>
      </div>

      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent
          className="grid w-[calc(100%-2rem)] max-w-5xl gap-0 overflow-hidden rounded-[20px] border-0 bg-cream p-0 ring-0 sm:max-w-5xl"
          showCloseButton={false}
        >
          {item && (
            <>
              <div className="relative aspect-[4/3] w-full bg-ink/5">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col gap-2 px-8 py-6 sm:px-10 sm:py-8">
                {item.tag && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                    {item.tag}
                  </p>
                )}
                <DialogTitle
                  className="font-serif text-[26px] italic leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]"
                  style={{ fontWeight: 400 }}
                >
                  {item.title}
                </DialogTitle>
                {item.description && (
                  <DialogDescription className="text-[14px] leading-[1.7] text-ink-soft">
                    {item.description}
                  </DialogDescription>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ImageTile({
  item,
  span,
  ratio,
  delay,
  hero,
  onOpen,
}: {
  item: GalleryImage;
  span: string;
  ratio: string;
  delay: number;
  hero: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      className={`group relative col-span-2 overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${
        hero ? "rounded-[28px]" : "rounded-[20px]"
      } ${span} ${ratio}`}
      aria-label={`Agrandir : ${item.title}`}
    >
      <Image
        src={item.src}
        alt={item.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
        priority={hero}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-cream/95 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
        <Maximize2 className="size-4" strokeWidth={1.5} />
      </div>
      {hero && (
        <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-cream/95 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-bordeaux backdrop-blur-sm">
          <span className="size-1.5 animate-pulse rounded-full bg-bordeaux" />
          Le lieu signature
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 translate-y-3 p-6 text-cream opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
        {item.tag && (
          <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-gold-soft">
            {item.tag}
          </p>
        )}
        <p
          className={`font-serif italic leading-tight ${hero ? "text-[26px]" : "text-[19px]"}`}
          style={{ fontWeight: 300 }}
        >
          {item.title}
        </p>
      </div>
    </motion.button>
  );
}

function StatTile({ span, delay }: { span: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
      className={`group relative col-span-2 flex flex-col justify-between overflow-hidden rounded-[20px] border border-[var(--rule)] bg-cream-soft px-7 pb-10 pt-7 sm:px-9 sm:pb-12 sm:pt-9 ${span}`}
      aria-hidden
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-12 size-64 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(184, 146, 78, 0.18) 0%, transparent 70%)",
        }}
      />
      <div className="relative">
        <p className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
          <span className="size-1.5 rounded-full bg-bordeaux" />
          {STAT_FALLBACK.eyebrow}
        </p>
        <p
          className="font-serif text-[80px] leading-[0.85] tracking-[-0.04em] text-ink sm:text-[96px]"
          style={{ fontWeight: 300 }}
        >
          {STAT_FALLBACK.number}
          <span className="ml-2 align-top font-serif text-[24px] italic text-bordeaux sm:text-[30px]">
            {STAT_FALLBACK.unit}
          </span>
        </p>
      </div>
      <div className="relative mt-5 space-y-2">
        <p className="font-serif text-[15px] italic leading-[1.5] text-ink-soft">
          {STAT_FALLBACK.caption}
        </p>
        <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink">
          <MapPin className="size-3" strokeWidth={1.5} />
          {STAT_FALLBACK.context}
        </p>
      </div>
    </motion.div>
  );
}

function QuoteTile({ span, delay }: { span: string; delay: number }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
      className={`group relative col-span-2 flex flex-col justify-between overflow-hidden rounded-[20px] bg-ink px-7 pb-10 pt-7 text-cream sm:px-10 sm:pb-12 sm:pt-10 ${span}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 20% 0%, rgba(184, 146, 78, 0.18) 0%, transparent 55%), radial-gradient(circle at 90% 100%, rgba(122, 46, 67, 0.32) 0%, transparent 50%)",
        }}
      />
      <ArrowUpRight
        aria-hidden
        className="relative size-5 text-gold-soft"
        strokeWidth={1.5}
      />
      <blockquote
        className="relative font-serif text-[22px] italic leading-[1.4] text-cream sm:text-[26px]"
        style={{ fontWeight: 300 }}
      >
        « {QUOTE_FALLBACK.text} »
      </blockquote>
      <figcaption className="relative font-script text-[28px] leading-none text-gold-soft sm:text-[34px]">
        {QUOTE_FALLBACK.source}
      </figcaption>
    </motion.figure>
  );
}
