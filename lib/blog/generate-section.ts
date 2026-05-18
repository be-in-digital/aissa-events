import "server-only";

import { generateText } from "ai";

import { scoreBurstiness } from "./burstiness-score";
import { humanizeUndetectable } from "./humanize-undetectable";
import { postProcessSection } from "./post-processing";
import { buildBlogSystemPrompt } from "./prompt-system";
import type { BriefInput, SectionResult, Skeleton } from "./types";

/**
 * Génération section — version « ghostwriter ».
 *
 * Pipeline réduit à 2 couches après l'audit anti-détection :
 *   1. Génération unique (Claude Haiku 4.5) avec sampling créatif et few-shot
 *      humain massif injecté dans le system prompt (voir prompt-system.ts).
 *   2. Post-processing déterministe (em-dashes, italiques, transitions LLM).
 *   3. (informatif) Score burstiness local pour feedback UI — ne déclenche
 *      pas de re-roll, c'est juste un signal.
 *
 * Les couches « critique-rewrite » + « humanize cross-modèle » + « detection
 * loop GPTZero » ont été retirées : elles lissaient la signature au lieu de
 * la casser. La concreteness et l'imitation directe (few-shot) sont plus
 * efficaces que les passes de réécriture multiples.
 *
 * sectionId :
 *   - « h2-{i} » pour une H2 sans sous-H3 → toute la section
 *   - « h2-{i}-h3-{j} » pour un sous-H3 → ce paragraphe uniquement
 */

const SECTION_MODEL = "anthropic/claude-haiku-4-5";

interface ResolvedSection {
  parent: { index: number; title: string };
  child: { index: number; title: string } | null;
  isLast: boolean;
}

function resolveSection(skeleton: Skeleton, sectionId: string): ResolvedSection | null {
  const h2Match = sectionId.match(/^h2-(\d+)(?:-h3-(\d+))?$/);
  if (!h2Match) return null;

  const h2Idx = parseInt(h2Match[1], 10);
  const h3Idx = h2Match[2] != null ? parseInt(h2Match[2], 10) : null;

  const h2 = skeleton.plan[h2Idx];
  if (!h2) return null;

  let child = null;
  if (h3Idx != null) {
    const h3 = h2.children[h3Idx];
    if (!h3) return null;
    child = { index: h3Idx, title: h3.title };
  }

  const isLast =
    h2Idx === skeleton.plan.length - 1 &&
    (h3Idx === null || h3Idx === h2.children.length - 1);

  return {
    parent: { index: h2Idx, title: h2.title },
    child,
    isLast,
  };
}

