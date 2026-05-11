"use client";

import { buildCalendlyUrl } from "@/lib/calendly";
import { resolveCta } from "@/lib/sanity/cta";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";
import { PackBlock, type Pack } from "./pack-block";
import { ComparisonTable, type ComparisonRow } from "./comparison-table";

type PacksFiestaData = NonNullable<EspaceEventsPageQueryResult>["packsFiesta"];

const FALLBACK_PACKS: [Pack, Pack, Pack] = [
  {
    num: "Pack 01",
    name: "Classic",
    tagline: "L'essentiel : salle, sono, mobilier, ménage.",
    price: "1 000",
    sectionLabel: "Inclus dans le pack",
    features: [
      { label: "Location de la salle" },
      { label: "Terrasse, verrière, vestiaires & cuisine" },
      { label: "Nettoyage & ménage fin d'événement" },
      { label: "Sono JBL + micro + lumières" },
      { label: "Mobilier buffet + mange-debout + chaises" },
      { label: "Décoration · DJ · Coordination", option: true },
    ],
    ctaLabel: "Réserver un appel",
    ctaHref: buildCalendlyUrl({ content: "pack-fiesta-classic" }),
  },
  {
    num: "Pack 02",
    name: "Fiesta",
    tagline: "Classic + arche ballons, lumineux et colonnes.",
    price: "1 290",
    featured: true,
    badge: "Le plus choisi",
    sectionLabel: "Tout le Classic, plus :",
    features: [
      { label: "Arche de ballons + fond décoratif au choix" },
      { label: "« Happy Birthday » lumineux" },
      { label: "3 colonnes décoratives" },
      { label: "DJ scénographié · Coordination prestataires", option: true },
    ],
    ctaLabel: "Réserver le Fiesta",
    ctaHref: buildCalendlyUrl({ content: "pack-fiesta-fiesta" }),
  },
  {
    num: "Pack 03",
    name: "Ambiance",
    tagline: "Tout inclus + DJ AïssaEvents 4h et coordination.",
    price: "1 750",
    sectionLabel: "Tout le Fiesta, plus :",
    features: [
      { label: "DJ AïssaEvents (4h de présence)" },
      { label: "Ambiance musicale construite avec vous" },
      { label: "Coordination prestataires" },
      { label: "Accompagnement complet (Aïssa + alternants)" },
    ],
    ctaLabel: "Réserver l'Ambiance",
    ctaHref: buildCalendlyUrl({ content: "pack-fiesta-ambiance" }),
  },
];

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

  let packs: [Pack, Pack, Pack];
  if (sanityPacks.length >= 3) {
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
    packs = [mapped[0], mapped[1], mapped[2]];
  } else {
    packs = FALLBACK_PACKS;
  }

  const eyebrow = data?.eyebrow ?? "Pack Fiesta · Événements debout";
  const introText =
    data?.intro ??
    "Configuration debout jusqu'à 60 personnes. Pour anniversaires, baby showers, gender reveal, EVJF, fêtes privées, cocktails. Salle, sono JBL, mobilier (mange-debout, chaises) et ménage inclus dans les trois formules. La déco festive arrive au Fiesta, le DJ AïssaEvents au Ambiance.";

  return (
    <>
      <PackBlock
        id="pack-fiesta"
        background="cream"
        eyebrow={eyebrow}
        titleTop="Pour les soirées"
        titleItalic="debout."
        intro={introText}
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
