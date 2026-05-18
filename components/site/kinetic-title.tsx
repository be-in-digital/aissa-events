"use client";

import { Fragment, useId, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

type Token =
  | { kind: "space"; text: string }
  | { kind: "word"; text: string; italic: boolean }
  | { kind: "break" };

type Props = {
  text: string;
  /** Classe appliquée aux mots `_italique_` (généralement bordeaux). */
  italicClassName?: string;
  /** Durée de révélation d'un mot. */
  wordDuration?: number;
  /** Décalage entre deux mots successifs. */
  stagger?: number;
  /** Délai global avant le démarrage de la cascade. */
  delay?: number;
  /** Active le tracé SVG sous le premier mot italique de chaque ligne. */
  underline?: boolean;
};

/**
 * Titre hero kinetic. Découpe le texte en mots, anime chaque mot via un
 * mask `clip-path` (révélation verticale, "slot machine"), puis trace un
 * underline SVG hand-drawn sous le premier mot italique de la ligne après
 * la fin de la cascade.
 *
 * Respecte automatiquement `prefers-reduced-motion` : dégrade en simple
 * opacity fade, sans transformation ni tracé.
 *
 * Markup attendu : `_italique_` pour les mots à styler en bordeaux, `\n`
 * pour les sauts de ligne. Conventions cohérentes avec `renderInlineItalic`.
 */
export function KineticTitle({
  text,
  italicClassName = "font-normal italic text-bordeaux",
  wordDuration = 0.7,
  stagger = 0.07,
  delay = 0.15,
  underline = true,
}: Props) {
  const tokens = useMemo(() => tokenize(text), [text]);
  const reduced = useReducedMotion();
  const id = useId();

  // Index global du mot (pour le stagger) et map du premier mot italique
  // par ligne (pour déclencher l'underline une seule fois par ligne).
  const meta = useMemo(() => buildMeta(tokens), [tokens]);

  if (reduced) {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="block"
      >
        {tokens.map((tok, i) =>
          tok.kind === "break" ? (
            <br key={i} />
          ) : tok.kind === "space" ? (
            <Fragment key={i}>{tok.text}</Fragment>
          ) : tok.italic ? (
            <em key={i} className={italicClassName} style={{ fontWeight: 400 }}>
              {tok.text}
            </em>
          ) : (
            <Fragment key={i}>{tok.text}</Fragment>
          ),
        )}
      </motion.span>
    );
  }

  return (
    <span className="inline">
      {tokens.map((tok, i) => {
        if (tok.kind === "break") return <br key={`${id}-${i}`} />;
        if (tok.kind === "space")
          return <Fragment key={`${id}-${i}`}>{tok.text}</Fragment>;

        const wordIndex = meta.wordIndexByToken.get(i) ?? 0;
        const wordDelay = delay + wordIndex * stagger;
        const isUnderlined =
          underline && tok.italic && meta.underlineTokenIndices.has(i);
        const underlineDelay =
          wordDelay + wordDuration + 0.05 + Math.min(wordIndex * 0.02, 0.2);

        return (
          <KineticWord
            key={`${id}-${i}`}
            text={tok.text}
            italic={tok.italic}
            italicClassName={italicClassName}
            duration={wordDuration}
            delay={wordDelay}
            underline={isUnderlined}
            underlineDelay={underlineDelay}
          />
        );
      })}
    </span>
  );
}

function KineticWord({
  text,
  italic,
  italicClassName,
  duration,
  delay,
  underline,
  underlineDelay,
}: {
  text: string;
  italic: boolean;
  italicClassName: string;
  duration: number;
  delay: number;
  underline: boolean;
  underlineDelay: number;
}) {
  const inner = (
    <motion.span
      initial={{ y: "110%" }}
      animate={{ y: "0%" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="inline-block"
      style={{ willChange: "transform" }}
    >
      {text}
    </motion.span>
  );

  // Wrapper inline-block avec `overflow: hidden` pour produire le masque de
  // révélation verticale. `pb-[0.15em]` évite que les descendants (j, g, p)
  // se fassent couper par le mask.
  const wordSpan = italic ? (
    <em
      className={`relative inline-flex overflow-hidden pb-[0.12em] ${italicClassName}`}
      style={{ fontWeight: 400 }}
    >
      {inner}
      {underline && <HandDrawnUnderline delay={underlineDelay} />}
    </em>
  ) : (
    <span className="relative inline-flex overflow-hidden pb-[0.12em]">
      {inner}
    </span>
  );

  return wordSpan;
}

function HandDrawnUnderline({ delay }: { delay: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-[0.05em] left-0 h-[0.18em] w-full overflow-visible"
    >
      <motion.path
        d="M 1 5 Q 22 1, 45 4 T 99 4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.85, delay, ease: [0.65, 0, 0.35, 1] },
          opacity: { duration: 0.2, delay },
        }}
        style={{ opacity: 0.85 }}
      />
    </svg>
  );
}

/**
 * Découpe le texte en tokens (mots, espaces, sauts de ligne) tout en
 * préservant les marqueurs `_italique_`.
 */
function tokenize(input: string): Token[] {
  if (!input) return [];
  const out: Token[] = [];

  for (const line of input.split("\n").map((l, i, arr) => ({ line: l, isLast: i === arr.length - 1 }))) {
    // Découpe la ligne en segments italique / non-italique.
    const segments = line.line.split(/(_[^_]+_)/g).filter(Boolean);
    for (const seg of segments) {
      const isItalic =
        seg.startsWith("_") && seg.endsWith("_") && seg.length >= 3;
      const text = isItalic ? seg.slice(1, -1) : seg;
      // Split mot/espace en gardant les espaces comme tokens propres.
      const parts = text.split(/(\s+)/).filter(Boolean);
      for (const p of parts) {
        if (/^\s+$/.test(p)) {
          out.push({ kind: "space", text: p });
        } else {
          out.push({ kind: "word", text: p, italic: isItalic });
        }
      }
    }
    if (!line.isLast) out.push({ kind: "break" });
  }

  return out;
}

function buildMeta(tokens: Token[]) {
  const wordIndexByToken = new Map<number, number>();
  const underlineTokenIndices = new Set<number>();
  let wordIdx = 0;
  let lineHasUnderline = false;

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    if (tok.kind === "break") {
      lineHasUnderline = false;
      continue;
    }
    if (tok.kind === "word") {
      wordIndexByToken.set(i, wordIdx++);
      if (tok.italic && !lineHasUnderline) {
        underlineTokenIndices.add(i);
        lineHasUnderline = true;
      }
    }
  }

  return { wordIndexByToken, underlineTokenIndices };
}
