import "server-only";

import { generateText } from "ai";

/**
 * Couche 4 — Pass de "déhumanisation cross-modèle".
 *
 * Pourquoi : les couches 1-3 utilisent Claude. Même avec un prompt parfait,
 * Claude conserve sa signature statistique (distribution de vocabulaire, rythme
 * de phrases, structures parallèles type « X, Y, Z »). GPTZero / Originality.ai
 * détectent cette signature avec >90% de confiance.
 *
 * Solution : passer le texte par UN AUTRE FAMILLE DE MODÈLE pour casser la
 * signature. Gemini et GPT-4 ont des architectures et des données d'entraînement
 * différentes — la sortie réécrite mélange leurs deux signatures, brouillant
 * suffisamment pour réduire significativement le score IA.
 *
 * On essaie plusieurs modèles en cascade (chacun différent de Claude). Le
 * premier qui répond passe. Si tous échouent, on garde le texte d'entrée
 * (best-effort).
 */

const HUMANIZER_MODEL_CHAIN = [
  "google/gemini-2.5-flash",
  "openai/gpt-4o-mini",
  "openai/gpt-4o",
];

const HUMANIZER_SYSTEM = `Tu es un éditeur littéraire qui retouche des textes pour qu'ils sonnent humain. Ta seule mission est de casser la signature statistique d'un texte généré par IA, en préservant exactement son sens et sa structure.

Tu ne juges pas le contenu, tu ne reformules pas les idées, tu ne corriges pas. Tu casses le RYTHME et la PRÉDICTIBILITÉ.`;

function buildHumanizerPrompt(markdown: string): string {
  return `Réécris le markdown ci-dessous en respectant ces règles ABSOLUES :

═══════════════════════════════════════
PRÉSERVATION OBLIGATOIRE
═══════════════════════════════════════
- Préserve EXACTEMENT le sens, les chiffres, les noms de lieux, les détails concrets
- Préserve EXACTEMENT la structure markdown : titres ## H2 et ### H3 inchangés, mêmes paragraphes, mêmes listes
- Préserve le vouvoiement et le ton de la narratrice
- N'INVENTE rien, ne SUPPRIME aucun détail factuel

═══════════════════════════════════════
CASSAGE DE RYTHME (anti-signature IA)
═══════════════════════════════════════
- Varie BRUTALEMENT la longueur des phrases : alterne phrases de 3-5 mots et phrases de 25-35 mots dans le même paragraphe
- Varie la longueur des paragraphes : certains très courts (1 phrase seule), d'autres longs
- BANNIS les structures parallèles à 3 termes type « X, Y, et Z » : transforme-les en « X. Aussi Y. Et parfois Z. »
- BANNIS les triades rhétoriques (« vos envies, vos contraintes, vos doutes ») : casse en phrases séparées
- BANNIS les openers IA archi-reconnaissables : « Ce qui compte vraiment, c'est », « Honnêtement, », « Et c'est exactement », « Au-delà de », « Si X, alors Y » répété
- Varie les attaques de paragraphes : pas tous qui démarrent par « Si », « Quand », « Ce qui », « Pour »
- Si tu repères une phrase trop bien équilibrée (rythme parfait, sous-clauses symétriques), CASSE-la

═══════════════════════════════════════
INJECTION HUMAINE (parcimonieuse)
═══════════════════════════════════════
- Insère 1 ou 2 marqueurs oraux PAR SECTION (pas par paragraphe) : « franchement », « en fait », « bon », « à vrai dire », « honnêtement », « tiens »
- Une ou deux parenthèses orales par section, avec pensée secondaire : « (et ça arrive plus souvent qu'on pense) »
- Autorise des phrases qui démarrent par « Et » ou « Mais »
- Autorise un faux départ rare : « Non, en fait, » ou « Enfin, je veux dire, »
- Autorise des virgules d'enrobage : « Vous savez, »
- NE SURCHARGE PAS : trop d'oralité = autre signature détectable. Maximum 3-4 insertions humaines par section.

═══════════════════════════════════════
INTERDICTIONS DURES
═══════════════════════════════════════
- Aucun em-dash (—). Utilise virgule, point, parenthèse, deux-points.
- Aucun italique décoratif. Italiques réservés aux titres d'œuvres ou termes étrangers.
- Aucune mention « réécrit par IA » ou note d'éditeur.
- Aucun préambule (pas de « Voici la version réécrite »).

═══════════════════════════════════════
EN SORTIE
═══════════════════════════════════════
UNIQUEMENT le markdown réécrit, rien d'autre.

═══════════════════════════════════════
TEXTE À RÉÉCRIRE
═══════════════════════════════════════

${markdown}`;
}

export interface HumanizePassResult {
  /** Texte humanisé (ou texte d'entrée si tous les modèles ont échoué). */
  text: string;
  /** Modèle qui a réussi, null si tous ont échoué. */
  modelUsed: string | null;
  /** Erreur globale si pertinente. */
  error?: string;
}

interface HumanizeOptions {
  /**
   * Sévérité de la réécriture (1 = standard, 2-3 = de plus en plus agressif).
   * Utilisé pour les retries après un score IA jugé trop élevé.
   */
  severity?: 1 | 2 | 3;
  /** Score IA du judge sur la version précédente (pour contextualiser). */
  previousAiScore?: number;
  /** Patterns suspects identifiés par le judge (pour cibler la réécriture). */
  suspectPatterns?: string[];
}

