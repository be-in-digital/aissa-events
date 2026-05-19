import { waitUntil } from "@vercel/functions";
import { NextResponse } from "next/server";

import {
  extractIncomingMessages,
  extractOutboundEchoes,
  extractOutboundStatuses,
  processIncomingMessage,
  processOutboundEcho,
  processOutboundStatus,
} from "@/lib/whatsapp/processor";
import { checkMetaWebhookRateLimit } from "@/lib/whatsapp/rate-limit";
import type { WhatsAppWebhookPayload } from "@/lib/whatsapp/types";
import {
  handleHandshake,
  verifyMetaSignature,
} from "@/lib/whatsapp/webhook-verify";

/**
 * Webhook Meta — WhatsApp Cloud API + Instagram Messenger Platform.
 *
 * GET  : handshake de souscription (`hub.challenge`).
 * POST : événements (messages entrants, statuses, etc.).
 *
 * Le POST DOIT répondre en <5 secondes sinon Meta retry et duplique les messages.
 * Pour respecter ça : on vérifie la signature, on accepte le payload, puis on
 * traite en arrière-plan via `waitUntil()` (Vercel Functions API) qui prolonge
 * l'exécution de la function après la réponse 200.
 *
 * Référence : https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks
 */

export async function GET(req: Request) {
  const url = new URL(req.url);
  const result = handleHandshake(url.searchParams);
  if (!result.ok) {
    return new NextResponse(result.reason, { status: 403 });
  }
  // Meta exige une réponse text/plain avec le challenge en clair
  return new NextResponse(result.challenge, {
    status: 200,
    headers: { "content-type": "text/plain" },
  });
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifyMetaSignature(rawBody, signature)) {
    // On répond 401 plutôt que 403 pour éviter qu'un attaquant comprenne
    // que le secret est absent vs invalide.
    return new NextResponse("Signature invalide.", { status: 401 });
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as WhatsAppWebhookPayload;
  } catch {
    return new NextResponse("JSON invalide.", { status: 400 });
  }

  const messages = extractIncomingMessages(payload);
  const echoes = extractOutboundEchoes(payload);
  const statuses = extractOutboundStatuses(payload);

  // Anti-flood : on borne le nombre de messages traités par numéro / minute.
  // Les messages au-delà de la limite sont droppés silencieusement (Meta a déjà
  // accepté le payload via la signature ; on évite juste les coûts LLM aval).
  const allowedMessages: typeof messages = [];
  for (const msg of messages) {
    const rl = await checkMetaWebhookRateLimit(msg.contactRef);
    if (rl.success) {
      allowedMessages.push(msg);
    } else {
      console.warn(
        `[webhook/meta] rate-limit atteint pour ${msg.contactRef} — message ${msg.messageId} ignoré`,
      );
    }
  }

  // Traitement asynchrone (après réponse 200). Vercel Functions Fluid Compute
  // exécute le callback `waitUntil` jusqu'à 5 min après la réponse.
  if (allowedMessages.length > 0 || echoes.length > 0 || statuses.length > 0) {
    waitUntil(
      (async () => {
        for (const msg of allowedMessages) {
          try {
            await processIncomingMessage(msg);
          } catch (err) {
            console.error(
              `[webhook/meta] échec traitement message ${msg.messageId} :`,
              err,
            );
          }
        }
        for (const echo of echoes) {
          try {
            await processOutboundEcho(echo);
          } catch (err) {
            console.error(
              `[webhook/meta] échec traitement echo ${echo.messageId} :`,
              err,
            );
          }
        }
        for (const status of statuses) {
          try {
            await processOutboundStatus(status);
          } catch (err) {
            console.error(
              `[webhook/meta] échec traitement status ${status.messageId} :`,
              err,
            );
          }
        }
      })(),
    );
  }

  // Toujours répondre 200 immédiatement, même si pas de messages (statuses, etc.)
  return NextResponse.json({
    ok: true,
    processed: allowedMessages.length,
    dropped: messages.length - allowedMessages.length,
    echoes: echoes.length,
    statuses: statuses.length,
  });
}
