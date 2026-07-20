// Helpers de fuseau horaire, sûrs côté client comme serveur, SANS dépendance
// externe (pas de luxon/date-fns dans ce projet). On s'appuie sur `Intl` pour
// gérer correctement l'heure d'été/hiver (DST) d'Europe/Paris.

/**
 * Décalage (ms) d'un fuseau à un instant donné, tel que :
 *   heure_locale = instant_utc + offset
 * Calculé en comparant le rendu `formatToParts` du fuseau au même instant lu
 * comme s'il était UTC.
 */
function tzOffsetMs(instantMs: number, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(new Date(instantMs));
  const map: Record<string, number> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = Number(p.value);
  }
  const asUtc = Date.UTC(
    map.year,
    map.month - 1,
    map.day,
    map.hour === 24 ? 0 : map.hour,
    map.minute,
    map.second,
  );
  return asUtc - instantMs;
}

/**
 * Convertit une heure murale locale (composants Y/M/D H:M dans `timeZone`) en
 * instant UTC (epoch ms). Double passe pour être robuste aux bascules DST.
 */
export function zonedWallTimeToUtcMs(
  year: number,
  month: number, // 1-12
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): number {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const offset1 = tzOffsetMs(guess, timeZone);
  const utc1 = guess - offset1;
  const offset2 = tzOffsetMs(utc1, timeZone);
  // Si les deux passes divergent (bascule DST), la seconde offset est la bonne.
  return guess - offset2;
}

/** "HH:mm" → { hour, minute }. Renvoie null si le format est invalide. */
export function parseHHmm(value: string): { hour: number; minute: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

/** Composants de la date civile (dans `timeZone`) d'un instant UTC. */
export function civilPartsInTz(
  instantMs: number,
  timeZone: string,
): { year: number; month: number; day: number } {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = dtf.formatToParts(new Date(instantMs));
  const map: Record<string, string> = {};
  for (const p of parts) if (p.type !== "literal") map[p.type] = p.value;
  return { year: Number(map.year), month: Number(map.month), day: Number(map.day) };
}

/** Jour ISO (1 = lundi … 7 = dimanche) d'une date civile Y/M/D. */
export function isoWeekday(year: number, month: number, day: number): number {
  const dow = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // 0=dim
  return ((dow + 6) % 7) + 1;
}

/** "YYYY-MM-DD" d'une date civile Y/M/D. */
export function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Libellé long fr-FR d'une date civile, ex. "samedi 12 juillet". */
export function formatCivilDateFR(
  year: number,
  month: number,
  day: number,
  timeZone: string,
): string {
  // Midi UTC → jamais de dérive de date lors du rendu dans le fuseau cible.
  const noonUtc = Date.UTC(year, month - 1, day, 12, 0, 0);
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(noonUtc));
}

/** Libellé heure locale "HH:mm" (dans `timeZone`) d'un instant UTC. */
export function formatTimeInTz(instantMs: number, timeZone: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(instantMs));
}

/** Libellé humain complet fr-FR, ex. "samedi 12 juillet 2026 à 10:00". */
export function formatDateTimeFR(instantMs: number, timeZone: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(instantMs));
}
