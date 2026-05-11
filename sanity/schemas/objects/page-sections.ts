import { defineType, defineField } from "sanity";

const enabledField = defineField({
  name: "enabled",
  title: "Section activée",
  type: "boolean",
  initialValue: true,
  description: "Décochez pour masquer cette section sur le site.",
});

/* ============================================================================
 * HERO ENRICHI (homepage) — avec stats et badge fondatrice
 * ========================================================================== */
export const heroHomeSection = defineType({
  name: "heroHomeSection",
  title: "Hero (page d'accueil)",
  type: "object",
  groups: [
    { name: "main", title: "Contenu principal", default: true },
    { name: "stats", title: "Stats sous le hero" },
    { name: "badge", title: "Encadré citation" },
  ],
  fields: [
    enabledField,
    defineField({
      name: "eyebrow",
      title: "Suréclat (texte au-dessus du titre)",
      type: "string",
      group: "main",
      description: 'Ex : "Wedding Planner · Émerainville 77 · Depuis 2020"',
    }),
    defineField({
      name: "title",
      title: "Titre principal",
      type: "string",
      group: "main",
      description: 'Encadrez le mot à mettre en italique avec _underscores_. Ex : "Mariages et événements à _votre image._"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Sous-titre",
      type: "text",
      rows: 3,
      group: "main",
    }),
    defineField({
      name: "image",
      title: "Photo principale",
      type: "imageWithAlt",
      group: "main",
    }),
    defineField({
      name: "ctas",
      title: "Boutons d'action",
      type: "array",
      group: "main",
      of: [{ type: "cta" }],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: "stats",
      title: "Stats (3 chiffres clés)",
      type: "array",
      group: "stats",
      validation: (Rule) => Rule.max(3),
      of: [
        {
          type: "object",
          fields: [
            { name: "value", type: "string", title: "Valeur (gras)", description: 'Ex : "+60", "Émerainville", "IDF"' },
            { name: "label", type: "string", title: "Libellé", description: 'Ex : "Mariages orchestrés"' },
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
    }),
    defineField({
      name: "quoteBadge",
      title: "Badge citation (sous l'image)",
      type: "object",
      group: "badge",
      fields: [
        { name: "label", type: "string", title: "Libellé (au-dessus de la citation)", initialValue: "Aïssa, fondatrice" },
        { name: "quote", type: "text", title: "Citation", rows: 3 },
      ],
    }),
  ],
});

/* ============================================================================
 * MARQUEE — bandeau défilant
 * ========================================================================== */
export const marqueeSection = defineType({
  name: "marqueeSection",
  title: "Bandeau défilant (marquee)",
  type: "object",
  fields: [
    enabledField,
    defineField({
      name: "items",
      title: "Items affichés",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "Liste des mots/expressions qui défilent en boucle.",
      validation: (Rule) => Rule.min(2).max(12),
    }),
  ],
});

/* ============================================================================
 * PILLARS — 3 piliers (homepage section sombre)
 * ========================================================================== */
export const pillarsSection = defineType({
  name: "pillarsSection",
  title: "Piliers (3 valeurs)",
  type: "object",
  groups: [
    { name: "quote", title: "Citation principale", default: true },
    { name: "items", title: "Piliers" },
  ],
  fields: [
    enabledField,
    defineField({
      name: "quote",
      title: "Citation centrale",
      type: "text",
      rows: 3,
      group: "quote",
      description: 'Ex : "Le jour J, vous _profitez._ Le reste, c\'est notre métier."',
    }),
    defineField({
      name: "quoteAuthor",
      title: "Auteur de la citation",
      type: "string",
      group: "quote",
      initialValue: "— Aïssa, Fondatrice",
    }),
    defineField({
      name: "items",
      title: "Piliers (3 minimum)",
      type: "array",
      group: "items",
      validation: (Rule) => Rule.min(2).max(4),
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Titre principal", description: 'Ex : "ADN"' },
            { name: "italic", type: "string", title: "Mot en italique (sous le titre)", description: 'Ex : "Musical"' },
            { name: "description", type: "text", title: "Description", rows: 4, validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { title: "title", subtitle: "italic" },
            prepare: ({ title, subtitle }) => ({
              title: [title, subtitle].filter(Boolean).join(" · "),
            }),
          },
        },
      ],
    }),
  ],
});

/* ============================================================================
 * PROCESS — étapes "Comment ça se passe"
 * ========================================================================== */
export const processSection = defineType({
  name: "processSection",
  title: "Process (étapes)",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat", initialValue: "Comment ça se passe" }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      description: 'Encadrez les mots à mettre en italique avec _underscores_.',
    }),
    defineField({
      name: "steps",
      title: "Étapes",
      type: "array",
      validation: (Rule) => Rule.min(2).max(6),
      of: [
        {
          type: "object",
          fields: [
            { name: "italic", type: "string", title: "Début (italique)", description: 'Ex : "Vous prenez"' },
            { name: "rest", type: "string", title: "Suite (normal)", description: 'Ex : "rendez-vous"' },
            { name: "description", type: "text", title: "Description", rows: 3, validation: (Rule) => Rule.required() },
          ],
          preview: {
            select: { italic: "italic", rest: "rest" },
            prepare: ({ italic, rest }) => ({
              title: [italic, rest].filter(Boolean).join(" "),
            }),
          },
        },
      ],
    }),
    defineField({
      name: "cta",
      title: "Bouton sous les étapes",
      type: "cta",
    }),
  ],
});

