import { connection } from "next/server";
import { getBookingTypesList } from "@/lib/booking/availability";
import { logError } from "@/lib/whatsapp/observability";

/**
 * Liste des types de rendez-vous actifs + copy de la page de choix.
 * `GET /api/booking/types`. Dynamique (Sanity) → non caché.
 */
export async function GET() {
  await connection();
  try {
    const data = await getBookingTypesList();
    return Response.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    logError("booking/types — GET échoué", err, { scope: "api/booking/types" });
    return Response.json(
      { enabled: false, chooser: null, types: [] },
      { status: 500 },
    );
  }
}
