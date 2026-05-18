"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Amplitude de translation verticale en pourcentage de la hauteur. 0.1 =
   *  l'image bouge de ±10 % entre l'entrée et la sortie de l'écran. */
  speed?: number;
  /** Zoom à mi-parcours, en plus du scale 1.0. 0.04 = 4 % de zoom au milieu. */
  zoom?: number;
};

/**
 * Wrapper scroll-driven : translate + scale légers basés sur la progression
 * dans le viewport. Effet cinématographique sobre — utile sur les hero
 * images et les portrait/portfolio "hero".
 *
 * Désactivé automatiquement sous `prefers-reduced-motion` (return un div nu).
 *
 * Important : ce composant pose un transform sur son wrapper. S'il est posé
 * autour d'une `motion.div` qui a sa propre `initial → animate` (ex. fade-in
 * scale 0.96 → 1 sur les hero images), les deux transforms se composent —
 * le parent (parallax) reste à scale ≈ 1 au mount initial, donc l'effet de
 * l'enfant reste visible.
 */
export function Parallax({
  children,
  className,
  speed = 0.1,
  zoom = 0.04,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Translate ±(speed * 100)% sur tout le parcours.
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-speed * 100}%`, `${speed * 100}%`],
  );
  // Baseline overscan = (speed + zoom/2) pour garantir qu'il n'y ait jamais de
  // bord vide quand l'image translate. Au milieu, on pousse le zoom jusqu'à
  // 1 + speed + zoom.
  const baseScale = 1 + speed + zoom / 2;
  const peakScale = baseScale + zoom;
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [baseScale, peakScale, baseScale],
  );

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y, scale, willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
