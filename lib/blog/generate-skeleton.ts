import "server-only";

import { generateObject } from "ai";
import { z } from "zod";

import { buildBlogSystemPrompt } from "./prompt-system";
import type { BriefInput, Skeleton } from "./types";

const SKELETON_MODEL = "anthropic/claude-haiku-4-5";

const skeletonSchema = z.object({
  title: z
    .string()
    .min(10)
    .max(200)
    .describe(
      "Titre éditorial de l'article. Pas de point final. Doit donner envie de lire, sans hyperbole. Vise 40-80 caractères mais reste flexible.",
    ),
  excerpt: z
    .string()
    .min(30)
    .max(400)
    .describe(
      "Accroche affichée sous le titre en liste blog. Doit poser la promesse de l'article concrètement. Vise 100-200 caractères.",
    ),
  plan: z
    .array(
      z.object({
        title: z.string().min(3).max(200).describe("Titre H2 court et concret."),
        children: z
          .array(z.object({ title: z.string().min(3).max(200) }))
          .max(4)
          .describe(
            "Sous-titres H3 optionnels (0-4). Garde simple : la plupart des sections n'ont pas besoin de H3.",
          ),
      }),
    )
    .min(3)
    .max(8)
    .describe(
      "Plan H2 ordonné. 3-8 H2. Préfère 4-6 H2 typiquement. Chaque H2 doit couvrir un aspect distinct du sujet.",
    ),
  suggestedTags: z
    .array(z.string().min(2).max(60))
    .min(2)
    .max(10)
    .describe(
      "Tags suggérés (2-10). Mots-clés courts pertinents. Aïssa pourra cocher/ajouter.",
    ),
  seo: z.object({
    metaTitle: z
      .string()
      .min(20)
      .max(90)
      .describe(
        "Title SEO. Vise 50-60 caractères idéalement (limite Google) mais 30-70 acceptable. Inclure mot-clé principal + ancrage local si pertinent.",
      ),
    metaDescription: z
      .string()
      .min(80)
      .max(220)
      .describe(
        "Meta description. Vise 150-160 caractères idéalement (limite Google) mais 120-180 acceptable. Inclure mot-clé + bénéfice + call-to-read implicite.",
      ),
  }),
});

export async function generateSkeleton(brief: BriefInput): Promise<Skeleton> {
  const system = await buildBlogSystemPrompt();

  const userPrompt = `MISSION
Tu vas concevoir le SQUELETTE d'un article de blog pour le site d'Aïssa Events (publié sur https://aissaevents.com).
Tu ne rédiges PAS encore les sections — uniquement :
- le titre
- l'excerpt (accroche courte sous le titre, visible en liste blog)
- le plan H2/H3 ordonné
- 3-7 tags suggérés
- le SEO meta (title + description)

BRIEF
- Sujet : ${brief.subject}
- Audience : ${brief.audience}
- Intention : ${brief.intent}
- Angle éditorial : ${brief.angle}
- Mots-clés SEO locaux (à intégrer naturellement, pas en surcharge) : ${brief.seoKeywords.join(", ") || "(aucun)"}
- Longueur cible de l'article complet : ${brief.targetWordCount} mots
- Points-clés à couvrir :
${brief.keyPoints.map((p, i) => `  ${i + 1}. ${p}`).join("\n")}

CONSIGNES SPÉCIFIQUES POUR LE SQUELETTE
- Le titre doit sonner comme Aïssa : pas d'hyperbole, pas de clickbait. Préfère « Comment se passe un premier rendez-vous avec une wedding planner » à « Le SECRET d'un mariage de rêve ».
- L'excerpt doit donner UNE promesse concrète, pas un teasing vague.
- Le plan doit éviter les structures clichées « Introduction / Les enjeux / Les étapes / Conclusion ». Préfère des H2 qui posent des questions concrètes ou nomment des moments précis.
- Les H3 sont OPTIONNELS — la plupart des H2 n'en ont pas besoin. Garde simple.
- Tags : courts, pertinents pour le SEO, en lien avec l'écosystème événementiel.
- Meta title : 50-60 car idéalement, mot-clé + ancrage local si pertinent (« — Aïssa Events » en fin n'est PAS nécessaire, c'est ajouté par le template).
- Meta description : 150-160 car, doit donner envie de cliquer sans être hyperbolique.

CHECKLIST AVANT DE RÉPONDRE
- [ ] Aucune tournure bannie (cf. règles dans le system prompt)
- [ ] Aucune métaphore hallmark
- [ ] Vouvoiement
- [ ] Si pertinent : ancrage 77/IDF dans titre ou meta

Réponds en JSON strict conforme au schéma.`;

  const result = await generateObject({
    model: SKELETON_MODEL,
    system,
    schema: skeletonSchema,
    prompt: userPrompt,
    providerOptions: {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
  });

  return result.object;
}
