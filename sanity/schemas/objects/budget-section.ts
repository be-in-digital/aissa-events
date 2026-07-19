import { defineType, defineField } from "sanity";

/**
 * Section « Comment est construit le budget » de la page Entreprises.
 *
 * Explique la distinction honoraires Aïssa Events / prestations extérieures.
 * Entièrement éditable depuis le Studio, avec des textes d'aide.
 */
export const budgetSection = defineType({
  name: "budgetSection",
  title: "Comment est construit le budget",
  type: "object",
  fields: [
    defineField({
      name: "enabled",
      title: "Section activée",
      type: "boolean",
      initialValue: true,
      description: "Décochez pour masquer cette section sur la page.",
    }),
    defineField({
      name: "eyebrow",
      title: "Petit texte au-dessus du titre",
      type: "string",
      initialValue: "Transparence",
    }),
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      initialValue: "Comment est construit votre budget",
      description: "Encadrez un mot avec des _underscores_ pour l'afficher en italique.",
    }),
    defineField({
      name: "intro",
      title: "Texte d'introduction",
      type: "text",
      rows: 2,
      initialValue:
        "Chaque proposition distingue clairement nos honoraires d'organisation du budget des prestations extérieures.",
    }),
    defineField({
      name: "items",
      title: "Blocs d'explication",
      type: "array",
      description:
        "Les blocs qui détaillent le budget. Par défaut : honoraires Aïssa Events, prestations extérieures, et estimation budgétaire.",
      of: [
        {
          type: "object",
          name: "budgetItem",
          fields: [
            defineField({ name: "title", title: "Titre du bloc", type: "string" }),
            defineField({ name: "description", title: "Explication", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
      initialValue: [
        {
          _type: "budgetItem",
          title: "Honoraires Aïssa Events",
          description:
            "Ils rémunèrent le travail d'organisatrice : cadrage, conception, budget prévisionnel, recherche du lieu et des prestataires, analyse des propositions, rétroplanning, conducteur, coordination et pilotage du jour J.",
        },
        {
          _type: "budgetItem",
          title: "Prestations extérieures",
          description:
            "Elles regroupent le lieu, la restauration et les boissons, le mobilier, la technique, la décoration, le personnel, la sécurité, les animations, les artistes, la photographie, la vidéo et la logistique.",
        },
        {
          _type: "budgetItem",
          title: "Estimation budgétaire",
          description:
            "La première proposition présente séparément les honoraires Aïssa Events et une fourchette réaliste pour chaque poste extérieur. Après validation de l'orientation, les fourchettes sont remplacées par les devis réels des prestataires sélectionnés.",
        },
      ],
    }),
    defineField({
      name: "note",
      title: "Mention en bas de section",
      type: "string",
      initialValue:
        "Les tarifs ne sont pas affichés sur le site : chaque événement est unique et chiffré sur devis.",
      description: "Petite phrase de rappel sous les blocs. Laisser vide pour la masquer.",
    }),
  ],
  preview: { prepare: () => ({ title: "Comment est construit le budget" }) },
});
