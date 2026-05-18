import "server-only";

import { judgeAiLikelihood } from "./detect-ai-judge";
import { detectWithGptzero } from "./detect-ai-gptzero";

/**
 * Couche 5 (orchestration) — Détecteur IA unifié.
 *
 * Stratégie :
 * 1. Si GPTZERO_API_KEY est configuré, appel GPTZero (vrai détecteur, cohérent
 *    avec ce que l'utilisateur final voit s'il copie-colle sur gptzero.me).
 * 2. Sinon (ou si GPTZero échoue), fallback sur judgeAiLikelihood (GPT-4o-as-judge,
 *    moins fiable mais gratuit via l'AI Gateway existant).
 *
 * Retourne null si aucun détecteur n'est disponible (le pipeline accepte alors
 * la dernière version humanisée sans boucle de validation).
 */

export interface DetectionResult {
  /** Score 0-100 normalisé. Plus haut = plus probable IA. */
  aiScore: number;
  /** Justification courte pour affichage UI. */
  reasoning: string;
  /** Patterns / phrases suspectes pour cibler la réécriture agressive. */
  suspectPatterns: string[];
  /** Détecteur qui a fourni le score (« gptzero » ou « gpt-4o-judge »). */
  detector: "gptzero" | "gpt-4o-judge";
}

export async function detectAi(text: string): Promise<DetectionResult | null> {
  // 1. GPTZero (priorité)
  const gptzero = await detectWithGptzero(text);
  if (gptzero) {
    return {
      aiScore: gptzero.aiScore,
      reasoning: gptzero.reasoning,
      suspectPatterns: gptzero.suspectSentences,
      detector: "gptzero",
    };
  }

  // 2. GPT-4o-as-judge (fallback)
  const judge = await judgeAiLikelihood(text);
  if (judge) {
    return {
      aiScore: judge.aiScore,
      reasoning: judge.reasoning,
      suspectPatterns: judge.suspectPatterns,
      detector: "gpt-4o-judge",
    };
  }

  return null;
}
