import { defineType, defineField } from "sanity";

const legalFields = [
  defineField({
    name: "title",
    title: "Titre",
    type: "string",
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: "lastUpdated",
    title: "Dernière mise à jour",
    type: "date",
  }),
  defineField({
    name: "body",
    title: "Contenu",
    type: "blockContent",
    validation: (Rule) => Rule.required(),
  }),
  defineField({ name: "seo", title: "SEO", type: "seo" }),
];

export const mentionsLegales = defineType({
  name: "mentionsLegales",
  title: "Mentions légales",
  type: "document",
  fields: legalFields,
  preview: { prepare: () => ({ title: "Mentions légales" }) },
});

export const politiqueConfidentialite = defineType({
  name: "politiqueConfidentialite",
  title: "Politique de confidentialité",
  type: "document",
  fields: legalFields,
  preview: { prepare: () => ({ title: "Politique de confidentialité" }) },
});
