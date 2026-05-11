"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { urlForImageString } from "@/lib/sanity/image";
import { REALISATIONS_IMAGES } from "@/lib/images";
import type {
  RealisationsListQueryResult,
  RealisationsPageQueryResult,
} from "@/sanity.types";

type Filter = string;

type FilterDef = { value: Filter; label: string; accent?: "sage" };

const FALLBACK_FILTERS: FilterDef[] = [
  { value: "all", label: "Tous" },
  { value: "mariage", label: "Mariages" },
  { value: "pro", label: "Événements pros" },
  { value: "espace", label: "Espace Events" },
  { value: "outdoor", label: "Plein air", accent: "sage" },
];

const FALLBACK_EYEBROW = "Galerie filtrable";
const FALLBACK_TITLE = "Tout, en un\n_coup d'œil._";
const FALLBACK_INTRO =
  "Cliquez sur une réalisation pour découvrir le contexte et la scénographie. Filtrez par univers pour zoomer sur ce qui vous ressemble.";

const SPANS = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
];

type GalleryItem = {
  id: string;
  src: string;
  title: string;
  tag: string;
  description: string;
  span: string;
  universe: string;
};

type Props = {
  data?: {
    galleryEyebrow?: string | null;
    galleryTitle?: string | null;
    filters?: Array<{ label: string | null; value: string | null }> | null;
    introText?: NonNullable<RealisationsPageQueryResult>["introText"] | null;
  };
  realisations?: RealisationsListQueryResult;
};

export function RealisationsGallery({ data, realisations }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [active, setActive] = useState<number | null>(null);

  const eyebrow = data?.galleryEyebrow ?? FALLBACK_EYEBROW;
  const title = data?.galleryTitle ?? FALLBACK_TITLE;

  const sanityFilters = data?.filters ?? [];
  const filters: FilterDef[] =
    sanityFilters.length > 0
      ? sanityFilters.map((f) => ({
          value: f?.value ?? "all",
          label: f?.label ?? "",
        }))
      : FALLBACK_FILTERS;

  const items: GalleryItem[] = useMemo(() => {
    if (realisations && realisations.length > 0) {
      return realisations.map((r, i) => ({
        id: r._id,
        src: r.cover?.asset
          ? urlForImageString(r.cover, { width: 1200, quality: 85 })
          : "",
        title: r.shortTitle ?? r.title ?? "",
        tag: r.typeLabel ?? r.type ?? "",
        description: r.italicSubtitle ?? r.location ?? "",
        span: SPANS[i % SPANS.length],
        universe: mapTypeToUniverse(r.type),
      }));
    }
    return REALISATIONS_IMAGES.gallery.map((it, i) => ({
      id: `fallback-${i}`,
      src: it.src,
      title: it.title,
      tag: it.tag,
      description: it.description,
      span: it.span,
      universe: it.universe,
    }));
  }, [realisations]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((it) => it.universe === filter);
  }, [filter, items]);

  const item = active !== null ? items[active] : null;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const f of filters) {
      if (f.value === "all") continue;
      c[f.value] = items.filter((it) => it.universe === f.value).length;
    }
    return c;
  }, [items, filters]);

  return (
    <section id="galerie" className="relative bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 grid items-end gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20"
        >
          <div>
            <div className="mb-6">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
            <h2
              className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[52px] lg:text-[64px]"
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
          <p
            className="max-w-md font-serif text-[17px] italic leading-[1.55] text-ink-soft sm:text-[19px]"
            style={{ fontWeight: 300 }}
          >
            {FALLBACK_INTRO}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-wrap items-center gap-2 sm:gap-3"
          role="tablist"
          aria-label="Filtrer les réalisations"
        >
          {filters.map((f) => {
            const isActive = filter === f.value;
            const isSage = f.accent === "sage";
            const count = counts[f.value] ?? 0;
            return (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(f.value)}
                className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.22em] transition-all duration-300 sm:px-5 sm:py-3 ${
                  isActive
                    ? isSage
                      ? "border-sage bg-sage text-cream"
                      : "border-bordeaux bg-bordeaux text-cream"
                    : isSage
                      ? "border-[var(--rule)] bg-cream-soft text-ink-soft hover:border-sage/40 hover:text-sage"
                      : "border-[var(--rule)] bg-cream-soft text-ink-soft hover:border-bordeaux/40 hover:text-ink"
                }`}
              >
                {f.label}
                <span
                  className={`rounded-full px-2 py-0.5 font-sans text-[10px] tabular-nums leading-none transition-colors ${
                    isActive
                      ? "bg-cream/20 text-cream"
                      : isSage
                        ? "bg-cream text-muted-ink group-hover:text-sage"
                        : "bg-cream text-muted-ink group-hover:text-bordeaux"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        <motion.div
          layout
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`grid auto-rows-[240px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:auto-rows-[260px] lg:grid-cols-4`}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((it) => {
              const originalIndex = items.indexOf(it);
              const span = filter === "all" ? it.span : "lg:col-span-1";
              return (
                <motion.button
                  key={it.id}
                  layout
                  type="button"
                  onClick={() => setActive(originalIndex)}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`group relative overflow-hidden rounded-[20px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${span}`}
                  aria-label={`Agrandir : ${it.title}`}
                >
                  {it.src && (
                    <Image
                      src={it.src}
                      alt={it.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
                      style={{
                        filter: "contrast(1.06) saturate(0.95) sepia(0.05)",
                      }}
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="pointer-events-none absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-cream/90 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                    <Maximize2 className="size-4" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 translate-y-3 p-6 text-cream opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                    {it.tag && (
                      <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-gold-soft">
                        {it.tag}
                      </p>
                    )}
                    <p className="font-serif text-[18px] italic leading-tight">
                      {it.title}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-12 text-center font-serif text-[15px] italic text-muted-ink">
            Aucune réalisation pour ce filtre — pour le moment.
          </p>
        )}
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
                {item.src && (
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                    priority
                  />
                )}
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

function mapTypeToUniverse(
  type:
    | "anniversaire"
    | "autre"
    | "babyshower"
    | "ceremonie"
    | "corporate"
    | "henne"
    | "mariage"
    | null
    | undefined,
): string {
  switch (type) {
    case "mariage":
    case "ceremonie":
    case "henne":
      return "mariage";
    case "corporate":
      return "pro";
    case "anniversaire":
    case "babyshower":
      return "espace";
    default:
      return "espace";
  }
}
