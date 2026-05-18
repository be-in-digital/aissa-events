import "server-only";

import { generateText } from "ai";

import type { PostProcessingResult } from "./post-processing";

/**
 * Couche 3 — critique-IA.
 *
 * 2ème appel Claude qui audite le texte sur 4 dimensions et réécrit les
 * passages flaggés. Si la critique échoue (timeout, JSON malformé), on
 * retourne le texte d'entrée tel quel — c'est non-bloquant par design.
 *
 * Coût : ~1 appel Haiku 4.5 par section, latence ~5-15s.
 */

const CRITIC_MODEL = "anthropic/claude-haiku-4-5";

const CRITIC_SYSTEM_PROMPT = `Tu es éditeur senior chez Aïssa Events. Tu reçois un texte rédigé par un assistant et tu dois :

1. Le noter sur 4 dimensions (chacune 0-10) :
   - LLM_MARKERS : présence de marqueurs IA (em-dashes décoratifs, italiques superflus, transitions creuses « par ailleurs / en outre / il est important de », métaphores hallmark « tisser / orchestrer / voyage émotionnel », clichés agence « sur-mesure / inoubliable / magique »). 10 = aucun marqueur. 0 = saturé.
   - VARIANCE : variance de longueur des phrases. 10 = mélange équilibré court/long. 0 = rythme uniforme robotique.
   - CONCRETENESS : concrétion. 10 = détails spécifiques, chiffres, lieux, dates. 0 = généralités vides.
   - VOICE : conformité à la voix d'Aïssa (vouvoiement, ancrage local 77/IDF, ton premium-doux, zéro hyperbole). 10 = parfait. 0 = générique.

2. Si une seule note est < 7, réécrire le texte en corrigeant les défauts. Garde la même structure markdown (titres, listes), la même longueur approximative (±15%), le même message.

3. Réponds EXCLUSIVEMENT en JSON strict, sans markdown, sans texte autour :

{
  "notes": {
    "llm_markers": 0-10,
    "variance": 0-10,
    "concreteness": 0-10,
    "voice": 0-10
  },
  "rewrite_needed": true|false,
  "rewritten_text": "..."  // toujours rempli même si pas rewrite_needed (juste = texte original alors)
}

Règles strictes :
- Pas de tutoiement, jamais.
- Pas d'em-dashes décoratifs.
- Pas d'italiques superflus.
- Pas de promesses hyperboliques.
- Garde le markdown valide (titres, listes, citations).`;

export interface CritiqueResult {
  finalText: string;
  notes: {
    llmMarkers: number;
    variance: number;
    concreteness: number;
    voice: number;
  };
  wasRewritten: boolean;
  /** Si null : la critique a échoué silencieusement, on a retourné l'input. */
  error: string | null;
}

interface CriticJsonResponse {
  notes: {
    llm_markers: number;
    variance: number;
    concreteness: number;
    voice: number;
  };
  rewrite_needed: boolean;
  rewritten_text: string;
}

/**
 * Parse la réponse JSON du critique avec tolérance aux variations
 * (markdown ```json ... ```, espaces, etc.).
 */
function parseCriticResponse(raw: string): CriticJsonResponse | null {
  const trimmed = raw.trim();

  // Strip ```json ... ``` si présent
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  const candidate = fenced ? fenced[1] : trimmed;

  try {
    const parsed = JSON.parse(candidate);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.notes ||
      typeof parsed.rewritten_text !== "string"
    ) {
      return null;
    }
    return parsed as CriticJsonResponse;
  } catch {
    return null;
  }
}

export async function critiqueAndRewriteSection(args: {
  /** Texte issu de la couche 2. */
  input: string;
  /** Compteurs résiduels (pour aiguiller le critique sur les points à corriger). */
  residual: PostProcessingResult["residual"];
  /** Brand voice + règles, injecté en system supplémentaire. */
  voiceContext: string;
}): Promise<CritiqueResult> {
  const defaultResult: CritiqueResult = {
    finalText: args.input,
    notes: { llmMarkers: 0, variance: 0, concreteness: 0, voice: 0 },
    wasRewritten: false,
    error: null,
  };

  const residualHints = `Compteurs résiduels après nettoyage déterministe (à vérifier en priorité) :
- em-dashes restants : ${args.residual.emDashes}
- italiques suspects : ${args.residual.suspectItalics}
- transitions LLM résiduelles : ${args.residual.bannedTransitions}
- métaphores hallmark : ${args.residual.bannedMetaphors}
- clichés agence : ${args.residual.bannedCliches}`;

  try {
    const result = await generateText({
      model: CRITIC_MODEL,
      system: `${CRITIC_SYSTEM_PROMPT}\n\nCONTEXTE VOIX :\n${args.voiceContext.slice(0, 4000)}`,
      messages: [
        {
          role: "user",
          content: `${residualHints}\n\nTEXTE À AUDITER :\n"""\n${args.input}\n"""`,
        },
      ],
    });

    const raw = result.text?.trim();
    if (!raw) return { ...defaultResult, error: "Réponse critique vide" };

    const parsed = parseCriticResponse(raw);
    if (!parsed) return { ...defaultResult, error: "Réponse critique non parsable" };

    const notes = {
      llmMarkers: parsed.notes.llm_markers,
      variance: parsed.notes.variance,
      concreteness: parsed.notes.concreteness,
      voice: parsed.notes.voice,
    };

    return {
      finalText: parsed.rewritten_text || args.input,
      notes,
      wasRewritten: parsed.rewrite_needed === true,
      error: null,
    };
  } catch (err) {
    console.error("[critique-rewrite] échec :", err);
    return { ...defaultResult, error: err instanceof Error ? err.message : "unknown" };
  }
}
