"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

type Props = {
  /** Texte source qui contient (au moins) un nombre — ex. "Dès 1 250 €",
   *  "2 modes", "+30 mariages / an", "12 dates encore libres en 2026". */
  value: string;
  /** Durée de l'animation, en secondes. */
  duration?: number;
  /** Délai après entrée dans le viewport, en secondes. */
  delay?: number;
  className?: string;
};

const FR_NUMBER_FORMAT = new Intl.NumberFormat("fr-FR");

/**
 * Compteur scroll-triggered : extrait le premier nombre de la string, l'anime
 * de 0 → cible quand l'élément entre dans le viewport, et préserve le reste
 * du texte (préfixes type "Dès ", suffixes type " €" ou " mariages / an").
 *
 * Si plusieurs nombres apparaissent ("12 dates encore libres en 2026"), on
 * anime UNIQUEMENT le premier — l'année "2026" reste statique, ce qui est
 * le comportement attendu pour les stats marketing.
 *
 * Respecte `prefers-reduced-motion` : affiche immédiatement la valeur finale.
 */
export function CountUp({ value, duration = 1.6, delay = 0, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = useReducedMotion();

  const match = value.match(/[\d](?:[\d \s]*\d)?/);
  // Pas de nombre détecté : on rend la string telle quelle.
  if (!match || match.index === undefined) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  const numberRaw = match[0];
  const target = parseInt(numberRaw.replace(/[ \s]/g, ""), 10);
  const before = value.slice(0, match.index);
  const after = value.slice(match.index + numberRaw.length);

  return (
    <Counter
      ref={ref}
      target={target}
      duration={duration}
      delay={delay}
      inView={inView}
      reduced={!!reduced}
      before={before}
      after={after}
      className={className}
    />
  );
}

function Counter({
  ref,
  target,
  duration,
  delay,
  inView,
  reduced,
  before,
  after,
  className,
}: {
  ref: React.RefObject<HTMLSpanElement | null>;
  target: number;
  duration: number;
  delay: number;
  inView: boolean;
  reduced: boolean;
  before: string;
  after: string;
  className?: string;
}) {
  const motionValue = useMotionValue(reduced || inView ? target : 0);
  const [display, setDisplay] = useState<string>(
    reduced ? FR_NUMBER_FORMAT.format(target) : "0",
  );

  useMotionValueEvent(motionValue, "change", (v) => {
    setDisplay(FR_NUMBER_FORMAT.format(Math.round(v)));
  });

  useEffect(() => {
    if (reduced) return;
    if (!inView) return;
    const controls = animate(motionValue, target, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, reduced, target, duration, delay, motionValue]);

  return (
    <span ref={ref} className={className}>
      {before}
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{display}</span>
      {after}
    </span>
  );
}
