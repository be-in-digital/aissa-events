import "server-only";
import { Client } from "@hubspot/api-client";
import type { ContactFormData } from "./schema";

/**
 * Pousse un lead vers HubSpot CRM.
 *
 * Variables d'env requises :
 *  - HUBSPOT_PRIVATE_APP_TOKEN (commence par "pat-...")
 *    Crée un "Private App" dans HubSpot → permissions CRM Contacts (read + write).
 *
 * Si la variable est manquante, la fonction retourne null silencieusement
 * (HubSpot est optionnel — l'email Resend reste l'authoritative source).
 *
 * Pour personnaliser les propriétés HubSpot (ex: type d'événement comme custom
 * property), créez la propriété dans HubSpot avant et ajoutez-la au mapping
 * ci-dessous.
 */
export async function pushLeadToHubspot(
  data: ContactFormData,
): Promise<{ id: string } | null> {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return null;

  const hubspot = new Client({ accessToken: token });

  try {
    const result = await hubspot.crm.contacts.basicApi.create({
      properties: {
        email: data.email,
        firstname: data.firstName,
        lastname: data.lastName,
        phone: data.phone || "",
        hs_lead_status: "NEW",
        lifecyclestage: "lead",
        // Personnalisation : créez ces propriétés custom dans HubSpot si besoin.
        // event_type: data.eventType,
        // event_date: data.eventDate || "",
        // initial_message: data.message,
      },
      associations: [],
    });
    return { id: result.id };
  } catch (e: unknown) {
    // Si le contact existe déjà (409 CONFLICT), on retourne sans erreur.
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code?: number }).code === 409
    ) {
      return null;
    }
    throw e;
  }
}
