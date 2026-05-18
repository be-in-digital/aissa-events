import "server-only";

import { env } from "@/env";

/**
 * Couche 5 (partie 1, version GPTZero) — Vrai détecteur IA.
 *
 * Appelle l'API GPTZero v2 pour scorer un texte sur sa probabilité d'être
 * généré par IA. C'est l'outil que GPTZero / ZeroGPT utilisent en ligne, donc
 * le score est cohérent avec ce que l'utilisateur final verra s'il copie-colle
 * le texte sur le site GPTZero pour vérifier.
 *
 * Si GPTZERO_API_KEY n'est pas configuré, retourne null (le pipeline fera
 * fallback sur le judge GPT-4o).
 *
 * Doc API : https://gptzero.me/docs
 *
 * Coût indicatif : ~0.0002$/mot, soit ~$0.40 par article 2000 mots checké.
 */

const GPTZERO_ENDPOINT = "https://api.gptzero.me/v2/predict/text";

interface GptzeroDocument {
  /** Probabilité 0-1 que le texte entier soit généré par IA. */
  completely_generated_prob?: number;
  /** Probabilité moyenne par phrase d'être générée par IA. */
  average_generated_prob?: number;
  /** Distribution sur 3 classes : human / ai / mixed. */
  class_probabilities?: {
    human?: number;
    ai?: number;
    mixed?: number;
  };
  /** Verdict global. */
  predicted_class?: "human" | "ai" | "mixed";
  /** Phrases avec leur classification individuelle. */
  sentences?: Array<{
    sentence: string;
    generated_prob?: number;
    perplexity?: number;
    highlight_sentence_for_ai?: boolean;
  }>;
}

interface GptzeroResponse {
  documents?: GptzeroDocument[];
}

export interface GptzeroResult {
  /** Score 0-100 normalisé. Plus haut = plus probable IA. */
  aiScore: number;
  /** Verdict global de GPTZero. */
  predictedClass: "human" | "ai" | "mixed";
  /** Reasoning humain pour affichage UI. */
  reasoning: string;
  /** Phrases que GPTZero a flaggées comme suspectes (utile pour ciblage rewrite). */
  suspectSentences: string[];
}

/**
 * Calcule un score 0-100 à partir des données GPTZero. On utilise
 * `completely_generated_prob` comme métrique principale (probabilité que le
 * doc entier soit généré). C'est ce qui correspond le mieux au score affiché
 * sur le site web de GPTZero.
 */
function computeScore(doc: GptzeroDocument): number {
  // Priorité 1 : completely_generated_prob (0-1)
  if (typeof doc.completely_generated_prob === "number") {
    return Math.round(doc.completely_generated_prob * 100);
  }
  // Priorité 2 : class_probabilities.ai (0-1)
  if (typeof doc.class_probabilities?.ai === "number") {
    return Math.round(doc.class_probabilities.ai * 100);
  }
  // Priorité 3 : average_generated_prob
  if (typeof doc.average_generated_prob === "number") {
    return Math.round(doc.average_generated_prob * 100);
  }
  // Fallback : interprète predicted_class
  if (doc.predicted_class === "ai") return 90;
  if (doc.predicted_class === "mixed") return 50;
  if (doc.predicted_class === "human") return 10;
  return 50;
}

function buildReasoning(doc: GptzeroDocument, score: number): string {
  const parts: string[] = [];
  if (doc.predicted_class) {
    parts.push(`Verdict GPTZero : ${doc.predicted_class}`);
  }
  if (typeof doc.class_probabilities?.human === "number") {
    parts.push(`humain ${Math.round(doc.class_probabilities.human * 100)}%`);
  }
  if (typeof doc.class_probabilities?.ai === "number") {
    parts.push(`IA ${Math.round(doc.class_probabilities.ai * 100)}%`);
  }
  if (typeof doc.class_probabilities?.mixed === "number") {
    parts.push(`mixte ${Math.round(doc.class_probabilities.mixed * 100)}%`);
  }
  if (parts.length === 0) parts.push(`score ${score}/100`);
  return parts.join(" · ");
}

/**
 * Appelle GPTZero. Retourne null si la clé API n'est pas configurée ou si
 * l'appel échoue (le pipeline tombera alors sur le judge GPT-4o de fallback).
 */
export async function detectWithGptzero(text: string): Promise<GptzeroResult | null> {
  const apiKey = env.GPTZERO_API_KEY;
  if (!apiKey) return null;

  const input = text.trim();
  if (!input || input.length < 30) return null;

  let res: Response;
  try {
    res = await fetch(GPTZERO_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({ document: input }),
    });
  } catch (err) {
    console.error("[detect-ai-gptzero] échec réseau :", err);
    return null;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(
      `[detect-ai-gptzero] HTTP ${res.status} : ${body.slice(0, 300)}`,
    );
    return null;
  }

  let json: GptzeroResponse;
  try {
    json = await res.json();
  } catch (err) {
    console.error("[detect-ai-gptzero] JSON invalide :", err);
    return null;
  }

  const doc = json.documents?.[0];
  if (!doc) {
    console.error("[detect-ai-gptzero] réponse vide");
    return null;
  }

  const aiScore = computeScore(doc);
  const predictedClass = doc.predicted_class ?? "mixed";
  const reasoning = buildReasoning(doc, aiScore);

  const suspectSentences =
    doc.sentences
      ?.filter((s) => s.highlight_sentence_for_ai || (s.generated_prob ?? 0) >= 0.65)
      .map((s) => s.sentence)
      .slice(0, 6) ?? [];

  return {
    aiScore,
    predictedClass,
    reasoning,
    suspectSentences,
  };
}