function buildAggressivePrompt(
  markdown: string,
  opts: HumanizeOptions,
): string {
  const severity = opts.severity ?? 1;
  if (severity === 1) return buildHumanizerPrompt(markdown);

  const intensityLine =
    severity === 2
      ? "Le texte précédent SONNAIT ENCORE IA. Tu dois être PLUS BRUTAL."
      : "Le texte précédent reste détecté comme IA. C'est ta DERNIÈRE chance. Sois extrême.";

  const patternsBlock =
    opts.suspectPatterns && opts.suspectPatterns.length > 0
      ? `\n\nPATTERNS SPÉCIFIQUES À CASSER (identifiés par le détecteur) :\n${opts.suspectPatterns.map((p) => `- ${p}`).join("\n")}`
      : "";

  const scoreLine =
    typeof opts.previousAiScore === "number"
      ? `Le texte précédent scorait ${opts.previousAiScore}/100 IA (objectif : < 30).`
      : "";

  return `${intensityLine}
${scoreLine}

Réécris le markdown ci-dessous en respectant ces règles ABSOLUES :

═══════════════════════════════════════
PRÉSERVATION OBLIGATOIRE
═══════════════════════════════════════
- Préserve EXACTEMENT le sens, les chiffres, les noms de lieux, les détails concrets
- Préserve EXACTEMENT la structure markdown (## H2, ### H3)
- Préserve le vouvoiement
- N'invente RIEN, ne supprime aucun fait

═══════════════════════════════════════
RÉÉCRITURE AGRESSIVE (mode sévérité ${severity}/3)
═══════════════════════════════════════
- DÉTRUIS toutes les triades parallèles. Si tu vois « X, Y, Z », casse en 2-3 phrases distinctes.
- CASSE chaque paragraphe avec AU MOINS UN fragment isolé (1-3 mots ponctués) : « Vraiment. », « Voilà. », « Comme ça. », « C'est tout. »
- INSÈRE 1 ou 2 marqueurs oraux PAR PARAGRAPHE (pas juste par section) : « bon », « franchement », « en fait », « tiens », « à vrai dire »
- ALTERNE BRUTALEMENT phrases courtes (3-6 mots) et phrases longues (25-35 mots) — AUCUN paragraphe ne doit avoir un rythme régulier
- COMMENCE certains paragraphes par « Et », « Mais », « Bon »
- INSÈRE au moins 1 parenthèse orale par section avec pensée secondaire (« et ça arrive plus souvent qu'on pense »)
- VARIE les attaques de phrases : ban total de « Si X », « Quand X », « Ce qui X » comme opener systématique
- AJOUTE 1 ou 2 faux départs par section : « Non, plutôt », « Enfin, je veux dire »
- SI tu sens qu'une phrase est "trop bien tournée", massacre-la délibérément (split, démarrer par "Et", insérer une virgule en plus)

═══════════════════════════════════════
INTERDICTIONS DURES
═══════════════════════════════════════
- Aucun em-dash (—). Ban total.
- Aucun italique décoratif. Italiques OK uniquement pour titres d'œuvres / termes étrangers (mehndi).
- Aucun préambule, aucune note d'éditeur.

${patternsBlock}

═══════════════════════════════════════
EN SORTIE
═══════════════════════════════════════
UNIQUEMENT le markdown réécrit. Rien d'autre.

═══════════════════════════════════════
TEXTE À RÉÉCRIRE
═══════════════════════════════════════

${markdown}`;
}

export async function humanizePass(
  markdown: string,
  opts: HumanizeOptions = {},
): Promise<HumanizePassResult> {
  const input = markdown.trim();
  if (!input) {
    return { text: markdown, modelUsed: null, error: "Texte d'entrée vide" };
  }

  const prompt = buildAggressivePrompt(input, opts);
  const failures: Array<{ model: string; error: unknown }> = [];

  for (const model of HUMANIZER_MODEL_CHAIN) {
    try {
      const result = await generateText({
        model,
        system: HUMANIZER_SYSTEM,
        prompt,
      });
      const out = result.text?.trim();
      if (!out) {
        failures.push({ model, error: new Error("réponse vide") });
        continue;
      }
      // Garde-fou : si la sortie est suspectement courte (< 50% de l'entrée),
      // c'est probablement un refus ou une troncature. On rejette.
      if (out.length < input.length * 0.5) {
        failures.push({ model, error: new Error(`sortie trop courte (${out.length} vs ${input.length})`) });
        continue;
      }
      return { text: out, modelUsed: model };
    } catch (err) {
      failures.push({ model, error: err });
      console.warn(`[humanize-pass] ${model} a échoué :`, err);
    }
  }

  console.error(
    "[humanize-pass] tous les modèles ont échoué :",
    failures.map((f) => `${f.model}: ${f.error instanceof Error ? f.error.message : String(f.error)}`),
  );
  return {
    text: markdown,
    modelUsed: null,
    error: `Aucun modèle humanizer disponible (${HUMANIZER_MODEL_CHAIN.join(", ")})`,
  };
}
