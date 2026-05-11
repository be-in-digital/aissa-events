import { defineType, defineField } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "Question FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required().min(5).max(200),
    }),
    defineField({
      name: "answer",
      title: "Réponse",
      type: "blockContent",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "scope",
      title: "Visible sur",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Page d'accueil", value: "homepage" },
          { title: "Mariage", value: "mariage" },
          { title: "Événement", value: "evenement" },
          { title: "Espace Events", value: "espace" },
        ],
      },
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "order",
      title: "Ordre",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "question", scope: "scope" },
    prepare: ({ title, scope }) => ({
      title,
      subtitle: scope?.join(", "),
    }),
  },
});
