import "server-only";
import { sanityWriteClient } from "@/lib/sanity/client.server";
import { parseICS } from "@/lib/availability/ics-parser";
import { logError } from "@/lib/whatsapp/observability";
import type { BookingType, BusyInterval } from "./types";

const FEED_QUERY = /* groq */ `*[_type == "availability"][0]{ feedUrl, enabled }`;

const CONFIRMED_BOOKINGS_QUERY = /* groq */ `
  *[_type == "booking" && status == "confirmed" && start >= $from && start <= $to]{
    start, end
  }
`;

/**
 * Récupère les créneaux du calendrier Google (flux ICS secret partagé avec le
 * calendrier public). Lecture seule — c'est le même flux que le cron de dispo.
 * En cas d'échec réseau : on log et on renvoie [] (fail-open côté Google ; les
 * réservations Sanity restent, elles, toujours filtrées).
 */
async function getGoogleBusy(fromMs: number, toMs: number): Promise<BusyInterval[]> {
  let feed: { feedUrl?: string; enabled?: boolean } | null = null;
  try {
    feed = await sanityWriteClient.fetch(FEED_QUERY);
  } catch (err) {
    logError("booking/busy — lecture feedUrl Sanity échouée", err, {
      scope: "booking/busy",
    });
    return [];
  }
  if (!feed?.feedUrl) return [];

  const url = feed.feedUrl.replace(/^webcal:\/\//i, "https://");
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": "AissaEventsBookingSync/1.0" },
    });
    if (!res.ok) {
      logError(
        "booking/busy — flux ICS non-OK",
        new Error(`HTTP ${res.status}`),
        { scope: "booking/busy" },
      );
      return [];
    }
    const body = await res.text();
    const { events } = parseICS(body);
    const intervals: BusyInterval[] = [];
    for (const ev of events) {
      const startMs = Date.parse(ev.start);
      const endMs = Date.parse(ev.end);
      if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) continue;
      if (endMs <= fromMs || startMs >= toMs) continue;
      intervals.push({ startMs, endMs });
    }
    return intervals;
  } catch (err) {
    logError("booking/busy — fetch ICS exception", err, { scope: "booking/busy" });
    return [];
  }
}

/** Réservations confirmées (Sanity) sur l'horizon → intervalles occupés exacts. */
async function getBookingBusy(fromIso: string, toIso: string): Promise<BusyInterval[]> {
  try {
    const rows = await sanityWriteClient.fetch<{ start: string; end: string }[]>(
      CONFIRMED_BOOKINGS_QUERY,
      { from: fromIso, to: toIso },
    );
    const intervals: BusyInterval[] = [];
    for (const r of rows ?? []) {
      const startMs = Date.parse(r.start);
      const endMs = Date.parse(r.end);
      if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) continue;
      intervals.push({ startMs, endMs });
    }
    return intervals;
  } catch (err) {
    logError("booking/busy — lecture bookings Sanity échouée", err, {
      scope: "booking/busy",
    });
    // Fail-closed sur les bookings serait plus sûr mais bloquerait tout ;
    // on renvoie [] et on log. Le verrou Upstash + re-check au POST restent.
    return [];
  }
}

/**
 * Agrège toutes les plages occupées sur [now, now + horizon] :
 * Google Calendar (si activé) + réservations confirmées Sanity.
 */
export async function getBusyIntervals(
  settings: BookingType,
  nowMs: number,
): Promise<BusyInterval[]> {
  const toMs = nowMs + settings.horizonDays * 24 * 60 * 60_000;
  const fromIso = new Date(nowMs).toISOString();
  const toIso = new Date(toMs).toISOString();

  const [google, bookings] = await Promise.all([
    settings.useAvailabilityFeed ? getGoogleBusy(nowMs, toMs) : Promise.resolve([]),
    getBookingBusy(fromIso, toIso),
  ]);

  return [...google, ...bookings];
}