/* ============================================================================
 * UNIVERSES — 3 cartes services (homepage)
 * ========================================================================== */
export const universesSection = defineType({
  name: "universesSection",
  title: "Univers (3 services)",
  type: "object",
  groups: [
    { name: "header", title: "En-tête", default: true },
    { name: "items", title: "Univers" },
  ],
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat", group: "header", initialValue: "1 lieu · 3 services · Émerainville (77)" }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      group: "header",
      description: 'Encadrez les mots en italique avec _underscores_. Ex : "Trois services, un même _métier._"',
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 4,
      group: "header",
    }),
    defineField({
      name: "items",
      title: "Univers (3 cartes)",
      type: "array",
      group: "items",
      validation: (Rule) => Rule.length(3).error("Il faut exactement 3 univers."),
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Titre principal", description: 'Ex : "Espace"' },
            { name: "italic", type: "string", title: "Sous-titre italique", description: 'Ex : "Events"' },
            { name: "shortDesc", type: "text", title: "Description courte", rows: 2, validation: (Rule) => Rule.required() },
            { name: "longDesc", type: "text", title: "Description détaillée", rows: 4 },
            {
              name: "tags",
              type: "array",
              title: "Tags (badges)",
              of: [{ type: "string" }],
              options: { layout: "tags" },
              validation: (Rule) => Rule.max(5),
            },
            {
              name: "price",
              type: "object",
              title: "Prix",
              fields: [
                { name: "label", type: "string", title: "Libellé (au-dessus du prix)", description: 'Ex : "À partir de"' },
                { name: "value", type: "string", title: "Montant", description: 'Ex : "1 250 €"' },
                { name: "note", type: "string", title: "Note (sous le prix)", description: 'Ex : "Espace Events ou ailleurs"' },
              ],
            },
            { name: "image", type: "imageWithAlt", title: "Image" },
            { name: "primaryCta", type: "cta", title: "Bouton principal" },
            { name: "secondaryCta", type: "cta", title: "Bouton secondaire" },
          ],
          preview: {
            select: { title: "title", italic: "italic", media: "image" },
            prepare: ({ title, italic, media }) => ({
              title: [title, italic].filter(Boolean).join(" "),
              media,
            }),
          },
        },
      ],
    }),
  ],
});

/* ============================================================================
 * CASE STUDIES — 2 études de cas (homepage)
 * ========================================================================== */
