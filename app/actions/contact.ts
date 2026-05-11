"use server";

import { headers } from "next/headers";
import { ContactFormSchema, type ContactFormErrors } from "@/lib/contact/schema";
import { checkContactRateLimit } from "@/lib/contact/rate-limit";
import { sendLeadEmail } from "@/lib/contact/resend";
import { pushLeadToHubspot } from "@/lib/contact/hubspot";

export type ContactFormState = {
  status: "idle" | "success" | "error" | "rate_limited";
  errors?: ContactFormErrors;
  generalError?: string;
  submittedAt?: number;
};

export const INITIAL_CONTACT_STATE: ContactFormState = { status: "idle" };

/**
 * Server Action invoqué depuis le `<form action={...}>` côté client.
 *
 * Pipeline :
 *  1. Parse + validate via Zod
 *  2. Détection honeypot (champ `website` rempli → bot, on simule un succès)
 *  3. Rate-limit Upstash (5/h/IP) — silently disabled si pas configuré
 *  4. Envoi email Resend (obligatoire)
 *  5. Push HubSpot (optionnel — n'échoue pas si manquant)
 *  6. Retourne le nouvel état du form
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // 1. Parse + validate
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    eventType: formData.get("eventType"),
    eventDate: formData.get("eventDate"),
    message: formData.get("message"),
    consent: formData.get("consent"),
    website: formData.get("website"),
  };

  const parsed = ContactFormSchema.safeParse(raw);

  // 2. Honeypot rempli → on simule un succès silencieux (le bot ne saura jamais)
  if (parsed.success === false && parsed.error.issues.some((i) => i.path[0] === "website")) {
    return { status: "success", submittedAt: Date.now() };
  }

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors as ContactFormErrors;
    return {
      status: "error",
      errors: flat,
      generalError: "Merci de corriger les champs en rouge.",
    };
  }

  // 3. Rate-limit par IP (ou fallback "anonymous" si pas d'header)
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "anonymous";

  const rl = await checkContactRateLimit(ip);
  if (!rl.success) {
    return {
      status: "rate_limited",
      generalError:
        "Trop de soumissions depuis votre adresse. Réessayez dans une heure ou contactez-nous par téléphone.",
    };
  }

  // 4. Envoi email + push CRM en parallèle
  const [emailResult, hubspotResult] = await Promise.allSettled([
    sendLeadEmail(parsed.data),
    pushLeadToHubspot(parsed.data),
  ]);

  // L'email est obligatoire. Si Resend échoue, on remonte une erreur.
  if (emailResult.status === "rejected") {
    console.error("[contact] Resend a échoué :", emailResult.reason);
    return {
      status: "error",
      generalError:
        "Impossible d'envoyer votre message pour l'instant. Merci de nous contacter par téléphone.",
    };
  }

  // HubSpot est optionnel : on log mais on n'échoue pas
  if (hubspotResult.status === "rejected") {
    console.error("[contact] HubSpot a échoué (non bloquant) :", hubspotResult.reason);
  }

  return { status: "success", submittedAt: Date.now() };
}
