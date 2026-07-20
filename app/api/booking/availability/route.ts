import { connection } from "next/server";
import { getBookingAvailability } from "@/lib/booking/availability";
import { logError } from "@/lib/whatsapp/observability";

/**
 * Dispo fraîche d'un type de RDV : `GET /api/booking/availability?type=<slug>`.
 * Dynamique (accès réseau ICS + Sanity) → jamais prérendu ni caché.
 */
export async function GET(req: Request) {
  await connection();
  const slug = new URL(req.url).searchParams.get("type");
  if (!slug) {
    return Response.json(
      { error: "Type de rendez-vous manquant." },
      { status: 400 },
    );
  }
  try {
    const data = await getBookingAvailability(slug, Date.now());
    if (!data) {
      return Response.json(
        { code: "type_not_found", error: "Type de rendez-vous inconnu." },
        { status: 404 },
      );
    }
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    logError("booking/availability — GET échoué", err, {
      scope: "api/booking/availability",
    });
    return Response.json(
      { enabled: false, error: "Disponibilités indisponibles pour le moment." },
      { status: 500 },
    );
  }
}
