import "server-only";
import { logError } from "@/lib/whatsapp/observability";

/**
 * Intégration Google Calendar (écriture) — création de l'event sur l'agenda
 * d'Aïssa + lien Google Meet pour les RDV en visio.
 *
 * Auth : OAuth2 « refresh token » (le seul moyen d'obtenir un Meet, y compris
 * sur une Gmail perso — un compte de service ne peut pas créer de conférence).
 * Le refresh token s'obtient une fois via `scripts/google-oauth.ts`.
 *
 * Zéro dépendance : appels REST directs (token endpoint + Calendar API v3).
 *
 * Fail-soft : si non configuré ou en cas d'erreur, renvoie `null` et le RDV
 * reste valable — l'invitation `.ics` par email prend le relais.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3/calendars";

export function isGoogleCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
  );
}

function calendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID || "primary";
}

async function getAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Rafraîchissement token Google ${res.status} : ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Réponse token Google sans access_token.");
  return json.access_token;
}

export type CreateEventInput = {
  summary: string;
  description: string;
  /** ISO UTC. */
  startIso: string;
  endIso: string;
  timeZone: string;
  attendeeEmail?: string;
  attendeeName?: string;
  location?: string | null;
  /** Demander la création d'un lien Google Meet (RDV visio). */
  withMeet: boolean;
};

export type CreateEventResult = {
  eventId: string;
  htmlLink: string | null;
  meetLink: string | null;
};

export async function createCalendarEvent(
  input: CreateEventInput,
): Promise<CreateEventResult | null> {
  if (!isGoogleCalendarConfigured()) return null;
  try {
    const token = await getAccessToken();

    type EventBody = {
      summary: string;
      description: string;
      location?: string;
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
      attendees?: { email: string; displayName?: string }[];
      conferenceData?: {
        createRequest: {
          requestId: string;
          conferenceSolutionKey: { type: string };
        };
      };
    };

    const body: EventBody = {
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.startIso, timeZone: input.timeZone },
      end: { dateTime: input.endIso, timeZone: input.timeZone },
    };
    if (input.location) body.location = input.location;
    if (input.attendeeEmail) {
      body.attendees = [
        { email: input.attendeeEmail, displayName: input.attendeeName },
      ];
    }
    if (input.withMeet) {
      body.conferenceData = {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      };
    }

    // sendUpdates=none : on n'envoie pas l'invite Google (notre email .ics
    // brandé fait déjà foi) ; conferenceDataVersion=1 : requis pour le Meet.
    const params = new URLSearchParams({
      conferenceDataVersion: "1",
      sendUpdates: "none",
    });
    const res = await fetch(
      `${CALENDAR_API}/${encodeURIComponent(calendarId())}/events?${params}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      throw new Error(`Création event Google ${res.status} : ${await res.text()}`);
    }
    const json = (await res.json()) as {
      id: string;
      htmlLink?: string;
      hangoutLink?: string;
      conferenceData?: {
        entryPoints?: { entryPointType?: string; uri?: string }[];
      };
    };
    const meetLink =
      json.hangoutLink ??
      json.conferenceData?.entryPoints?.find((e) => e.entryPointType === "video")
        ?.uri ??
      null;
    return { eventId: json.id, htmlLink: json.htmlLink ?? null, meetLink };
  } catch (err) {
    logError("google-calendar — création event échouée (RDV conservé)", err, {
      scope: "booking/google-calendar",
    });
    return null;
  }
}

/**
 * Supprime un event de l'agenda (ex. quand un RDV est annulé). Fail-soft.
 * Pas encore branché sur un webhook Sanity — utilisable manuellement / plus tard.
 */
export async function deleteCalendarEvent(eventId: string): Promise<void> {
  if (!isGoogleCalendarConfigured() || !eventId) return;
  try {
    const token = await getAccessToken();
    await fetch(
      `${CALENDAR_API}/${encodeURIComponent(calendarId())}/events/${encodeURIComponent(eventId)}?sendUpdates=none`,
      { method: "DELETE", headers: { authorization: `Bearer ${token}` }, cache: "no-store" },
    );
  } catch (err) {
    logError("google-calendar — suppression event échouée", err, {
      scope: "booking/google-calendar",
    });
  }
}
