import "server-only";
import { Resend } from "resend";
import type { ContactFormData } from "./schema";
import { buildLeadEmailHtml, buildLeadEmailText } from "./email-template";

/**
 * Envoie l'email de lead à l'agence via Resend.
 *
 * Variables d'env requises :
 *  - RESEND_API_KEY (commence par "re_")
 *  - RESEND_FROM_EMAIL (un domaine vérifié dans Resend, ex: contact@aissaevents.com)
 *  - RESEND_TO_EMAIL (destination du lead, ex: contact@aissaevents.com)
 *
 * Si RESEND_API_KEY est manquant, lance une erreur explicite (mode "non configuré").
 */
export async function sendLeadEmail(data: ContactFormData): Promise<{ id: string } | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "contact@aissaevents.com";
  const toEmail = process.env.RESEND_TO_EMAIL ?? "contact@aissaevents.com";

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY manquant. Configurez-le dans .env.local pour activer l'envoi d'emails.",
    );
  }

  const resend = new Resend(apiKey);

  const subject = `[Aïssa Events] ${data.eventType} — ${data.firstName} ${data.lastName}`;

  const { data: result, error } = await resend.emails.send({
    from: `Aïssa Events <${fromEmail}>`,
    to: [toEmail],
    replyTo: data.email,
    subject,
    html: buildLeadEmailHtml(data),
    text: buildLeadEmailText(data),
  });

  if (error) {
    throw new Error(`Resend a refusé l'envoi : ${error.message ?? "unknown error"}`);
  }

  return result ? { id: result.id } : null;
}
