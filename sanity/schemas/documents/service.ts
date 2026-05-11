import { defineType, defineField } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service à la carte",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nom du service",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(80),
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          { title: "Coordination & organisation", value: "coordination" },
          { title: "Décoration & scénographie", value: "decoration" },
          { title: "Animation & talents (DJ, artistes…)", value: "talent" },
          { title: "Logistique & technique", value: "logistique" },
          { title: "Lieu / espace", value: "lieu" },
          { title: "Autre", value: "autre" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "scope",
      title: "Visible sur",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Page Mariage", value: "mariage" },
          { title: "Page Événement", value: "evenement" },
          { title: "Page Espace Events", value: "espace" },
        ],
      },
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "icon",
      title: "Icône (lucide-react)",
      type: "string",
      description: "Ex : music, sparkles, party-popper, calendar, building",
    }),
    defineField({
      name: "priceLabel",
      title: "Indication tarifaire",
      type: "string",
      description: 'Optionnel. Ex : "Sur devis", "À partir de 250 €"',
    }),
    defineField({
      name: "order",
      title: "Ordre",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category" },
  },
});
