import { connection } from "next/server";
import { sanityWriteClient } from "@/lib/sanity/client.server";
import { logError, logEvent } from "@/lib/whatsapp/observability";
import { BookingSubmitSchema, type BookingFieldErrors } from "@/lib/booking/schema";
import { getBookingContext } from "@/lib/booking/availability";
import { isSlotBookable } from "@/lib/booking/slots";
import { checkBookingRateLimit, acquireSlotLock, releaseSlotLock } from "@/lib/booking/rate-limit";
import { sendBookingEmails } from "@/lib/booking/email";
import { createCalendarEvent } from "@/lib/booking/google-calendar";
import { pushBookingToHubspot } from "@/lib/booking/hubspot";
import { formatDateTimeFR } from "@/lib/booking/time";

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (
    fwd?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous"
  );
}

export async function POST(req: Request) {
  await connection();

  // 1. Parse JSON
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const parsed = BookingSubmitSchema.safeParse(body);

  // 2. Honeypot rempli → succès simulé (le bot ne saura jamais).
  if (
    !parsed.success &&
    parsed.error.issues.some((i) => i.path[0] === "website")
  ) {
    return Response.json({ ok: true, simulated: true });
  }

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors as BookingFieldErrors;
    return Response.json(
      { ok: false, error: "Merci de corriger les champs.", errors },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // 3. Rate-limit par IP
  const rl = await checkBookingRateLimit(clientIp(req));
  if (!rl.success) {
    return Response.json(
      {
        ok: false,
        error:
          "Trop de tentatives depuis votre connexion. Réessayez dans un moment ou appelez-nous.",
      },
      { status: 429 },
    );
  }

  const nowMs = Date.now();

  // 4. Charge le TYPE demandé + plages occupées, puis re-valide le créneau.
  const { type, busy, globallyEnabled } = await getBookingContext(data.type, nowMs);
  if (!type) {
    return Response.json(
      { ok: false, code: "type_not_found", error: "Type de rendez-vous inconnu." },
      { status: 409 },
    );
  }
  if (!globallyEnabled) {
    return Response.json(
      { ok: false, error: "La réservation en ligne est momentanément fermée." },
      { status: 409 },
    );
  }

  const bookable = isSlotBookable({
    settings: type,
    busy,
    nowMs,
    startIso: data.slotStart,
  });
  if (!bookable) {
    return Response.json(
      {
        ok: false,
        code: "slot_taken",
        error: "Ce créneau vient d'être pris. Choisissez-en un autre.",
      },
      { status: 409 },
    );
  }

  // 5. Verrou court anti-course (clé par type + créneau)
  const lockKey = `${type.slug}:${data.slotStart}`;
  const locked = await acquireSlotLock(lockKey);
  if (!locked) {
    return Response.json(
      {
        ok: false,
        code: "slot_taken",
        error: "Ce créneau est en cours de réservation. Choisissez-en un autre.",
      },
      { status: 409 },
    );
  }

  try {
    const startMs = Date.parse(data.slotStart);
    const endIso = new Date(startMs + type.durationMinutes * 60_000).toISOString();
    const preferredDate = DATE_ONLY_RE.test(data.preferredDate)
      ? data.preferredDate
      : undefined;

    // 6. Google Calendar : crée l'event sur l'agenda d'Aïssa (+ lien Meet pour
    //    les RDV visio). Fail-soft : si non configuré / erreur → null, et
    //    l'invitation .ics par email prend le relais.
    const withMeet = type.meetingType === "video";
    const gcal = await createCalendarEvent({
      summary: `${type.title} — ${data.name}`,
      description: [
        `${type.title} avec ${data.name}`,
        data.phone ? `Tél : ${data.phone}` : "",
        preferredDate ? `Date de projet envisagée : ${preferredDate}` : "",
        data.message ? `\n${data.message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
      startIso: data.slotStart,
      endIso,
      timeZone: type.timezone,
      attendeeEmail: data.email,
      attendeeName: data.name,
      location: withMeet ? null : type.meetingDetail,
      withMeet,
    });

    // Détail « lieu / lien » transmis à l'email + .ics : lien Meet si visio (et
    // créé), sinon le détail configuré (lien réutilisable, adresse…).
    const resolvedDetail = withMeet
      ? gcal?.meetLink ?? type.meetingDetail
      : type.meetingDetail;
    const meetLink =
      resolvedDetail && /^https?:\/\//i.test(resolvedDetail)
        ? resolvedDetail
        : undefined;

    // 7. Écriture Sanity (source de vérité). Un doc confirmé (tous types
    //    confondus) rend le créneau indisponible aux prochains visiteurs.
    const created = await sanityWriteClient.create({
      _type: "booking",
      status: "confirmed",
      bookingTypeSlug: type.slug,
      bookingTypeTitle: type.title,
      start: data.slotStart,
      end: endIso,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message || undefined,
      meetingType: type.meetingType,
      meetLink,
      googleEventId: gcal?.eventId,
      preferredEventDate: preferredDate,
      source: data.source || undefined,
      utmContent: data.content || undefined,
      createdAt: new Date().toISOString(),
    });

    // 8. Emails (agence + client) & HubSpot — non bloquants si échec.
    const [emailResult, hubspotResult] = await Promise.allSettled([
      sendBookingEmails({
        typeTitle: type.title,
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        startIso: data.slotStart,
        endIso,
        meetingType: type.meetingType,
        meetingDetail: resolvedDetail,
        preferredDate: data.preferredDate,
        timezone: type.timezone,
        bookingId: created._id,
      }),
      type.createHubspotContact
        ? pushBookingToHubspot({
            name: data.name,
            email: data.email,
            phone: data.phone,
            message: data.message,
          })
        : Promise.resolve(null),
    ]);

    if (emailResult.status === "rejected") {
      logError("booking — envoi email échoué (RDV enregistré)", emailResult.reason, {
        scope: "api/booking",
        extra: { bookingId: created._id },
      });
    }
    if (hubspotResult.status === "rejected") {
      logError("booking — HubSpot échoué (non bloquant)", hubspotResult.reason, {
        scope: "api/booking",
      });
    }

    logEvent("booking_created", {
      scope: "api/booking",
      extra: { bookingId: created._id, type: type.slug, source: data.source || "direct" },
    });

    return Response.json({
      ok: true,
      booking: {
        id: created._id,
        typeTitle: type.title,
        startIso: data.slotStart,
        endIso,
        label: formatDateTimeFR(startMs, type.timezone),
      },
    });
  } catch (err) {
    logError("booking — création échouée", err, { scope: "api/booking" });
    return Response.json(
      { ok: false, error: "Réservation impossible pour le moment. Réessayez." },
      { status: 500 },
    );
  } finally {
    await releaseSlotLock(lockKey);
  }
}
