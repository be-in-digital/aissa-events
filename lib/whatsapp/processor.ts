import "server-only";

import { loadAgentSettings, isAgentPaused, interpolateMessage } from "./agent-settings";
import {
  composeHandoverReply,
  composeOptoutConfirmationReply,
  composePauseReply,
  detectHandoverTrigger,
  detectOptoutIntent,
  runAgentReply,
} from "./agent";
import {
  appendIncoming,
  appendOutgoing,
  getConversationHistory,
} from "./conversation-store";
import {
  appendOutgoingNote,
  findContactByWhatsAppPhone,
  isHumanTakeoverActive,
  setHumanTakeover,
  syncIncomingToHubspot,
  updateContactProperties,
} from "./hubspot-sync";
import { sendText } from "./meta-send";
import { notifyAissaOfMessage } from "./notifications";
import { logError, logEvent } from "./observability";
import { isTrackedOutbound } from "./outbound-tracker";
import { transcribeWhatsAppAudio } from "./transcribe";
import type {
  NormalisedEcho,
  NormalisedIncoming,
  NormalisedOutboundStatus,
  WhatsAppEchoMessage,
  WhatsAppMessage,
  WhatsAppMessagesValue,
  WhatsAppWebhookPayload,
  InstagramMessaging,
} from "./types";

/**
 * Pipeline de traitement d'un message entrant — Phase 2 étape 10 (agent IA).
 *
 * Flux :
 *  1. Charge la config agent depuis Sanity (avec cache 30s)
 *  2. Sync HubSpot (find or create contact + append note avec contenu message)
 *  3. Décide quoi répondre :
 *     - opt-out → demande de confirmation
 *     - trigger handover → message de transmission + flag dans la note
 *     - pause active → messagePauseActivee (si non vide)
 *     - sinon → appel IA Haiku 4.5
 *  4. Envoie la réponse via Meta Cloud API (WhatsApp seulement à ce stade)
 *  5. Notifie Aïssa par email (mode centralisation totale, à filtrer plus tard)
 *
 * Étapes futures :
 *  - 11 : mémoire conversationnelle (lecture transcript HubSpot)
 *  - 11 : custom properties HubSpot (type_evenement, etc.)
 *  - 12 : Instagram DM send (différent endpoint Meta)
 */

interface ProcessOutcome {
  hubspotContactId: string | null;
  hubspotNoteId: string | null;
  replyKind: "ai" | "handover" | "optout" | "pause" | "silent" | "error";
  replyText: string | null;
  sentMessageId: string | null;
  modelUsed: string | null;
}

