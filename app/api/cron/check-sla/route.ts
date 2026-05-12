import { NextResponse } from "next/server";

import { Client } from "@hubspot/api-client";
import { FilterOperatorEnum } from "@hubspot/api-client/lib/codegen/crm/contacts/models/Filter";

import {
  interpolateMessage,
  loadAgentSettings,
} from "@/lib/whatsapp/agent-settings";
import {
  updateContactProperties,
} from "@/lib/whatsapp/hubspot-sync";
import { sendWhatsAppText } from "@/lib/whatsapp/meta-send";
import { logError, logEvent } from "@/lib/whatsapp/observability";

/**
 * Cron SLA — Envoie une relance automatique aux prospects qui n'ont pas
 * reçu de réponse d'Aïssa dans le délai imparti.
 *
 * Auth : Vercel Cron injecte automatiquement un header
 * `Authorization: Bearer ${CRON_SECRET}`.
 *
 * Fréquence configurée dans `vercel.json` (2 fois/jour sur plan Hobby :
 * 9h et 21h Europe/Paris) — suffisant pour le volume cible (20-50 leads/mois).
 *
 * Si on passe à Vercel Pro, on peut affiner à 30 min via le schedule cron
 * dans `vercel.json`.
 */

interface ContactSearchResult {
  id: string;
  properties: {
    phone?: string;
    dernier_message_at?: string;
    relance_sla_envoyee_at?: string;
    firstname?: string;
    canal_origine?: string;
  };
}

function getClient(): Client | null {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) return null;
  return new Client({ accessToken: token });
}

function isAuthorized(req: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    // En l'absence de secret, on refuse plutôt que de courir un cron ouvert
    return false;
  }
  const header = req.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const hubspot = getClient();
  if (!hubspot) {
    return NextResponse.json(
      { ok: false, error: "HUBSPOT_PRIVATE_APP_TOKEN non configuré." },
      { status: 500 },
    );
  }

  const settings = await loadAgentSettings();
  // On utilise la valeur la plus longue (hors heures ouvrées) pour ne pas
  // spammer les prospects qui ont écrit la nuit. Si tu veux affiner avec
  // une logique heures ouvrées vs hors heures, fais-le ici en utilisant
  // `new Date().getHours()` et `slaHeuresOuvreesMinutes`.
  const slaMs = settings.slaHorsHeuresHours * 3600 * 1000;
  const cutoffIso = new Date(Date.now() - slaMs).toISOString();

  let processed = 0;
  let relanced = 0;
  let errors = 0;

  try {
    const search = await hubspot.crm.contacts.searchApi.doSearch({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "dernier_message_at",
              operator: FilterOperatorEnum.Lt,
              value: cutoffIso,
            },
            {
              propertyName: "human_takeover",
              operator: FilterOperatorEnum.Neq,
              value: "true",
            },
            {
              propertyName: "hs_lead_status",
              operator: FilterOperatorEnum.Eq,
              value: "NEW",
            },
          ],
        },
      ],
      properties: [
        "phone",
        "firstname",
        "dernier_message_at",
        "relance_sla_envoyee_at",
        "canal_origine",
      ],
      limit: 50,
      sorts: [],
      after: "0",
    });

    const candidates = (search.results ?? []) as ContactSearchResult[];

    for (const contact of candidates) {
      processed++;
      const lastMessageAt = contact.properties.dernier_message_at
        ? new Date(contact.properties.dernier_message_at).getTime()
        : 0;
      const lastRelance = contact.properties.relance_sla_envoyee_at
        ? new Date(contact.properties.relance_sla_envoyee_at).getTime()
        : 0;

      // Skip si déjà relancé après le dernier message
      if (lastRelance > lastMessageAt) continue;

      // Skip si pas de canal WhatsApp (Instagram send pas encore implémenté)
      if (contact.properties.canal_origine !== "whatsapp") continue;

      const phone = contact.properties.phone;
      if (!phone) continue;

      const text = interpolateMessage(settings.messageRelanceSlaDepasse, {
        personaName: settings.personaName,
      });

      const sendResult = await sendWhatsAppText({
        toPhoneNumber: phone.replace(/^\+/, ""),
        text,
      });

      if (sendResult.ok) {
        await updateContactProperties(contact.id, {
          relance_sla_envoyee_at: new Date().toISOString(),
        });
        relanced++;
        logEvent("sla_relance_sent", {
          scope: "cron/check-sla",
          channel: "whatsapp",
          contactRef: phone,
          extra: { contactId: contact.id, hours_since_last: Math.round((Date.now() - lastMessageAt) / 3600000) },
        });
      } else {
        errors++;
        logError("Envoi relance SLA échoué", new Error(sendResult.error ?? "unknown"), {
          scope: "cron/check-sla",
          contactRef: phone,
          extra: { contactId: contact.id },
        });
      }
    }
  } catch (err) {
    logError("Cron SLA — fetch HubSpot a échoué", err, { scope: "cron/check-sla" });
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Erreur inconnue",
        processed,
        relanced,
        errors,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, processed, relanced, errors, slaHours: settings.slaHorsHeuresHours });
}
