import { defineField, defineType } from "sanity";

/**
 * Un rendez-vous réservé depuis le site (appel découverte).
 * Créé par `POST /api/booking` — les champs sont en lecture seule dans le
 * Studio : ils reflètent ce que le visiteur a saisi. Aïssa peut passer un RDV
 * en « Annulé » pour libérer le créneau.
 */
export const booking = defineType({
  name: "booking",
  title: "Rendez-vous",
  type: "document",
  fields: [
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "Confirmé", value: "confirmed" },
          { title: "Annulé", value: "cancelled" },
        ],
        layout: "radio",
      },
      initialValue: "confirmed",
      description:
        "Passer en « Annulé » libère le créneau côté site (il redevient réservable).",
    }),
    defineField({
      name: "bookingTypeTitle",
      title: "Type de rendez-vous",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "bookingTypeSlug",
      title: "Type (identifiant)",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "start",
      title: "Début",
      type: "datetime",
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "end",
      title: "Fin",
      type: "datetime",
      readOnly: true,
    }),
    defineField({ name: "name", title: "Nom", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({ name: "phone", title: "Téléphone", type: "string", readOnly: true }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 3,
      readOnly: true,
    }),
    defineField({
      name: "meetingType",
      title: "Format",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "meetLink",
      title: "Lien visio (Meet)",
      type: "url",
      readOnly: true,
      description: "Généré automatiquement pour les RDV en visio (si Google Calendar est branché).",
    }),
    defineField({
      name: "googleEventId",
      title: "ID event Google Calendar",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "preferredEventDate",
      title: "Date d'événement envisagée",
      type: "date",
      readOnly: true,
      description: "Date qui intéressait le visiteur (contexte), pas la date de l'appel.",
    }),
    defineField({ name: "source", title: "Source (page)", type: "string", readOnly: true }),
    defineField({ name: "utmContent", title: "UTM content", type: "string", readOnly: true }),
    defineField({
      name: "createdAt",
      title: "Réservé le",
      type: "datetime",
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Date du rendez-vous (à venir d'abord)",
      name: "startAsc",
      by: [{ field: "start", direction: "asc" }],
    },
    {
      title: "Réservé récemment",
      name: "createdDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { name: "name", start: "start", status: "status", typeTitle: "bookingTypeTitle" },
    prepare({ name, start, status, typeTitle }) {
      const when = start
        ? new Date(start).toLocaleString("fr-FR", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Paris",
          })
        : "?";
      const badge = status === "cancelled" ? "⛔️" : "✅";
      return {
        title: `${badge} ${name ?? "Sans nom"}`,
        subtitle: [typeTitle, when].filter(Boolean).join(" · "),
      };
    },
  },
});
