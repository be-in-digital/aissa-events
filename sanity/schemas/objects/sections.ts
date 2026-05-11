import { defineType, defineField } from "sanity";

const enabledField = defineField({
  name: "enabled",
  title: "Section activée",
  type: "boolean",
  initialValue: true,
  description: "Décochez pour masquer cette section sur le site.",
});

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    enabledField,
    defineField({
      name: "eyebrow",
      title: "Suréclat (texte au-dessus du titre)",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Titre principal",
      type: "string",
      description: 'Encadrez les mots à mettre en italique avec _underscores_.',
      validation: (Rule) => Rule.required().min(5).max(160),
    }),
    defineField({
      name: "subtitle",
      title: "Sous-titre",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Image principale",
      type: "imageWithAlt",
    }),
    defineField({
      name: "ctas",
      title: "Boutons d'action",
      type: "array",
      of: [{ type: "cta" }],
      validation: (Rule) => Rule.max(2),
    }),
  ],
});

export const packsSection = defineType({
  name: "packsSection",
  title: "Packs",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({ name: "title", type: "string", title: "Titre" }),
    defineField({ name: "intro", type: "text", title: "Intro", rows: 2 }),
    defineField({
      name: "filterByType",
      title: "Filtrer les packs par type",
      type: "string",
      options: {
        list: [
          { title: "Tous", value: "all" },
          { title: "Mariage", value: "mariage" },
          { title: "Événement", value: "evenement" },
          { title: "Celebration (Espace Events)", value: "celebration" },
          { title: "Fiesta (Espace Events)", value: "fiesta" },
        ],
        layout: "radio",
      },
      initialValue: "all",
    }),
    defineField({
      name: "selectedPacks",
      title: "Packs à afficher (manuellement)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "pack" }] }],
      description: "Laisser vide pour afficher automatiquement selon le filtre ci-dessus.",
    }),
  ],
});

export const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Témoignages",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({ name: "title", type: "string", title: "Titre" }),
    defineField({
      name: "filterByType",
      title: "Filtrer par type d'événement",
      type: "string",
      options: {
        list: [
          { title: "Tous", value: "all" },
          { title: "Mariage", value: "mariage" },
          { title: "Événement", value: "evenement" },
          { title: "Espace Events", value: "espace" },
        ],
        layout: "radio",
      },
      initialValue: "all",
    }),
    defineField({
      name: "selectedTestimonials",
      title: "Témoignages sélectionnés",
      type: "array",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
    }),
  ],
});

export const gallerySection = defineType({
  name: "gallerySection",
  title: "Galerie photos",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({ name: "title", type: "string", title: "Titre" }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      of: [{ type: "imageWithAlt" }],
      options: { layout: "grid" },
      validation: (Rule) => Rule.min(2),
    }),
  ],
});

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Section CTA",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "title", type: "string", title: "Titre", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", type: "text", title: "Description", rows: 2 }),
    defineField({ name: "image", type: "imageWithAlt", title: "Image de fond (optionnelle)" }),
    defineField({
      name: "ctas",
      title: "Boutons",
      type: "array",
      of: [{ type: "cta" }],
      validation: (Rule) => Rule.min(1).max(2),
    }),
  ],
});

export const faqSection = defineType({
  name: "faqSection",
  title: "FAQ",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({ name: "title", type: "string", title: "Titre" }),
    defineField({
      name: "scope",
      title: "Périmètre des questions",
      type: "string",
      options: {
        list: [
          { title: "Toutes les questions", value: "all" },
          { title: "Accueil", value: "homepage" },
          { title: "Mariage", value: "mariage" },
          { title: "Événement", value: "evenement" },
          { title: "Espace Events", value: "espace" },
        ],
        layout: "radio",
      },
      initialValue: "all",
    }),
    defineField({
      name: "selectedItems",
      title: "Questions sélectionnées (override)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "faqItem" }] }],
    }),
  ],
});

export const aboutSection = defineType({
  name: "aboutSection",
  title: "À propos / texte + image",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      description: 'Encadrez les mots en italique avec _underscores_.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "body", type: "blockContent", title: "Texte" }),
    defineField({ name: "image", type: "imageWithAlt", title: "Image" }),
    defineField({
      name: "ctas",
      title: "Boutons (optionnels)",
      type: "array",
      of: [{ type: "cta" }],
      validation: (Rule) => Rule.max(2),
    }),
  ],
});

export const venueSection = defineType({
  name: "venueSection",
  title: "Espace Events (capacités & infos)",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({ name: "title", type: "string", title: "Titre" }),
    defineField({ name: "intro", type: "text", title: "Intro", rows: 3 }),
    defineField({
      name: "capacities",
      title: "Capacités",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "configuration", type: "string", title: "Configuration", description: "Ex : Cocktail, Dîner assis, Cérémonie" },
            { name: "guestCount", type: "string", title: "Nombre de personnes", description: "Ex : Jusqu'à 150" },
          ],
          preview: { select: { title: "configuration", subtitle: "guestCount" } },
        },
      ],
    }),
    defineField({ name: "address", type: "string", title: "Adresse complète" }),
    defineField({ name: "mapEmbedUrl", type: "url", title: "URL d'iframe Google Maps" }),
    defineField({
      name: "highlights",
      title: "Points forts (puces)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "image", type: "imageWithAlt", title: "Photo principale" }),
  ],
});
