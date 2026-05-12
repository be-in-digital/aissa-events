import "server-only";

import { Client } from "@hubspot/api-client";

import type { Channel } from "./types";

/**
 * Lecture de l'historique conversationnel depuis HubSpot.
 *
 * Stratégie MVP : on récupère les notes associées au contact, on filtre celles
 * qui correspondent à nos formats internes (préfixées par les markers), puis
 * on extrait les paires user/assistant pour les injecter dans le prompt agent.
 *
 * Étape 12+ : passage à une stratégie de résumé compressé quand le transcript
 * dépasse 50 messages (résumé Haiku des plus anciens).
 */

const MAX_HISTORY_ENTRIES = 30;
const INCOMING_PREFIX = "📨 Nouveau message";
const OUTGOING_PREFIX = "🤖 Réponse assistante";
const HANDOVER_PREFIX = "👤 Aïssa";

export type HistoryRole = "user" | "assistant";

export interface HistoryEntry {
  role: HistoryRole;
  text: string;
  channel?: Channel;
  timestamp: Date;
}

function getClient(): Client | null {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return null;
  return new Client({ accessToken: token });
}

interface NoteResult {
  id: string;
  properties: { hs_note_body?: string | null; hs_timestamp?: string | null };
}

function parseEntry(note: NoteResult): HistoryEntry | null {
  const body = note.properties?.hs_note_body?.trim();
  const ts = note.properties?.hs_timestamp;
  if (!body || !ts) return null;

  const timestamp = new Date(ts);
  if (isNaN(timestamp.getTime())) return null;

  const stripHeader = (text: string): string => {
    const lines = text.split("\n");
    // Drop the first "header" line (📨 Nouveau message WhatsApp...) + sender line
    // until first blank line, then return the rest.
    let i = 0;
    while (i < lines.length && lines[i].trim() !== "") i++;
    return lines.slice(i + 1).join("\n").trim();
  };

  if (body.startsWith(INCOMING_PREFIX)) {
    const channel: Channel = body.toLowerCase().includes("instagram")
      ? "instagram"
      : "whatsapp";
    return { role: "user", text: stripHeader(body), channel, timestamp };
  }
  if (body.startsWith(OUTGOING_PREFIX)) {
    return { role: "assistant", text: stripHeader(body), timestamp };
  }
  if (body.startsWith(HANDOVER_PREFIX)) {
    // Aïssa's manual replies — treat as assistant turn to keep context.
    return { role: "assistant", text: stripHeader(body), timestamp };
  }
  return null;
}

/**
 * Récupère les N derniers messages échangés avec un contact, triés
 * chronologiquement (plus ancien d'abord).
 */
export async function getConversationHistory(
  contactId: string,
  limit = MAX_HISTORY_ENTRIES,
): Promise<HistoryEntry[]> {
  const hubspot = getClient();
  if (!hubspot) return [];

  try {
    // 1. List notes associées à ce contact (HubSpot v4 associations)
    const associations = await hubspot.crm.associations.v4.basicApi.getPage(
      "contacts",
      contactId,
      "notes",
      undefined,
      Math.min(limit * 2, 100),
    );
    const noteIds = (associations.results ?? [])
      .map((a) => a.toObjectId)
      .slice(0, limit * 2);
    if (noteIds.length === 0) return [];

    // 2. Batch read notes — les plus récentes (ordre HubSpot non garanti, on tri ensuite)
    const batch = await hubspot.crm.objects.notes.batchApi.read({
      inputs: noteIds.map((id) => ({ id: String(id) })),
      properties: ["hs_note_body", "hs_timestamp"],
      propertiesWithHistory: [],
    });

    const entries = (batch.results ?? [])
      .map((n) => parseEntry({ id: n.id, properties: n.properties }))
      .filter((e): e is HistoryEntry => e !== null)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Garde les `limit` plus récentes (mais retournées chronologiquement)
    return entries.slice(-limit);
  } catch (err) {
    console.error("[hubspot-history] getConversationHistory a échoué :", err);
    return [];
  }
}
