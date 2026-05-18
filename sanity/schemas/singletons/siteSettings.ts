import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Réglages du site",
  type: "document",
  groups: [
    { name: "brand", title: "Marque & logo", default: true },
    { name: "founder", title: "Fondatrice" },
    { name: "header", title: "Header (menu)" },
    { name: "contact", title: "Coordonnées" },
    { name: "social", title: "Réseaux sociaux" },
    { name: "footer", title: "Footer" },
    { name: "legal", title: "Mentions légales" },
    { name: "seo", title: "SEO par défaut" },
  ],
  fields: [
    // -------- Brand --------
    defineField({
      name: "siteName",
      title: "Nom du site",
      type: "string",
      group: "brand",
      initialValue: "Aïssa Events",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Baseline",
      type: "string",
      group: "brand",
      initialValue: "The Perfect Timing",
    }),
    defineField({
      name: "logo",
      title: "Logo (clair, fond cream)",
      type: "imageWithAlt",
      group: "brand",
    }),
    defineField({
      name: "logoDark",
      title: "Logo (sur fond foncé)",
      type: "imageWithAlt",
      group: "brand",
    }),

    // -------- Founder --------
    defineField({
      name: "founder",
      title: "Fondatrice",
      type: "object",
      group: "founder",
      fields: [
        { name: "name", type: "string", title: "Nom complet", validation: (Rule) => Rule.required() },
        {
          name: "role",
          type: "string",
          title: "Rôle",
          initialValue: "Fondatrice & Directrice Artistique",
        },
        { name: "photo", type: "imageWithAlt", title: "Photo principale" },
        { name: "bio", type: "blockContent", title: "Biographie" },
        { name: "signatureQuote", type: "text", title: "Citation signature", rows: 3 },
        { name: "signatureName", type: "string", title: "Signature manuscrite (script)", description: 'Texte affiché en typo manuscrite sous la bio. Ex : "Aïssa"', initialValue: "Aïssa" },
      ],
    }),

    // -------- Header --------
    defineField({
      name: "headerNav",
      title: "Menu de navigation",
      type: "array",
      group: "header",
      description: "Liste des liens du menu principal (header). L'ordre détermine l'affichage.",
      of: [
        {
          type: "object",
          name: "navItem",
          fields: [
            { name: "label", type: "string", title: "Libellé", validation: (Rule) => Rule.required() },
            { name: "cta", type: "cta", title: "Lien (cible)", validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { label: "label", type: "cta.type", path: "cta.internalPath" },
            prepare: ({ label, type, path }) => ({
              title: label,
              subtitle: path || type || "",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "headerCta",
      title: "Bouton du header (à droite)",
      type: "cta",
      group: "header",
      description: 'Le bouton CTA en haut à droite. Ex : "Réserver un appel".',
    }),

    // -------- Contact --------
    defineField({
      name: "email",
      title: "Email de contact",
      type: "string",
      group: "contact",
      initialValue: "contact@aissaevents.com",
    }),
    defineField({
      name: "phone",
      title: "Téléphone (affiché)",
      type: "string",
      group: "contact",
      description: 'Affiché sur le site. Ex : "06 61 94 88 59"',
    }),
    defineField({
      name: "phoneHref",
      title: "Téléphone (format lien tel:)",
      type: "string",
      group: "contact",
      description: 'Sans espaces, format international. Ex : "+33661948859"',
    }),
    defineField({
      name: "address",
      title: "Adresse",
      type: "object",
      group: "contact",
      fields: [
        { name: "street", type: "string", title: "Rue", initialValue: "35 Bd de Beaubourg" },
        { name: "city", type: "string", title: "Ville", initialValue: "Émerainville" },
        { name: "postalCode", type: "string", title: "Code postal", initialValue: "77184" },
        { name: "region", type: "string", title: "Région", initialValue: "Île-de-France" },
        { name: "country", type: "string", title: "Pays", initialValue: "France" },
      ],
    }),
    defineField({
      name: "hours",
      title: "Horaires",
      type: "array",
      group: "contact",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Jour/période", description: "Ex : Lundi-Vendredi" },
            { name: "value", type: "string", title: "Horaires", description: "Ex : 9h-18h, sur RDV" },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "calendlyUrl",
      title: "URL Calendly (RDV)",
      type: "url",
      group: "contact",
      description: "Lien Calendly utilisé partout sur le site (header CTA, contact, etc.). Si non rempli, la valeur de l'environnement sert de secours.",
    }),

    // -------- Social --------
    defineField({
      name: "social",
      title: "Réseaux sociaux",
      type: "object",
      group: "social",
      fields: [
        {
          name: "items",
          type: "array",
          title: "Liens",
          of: [
            {
              type: "object",
              fields: [
                {
                  name: "platform",
                  type: "string",
                  title: "Plateforme",
                  options: {
                    list: [
                      { title: "Instagram", value: "instagram" },
                      { title: "TikTok", value: "tiktok" },
                      { title: "Facebook", value: "facebook" },
                      { title: "YouTube", value: "youtube" },
                      { title: "LinkedIn", value: "linkedin" },
                      { title: "Pinterest", value: "pinterest" },
                    ],
                    layout: "dropdown",
                  },
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: "label",
                  type: "string",
                  title: "Libellé affiché",
                  description: 'Ex : "Instagram", "@aissa.events"',
                },
                {
                  name: "url",
                  type: "url",
                  title: "URL complète",
                  validation: (Rule) => Rule.required(),
                },
              ],
              preview: {
                select: { title: "label", subtitle: "platform" },
              },
            },
          ],
        },
      ],
    }),

    // -------- Footer --------
    defineField({
      name: "footerTagline",
      title: "Texte d'introduction (sous le logo)",
      type: "text",
      group: "footer",
      rows: 4,
      description: "Texte court sous le logo dans le footer.",
    }),
    defineField({
      name: "footerColumns",
      title: "Colonnes de liens",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Titre de colonne", validation: (Rule) => Rule.required() },
            {
              name: "links",
              type: "array",
              title: "Liens",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "label", type: "string", title: "Libellé", validation: (Rule) => Rule.required() },
                    { name: "cta", type: "cta", title: "Lien", validation: (Rule) => Rule.required() },
                  ],
                  preview: {
                    select: { label: "label", path: "cta.internalPath", type: "cta.type" },
                    prepare: ({ label, path, type }) => ({
                      title: label,
                      subtitle: path || type,
                    }),
                  },
                },
              ],
            },
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "footerContactTitle",
      title: "Titre colonne contact",
      type: "string",
      group: "footer",
      initialValue: "Contact",
    }),
    defineField({
      name: "footerCopyright",
      title: "Texte copyright (bas du footer)",
      type: "string",
      group: "footer",
      initialValue: "© 2026 Aïssa Events · Tous droits réservés",
      description: 'Le texte "Powered by Be in Digital" reste fixe et n\'est PAS modifiable depuis Sanity.',
    }),
    defineField({
      name: "footerLegalLinks",
      title: "Liens légaux (bas du footer)",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Libellé", validation: (Rule) => Rule.required() },
            { name: "cta", type: "cta", title: "Lien", validation: (Rule) => Rule.required() },
          ],
          preview: { select: { label: "label", path: "cta.internalPath" } },
        },
      ],
    }),

    // -------- Legal --------
    defineField({
      name: "legal",
      title: "Informations légales (entreprise)",
      type: "object",
      group: "legal",
      fields: [
        { name: "companyName", type: "string", title: "Raison sociale" },
        { name: "siret", type: "string", title: "SIRET" },
        { name: "rcs", type: "string", title: "RCS" },
        { name: "vatNumber", type: "string", title: "TVA intracommunautaire" },
        { name: "directorName", type: "string", title: "Directeur de publication" },
        {
          name: "host",
          type: "string",
          title: "Hébergeur",
          initialValue: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA",
        },
      ],
    }),

    // -------- Default SEO --------
    defineField({
      name: "defaultOgImage",
      title: "Image de partage par défaut (Open Graph)",
      type: "imageWithAlt",
      group: "seo",
      description: "Affichée sur Facebook, LinkedIn, etc. quand une page n'a pas son propre visuel. Recommandé : 1200×630.",
    }),
    defineField({
      name: "defaultSeo",
      title: "SEO par défaut",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Réglages du site" }),
  },
});
