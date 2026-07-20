// Génère une invitation iCalendar (VEVENT, METHOD:REQUEST) jointe aux emails de
// confirmation. Le client l'ajoute à son agenda ; Aïssa reçoit la même. Aucun
// accès Google API requis — c'est le pattern « email a calendar invite ».

import { MEETING_TYPE_LABELS, type MeetingType } from "./types";

function escapeICS(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Format iCal UTC : 20260721T080000Z. */
function toICSDateUTC(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

/** Repli de ligne à 75 octets (RFC 5545) — prudence pour les longues DESCRIPTION. */
function foldLine(line: string): string {
  if (line.length <= 74) return line;
  const chunks: string[] = [];
  let rest = line;
  chunks.push(rest.slice(0, 74));
  rest = rest.slice(74);
  while (rest.length > 73) {
    chunks.push(" " + rest.slice(0, 73));
    rest = rest.slice(73);
  }
  if (rest.length) chunks.push(" " + rest);
  return chunks.join("\r\n");
}

export type BookingIcsInput = {
  uid: string;
  startIso: string;
  endIso: string;
  meetingType: MeetingType;
  meetingDetail: string | null;
  organizerEmail: string;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
  summary: string;
  description: string;
};

export function buildBookingIcs(input: BookingIcsInput): string {
  const now = new Date().toISOString();
  const location =
    input.meetingDetail?.trim() ||
    MEETING_TYPE_LABELS[input.meetingType];

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aissa Events//Reservation//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${input.uid}`,
    `DTSTAMP:${toICSDateUTC(now)}`,
    `DTSTART:${toICSDateUTC(input.startIso)}`,
    `DTEND:${toICSDateUTC(input.endIso)}`,
    `SUMMARY:${escapeICS(input.summary)}`,
    `DESCRIPTION:${escapeICS(input.description)}`,
    `LOCATION:${escapeICS(location)}`,
    `ORGANIZER;CN=${escapeICS(input.organizerName)}:mailto:${input.organizerEmail}`,
    `ATTENDEE;CN=${escapeICS(input.attendeeName)};RSVP=TRUE:mailto:${input.attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n");
}
