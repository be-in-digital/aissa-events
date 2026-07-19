import type { BusinessLeadData } from "./business-schema";

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function buildRows(data: BusinessLeadData): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Entreprise", data.company],
    ["Secteur", data.sector || "—"],
    ["Contact", data.contactName],
    ["Fonction", data.role || "—"],
    ["Email", data.email],
    ["Téléphone", data.phone],
    ["Type d'événement", data.eventType],
    ["Participants", data.headcount],
    ["Date / période", data.period],
    ["Lieu souhaité", data.location || "—"],
    ["Horaires / durée", data.schedule || "—"],
    [
      "Prestations",
      data.services && data.services.length ? data.services.join(", ") : "—",
    ],
    ["Budget prévisionnel", data.budget],
  ];
  if (data.pack) rows.push(["Pack d'origine", data.pack]);
  return rows;
}

/** Email HTML envoyé à l'agence pour chaque demande de qualification B2B. */
export function buildBusinessLeadEmailHtml(data: BusinessLeadData): string {
  const tableRows = buildRows(data)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A7A6F; vertical-align: top; width: 150px;">${escapeHtml(label)}</td>
          <td style="padding:8px 12px; font-family: Georgia, serif; font-size: 15px; color: #2C1F33;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  const objective = data.objective?.trim();
  const notes = data.notes?.trim();

  const block = (label: string, value: string) => `
      <div style="padding:20px 32px; border-top: 1px solid #E4D7CB;">
        <p style="margin:0 0 8px; font-family: monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #8A7A6F;">${escapeHtml(label)}</p>
        <p style="margin:0; font-size: 15px; line-height: 1.65; white-space: pre-wrap;">${escapeHtml(value)}</p>
      </div>`;

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Nouvelle demande entreprise — Aïssa Events</title>
  </head>
  <body style="margin:0; padding:32px; background:#F4EDE5; font-family: Georgia, serif; color: #2C1F33;">
    <div style="max-width:640px; margin:0 auto; background:#FFF9F2; border-radius:18px; overflow:hidden;">
      <div style="padding:32px; background:#2C1F33; color:#F4EDE5;">
        <p style="margin:0 0 8px; font-family: monospace; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #D6BA76;">Aïssa Events · Demande entreprise</p>
        <h1 style="margin:0; font-size: 26px; font-weight: 400; font-style: italic;">${escapeHtml(data.company)}</h1>
        <p style="margin:8px 0 0; font-size: 14px; color: #F4EDE5;">${escapeHtml(data.eventType)} · ${escapeHtml(data.headcount)} participants · ${escapeHtml(data.budget)}</p>
      </div>
      <table style="width:100%; border-collapse: collapse; padding: 0;">
        ${tableRows}
      </table>
      ${objective ? block("Objectif principal", objective) : ""}
      ${notes ? block("Informations complémentaires", notes) : ""}
      <div style="padding:16px 32px; background:#F4EDE5; font-family: monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #8A7A6F; text-align: center;">
        Répondez à cet email pour contacter directement le client.
      </div>
    </div>
  </body>
</html>`;
}

/** Version texte (fallback pour clients sans HTML). */
export function buildBusinessLeadEmailText(data: BusinessLeadData): string {
  const lines = buildRows(data).map(
    ([label, value]) => `${label.padEnd(22)} : ${value}`,
  );
  const out = ["AÏSSA EVENTS — NOUVELLE DEMANDE ENTREPRISE", "", ...lines];
  if (data.objective?.trim()) {
    out.push("", "OBJECTIF PRINCIPAL", "", data.objective.trim());
  }
  if (data.notes?.trim()) {
    out.push("", "INFORMATIONS COMPLÉMENTAIRES", "", data.notes.trim());
  }
  return out.join("\n");
}