export const caseStudiesSection = defineType({
  name: "caseStudiesSection",
  title: "Études de cas",
  type: "object",
  groups: [
    { name: "header", title: "En-tête", default: true },
    { name: "items", title: "Cas sélectionnés" },
    { name: "footer", title: "Pied de section" },
  ],
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat", group: "header", initialValue: "Études de cas" }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      group: "header",
      description: 'Encadrez les mots en italique avec _underscores_.',
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 3,
      group: "header",
    }),
    defineField({
      name: "selectedRealisations",
      title: "Réalisations à présenter (2 idéalement)",
      type: "array",
      group: "items",
      of: [{ type: "reference", to: [{ type: "realisation" }] }],
      validation: (Rule) => Rule.min(1).max(4),
      description: "Sélectionnez les réalisations à afficher en grand format. Chaque réalisation doit avoir une story et une citation pour bien rendre.",
    }),
    defineField({
      name: "footerEyebrow",
      title: "Petite phrase au-dessus du bouton final",
      type: "string",
      group: "footer",
      description: 'Ex : "+ 60 mariages orchestrés depuis 2020"',
    }),
    defineField({
      name: "footerCta",
      title: "Bouton final",
      type: "cta",
      group: "footer",
    }),
  ],
});

/* ============================================================================
 * TRUST BAR — bandeau crédibilité (mariage, espace, etc.)
 * ========================================================================== */
export const trustBarSection = defineType({
  name: "trustBarSection",
  title: "Bandeau crédibilité",
  type: "object",
  fields: [
    enabledField,
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      validation: (Rule) => Rule.min(2).max(6),
      of: [
        {
          type: "object",
          fields: [
            { name: "value", type: "string", title: "Valeur", description: 'Ex : "+60", "100%", "9-12 mois"' },
            { name: "label", type: "string", title: "Libellé", description: 'Ex : "Mariages orchestrés"' },
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
    }),
  ],
});

/* ============================================================================
 * CEREMONIES — types de cérémonies (mariage)
 * ========================================================================== */
export const ceremoniesSection = defineType({
  name: "ceremoniesSection",
  title: "Cérémonies (types)",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({ name: "title", type: "string", title: "Titre", description: 'Encadrez les mots en italique avec _underscores_.' }),
    defineField({ name: "intro", type: "text", title: "Introduction", rows: 3 }),
    defineField({
      name: "items",
      title: "Cérémonies",
      type: "array",
      validation: (Rule) => Rule.min(2).max(6),
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Titre", validation: (Rule) => Rule.required() },
            { name: "description", type: "text", title: "Description", rows: 4 },
            { name: "image", type: "imageWithAlt", title: "Image" },
            {
              name: "highlights",
              type: "array",
              title: "Points clés (puces)",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            },
          ],
          preview: {
            select: { title: "title", media: "image" },
          },
        },
      ],
    }),
  ],
});

/* ============================================================================
 * THEMES — thèmes de mariage
 * ========================================================================== */
export const themesSection = defineType({
  name: "themesSection",
  title: "Thèmes (mariage)",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({ name: "title", type: "string", title: "Titre" }),
    defineField({ name: "intro", type: "text", title: "Introduction", rows: 2 }),
    defineField({
      name: "items",
      title: "Thèmes",
      type: "array",
      validation: (Rule) => Rule.min(1).max(8),
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Nom du thème", description: 'Ex : "Orientale", "Bohème"', validation: (Rule) => Rule.required() },
            { name: "description", type: "text", title: "Description", rows: 3 },
            { name: "image", type: "imageWithAlt", title: "Image d'inspiration" },
            {
              name: "accentColor",
              type: "string",
              title: "Couleur d'accent (optionnel)",
              description: 'Code hex. Ex : "#7B8C5C" pour Bohème (sage)',
            },
            {
              name: "tags",
              type: "array",
              title: "Mots-clés ambiance",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            },
          ],
          preview: {
            select: { title: "name", media: "image" },
          },
        },
      ],
    }),
  ],
});

/* ============================================================================
 * LIEUX — options de lieux pour mariage / événement
 * ========================================================================== */
export const lieuxSection = defineType({
  name: "lieuxSection",
  title: "Lieux (options)",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({ name: "title", type: "string", title: "Titre" }),
    defineField({ name: "intro", type: "text", title: "Introduction", rows: 3 }),
    defineField({
      name: "items",
      title: "Options de lieux",
      type: "array",
      validation: (Rule) => Rule.min(1).max(6),
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Titre", validation: (Rule) => Rule.required() },
            { name: "description", type: "text", title: "Description", rows: 4 },
            { name: "image", type: "imageWithAlt", title: "Image" },
            {
              name: "highlights",
              type: "array",
              title: "Caractéristiques (puces)",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            },
            { name: "cta", type: "cta", title: "Bouton (optionnel)" },
          ],
          preview: {
            select: { title: "title", media: "image" },
          },
        },
      ],
    }),
  ],
});

