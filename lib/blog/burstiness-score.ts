import "server-only";

import {
  BANNED_CLICHES,
  BANNED_METAPHORS,
  BANNED_OPENERS,
  BANNED_TRANSITIONS,
} from "./anti-llm-rules";

/**
 * Score local « burstiness » — détecteur IA gratuit, déterministe.
 *
 * Ce n'est PAS un substitut à GPTZero : c'est un signal interne qui mesure la
 * conformité du texte aux patterns observés dans le copy humain réel d'Aïssa
 * (variance rythmique, densité de détails concrets, présence de parenthèses-
 * aparté, absence de marqueurs IA flagrants).
 *
 * Sert à :
 *   - donner un feedback rapide dans le wizard (« 28/100 — pas mal »)
 *   - exposer des phrases suspectes pour relecture ciblée
 *   - permettre une logique de re-roll côté UI si le score est mauvais
 *
 * Score 0-100. Plus bas = plus humain.
 */

export interface BurstinessReport {
  /** Score 0-100. Plus haut = plus IA-typique. */
  aiScore: number;
  /** Justification courte (pour affichage UI). */
  reasoning: string;
  /** Métriques détaillées (debug / dev). */
  metrics: {
    sentenceCount: number;
    avgWords: number;
    stddevWords: number;
    /** stddev / mean — > 0.5 humain, < 0.3 IA-typique. */
    burstiness: number;
    /** unique / total words — > 0.6 humain. */
    lexicalDiversity: number;
    /** Détails concrets par phrase (chiffres, lieux, mesures). */
    concreteDensity: number;
    /** Nombre de parenthèses-aparté (signe humain). */
    parenthesisCount: number;
    /** Nombre d'aveux honnêtes / marqueurs oraux ("on a fini par", "ça arrive"…). */
    honestAdmissionCount: number;
    bannedOpenerCount: number;
    bannedTransitionCount: number;
    bannedClicheCount: number;
  };
  /** Phrases dont la longueur est typiquement IA (15-22 mots) sans détail concret. */
  suspectSentences: string[];
}

/** Compte combien d'occurrences de `needles` apparaissent dans `text` (case-insensitive). */
function countOf(text: string, needles: readonly string[]): number {
  const lower = text.toLowerCase();
  return needles.reduce((acc, n) => {
    const esc = n.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matches = lower.match(new RegExp(esc, "g"));
    return acc + (matches?.length ?? 0);
  }, 0);
}

/**
 * Repère les indices de concreteness : chiffres, unités, lieux, prestataires,
 * objets matériels, vocabulaire métier événementiel.
 * Liste calibrée pour Aïssa Events (Émerainville, IDF, mariages multi-cultes).
 */
