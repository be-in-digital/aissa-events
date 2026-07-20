import "server-only";
import { Resend } from "resend";
import { buildBookingIcs } from "./ics";
import { formatDateTimeFR } from "./time";
import { MEETING_TYPE_LABELS, type MeetingType } from "./types";

export type BookingEmailData = {
  typeTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  startIso: string;
  endIso: string;
  meetingType: MeetingType;
  meetingDetail: string | null;
  preferredDate: string;
  timezone: string;
  bookingId: string;
};

const AGENCY_NAME = "Aïssa Events";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function confirmationHtml(d: BookingEmailData, when: string): string {
  const detail = d.meetingDetail?.trim();
  const isUrl = detail ? /^https?:\/\//i.test(detail) : false;
  const meeting = detail
    ? `${MEETING_TYPE_LABELS[d.meetingType]} — ${
        isUrl
          ? `<a href="${esc(detail)}" style="color:#7a2e43">${esc(detail)}</a>`
          : esc(detail)
      }`
    : MEETING_TYPE_LABELS[d.meetingType];
  return `
  <div style="font-family:Georgia,serif;color:#2c1f33;max-width:520px;margin:0 auto;padding:24px">
    <p style="font-family:monospace;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#7a2e43;margin:0 0 12px">Aïssa Events · Rendez-vous confirmé</p>
    <h1 style="font-size:22px;font-weight:400;line-height:1.3;margin:0 0 16px">Votre rendez-vous « ${esc(d.typeTitle)} » est réservé</h1>
    <p style="font-size:15px;line-height:1.6;margin:0 0 20px">Bonjour ${esc(d.name)},<br/>Merci — voici le récapitulatif de votre rendez-vous :</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 20px">
      <tr><td style="padding:8px 0;color:#7a2e43;width:120px">Quand</td><td style="padding:8px 0">${esc(when)}</td></tr>
      <tr><td style="padding:8px 0;color:#7a2e43">Format</td><td style="padding:8px 0">${meeting}</td></tr>
      ${d.preferredDate ? `<tr><td style="padding:8px 0;color:#7a2e43">Votre date</td><td style="padding:8px 0">${esc(d.preferredDate)}</td></tr>` : ""}
    </table>
    <p style="font-size:14px;line-height:1.6;color:#5a5560;margin:0 0 8px">L'invitation est jointe à cet email : ajoutez-la à votre agenda en un clic.</p>
    <p style="font-size:13px;line-height:1.6;color:#8a8590;margin:24px 0 0">Un imprévu ? Répondez simplement à cet email.</p>
  </div>`;
}

function confirmationText(d: BookingEmailData, when: string): string {
  return [
    "Aïssa Events — Rendez-vous confirmé",
    "",
    `Bonjour ${d.name},`,
    "",
    `Votre rendez-vous « ${d.typeTitle} » est réservé :`,
    `• Quand : ${when}`,
    `• Format : ${MEETING_TYPE_LABELS[d.meetingType]}${d.meetingDetail ? ` — ${d.meetingDetail}` : ""}`,
    d.preferredDate ? `• Votre date de projet : ${d.preferredDate}` : "",
    "",
    "L'invitation .ics est jointe à cet email (ajout agenda en un clic).",
    "Un imprévu ? Répondez à cet email.",
  ]
    .filter(Boolean)
    .join("\n");
}

