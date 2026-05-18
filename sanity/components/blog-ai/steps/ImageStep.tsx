import { Stack, Card, Text, Button, Flex, Grid, Spinner, Box } from "@sanity/ui";
import { useState } from "react";

import type { BriefInput } from "@/lib/blog/types";

import { callGenerateImages } from "../api-client";
import type { StepProps } from "../types";

export function ImageStep({ state, onUpdate, onNext, onBack, onCancel }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = async () => {
    if (!state.skeleton) return;
    setLoading(true);
    setError(null);
    try {
      const { variants } = await callGenerateImages({
        title: state.skeleton.title,
        brief: state.brief as BriefInput,
        count: 4,
      });
      onUpdate({ imageVariants: variants, skipCover: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur génération images");
    } finally {
      setLoading(false);
    }
  };

  const selectVariant = (assetId: string) => {
    onUpdate({ selectedCoverAssetId: assetId, skipCover: false });
  };

  const skip = () => {
    onUpdate({ selectedCoverAssetId: null, skipCover: true });
    onNext();
  };

  const canContinue =
    state.skipCover === true || state.selectedCoverAssetId !== null;

  return (
    <Stack space={5} padding={5}>
      <Card padding={4} radius={2} tone="primary">
        <Text size={1}>
          <strong>Étape 5/5 — Cover image.</strong> Génère 4 variantes via Imagen 4, ou saute pour
          choisir manuellement plus tard depuis ta banque Dropbox.
        </Text>
      </Card>

      {state.imageVariants.length === 0 && !loading && (
        <Stack space={4}>
          <Card padding={4} radius={2} tone="transparent" border>
            <Stack space={3}>
              <Text size={1} weight="semibold">Option 1 — Générer 4 variantes (Imagen 4)</Text>
              <Text size={0} muted>
                ~30 s, ~0,16 €. Photos d&apos;événementiel premium dans la palette du site.
              </Text>
              <Box>
                <Button tone="primary" text="Générer 4 variantes" onClick={fetchImages} padding={3} />
              </Box>
            </Stack>
          </Card>

          <Card padding={4} radius={2} tone="transparent" border>
            <Stack space={3}>
              <Text size={1} weight="semibold">Option 2 — Choisir plus tard (banque Dropbox)</Text>
              <Text size={0} muted>
                L&apos;article sera créé sans cover. Tu pourras l&apos;ajouter manuellement dans Sanity avant publication.
              </Text>
              <Box>
                <Button mode="ghost" text="Continuer sans image" onClick={skip} padding={3} />
              </Box>
            </Stack>
          </Card>
        </Stack>
      )}

      {loading && (
        <Flex align="center" justify="center" padding={5} direction="column" gap={3}>
          <Spinner muted />
          <Text muted size={1}>Génération des 4 variantes…</Text>
        </Flex>
      )}

      {state.imageVariants.length > 0 && (
        <Stack space={4}>
          <Text size={1}>
            Sélectionne ta variante préférée (clic) ou regénère.
          </Text>
          <Grid columns={2} gap={3}>
            {state.imageVariants.map((v) => {
              const selected = state.selectedCoverAssetId === v.assetId;
              return (
                <Card
                  key={v.assetId}
                  padding={2}
                  radius={2}
                  border
                  tone={selected ? "primary" : "transparent"}
                  style={{ cursor: "pointer" }}
                  onClick={() => selectVariant(v.assetId)}
                >
                  <Stack space={2}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.url}
                      alt="Variante générée"
                      style={{ width: "100%", height: "auto", borderRadius: 4 }}
                    />
                    {selected && <Text size={0} weight="semibold">✓ sélectionnée</Text>}
                  </Stack>
                </Card>
              );
            })}
          </Grid>
          <Flex gap={3}>
            <Button mode="ghost" text="↺ Regénérer 4 nouvelles variantes" onClick={fetchImages} padding={3} />
            <Button mode="ghost" text="Aucune (choisir plus tard)" onClick={skip} padding={3} />
          </Flex>
        </Stack>
      )}

      {error && (
        <Card padding={4} radius={2} tone="critical">
          <Text size={1}>Erreur : {error}</Text>
        </Card>
      )}

      <Flex justify="space-between" gap={3} paddingTop={3}>
        <Button mode="ghost" text="← Retour" onClick={onBack} disabled={loading} padding={3} />
        <Flex gap={3}>
          <Button mode="ghost" tone="critical" text="Annuler" onClick={onCancel} disabled={loading} padding={3} />
          <Button
            tone="primary"
            text="Injecter dans le doc →"
            onClick={onNext}
            disabled={!canContinue || loading}
            padding={3}
          />
        </Flex>
      </Flex>
    </Stack>
  );
}
