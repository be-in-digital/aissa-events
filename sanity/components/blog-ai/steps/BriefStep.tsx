import { AddIcon, ComposeSparklesIcon } from "@sanity/icons";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Flex,
  Select,
  Stack,
  Text,
  TextArea,
  TextInput,
} from "@sanity/ui";
import { useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";

import type { BriefInput } from "@/lib/blog/types";
import { env } from "@/env";

import { callSuggestKeypoints } from "../api-client";
import type { StepProps } from "../types";

interface CategoryOption {
  _id: string;
  title: string;
  slug: string;
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function BriefStep({ state, onUpdate, onNext, onCancel }: StepProps) {
  const client = useClient({ apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION });
  const brief = state.brief;

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [creatingInProgress, setCreatingInProgress] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [seoKeywordsRaw, setSeoKeywordsRaw] = useState(
    () => (brief.seoKeywords ?? []).join("\n"),
  );
  const [keyPointsRaw, setKeyPointsRaw] = useState(
    () => (brief.keyPoints ?? []).join("\n"),
  );
  const [suggestingKeypoints, setSuggestingKeypoints] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  const canSuggestKeypoints =
    (brief.subject?.length ?? 0) >= 5 &&
    (brief.audience?.length ?? 0) >= 3 &&
    (brief.angle?.length ?? 0) >= 3;

  const handleSuggestKeypoints = async () => {
    if (!canSuggestKeypoints || suggestingKeypoints) return;
    setSuggestingKeypoints(true);
    setSuggestError(null);
    try {
      const { keyPoints } = await callSuggestKeypoints({
        subject: brief.subject ?? "",
        audience: brief.audience ?? "",
        angle: brief.angle ?? "",
        intent: brief.intent ?? "info",
        seoKeywords: brief.seoKeywords,
      });
      const raw = keyPoints.join("\n");
      setKeyPointsRaw(raw);
      update({ keyPoints });
    } catch (err) {
      setSuggestError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSuggestingKeypoints(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    client
      .fetch<CategoryOption[]>(
        `*[_type=="category" && !(_id in path("drafts.**"))]|order(title asc){_id, title, "slug": slug.current}`,
      )
      .then((cats) => {
        if (cancelled) return;
        setCategories(cats);
        setLoadingCategories(false);
      })
      .catch(() => {
        if (!cancelled) setLoadingCategories(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client]);

  const update = (patch: Partial<BriefInput>) => {
    onUpdate({ brief: { ...brief, ...patch } });
  };

  const handleCreateCategory = async () => {
    const title = newCategoryTitle.trim();
    if (title.length < 2) {
      setCreateError("Le nom doit faire au moins 2 caractères");
      return;
    }
    const slug = slugify(title);
    if (!slug) {
      setCreateError("Nom invalide");
      return;
    }
    if (categories.some((c) => c.slug === slug)) {
      setCreateError(`La catégorie « ${slug} » existe déjà`);
      return;
    }
    setCreatingInProgress(true);
    setCreateError(null);
    try {
      const created = await client.create({
        _type: "category",
        title,
        slug: { _type: "slug", current: slug },
      });
      const option: CategoryOption = { _id: created._id, title, slug };
      setCategories((prev) =>
        [...prev, option].sort((a, b) => a.title.localeCompare(b.title)),
      );
      update({ categorySlug: slug });
      setCreatingCategory(false);
      setNewCategoryTitle("");
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Erreur création");
    } finally {
      setCreatingInProgress(false);
    }
  };

  const cancelCreate = () => {
    setCreatingCategory(false);
    setNewCategoryTitle("");
    setCreateError(null);
  };

  const isValid = useMemo(() => {
    return (
      (brief.subject?.length ?? 0) >= 5 &&
      (brief.audience?.length ?? 0) >= 3 &&
      (brief.angle?.length ?? 0) >= 3 &&
      (brief.keyPoints?.length ?? 0) >= 1 &&
      (brief.categorySlug?.length ?? 0) >= 1 &&
      (brief.targetWordCount ?? 0) >= 300
    );
  }, [brief]);

  const parseList = (raw: string): string[] =>
    raw
      .split(/\n|;/)
      .map((s) => s.trim())
      .filter(Boolean);

  return (
    <Stack space={5} padding={5}>
      <Card padding={4} radius={2} tone="primary">
        <Text size={1}>
          <strong>Étape 1/5 — Brief.</strong> Plus le brief est riche, moins l&apos;article sonnera IA.
          Compte 3-5 minutes pour le remplir avec soin.
        </Text>
      </Card>

      <Stack space={5}>
        <Stack space={2}>
          <Text size={1} weight="semibold">Sujet *</Text>
          <TextInput
            value={brief.subject ?? ""}
            onChange={(e) => update({ subject: e.currentTarget.value })}
            placeholder="Ex : Comment se passe un premier rendez-vous avec une wedding planner"
          />
        </Stack>

        <Stack space={2}>
          <Text size={1} weight="semibold">Audience *</Text>
          <TextInput
            value={brief.audience ?? ""}
            onChange={(e) => update({ audience: e.currentTarget.value })}
            placeholder="Ex : fiancés en début de préparatifs, IDF, budget moyen 30-50k"
          />
        </Stack>

        <Stack space={2}>
          <Text size={1} weight="semibold">Intention</Text>
          <Select
            value={brief.intent ?? "info"}
            fontSize={2}
            padding={3}
            radius={2}
            onChange={(e) => update({ intent: e.currentTarget.value as BriefInput["intent"] })}
          >
            <option value="info">Informatif — apporter de la valeur, expliquer</option>
            <option value="seo">SEO — viser un mot-clé précis</option>
            <option value="lead-gen">Lead-gen — pousser au RDV / contact</option>
            <option value="mixed">Mixte — info + SEO + lead-gen</option>
          </Select>
        </Stack>

        <Stack space={2}>
          <Text size={1} weight="semibold">Angle éditorial *</Text>
          <TextInput
            value={brief.angle ?? ""}
            onChange={(e) => update({ angle: e.currentTarget.value })}
            placeholder="Ex : guide pratique étape par étape, du point de vue d'Aïssa qui reçoit en RDV"
          />
        </Stack>

        <Stack space={2}>
          <Text size={1} weight="semibold">Mots-clés SEO locaux (un par ligne ou ;)</Text>
          <TextArea
            rows={3}
            value={seoKeywordsRaw}
            onChange={(e) => {
              const raw = e.currentTarget.value;
              setSeoKeywordsRaw(raw);
              update({ seoKeywords: parseList(raw) });
            }}
            placeholder={"wedding planner Émerainville\nwedding planner 77\nwedding planner Seine-et-Marne"}
          />
          <Text size={0} muted>
            Aïssa Events est à Émerainville (77). Glisse des références locales naturelles, pas en surcharge.
          </Text>
        </Stack>

        <Stack space={2}>
          <Text size={1} weight="semibold">Longueur cible (mots)</Text>
          <TextInput
            type="number"
            value={String(brief.targetWordCount ?? 900)}
            onChange={(e) => update({ targetWordCount: parseInt(e.currentTarget.value, 10) || 900 })}
          />
          <Text size={0} muted>
            Typiquement 600-1500 mots. Trop court = peu de valeur. Trop long = lecture en diagonale.
          </Text>
        </Stack>

        <Stack space={2}>
          <Flex justify="space-between" align="center" gap={3}>
            <Text size={1} weight="semibold">Points-clés à couvrir * (un par ligne)</Text>
            <Button
              mode="ghost"
              icon={ComposeSparklesIcon}
              text={suggestingKeypoints ? "Suggestion…" : "Suggérer"}
              onClick={handleSuggestKeypoints}
              disabled={!canSuggestKeypoints || suggestingKeypoints}
              padding={2}
              fontSize={1}
            />
          </Flex>
          <TextArea
            rows={5}
            value={keyPointsRaw}
            onChange={(e) => {
              const raw = e.currentTarget.value;
              setKeyPointsRaw(raw);
              update({ keyPoints: parseList(raw) });
            }}
            placeholder={"Comment se déroule le premier RDV\nQuelles informations préparer en amont\nCe qu'Aïssa cherche à comprendre du couple\nLe livrable concret après le RDV"}
          />
          {suggestError && (
            <Card padding={2} radius={2} tone="critical">
              <Text size={0}>{suggestError}</Text>
            </Card>
          )}
          <Text size={0} muted>
            3-5 points qui structurent vraiment l&apos;article. Plus c&apos;est concret, mieux c&apos;est.
            {!canSuggestKeypoints &&
              " — Remplis d'abord Sujet + Audience + Angle pour activer la suggestion IA."}
          </Text>
        </Stack>

        <Stack space={2}>
          <Text size={1} weight="semibold">Catégorie *</Text>
          {!creatingCategory && (
            <>
              <Flex gap={2} align="center">
                <Box flex={1}>
                  <Autocomplete
                    id="brief-category"
                    fontSize={2}
                    padding={3}
                    radius={2}
                    options={categories.map((c) => ({ value: c.slug, title: c.title }))}
                    value={brief.categorySlug ?? ""}
                    loading={loadingCategories}
                    openButton
                    openOnFocus
                    placeholder="Rechercher ou choisir une catégorie…"
                    filterOption={(query, option) =>
                      option.title.toLowerCase().includes(query.toLowerCase())
                    }
                    renderOption={(option) => (
                      <Card as="button" padding={3} radius={2}>
                        <Text size={2}>{option.title}</Text>
                      </Card>
                    )}
                    renderValue={(value, option) => option?.title ?? value}
                    onSelect={(value) => update({ categorySlug: value })}
                  />
                </Box>
                <Button
                  mode="ghost"
                  icon={AddIcon}
                  text="Créer"
                  onClick={() => setCreatingCategory(true)}
                  padding={3}
                />
              </Flex>
              {!loadingCategories && categories.length === 0 && (
                <Text size={0} muted>
                  Aucune catégorie n&apos;existe encore. Clique « Créer » pour en ajouter une.
                </Text>
              )}
            </>
          )}
          {creatingCategory && (
            <Card padding={3} radius={2} tone="transparent" border>
              <Stack space={3}>
                <Text size={1} weight="semibold">Nouvelle catégorie</Text>
                <Stack space={2}>
                  <Text size={0} muted>Nom</Text>
                  <TextInput
                    value={newCategoryTitle}
                    onChange={(e) => setNewCategoryTitle(e.currentTarget.value)}
                    placeholder="Ex : Mariages"
                    autoFocus
                    disabled={creatingInProgress}
                  />
                  <Text size={0} muted>
                    Slug auto : {newCategoryTitle ? slugify(newCategoryTitle) || "—" : "—"}
                  </Text>
                </Stack>
                {createError && (
                  <Card padding={2} radius={2} tone="critical">
                    <Text size={0}>{createError}</Text>
                  </Card>
                )}
                <Flex gap={2}>
                  <Button
                    mode="ghost"
                    text="Annuler"
                    onClick={cancelCreate}
                    disabled={creatingInProgress}
                    padding={3}
                  />
                  <Button
                    tone="primary"
                    text={creatingInProgress ? "Création…" : "Créer la catégorie"}
                    onClick={handleCreateCategory}
                    disabled={creatingInProgress || newCategoryTitle.trim().length < 2}
                    padding={3}
                  />
                </Flex>
              </Stack>
            </Card>
          )}
        </Stack>
      </Stack>

      <Flex justify="space-between" gap={3} paddingTop={3}>
        <Button mode="ghost" tone="critical" text="Annuler" onClick={onCancel} padding={3} />
        <Button
          tone="primary"
          text="Continuer →"
          disabled={!isValid}
          onClick={onNext}
          padding={3}
        />
      </Flex>
    </Stack>
  );
}
