import { defineType, defineField, defineArrayMember } from "sanity";
import type { StringInputProps } from "sanity";
import React from "react";

// Wrapper qui charge AltTextInput via require() pour éviter les problèmes
// de résolution de module .tsx depuis moduleResolution: bundler.
const AltTextInput = (props: StringInputProps) => {
  if (typeof window === "undefined") return props.renderDefault(props);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { AltTextInput: Input } = require("../../components/AltTextInput") as {
    AltTextInput: React.ComponentType<StringInputProps>;
  };
  return React.createElement(Input, props);
};

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
          { title: "Réserver un appel (RDV découverte)", value: "calendly" },
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
      components: { input: AltTextInput },
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

export const realisationVideo = defineType({
  name: "realisationVideo",
  title: "Vidéo",
  type: "object",
  fields: [
    defineField({
      name: "videoType",
      title: "Source de la vidéo",
      type: "string",
      options: {
        list: [
          { title: "📎 Lien URL (YouTube, Vimeo, MP4…)", value: "url" },
          { title: "☁️ Upload Mux (fichier vidéo direct)", value: "mux" },
        ],
        layout: "radio",
      },
      initialValue: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL de la vidéo",
      type: "url",
      description:
        "Lien YouTube (https://youtu.be/…), Vimeo (https://vimeo.com/…) ou fichier MP4 direct.",
      hidden: ({ parent }) => parent?.videoType !== "url",
      validation: (Rule) =>
        Rule.uri({ scheme: ["http", "https"] }).custom((val, ctx) => {
          const parent = ctx.parent as { videoType?: string } | undefined;
          if (parent?.videoType === "url" && !val)
            return "L'URL est obligatoire pour ce type de source.";
          return true;
        }),
    }),
    defineField({
      name: "muxVideo",
      title: "Vidéo Mux",
      type: "mux.video",
      description: "Uploader directement un fichier vidéo (MP4, MOV…).",
      hidden: ({ parent }) => parent?.videoType !== "mux",
    }),
    defineField({
      name: "poster",
      title: "Image de couverture (thumbnail)",
      type: "imageWithAlt",
      description:
        "Affichée dans la grille avant la lecture. Si vide, une miniature est générée automatiquement.",
    }),
    defineField({
      name: "caption",
      title: "Légende",
      type: "string",
    }),
  ],
  preview: {
    select: {
      type: "videoType",
      url: "url",
      poster: "poster",
      caption: "caption",
    },
    prepare: ({ type, url, poster, caption }) => ({
      title: caption ?? url ?? "Vidéo",
      subtitle: type === "mux" ? "Upload Mux" : url ?? "URL",
      media: poster,
    }),
  },
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