export async function processIncomingMessage(
  msg: NormalisedIncoming,
): Promise<ProcessOutcome> {
  const settings = await loadAgentSettings();

  // 0. Vocal entrant → transcrire via Whisper avant tout traitement IA.
  // En cas d'échec, on garde le placeholder "[message vocal envoyé]" et on
  // déclenche un handover plutôt que de faire deviner l'agent à l'aveugle.
  if (msg.channel === "whatsapp" && msg.mediaType === "audio" && msg.mediaId) {
    try {
      const transcript = await transcribeWhatsAppAudio(msg.mediaId);
      if (transcript) {
        msg = { ...msg, text: transcript };
        logEvent("audio_transcribed", {
          scope: "whatsapp/processor",
          channel: msg.channel,
          contactRef: msg.contactRef,
          extra: { transcript_length: transcript.length },
        });
      }
    } catch (err) {
      logError("Transcription vocal échouée", err, {
        scope: "whatsapp/processor",
        channel: msg.channel,
        contactRef: msg.contactRef,
      });
    }
  }

  // 1. Sync HubSpot (find or create + append incoming note) — on attend pour pouvoir lire l'historique ensuite
  const hubspotResult = await syncIncomingToHubspot(msg).catch((err) => {
    logError("syncIncomingToHubspot a échoué", err, {
      scope: "whatsapp/processor",
      channel: msg.channel,
      contactRef: msg.contactRef,
    });
    return { ok: false, error: String(err) } as Awaited<ReturnType<typeof syncIncomingToHubspot>>;
  });

  // Update last_message_at + canal_origine + consentement (best-effort)
  if (hubspotResult.contactId) {
    const props: Record<string, string> = {
      dernier_message_at: msg.timestamp.toISOString(),
      canal_origine: msg.channel,
    };
    if (hubspotResult.created) {
      props.consentement_rgpd_at = msg.timestamp.toISOString();
    }
    void updateContactProperties(hubspotResult.contactId, props).catch(() => undefined);
  }

  // 2. Fetch historique conversationnel depuis Upstash (clé = numéro/PSID).
  // Note : on n'a pas le scope `crm.objects.notes.*` en HubSpot Free, donc
  // Upstash sert de mémoire court-terme à la place. HubSpot reste le CRM.
  const history = await getConversationHistory(msg.contactRef).catch(() => []);

  // Enregistre le message entrant dans l'historique AVANT l'appel agent IA
  // (le LLM utilisera l'historique au tour suivant, pas au tour courant).
  void appendIncoming({
    contactRef: msg.contactRef,
    text: msg.text,
    channel: msg.channel,
    timestamp: msg.timestamp,
  }).catch(() => undefined);

  // 3. Décide quoi répondre
  let replyText: string | null = null;
  let replyKind: ProcessOutcome["replyKind"] = "silent";
  let modelUsed: string | null = null;
  let triggerHandover = false;
  let triggerMatched: string | null = null;

  // Si Aïssa a déjà pris la main sur ce contact, l'agent se tait totalement.
  // Aïssa décharge le flag manuellement dans HubSpot pour réactiver l'agent.
  const handoverActive = hubspotResult.contactId
    ? await isHumanTakeoverActive(hubspotResult.contactId).catch(() => false)
    : false;

  if (handoverActive) {
    logEvent("agent_silenced_human_takeover", {
      scope: "whatsapp/processor",
      channel: msg.channel,
      contactRef: msg.contactRef,
    });
    // On notifie Aïssa du nouveau message (pour qu'elle réponde) mais on ne
    // génère AUCUNE réponse automatique. Sortie immédiate après la notif.
    try {
      await notifyAissaOfMessage({
        msg,
        hubspotContactId: hubspotResult.contactId ?? null,
        hubspotNoteId: hubspotResult.noteId ?? null,
      });
    } catch (err) {
      console.error("[whatsapp/processor] notifyAissaOfMessage a échoué :", err);
    }
    return {
      hubspotContactId: hubspotResult.contactId ?? null,
      hubspotNoteId: hubspotResult.noteId ?? null,
      replyKind: "silent",
      replyText: null,
      sentMessageId: null,
      modelUsed: null,
    };
  }

  if (detectOptoutIntent(msg.text)) {
    replyText = composeOptoutConfirmationReply(settings);
    replyKind = "optout";
  } else if (isAgentPaused(settings)) {
    const pauseMsg = composePauseReply(settings);
    if (pauseMsg) {
      replyText = pauseMsg;
      replyKind = "pause";
    }
  } else {
    const trigger = detectHandoverTrigger(msg.text, settings.triggersHandover);
    if (trigger) {
      replyText = composeHandoverReply(settings);
      replyKind = "handover";
      triggerHandover = true;
      triggerMatched = trigger;
    } else {
      // Appel agent IA (avec historique conversationnel)
      const aiReply = await runAgentReply({
        settings,
        userMessage: msg.text,
        contactName: msg.contactName,
        channel: msg.channel,
        history,
      });
      if (aiReply) {
        replyText = aiReply.text;
        replyKind = "ai";
        modelUsed = aiReply.modelUsed;
      } else {
        // Fallback si IA down → message neutre + handover
        replyText = interpolateMessage(settings.messageFinDeConversation, {
          personaName: settings.personaName,
        });
        replyKind = "error";
        triggerHandover = true;
      }
    }
  }

  // 4. Envoi de la réponse via Meta (WhatsApp ou Instagram selon le canal)
  let sentMessageId: string | null = null;
  if (replyText) {
    const sendResult = await sendText({
      channel: msg.channel,
      contactRef: msg.contactRef,
      text: replyText,
    });
    if (sendResult.ok) {
      sentMessageId = sendResult.messageId ?? null;
      // Stocke la réponse dans Upstash pour que le tour suivant ait le contexte.
      void appendOutgoing({
        contactRef: msg.contactRef,
        text: replyText,
        channel: msg.channel,
      }).catch(() => undefined);
    } else {
      logError("Échec envoi Meta", new Error(sendResult.error ?? "unknown"), {
        scope: "whatsapp/processor",
        channel: msg.channel,
        contactRef: msg.contactRef,
        replyKind,
      });
    }
  }

  // 5. Log de la réponse outgoing dans HubSpot (timeline du contact)
  if (replyText && hubspotResult.contactId && replyKind !== "silent") {
    void appendOutgoingNote({
      contactId: hubspotResult.contactId,
      text: replyText,
      kind: replyKind === "error" ? "handover" : (replyKind as "ai" | "handover" | "optout" | "pause"),
      channel: msg.channel,
      modelUsed,
    }).catch((err) =>
      console.error("[whatsapp/processor] appendOutgoingNote a échoué :", err),
    );
  }

  // 6. Si handover déclenché → flag human_takeover sur le contact
  if (triggerHandover && hubspotResult.contactId) {
    void setHumanTakeover(hubspotResult.contactId, true).catch(() => undefined);
  }

  // 7. Notif Aïssa — préfixe [🚨 HANDOVER] si un trigger commercial/humain
  // a été détecté pour qu'elle voie tout de suite l'urgence dans sa boîte mail.
  try {
    await notifyAissaOfMessage({
      msg,
      hubspotContactId: hubspotResult?.contactId ?? null,
      hubspotNoteId: hubspotResult?.noteId ?? null,
      handover: triggerHandover,
      triggerMatched,
    });
  } catch (err) {
    console.error("[whatsapp/processor] notifyAissaOfMessage a échoué :", err);
  }

  // Log événement métier (compatible Sentry breadcrumbs)
  logEvent("message_processed", {
    scope: "whatsapp/processor",
    channel: msg.channel,
    contactRef: msg.contactRef,
    replyKind,
    extra: {
      hubspot_contact_id: hubspotResult?.contactId,
      hubspot_created: hubspotResult?.created,
      history_length: history.length,
      meta_message_id: sentMessageId,
      handover_triggered: triggerHandover,
      model_used: modelUsed,
    },
  });

  return {
    hubspotContactId: hubspotResult?.contactId ?? null,
    hubspotNoteId: hubspotResult?.noteId ?? null,
    replyKind,
    replyText,
    sentMessageId,
    modelUsed,
  };
}

