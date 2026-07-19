"use server";

import { headers } from "next/headers";
import {
  BusinessLeadSchema,
  type BusinessLeadErrors,
} from "@/lib/contact/business-schema";
import { checkContactRateLimit } from "@/lib/contact/rate-limit";
import { sendBusinessLeadEmail } from "@/lib/contact/resend";
import { pushBusinessLeadToHubspot } from "@/lib/contact/hubspot";
import type { BusinessLeadState } from "./business-contact-state";

/**
 * Server Action du formulaire de qualification B2B (page Entreprises).
 *
 * Même pipeline que le formulaire de contact générique :
 *  1. Parse + validation Zod (champs obligatoires : coordonnées, type, effectif,
 *     période, budget)
 *  2. Honeypot (`website` rempli → bot, succès simulé)
 *  3. Rate-limit Upstash (5/h/IP) — partagé avec le contact générique
 *  4. Envoi email Resend (obligatoire) vers contact@aissaevents.com
 *  5. Push HubSpot (optionnel — n'échoue pas si absent)
 */
export async function submitBusinessForm(
  _prevState: BusinessLeadState,
  formData: FormData,
): Promise<BusinessLeadState> {
  // 1. Parse
  const raw = {
    company: formData.get("company"),
    sector: formData.get("sector"),
    contactName: formData.get("contactName"),
    role: formData.get("role"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    eventType: formData.get("eventType"),
    headcount: formData.get("headcount"),
    period: formData.get("period"),
    location: formData.get("location"),
    schedule: formData.get("schedule"),
    services: formData.getAll("services").map(String),
    budget: formData.get("budget"),
    objective: formData.get("objective"),
    notes: formData.get("notes"),
    pack: formData.get("pack"),
    consent: formData.get("consent"),
    website: formData.get("website"),
  };

  const parsed = BusinessLeadSchema.safeParse(raw);

  // 2. Honeypot rempli → succès silencieux
  if (
    parsed.success === false &&
    parsed.error.issues.some((i) => i.path[0] === "website")
  ) {
    return { status: "success", submittedAt: Date.now() };
  }

  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors as BusinessLeadErrors;
    return {
      status: "error",
      errors: flat,
      generalError: "Merci de corriger les champs en rouge.",
    };
  }

  // 3. Rate-limit par IP
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
        "Trop de demandes depuis votre adresse. Réessayez dans une heure ou appelez-nous.",
    };
  }

  // 4. Email (obligatoire) + CRM (optionnel) en parallèle
  const [emailResult, hubspotResult] = await Promise.allSettled([
    sendBusinessLeadEmail(parsed.data),
    pushBusinessLeadToHubspot(parsed.data),
  ]);

  if (emailResult.status === "rejected") {
    console.error("[business] Resend a échoué :", emailResult.reason);
    return {
      status: "error",
      generalError:
        "Impossible d'envoyer votre demande pour l'instant. Merci de nous contacter par téléphone.",
    };
  }

  if (hubspotResult.status === "rejected") {
    console.error("[business] HubSpot a échoué (non bloquant) :", hubspotResult.reason);
  }

  return { status: "success", submittedAt: Date.now() };
}
