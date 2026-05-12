/**
 * Types Meta WhatsApp Cloud API — webhook events.
 * Référence : https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples
 */

export interface WhatsAppWebhookPayload {
  object: "whatsapp_business_account" | "instagram" | string;
  entry: WhatsAppEntry[];
}

export interface WhatsAppEntry {
  id: string;
  changes?: WhatsAppChange[];
  messaging?: InstagramMessaging[];
}

export interface WhatsAppChange {
  field: "messages" | "message_echoes" | "message_template_status_update" | string;
  value: WhatsAppMessagesValue;
}

export interface WhatsAppMessagesValue {
  messaging_product: "whatsapp" | string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts?: WhatsAppContactInfo[];
  messages?: WhatsAppMessage[];
  /** Echoes des messages sortants — déclenché par le champ "message_echoes". */
  message_echoes?: WhatsAppEchoMessage[];
  statuses?: WhatsAppStatus[];
  errors?: WhatsAppError[];
}

export interface WhatsAppEchoMessage {
  id: string;
  /** Numéro du WABA (notre numéro pro). */
  from: string;
  /** Numéro destinataire du message (le client). */
  to: string;
  timestamp: string;
  type: "text" | "image" | "audio" | "video" | "document" | "interactive" | "template" | string;
  text?: { body: string };
  image?: { id: string; mime_type?: string; sha256?: string; caption?: string };
  audio?: { id: string; mime_type?: string };
  video?: { id: string; mime_type?: string; caption?: string };
  document?: { id: string; mime_type?: string; filename?: string; caption?: string };
}

export interface WhatsAppContactInfo {
  wa_id: string;
  profile?: { name?: string };
}

export interface WhatsAppMessage {
  id: string;
  from: string;
  timestamp: string;
  type: "text" | "image" | "audio" | "video" | "document" | "interactive" | string;
  text?: { body: string };
  image?: { id: string; mime_type?: string; sha256?: string; caption?: string };
  audio?: { id: string; mime_type?: string };
  video?: { id: string; mime_type?: string; caption?: string };
  document?: { id: string; mime_type?: string; filename?: string; caption?: string };
  context?: { from?: string; id?: string };
}

export interface WhatsAppStatus {
  id: string;
  status: "sent" | "delivered" | "read" | "failed" | string;
  timestamp: string;
  recipient_id: string;
  conversation?: { id: string; origin: { type: string } };
  pricing?: { billable: boolean; category: string; pricing_model: string };
  errors?: WhatsAppError[];
}

export interface WhatsAppError {
  code: number;
  title: string;
  message?: string;
  error_data?: { details?: string };
}

// ─── Instagram DM (Messenger Platform) — payload distinct ────────
export interface InstagramMessaging {
  sender: { id: string };
  recipient: { id: string };
  timestamp: number;
  message?: {
    mid: string;
    text?: string;
    attachments?: { type: string; payload: { url?: string } }[];
  };
}

// ─── Normalisation interne ──────────────────────────────────────
export type Channel = "whatsapp" | "instagram";

export interface NormalisedIncoming {
  channel: Channel;
  messageId: string;
  /** Identifiant externe du contact (numéro WA ou IG handle). */
  contactRef: string;
  contactName: string | null;
  timestamp: Date;
  text: string;
  /** ID du numéro/page Meta destinataire — sert à dispatch si plusieurs comptes. */
  recipientId: string;
  /** Type de média si non-texte (image/audio/video/document/interactive). */
  mediaType?: string;
  /** ID du média Meta pour download (audio/vidéo/image/document). Permet la transcription d'un vocal. */
  mediaId?: string;
}

export interface NormalisedEcho {
  /** wamid de la copie sortante. */
  messageId: string;
  /** Numéro du destinataire (le client) — sert à retrouver le contact HubSpot. */
  toPhone: string;
  /** Numéro du WABA (notre numéro pro), pour logging. */
  fromPhone: string;
  timestamp: Date;
  /** Texte du message envoyé (ou marqueur pour les médias). */
  text: string;
  mediaType: string;
}

export interface NormalisedOutboundStatus {
  /** wamid du message sortant dont on signale le status. */
  messageId: string;
  /** Numéro du destinataire (le client). */
  toPhone: string;
  /** "sent" | "delivered" | "read" | "failed". */
  status: string;
  timestamp: Date;
}
