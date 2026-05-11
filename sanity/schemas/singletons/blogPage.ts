import { defineType, defineField } from "sanity";

export const blogPage = defineType({
  name: "blogPage",
  title: "Page Blog (index)",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "list", title: "Liste d'articles" },
    { name: "articleCta", title: "CTA en fin d'article" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Suréclat",
      type: "string",
      group: "hero",
      initialValue: "Inspirations & conseils",
    }),
    defineField({
      name: "title",
      title: "Titre de page",
      type: "string",
      group: "hero",
      initialValue: "Le journal d'Aïssa Events",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      group: "hero",
    }),
    defineField({
      name: "emptyStateTitle",
      title: "Titre quand aucun article",
      type: "string",
      group: "list",
      initialValue: "Bientôt en ligne",
    }),
    defineField({
      name: "emptyStateMessage",
      title: "Message quand aucun article",
      type: "text",
      rows: 3,
      group: "list",
    }),
    defineField({
      name: "articleCta",
      title: "CTA affiché en fin de chaque article",
      type: "ctaSection",
      group: "articleCta",
      description:
        "Bloc CTA partagé pour tous les articles de blog (titre + description + 1-2 boutons).",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Page Blog" }) },
});