export async function generateSection(args: {
  brief: BriefInput;
  skeleton: Skeleton;
  sectionId: string;
  previousSections: Array<{ sectionId: string; markdown: string }>;
}): Promise<SectionResult> {
  const resolved = resolveSection(args.skeleton, args.sectionId);
  if (!resolved) {
    throw new Error(`sectionId invalide : ${args.sectionId}`);
  }

  const system = await buildBlogSystemPrompt();

  const titleLine = resolved.child
    ? `Sous-section H3 « ${resolved.child.title} » dans la H2 « ${resolved.parent.title} »`
    : `Section H2 « ${resolved.parent.title} »`;

  const targetWordsForSection = Math.round(
    args.brief.targetWordCount /
      Math.max(1, args.skeleton.plan.reduce((acc, h2) => acc + 1 + h2.children.length, 0)),
  );

  const previousSummary = args.previousSections
    .slice(-3)
    .map(
      (s) =>
        `[${s.sectionId}]\n${s.markdown.slice(0, 400)}${
          s.markdown.length > 400 ? "..." : ""
        }`,
    )
    .join("\n\n");

  const userPrompt = `MISSION
Tu rédiges UNE seule ${resolved.child ? "sous-section" : "section"} de l'article. Imite la voix d'Aïssa telle qu'elle apparaît dans les 10 paragraphes de référence du system prompt.
${titleLine}.

CONTEXTE — L'ARTICLE
- Titre : « ${args.skeleton.title} »
- Excerpt : ${args.skeleton.excerpt}
- Plan complet (pour contexte) :
${args.skeleton.plan
  .map((h2, i) => {
    const h3s =
      h2.children.length > 0
        ? h2.children
            .map((h3, j) => `    ${i + 1}.${j + 1}. ${h3.title}`)
            .join("\n")
        : "";
    return `  ${i + 1}. ${h2.title}${h3s ? "\n" + h3s : ""}`;
  })
  .join("\n")}

BRIEF ORIGINAL
- Audience : ${args.brief.audience}
- Angle : ${args.brief.angle}
- Points-clés de l'article : ${args.brief.keyPoints.join(" · ")}
- Mots-clés SEO locaux disponibles : ${args.brief.seoKeywords.join(", ") || "(aucun)"}

SECTIONS DÉJÀ RÉDIGÉES (pour cohérence narrative — ne répète pas)
${previousSummary || "(aucune — c'est la première section)"}

CONSIGNES POUR CETTE SECTION
- Longueur : ~${targetWordsForSection} mots (±25%).
- Format markdown : commence DIRECTEMENT par ${
    resolved.child ? "### " + resolved.child.title : "## " + resolved.parent.title
  }, puis paragraphes.
- ${
    resolved.isLast
      ? "DERNIÈRE section : termine sur une note concrète et ouverte (un conseil pratique, un détail matériel, une invitation à prendre RDV). PAS de « conclusion », PAS de récap, PAS de phrase de morale. Une note d'ouverture, pas une fermeture lourde."
      : "Ce n'est PAS la dernière section : ne conclus pas l'article, ne récapitule pas, pas de transition lourde."
  }

OBLIGATIONS DE VOIX (relire les 10 paragraphes du system prompt avant de répondre)
- AU MOINS DEUX détails hyper-spécifiques dans cette section : chiffres précis, heures, capacités exactes, noms de gares, mois, marques, ou éléments matériels nommables. Pas « un délai raisonnable » mais « 9 mois ». Pas « la salle » mais « 65 m² avec verrière de 25 m² ».
- AU MOINS UNE parenthèse-aparté honnête (pensée secondaire entre parenthèses, comme dans les exemples : « (rien de plus, les outils sophistiqués finissent toujours abandonnés) »).
- AU MOINS UN aveu honnête anti-marketing si pertinent : Aïssa dit des choses qu'aucune agence ne dirait.
- ZÉRO opener IA : aucun paragraphe ne commence par « Ce qui compte vraiment », « Honnêtement », « Au-delà de », « Imaginez », « En réalité », « Soyons honnêtes », « Plongeons », « Découvrons », « Explorons ».
- ZÉRO triade abstraite (« vos envies, vos contraintes, vos doutes »). Les listes doivent être de choses réelles nommables.
- Vouvoiement. Zéro em-dash. Zéro italique décoratif. Aucune tournure bannie du system prompt.

RAPPEL FINAL
Tu es Aïssa qui écrit, pas un assistant. Avant d'envoyer ta réponse, relis-toi en posant la question : « Est-ce que ça ressemble exactement aux paragraphes de référence du system prompt ? ». Si la réponse est « presque mais Aïssa dirait ça autrement », réécris.

Réponds avec UNIQUEMENT le markdown de la section (pas de préambule, pas de « Voici la section : »).`;

  // Couche 1 — Génération avec sampling créatif.
  // temperature 0.95 + topP 0.95 : laisse le modèle s'écarter du chemin
  // statistique le plus probable (qui est, par construction, le chemin
  // « IA-typique »). Trade-off : un peu plus de variance dans la qualité,
  // mais moins de pattern signature.
  const result = await generateText({
    model: SECTION_MODEL,
    system,
    prompt: userPrompt,
    temperature: 0.95,
    topP: 0.95,
    providerOptions: {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
  });

  const layer1Text = result.text?.trim() ?? "";
  if (!layer1Text) {
    throw new Error("Génération section échouée — texte vide");
  }

  // Couche 2 — Post-processing déterministe (em-dashes, italiques, transitions LLM).
  const layer2 = postProcessSection(layer1Text);

  // Couche 3 — Humanizer tiers (Undetectable.AI). Best-effort : si pas de clé
  // API ou si le service échoue, on garde le texte de la couche 2.
  let finalText = layer2.cleaned;
  let humanizerUsed: "undetectable" | "none" = "none";
  let humanizerError: string | undefined;

  const undetectable = await humanizeUndetectable(layer2.cleaned);
  if (undetectable.output) {
    // Re-passe du post-processing après humanizer : Undetectable peut
    // réintroduire des em-dashes ou tournures bannies.
    finalText = postProcessSection(undetectable.output).cleaned;
    humanizerUsed = "undetectable";
  } else if (undetectable.error) {
    humanizerError = undetectable.error;
  }

  // Couche 4 — Score burstiness local (informatif, ne déclenche pas de re-roll).
  const score = scoreBurstiness(finalText);

  return {
    sectionId: args.sectionId,
    markdown: finalText,
    qualityNotes: {
      llmMarkers:
        layer2.residual.bannedTransitions +
        layer2.residual.bannedMetaphors +
        layer2.residual.bannedCliches,
      variance: Math.round(score.metrics.burstiness * 100),
      concreteness: Math.round(score.metrics.concreteDensity * 100),
      voice: Math.round(score.metrics.lexicalDiversity * 100),
    },
    aiDetectionScore: score.aiScore,
    aiDetectionReasoning:
      humanizerUsed === "undetectable"
        ? `[undetectable+local] ${score.reasoning}`
        : humanizerError
          ? `[local, humanizer error: ${humanizerError}] ${score.reasoning}`
          : `[local, no humanizer key] ${score.reasoning}`,
    humanizationRounds: humanizerUsed === "undetectable" ? 1 : 0,
  };
}
