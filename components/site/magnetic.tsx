"use client";

import {
  useRef,
  useState,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

type Props = {
  children: ReactNode;
  /** Intensité d'attraction (0 = aucun, 1 = suivi exact). 0.25 = sensation
   *  premium discrète. */
  strength?: number;
  /** Active le ripple au clic. */
  ripple?: boolean;
  /** Couleur du ripple (CSS color). Par défaut une teinte cream translucide. */
  rippleColor?: string;
  className?: string;
};

/**
 * Wrapper magnetic : l'enfant suit légèrement le curseur en survol, puis
 * rejoint sa position d'origine via spring quand la souris quitte la zone.
 * Optionnellement, déclenche un ripple radial au clic.
 *
 * Respecte `prefers-reduced-motion` : retourne l'enfant nu sans transform
 * ni ripple. Le pointer-event est désactivé sur écrans tactiles via
 * `@media (hover: none)` côté CSS — utilité nulle sans souris.
 */
export function Magnetic({
  children,
  strength = 0.25,
  ripple = true,
  rippleColor = "rgba(253, 247, 235, 0.55)",
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xs = useSpring(x, { stiffness: 240, damping: 22, mass: 0.5 });
  const ys = useSpring(y, { stiffness: 240, damping: 22, mass: 0.5 });
  const reduced = useReducedMotion();

  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number; size: number }>
  >([]);

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  const handleMove = (e: ReactMouseEvent<HTMLSpanElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: ReactMouseEvent<HTMLSpanElement>) => {
    if (!ripple) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2.2;
    const id = Date.now() + Math.random();
    setRipples((rs) => [...rs, { id, x: px, y: py, size }]);
    window.setTimeout(() => {
      setRipples((rs) => rs.filter((r) => r.id !== id));
    }, 700);
  };

  return (
    <motion.span
      ref={ref}
      style={{ x: xs, y: ys, display: "inline-block" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
      className={className}
    >
      <span className="relative inline-block overflow-hidden rounded-full">
        {children}
        {ripple && (
          <AnimatePresence>
            {ripples.map((r) => (
              <motion.span
                key={r.id}
                aria-hidden
                initial={{ scale: 0, opacity: 0.55 }}
                animate={{ scale: 1, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  left: r.x - r.size / 2,
                  top: r.y - r.size / 2,
                  width: r.size,
                  height: r.size,
                  borderRadius: "9999px",
                  background: rippleColor,
                  pointerEvents: "none",
                }}
              />
            ))}
          </AnimatePresence>
        )}
      </span>
    </motion.span>
  );
}
