import { defineType, defineField } from "sanity";

export const realisationsPage = defineType({
  name: "realisationsPage",
  title: "Page Réalisations (index)",
  type: "document",
  groups: [
    { name: "hero", title: "1. Hero", default: true },
    { name: "trust", title: "2. Bandeau crédibilité" },
    { name: "intro", title: "3. Intro" },
    { name: "filters", title: "4. Filtres" },
    { name: "caseStudies", title: "5. Études de cas" },
    { name: "finalCta", title: "6. CTA final" },
    { name: "sticky", title: "Sticky CTA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "hero", title: "Hero", type: "heroSection", group: "hero" }),
    defineField({ name: "trustBar", title: "Bandeau crédibilité", type: "trustBarSection", group: "trust" }),
    defineField({
      name: "introText",
      title: "Texte d'intro (sous le hero)",
      type: "blockContent",
      group: "intro",
    }),
    defineField({
      name: "galleryEyebrow",
      title: "Suréclat galerie",
      type: "string",
      group: "filters",
      initialValue: "Toutes nos réalisations",
    }),
    defineField({
      name: "galleryTitle",
      title: "Titre galerie",
      type: "string",
      group: "filters",
    }),
    defineField({
      name: "filters",
      title: "Filtres disponibles",
      type: "array",
      group: "filters",
      description: "Filtres affichés au-dessus de la galerie. L'ordre détermine l'affichage.",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Libellé du filtre", validation: (Rule) => Rule.required() },
            {
              name: "value",
              type: "string",
              title: "Valeur (clé)",
              description: 'Doit correspondre à un type de réalisation : all, mariage, anniversaire, corporate, ceremonie, henne, babyshower, autre',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
    defineField({ name: "caseStudies", title: "Études de cas (mises en avant)", type: "caseStudiesSection", group: "caseStudies" }),
    defineField({ name: "finalCta", title: "CTA final", type: "ctaSection", group: "finalCta" }),
    defineField({ name: "stickyCta", title: "Bouton flottant", type: "stickyCtaSection", group: "sticky" }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Page Réalisations" }) },
});
