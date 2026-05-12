import { defineField, defineType } from "sanity";

/**
 * Singleton de configuration de l'assistante virtuelle WhatsApp / Instagram.
 *
 * La connexion au compte WhatsApp Business est gérée côté serveur via le
 * System User Token Meta (variables d'environnement) — voir
 * `.context/whatsapp-deliverable.md` pour le détail de la procédure.
 */
export const agentSettings = defineType({
  name: "agentSettings",
  title: "Assistante virtuelle",
  type: "document",
  groups: [
    { name: "persona", title: "Persona & ton", default: true },
    { name: "messages", title: "Messages-clés" },
    { name: "behaviour", title: "Comportement" },
    { name: "pricing", title: "Tarifs publics" },
    { name: "sla", title: "Délais de réponse" },
    { name: "killSwitch", title: "Pause d'urgence" },
    { name: "audit", title: "Audit" },
  ],
  fields: [
    // ─────────────────────────────────────────────
    // Persona & ton
    // ─────────────────────────────────────────────
    defineField({
      name: "personaName",
      title: "Prénom de l'assistante",
      type: "string",
      group: "persona",
      initialValue: "Ayo",
      description:
        "Prénom utilisé par l'assistante dans les conversations. Par défaut : Ayo (« joie » en yoruba).",
      validation: (Rule) => Rule.max(40).required(),
    }),
    defineField({
      name: "personaTone",
      title: "Ton de l'assistante",
      type: "string",
      group: "persona",
      initialValue: "chaleureux",
      options: {
        list: [
          { title: "Chaleureux et accueillant", value: "chaleureux" },
          { title: "Professionnel et factuel", value: "professionnel" },
          { title: "Décontracté et amical", value: "decontracte" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "personaIntroLine",
      title: "Ligne d'intro personnalisée (optionnel)",
      type: "string",
      group: "persona",
      description:
        "Phrase courte d'introduction que l'assistante peut utiliser. Ex : « J'accompagne Aïssa pour préparer votre projet. »",
    }),

    // ─────────────────────────────────────────────
    // Messages-clés
    // ─────────────────────────────────────────────
    defineField({
      name: "messageAccueil",
      title: "Message d'accueil (1er contact)",
      type: "text",
      rows: 5,
      group: "messages",
      description:
        "Premier message envoyé à un nouveau prospect. Variables disponibles : {personaName}, {nomAgence}. Doit mentionner explicitement le statut d'assistante.",
      initialValue:
        "Bonjour 🌿 Félicitations pour votre projet ! Je suis {personaName}, l'assistante d'{nomAgence} — je l'aide à recevoir vos demandes pour qu'elle puisse vous accompagner personnellement. Pour commencer, dites-moi tout sur votre projet ? Vos données restent confidentielles (aissaevents.com/politique-confidentialite).",
      validation: (Rule) =>
        Rule.custom((text) => {
          if (typeof text !== "string" || text.trim().length === 0)
            return "Le message d'accueil est obligatoire.";
          if (!text.toLowerCase().includes("assistante"))
            return "Doit contenir « assistante » (transparence RGPD).";
          return true;
        }),
    }),
    defineField({
      name: "messageRelanceSlaDepasse",
      title: "Relance automatique si SLA dépassé",
      type: "text",
      rows: 3,
      group: "messages",
      initialValue:
        "Bonjour, c'est {personaName}, l'assistante d'{nomAgence}. Je voulais vous confirmer qu'Aïssa a bien reçu votre message — elle revient vers vous dès qu'elle est disponible. Merci pour votre patience !",
    }),
    defineField({
      name: "messageFinDeConversation",
      title: "Message de transmission à Aïssa (handover)",
      type: "text",
      rows: 3,
      group: "messages",
      initialValue:
        "Parfait, je transmets votre demande à Aïssa qui prendra le relais personnellement. Elle revient vers vous très rapidement.",
    }),
    defineField({
      name: "messagePauseActivee",
      title: "Réponse quand l'assistante est en pause",
      type: "text",
      rows: 3,
      group: "messages",
      description:
        "Message envoyé si pauseAgent=true. Si vide, l'assistante ne répond rien et Aïssa doit répondre manuellement.",
      initialValue:
        "Bonjour, votre message a bien été reçu. Aïssa revient vers vous personnellement très rapidement.",
    }),

    // ─────────────────────────────────────────────
    // Comportement (FAQ, triggers, mots interdits, instructions libres)
    // ─────────────────────────────────────────────
    defineField({
      name: "faqPrioritaires",
      title: "FAQ prioritaires",
      type: "array",
      group: "behaviour",
      description:
        "Questions/réponses que l'assistante doit traiter en priorité. Limité à 20 entrées.",
      validation: (Rule) => Rule.max(20),
      of: [
        {
          type: "object",
          name: "faqEntry",
          fields: [
            {
              name: "question",
              type: "string",
              title: "Question type",
              validation: (Rule) => Rule.required().max(200),
            },
            {
              name: "reponse",
              type: "text",
              title: "Réponse à donner",
              rows: 4,
              validation: (Rule) => Rule.required().max(800),
            },
          ],
          preview: {
            select: { title: "question", subtitle: "reponse" },
          },
        },
      ],
    }),
    defineField({
      name: "triggersHandover",
      title: "Mots déclencheurs handover vers Aïssa",
      type: "array",
      group: "behaviour",
      of: [{ type: "string" }],
      description:
        "Mots ou expressions qui déclenchent le passage automatique à Aïssa. Liste additive aux triggers système (devis, urgent, prix définitif…).",
      initialValue: ["devis", "négocier", "rabais", "parler à Aïssa", "rendez-vous"],
    }),
    defineField({
      name: "motsInterdits",
      title: "Termes que l'assistante ne doit jamais utiliser",
      type: "array",
      group: "behaviour",
      of: [{ type: "string" }],
      initialValue: [
        "tarif définitif",
        "réservation confirmée",
        "remise garantie",
        "date bloquée",
      ],
    }),
    defineField({
      name: "instructionsLibres",
      title: "Instructions supplémentaires à l'assistante",
      type: "text",
      rows: 8,
      group: "behaviour",
      description:
        "Zone libre (max 500 mots ≈ 3000 caractères). Sera injectée après les règles critiques. Ex : « Toujours proposer la visite de la salle si plus de 80 invités. »",
      validation: (Rule) => Rule.max(3000),
    }),

    // ─────────────────────────────────────────────
    // Tarifs publics autorisés
    // ─────────────────────────────────────────────
    defineField({
      name: "fourchettesPublic",
      title: "Fourchettes de prix publiques (catalogue 2026)",
      type: "array",
      group: "pricing",
      description:
        "L'assistante peut citer ces fourchettes lorsque le prospect demande un ordre de grandeur. Toujours formulé « à partir de X € » — jamais de prix définitif.",
      of: [
        {
          type: "object",
          name: "fourchette",
          fields: [
            {
              name: "label",
              type: "string",
              title: "Libellé (ex: « Pack Celebration Classic »)",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "prixMin",
              type: "number",
              title: "Prix de départ (€)",
              validation: (Rule) => Rule.required().min(0),
            },
            {
              name: "categorie",
              type: "string",
              title: "Catégorie",
              options: {
                list: [
                  { title: "Mariage", value: "mariage" },
                  { title: "Événement / Pack Ambiance", value: "evenement" },
                  { title: "Location salle Émerainville", value: "salle" },
                ],
              },
            },
          ],
          preview: {
            select: { title: "label", prixMin: "prixMin" },
            prepare: ({ title, prixMin }) => ({
              title,
              subtitle: prixMin ? `À partir de ${prixMin} €` : undefined,
            }),
          },
        },
      ],
    }),

    // ─────────────────────────────────────────────
    // SLA
    // ─────────────────────────────────────────────
    defineField({
      name: "slaHeuresOuvreesMinutes",
      title: "SLA en heures ouvrées (minutes)",
      type: "number",
      group: "sla",
      initialValue: 30,
      validation: (Rule) => Rule.min(5).max(240),
      description:
        "Délai promis au prospect en journée. Si dépassé, un message de relance auto est envoyé.",
    }),
    defineField({
      name: "slaHorsHeuresHours",
      title: "SLA hors heures ouvrées (heures)",
      type: "number",
      group: "sla",
      initialValue: 12,
      validation: (Rule) => Rule.min(1).max(48),
    }),

    // ─────────────────────────────────────────────
    // Kill switch (Pause d'urgence)
    // ─────────────────────────────────────────────
    defineField({
      name: "pauseAgent",
      title: "Mettre l'assistante en pause",
      type: "boolean",
      group: "killSwitch",
      initialValue: false,
      description:
        "Si activé, l'assistante ne répondra plus aux nouveaux messages. Aïssa devra répondre manuellement depuis WhatsApp Business. À utiliser en cas de dérapage ou pendant une indisponibilité prolongée.",
    }),
    defineField({
      name: "pauseAgentUntil",
      title: "Pause automatique jusqu'à",
      type: "datetime",
      group: "killSwitch",
      description:
        "Optionnel — si renseigné, la pause sera levée automatiquement à cette date/heure. Sinon la pause reste active tant que le toggle ci-dessus est sur ON.",
    }),
    defineField({
      name: "pauseReason",
      title: "Raison de la pause (audit)",
      type: "string",
      group: "killSwitch",
      description: "Pourquoi la pause a-t-elle été activée ? (visible dans l'historique).",
    }),

    // ─────────────────────────────────────────────
    // Audit (lecture seule)
    // ─────────────────────────────────────────────
    defineField({
      name: "lastModifiedAt",
      title: "Dernière modification",
      type: "datetime",
      group: "audit",
      readOnly: true,
    }),
    defineField({
      name: "lastModifiedBy",
      title: "Modifiée par",
      type: "string",
      group: "audit",
      readOnly: true,
    }),
  ],
  preview: {
    select: { paused: "pauseAgent", persona: "personaName" },
    prepare: ({ paused, persona }) => ({
      title: "Assistante virtuelle",
      subtitle: paused
        ? "⏸ En pause"
        : `🟢 Active${persona ? ` — ${persona}` : ""}`,
    }),
  },
});
