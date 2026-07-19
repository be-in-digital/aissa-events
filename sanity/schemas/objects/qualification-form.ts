import { defineType, defineField } from "sanity";

/**
 * Formulaire de qualification B2B affiché en bas de la page Entreprises.
 *
 * Objectif : TOUT est modifiable depuis le Studio (titres, choix des menus
 * déroulants, libellés des champs, bouton, message de confirmation, texte de
 * consentement). La structure et les règles (champs obligatoires, envoi de
 * l'email) restent gérées par le code.
 */
export const qualificationFormSection = defineType({
  name: "qualificationFormSection",
  title: "Formulaire de qualification",
  type: "object",
  fieldsets: [
    { name: "header", title: "En-tête de la section" },
    {
      name: "options",
      title: "Choix proposés dans les menus du formulaire",
      options: { collapsible: true, collapsed: false },
    },
    {
      name: "labels",
      title: "Libellés des champs (avancé — à ne changer que si besoin)",
      options: { collapsible: true, collapsed: true },
    },
    { name: "after", title: "Bouton d'envoi & message de confirmation" },
  ],
  fields: [
    defineField({
      name: "enabled",
      title: "Section activée",
      type: "boolean",
      initialValue: true,
      description: "Décochez pour masquer le formulaire sur la page.",
    }),

    // ————————————————————— En-tête —————————————————————
    defineField({
      name: "eyebrow",
      title: "Petit texte au-dessus du titre",
      type: "string",
      fieldset: "header",
      initialValue: "Parlons de votre projet",
      description: "Court libellé en capitales au-dessus du grand titre. Ex : « Demande d'étude ».",
    }),
    defineField({
      name: "title",
      title: "Titre de la section",
      type: "string",
      fieldset: "header",
      initialValue: "Parlons de votre prochain événement",
      description: "Encadrez un mot avec des _underscores_ pour l'afficher en italique.",
    }),
    defineField({
      name: "intro",
      title: "Texte d'introduction",
      type: "text",
      rows: 3,
      fieldset: "header",
      initialValue:
        "Confiez-nous votre projet et recevez une première orientation adaptée à vos objectifs, à votre effectif et à votre budget.",
      description: "Petit paragraphe qui explique au visiteur ce qu'il obtient en remplissant le formulaire.",
    }),

    // ————————————————————— Options des menus —————————————————————
    defineField({
      name: "eventTypes",
      title: "Types d'événement (menu déroulant)",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "options",
      options: { layout: "tags" },
      initialValue: [
        "Réunion / Séminaire",
        "Afterwork / Cocktail",
        "Soirée client / Lancement",
        "Événement de fin d'année",
        "Team building",
        "Convention / Conférence",
        "Autre",
      ],
      description: "La liste proposée dans le menu « Type d'événement ». Ajoutez, retirez ou renommez à volonté.",
    }),
    defineField({
      name: "locationOptions",
      title: "Lieux possibles (au choix)",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "options",
      options: { layout: "tags" },
      initialValue: [
        "À l'Espace Events (Émerainville)",
        "Dans nos locaux",
        "Lieu à rechercher",
      ],
      description: "Les options du champ « Lieu souhaité ». Le visiteur en choisit une.",
    }),
    defineField({
      name: "serviceOptions",
      title: "Prestations à cocher",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "options",
      options: { layout: "tags" },
      initialValue: [
        "Salle / lieu",
        "Traiteur",
        "Technique (son, lumière)",
        "Décoration",
        "Animation / DJ",
        "Team building",
        "Photo / Vidéo",
      ],
      description: "Les cases à cocher « Prestations envisagées ». Le visiteur peut en cocher plusieurs.",
    }),
    defineField({
      name: "budgetRanges",
      title: "Fourchettes de budget (menu déroulant)",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "options",
      options: { layout: "tags" },
      initialValue: [
        "Moins de 5 000 €",
        "5 000 – 10 000 €",
        "10 000 – 20 000 €",
        "20 000 – 50 000 €",
        "Plus de 50 000 €",
        "À définir ensemble",
      ],
      description:
        "Aide le visiteur à situer son budget (le sien, pas vos tarifs). Sert à qualifier la demande. Modifiable librement.",
    }),

    // ————————————————————— Libellés des champs (avancé) —————————————————————
    defineField({ name: "companyLabel", title: "Libellé « Entreprise »", type: "string", fieldset: "labels", initialValue: "Entreprise" }),
    defineField({ name: "sectorLabel", title: "Libellé « Secteur d'activité »", type: "string", fieldset: "labels", initialValue: "Secteur d'activité" }),
    defineField({ name: "contactNameLabel", title: "Libellé « Nom du contact »", type: "string", fieldset: "labels", initialValue: "Nom et prénom" }),
    defineField({ name: "roleLabel", title: "Libellé « Fonction »", type: "string", fieldset: "labels", initialValue: "Fonction" }),
    defineField({ name: "emailLabel", title: "Libellé « Email »", type: "string", fieldset: "labels", initialValue: "Email professionnel" }),
    defineField({ name: "phoneLabel", title: "Libellé « Téléphone »", type: "string", fieldset: "labels", initialValue: "Téléphone" }),
    defineField({ name: "eventTypeLabel", title: "Libellé « Type d'événement »", type: "string", fieldset: "labels", initialValue: "Type d'événement" }),
    defineField({ name: "headcountLabel", title: "Libellé « Nombre de participants »", type: "string", fieldset: "labels", initialValue: "Nombre de participants" }),
    defineField({ name: "periodLabel", title: "Libellé « Date / période »", type: "string", fieldset: "labels", initialValue: "Date ou période souhaitée" }),
    defineField({ name: "locationLabel", title: "Libellé « Lieu souhaité »", type: "string", fieldset: "labels", initialValue: "Lieu souhaité" }),
    defineField({ name: "scheduleLabel", title: "Libellé « Horaires et durée »", type: "string", fieldset: "labels", initialValue: "Horaires et durée" }),
    defineField({ name: "servicesLabel", title: "Libellé « Prestations envisagées »", type: "string", fieldset: "labels", initialValue: "Prestations envisagées" }),
    defineField({ name: "budgetLabel", title: "Libellé « Budget »", type: "string", fieldset: "labels", initialValue: "Budget global prévisionnel" }),
    defineField({ name: "objectiveLabel", title: "Libellé « Objectif »", type: "string", fieldset: "labels", initialValue: "Objectif principal de l'événement" }),
    defineField({ name: "notesLabel", title: "Libellé « Informations complémentaires »", type: "string", fieldset: "labels", initialValue: "Informations complémentaires" }),

    // ————————————————————— Bouton & confirmation —————————————————————
    defineField({
      name: "submitLabel",
      title: "Texte du bouton d'envoi",
      type: "string",
      fieldset: "after",
      initialValue: "Demander une étude personnalisée",
    }),
    defineField({
      name: "successTitle",
      title: "Titre du message de confirmation",
      type: "string",
      fieldset: "after",
      initialValue: "Merci !",
      description: "Affiché après l'envoi réussi du formulaire.",
    }),
    defineField({
      name: "successMessage",
      title: "Message de confirmation",
      type: "text",
      rows: 3,
      fieldset: "after",
      initialValue:
        "Votre demande a bien été transmise. Aïssa Events revient vers vous pour préciser votre projet.",
    }),
    defineField({
      name: "consentText",
      title: "Texte de la case de consentement (RGPD)",
      type: "string",
      fieldset: "after",
      initialValue:
        "J'accepte que mes données soient utilisées pour répondre à ma demande.",
      description:
        "Le lien vers la politique de confidentialité est ajouté automatiquement à la fin de cette phrase.",
    }),
  ],
  preview: { prepare: () => ({ title: "Formulaire de qualification" }) },
});