/* ============================================================================
 * TIMELINE — timeline mariage / événement
 * ========================================================================== */
export const timelineSection = defineType({
  name: "timelineSection",
  title: "Timeline (préparation)",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({ name: "title", type: "string", title: "Titre" }),
    defineField({ name: "intro", type: "text", title: "Introduction", rows: 2 }),
    defineField({
      name: "items",
      title: "Étapes",
      type: "array",
      validation: (Rule) => Rule.min(2).max(10),
      of: [
        {
          type: "object",
          fields: [
            { name: "when", type: "string", title: "Délai", description: 'Ex : "12 mois avant", "Le jour J"', validation: (Rule) => Rule.required() },
            { name: "title", type: "string", title: "Titre de l'étape", validation: (Rule) => Rule.required() },
            { name: "description", type: "text", title: "Description", rows: 3 },
          ],
          preview: {
            select: { when: "when", title: "title" },
            prepare: ({ when, title }) => ({
              title: title || "—",
              subtitle: when,
            }),
          },
        },
      ],
    }),
  ],
});

/* ============================================================================
 * À LA CARTE — services à la carte (mariage / événement / espace) — visuel grille
 * ========================================================================== */
export const aLaCarteSection = defineType({
  name: "aLaCarteSection",
  title: "À la carte (grille de services)",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({ name: "title", type: "string", title: "Titre" }),
    defineField({ name: "intro", type: "text", title: "Introduction", rows: 3 }),
    defineField({
      name: "filterByScope",
      title: "Filtre des services par périmètre",
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
      name: "selectedServices",
      title: "Services à afficher (override)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      description: "Laissez vide pour afficher tous les services correspondant au filtre ci-dessus.",
    }),
    defineField({ name: "footerNote", type: "text", title: "Note de pied (optionnel)", rows: 2 }),
    defineField({ name: "cta", type: "cta", title: "Bouton (optionnel)" }),
  ],
});

/* ============================================================================
 * CONDITIONS — conditions de paiement / réservation
 * ========================================================================== */
export const conditionsSection = defineType({
  name: "conditionsSection",
  title: "Conditions de réservation / paiement",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({ name: "title", type: "string", title: "Titre" }),
    defineField({ name: "intro", type: "text", title: "Introduction", rows: 3 }),
    defineField({
      name: "items",
      title: "Conditions",
      type: "array",
      validation: (Rule) => Rule.min(1).max(8),
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Titre court", validation: (Rule) => Rule.required() },
            { name: "description", type: "text", title: "Description", rows: 3 },
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    defineField({ name: "footnote", type: "text", title: "Mention légale (sous les items)", rows: 2 }),
  ],
});

/* ============================================================================
 * STICKY CTA — bouton flottant
 * ========================================================================== */
export const stickyCtaSection = defineType({
  name: "stickyCtaSection",
  title: "Bouton flottant (sticky CTA)",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "label", type: "string", title: "Texte du bouton", initialValue: "Réserver un appel" }),
    defineField({
      name: "subLabel",
      title: "Sous-texte (optionnel)",
      type: "string",
      description: 'Ex : "30 min · sans engagement"',
    }),
    defineField({ name: "cta", type: "cta", title: "Action du bouton" }),
  ],
});

/* ============================================================================
 * CONTACT — bloc contact homepage
 * ========================================================================== */
