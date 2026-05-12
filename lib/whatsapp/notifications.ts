import "server-only";

import { Resend } from "resend";

import { summarizeForHandover } from "./agent";
import { getConversationHistory } from "./conversation-store";
import { sendWhatsAppText } from "./meta-send";
import type { NormalisedIncoming } from "./types";

/**
 * Notifie Aïssa par email d'un nouveau message WhatsApp / Instagram entrant.
 *
 * Stratégie MVP : 1 email par message entrant, avec lien direct vers le contact
 * HubSpot pour qu'Aïssa puisse répondre depuis son téléphone.
 *
 * Étape 12 ajoutera : groupement digest, niveaux d'urgence, suppression si
 * Aïssa a déjà répondu.
 */

interface NotifyArgs {
  msg: NormalisedIncoming;
  hubspotContactId: string | null;
  hubspotNoteId: string | null;
  /** Si true, marque l'email comme handover urgent (icône + subject). */
  handover?: boolean;
  /** Mot-clé qui a déclenché le handover (utile pour le brief IA d'Aïssa). */
  triggerMatched?: string | null;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildSubject(msg: NormalisedIncoming, handover: boolean): string {
  const channel = msg.channel === "whatsapp" ? "WhatsApp" : "Instagram";
  const who = msg.contactName || msg.contactRef;
  const preview = (msg.text || "(message vide)").slice(0, 60);
  const prefix = handover ? "[🚨 HANDOVER] " : "";
  return `${prefix}[${channel}] ${who} : ${preview}`;
}

function buildHtml(args: NotifyArgs): string {
  const { msg, hubspotContactId } = args;
  const channel = msg.channel === "whatsapp" ? "WhatsApp" : "Instagram DM";
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const hubspotUrl =
    hubspotContactId && portalId
      ? `https://app.hubspot.com/contacts/${portalId}/contact/${hubspotContactId}`
      : null;

  return `<!doctype html>
<html lang="fr">
  <body style="font-family: -apple-system, system-ui, sans-serif; color: #1a1a1a; max-width: 560px; margin: 0 auto; padding: 24px;">
    <h2 style="margin: 0 0 8px; font-size: 18px;">Nouveau message ${escapeHtml(channel)}</h2>
    <p style="margin: 0 0 16px; color: #666; font-size: 14px;">
      Reçu le ${msg.timestamp.toLocaleString("fr-FR")}
    </p>

    <div style="background: #f6f5f1; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
      <p style="margin: 0 0 4px; font-size: 13px; color: #888;">De</p>
      <p style="margin: 0 0 12px; font-weight: 600;">
        ${escapeHtml(msg.contactName || "")} ${escapeHtml(msg.contactRef)}
      </p>
      <p style="margin: 0 0 4px; font-size: 13px; color: #888;">Message</p>
      <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(msg.text || "(message vide)")}</p>
      ${
        msg.mediaType && msg.mediaType !== "text"
          ? `<p style="margin: 12px 0 0; font-size: 13px; color: #888;">📎 Pièce jointe : ${escapeHtml(msg.mediaType)}</p>`
          : ""
      }
    </div>

    ${
      hubspotUrl
        ? `<a href="${hubspotUrl}" style="display: inline-block; background: #b08c6a; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; font-weight: 600;">Voir dans HubSpot</a>`
        : `<p style="color: #888; font-size: 13px;">Configurez HUBSPOT_PORTAL_ID pour activer le lien direct.</p>`
    }

    <p style="margin-top: 32px; font-size: 12px; color: #999;">
      Pour répondre, ouvrez WhatsApp Business directement sur votre téléphone. La conversation est aussi loggée dans HubSpot.
    </p>
  </body>
</html>`;
}

function buildText(args: NotifyArgs): string {
  const { msg } = args;
  const channel = msg.channel === "whatsapp" ? "WhatsApp" : "Instagram DM";
  return [
    `Nouveau message ${channel} — ${msg.timestamp.toLocaleString("fr-FR")}`,
    `De : ${msg.contactName || ""} ${msg.contactRef}`,
    "",
    msg.text || "(message vide)",
    msg.mediaType && msg.mediaType !== "text" ? `\nPièce jointe : ${msg.mediaType}` : "",
    "",
    "Répondez via l'app WhatsApp Business sur votre téléphone.",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Notif WhatsApp à Aïssa quand handover détecté.
 *
 * Génère un résumé IA structuré (1 appel Haiku 4.5) à partir de l'historique
 * Upstash, et l'envoie sur le numéro perso d'Aïssa (AISSA_NOTIFY_PHONE).
 * Elle peut prendre la conversation en 10 secondes sans rien relire.
 */
async function pingAissaViaWhatsApp(
  msg: NormalisedIncoming,
  _hubspotContactId: string | null,
  triggerMatched: string | null,
): Promise<void> {
  const target = process.env.AISSA_NOTIFY_PHONE;
  if (!target) return;
  if (target === msg.contactRef) {
    console.warn(
      "[whatsapp/notifications] AISSA_NOTIFY_PHONE == contactRef — test mode self-ping",
    );
  }

  const who = msg.contactName || msg.contactRef;
  const channelLabel = msg.channel === "whatsapp" ? "WhatsApp" : "Instagram";

  const history = await getConversationHistory(msg.contactRef).catch(() => []);

  const summary = await summarizeForHandover({
    history,
    lastUserMessage: msg.text,
    contactName: msg.contactName,
    triggerMatched,
  });

  const header = [
    "🚨 *Handover demandé*",
    "",
    `*De :* ${who} (${msg.contactRef}) — ${channelLabel}`,
  ].join("\n");

  const body =
    summary ??
    [
      "",
      "_Résumé IA indisponible — voici le dernier message :_",
      `"${(msg.text || "").slice(0, 300)}"`,
    ].join("\n");

  const footer = "\n\n_Ouvre Meta Business Suite pour répondre._";

  const text = `${header}\n\n${body}${footer}`;
  const res = await sendWhatsAppText({ toPhoneNumber: target, text });
  if (!res.ok) {
    console.error(
      "[whatsapp/notifications] ping WhatsApp Aïssa échoué :",
      res.error,
    );
  }
}

export async function notifyAissaOfMessage(args: NotifyArgs): Promise<{ id: string } | null> {
  // Si c'est un handover, envoie en parallèle un ping WhatsApp à Aïssa
  // pour qu'elle voie l'alerte direct sur son tel sans avoir à ouvrir l'email.
  if (args.handover) {
    void pingAissaViaWhatsApp(
      args.msg,
      args.hubspotContactId,
      args.triggerMatched ?? null,
    ).catch(() => undefined);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[whatsapp/notifications] RESEND_API_KEY manquant — notification non envoyée.");
    return null;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "contact@aissaevents.com";
  const toEmail = process.env.RESEND_TO_EMAIL ?? "contact@aissaevents.com";

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: `Aïssa Events Assistante <${fromEmail}>`,
    to: [toEmail],
    subject: buildSubject(args.msg, args.handover ?? false),
    html: buildHtml(args),
    text: buildText(args),
  });

  if (error) {
    console.error("[whatsapp/notifications] Resend a refusé l'envoi :", error);
    return null;
  }

  return data ? { id: data.id } : null;
}
