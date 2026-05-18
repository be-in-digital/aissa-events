import { Dialog, Box, Stack, Card, Text } from "@sanity/ui";
import { useEffect, useState, useCallback } from "react";
import { useClient } from "sanity";

import { markdownToPortableText } from "@/lib/blog/markdown-to-portable-text";
import { env } from "@/env";

import { BriefStep } from "./steps/BriefStep";
import { GenerationStep } from "./steps/GenerationStep";
import { ImageStep } from "./steps/ImageStep";
import { ReviewStep } from "./steps/ReviewStep";
import { SkeletonStep } from "./steps/SkeletonStep";
import { clearWizardState, loadWizardState, saveWizardState } from "./storage";
import { INITIAL_STATE, type WizardState } from "./types";

interface Props {
  docId: string;
  onClose: () => void;
}

export function GenerateWizardDialog({ docId, onClose }: Props) {
  const client = useClient({ apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION });
  const [state, setState] = useState<WizardState>(() => loadWizardState(docId) ?? INITIAL_STATE);
  const [injecting, setInjecting] = useState(false);
  const [injectError, setInjectError] = useState<string | null>(null);

  useEffect(() => {
    saveWizardState(docId, state);
  }, [docId, state]);

  const update = useCallback((partial: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const goTo = useCallback(
    (step: WizardState["step"]) => {
      setState((prev) => ({ ...prev, step }));
    },
    [],
  );

  const cancel = useCallback(() => {
    if (
      window.confirm(
        "Annuler la génération ? Le brouillon local sera supprimé (le doc Sanity n'est pas modifié).",
      )
    ) {
      clearWizardState(docId);
      onClose();
    }
  }, [docId, onClose]);

  const injectIntoSanity = useCallback(async () => {
    if (!state.skeleton) return;
    setInjecting(true);
    setInjectError(null);
    try {
      // 1. Résoudre la référence de catégorie depuis le slug
      const categoryId = await client.fetch<string | null>(
        `*[_type=="category" && slug.current==$slug][0]._id`,
        { slug: state.brief.categorySlug ?? "" },
      );
      if (!categoryId) {
        throw new Error(
          `Catégorie « ${state.brief.categorySlug} » introuvable dans Sanity. Crée-la d'abord ou corrige le slug.`,
        );
      }

      // 2. Assembler le body section par section, en intercalant les images
      // de section après chaque bloc texte. Les images sont posées comme
      // membres `imageWithAlt` du tableau body (le schéma `blockContent`
      // accepte ces deux types de membres : block et imageWithAlt).
      const sortedSections = [...state.sections].sort((a, b) =>
        a.sectionId.localeCompare(b.sectionId, undefined, { numeric: true }),
      );
      const bodyPortableText: unknown[] = [];
      for (const section of sortedSections) {
        const blocks = markdownToPortableText(section.markdown);
        bodyPortableText.push(...blocks);
        const images = state.sectionImages[section.sectionId] ?? [];
        for (const img of images) {
          bodyPortableText.push({
            _type: "imageWithAlt",
            alt: state.skeleton.title,
            asset: { _type: "reference", _ref: img.assetId },
          });
        }
      }

      // 3. Construire le patch
      const patch: Record<string, unknown> = {
        title: state.skeleton.title,
        excerpt: state.skeleton.excerpt,
        body: bodyPortableText,
        tags: state.skeleton.suggestedTags,
        category: { _type: "reference", _ref: categoryId },
        seo: {
          _type: "seo",
          title: state.skeleton.seo.metaTitle,
          description: state.skeleton.seo.metaDescription,
        },
        wasAIAssisted: true,
      };

      // publishedAt est `required` côté schéma avec `initialValue: now()`, mais
      // initialValue ne se déclenche pas lors d'un patch direct via l'API. Sans
      // valeur, Sanity affiche la date comme invalide et Aïssa doit la régler
      // manuellement avant de pouvoir publier. setIfMissing pour ne pas écraser
      // une date qu'elle aurait déjà choisie sur le brouillon.
      const publishedAtFallback = new Date().toISOString();

      // 4. Cover si sélectionnée
      if (state.selectedCoverAssetId) {
        patch.cover = {
          _type: "imageWithAlt",
          alt: state.skeleton.title,
          asset: { _type: "reference", _ref: state.selectedCoverAssetId },
        };
      }

      // 5. Slug auto depuis le titre (Sanity le fait normalement, mais on l'aide)
      const generatedSlug = state.skeleton.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 96);
      patch.slug = { _type: "slug", current: generatedSlug };

      // 6. Appliquer le patch sur le brouillon — créer le draft d'abord s'il n'existe pas
      // (cas d'un nouveau document jamais sauvegardé : aucun draft côté Sanity).
      const draftId = docId.startsWith("drafts.") ? docId : `drafts.${docId}`;
      await client
        .transaction()
        .createIfNotExists({ _id: draftId, _type: "post" })
        .patch(draftId, (p) =>
          p.set(patch).setIfMissing({ publishedAt: publishedAtFallback }),
        )
        .commit({ autoGenerateArrayKeys: true });

      // 7. Cleanup local storage
      clearWizardState(docId);
      onClose();
    } catch (err) {
      setInjectError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setInjecting(false);
    }
  }, [client, docId, onClose, state]);

  const stepProps = {
    state,
    onUpdate: update,
    onCancel: cancel,
    onNext: () => goTo(((state.step + 1) as WizardState["step"])),
    onBack: () => goTo(((state.step - 1) as WizardState["step"])),
  };

  // Étape 5 → "Continuer" déclenche l'injection au lieu d'avancer
  if (state.step === 5) {
    stepProps.onNext = injectIntoSanity;
  }

  return (
    <Dialog
      id="blog-ai-wizard"
      header="Générer un article avec IA"
      onClose={onClose}
      width={2}
    >
      <Box padding={0}>
        {state.step === 1 && <BriefStep {...stepProps} />}
        {state.step === 2 && <SkeletonStep {...stepProps} />}
        {state.step === 3 && <GenerationStep {...stepProps} />}
        {state.step === 4 && <ReviewStep {...stepProps} />}
        {state.step === 5 && (
          <Stack>
            <ImageStep {...stepProps} />
            {injecting && (
              <Card padding={3} radius={0} tone="primary">
                <Text>Injection dans Sanity en cours…</Text>
              </Card>
            )}
            {injectError && (
              <Card padding={3} radius={0} tone="critical">
                <Text>Erreur injection : {injectError}</Text>
              </Card>
            )}
          </Stack>
        )}
      </Box>
    </Dialog>
  );
}
