import { defineType, defineField } from "sanity";

export const pack = defineType({
  name: "pack",
  title: "Pack",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nom du pack",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Mariage", value: "mariage" },
          { title: "Événement (corporate, anniversaire…)", value: "evenement" },
          { title: "Celebration (Espace Events — cérémonies assises)", value: "celebration" },
          { title: "Fiesta (Espace Events — soirées debout)", value: "fiesta" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "level",
      title: "Niveau (pour Pack Celebration)",
      type: "string",
      options: {
        list: [
          { title: "Classic", value: "classic" },
          { title: "Premium", value: "premium" },
          { title: "Prestige", value: "prestige" },
        ],
      },
      hidden: ({ document }) => document?.type !== "celebration",
    }),
    defineField({
      name: "tagline",
      title: "Accroche courte",
      type: "string",
      description: 'Ex : "L\'essentiel pour célébrer votre événement en toute simplicité."',
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: "description",
      title: "Description complète",
      type: "blockContent",
    }),
    defineField({
      name: "priceFrom",
      title: "Prix « à partir de »",
      type: "number",
      description: "En euros, sans le symbole. Laisser vide pour ne pas afficher.",
    }),
    defineField({
      name: "priceLabel",
      title: "Libellé du prix",
      type: "string",
      description: 'Override du prix. Ex : "Sur devis", "À partir de 1 500 €"',
    }),
    defineField({
      name: "image",
      title: "Image principale",
      type: "imageWithAlt",
    }),
    defineField({
      name: "includedItems",
      title: "Inclus dans le pack",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "excludedItems",
      title: "Non inclus / en options",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "cta",
      title: "Bouton d'action",
      type: "cta",
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Mis en avant",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Ordre manuel",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", type: "type", media: "image", price: "priceFrom" },
    prepare: ({ title, type, media, price }) => ({
      title,
      subtitle: [type, price ? `À partir de ${price} €` : null].filter(Boolean).join(" · "),
      media,
    }),
  },
});
