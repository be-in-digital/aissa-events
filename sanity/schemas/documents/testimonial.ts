import { defineType, defineField } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Témoignage",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Citation",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required().min(20).max(800),
    }),
    defineField({
      name: "authorName",
      title: "Nom de l'auteur",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Rôle / contexte",
      type: "string",
      description: 'Ex : "Mariée, juin 2025", "Directeur RH chez XYZ"',
    }),
    defineField({
      name: "authorImage",
      title: "Photo (optionnelle)",
      type: "imageWithAlt",
    }),
    defineField({
      name: "rating",
      title: "Note (sur 5)",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: "eventType",
      title: "Type d'événement",
      type: "string",
      options: {
        list: [
          { title: "Mariage", value: "mariage" },
          { title: "Anniversaire", value: "anniversaire" },
          { title: "Événement corporate", value: "corporate" },
          { title: "Cérémonie", value: "ceremonie" },
          { title: "Espace Events (location salle)", value: "espace" },
          { title: "Autre", value: "autre" },
        ],
      },
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      options: {
        list: [
          { title: "Direct (client)", value: "direct" },
          { title: "Google Reviews", value: "google" },
          { title: "Instagram", value: "instagram" },
          { title: "TikTok", value: "tiktok" },
          { title: "Placeholder (à remplacer)", value: "placeholder" },
        ],
      },
      initialValue: "direct",
    }),
    defineField({
      name: "linkedRealisation",
      title: "Réalisation associée",
      type: "reference",
      to: [{ type: "realisation" }],
    }),
    defineField({
      name: "featured",
      title: "Mis en avant",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Ordre",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "authorName", subtitle: "quote", media: "authorImage" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Témoignage anonyme",
      subtitle: subtitle ? `« ${subtitle.slice(0, 80)}${subtitle.length > 80 ? "…" : ""} »` : undefined,
      media,
    }),
  },
});
