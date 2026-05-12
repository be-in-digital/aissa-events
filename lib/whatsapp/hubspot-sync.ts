import "server-only";

import { Client } from "@hubspot/api-client";
import { FilterOperatorEnum } from "@hubspot/api-client/lib/codegen/crm/contacts/models/Filter";
import { AssociationSpecAssociationCategoryEnum } from "@hubspot/api-client/lib/codegen/crm/objects/models/AssociationSpec";

import type { NormalisedIncoming } from "./types";

/**
 * Synchronisation des messages entrants (WA / Insta) vers HubSpot.
 *
 * Stratégie MVP (Phase 2 — étape 9) :
 *  1. Cherche un contact par téléphone (WA) ou handle (Insta) via searchApi
 *  2. Si pas trouvé → création avec les propriétés disponibles (lifecyclestage=lead)
 *  3. Append une Note (engagement) au contact avec le contenu du message
 *
 * Le pipeline custom + propriétés type_evenement / date_evenement_souhaitee /
 * nombre_invites_estime arrivent en étape 11 (intégration HubSpot complète).
 *
 * Toutes les erreurs sont absorbées et loggées (non-bloquantes pour le webhook).
 */

interface SyncResult {
  ok: boolean;
  contactId?: string;
  created?: boolean;
  noteId?: string;
  error?: string;
}

const ASSOC_CONTACT_TO_NOTE = 202; // HubSpot built-in association type

function getClient(): Client | null {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return null;
  return new Client({ accessToken: token });
}

function buildPhoneE164(contactRef: string, channel: NormalisedIncoming["channel"]): string | null {
  if (channel !== "whatsapp") return null;
  // WA `wa_id` est déjà au format E.164 sans le "+". On préfixe.
  if (/^\d{6,15}$/.test(contactRef)) return `+${contactRef}`;
  if (contactRef.startsWith("+")) return contactRef;
  return null;
}

async function findContact(
  hubspot: Client,
  msg: NormalisedIncoming,
): Promise<string | null> {
  const phone = buildPhoneE164(msg.contactRef, msg.channel);

  try {
    if (phone) {
      const search = await hubspot.crm.contacts.searchApi.doSearch({
        filterGroups: [
          {
            filters: [{ propertyName: "phone", operator: FilterOperatorEnum.Eq, value: phone }],
          },
        ],
        properties: ["email", "firstname", "lastname", "phone"],
        limit: 1,
        sorts: [],
        after: "0",
      });
      if (search.results?.[0]?.id) return search.results[0].id;
    }

    // Fallback : recherche par "instagram_handle" custom property (créée à l'étape 11)
    if (msg.channel === "instagram") {
      try {
        const search = await hubspot.crm.contacts.searchApi.doSearch({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "instagram_handle",
                  operator: FilterOperatorEnum.Eq,
                  value: msg.contactRef,
                },
              ],
            },
          ],
          properties: ["email", "firstname", "lastname"],
          limit: 1,
          sorts: [],
          after: "0",
        });
        if (search.results?.[0]?.id) return search.results[0].id;
      } catch {
        // propriété custom pas encore créée → ignore
      }
    }
  } catch (err) {
    console.error("[whatsapp/hubspot-sync] findContact a échoué :", err);
  }
  return null;
}

async function createContact(
  hubspot: Client,
  msg: NormalisedIncoming,
): Promise<string | null> {
  const phone = buildPhoneE164(msg.contactRef, msg.channel);
  const nameParts = (msg.contactName || "").trim().split(/\s+/);
  const firstname = nameParts[0] || "";
  const lastname = nameParts.slice(1).join(" ") || "";

  try {
    const res = await hubspot.crm.contacts.basicApi.create({
      properties: {
        firstname,
        lastname: lastname || (msg.channel === "whatsapp" ? "WhatsApp" : "Instagram"),
        phone: phone || "",
        hs_lead_status: "NEW",
        lifecyclestage: "lead",
        // canal_origine sera mappé sur la custom property à l'étape 11
      },
      associations: [],
    });
    return res.id;
  } catch (e: unknown) {
    // 409 → contact existe déjà avec ces données (rare ici car on cherche avant)
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code?: number }).code === 409
    ) {
      return null;
    }
    console.error("[whatsapp/hubspot-sync] createContact a échoué :", e);
    return null;
  }
}

async function appendNote(
  hubspot: Client,
  contactId: string,
  msg: NormalisedIncoming,
): Promise<string | null> {
  const channelLabel = msg.channel === "whatsapp" ? "WhatsApp" : "Instagram";
  const header = `📨 Nouveau message ${channelLabel} — ${msg.timestamp.toLocaleString("fr-FR")}`;
  const senderLine = msg.contactName
    ? `De : ${msg.contactName} (${msg.contactRef})`
    : `De : ${msg.contactRef}`;
  const mediaLine = msg.mediaType && msg.mediaType !== "text"
    ? `📎 Pièce jointe : ${msg.mediaType}`
    : null;
  const body = [header, senderLine, mediaLine, "", msg.text || "(message vide)"]
    .filter(Boolean)
    .join("\n");

  return createNote(hubspot, contactId, body, msg.timestamp);
}

