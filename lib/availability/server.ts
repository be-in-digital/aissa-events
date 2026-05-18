import "server-only";
import { sanityFetch } from "@/lib/sanity/fetch";
import {
  AVAILABILITY_DEFAULTS,
  countFreeDates,
  type AvailabilityData,
} from "@/lib/availability";

const availabilityQuery = /* groq */ `
  *[_type == "availability"][0]{
    enabled,
    feedUrl,
    monthsAhead,
    defaultOptionDurationDays,
    fallbackRemainingDates,
    fallbackYear,
    lastSyncedAt,
    lastSyncStatus,
    "busyRanges": coalesce(busyRanges[]{
      uid,
      start,
      end,
      status,
      kind,
      optionExpiresAt
    }, [])
  }
`;

export async function getAvailabilityData(): Promise<AvailabilityData> {
  const raw = await sanityFetch<Partial<AvailabilityData> | null>({
    query: availabilityQuery,
    tags: ["availability"],
  });
  if (!raw) return AVAILABILITY_DEFAULTS;
  return {
    enabled: raw.enabled ?? AVAILABILITY_DEFAULTS.enabled,
    feedUrl: raw.feedUrl ?? AVAILABILITY_DEFAULTS.feedUrl,
    monthsAhead: raw.monthsAhead ?? AVAILABILITY_DEFAULTS.monthsAhead,
    defaultOptionDurationDays:
      raw.defaultOptionDurationDays ??
      AVAILABILITY_DEFAULTS.defaultOptionDurationDays,
    fallbackRemainingDates:
      raw.fallbackRemainingDates ??
      AVAILABILITY_DEFAULTS.fallbackRemainingDates,
    fallbackYear: raw.fallbackYear ?? AVAILABILITY_DEFAULTS.fallbackYear,
    lastSyncedAt: raw.lastSyncedAt ?? null,
    lastSyncStatus: raw.lastSyncStatus ?? AVAILABILITY_DEFAULTS.lastSyncStatus,
    busyRanges: raw.busyRanges ?? [],
  };
}

/**
 * Ligne dynamique « X dates encore libres en YYYY ». Si le calendrier est
 * désactivé ou que la synchro n'a rien renvoyé, retombe sur les valeurs
 * `fallbackRemainingDates` / `fallbackYear` éditables côté Studio.
 */
export async function availabilityLine(): Promise<string> {
  const data = await getAvailabilityData();
  if (data.enabled && data.busyRanges.length > 0) {
    const year = data.fallbackYear;
    const count = countFreeDates(data, { untilYear: year });
    return `${count} dates encore libres en ${year}`;
  }
  return `${data.fallbackRemainingDates} dates encore libres en ${data.fallbackYear}`;
}
