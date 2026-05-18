import { Stack, Card, Text, Button, Flex, Box, Spinner } from "@sanity/ui";
import { useEffect, useState } from "react";

import type { BriefInput, SectionResult } from "@/lib/blog/types";

import { callGenerateSection } from "../api-client";
import type { StepProps } from "../types";

interface SectionTask {
  sectionId: string;
  label: string;
  status: "pending" | "generating" | "done" | "error";
  errorMsg?: string;
}

function buildSectionTasks(plan: { title: string; children: { title: string }[] }[]): SectionTask[] {
  return plan.map((h2, i) => ({
    sectionId: `h2-${i}`,
    label: `${i + 1}. ${h2.title}`,
    status: "pending" as const,
  }));
}

export function GenerationStep({ state, onUpdate, onNext, onBack, onCancel }: StepProps) {
  const skeleton = state.skeleton;
  const [tasks, setTasks] = useState<SectionTask[]>(() =>
    skeleton ? buildSectionTasks(skeleton.plan) : [],
  );
  const [running, setRunning] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    if (!skeleton || running || state.sections.length === tasks.length) return;

    async function runAll() {
      if (!skeleton) return;
      setRunning(true);
      setGlobalError(null);

      const completed: SectionResult[] = [...state.sections];
      const currentTasks: SectionTask[] = [...tasks];

      for (let i = state.sections.length; i < currentTasks.length; i += 1) {
        currentTasks[i] = { ...currentTasks[i], status: "generating" };
        setTasks([...currentTasks]);

        try {
          const { section } = await callGenerateSection({
            brief: state.brief as BriefInput,
            skeleton,
            sectionId: currentTasks[i].sectionId,
            previousSections: completed.map((c) => ({
              sectionId: c.sectionId,
              markdown: c.markdown,
            })),
          });
          completed.push(section);
          currentTasks[i] = { ...currentTasks[i], status: "done" };
          setTasks([...currentTasks]);
          onUpdate({ sections: [...completed] });
        } catch (err) {
          currentTasks[i] = {
            ...currentTasks[i],
            status: "error",
            errorMsg: err instanceof Error ? err.message : "unknown",
          };
          setTasks([...currentTasks]);
          setGlobalError(err instanceof Error ? err.message : "Erreur génération");
          setRunning(false);
          return;
        }
      }

      setRunning(false);
    }

    runAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allDone = tasks.every((t) => t.status === "done") && tasks.length > 0;

  return (
    <Stack space={5} padding={5}>
      <Card padding={4} radius={2} tone="primary">
        <Text size={1}>
          <strong>Étape 3/5 — Génération.</strong> Chaque section est rédigée à partir de
          ta voix de référence (BRAND_VOICE.md) puis nettoyée des marqueurs IA classiques.
          ~30-60 s par section.
        </Text>
      </Card>

      <Stack space={3}>
        {tasks.map((t) => (
          <Card key={t.sectionId} padding={3} radius={2} tone="transparent" border>
            <Flex align="center" gap={3}>
              <Box style={{ width: 24 }}>
                {t.status === "pending" && <Text muted>·</Text>}
                {t.status === "generating" && <Spinner muted />}
                {t.status === "done" && <Text style={{ color: "green" }}>✓</Text>}
                {t.status === "error" && <Text style={{ color: "red" }}>✗</Text>}
              </Box>
              <Box flex={1}>
                <Stack space={1}>
                  <Text size={1}>{t.label}</Text>
                  {t.errorMsg && (
                    <Text size={0} style={{ color: "red" }}>{t.errorMsg}</Text>
                  )}
                </Stack>
              </Box>
            </Flex>
          </Card>
        ))}
      </Stack>

      {globalError && (
        <Card padding={4} radius={2} tone="critical">
          <Text size={1}>Erreur : {globalError}</Text>
        </Card>
      )}

      <Flex justify="space-between" gap={3} paddingTop={3}>
        <Button mode="ghost" text="← Retour" onClick={onBack} disabled={running} padding={3} />
        <Flex gap={3}>
          <Button mode="ghost" tone="critical" text="Annuler" onClick={onCancel} disabled={running} padding={3} />
          <Button
            tone="primary"
            text="Continuer vers la relecture →"
            onClick={onNext}
            disabled={!allDone}
            padding={3}
          />
        </Flex>
      </Flex>
    </Stack>
  );
}
