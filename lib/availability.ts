export const AVAILABILITY = {
  year: 2026,
  remainingDates: 12,
} as const;

export function availabilityLine(): string {
  return `${AVAILABILITY.remainingDates} dates encore libres en ${AVAILABILITY.year}`;
}
