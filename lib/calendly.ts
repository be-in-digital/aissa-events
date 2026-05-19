import { env } from "@/env";

export type CalendlyContext = {
  source?: string;
  content?: string;
  /** Date préchargée (format YYYY-MM-DD) pour qu'elle apparaisse présélectionnée dans Calendly. */
  preferredDate?: string;
};

export function buildCalendlyUrl(context: CalendlyContext = {}): string {
  const { source = "espace-events", content, preferredDate } = context;
  const url = new URL(env.NEXT_PUBLIC_CALENDLY_URL);
  url.searchParams.set("utm_source", source);
  if (content) {
    url.searchParams.set("utm_content", content);
  }
  if (preferredDate) {
    // Calendly accepte une date d'atterrissage via le paramètre `date`.
    url.searchParams.set("date", preferredDate);
  }
  return url.toString();
}