export const contactSection = defineType({
  name: "contactSection",
  title: "Contact (formulaire + Calendly)",
  type: "object",
  groups: [
    { name: "header", title: "En-tête", default: true },
    { name: "calendlyCard", title: "Carte Calendly" },
    { name: "form", title: "Formulaire" },
    { name: "meta", title: "Bloc coordonnées" },
  ],
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat", group: "header", initialValue: "Parlons de votre projet" }),
    defineField({ name: "title", type: "string", title: "Titre", group: "header", description: 'Encadrez les mots en italique avec _underscores_.' }),
    defineField({ name: "intro", type: "text", title: "Introduction", rows: 3, group: "header" }),

    defineField({ name: "calendlyEyebrow", type: "string", title: "Suréclat carte", group: "calendlyCard", initialValue: "— Le plus rapide" }),
    defineField({ name: "calendlyTitle", type: "string", title: "Titre carte", group: "calendlyCard" }),
    defineField({ name: "calendlyDescription", type: "text", title: "Description carte", rows: 2, group: "calendlyCard" }),
    defineField({ name: "calendlyButtonLabel", type: "string", title: "Texte du bouton", group: "calendlyCard", initialValue: "Choisir un créneau" }),

    defineField({ name: "formEyebrow", type: "string", title: "Suréclat formulaire", group: "form", initialValue: "— Ou écrivez-nous" }),
    defineField({ name: "formTitle", type: "string", title: "Titre formulaire", group: "form", initialValue: "Décrivez votre projet" }),
    defineField({
      name: "formEventTypes",
      title: "Types d'événements (select)",
      type: "array",
      group: "form",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "formSubmitLabel", type: "string", title: "Texte du bouton d'envoi", group: "form", initialValue: "Envoyer mon projet" }),
    defineField({ name: "formSuccessTitle", type: "string", title: "Titre après envoi", group: "form", initialValue: "Merci !" }),
    defineField({ name: "formSuccessMessage", type: "string", title: "Message après envoi", group: "form", initialValue: "Aïssa répond sous 48h ouvrées." }),
  ],
});

/* ============================================================================
 * LOCATION PRICING — tarifs location seule par jour (Espace Events)
 * ========================================================================== */
export const locationPricingSection = defineType({
  name: "locationPricingSection",
  title: "Tarifs location seule (par jour)",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat", initialValue: "Location seule" }),
    defineField({
      name: "title",
      type: "string",
      title: "Titre",
      description: 'Encadrez les mots à mettre en italique avec _underscores_.',
    }),
    defineField({ name: "intro", type: "text", title: "Introduction", rows: 3 }),
    defineField({
      name: "rows",
      title: "Lignes de tarifs",
      type: "array",
      validation: (Rule) => Rule.min(1).max(8),
      of: [
        {
          type: "object",
          fields: [
            { name: "day", type: "string", title: "Jour / créneau", validation: (Rule) => Rule.required() },
            { name: "hours", type: "string", title: "Horaires", validation: (Rule) => Rule.required() },
            { name: "hoursNote", type: "string", title: "Note horaires (optionnelle)" },
            { name: "price", type: "string", title: "Tarif (ex : 350 €)", validation: (Rule) => Rule.required() },
          ],
          preview: { select: { title: "day", subtitle: "price" } },
        },
      ],
    }),
  ],
});

/* ============================================================================
 * CROSS SERVICES — cross-sell vers autres univers (Mariage / Pro)
 * ========================================================================== */
export const crossServicesSection = defineType({
  name: "crossServicesSection",
  title: "Autres services (cross-sell)",
  type: "object",
  fields: [
    enabledField,
    defineField({ name: "eyebrow", type: "string", title: "Suréclat" }),
    defineField({
      name: "title",
      type: "string",
      title: "Titre",
      description: 'Encadrez les mots à mettre en italique avec _underscores_.',
    }),
    defineField({ name: "intro", type: "text", title: "Introduction", rows: 3 }),
    defineField({
      name: "items",
      title: "Services",
      type: "array",
      validation: (Rule) => Rule.min(1).max(3),
      of: [
        {
          type: "object",
          fields: [
            { name: "eyebrow", type: "string", title: "Suréclat (ex : Service · Wedding planning)" },
            { name: "titleStart", type: "string", title: "Titre (début)", validation: (Rule) => Rule.required() },
            { name: "titleItalic", type: "string", title: "Titre (italique)" },
            { name: "description", type: "text", title: "Description", rows: 3, validation: (Rule) => Rule.required() },
            {
              name: "tags",
              type: "array",
              title: "Tags",
              of: [{ type: "string" }],
              options: { layout: "tags" },
            },
            { name: "ctaLabel", type: "string", title: "Texte du bouton" },
            { name: "ctaHref", type: "string", title: "Lien du bouton (ex : /mariage)" },
          ],
          preview: {
            select: { title: "titleStart", subtitle: "description" },
          },
        },
      ],
    }),
  ],
});
