import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { sanityWriteClient } from "@/lib/sanity/client.server";
import { sanityClient } from "@/lib/sanity/client";
import { parseICS, toBusyRanges } from "@/lib/availability/ics-parser";
import { logError, logEvent } from "@/lib/whatsapp/observability";

/**
 * Cron de synchronisation du calendrier Google → Sanity.
 *
 * Auth : header `Authorization: Bearer ${CRON_SECRET}` (injecté par Vercel Cron).
 * Fréquence : configurée dans `vercel.json` (3×/jour : 7h, 12h, 18h UTC).
 *
 * Idempotent : récrit intégralement le tableau `busyRanges` à chaque tour.
 */

const SETTINGS_QUERY = /* groq */ `
  *[_type == "availability"][0]{
    enabled,
    feedUrl,
    defaultOptionDurationDays
  }
`;

const AVAILABILITY_DOC_ID = "availability";

function isAuthorized(req: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = req.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

async function writeSyncResult(
  status: "ok" | "error",
  payload: {
    busyRanges?: ReturnType<typeof toBusyRanges>;
    error?: string;
  },
) {
  const patch = sanityWriteClient
    .patch(AVAILABILITY_DOC_ID)
    .set({
      lastSyncedAt: new Date().toISOString(),
      lastSyncStatus: status,
      lastSyncError: status === "error" ? payload.error ?? "" : "",
    });
  if (status === "ok" && payload.busyRanges) {
    patch.set({ busyRanges: payload.busyRanges });
  }
  await patch.commit({ autoGenerateArrayKeys: true });
  revalidateTag("availability", "max");
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let settings: {
    enabled?: boolean;
    feedUrl?: string;
    defaultOptionDurationDays?: number;
  } | null = null;

  try {
    settings = await sanityClient.fetch(SETTINGS_QUERY);
  } catch (err) {
    logError("Sync availability — read Sanity failed", err, {
      scope: "cron/sync-availability",
    });
    return NextResponse.json(
      { ok: false, error: "Lecture Sanity échouée." },
      { status: 500 },
    );
  }

  if (!settings?.enabled || !settings.feedUrl) {
    logEvent("availability_sync_skipped", {
      scope: "cron/sync-availability",
      extra: {
        enabled: settings?.enabled,
        hasFeedUrl: Boolean(settings?.feedUrl),
      },
    });
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: !settings?.enabled ? "disabled" : "no-feed-url",
    });
  }

  // Le préfixe `webcal://` n'est pas reconnu par fetch — on le réécrit en https.
  const url = settings.feedUrl.replace(/^webcal:\/\//i, "https://");

  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "User-Agent": "AissaEventsAvailabilitySync/1.0" },
    });
    if (!res.ok) {
      const err = `Flux ICS HTTP ${res.status}`;
      await writeSyncResult("error", { error: err });
      logError("Sync availability — fetch ICS non-OK", new Error(err), {
        scope: "cron/sync-availability",
        extra: { status: res.status },
      });
      return NextResponse.json({ ok: false, error: err }, { status: 502 });
    }
    const body = await res.text();
    const { events, warnings } = parseICS(body);

    const busyRanges = toBusyRanges(events, {
      defaultOptionDurationDays: settings.defaultOptionDurationDays ?? 14,
    });

    await writeSyncResult("ok", { busyRanges });

    logEvent("availability_sync_ok", {
      scope: "cron/sync-availability",
      extra: {
        eventsRead: events.length,
        ranges: busyRanges.length,
        warnings: warnings.length,
      },
    });

    return NextResponse.json({
      ok: true,
      events: events.length,
      ranges: busyRanges.length,
      warnings,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    await writeSyncResult("error", { error: message });
    logError("Sync availability — exception", err, {
      scope: "cron/sync-availability",
    });
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 },
    );
  }
}