async function createNote(
  hubspot: Client,
  contactId: string,
  body: string,
  timestamp: Date,
): Promise<string | null> {
  try {
    const note = await hubspot.crm.objects.notes.basicApi.create({
      properties: {
        hs_note_body: body,
        hs_timestamp: timestamp.toISOString(),
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: AssociationSpecAssociationCategoryEnum.HubspotDefined,
              associationTypeId: ASSOC_CONTACT_TO_NOTE,
            },
          ],
        },
      ],
    });
    return note.id;
  } catch (err) {
    console.error("[whatsapp/hubspot-sync] createNote a échoué :", err);
    return null;
  }
}

/**
 * Loggue une réponse sortante (de l'agent IA ou de l'assistante) sur la timeline
 * du contact HubSpot. Préfixé `🤖 Réponse assistante` pour permettre la
 * reconstruction de l'historique côté `hubspot-history.ts`.
 */
export async function appendOutgoingNote(args: {
  contactId: string;
  text: string;
  kind: "ai" | "handover" | "optout" | "pause";
  channel: NormalisedIncoming["channel"];
  modelUsed?: string | null;
}): Promise<string | null> {
  const hubspot = getClient();
  if (!hubspot) return null;

  const channelLabel = args.channel === "whatsapp" ? "WhatsApp" : "Instagram";
  const kindLabel = {
    ai: `IA (${args.modelUsed ?? "Haiku"})`,
    handover: "Handover Aïssa",
    optout: "Confirmation opt-out RGPD",
    pause: "Pause active",
  }[args.kind];

  const header = `🤖 Réponse assistante (${kindLabel}) — ${channelLabel} — ${new Date().toLocaleString("fr-FR")}`;
  const body = [header, "", args.text].join("\n");
  return createNote(hubspot, args.contactId, body, new Date());
}

/**
 * Cherche un contact par numéro WhatsApp (`wa_id` brut, sans le `+`).
 * Retourne l'ID HubSpot ou null. Utilisé par le handler echoes pour relier
 * une réponse manuelle d'Aïssa à un contact existant.
 */
export async function findContactByWhatsAppPhone(
  waId: string,
): Promise<string | null> {
  const hubspot = getClient();
  if (!hubspot) return null;
  const phone = /^\d{6,15}$/.test(waId) ? `+${waId}` : waId;
  try {
    const search = await hubspot.crm.contacts.searchApi.doSearch({
      filterGroups: [
        {
          filters: [{ propertyName: "phone", operator: FilterOperatorEnum.Eq, value: phone }],
        },
      ],
      properties: ["phone"],
      limit: 1,
      sorts: [],
      after: "0",
    });
    return search.results?.[0]?.id ?? null;
  } catch (err) {
    console.warn("[whatsapp/hubspot-sync] findContactByWhatsAppPhone :", err);
    return null;
  }
}

/**
 * Définit le flag `human_takeover` sur le contact (utilisé quand Aïssa prend la main).
 * Patch silencieux : si la propriété custom n'est pas encore créée (script setup
 * pas exécuté), on log et on continue.
 */
export async function setHumanTakeover(
  contactId: string,
  value: boolean,
): Promise<boolean> {
  return updateContactProperties(contactId, {
    human_takeover: value ? "true" : "false",
  });
}

/**
 * Lit le flag `human_takeover` du contact. Retourne false si HubSpot down,
 * propriété absente, ou contact pas trouvé — par défaut l'agent répond.
 */
export async function isHumanTakeoverActive(
  contactId: string,
): Promise<boolean> {
  const hubspot = getClient();
  if (!hubspot) return false;
  try {
    const res = await hubspot.crm.contacts.basicApi.getById(
      contactId,
      ["human_takeover"],
    );
    const val = res.properties?.human_takeover;
    return val === "true" || val === "True" || val === "1";
  } catch (err) {
    console.warn(
      "[whatsapp/hubspot-sync] isHumanTakeoverActive a échoué :",
      err,
    );
    return false;
  }
}

/**
 * Patch générique des propriétés d'un contact. Best-effort.
 */
export async function updateContactProperties(
  contactId: string,
  properties: Record<string, string>,
): Promise<boolean> {
  const hubspot = getClient();
  if (!hubspot) return false;
  try {
    await hubspot.crm.contacts.basicApi.update(contactId, { properties });
    return true;
  } catch (err) {
    console.warn(
      "[whatsapp/hubspot-sync] updateContactProperties a échoué :",
      err,
    );
    return false;
  }
}

export async function syncIncomingToHubspot(
  msg: NormalisedIncoming,
): Promise<SyncResult> {
  const hubspot = getClient();
  if (!hubspot) {
    return { ok: false, error: "HUBSPOT_PRIVATE_APP_TOKEN non configuré." };
  }

  let contactId = await findContact(hubspot, msg);
  let created = false;
  if (!contactId) {
    contactId = await createContact(hubspot, msg);
    created = Boolean(contactId);
  }
  if (!contactId) {
    return { ok: false, error: "Impossible de créer ou retrouver le contact HubSpot." };
  }

  const noteId = (await appendNote(hubspot, contactId, msg)) ?? undefined;

  return {
    ok: true,
    contactId,
    created,
    noteId,
  };
}
