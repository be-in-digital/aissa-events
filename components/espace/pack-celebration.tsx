"use client";

import { buildCalendlyUrl } from "@/lib/calendly";
import { resolveCta } from "@/lib/sanity/cta";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";
import { PackBlock, type Pack } from "./pack-block";
import { ComparisonTable, type ComparisonRow } from "./comparison-table";

type PacksData = NonNullable<EspaceEventsPageQueryResult>["packs"];

const FALLBACK_PACKS: [Pack, Pack, Pack] = [
  {
    num: "Pack 01",
    name: "Classic",
    tagline: "L'essentiel : salle, sono, mobilier, ménage.",
    price: "1 250",
    sectionLabel: "Inclus dans le pack",
    features: [
      { label: "Location de la salle" },
      { label: "Terrasse, verrière, vestiaires & cuisine" },
      { label: "Nettoyage & ménage fin d'événement" },
      { label: "Sono JBL + micro + lumières" },
      { label: "Mobilier (chaises Napoléon + tables)" },
      { label: "Décoration · Coin mariés · Coordination · Vaisselle", option: true },
    ],
    ctaLabel: "Réserver un appel",
    ctaHref: buildCalendlyUrl({ content: "pack-celebration-classic" }),
  },
  {
    num: "Pack 02",
    name: "Premium",
    tagline: "Classic + déco aux tables, coin mariés et colonnes.",
    price: "1 590",
    featured: true,
    badge: "Le plus choisi",
    sectionLabel: "Tout le Classic, plus :",
    features: [
      { label: "Décoration des tables au thème (Chic, Bohème ou Afro)" },
      { label: "Coin mariés signature (arche + canapé + table) ou arche ballons" },
      { label: "3 colonnes décoratives" },
      {
        label: "Ensemble vaisselles · Décoration verrière/terrasse · Coordination Jour J",
        option: true,
      },
    ],
    ctaLabel: "Réserver le Premium",
    ctaHref: buildCalendlyUrl({ content: "pack-celebration-premium" }),
  },
  {
    num: "Pack 03",
    name: "Prestige",
    tagline: "Tout inclus + vaisselle, déco verrière, coordination Jour J.",
    price: "1 880",
    sectionLabel: "Tout le Premium, plus :",
    features: [
      { label: "Ensemble vaisselles complet" },
      { label: "Décoration verrière & terrasse" },
      { label: "Coordination & présence le Jour J" },
      { label: "Accompagnement complet (Aïssa + alternants)" },
    ],
    ctaLabel: "Réserver le Prestige",
    ctaHref: buildCalendlyUrl({ content: "pack-celebration-prestige" }),
  },
];

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
    packs = [mapped[0], mapped[1], mapped[2]];
  } else {
    packs = FALLBACK_PACKS;
  }

  const eyebrow = data?.eyebrow ?? "Pack Célébration · Cérémonies assises";
  const introText =
    data?.intro ??
    "Configuration assise jusqu'à 50 personnes. Pour mariages civils, henné, baptêmes, cérémonies religieuses ou laïques. Salle, sono JBL, mobilier (chaises Napoléon, tables) et ménage inclus dans les trois formules. La déco se débloque au Premium, la coordination Jour J au Prestige.";

  return (
    <>
      <PackBlock
        id="pack-celebration"
        background="warm"
        eyebrow={eyebrow}
        titleTop="Pour les cérémonies"
        titleItalic="assises."
        intro={introText}
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
