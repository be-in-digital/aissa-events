// Builder d'URL de réservation — remplaçant direct de `buildCalendlyUrl`.
// Sûr côté client : construit un chemin interne `/reserver` (ou `/reserver/<type>`).
//
// L'intercepteur global (`components/booking/booking-interceptor.tsx`) capte les
// clics vers ces chemins et ouvre la modale sans navigation. Sans JS, le lien
// mène à la vraie page (fallback progressif + SEO).

export const BOOKING_PATH = "/reserver";

/** true si un chemin cible la réservation (`/reserver` ou `/reserver/<type>`). */
export function isBookingPath(pathname: string): boolean {
  return pathname === BOOKING_PATH || pathname.startsWith(`${BOOKING_PATH}/`);
}

/** Extrait le slug de type d'un chemin `/reserver/<type>` (ou null pour `/reserver`). */
export function bookingTypeFromPath(pathname: string): string | null {
  if (pathname === BOOKING_PATH || pathname === `${BOOKING_PATH}/`) return null;
  if (!pathname.startsWith(`${BOOKING_PATH}/`)) return null;
  const rest = pathname.slice(BOOKING_PATH.length + 1).split("/")[0];
  return rest || null;
}

export type BookingContext = {
  /** Slug du type de RDV (ex. `appel`, `visite`). Omis → page de choix. */
  type?: string;
  /** Source (utm_source). */
  source?: string;
  /** Contenu (utm_content) pour distinguer le CTA. */
  content?: string;
  /** Date d'événement qui intéresse le visiteur (YYYY-MM-DD), transmise au form. */
  preferredDate?: string;
};

export function buildBookingUrl(context: BookingContext = {}): string {
  const { type, source, content, preferredDate } = context;
  const base = type ? `${BOOKING_PATH}/${encodeURIComponent(type)}` : BOOKING_PATH;
  const params = new URLSearchParams();
  if (source) params.set("utm_source", source);
  if (content) params.set("utm_content", content);
  if (preferredDate) params.set("date", preferredDate);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}
