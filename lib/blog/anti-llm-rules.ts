/**
 * Règles anti-LLM-markers — constantes partagées par :
 * - le prompt système (instructions à l'IA)
 * - le post-processing déterministe (couche 2)
 * - la critique-IA (couche 3)
 *
 * Source : audit copywriting mai 2026 (159 em-dashes, 42 italiques, métaphores hallmark)
 * + state of the art détection IA 2026.
 */

/** Transitions creuses typiques des LLM. */
export const BANNED_TRANSITIONS = [
  "il est important de noter que",
  "il est important de souligner",
  "il est essentiel de",
  "il est crucial de",
  "il convient de noter",
  "il convient de souligner",
  "par ailleurs",
  "en outre",
  "de plus,",
  "cela étant",
  "ceci étant",
  "force est de constater",
  "n'oublions pas que",
  "n'oubliez pas que",
  "gardez à l'esprit",
  "il faut garder à l'esprit",
  "d'une part",
  "d'autre part",
  "en somme",
  "en définitive",
  "pour résumer",
] as const;

/** Métaphores « hallmark » à exclure absolument. */
export const BANNED_METAPHORS = [
  "tisser des moments",
  "tisser des souvenirs",
  "façonner des souvenirs",
  "façonner des moments",
  "orchestrer une symphonie",
  "une symphonie de",
  "une danse délicate",
  "un voyage émotionnel",
  "un voyage initiatique",
  "une parenthèse enchantée",
  "un moment magique",
  "magie pure",
  "féerie",
  "féerique",
  "un véritable conte de fées",
  "transformer en conte de fées",
] as const;

/** Clichés agence événementielle. */
export const BANNED_CLICHES = [
  "sur-mesure",
  "sur mesure",
  "clé en main",
  "expérience inoubliable",
  "moment inoubliable",
  "souvenir inoubliable",
  "moment unique",
  "moment exceptionnel",
  "une expérience client",
  "parcours client",
  "un véritable",
  "une véritable",
] as const;

/** Openers IA-typiques en début de paragraphe/phrase à éviter. */
export const BANNED_OPENERS = [
  "Ce qui compte vraiment",
  "Ce qui compte, c'est",
  "Honnêtement,",
  "Franchement,",
  "Au-delà de",
  "Au-delà des",
  "Et c'est exactement",
  "Et c'est précisément",
  "En réalité,",
  "En vérité,",
  "Soyons honnêtes",
  "Soyons clairs",
  "Vous l'aurez compris",
  "Vous le savez",
  "Imaginez",
  "Imaginons",
  "Plongeons",
  "Découvrons",
  "Explorons",
  // Patterns Claude Haiku spécifiquement détectés par GPTZero :
  "Vous n'imaginez pas",
  "Vous ne savez pas",
  "Vous serez surpris",
  "Beaucoup de couples",
  "Beaucoup de fiancés",
  "Beaucoup de gens",
  "Bon nombre de",
  "Nombreux sont",
] as const;

/**
 * Structures syntaxiques Claude-typiques (patterns détectés par GPTZero
 * même quand la burstiness rythmique est correcte). Ces structures sont
 * sa signature statistique : tokens trop prévisibles.
 */
export const BANNED_STRUCTURES = [
  // "Pas X, juste Y" — pattern de précision Claude
  /\bPas (?:des |de |un[e]? |l[ae] )[^.,;:]{3,40},\s+juste\b/gi,
  // "Mais si X, on Y" — conditionnelle Claude
  /\bMais si vous [^.,;:]{5,80},\s+on\b/gi,
  // "Vous n'imaginez pas le nombre de fois où..."
  /\bVous n'imaginez pas\b/gi,
  // "ça change tout" / "ça change complètement"
  /\bça change (?:tout|complètement)\b/gi,
  // "C'est ce qui fait..." / "C'est ce qui change..."
  /\bC'est ce qui (?:fait|change|compte|fera)\b/gi,
  // "Ce qui fait toute la différence" / similaire
  /\b(?:fait|font)\s+toute(?:s)?\s+la\s+différence\b/gi,
] as const;

/** Remplaçables (terme LLM → alternative naturelle). Utilisé par le post-processing. */
export const SOFT_REPLACEMENTS: Array<[RegExp, string]> = [
  // « De plus » en début de phrase → suppression ou « Et »
  [/^De plus,\s+/gm, ""],
  [/\bDe plus,\s+/g, ""],
  // « En outre » → suppression
  [/^En outre,\s+/gm, ""],
  [/\bEn outre,\s+/g, ""],
  // « Par ailleurs » → suppression
  [/^Par ailleurs,\s+/gm, ""],
  [/\bPar ailleurs,\s+/g, ""],
  // « Il est important de noter que » → suppression
  [/\bIl est important de noter qu['e]\s*/gi, ""],
  [/\bIl convient de (?:noter|souligner) qu['e]\s*/gi, ""],
];

/** Liste lisible (utilisée dans le system prompt). */
export const BANNED_LIST_FOR_PROMPT = `
TRANSITIONS À BANNIR :
${BANNED_TRANSITIONS.map((t) => `- « ${t} »`).join("\n")}

MÉTAPHORES HALLMARK À EXCLURE :
${BANNED_METAPHORS.map((m) => `- « ${m} »`).join("\n")}

CLICHÉS AGENCE À ÉVITER :
${BANNED_CLICHES.map((c) => `- « ${c} »`).join("\n")}

OPENERS IA-TYPIQUES À ÉVITER EN DÉBUT DE PARAGRAPHE/PHRASE :
${BANNED_OPENERS.map((o) => `- « ${o} »`).join("\n")}
`.trim();

/** Em-dash décoratif — interdit dans le texte généré (sauf cas rare justifié). */
export const EM_DASH_REGEX = /—/g;

/** Détecte un usage suspect d'italique markdown (`*mot*` non lié à un titre d'œuvre). */
export const SUSPECT_ITALIC_REGEX = /\*([^\s*][^*]{0,60}[^\s*])\*/g;
