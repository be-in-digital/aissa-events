/**
 * Setup HubSpot pour l'assistante virtuelle WhatsApp/Instagram.
 *
 * Crée de manière idempotente :
 *  - Les propriétés custom sur Contact (cf .context/agent-whatsapp-design.md §4)
 *  - Le pipeline custom « Aïssa Events » avec 4 étapes
 *
 * Prérequis : HUBSPOT_PRIVATE_APP_TOKEN dans .env.local
 *   1. https://app.hubspot.com → Settings → Integrations → Private Apps
 *   2. Create a private app → scopes : crm.objects.contacts.read+write, crm.schemas.contacts.read+write,
 *      crm.objects.deals.read+write, crm.schemas.deals.read+write, crm.objects.notes.read+write
 *   3. Copier le token (pat-...) dans .env.local : HUBSPOT_PRIVATE_APP_TOKEN=pat-...
 *
 * Usage : pnpm setup:hubspot
 *
 * Le script est idempotent : il vérifie l'existence avant de créer.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { Client } from "@hubspot/api-client";
import {
  PropertyCreateTypeEnum,
  PropertyCreateFieldTypeEnum,
} from "@hubspot/api-client/lib/codegen/crm/properties/models/PropertyCreate";

const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
if (!token) {
  console.error(
    "❌ HUBSPOT_PRIVATE_APP_TOKEN manquant. Configure-le dans .env.local.",
  );
  process.exit(1);
}

const hubspot = new Client({ accessToken: token });

// ────────────────────────────────────────────────────────────────────
// Propriétés Contact à créer
// ────────────────────────────────────────────────────────────────────

interface ContactPropDef {
  name: string;
  label: string;
  type: PropertyCreateTypeEnum;
  fieldType: PropertyCreateFieldTypeEnum;
  description: string;
  options?: { label: string; value: string }[];
  groupName?: string;
}

const PType = PropertyCreateTypeEnum;
const PField = PropertyCreateFieldTypeEnum;

const CONTACT_PROPS: ContactPropDef[] = [
  {
    name: "type_evenement",
    label: "Type d'événement",
    type: PType.Enumeration,
    fieldType: PField.Select,
    description: "Catégorie de l'événement organisé par Aïssa Events.",
    options: [
      { label: "Mariage", value: "mariage" },
      { label: "Événement privé / corporate", value: "evenement" },
      { label: "Location salle Émerainville", value: "location_salle" },
      { label: "Autre", value: "autre" },
    ],
  },
  {
    name: "date_evenement_souhaitee",
    label: "Date d'événement souhaitée",
    type: PType.Date,
    fieldType: PField.Date,
    description: "Date envisagée pour l'événement (format YYYY-MM-DD).",
  },
  {
    name: "nombre_invites_estime",
    label: "Nombre d'invités estimé",
    type: PType.Number,
    fieldType: PField.Number,
    description: "Estimation du nombre de personnes attendues.",
  },
  {
    name: "budget_indicatif",
    label: "Budget indicatif",
    type: PType.Enumeration,
    fieldType: PField.Select,
    description: "Fourchette de budget annoncée par le prospect.",
    options: [
      { label: "< 5 000 €", value: "moins_5k" },
      { label: "5 000 – 15 000 €", value: "5k_15k" },
      { label: "15 000 – 30 000 €", value: "15k_30k" },
      { label: "30 000 € +", value: "plus_30k" },
      { label: "Non communiqué", value: "nc" },
    ],
  },
  {
    name: "canal_origine",
    label: "Canal d'origine",
    type: PType.Enumeration,
    fieldType: PField.Select,
    description: "Canal par lequel le lead est entré dans le funnel.",
    options: [
      { label: "WhatsApp", value: "whatsapp" },
      { label: "Instagram DM", value: "instagram" },
      { label: "Formulaire site", value: "formulaire" },
      { label: "Calendly", value: "calendly" },
      { label: "Bouche-à-oreille / autre", value: "autre" },
    ],
  },
  {
    name: "score_qualification",
    label: "Score de qualification (0-100)",
    type: PType.Number,
    fieldType: PField.Number,
    description: "Score calculé par l'agent IA selon la complétion des champs et l'engagement.",
  },
  {
    name: "human_takeover",
    label: "Aïssa a repris la main",
    type: PType.Bool,
    fieldType: PField.Booleancheckbox,
    description: "Si vrai, l'agent IA ne répond plus — Aïssa répond manuellement.",
  },
  {
    name: "dernier_message_at",
    label: "Dernier message reçu le",
    type: PType.Datetime,
    fieldType: PField.Date,
    description: "Timestamp du dernier message entrant — utilisé par le cron SLA.",
  },
  {
    name: "consentement_rgpd_at",
    label: "Consentement RGPD donné le",
    type: PType.Datetime,
    fieldType: PField.Date,
    description: "Date à laquelle le prospect a tacitement accepté en répondant au 1er message.",
  },
  {
    name: "relance_sla_envoyee_at",
    label: "Relance SLA envoyée le",
    type: PType.Datetime,
    fieldType: PField.Date,
    description:
      "Timestamp de la dernière relance SLA automatique envoyée. Permet d'éviter d'envoyer plusieurs fois la même relance.",
  },
  {
    name: "instagram_handle",
    label: "Instagram handle",
    type: PType.String,
    fieldType: PField.Text,
    description: "Identifiant Instagram du prospect (pour les leads venant d'Insta DM).",
  },
];

const CONTACT_GROUP_NAME = "aissa_assistant_phase2";
const CONTACT_GROUP_LABEL = "Assistante virtuelle (phase 2)";

// ────────────────────────────────────────────────────────────────────
// Pipeline Deals
// ────────────────────────────────────────────────────────────────────

const PIPELINE_LABEL = "Aïssa Events — Leads assistants";
const PIPELINE_STAGES: { label: string; probability: number; metadata: Record<string, string> }[] = [
  { label: "Nouveau lead", probability: 0.1, metadata: { ticketState: "OPEN" } },
  { label: "Qualifié", probability: 0.3, metadata: { ticketState: "OPEN" } },
  { label: "Devis envoyé", probability: 0.6, metadata: { ticketState: "OPEN" } },
  { label: "Gagné", probability: 1.0, metadata: { isClosed: "true", ticketState: "CLOSED" } },
  { label: "Perdu", probability: 0.0, metadata: { isClosed: "true", ticketState: "CLOSED" } },
];

// ────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────

async function ensurePropertyGroup() {
  try {
    await hubspot.crm.properties.groupsApi.getByName("contacts", CONTACT_GROUP_NAME);
    console.log(`✓ Groupe « ${CONTACT_GROUP_LABEL} » déjà présent.`);
  } catch {
    await hubspot.crm.properties.groupsApi.create("contacts", {
      name: CONTACT_GROUP_NAME,
      label: CONTACT_GROUP_LABEL,
      displayOrder: 99,
    });
    console.log(`✅ Groupe « ${CONTACT_GROUP_LABEL} » créé.`);
  }
}

async function ensureContactProperty(prop: ContactPropDef) {
  try {
    await hubspot.crm.properties.coreApi.getByName("contacts", prop.name);
    console.log(`✓ Propriété contact « ${prop.name} » déjà présente.`);
  } catch {
    await hubspot.crm.properties.coreApi.create("contacts", {
      name: prop.name,
      label: prop.label,
      type: prop.type,
      fieldType: prop.fieldType,
      description: prop.description,
      groupName: prop.groupName ?? CONTACT_GROUP_NAME,
      options: (prop.options ?? []).map((o, i) => ({
        ...o,
        displayOrder: i,
        hidden: false,
      })),
      hasUniqueValue: false,
      hidden: false,
      formField: false,
      displayOrder: -1,
    });
    console.log(`✅ Propriété contact « ${prop.name} » créée.`);
  }
}

async function ensurePipeline(): Promise<string> {
  // List existing pipelines
  const pipelines = await hubspot.crm.pipelines.pipelinesApi.getAll("deals");
  const existing = pipelines.results?.find((p) => p.label === PIPELINE_LABEL);
  if (existing) {
    console.log(`✓ Pipeline « ${PIPELINE_LABEL} » déjà présent (id=${existing.id}).`);
    return existing.id;
  }

  const created = await hubspot.crm.pipelines.pipelinesApi.create("deals", {
    label: PIPELINE_LABEL,
    displayOrder: 1,
    stages: PIPELINE_STAGES.map((s, i) => ({
      label: s.label,
      displayOrder: i,
      metadata: { probability: String(s.probability), ...s.metadata },
    })),
  });
  console.log(`✅ Pipeline « ${PIPELINE_LABEL} » créé (id=${created.id}).`);
  return created.id;
}

// ────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Setup HubSpot pour l'assistante Aïssa Events...\n");

  console.log("1. Groupe de propriétés Contact");
  await ensurePropertyGroup();

  console.log("\n2. Propriétés Contact custom");
  for (const prop of CONTACT_PROPS) {
    try {
      await ensureContactProperty(prop);
    } catch (err) {
      console.error(`❌ Échec création « ${prop.name} » :`, (err as Error).message);
    }
  }

  console.log("\n3. Pipeline Deals");
  let pipelineId: string | undefined;
  try {
    pipelineId = await ensurePipeline();
  } catch (err) {
    console.error("❌ Échec création pipeline :", (err as Error).message);
  }

  console.log("\n✨ Setup terminé.");
  if (pipelineId) {
    console.log(`\n📝 Pense à ajouter dans .env.local :`);
    console.log(`HUBSPOT_PIPELINE_ID=${pipelineId}`);
  }
}

main().catch((err) => {
  console.error("💥 Erreur fatale :", err);
  process.exit(1);
});
