import "server-only";

import { generateObject } from "ai";
import { z } from "zod";

import { buildBlogSystemPrompt } from "./prompt-system";

const KEYPOINTS_MODEL = "anthropic/claude-haiku-4-5";

const keypointsSchema = z.object({
  keyPoints: z
    .array(z.string().min(8).max(240))
    .min(3)
    .max(6)
    .describe(
      "3 à 6 points-clés concrets que l'article devrait couvrir. Chaque point doit décrire un aspect distinct, formulé comme un fragment ou une question directe — pas comme un slogan ni un titre H2 final. Maximum 240 caractères par point.",
    ),
});

interface SuggestKeypointsInput {
  subject: string;
  audience: string;
  angle: string;
  intent: "info" | "seo" | "lead-gen" | "mixed";
  seoKeywords?: string[];
}

export async function suggestKeypoints(
  input: SuggestKeypointsInput,
): Promise<string[]> {
  const system = await buildBlogSystemPrompt();

  const userPrompt = `MISSION
Tu vas proposer 3 à 6 POINTS-CLÉS à couvrir dans un article de blog d'Aïssa Events.
Tu ne rédiges PAS l'article. Tu listes uniquement les axes concrets qu'il devrait aborder.

BRIEF PARTIEL (Aïssa n'a pas encore listé les points)
- Sujet : ${input.subject}
- Audience : ${input.audience}
- Angle éditorial : ${input.angle}
- Intention : ${input.intent}
- Mots-clés SEO locaux : ${input.seoKeywords?.length ? input.seoKeywords.join(", ") : "(non précisé)"}

CONSIGNES
- Chaque point doit être CONCRET : décrire un aspect précis, une étape, une question récurrente, un livrable. Pas de slogan vague.
- Évite les formulations clichées (« les enjeux », « les bénéfices », « les étapes-clés »).
- Préfère des fragments naturels, comme si Aïssa les notait pour elle-même au moment de préparer l'article : « ce que je regarde dès le premier RDV », « pourquoi je refuse certains projets ».
- Ne dépasse pas 6 points : un article qui couvre 4-5 axes en profondeur vaut mieux qu'un qui en survole 10.
- Pas de point de conclusion / synthèse — l'article fait son propre bilan.
- LONGUEUR : chaque point doit faire MAX 240 caractères, idéalement 60-180. Sois précis, pas exhaustif. Si tu as envie d'énumérer trop de sous-aspects, c'est que tu fais 2 points en 1 — sépare-les.

CHECKLIST AVANT DE RÉPONDRE
- [ ] Chaque point est concret (pas de slogan)
- [ ] Pas de jargon SEO ou marketing
- [ ] Vouvoiement implicite (mais les points peuvent être des fragments)
- [ ] Aucune tournure bannie (cf. règles dans le system prompt)

Réponds en JSON strict conforme au schéma.`;

  const result = await generateObject({
    model: KEYPOINTS_MODEL,
    system,
    schema: keypointsSchema,
    prompt: userPrompt,
    providerOptions: {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
  });

  return result.object.keyPoints;
}
