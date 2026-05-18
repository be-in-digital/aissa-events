import { defineField, defineType } from "sanity";

export const availability = defineType({
  name: "availability",
  title: "Disponibilités (calendrier)",
  type: "document",
  groups: [
    { name: "source", title: "Source Google Calendar", default: true },
    { name: "sync", title: "État de synchronisation" },
    { name: "busy", title: "Plages occupées" },
    { name: "config", title: "Réglages d'affichage" },
  ],
  fields: [
    defineField({
      name: "enabled",
      title: "Activer le calendrier public",
      type: "boolean",
      group: "source",
      initialValue: true,
      description:
        "Décocher pour cacher complètement le calendrier interactif (kill switch). Sans URL ICS, le calendrier reste visible mais toutes les dates apparaissent libres — utile pour tester la mise en page avant l'onboarding Google Calendar.",
    }),
    defineField({
      name: "feedUrl",
      title: "URL ICS publique du calendrier Google",
      type: "url",
      group: "source",
      description:
        "Coller ici l'adresse secrète au format iCal du calendrier dédié « Aïssa Events — Bookings » (Paramètres Google Calendar → Intégrer le calendrier → URL secrète au format iCal).",
      validation: (Rule) =>
        Rule.uri({ scheme: ["https", "http", "webcal"] }).custom((value) => {
          if (!value) return true;
          if (typeof value !== "string") return true;
          if (value.includes("calendar.google.com") || value.endsWith(".ics"))
            return true;
          return "L'URL doit pointer vers un flux ICS (calendar.google.com ou .ics).";
        }),
    }),
    defineField({
      name: "monthsAhead",
      title: "Nombre de mois affichés par défaut",
      type: "number",
      group: "config",
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(12).integer(),
      description:
        "Vue par défaut côté visiteur. Un bouton « Voir plus loin » permet d'étendre jusqu'à 12 mois.",
    }),
    defineField({
      name: "defaultOptionDurationDays",
      title: "Durée par défaut d'une option (jours)",
      type: "number",
      group: "config",
      initialValue: 14,
      validation: (Rule) => Rule.min(1).max(90).integer(),
      description:
        "Si un event Google est préfixé `[option]` sans date butoir, on considère qu'il expire après ce nombre de jours depuis sa création.",
    }),
    defineField({
      name: "fallbackRemainingDates",
      title: "Repli : nombre de dates libres affichées",
      type: "number",
      group: "config",
      initialValue: 12,
      validation: (Rule) => Rule.min(0).integer(),
      description:
        "Utilisé quand le calendrier est désactivé ou que la synchro a échoué.",
    }),
    defineField({
      name: "fallbackYear",
      title: "Repli : année affichée",
      type: "number",
      group: "config",
      initialValue: 2026,
      validation: (Rule) => Rule.min(2025).max(2099).integer(),
    }),
    // ─────────── Sync ───────────
    defineField({
      name: "lastSyncedAt",
      title: "Dernière synchronisation",
      type: "datetime",
      group: "sync",
      readOnly: true,
      description:
        "Mis à jour automatiquement par le cron (3×/jour : 7h, 12h, 18h UTC). Lecture seule.",
    }),
    defineField({
      name: "lastSyncStatus",
      title: "Statut de la dernière synchro",
      type: "string",
      group: "sync",
      readOnly: true,
      options: {
        list: [
          { title: "OK", value: "ok" },
          { title: "Erreur", value: "error" },
          { title: "Jamais lancée", value: "never" },
        ],
      },
      initialValue: "never",
    }),
    defineField({
      name: "lastSyncError",
      title: "Détail de la dernière erreur",
      type: "text",
      rows: 3,
      group: "sync",
      readOnly: true,
    }),
    // ─────────── Busy ranges ───────────
    defineField({
      name: "busyRanges",
      title: "Plages occupées (auto)",
      type: "array",
      group: "busy",
      readOnly: true,
      description:
        "Écrit par le cron de synchronisation. Ne pas éditer manuellement — toute modification sera écrasée à la prochaine synchro.",
      of: [
        {
          type: "object",
          name: "busyRange",
          fields: [
            defineField({
              name: "uid",
              title: "UID Google",
              type: "string",
            }),
            defineField({
              name: "start",
              title: "Début",
              type: "datetime",
            }),
            defineField({
              name: "end",
              title: "Fin",
              type: "datetime",
            }),
            defineField({
              name: "status",
              title: "Statut",
              type: "string",
              options: {
                list: [
                  { title: "Réservé", value: "booked" },
                  { title: "Option", value: "option" },
                ],
              },
            }),
            defineField({
              name: "kind",
              title: "Type (interne)",
              type: "string",
              description:
                "Déduit d'un tag dans le titre Google : [mariage], [pro], [salle], [perso]. Jamais affiché publiquement.",
              options: {
                list: [
                  { title: "Mariage", value: "mariage" },
                  { title: "Pro", value: "pro" },
                  { title: "Salle seule", value: "salle" },
                  { title: "Personnel / bloqué", value: "perso" },
                  { title: "Indéterminé", value: "unknown" },
                ],
              },
            }),
            defineField({
              name: "optionExpiresAt",
              title: "Expiration de l'option",
              type: "datetime",
            }),
          ],
          preview: {
            select: {
              start: "start",
              end: "end",
              status: "status",
              kind: "kind",
            },
            prepare({ start, end, status, kind }) {
              const fmt = (iso?: string) =>
                iso
                  ? new Date(iso).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "?";
              const label =
                status === "option" ? "🟡 Option" : "🔴 Réservé";
              return {
                title: `${label} · ${fmt(start)} → ${fmt(end)}`,
                subtitle: kind ? `Type : ${kind}` : undefined,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Disponibilités (calendrier)" }),
  },
});
