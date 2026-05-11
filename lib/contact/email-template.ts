import type { ContactFormData } from "./schema";

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/**
 * Construit l'email HTML envoyé à l'agence pour chaque nouveau lead.
 */
export function buildLeadEmailHtml(data: ContactFormData): string {
  const rows: Array<[string, string]> = [
    ["Prénom", data.firstName],
    ["Nom", data.lastName],
    ["Email", data.email],
    ["Téléphone", data.phone || "—"],
    ["Type d'événement", data.eventType],
    ["Date envisagée", data.eventDate || "—"],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A7A6F; vertical-align: top; width: 140px;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px; font-family: Georgia, serif; font-size: 15px; color: #2C1F33;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Nouveau projet — Aïssa Events</title>
  </head>
  <body style="margin:0; padding:32px; background:#F4EDE5; font-family: Georgia, serif; color: #2C1F33;">
    <div style="max-width:600px; margin:0 auto; background:#FFF9F2; border-radius:18px; overflow:hidden;">
      <div style="padding:32px; background:#2C1F33; color:#F4EDE5;">
        <p style="margin:0 0 8px; font-family: monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #D6BA76;">Aïssa Events · Nouveau lead</p>
        <h1 style="margin:0; font-size: 28px; font-weight: 400; font-style: italic;">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</h1>
        <p style="margin:8px 0 0; font-size: 14px; color: #F4EDE5;">${escapeHtml(data.eventType)}</p>
      </div>
      <table style="width:100%; border-collapse: collapse; padding: 0;">
        ${tableRows}
      </table>
      <div style="padding:24px 32px; border-top: 1px solid #E4D7CB;">
        <p style="margin:0 0 8px; font-family: monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #8A7A6F;">Message</p>
        <p style="margin:0; font-size: 15px; line-height: 1.65; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
      <div style="padding:16px 32px; background:#F4EDE5; font-family: monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #8A7A6F; text-align: center;">
        Répondez à cet email pour contacter directement le client.
      </div>
    </div>
  </body>
</html>`;
}

/**
 * Version texte de l'email (fallback pour clients sans HTML).
 */
export function buildLeadEmailText(data: ContactFormData): string {
  return [
    "AÏSSA EVENTS — NOUVEAU LEAD",
    "",
    `Prénom         : ${data.firstName}`,
    `Nom            : ${data.lastName}`,
    `Email          : ${data.email}`,
    `Téléphone      : ${data.phone || "—"}`,
    `Type d'événement : ${data.eventType}`,
    `Date envisagée : ${data.eventDate || "—"}`,
    "",
    "MESSAGE",
    "",
    data.message,
  ].join("\n");
}
