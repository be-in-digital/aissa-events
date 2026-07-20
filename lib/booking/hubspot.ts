import "server-only";
import { Client } from "@hubspot/api-client";

/**
 * Pousse le contact d'une réservation vers HubSpot (optionnel).
 * Sans HUBSPOT_PRIVATE_APP_TOKEN → no-op silencieux (l'email Resend fait foi).
 * Renvoie sans erreur si le contact existe déjà (409).
 */
export async function pushBookingToHubspot(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<{ id: string } | null> {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return null;

  const parts = data.name.trim().split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");

  const hubspot = new Client({ accessToken: token });
  try {
    const result = await hubspot.crm.contacts.basicApi.create({
      properties: {
        email: data.email,
        firstname: firstName,
        lastname: lastName,
        phone: data.phone || "",
        hs_lead_status: "NEW",
        lifecyclestage: "lead",
      },
      associations: [],
    });
    return { id: result.id };
  } catch (e: unknown) {
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
