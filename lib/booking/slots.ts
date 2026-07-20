// Génération pure des créneaux réservables. Aucune I/O : prend les réglages +
// les plages occupées + l'instant courant, renvoie les jours/créneaux libres.
// Sûr côté client ET serveur.

import type {
  BookingDay,
  BookingType,
  BookingSlot,
  BusyInterval,
} from "./types";
import {
  civilPartsInTz,
  formatCivilDateFR,
  formatTimeInTz,
  isoWeekday,
  parseHHmm,
  toDateKey,
  zonedWallTimeToUtcMs,
} from "./time";

const MINUTE = 60_000;

function overlapsBusy(startMs: number, endMs: number, busy: BusyInterval[]): boolean {
  for (const b of busy) {
    if (startMs < b.endMs && endMs > b.startMs) return true;
  }
  return false;
}

/**
 * Construit la liste des jours réservables sur l'horizon configuré.
 *
 * Règles :
 *  - un créneau doit démarrer après `now + minNoticeHours` (délai mini) ;
 *  - il doit finir avant `now + horizonDays` ;
 *  - il ne doit chevaucher aucune plage occupée (`busy`) ;
 *  - les jours sans créneau libre sont omis.
 *
 * Toute l'arithmétique horaire passe par les helpers Europe/Paris DST-corrects.
 */
export function generateBookingDays(params: {
  settings: BookingType;
  busy: BusyInterval[];
  nowMs: number;
}): BookingDay[] {
  const { settings, busy, nowMs } = params;
  const { timezone, durationMinutes, bufferMinutes, minNoticeHours, horizonDays } =
    settings;

  const step = (durationMinutes + Math.max(0, bufferMinutes)) * MINUTE;
  const duration = durationMinutes * MINUTE;
  const earliest = nowMs + minNoticeHours * 60 * MINUTE;
  const horizonEnd = nowMs + horizonDays * 24 * 60 * MINUTE;

  // Regroupe les règles d'ouverture par jour ISO (1-7).
  const rulesByWeekday = new Map<number, { startMin: number; endMin: number }[]>();
  for (const wh of settings.weeklyHours) {
    const s = parseHHmm(wh.start);
    const e = parseHHmm(wh.end);
    if (!s || !e) continue;
    const startMin = s.hour * 60 + s.minute;
    const endMin = e.hour * 60 + e.minute;
    if (endMin <= startMin) continue;
    const list = rulesByWeekday.get(wh.weekday) ?? [];
    list.push({ startMin, endMin });
    rulesByWeekday.set(wh.weekday, list);
  }
  if (rulesByWeekday.size === 0) return [];

  // Point de départ : date civile Paris de `now`.
  const today = civilPartsInTz(nowMs, timezone);
  const days: BookingDay[] = [];

  // On itère les dates civiles via une ancre UTC (progression de jour fiable).
  const anchor = new Date(Date.UTC(today.year, today.month - 1, today.day));

  for (let d = 0; d <= horizonDays; d++) {
    const year = anchor.getUTCFullYear();
    const month = anchor.getUTCMonth() + 1;
    const day = anchor.getUTCDate();
    anchor.setUTCDate(anchor.getUTCDate() + 1); // avance pour la prochaine itération

    const weekday = isoWeekday(year, month, day);
    const rules = rulesByWeekday.get(weekday);
    if (!rules) continue;

    const slots: BookingSlot[] = [];
    for (const rule of rules) {
      for (let m = rule.startMin; m + durationMinutes <= rule.endMin; m += step / MINUTE) {
        const hour = Math.floor(m / 60);
        const minute = m % 60;
        const startMs = zonedWallTimeToUtcMs(year, month, day, hour, minute, timezone);
        const endMs = startMs + duration;

        if (startMs < earliest) continue;
        if (endMs > horizonEnd) continue;
        if (overlapsBusy(startMs, endMs, busy)) continue;

        slots.push({
          startIso: new Date(startMs).toISOString(),
          endIso: new Date(endMs).toISOString(),
          timeLabel: formatTimeInTz(startMs, timezone),
        });
      }
    }

    if (slots.length > 0) {
      slots.sort((a, b) => a.startIso.localeCompare(b.startIso));
      days.push({
        date: toDateKey(year, month, day),
        label: formatCivilDateFR(year, month, day, timezone),
        slots,
      });
    }
  }

  return days;
}

/**
 * Vérifie qu'un créneau candidat (identifié par son ISO de début) est toujours
 * réservable au regard des réglages + plages occupées. Utilisé côté serveur au
 * moment du POST pour re-valider avant écriture (anti double-booking / slot périmé).
 */
export function isSlotBookable(params: {
  settings: BookingType;
  busy: BusyInterval[];
  nowMs: number;
  startIso: string;
}): boolean {
  const { startIso } = params;
  const target = Date.parse(startIso);
  if (!Number.isFinite(target)) return false;
  const days = generateBookingDays(params);
  for (const day of days) {
    for (const slot of day.slots) {
      if (Date.parse(slot.startIso) === target) return true;
    }
  }
  return false;
}