function notificationHtml(d: BookingEmailData, when: string): string {
  return `
  <div style="font-family:system-ui,sans-serif;color:#2c1f33;max-width:560px;margin:0 auto;padding:24px">
    <p style="font-family:monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#7a2e43;margin:0 0 12px">Nouveau RDV réservé sur le site</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:6px 0;color:#7a2e43;width:130px">Quand</td><td style="padding:6px 0"><strong>${esc(when)}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#7a2e43">Nom</td><td style="padding:6px 0">${esc(d.name)}</td></tr>
      <tr><td style="padding:6px 0;color:#7a2e43">Email</td><td style="padding:6px 0"><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></td></tr>
      <tr><td style="padding:6px 0;color:#7a2e43">Téléphone</td><td style="padding:6px 0"><a href="tel:${esc(d.phone)}">${esc(d.phone)}</a></td></tr>
      ${d.preferredDate ? `<tr><td style="padding:6px 0;color:#7a2e43">Date projet</td><td style="padding:6px 0">${esc(d.preferredDate)}</td></tr>` : ""}
      ${d.message ? `<tr><td style="padding:6px 0;color:#7a2e43;vertical-align:top">Message</td><td style="padding:6px 0;white-space:pre-wrap">${esc(d.message)}</td></tr>` : ""}
    </table>
    <p style="font-size:12px;color:#8a8590;margin:20px 0 0">Ajoute l'invitation jointe à ton Google Calendar. Réf. ${esc(d.bookingId)}</p>
  </div>`;
}

function notificationText(d: BookingEmailData, when: string): string {
  return [
    "Nouveau RDV réservé sur le site",
    "",
    `Quand : ${when}`,
    `Nom : ${d.name}`,
    `Email : ${d.email}`,
    `Téléphone : ${d.phone}`,
    d.preferredDate ? `Date projet : ${d.preferredDate}` : "",
    d.message ? `Message : ${d.message}` : "",
    "",
    `Ajoute l'invitation .ics jointe à ton agenda. Réf. ${d.bookingId}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Envoie les deux emails (confirmation client + notification agence) avec
 * l'invitation .ics en pièce jointe. L'email agence est obligatoire (comme le
 * formulaire de contact) ; l'email client est best-effort mais partagé dans le
 * même appel. Lève si RESEND_API_KEY manque ou si l'envoi agence échoue.
 */
export async function sendBookingEmails(d: BookingEmailData): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "contact@aissaevents.com";
  const toEmail = process.env.RESEND_TO_EMAIL ?? "contact@aissaevents.com";

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY manquant. Configurez-le pour activer l'envoi d'emails de réservation.",
    );
  }

  const resend = new Resend(apiKey);
  const when = formatDateTimeFR(Date.parse(d.startIso), d.timezone);

  const ics = buildBookingIcs({
    uid: `${d.bookingId}@aissaevents.fr`,
    startIso: d.startIso,
    endIso: d.endIso,
    meetingType: d.meetingType,
    meetingDetail: d.meetingDetail,
    organizerEmail: fromEmail,
    organizerName: AGENCY_NAME,
    attendeeEmail: d.email,
    attendeeName: d.name,
    summary: `${d.typeTitle} — ${AGENCY_NAME}`,
    description:
      `${d.typeTitle} avec ${d.name}.` +
      (d.phone ? ` Tél : ${d.phone}.` : "") +
      (d.preferredDate ? ` Date de projet envisagée : ${d.preferredDate}.` : "") +
      (d.message ? `\n\n${d.message}` : ""),
  });

  const attachments = [
    {
      filename: "rendez-vous.ics",
      content: Buffer.from(ics),
      contentType: "text/calendar; method=REQUEST; charset=utf-8",
    },
  ];

  // Notification agence — obligatoire.
  const agency = await resend.emails.send({
    from: `${AGENCY_NAME} <${fromEmail}>`,
    to: [toEmail],
    replyTo: d.email,
    subject: `[RDV · ${d.typeTitle}] ${when} — ${d.name}`,
    html: notificationHtml(d, when),
    text: notificationText(d, when),
    attachments,
  });
  if (agency.error) {
    throw new Error(
      `Resend a refusé la notification agence : ${agency.error.message ?? "unknown"}`,
    );
  }

  // Confirmation client — best-effort (log si échec, ne bloque pas la résa).
  const client = await resend.emails.send({
    from: `${AGENCY_NAME} <${fromEmail}>`,
    to: [d.email],
    replyTo: toEmail,
    subject: `Votre rendez-vous « ${d.typeTitle} » — ${when}`,
    html: confirmationHtml(d, when),
    text: confirmationText(d, when),
    attachments,
  });
  if (client.error) {
    console.error(
      "[booking/email] confirmation client échouée (non bloquant) :",
      client.error,
    );
  }
}
