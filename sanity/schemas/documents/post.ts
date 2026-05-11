import { defineType, defineField } from "sanity";

export const post = defineType({
  name: "post",
  title: "Article de blog",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (Rule) => Rule.required().min(10).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Extrait",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().min(50).max(280),
      description: "Affiché en liste et utilisé comme description SEO si non spécifié.",
    }),
    defineField({
      name: "cover",
      title: "Image de couverture",
      type: "imageWithAlt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Temps de lecture (minutes)",
      type: "number",
      description: "Calculé automatiquement si laissé vide.",
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "seo", type: "seo", title: "SEO" }),
  ],
  orderings: [
    {
      title: "Date publication (récent)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", media: "cover", date: "publishedAt", category: "category.title" },
    prepare: ({ title, media, date, category }) => ({
      title,
      subtitle: [category, date ? new Date(date).toLocaleDateString("fr-FR") : null].filter(Boolean).join(" · "),
      media,
    }),
  },
});
