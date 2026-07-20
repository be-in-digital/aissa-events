import { defineArrayMember, defineField, defineType } from "sanity";

const WEEKDAY_OPTIONS = [
  { title: "Lundi", value: 1 },
  { title: "Mardi", value: 2 },
  { title: "Mercredi", value: 3 },
  { title: "Jeudi", value: 4 },
  { title: "Vendredi", value: 5 },
  { title: "Samedi", value: 6 },
  { title: "Dimanche", value: 7 },
];

const HHMM = /^([01]?\d|2[0-3]):[0-5]\d$/;

const MEETING_LABEL: Record<string, string> = {
  phone: "📞 Appel",
  video: "🎥 Visio",
  inperson: "📍 Sur place",
};

/**
 * Un TYPE de rendez-vous réservable (ex. « Appel découverte », « Visite de
 * l'Espace Events »). Collection : l'agence en crée autant qu'elle veut, chacun
 * avec ses horaires, son format, sa durée et ses textes. Les créneaux occupés
 * (tous types confondus + Google Calendar) sont retirés automatiquement.
 */
export const bookingType = defineType({
  name: "bookingType",
  title: "Type de rendez-vous",
  type: "document",
  groups: [
    { name: "general", title: "Général", default: true },
    { name: "hours", title: "Horaires & créneaux" },
    { name: "copy", title: "Textes affichés" },
    { name: "advanced", title: "Avancé" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Nom du type",
      type: "string",
      group: "general",
      description: "Ex : « Appel découverte », « Visite de l'Espace Events ». Affiché sur la page de choix.",
      validation: (Rule) => Rule.required().min(2).max(60),
    }),
    defineField({
      name: "slug",
      title: "Identifiant d'URL",
      type: "slug",
      group: "general",
      description: "Utilisé dans l'adresse : /reserver/appel, /reserver/visite. Généré depuis le nom.",
      options: { source: "title", maxLength: 40 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "enabled",
      title: "Activer ce type",
      type: "boolean",
      group: "general",
      initialValue: true,
      description: "Décocher pour le retirer de la page de choix sans le supprimer.",
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      group: "general",
      initialValue: 0,
      description: "Plus petit = affiché en premier sur la page de choix.",
    }),
    defineField({
      name: "cardDescription",
      title: "Description courte (carte de choix)",
      type: "text",
      rows: 2,
      group: "general",
      description: "Une phrase affichée sur la carte, ex : « Un premier échange de 15 min, par téléphone. »",
    }),
    defineField({
      name: "meetingType",
      title: "Format du rendez-vous",
      type: "string",
      group: "general",
      initialValue: "phone",
      options: {
        list: [
          { title: "Appel téléphonique (Aïssa rappelle)", value: "phone" },
          { title: "Visioconférence", value: "video" },
          { title: "Rendez-vous sur place", value: "inperson" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "meetingDetail",
      title: "Détail du format (optionnel)",
      type: "string",
      group: "general",
      description:
        "Lien visio (Meet/Zoom), adresse du rendez-vous, ou consigne. Ajouté à l'email de confirmation et à l'invitation agenda. Pour un appel où Aïssa rappelle, laisser vide.",
    }),
    // ─────────── Horaires ───────────
    defineField({
      name: "durationMinutes",
      title: "Durée (minutes)",
      type: "number",
      group: "hours",
      initialValue: 15,
      validation: (Rule) => Rule.required().min(5).max(240).integer(),
    }),
    defineField({
      name: "bufferMinutes",
      title: "Battement entre deux rendez-vous (minutes)",
      type: "number",
      group: "hours",
      initialValue: 15,
      validation: (Rule) => Rule.min(0).max(120).integer(),
      description: "Ex : durée 15 + battement 15 → un créneau toutes les 30 min.",
    }),
    defineField({
      name: "minNoticeHours",
      title: "Délai minimum avant un rendez-vous (heures)",
      type: "number",
      group: "hours",
      initialValue: 24,
      validation: (Rule) => Rule.min(0).max(720).integer(),
    }),
    defineField({
      name: "horizonDays",
      title: "Fenêtre de réservation (jours)",
      type: "number",
      group: "hours",
      initialValue: 30,
      validation: (Rule) => Rule.min(1).max(180).integer(),
    }),
    defineField({
      name: "timezone",
      title: "Fuseau horaire",
      type: "string",
      group: "hours",
      initialValue: "Europe/Paris",
    }),
    defineField({
      name: "weeklyHours",
      title: "Plages d'ouverture hebdomadaires",
      type: "array",
      group: "hours",
      description:
        "Jours et heures où ce type de RDV est proposé. Plusieurs plages par jour possibles.",
      of: [
        defineArrayMember({
          type: "object",
          name: "weeklyHour",
          fields: [
            defineField({
              name: "weekday",
              title: "Jour",
              type: "number",
              options: { list: WEEKDAY_OPTIONS, layout: "dropdown" },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "start",
              title: "De (HH:mm)",
              type: "string",
              initialValue: "10:00",
              validation: (Rule) => Rule.required().regex(HHMM, { name: "heure (HH:mm)" }),
            }),
            defineField({
              name: "end",
              title: "À (HH:mm)",
              type: "string",
              initialValue: "18:00",
              validation: (Rule) => Rule.required().regex(HHMM, { name: "heure (HH:mm)" }),
            }),
          ],
          preview: {
            select: { weekday: "weekday", start: "start", end: "end" },
            prepare({ weekday, start, end }) {
              const day = WEEKDAY_OPTIONS.find((d) => d.value === weekday)?.title ?? "?";
              return { title: `${day} · ${start ?? "?"} → ${end ?? "?"}` };
            },
          },
        }),
      ],
      initialValue: [
        { weekday: 2, start: "10:00", end: "18:00" },
        { weekday: 3, start: "10:00", end: "18:00" },
        { weekday: 4, start: "10:00", end: "18:00" },
        { weekday: 5, start: "10:00", end: "18:00" },
        { weekday: 6, start: "10:00", end: "13:00" },
      ],
    }),
    // ─────────── Copy ───────────
    defineField({
      name: "eyebrow",
      title: "Sur-titre",
      type: "string",
      group: "copy",
      initialValue: "Réserver un rendez-vous",
    }),
    defineField({
      name: "headline",
      title: "Titre affiché dans le flux",
      type: "string",
      group: "copy",
      initialValue: "Choisissez votre créneau.",
    }),
    defineField({
      name: "description",
      title: "Sous-titre",
      type: "text",
      rows: 2,
      group: "copy",
    }),
    defineField({
      name: "consentLabel",
      title: "Texte de consentement (case à cocher)",
      type: "text",
      rows: 2,
      group: "copy",
      initialValue:
        "J'accepte d'être recontacté(e) par Aïssa Events au sujet de ma demande.",
    }),
    defineField({
      name: "confirmationTitle",
      title: "Titre de l'écran de confirmation",
      type: "string",
      group: "copy",
      initialValue: "C'est noté — votre rendez-vous est réservé.",
    }),
    defineField({
      name: "confirmationBody",
      title: "Message de confirmation",
      type: "text",
      rows: 3,
      group: "copy",
      initialValue:
        "Vous allez recevoir un email de confirmation avec l'invitation à ajouter à votre agenda.",
    }),
    // ─────────── Advanced ───────────
    defineField({
      name: "useAvailabilityFeed",
      title: "Retirer les créneaux occupés de Google Calendar",
      type: "boolean",
      group: "advanced",
      initialValue: true,
      description:
        "Recommandé. Utilise le flux ICS secret du doc « Disponibilités » pour ne pas proposer un créneau où Aïssa est déjà prise.",
    }),
    defineField({
      name: "createHubspotContact",
      title: "Créer un contact HubSpot à chaque réservation",
      type: "boolean",
      group: "advanced",
      initialValue: true,
      description: "Sans effet si HubSpot n'est pas configuré côté serveur.",
    }),
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", meetingType: "meetingType", duration: "durationMinutes", enabled: "enabled" },
    prepare({ title, meetingType, duration, enabled }) {
      const badge = MEETING_LABEL[meetingType as string] ?? "";
      const off = enabled === false ? " · (désactivé)" : "";
      return {
        title: title ?? "Type sans nom",
        subtitle: `${badge} · ${duration ?? "?"} min${off}`,
      };
    },
  },
});
