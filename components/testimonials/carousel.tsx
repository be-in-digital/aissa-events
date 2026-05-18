"use client";

import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props<T> = {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Identifiant stable de chaque item pour l'animation (sinon `index` est utilisé). */
  itemKey?: (item: T, index: number) => string | number;
  /** Délai entre 2 transitions automatiques. Mettre 0 pour désactiver. */
  autoplayDelay?: number;
  /** Largeur max du conteneur. */
  maxWidth?: number;
  /** Label aria de la région. */
  ariaLabel?: string;
};

/**
 * Carousel auto-rotatif générique pour les sections de témoignages.
 *
 * Comportement :
 *  - 1 item visible à la fois (slide horizontal AnimatePresence)
 *  - Auto-advance, pause au hover et au focus clavier (a11y)
 *  - Flèches gauche/droite, dots, compteur live
 *  - 0 ou 1 item : pas de contrôles, affichage statique
 *  - Respecte `prefers-reduced-motion` (motion/react)
 */
export function TestimonialsCarousel<T>({
  items,
  renderItem,
  itemKey,
  autoplayDelay = 6500,
  maxWidth = 1100,
  ariaLabel = "Témoignages clients",
}: Props<T>) {
  const [rawIndex, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isPaused, setIsPaused] = useState(false);

  const count = items.length;
  const hasMultiple = count > 1;

  // Clamp côté render : si le tableau Sanity rétrécit pendant qu'on est sur
  // un index hors borne, on retombe sur 0 sans déclencher de setState.
  const index = count > 0 ? rawIndex % count : 0;

  const goTo = useCallback(
    (next: number, dir: 1 | -1) => {
      if (count === 0) return;
      setDirection(dir);
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (!hasMultiple || isPaused || autoplayDelay <= 0) return;
    const id = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % count);
    }, autoplayDelay);
    return () => clearInterval(id);
  }, [count, hasMultiple, isPaused, autoplayDelay]);

  if (count === 0) return null;

  const current = items[index];
  const key = itemKey ? itemKey(current, index) : index;

  return (
    <div
      className="relative mx-auto"
      style={{ maxWidth }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carrousel"
      aria-label={ariaLabel}
    >
      <div className="relative overflow-hidden rounded-[28px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={key}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 60 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderItem(current, index)}
          </motion.div>
        </AnimatePresence>
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Témoignage précédent"
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[var(--rule)] bg-cream/95 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-[calc(50%+2px)] hover:border-bordeaux hover:bg-bordeaux hover:text-cream lg:flex"
          >
            <ChevronLeft className="size-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Témoignage suivant"
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-[var(--rule)] bg-cream/95 p-3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-[calc(50%+2px)] hover:border-bordeaux hover:bg-bordeaux hover:text-cream lg:flex"
          >
            <ChevronRight className="size-5" strokeWidth={1.5} />
          </button>

          <div className="mt-7 flex items-center justify-center gap-4">
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  aria-label={`Aller au témoignage ${i + 1}`}
                  aria-current={i === index}
                  className={`size-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-8 bg-bordeaux"
                      : "bg-bordeaux/25 hover:bg-bordeaux/50"
                  }`}
                />
              ))}
            </div>
            <span
              aria-live="polite"
              className="ml-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink"
            >
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-2 flex justify-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={prev}
              aria-label="Témoignage précédent"
              className="rounded-full border border-[var(--rule)] bg-cream p-2.5 transition-all hover:border-bordeaux hover:bg-bordeaux hover:text-cream"
            >
              <ChevronLeft className="size-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Témoignage suivant"
              className="rounded-full border border-[var(--rule)] bg-cream p-2.5 transition-all hover:border-bordeaux hover:bg-bordeaux hover:text-cream"
            >
              <ChevronRight className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
