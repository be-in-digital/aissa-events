import "server-only";

import { generateObject } from "ai";
import { z } from "zod";

/**
 * Couche 5 (partie 1) — Détecteur IA "as judge".
 *
 * Utilise un modèle d'une autre famille que Claude (GPT-4o ou Gemini) pour
 * scorer le texte sur sa probabilité d'avoir été généré par IA. C'est un
 * proxy gratuit en attendant un vrai détecteur (GPTZero / Originality.ai).
 *
 * Plus le score est bas, plus le texte est probablement humain.
 *
 * Le judge cherche les empreintes statistiques classiques des LLM :
 * triades parallèles, openers prévisibles, rythme uniforme, em-dashes,
 * italiques décoratifs, absence de fragments / faux départs.
 */

const JUDGE_MODEL_CHAIN = [
  "openai/gpt-4o-mini",
  "openai/gpt-4o",
  "google/gemini-2.5-flash",
];

const judgeSchema = z.object({
  aiScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe(
      "Score 0-100 où 0 = clairement humain et 100 = clairement généré par IA. Sois sévère : viser sous 30 pour valider.",
    ),
  reasoning: z
    .string()
    .min(20)
    .max(500)
    .describe("Une phrase qui résume pourquoi tu donnes ce score (français)."),
  suspectPatterns: z
    .array(z.string().min(5).max(200))
    .max(6)
    .describe(
      "0 à 6 patterns spécifiques identifiés. Chaque pattern doit citer le passage exact entre guillemets + dire pourquoi c'est suspect.",
    ),
});

export type JudgeResult = z.infer<typeof judgeSchema>;

const JUDGE_SYSTEM = `Tu es un expert en détection de texte généré par IA (Claude, GPT, Gemini, etc.).

Tu reçois un texte en français et tu estimes la probabilité qu'il ait été généré par un LLM, sur une échelle 0-100.

EMPREINTES IA TYPIQUES (augmentent le score) :
- Triades parallèles équilibrées : « X, Y, Z », « vos envies, vos contraintes, vos doutes »
- Rythme uniforme : phrases qui font systématiquement 15-20 mots
- Openers prévisibles : « Ce qui compte vraiment », « Honnêtement », « Au-delà de », « En réalité »
- Em-dashes décoratifs (—) ou italiques d'emphase
- Phrases de synthèse finales : « Voilà ce qui compte. », « C'est ça qui m'intéresse. »
- Sous-clauses parfaitement symétriques (« Vous arrivez avec X, je vous aide avec Y. »)
- Énumérations à 3 termes sans rupture
- Grammaire trop parfaite, aucune aspérité
- Smoothness des transitions

EMPREINTES HUMAINES (baissent le score) :
- Variance brutale de longueur (3 mots vs 35 mots dans le même paragraphe)
- Fragments isolés (« Vraiment. », « Voilà. »)
- Faux départs (« Non, en fait... »)
- Phrases qui commencent par « Et » ou « Mais »
- Parenthèses orales avec pensée secondaire
- Marqueurs oraux (« franchement », « en fait »)
- Choix de mots inattendus, registre changeant
- Légères imperfections grammaticales acceptables

SOIS SÉVÈRE :
- Un texte avec 0 fragment + 0 marqueur oral + rythme régulier = 70+ même s'il est "naturel"
- Un texte avec triade parallèle visible = 60+ minimum
- Pour score < 30, il faut clairement plusieurs fragments, ruptures rythmiques fortes, et oralité naturelle

Réponds en JSON strict conforme au schéma.`;

/**
 * Évalue un texte avec un LLM "judge". Best-effort : si tous les modèles
 * échouent, retourne null (le pipeline continuera sans réécriture).
 */
export async function judgeAiLikelihood(text: string): Promise<JudgeResult | null> {
  const input = text.trim();
  if (!input || input.length < 30) return null;

  const prompt = `Analyse ce texte français et donne ton verdict :

"""
${input}
"""`;

  for (const model of JUDGE_MODEL_CHAIN) {
    try {
      const result = await generateObject({
        model,
        system: JUDGE_SYSTEM,
        schema: judgeSchema,
        prompt,
      });
      return result.object;
    } catch (err) {
      console.warn(`[detect-ai-judge] ${model} a échoué :`, err);
    }
  }

  console.error("[detect-ai-judge] tous les modèles judges ont échoué");
  return null;
}
