import "server-only";

import { trackOutboundMessage } from "./outbound-tracker";
import { getActiveAccessToken } from "./token-store";

/**
 * Envoi de messages via Meta Cloud API (WhatsApp Business + Instagram Messaging).
 * Utilise le token Meta Embedded Signup stocké dans Upstash (chiffré).
 *
 * Références :
 *  - WhatsApp : https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
 *  - Instagram : https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message
 */

function graphVersion(): string {
  return process.env.NEXT_PUBLIC_META_GRAPH_API_VERSION || "v21.0";
}

export interface SendResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

interface MetaSendErrorBody {
  error?: {
    message?: string;
    code?: number;
    error_subcode?: number;
  };
}

interface WhatsAppSendSuccess {
  messaging_product: "whatsapp";
  contacts?: { input: string; wa_id: string }[];
  messages?: { id: string }[];
}

interface InstagramSendSuccess {
  recipient_id: string;
  message_id: string;
}

/**
 * WhatsApp utilise *gras*, _italique_, ~barré~ — pas la syntaxe Markdown.
 * Filet de sécurité au cas où le LLM glisse vers du Markdown malgré le prompt :
 * convertit `**bold**` et `__bold__` en `*bold*`. Non destructif sur les
 * astérisques/underscores simples déjà bien formés.
 */
function sanitizeWhatsAppFormatting(text: string): string {
  let out = text;
  out = out.replace(/\*\*(.+?)\*\*/g, "*$1*");
  out = out.replace(/__(.+?)__/g, "*$1*");
  return out;
}

export async function sendWhatsAppText(args: {
  toPhoneNumber: string;
  text: string;
}): Promise<SendResult> {
  const active = await getActiveAccessToken();
  if (!active) {
    return { ok: false, error: "Aucun compte WhatsApp connecté." };
  }

  const url = `https://graph.facebook.com/${graphVersion()}/${active.phoneNumberId}/messages`;

  const sanitizedText = sanitizeWhatsAppFormatting(args.text).slice(0, 4096); // WA limite : 4096 chars
  const body = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: args.toPhoneNumber,
    type: "text",
    text: { preview_url: false, body: sanitizedText },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${active.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as WhatsAppSendSuccess & MetaSendErrorBody;
    if (!res.ok || json.error) {
      return {
        ok: false,
        error: json.error?.message || `Meta HTTP ${res.status}`,
      };
    }
    const wamid = json.messages?.[0]?.id;
    if (wamid) {
      await trackOutboundMessage(wamid).catch(() => undefined);
    }
    return { ok: true, messageId: wamid };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erreur réseau inconnue.",
    };
  }
}

/**
 * Envoie un message Instagram DM via Messenger Platform.
 *
 * Pré-requis :
 *  - Token Meta avec scopes `instagram_business_basic` + `instagram_business_manage_messages`
 *  - Le compte Instagram doit être lié à une page Facebook professionnelle
 *  - `META_INSTAGRAM_BUSINESS_ACCOUNT_ID` configuré dans env
 *
 * Fenêtre de réponse : Instagram exige une réponse dans les 24h après le
 * dernier message du user, sinon il faut un message tag (HUMAN_AGENT, etc.).
 * Cette implémentation suppose qu'on est dans la fenêtre 24h.
 */
export async function sendInstagramText(args: {
  recipientPsid: string;
  text: string;
}): Promise<SendResult> {
  const active = await getActiveAccessToken();
  if (!active) {
    return { ok: false, error: "Aucun compte Meta connecté." };
  }

  const igBusinessId = process.env.META_INSTAGRAM_BUSINESS_ACCOUNT_ID;
  if (!igBusinessId) {
    return {
      ok: false,
      error: "META_INSTAGRAM_BUSINESS_ACCOUNT_ID non configuré.",
    };
  }

  const url = `https://graph.facebook.com/${graphVersion()}/${igBusinessId}/messages`;

  const body = {
    recipient: { id: args.recipientPsid },
    message: { text: args.text.slice(0, 1000) }, // Instagram limite typique
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${active.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as InstagramSendSuccess & MetaSendErrorBody;
    if (!res.ok || json.error) {
      return {
        ok: false,
        error: json.error?.message || `Meta HTTP ${res.status}`,
      };
    }
    return { ok: true, messageId: json.message_id };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erreur réseau inconnue.",
    };
  }
}

/**
 * Dispatcher unifié : envoie un message texte via le bon endpoint Meta selon le canal.
 */
export async function sendText(args: {
  channel: "whatsapp" | "instagram";
  contactRef: string;
  text: string;
}): Promise<SendResult> {
  if (args.channel === "whatsapp") {
    return sendWhatsAppText({ toPhoneNumber: args.contactRef, text: args.text });
  }
  return sendInstagramText({ recipientPsid: args.contactRef, text: args.text });
}
