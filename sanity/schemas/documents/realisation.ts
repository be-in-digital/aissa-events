import { defineType, defineField } from "sanity";

export const realisation = defineType({
  name: "realisation",
  title: "Réalisation",
  type: "document",
  groups: [
    { name: "main", title: "Identité", default: true },
    { name: "story", title: "Récit (étude de cas)" },
    { name: "media", title: "Photos & galerie" },
    { name: "links", title: "Témoignage & tags" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // -------- Identité --------
    defineField({
      name: "title",
      title: "Titre du projet",
      type: "string",
      group: "main",
      description: 'Ex : "Sarah & David — un mariage afro-chic au Bois Joli"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortTitle",
      title: "Titre court (carte)",
      type: "string",
      group: "main",
      description: 'Affiché dans les cartes condensées. Ex : "Sarah & David"',
    }),
    defineField({
      name: "italicSubtitle",
      title: "Sous-titre italique (carte case study)",
      type: "string",
      group: "main",
      description: 'Ex : "un afro-chic au Bois Joli"',
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      group: "main",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Type d'événement",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Mariage", value: "mariage" },
          { title: "Cérémonie", value: "ceremonie" },
          { title: "Professionnel", value: "pro" },
          { title: "Famille (anniv, baby shower, henné…)", value: "famille" },
          { title: "Autre", value: "autre" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "typeLabel",
      title: "Libellé type (override)",
      type: "string",
      group: "main",
      description: 'Affiché dans le badge. Si vide, le type est utilisé. Ex : "Mariage", "Événement pro"',
    }),
    defineField({
      name: "eventDate",
      title: "Date de l'événement",
      type: "date",
      group: "main",
    }),
    defineField({
      name: "location",
      title: "Lieu",
      type: "string",
      group: "main",
      description: 'Ex : "Espace Events Émerainville", "Domaine du Coudray"',
    }),
    defineField({
      name: "guestCount",
      title: "Nombre d'invités",
      type: "number",
      group: "main",
    }),
    defineField({
      name: "theme",
      title: "Thème (mariages)",
      type: "string",
      group: "main",
      description: 'Ex : "Afro chic & dorures", "Bohème", "Orientale"',
    }),

    // -------- Récit (case study) --------
    defineField({
      name: "badge",
      title: "Badge (cas n°XX)",
      type: "string",
      group: "story",
      description: 'Affiché en case study. Ex : "Cas n°01"',
    }),
    defineField({
      name: "story",
      title: "Récit du projet",
      type: "text",
      rows: 8,
      group: "story",
      description: "Texte long racontant le brief, les décisions, le déroulé. Affiché dans la section Études de cas.",
    }),
    defineField({
      name: "quote",
      title: "Citation client",
      type: "object",
      group: "story",
      fields: [
        { name: "text", type: "text", title: "Citation", rows: 4 },
        { name: "author", type: "string", title: "Auteur", description: 'Ex : "Sarah & David", "Camille L. · Brand Director"' },
      ],
    }),
    defineField({
      name: "metaItems",
      title: "Méta-infos (clé/valeur)",
      type: "array",
      group: "story",
      description: 'Couples affichés dans les études de cas. Ex : "Lieu" / "Domaine du Bois Joli (77)"',
      validation: (Rule) => Rule.max(8),
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Libellé" },
            { name: "value", type: "string", title: "Valeur" },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "alignment",
      title: "Alignement (étude de cas)",
      type: "string",
      group: "story",
      options: {
        list: [
          { title: "Image à gauche, texte à droite", value: "left" },
          { title: "Image à droite, texte à gauche", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),

    // -------- Media --------
    defineField({
      name: "cover",
      title: "Photo de couverture / hero",
      type: "imageWithAlt",
      group: "media",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "moodBoard",
      title: "Mood board (3 photos d'ambiance)",
      type: "array",
      group: "media",
      of: [{ type: "imageWithAlt" }],
      options: { layout: "grid" },
      validation: (Rule) => Rule.max(4),
      description: "Trois photos affichées sous l'image principale en case study.",
    }),
    defineField({
      name: "gallery",
      title: "Galerie complète (page détail)",
      type: "array",
      group: "media",
      of: [{ type: "imageWithAlt" }],
      options: { layout: "grid" },
    }),
    defineField({
      name: "video",
      title: "Vidéo (optionnelle)",
      type: "mux.video",
      group: "media",
      description: "Vidéo affichée sur la page détail de la réalisation.",
    }),

    // -------- Links --------
    defineField({
      name: "linkedTestimonial",
      title: "Témoignage associé",
      type: "reference",
      group: "links",
      to: [{ type: "testimonial" }],
    }),
    defineField({
      name: "tags",
      title: "Tags (ambiance, style)",
      type: "array",
      group: "links",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "featured",
      title: "Mis en avant",
      type: "boolean",
      group: "links",
      initialValue: false,
      description: "Affiché en priorité dans la galerie Réalisations.",
    }),

    // -------- SEO --------
    defineField({ name: "seo", type: "seo", title: "SEO", group: "seo" }),
  ],
  orderings: [
    {
      title: "Date événement (récent)",
      name: "eventDateDesc",
      by: [{ field: "eventDate", direction: "desc" }],
    },
    {
      title: "Mis en avant en premier",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "eventDate", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", type: "type", media: "cover", date: "eventDate" },
    prepare: ({ title, type, media, date }) => ({
      title,
      subtitle: [type, date].filter(Boolean).join(" · "),
      media,
    }),
  },
});
