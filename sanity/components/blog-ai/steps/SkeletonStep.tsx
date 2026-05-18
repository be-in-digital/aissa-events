import { Stack, Card, Text, TextInput, TextArea, Button, Flex, Box, Spinner } from "@sanity/ui";
import { useEffect, useState } from "react";

import type { BriefInput, Skeleton } from "@/lib/blog/types";

import { callGenerateSkeleton } from "../api-client";
import type { StepProps } from "../types";

export function SkeletonStep({ state, onUpdate, onNext, onBack, onCancel }: StepProps) {
  const [loading, setLoading] = useState(state.skeleton === null);
  const [error, setError] = useState<string | null>(null);
  const skeleton = state.skeleton;

  useEffect(() => {
    let cancelled = false;
    if (skeleton !== null) return;

    async function fetchSkeleton() {
      setLoading(true);
      setError(null);
      try {
        const { skeleton: result } = await callGenerateSkeleton({
          brief: state.brief as BriefInput,
        });
        if (cancelled) return;
        onUpdate({ skeleton: result });
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSkeleton();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSkeleton = (patch: Partial<Skeleton>) => {
    if (!skeleton) return;
    onUpdate({ skeleton: { ...skeleton, ...patch } });
  };

  const updateH2Title = (index: number, title: string) => {
    if (!skeleton) return;
    const plan = skeleton.plan.map((h2, i) => (i === index ? { ...h2, title } : h2));
    updateSkeleton({ plan });
  };

  const removeH2 = (index: number) => {
    if (!skeleton) return;
    updateSkeleton({ plan: skeleton.plan.filter((_, i) => i !== index) });
  };

  const addH2 = () => {
    if (!skeleton) return;
    updateSkeleton({
      plan: [...skeleton.plan, { title: "Nouvelle section", children: [] }],
    });
  };

  if (loading) {
    return (
      <Stack space={5} padding={5} style={{ minHeight: 300 }}>
        <Card padding={4} radius={2} tone="primary">
          <Text size={1}>
            <strong>Étape 2/5 — Squelette.</strong> Génération en cours… (5-10 s)
          </Text>
        </Card>
        <Flex align="center" justify="center" padding={5}>
          <Spinner muted />
        </Flex>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack space={5} padding={5}>
        <Card padding={4} radius={2} tone="critical">
          <Text>Erreur : {error}</Text>
        </Card>
        <Flex justify="space-between" gap={3} paddingTop={3}>
          <Button mode="ghost" text="← Retour" onClick={onBack} padding={3} />
          <Button tone="critical" text="Annuler" onClick={onCancel} padding={3} />
        </Flex>
      </Stack>
    );
  }

  if (!skeleton) return null;

  return (
    <Stack space={5} padding={5}>
      <Card padding={4} radius={2} tone="primary">
        <Text size={1}>
          <strong>Étape 2/5 — Squelette.</strong> Vérifie le plan, modifie-le librement, puis lance la génération.
        </Text>
      </Card>

      <Stack space={5}>
        <Stack space={2}>
          <Text size={1} weight="semibold">Titre</Text>
          <TextInput value={skeleton.title} onChange={(e) => updateSkeleton({ title: e.currentTarget.value })} />
        </Stack>

        <Stack space={2}>
          <Text size={1} weight="semibold">Excerpt (accroche)</Text>
          <TextArea
            rows={2}
            value={skeleton.excerpt}
            onChange={(e) => updateSkeleton({ excerpt: e.currentTarget.value })}
          />
        </Stack>

        <Stack space={3}>
          <Text size={1} weight="semibold">Plan H2 ({skeleton.plan.length} sections)</Text>
          <Stack space={2}>
            {skeleton.plan.map((h2, i) => (
              <Card key={i} padding={3} radius={2} tone="transparent" border>
                <Stack space={2}>
                  <Flex gap={3} align="center">
                    <Text size={1} weight="semibold">{i + 1}.</Text>
                    <Box flex={1}>
                      <TextInput
                        value={h2.title}
                        onChange={(e) => updateH2Title(i, e.currentTarget.value)}
                      />
                    </Box>
                    <Button mode="bleed" tone="critical" text="✕" onClick={() => removeH2(i)} />
                  </Flex>
                  {h2.children.length > 0 && (
                    <Stack space={1} marginLeft={4}>
                      {h2.children.map((h3, j) => (
                        <Text size={0} muted key={j}>· {h3.title}</Text>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Card>
            ))}
          </Stack>
          <Box>
            <Button mode="ghost" text="+ Ajouter une section H2" onClick={addH2} padding={3} />
          </Box>
        </Stack>

        <Stack space={2}>
          <Text size={1} weight="semibold">Tags suggérés</Text>
          <Text size={0} muted>{skeleton.suggestedTags.join(" · ")}</Text>
        </Stack>

        <Stack space={3}>
          <Text size={1} weight="semibold">SEO meta</Text>
          <Card padding={3} radius={2} tone="transparent" border>
            <Stack space={3}>
              <Stack space={2}>
                <Text size={0} muted>Meta title</Text>
                <TextInput
                  value={skeleton.seo.metaTitle}
                  onChange={(e) => updateSkeleton({ seo: { ...skeleton.seo, metaTitle: e.currentTarget.value } })}
                />
              </Stack>
              <Stack space={2}>
                <Text size={0} muted>Meta description</Text>
                <TextArea
                  rows={2}
                  value={skeleton.seo.metaDescription}
                  onChange={(e) =>
                    updateSkeleton({ seo: { ...skeleton.seo, metaDescription: e.currentTarget.value } })
                  }
                />
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Stack>

      <Flex justify="space-between" gap={3} paddingTop={3}>
        <Button mode="ghost" text="← Retour" onClick={onBack} padding={3} />
        <Flex gap={3}>
          <Button mode="ghost" tone="critical" text="Annuler" onClick={onCancel} padding={3} />
          <Button tone="primary" text="Générer les sections →" onClick={onNext} padding={3} />
        </Flex>
      </Flex>
    </Stack>
  );
}
