"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { urlForImageString } from "@/lib/sanity/image";
import type {
  RealisationsListQueryResult,
  RealisationsPageQueryResult,
} from "@/sanity.types";

type Filter = string;

type FilterDef = { value: Filter; label: string; accent?: "sage" };

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
  cover: string;
  photos: string[];
  title: string;
  tag: string;
  description: string;
  span: string;
  category: string;
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
  const [lightbox, setLightbox] = useState<number | null>(null);

  const eyebrow = data?.galleryEyebrow;
  const title = data?.galleryTitle;

  const sanityFilters = data?.filters ?? [];
  const filters: FilterDef[] = sanityFilters
    .map((f) => ({
      value: f?.value ?? "",
      label: f?.label ?? "",
    }))
    .filter((f): f is FilterDef => Boolean(f.value) && Boolean(f.label));

  const items: GalleryItem[] = useMemo(() => {
    if (!realisations || realisations.length === 0) return [];
    return realisations.map((r, i) => {
      const galleryPhotos = (r.gallery ?? [])
        .map((g) =>
          g?.asset ? urlForImageString(g, { width: 1600, quality: 85 }) : "",
        )
        .filter(Boolean);
      const cover = r.cover?.asset
        ? urlForImageString(r.cover, { width: 1200, quality: 85 })
        : "";
      // Toutes les photos = cover (en premier) + gallery, dédoublonnées
      const allPhotos = Array.from(new Set([cover, ...galleryPhotos])).filter(
        Boolean,
      );
      return {
        id: r._id,
        cover,
        photos: allPhotos,
        title: r.shortTitle ?? r.title ?? "",
        tag: r.typeLabel ?? r.type ?? "",
        description: r.italicSubtitle ?? r.location ?? "",
        span: SPANS[i % SPANS.length],
        category: r.type ?? "autre",
      };
    });
  }, [realisations]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((it) => it.category === filter);
  }, [filter, items]);

  const item = active !== null ? items[active] : null;

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const f of filters) {
      if (f.value === "all") continue;
      c[f.value] = items.filter((it) => it.category === f.value).length;
    }
    return c;
  }, [items, filters]);

  const closeAll = useCallback(() => {
    setLightbox(null);
    setActive(null);
  }, []);

  const photos = item?.photos ?? [];
  const lightboxNext = useCallback(() => {
    if (lightbox === null || photos.length === 0) return;
    setLightbox((lightbox + 1) % photos.length);
  }, [lightbox, photos.length]);
  const lightboxPrev = useCallback(() => {
    if (lightbox === null || photos.length === 0) return;
    setLightbox((lightbox - 1 + photos.length) % photos.length);
  }, [lightbox, photos.length]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") lightboxNext();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, lightboxNext, lightboxPrev]);

  if (items.length === 0) return null;
  if (!title) return null;

  return (
    <section id="galerie" className="relative bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          {eyebrow && (
            <div className="mb-6">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          )}
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
        </motion.div>

        {filters.length > 0 && (
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
                  className={`group inline-flex min-h-11 items-center gap-2 rounded-full border px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.22em] transition-all duration-300 active:scale-[0.97] sm:px-5 sm:py-3 ${
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
        )}

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
                  aria-label={`Voir la galerie : ${it.title} (${it.photos.length} photos)`}
                >
                  {it.cover && (
                    <Image
                      src={it.cover}
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
                  {it.photos.length > 1 && (
                    <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/55 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cream opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                      {it.photos.length} photos
                    </div>
                  )}
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
          if (!open) closeAll();
        }}
      >
        <DialogContent
          className="grid w-[calc(100%-1.5rem)] max-w-6xl gap-0 overflow-hidden rounded-[20px] border-0 bg-cream p-0 ring-0 sm:max-w-6xl"
          showCloseButton={false}
        >
          {item && (
            <div className="flex max-h-[88vh] flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-[var(--rule)] px-6 py-5 sm:px-8 sm:py-6">
                <div className="flex flex-col gap-1.5">
                  {item.tag && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                      {item.tag}
                    </p>
                  )}
                  <DialogTitle
                    className="font-serif text-[22px] italic leading-[1.2] tracking-[-0.02em] text-ink sm:text-[28px]"
                    style={{ fontWeight: 400 }}
                  >
                    {item.title}
                  </DialogTitle>
                  {item.description && (
                    <DialogDescription className="text-[13px] leading-[1.6] text-ink-soft">
                      {item.description}
                    </DialogDescription>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeAll}
                  className="-mr-2 -mt-2 inline-flex size-10 shrink-0 items-center justify-center rounded-full text-ink-soft transition hover:bg-cream-soft hover:text-ink"
                  aria-label="Fermer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                  {item.photos.map((src, i) => (
                    <button
                      key={`${item.id}-${i}`}
                      type="button"
                      onClick={() => setLightbox(i)}
                      className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-ink/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                      aria-label={`Agrandir photo ${i + 1} sur ${item.photos.length}`}
                    >
                      <Image
                        src={src}
                        alt={`${item.title} — photo ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/15" />
                      <div className="pointer-events-none absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-cream/90 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                        <Maximize2 className="size-3.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox plein écran */}
      <Dialog
        open={lightbox !== null}
        onOpenChange={(open) => {
          if (!open) setLightbox(null);
        }}
      >
        <DialogContent
          className="flex h-[100dvh] w-screen max-w-none items-center justify-center gap-0 border-0 bg-ink/95 p-0 ring-0 sm:rounded-none"
          showCloseButton={false}
        >
          {item && lightbox !== null && photos[lightbox] && (
            <>
              <DialogTitle className="sr-only">
                {item.title} — photo {lightbox + 1} sur {photos.length}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Visualiseur plein écran. Utilise les flèches du clavier pour
                naviguer.
              </DialogDescription>

              <div className="relative flex h-full w-full items-center justify-center px-4 py-16 sm:px-16 sm:py-12">
                <Image
                  src={photos[lightbox]}
                  alt={`${item.title} — photo ${lightbox + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur transition hover:bg-cream/20 sm:right-6 sm:top-6"
                aria-label="Fermer le visualiseur"
              >
                <X className="size-5" />
              </button>

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={lightboxPrev}
                    className="absolute left-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur transition hover:bg-cream/20 sm:left-6"
                    aria-label="Photo précédente"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={lightboxNext}
                    className="absolute right-2 top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream backdrop-blur transition hover:bg-cream/20 sm:right-6"
                    aria-label="Photo suivante"
                  >
                    <ChevronRight className="size-6" />
                  </button>

                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-3 py-1 font-mono text-[11px] tabular-nums text-cream backdrop-blur">
                    {lightbox + 1} / {photos.length}
                  </div>
                </>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
