"use client";

import { buildCalendlyUrl } from "@/lib/calendly";
import { resolveCta } from "@/lib/sanity/cta";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";
import { PackBlock, type Pack } from "./pack-block";
import { ComparisonTable, type ComparisonRow } from "./comparison-table";

type PacksFiestaData = NonNullable<EspaceEventsPageQueryResult>["packsFiesta"];

const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Location de la salle", values: [true, true, true] },
  { label: "Terrasse / Verrière / Vestiaires / Cuisine", values: [true, true, true] },
  { label: "Nettoyage & ménage fin d'événement", values: [true, true, true] },
  { label: "Sono JBL + micro + lumières", values: [true, true, true] },
  { label: "Mobilier buffet + mange-debout + chaises", values: [true, true, true] },
  { label: "Arche ballons + fond décoratif", values: [false, true, true] },
  { label: "« Happy Birthday » lumineux", values: [false, true, true] },
  { label: "3 colonnes décoratives", values: [false, true, true] },
  { label: "DJ & ambiance musicale scénarisée (4h)", values: [false, false, true] },
  { label: "Coordination prestataires", values: [false, false, true] },
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

export function PackFiesta({ data }: { data?: PacksFiestaData }) {
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
          : "Tout le Fiesta, plus :";
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
        buildCalendlyUrl({ content: `pack-fiesta-${slugForCalendly}` }),
    };
  });
  const packs: [Pack, Pack, Pack] = [mapped[0], mapped[1], mapped[2]];

  if (!data?.eyebrow || !data?.intro) return null;

  return (
    <>
      <PackBlock
        id="pack-fiesta"
        background="cream"
        eyebrow={data.eyebrow}
        titleTop="Pour les soirées"
        titleItalic="debout."
        intro={data.intro}
        contextLabel="Conditions communes"
        contextText="50 personnes assises / 60 debout · Installation & démontage inclus · Samedi/Férié 12h · Dimanche 10h-22h"
        contextNote="DJ AïssaEvents inclus dans le Pack Ambiance (4h)"
        packs={packs}
      />
      <ComparisonTable
        collapsible
        titleStart="Pack Fiesta"
        titleItalic="en détail"
        subtitle="Toutes les inclusions des trois formules Pack Fiesta, à comparer en un coup d'œil"
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
