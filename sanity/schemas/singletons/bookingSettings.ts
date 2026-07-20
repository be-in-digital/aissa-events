import { defineField, defineType } from "sanity";

/**
 * Réglages GLOBAUX de la réservation en ligne : kill-switch général + textes de
 * la page de choix (« Quel type de rendez-vous ? »). Les réglages propres à
 * chaque rendez-vous (horaires, durée, format…) vivent dans la collection
 * « Types de rendez-vous » (schéma `bookingType`).
 */
export const bookingSettings = defineType({
  name: "bookingSettings",
  title: "Réservation — page de choix",
  type: "document",
  fields: [
    defineField({
      name: "enabled",
      title: "Activer la réservation en ligne",
      type: "boolean",
      initialValue: true,
      description:
        "Kill-switch général : décocher coupe TOUTE la prise de rendez-vous (tous les types). Les boutons « Réserver » affichent alors un repli.",
    }),
    defineField({
      name: "chooserEyebrow",
      title: "Sur-titre (page de choix)",
      type: "string",
      initialValue: "Prendre rendez-vous",
    }),
    defineField({
      name: "chooserTitle",
      title: "Titre (page de choix)",
      type: "string",
      initialValue: "Quel type de rendez-vous ?",
    }),
    defineField({
      name: "chooserDescription",
      title: "Sous-titre (page de choix)",
      type: "text",
      rows: 2,
      initialValue:
        "Choisissez le format qui vous convient — on s'occupe du reste.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Réservation — page de choix" }),
  },
});
