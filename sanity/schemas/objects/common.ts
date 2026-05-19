import { defineType, defineField, defineArrayMember } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fieldsets: [
    { name: "openGraph", title: "Open Graph (réseaux sociaux)", options: { collapsible: true } },
    { name: "advanced", title: "Avancé", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titre SEO",
      type: "string",
      description:
        "50-60 caractères idéalement. Affiché dans Google et l'onglet du navigateur.",
      validation: (Rule) =>
        Rule.max(70).warning("Le titre dépasse la longueur recommandée (70 caractères)."),
    }),
    defineField({
      name: "description",
      title: "Description SEO",
      type: "text",
      rows: 3,
      description: "150-160 caractères idéalement.",
      validation: (Rule) =>
        Rule.max(180).warning("La description dépasse 180 caractères."),
    }),
    defineField({
      name: "ogImage",
      title: "Image Open Graph",
      type: "imageWithAlt",
      fieldset: "openGraph",
      description: "Image affichée lors du partage sur Facebook, LinkedIn, etc. Dimensions recommandées : 1200×630.",
    }),
    defineField({
      name: "noindex",
      title: "Empêcher l'indexation Google",
      type: "boolean",
      initialValue: false,
      fieldset: "advanced",
    }),
  ],
});

export const cta = defineType({
  name: "cta",
  title: "Bouton d'action",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Texte du bouton",
      type: "string",
      validation: (Rule) => Rule.required().min(2).max(40),
    }),
    defineField({
      name: "type",
      title: "Type de cible",
      type: "string",
      options: {
        list: [
          { title: "Calendly (RDV découverte)", value: "calendly" },
          { title: "Formulaire devis", value: "form" },
          { title: "Lien interne (autre page du site)", value: "internal" },
          { title: "Lien externe", value: "external" },
          { title: "Ancre (section de la page)", value: "anchor" },
        ],
        layout: "radio",
      },
      initialValue: "calendly",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "internalPath",
      title: "Chemin interne",
      description: "Ex : /mariage, /espace-events",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "internal",
    }),
    defineField({
      name: "externalUrl",
      title: "URL externe",
      type: "url",
      description:
        "Doit commencer par http(s)://, mailto: ou tel: — les URLs javascript: et data: sont refusées.",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https", "mailto", "tel"],
        }),
      hidden: ({ parent }) => parent?.type !== "external",
    }),
    defineField({
      name: "anchor",
      title: "Ancre",
      description: "Sans le #. Ex : services, packs, contact",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "anchor",
    }),
    defineField({
      name: "variant",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Principal (plein)", value: "primary" },
          { title: "Secondaire (contour)", value: "secondary" },
          { title: "Discret (lien)", value: "ghost" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    }),
  ],
  preview: {
    select: { label: "label", type: "type" },
    prepare: ({ label, type }) => ({
      title: label || "Bouton sans texte",
      subtitle: type ? `→ ${type}` : undefined,
    }),
  },
});

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texte alternatif",
      description:
        "Décrit l'image pour les lecteurs d'écran et le SEO. Obligatoire.",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .max(150)
          .error("L'alt est obligatoire (3-150 caractères)."),
    }),
    defineField({
      name: "caption",
      title: "Légende (optionnelle)",
      type: "string",
    }),
  ],
});

export const blockContent = defineType({
  name: "blockContent",
  title: "Contenu riche",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraphe", value: "normal" },
        { title: "Titre H2", value: "h2" },
        { title: "Titre H3", value: "h3" },
        { title: "Citation", value: "blockquote" },
      ],
      lists: [
        { title: "Liste à puces", value: "bullet" },
        { title: "Liste numérotée", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Gras", value: "strong" },
          { title: "Italique", value: "em" },
          { title: "Souligné", value: "underline" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Lien",
            fields: [
              { name: "href", type: "url", title: "URL" },
              {
                name: "blank",
                type: "boolean",
                title: "Ouvrir dans un nouvel onglet",
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({ type: "imageWithAlt" }),
  ],
});
