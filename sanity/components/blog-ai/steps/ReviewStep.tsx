import { AddIcon, CloseIcon, ImageIcon } from "@sanity/icons";
import { Stack, Card, Text, Button, Flex, Box, Grid, Spinner } from "@sanity/ui";
import { useState } from "react";

import type { BriefInput, ImageVariant, SectionResult } from "@/lib/blog/types";

import { callGenerateImages, callGenerateSection } from "../api-client";
import type { StepProps } from "../types";

function extractSectionTitle(markdown: string): string {
  const firstLine = markdown.trim().split("\n", 1)[0] ?? "";
  const match = firstLine.match(/^#{2,3}\s+(.+)$/);
  return match ? match[1].trim() : "Section";
}

export function ReviewStep({ state, onUpdate, onNext, onBack, onCancel }: StepProps) {
  const [rewritingId, setRewritingId] = useState<string | null>(null);
  const [rewriteError, setRewriteError] = useState<string | null>(null);

  const [imageGeneratingId, setImageGeneratingId] = useState<string | null>(null);
  const [imageVariantsByPick, setImageVariantsByPick] = useState<
    Record<string, ImageVariant[]>
  >({});
  const [imageError, setImageError] = useState<string | null>(null);

  const busy = rewritingId !== null || imageGeneratingId !== null;

  const handleRewrite = async (sectionId: string) => {
    if (!state.skeleton) return;
    setRewritingId(sectionId);
    setRewriteError(null);
    try {
      const { section } = await callGenerateSection({
        brief: state.brief as BriefInput,
        skeleton: state.skeleton,
        sectionId,
        previousSections: state.sections
          .filter((s) => s.sectionId !== sectionId)
          .map((c) => ({ sectionId: c.sectionId, markdown: c.markdown })),
      });
      const updated: SectionResult[] = state.sections.map((s) =>
        s.sectionId === sectionId ? section : s,
      );
      onUpdate({ sections: updated });
    } catch (err) {
      setRewriteError(err instanceof Error ? err.message : "Erreur réécriture");
    } finally {
      setRewritingId(null);
    }
  };

  const handleGenerateImages = async (sectionId: string, sectionTitle: string) => {
    setImageGeneratingId(sectionId);
    setImageError(null);
    try {
      const { variants } = await callGenerateImages({
        title: sectionTitle.slice(0, 200),
        brief: state.brief as BriefInput,
        count: 4,
      });
      setImageVariantsByPick((prev) => ({ ...prev, [sectionId]: variants }));
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Erreur génération image");
    } finally {
      setImageGeneratingId(null);
    }
  };

  const handlePickVariant = (sectionId: string, variant: ImageVariant) => {
    const current = state.sectionImages[sectionId] ?? [];
    onUpdate({
      sectionImages: {
        ...state.sectionImages,
        [sectionId]: [...current, variant],
      },
    });
    setImageVariantsByPick((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  };

  const handleCancelPick = (sectionId: string) => {
    setImageVariantsByPick((prev) => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  };

  const handleRemoveImage = (sectionId: string, assetId: string) => {
    const current = state.sectionImages[sectionId] ?? [];
    onUpdate({
      sectionImages: {
        ...state.sectionImages,
        [sectionId]: current.filter((i) => i.assetId !== assetId),
      },
    });
  };

  return (
    <Stack space={5} padding={5}>
      <Card padding={4} radius={2} tone="primary">
        <Stack space={2}>
          <Text size={1}>
            <strong>Étape 4/5 — Relecture.</strong> Lis chaque section. Tu peux réécrire une section
            si elle ne te convient pas (un seul clic, ~30 s), ou ajouter une image illustrant la
            section.
          </Text>
          <Text size={1} muted>
            Le brouillon final s&apos;ouvrira ensuite dans Sanity, où tu pourras personnaliser
            librement avant publication (vérifier les chiffres, ajouter une anecdote, signer).
          </Text>
        </Stack>
      </Card>

      <Stack space={4}>
        {state.sections.map((s) => {
          const sectionTitle = extractSectionTitle(s.markdown);
          const selectedImages = state.sectionImages[s.sectionId] ?? [];
          const variantsToPick = imageVariantsByPick[s.sectionId];
          const isGeneratingThis = imageGeneratingId === s.sectionId;
          const isRewritingThis = rewritingId === s.sectionId;

          return (
            <Card key={s.sectionId} padding={4} radius={2} tone="transparent" border>
              <Stack space={3}>
                <Box
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "system-ui",
                    fontSize: 13,
                    lineHeight: 1.6,
                    maxHeight: 320,
                    overflow: "auto",
                  }}
                >
                  {s.markdown}
                </Box>

                {selectedImages.length > 0 && (
                  <Stack space={2}>
                    <Text size={0} weight="semibold" muted>
                      Image{selectedImages.length > 1 ? "s" : ""} de cette section
                    </Text>
                    <Flex gap={2} wrap="wrap">
                      {selectedImages.map((img) => (
                        <Box
                          key={img.assetId}
                          style={{ position: "relative", width: 120 }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt=""
                            style={{
                              width: 120,
                              height: 68,
                              objectFit: "cover",
                              borderRadius: 4,
                              display: "block",
                            }}
                          />
                          <Button
                            mode="default"
                            tone="critical"
                            icon={CloseIcon}
                            padding={1}
                            fontSize={0}
                            disabled={busy}
                            onClick={() => handleRemoveImage(s.sectionId, img.assetId)}
                            style={{
                              position: "absolute",
                              top: 2,
                              right: 2,
                              minWidth: 0,
                            }}
                          />
                        </Box>
                      ))}
                    </Flex>
                  </Stack>
                )}

                {isGeneratingThis && (
                  <Flex align="center" gap={2} padding={2}>
                    <Spinner muted />
                    <Text size={0} muted>
                      Génération de 4 variantes…
                    </Text>
                  </Flex>
                )}

                {variantsToPick && variantsToPick.length > 0 && (
                  <Stack space={2}>
                    <Text size={0} weight="semibold">
                      Choisis une variante (clic pour ajouter à la section)
                    </Text>
                    <Grid columns={4} gap={2}>
                      {variantsToPick.map((v) => (
                        <Card
                          key={v.assetId}
                          padding={1}
                          radius={2}
                          border
                          tone="transparent"
                          style={{ cursor: "pointer" }}
                          onClick={() => handlePickVariant(s.sectionId, v)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={v.url}
                            alt="Variante"
                            style={{
                              width: "100%",
                              height: "auto",
                              borderRadius: 4,
                              display: "block",
                            }}
                          />
                        </Card>
                      ))}
                    </Grid>
                    <Flex gap={2}>
                      <Button
                        mode="ghost"
                        text="Regénérer 4 variantes"
                        onClick={() => handleGenerateImages(s.sectionId, sectionTitle)}
                        disabled={busy}
                        padding={2}
                        fontSize={1}
                      />
                      <Button
                        mode="ghost"
                        tone="critical"
                        text="Annuler"
                        onClick={() => handleCancelPick(s.sectionId)}
                        disabled={busy}
                        padding={2}
                        fontSize={1}
                      />
                    </Flex>
                  </Stack>
                )}

                <Flex justify="space-between" align="center" gap={2}>
                  {!variantsToPick && !isGeneratingThis && (
                    <Button
                      mode="ghost"
                      icon={selectedImages.length > 0 ? AddIcon : ImageIcon}
                      text={
                        selectedImages.length > 0
                          ? "Ajouter une image"
                          : "Générer une image"
                      }
                      onClick={() => handleGenerateImages(s.sectionId, sectionTitle)}
                      disabled={busy}
                      padding={3}
                      fontSize={1}
                    />
                  )}
                  <Box style={{ marginLeft: "auto" }}>
                    <Button
                      mode="ghost"
                      text={isRewritingThis ? "Réécriture…" : "↺ Réécrire cette section"}
                      disabled={busy}
                      onClick={() => handleRewrite(s.sectionId)}
                      padding={3}
                    />
                  </Box>
                </Flex>
              </Stack>
            </Card>
          );
        })}
      </Stack>

      {rewriteError && (
        <Card padding={4} radius={2} tone="critical">
          <Text size={1}>Erreur réécriture : {rewriteError}</Text>
        </Card>
      )}
      {imageError && (
        <Card padding={4} radius={2} tone="critical">
          <Text size={1}>Erreur image : {imageError}</Text>
        </Card>
      )}

      <Flex justify="space-between" gap={3} paddingTop={3}>
        <Button mode="ghost" text="← Retour" onClick={onBack} disabled={busy} padding={3} />
        <Flex gap={3}>
          <Button
            mode="ghost"
            tone="critical"
            text="Annuler"
            onClick={onCancel}
            disabled={busy}
            padding={3}
          />
          <Button
            tone="primary"
            text="Choisir une image →"
            onClick={onNext}
            disabled={busy}
            padding={3}
          />
        </Flex>
      </Flex>
    </Stack>
  );
}
