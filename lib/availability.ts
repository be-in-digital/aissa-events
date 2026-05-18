// Module sûr côté client : pas d'import de Sanity ou de "use cache".
// Pour les fetchers serveur (Sanity), utiliser `lib/availability/server.ts`.

export type BusyStatus = "booked" | "option";
export type BusyKind = "mariage" | "pro" | "salle" | "perso" | "unknown";

export type BusyRange = {
  uid?: string;
  start: string;
  end: string;
  status: BusyStatus;
  kind?: BusyKind;
  optionExpiresAt?: string | null;
};

export type AvailabilityData = {
  enabled: boolean;
  feedUrl?: string | null;
  monthsAhead: number;
  defaultOptionDurationDays: number;
  fallbackRemainingDates: number;
  fallbackYear: number;
  lastSyncedAt?: string | null;
  lastSyncStatus?: "ok" | "error" | "never";
  busyRanges: BusyRange[];
};

export type DayStatus = "free" | "option" | "booked" | "past";

export const AVAILABILITY_DEFAULTS: AvailabilityData = {
  enabled: true,
  feedUrl: null,
  monthsAhead: 3,
  defaultOptionDurationDays: 14,
  fallbackRemainingDates: 12,
  fallbackYear: 2026,
  lastSyncedAt: null,
  lastSyncStatus: "never",
  busyRanges: [],
};

/**
 * Statut d'une journée donnée (résolution = jour entier).
 *
 * Un event qui couvre n'importe quelle partie de la journée la marque comme
 * occupée. Le statut « booked » prime sur « option » en cas de chevauchement.
 */
export function getStatusForDate(
  data: AvailabilityData,
  date: Date,
): DayStatus {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  if (startOfDay.getTime() < new Date().setHours(0, 0, 0, 0)) {
    return "past";
  }

  if (data.enabled === false || data.busyRanges.length === 0) {
    return "free";
  }

  let result: DayStatus = "free";
  for (const range of data.busyRanges) {
    const rangeStart = new Date(range.start).getTime();
    const rangeEnd = new Date(range.end).getTime();
    if (rangeEnd <= startOfDay.getTime()) continue;
    if (rangeStart > endOfDay.getTime()) continue;

    if (range.status === "option") {
      if (
        range.optionExpiresAt &&
        new Date(range.optionExpiresAt).getTime() < Date.now()
      ) {
        continue;
      }
      if (result === "free") result = "option";
    } else {
      result = "booked";
      break;
    }
  }
  return result;
}

export function getNextFreeDates(
  data: AvailabilityData,
  options: {
    count?: number;
    dayOfWeek?: number;
    horizonMonths?: number;
    from?: Date;
  } = {},
): Date[] {
  const { count = 3, dayOfWeek = 6, horizonMonths = 12, from = new Date() } =
    options;

  const result: Date[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  do {
    cursor.setDate(cursor.getDate() + 1);
  } while (cursor.getDay() !== dayOfWeek);

  const horizon = new Date(from);
  horizon.setMonth(horizon.getMonth() + horizonMonths);

  while (result.length < count && cursor.getTime() < horizon.getTime()) {
    if (getStatusForDate(data, cursor) === "free") {
      result.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 7);
  }

  return result;
}

export function countFreeDates(
  data: AvailabilityData,
  options: {
    dayOfWeek?: number;
    untilYear?: number;
    from?: Date;
  } = {},
): number {
  const { dayOfWeek = 6, untilYear, from = new Date() } = options;
  const end = untilYear
    ? new Date(untilYear, 11, 31)
    : new Date(from.getFullYear(), 11, 31);

  let count = 0;
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  while (cursor.getTime() <= end.getTime()) {
    if (
      cursor.getDay() === dayOfWeek &&
      getStatusForDate(data, cursor) === "free"
    ) {
      count++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

/**
 * Repli statique : ne touche pas Sanity, utilisable depuis n'importe quel
 * composant (incluant `'use client'`). Pour la version dynamique branchée sur
 * Sanity, utiliser `availabilityLine()` depuis `lib/availability/server.ts`.
 */
export function availabilityLineSync(
  fallback: { remainingDates: number; year: number } = {
    remainingDates: 12,
    year: 2026,
  },
): string {
  return `${fallback.remainingDates} dates encore libres en ${fallback.year}`;
}

export const AVAILABILITY = {
  year: 2026,
  remainingDates: 12,
} as const;
