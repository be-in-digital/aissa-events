import "server-only";

import {
  BANNED_TRANSITIONS,
  BANNED_METAPHORS,
  BANNED_CLICHES,
  SOFT_REPLACEMENTS,
  EM_DASH_REGEX,
  SUSPECT_ITALIC_REGEX,
} from "./anti-llm-rules";

/**
 * Couche 2 — post-processing déterministe.
 *
 * Applique des transformations sans appel IA pour éliminer les marqueurs LLM
 * les plus visibles et mesurer ce qui reste. Non-bloquant : si une étape
 * casse, on retourne le texte le moins transformé possible.
 *
 * Pipeline :
 *   1. Remplacement des em-dashes décoratifs
 *   2. Suppression des italiques markdown suspects
 *   3. Application des SOFT_REPLACEMENTS (transitions LLM)
 *   4. Comptage des occurrences résiduelles (pour la critique-IA en couche 3)
 */

export interface PostProcessingResult {
  /** Markdown nettoyé. */
  cleaned: string;
  /** Compteurs résiduels après nettoyage (utilisés en couche 3). */
  residual: {
    emDashes: number;
    suspectItalics: number;
    bannedTransitions: number;
    bannedMetaphors: number;
    bannedCliches: number;
  };
}

/**
 * Remplace les em-dashes par une ponctuation contextuelle :
 * - si entourés d'espaces → virgule (clause incise)
 * - sinon → tiret simple (mots composés, on garde tel quel converti en "-")
 */
function replaceEmDashes(text: string): string {
  return text.replace(EM_DASH_REGEX, (_match, offset: number, full: string) => {
    const before = full[offset - 1];
    const after = full[offset + 1];
    if (before === " " && after === " ") return ",";
    return "-";
  });
}

/** Supprime `*mot*` quand ce n'est manifestement pas un emphasis voulu. */
function stripSuspectItalics(text: string): string {
  return text.replace(SUSPECT_ITALIC_REGEX, (_match, inner: string) => {
    // Garde les italiques qui ressemblent à un titre d'œuvre (commence par majuscule + longueur > 8)
    if (inner.length > 8 && inner[0] >= "A" && inner[0] <= "Z") return `*${inner}*`;
    return inner;
  });
}

function countOccurrences(text: string, needles: readonly string[]): number {
  const lower = text.toLowerCase();
  return needles.reduce((acc, n) => {
    const escaped = n.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = lower.match(new RegExp(escaped, "g"));
    return acc + (matches ? matches.length : 0);
  }, 0);
}

export function postProcessSection(markdown: string): PostProcessingResult {
  let cleaned = markdown;

  // 1. Em-dashes
  cleaned = replaceEmDashes(cleaned);

  // 2. Italiques suspects
  cleaned = stripSuspectItalics(cleaned);

  // 3. Soft replacements (transitions LLM faciles à supprimer)
  for (const [re, replacement] of SOFT_REPLACEMENTS) {
    cleaned = cleaned.replace(re, replacement);
  }

  // 4. Nettoyage espaces multiples et doubles ponctuations
  cleaned = cleaned
    .replace(/  +/g, " ")
    .replace(/,,+/g, ",")
    .replace(/\.\.\.+/g, "…")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();

  // 5. Compte ce qui reste pour la couche 3
  const residual = {
    emDashes: (cleaned.match(EM_DASH_REGEX) ?? []).length,
    suspectItalics: (cleaned.match(SUSPECT_ITALIC_REGEX) ?? []).length,
    bannedTransitions: countOccurrences(cleaned, BANNED_TRANSITIONS),
    bannedMetaphors: countOccurrences(cleaned, BANNED_METAPHORS),
    bannedCliches: countOccurrences(cleaned, BANNED_CLICHES),
  };

  return { cleaned, residual };
}
