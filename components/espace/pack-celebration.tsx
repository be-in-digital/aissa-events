"use client";

import { buildCalendlyUrl } from "@/lib/calendly";
import { resolveCta } from "@/lib/sanity/cta";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";
import { PackBlock, type Pack } from "./pack-block";
import { ComparisonTable, type ComparisonRow } from "./comparison-table";

type PacksData = NonNullable<EspaceEventsPageQueryResult>["packs"];

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Location de la salle", values: [true, true, true] },
  { label: "Terrasse / Verrière / Vestiaires / Cuisine", values: [true, true, true] },
  { label: "Nettoyage & ménage fin d'événement", values: [true, true, true] },
  { label: "Sono JBL + micro + lumières", values: [true, true, true] },
  { label: "Mobilier (chaises Napoléon + tables)", values: [true, true, true] },
  { label: "Décoration tables (thème Chic / Bohème / Afro)", values: [false, true, true] },
  { label: "Coin mariés signature ou arche ballons", values: [false, true, true] },
  { label: "3 colonnes décoratives", values: [false, true, true] },
  { label: "Ensemble vaisselles", values: [false, false, true] },
  { label: "Décoration verrière & terrasse", values: [false, false, true] },
  { label: "Coordination & présence Jour J", values: [false, false, true] },
];

function formatPriceNumber(value: number): string {
  return value.toLocaleString("fr-FR");
}

function parsePrice(priceLabel: string | null | undefined, priceFrom: number | null | undefined): string {
  if (typeof priceFrom === "number" && priceFrom > 0) {
    return formatPriceNumber(priceFrom);
  }
  if (priceLabel) {
    const match = priceLabel.match(/[\d\s.,]+/);
    if (match) return match[0].trim();
  }
  return "Sur devis";
}

export function PackCelebration({ data }: { data?: PacksData }) {
  if (data?.enabled === false) return null;

  const sanityPacks = data?.packs ?? [];
  if (sanityPacks.length < 3) return null;

  const mapped = sanityPacks.slice(0, 3).map((p, i): Pack => {
    const cta = resolveCta(p.cta ?? null);
    const slugForCalendly = (p.title ?? "").toLowerCase().replace(/\s+/g, "-");
    const features = [
      ...(p.includedItems ?? []).map((label) => ({ label, option: false })),
      ...(p.excludedItems ?? []).map((label) => ({ label, option: true })),
    ];
    const sectionLabel =
      i === 0
        ? "Inclus dans le pack"
        : i === 1
          ? "Tout le Classic, plus :"
          : "Tout le Premium, plus :";
    return {
      num: `Pack ${String(i + 1).padStart(2, "0")}`,
      name: p.title ?? "",
      tagline: p.tagline ?? "",
      price: parsePrice(p.priceLabel, p.priceFrom),
      featured: p.featured ?? false,
      badge: p.featured ? "Le plus choisi" : undefined,
      sectionLabel,
      features,
      ctaLabel: cta?.label ?? "Réserver un appel",
      ctaHref:
        cta?.href ??
        buildCalendlyUrl({ content: `pack-celebration-${slugForCalendly}` }),
    };
  });
  const packs: [Pack, Pack, Pack] = [mapped[0], mapped[1], mapped[2]];

  if (!data?.eyebrow || !data?.intro) return null;

  return (
    <>
      <PackBlock
        id="pack-celebration"
        background="warm"
        eyebrow={data.eyebrow}
        titleTop="Pour les cérémonies"
        titleItalic="assises."
        intro={data.intro}
        contextLabel="Conditions communes"
        contextText="50 personnes max · Installation & démontage inclus · Samedi/Férié 12h · Dimanche 10h-22h"
        contextNote="Aïssa présente sur la coordination des Jours J (Pack Prestige)"
        packs={packs}
      />
      <ComparisonTable
        collapsible
        titleStart="Pack Célébration"
        titleItalic="en détail"
        subtitle="Toutes les inclusions des trois formules Pack Célébration, à comparer en un coup d'œil"
        columns={[
          { name: packs[0].name, price: `${packs[0].price} €` },
          { name: packs[1].name, price: `${packs[1].price} €`, featured: true },
          { name: packs[2].name, price: `${packs[2].price} €` },
        ]}
        rows={COMPARISON_ROWS}
      />
    </>
  );
}