// ──────────────────────────────────────────────────────────────────────
// Normalisation des payloads Meta vers le format interne
// ──────────────────────────────────────────────────────────────────────

function extractText(message: WhatsAppMessage): { text: string; mediaType: string } {
  switch (message.type) {
    case "text":
      return { text: message.text?.body ?? "", mediaType: "text" };
    case "image":
      return {
        text: message.image?.caption || "[image envoyée]",
        mediaType: "image",
      };
    case "audio":
      return { text: "[message vocal envoyé]", mediaType: "audio" };
    case "video":
      return {
        text: message.video?.caption || "[vidéo envoyée]",
        mediaType: "video",
      };
    case "document":
      return {
        text:
          message.document?.caption ||
          `[document envoyé : ${message.document?.filename || "fichier"}]`,
        mediaType: "document",
      };
    default:
      return { text: `[${message.type}]`, mediaType: message.type };
  }
}

function extractMediaId(message: WhatsAppMessage): string | undefined {
  switch (message.type) {
    case "audio":
      return message.audio?.id;
    case "image":
      return message.image?.id;
    case "video":
      return message.video?.id;
    case "document":
      return message.document?.id;
    default:
      return undefined;
  }
}

function normaliseWhatsApp(
  value: WhatsAppMessagesValue,
  message: WhatsAppMessage,
): NormalisedIncoming {
  const contactInfo = value.contacts?.find((c) => c.wa_id === message.from);
  const { text, mediaType } = extractText(message);
  return {
    channel: "whatsapp",
    messageId: message.id,
    contactRef: message.from,
    contactName: contactInfo?.profile?.name ?? null,
    timestamp: new Date(Number(message.timestamp) * 1000),
    text,
    recipientId: value.metadata.phone_number_id,
    mediaType,
    mediaId: extractMediaId(message),
  };
}

function normaliseInstagram(
  pageId: string,
  m: InstagramMessaging,
): NormalisedIncoming | null {
  if (!m.message?.mid) return null;
  const text =
    m.message.text ||
    (m.message.attachments?.[0]?.type ? `[${m.message.attachments[0].type}]` : "");
  return {
    channel: "instagram",
    messageId: m.message.mid,
    contactRef: m.sender.id,
    contactName: null,
    timestamp: new Date(m.timestamp),
    text,
    recipientId: pageId,
    mediaType: m.message.text ? "text" : m.message.attachments?.[0]?.type || "unknown",
  };
}

/**
 * Convertit un payload Meta en messages normalisés.
 * Filtre les statuses (delivered/read) — on ne traite que les nouveaux messages.
 */
export function extractIncomingMessages(
  payload: WhatsAppWebhookPayload,
): NormalisedIncoming[] {
  const out: NormalisedIncoming[] = [];

  for (const entry of payload.entry ?? []) {
    // WhatsApp Business Account
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;
      const value = change.value;
      if (!value?.messages) continue;
      for (const message of value.messages) {
        out.push(normaliseWhatsApp(value, message));
      }
    }

    // Instagram (Messenger Platform)
    if (entry.messaging && payload.object === "instagram") {
      for (const m of entry.messaging) {
        const normalised = normaliseInstagram(entry.id, m);
        if (normalised) out.push(normalised);
      }
    }
  }

  return out;
}