const CONCRETE_REGEX = new RegExp(
  [
    // Chiffres + unités
    /\b\d+(?:[.,]\d+)?\s*(?:€|euros?|m²|m2|min|h\b|heures?|mois|jours?|ans?|personnes?|invités?|km|%|kg|cl|ml)\b/.source,
    // Horaires
    /\b\d{1,2}h\d{0,2}\b/.source,
    // Chiffres « écrits »
    /\b(?:cinq|dix|vingt|trente|quarante|cinquante|soixante|cent|cents|mille)\s+(?:euros?|personnes?|invités?|mois|jours?|ans?|minutes?|heures?|mariages?|événements?)\b/.source,
    // Lieux / transports IDF
    /\b(?:RER\s*[A-E]?|métro|TGV|Émerainville|Marne-la-Vallée|Bussy-Saint-Georges|Champs-sur-Marne|Noisiel|Lognes|Disneyland|Paris|Île-de-France|IDF|Seine-et-Marne|77|A4|A86|A104)\b/.source,
    // Métiers / prestataires
    /\b(?:traiteur|fleuriste|photographe|vidéaste|graphiste|DJ|officiant|wedding\s*planner|coordinatrice|maquilleuse|coiffeur|scénographe|décorateur)\b/i.source,
    // Marques / outils
    /\b(?:Chaises?\s+Napol[eé]on|JBL|Bose|Wedgwood|Tiffany|Christofle|Google\s+Sheet|WhatsApp|Calendly|Instagram|Pinterest|Spotify|YouTube)\b/.source,
    // Cérémonies / traditions (nommables)
    /\b(?:henn[eé]|nikah|mehndi|sangeet|civil|laïque|laïque|baptême|baby\s*shower|EVJF|EVG|kasher|casher|halal|végétarien|fiançailles)\b/i.source,
    // Objets matériels d'événementiel
    /\b(?:lanternes?|bougeoirs?|chandeliers?|drapés?|tapis|arche|gobos?|projecteurs?|sono|enceintes?|micros?|estrade|tribune|nappes?|porcelaine|verres?|couverts?|mobilier|vaisselle|chaises?|tables?|tentes?|chapiteaux?|plateaux?|fleurs?|bouquet|composition|guirlandes?|néons?)\b/i.source,
    // Cuisine / traiteur (objets concrets)
    /\b(?:cocktail|vin\s+d'honneur|brunch|dîner|buffet|tapas|amuse-bouches?|petits\s+fours?|gâteau|wedding\s+cake|pièce\s+montée|champagne|crémant|service\s+(?:traiteur|à\s+table))\b/i.source,
    // Lieux d'événements
    /\b(?:château|domaine|loft|grange|salle|verrière|terrasse|jardin|chapiteau|tente|orangerie|barnum)\b/i.source,
    // Marqueurs temporels précis
    /\b(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|matin|après-midi|soir|nuit|midi|veille|lendemain)\b/i.source,
  ].join("|"),
  "gi",
);

/**
 * Marqueurs d'aveux honnêtes anti-marketing. Présence = bonus humain.
 */
const HONEST_ADMISSION_REGEX =
  /\b(?:on a fini par|on a appris|ça arrive|en vrai|à vrai dire|honnêtement entre nous|on s'est planté|c'est rare|en fait|parce que|parfois|souvent|jamais|toujours|on en a vu|on a tous)\b/gi;

export function scoreBurstiness(text: string): BurstinessReport {
  // Strip markdown (titres, emphases, liens) pour ne pas biaiser le compte.
  const stripped = text
    .replace(/^#+\s.*$/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .trim();

  // Split en phrases (heuristique simple : . ! ? + espace).
  const sentences = stripped
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  // Compte des mots par phrase.
  const wordCounts = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
  const totalWords = wordCounts.reduce((a, b) => a + b, 0);
  const avgWords = totalWords / Math.max(1, sentences.length);
  const variance =
    wordCounts.reduce((a, w) => a + (w - avgWords) ** 2, 0) / Math.max(1, sentences.length);
  const stddevWords = Math.sqrt(variance);
  const burstiness = avgWords > 0 ? stddevWords / avgWords : 0;

  // Diversité lexicale.
  const allWords = stripped.toLowerCase().split(/[\s,;:.!?()«»"'’]+/).filter(Boolean);
  const uniqueWords = new Set(allWords);
  const lexicalDiversity = allWords.length > 0 ? uniqueWords.size / allWords.length : 0;

  // Densité de concreteness.
  const concreteMatches = stripped.match(CONCRETE_REGEX) ?? [];
  const concreteDensity =
    sentences.length > 0 ? concreteMatches.length / sentences.length : 0;

  // Parenthèses-aparté (longueur > 5 chars pour exclure les « (1) »).
  const parenthesisCount = (stripped.match(/\([^)]{5,}\)/g) ?? []).length;

  // Aveux honnêtes (bonus humain).
  const honestAdmissionCount = (stripped.match(HONEST_ADMISSION_REGEX) ?? []).length;

  // Marqueurs IA résiduels.
  const bannedOpenerCount = countOf(stripped, BANNED_OPENERS);
  const bannedTransitionCount = countOf(stripped, BANNED_TRANSITIONS);
  const bannedClicheCount =
    countOf(stripped, BANNED_CLICHES) + countOf(stripped, BANNED_METAPHORS);

  // Composition du score.
  let score = 50;

  // Burstiness rythmique.
  if (burstiness >= 0.6) score -= 25;
  else if (burstiness >= 0.4) score -= 10;
  else if (burstiness < 0.3) score += 20;

  // Diversité lexicale.
  if (lexicalDiversity >= 0.65) score -= 10;
  else if (lexicalDiversity >= 0.55) score -= 5;
  else if (lexicalDiversity < 0.4) score += 15;

  // Densité de détails concrets.
  if (concreteDensity >= 1) score -= 15;
  else if (concreteDensity >= 0.5) score -= 10;
  else if (concreteDensity < 0.2) score += 10;

  // Parenthèses-aparté.
  if (parenthesisCount >= 2) score -= 10;
  else if (parenthesisCount >= 1) score -= 5;
  else score += 5;

  // Aveux honnêtes anti-marketing (bonus humain).
  if (honestAdmissionCount >= 3) score -= 12;
  else if (honestAdmissionCount >= 1) score -= 6;

  // Pondération pour petites sections (< 4 phrases) : on lisse la pénalité de
  // burstiness, car avec 2-3 phrases la variance est mathématiquement bornée.
  if (sentences.length <= 3 && burstiness < 0.3) score -= 10;

  // Pénalités lourdes pour marqueurs IA flagrants.
  score += bannedOpenerCount * 12;
  score += bannedTransitionCount * 8;
  score += bannedClicheCount * 10;

  score = Math.max(0, Math.min(100, Math.round(score)));

  // Phrases suspectes = longueur typique IA (14-24 mots) sans concreteness.
  const suspectSentences: string[] = [];
  for (let i = 0; i < sentences.length && suspectSentences.length < 4; i++) {
    const w = wordCounts[i];
    if (w >= 14 && w <= 24 && !CONCRETE_REGEX.test(sentences[i])) {
      suspectSentences.push(sentences[i]);
    }
    // Reset regex state (CONCRETE_REGEX a /g).
    CONCRETE_REGEX.lastIndex = 0;
  }

  const reasoning =
    `burstiness ${burstiness.toFixed(2)} · ` +
    `diversité ${lexicalDiversity.toFixed(2)} · ` +
    `${concreteDensity.toFixed(1)} détail concret/phrase · ` +
    `${parenthesisCount} parenthèse${parenthesisCount > 1 ? "s" : ""}-aparté · ` +
    `${bannedOpenerCount + bannedTransitionCount + bannedClicheCount} marqueur${
      bannedOpenerCount + bannedTransitionCount + bannedClicheCount > 1 ? "s" : ""
    } banni${
      bannedOpenerCount + bannedTransitionCount + bannedClicheCount > 1 ? "s" : ""
    }`;

  return {
    aiScore: score,
    reasoning,
    metrics: {
      sentenceCount: sentences.length,
      avgWords,
      stddevWords,
      burstiness,
      lexicalDiversity,
      concreteDensity,
      parenthesisCount,
      honestAdmissionCount,
      bannedOpenerCount,
      bannedTransitionCount,
      bannedClicheCount,
    },
    suspectSentences,
  };
}