// ──────────────────────────────────────────────────────────────────────
// Echoes — copies des messages sortants (API ou Meta Business Suite)
// ──────────────────────────────────────────────────────────────────────

function echoText(echo: WhatsAppEchoMessage): { text: string; mediaType: string } {
  switch (echo.type) {
    case "text":
      return { text: echo.text?.body ?? "", mediaType: "text" };
    case "image":
      return { text: echo.image?.caption || "[image envoyée]", mediaType: "image" };
    case "audio":
      return { text: "[message vocal envoyé]", mediaType: "audio" };
    case "video":
      return { text: echo.video?.caption || "[vidéo envoyée]", mediaType: "video" };
    case "document":
      return {
        text:
          echo.document?.caption ||
          `[document : ${echo.document?.filename || "fichier"}]`,
        mediaType: "document",
      };
    default:
      return { text: `[${echo.type}]`, mediaType: echo.type };
  }
}

export function extractOutboundEchoes(
  payload: WhatsAppWebhookPayload,
): NormalisedEcho[] {
  const out: NormalisedEcho[] = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "message_echoes") continue;
      const echoes = change.value?.message_echoes ?? [];
      for (const echo of echoes) {
        const { text, mediaType } = echoText(echo);
        out.push({
          messageId: echo.id,
          toPhone: echo.to,
          fromPhone: echo.from,
          timestamp: new Date(Number(echo.timestamp) * 1000),
          text,
          mediaType,
        });
      }
    }
  }
  return out;
}

/**
 * Traite un echo : si le wamid n'est pas dans notre liste d'envois API, c'est
 * qu'Aïssa a répondu manuellement depuis son téléphone — on flague
 * `human_takeover=true` pour que l'agent se taise sur ce contact.
 */
export async function processOutboundEcho(echo: NormalisedEcho): Promise<void> {
  await flagTakeoverIfUntracked({
    wamid: echo.messageId,
    toPhone: echo.toPhone,
    source: "echo",
    preview: echo.text.slice(0, 80),
  });
}

// ──────────────────────────────────────────────────────────────────────
// Status updates — fallback detection quand message_echoes n'est pas
// disponible. Meta envoie un `sent` status pour chaque message sortant,
// y compris ceux envoyés depuis Meta Business Suite par Aïssa.
// ──────────────────────────────────────────────────────────────────────

export function extractOutboundStatuses(
  payload: WhatsAppWebhookPayload,
): NormalisedOutboundStatus[] {
  const out: NormalisedOutboundStatus[] = [];
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;
      const statuses = change.value?.statuses ?? [];
      for (const s of statuses) {
        out.push({
          messageId: s.id,
          toPhone: s.recipient_id,
          status: s.status,
          timestamp: new Date(Number(s.timestamp) * 1000),
        });
      }
    }
  }
  return out;
}

/**
 * Vérifie un status sortant : si c'est un `sent` pour un wamid qu'on ne
 * connaît pas, c'est qu'Aïssa a envoyé le message hors API — on flague
 * human_takeover. Idempotent : ne fait rien si déjà flagué.
 */
export async function processOutboundStatus(
  status: NormalisedOutboundStatus,
): Promise<void> {
  // On ne réagit qu'au `sent` — le premier event qui confirme un envoi.
  // `delivered`/`read` arrivent ensuite, redondants pour notre détection.
  if (status.status !== "sent") return;
  await flagTakeoverIfUntracked({
    wamid: status.messageId,
    toPhone: status.toPhone,
    source: "status",
    preview: null,
  });
}

async function flagTakeoverIfUntracked(args: {
  wamid: string;
  toPhone: string;
  source: "echo" | "status";
  preview: string | null;
}): Promise<void> {
  const fromUs = await isTrackedOutbound(args.wamid).catch(() => false);
  if (fromUs) return;

  const contactId = await findContactByWhatsAppPhone(args.toPhone);
  if (!contactId) {
    logEvent("untracked_outbound_no_contact", {
      scope: "whatsapp/processor",
      channel: "whatsapp",
      contactRef: args.toPhone,
      extra: { wamid: args.wamid, source: args.source },
    });
    return;
  }

  const already = await isHumanTakeoverActive(contactId).catch(() => false);
  if (already) return;

  await setHumanTakeover(contactId, true).catch(() => undefined);
  logEvent("human_takeover_auto_set", {
    scope: "whatsapp/processor",
    channel: "whatsapp",
    contactRef: args.toPhone,
    extra: {
      wamid: args.wamid,
      hubspot_contact_id: contactId,
      source: args.source,
      preview: args.preview ?? undefined,
    },
  });
}
