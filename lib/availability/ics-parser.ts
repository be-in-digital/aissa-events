import type { BusyKind, BusyRange, BusyStatus } from "@/lib/availability";

export type ParsedEvent = {
  uid: string;
  start: string;
  end: string;
  summary: string;
  created?: string;
};

type ParseOptions = {
  /** Durée par défaut d'une option en jours, si le titre ne précise pas de butoir. */
  defaultOptionDurationDays: number;
  /** Ignorer les events de plus de N jours avant aujourd'hui. */
  pastWindowDays?: number;
  /** Ignorer les events de plus de N jours dans le futur. */
  futureWindowDays?: number;
};

/**
 * Parseur ICS minimaliste, taillé pour les flux Google Calendar publics
 * (URL secrète au format iCal) du cas d'usage "Aïssa Events — Bookings".
 *
 * Compromis assumés :
 *  - Pas de support RRULE complet. Les events récurrents lèvent un avertissement
 *    mais sont ignorés. Les bookings sont mono-occurrence par nature.
 *  - Pas de TIMEZONE walker : si DTSTART n'est pas en UTC (Z), on parse en
 *    heure locale Europe/Paris (cohérent avec le contexte produit). Cela suffit
 *    car la granularité d'affichage côté site = jour entier.
 *  - VALARM, VTODO, VFREEBUSY ignorés.
 *
 * Si un jour la complexité dépasse ces hypothèses, swap par `node-ical`.
 */
export function parseICS(content: string): {
  events: ParsedEvent[];
  warnings: string[];
} {
  const unfolded = unfoldLines(content);
  const events: ParsedEvent[] = [];
  const warnings: string[] = [];

  let current: Partial<ParsedEvent> | null = null;
  let skip = false;
  let inEvent = false;

  for (const raw of unfolded) {
    const line = raw.trim();
    if (!line) continue;

    if (line === "BEGIN:VEVENT") {
      current = {};
      skip = false;
      inEvent = true;
      continue;
    }
    if (line === "END:VEVENT") {
      if (!skip && current?.uid && current.start && current.end) {
        events.push({
          uid: current.uid,
          start: current.start,
          end: current.end,
          summary: current.summary ?? "",
          created: current.created,
        });
      }
      current = null;
      inEvent = false;
      continue;
    }
    if (!inEvent || !current) continue;

    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const left = line.slice(0, colon);
    const value = line.slice(colon + 1);
    const [name, ...params] = left.split(";");

    switch (name.toUpperCase()) {
      case "UID":
        current.uid = value;
        break;
      case "SUMMARY":
        current.summary = unescapeText(value);
        break;
      case "CREATED":
      case "DTSTAMP":
        if (!current.created) current.created = parseICSDate(value, params);
        break;
      case "DTSTART":
        current.start = parseICSDate(value, params);
        break;
      case "DTEND":
        current.end = parseICSDate(value, params);
        break;
      case "RRULE":
        warnings.push(
          `Event ${current.uid ?? "(sans UID)"} contient une règle de récurrence (RRULE) — ignoré dans le parseur MVP.`,
        );
        skip = true;
        break;
      case "STATUS":
        if (value.toUpperCase() === "CANCELLED") skip = true;
        break;
    }
  }

  return { events, warnings };
}

/**
 * Transforme les events parsés en plages occupées (BusyRange), avec détection
 * du préfixe `[option]` / `[option:YYYY-MM-DD]` dans le titre.
 */
export function toBusyRanges(
  events: ParsedEvent[],
  opts: ParseOptions,
): BusyRange[] {
  const {
    defaultOptionDurationDays,
    pastWindowDays = 7,
    futureWindowDays = 730,
  } = opts;

  const now = Date.now();
  const pastCutoff = now - pastWindowDays * 86400000;
  const futureCutoff = now + futureWindowDays * 86400000;

  const ranges: BusyRange[] = [];

  for (const ev of events) {
    const startMs = new Date(ev.start).getTime();
    const endMs = new Date(ev.end).getTime();
    if (!Number.isFinite(startMs) || !Number.isFinite(endMs)) continue;
    if (endMs <= pastCutoff) continue;
    if (startMs >= futureCutoff) continue;

    const parsed = parseSummary(ev.summary, ev.created, {
      defaultOptionDurationDays,
    });

    ranges.push({
      uid: ev.uid,
      start: ev.start,
      end: ev.end,
      status: parsed.status,
      kind: parsed.kind,
      optionExpiresAt: parsed.optionExpiresAt ?? null,
    });
  }

  return ranges;
}

const OPTION_RE = /^\s*\[option(?::(\d{4}-\d{2}-\d{2}))?\]\s*/i;
const KIND_TAGS: Record<string, BusyKind> = {
  mariage: "mariage",
  wedding: "mariage",
  pro: "pro",
  corp: "pro",
  salle: "salle",
  venue: "salle",
  perso: "perso",
  prive: "perso",
};

function parseSummary(
  summary: string,
  createdIso: string | undefined,
  opts: { defaultOptionDurationDays: number },
): { status: BusyStatus; kind: BusyKind; optionExpiresAt: string | null } {
  let status: BusyStatus = "booked";
  let optionExpiresAt: string | null = null;

  const optionMatch = OPTION_RE.exec(summary);
  if (optionMatch) {
    status = "option";
    if (optionMatch[1]) {
      const d = new Date(`${optionMatch[1]}T23:59:59Z`);
      if (!Number.isNaN(d.getTime())) optionExpiresAt = d.toISOString();
    } else {
      const base = createdIso ? new Date(createdIso).getTime() : Date.now();
      optionExpiresAt = new Date(
        base + opts.defaultOptionDurationDays * 86400000,
      ).toISOString();
    }
  }

  // Détecte un tag de type dans le titre, par convention `[mariage]`, `[pro]`, etc.
  // Recherche après le préfixe option éventuel.
  const stripped = summary.replace(OPTION_RE, "");
  const kindMatch = /\[([a-z]+)\]/i.exec(stripped);
  let kind: BusyKind = "unknown";
  if (kindMatch) {
    const tag = kindMatch[1].toLowerCase();
    if (KIND_TAGS[tag]) kind = KIND_TAGS[tag];
  }

  return { status, kind, optionExpiresAt };
}

function unfoldLines(input: string): string[] {
  const raw = input.split(/\r?\n/);
  const out: string[] = [];
  for (const line of raw) {
    if (line.startsWith(" ") || line.startsWith("\t")) {
      if (out.length === 0) continue;
      out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

function unescapeText(value: string): string {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

/**
 * Parse une valeur date ICS en ISO string.
 *
 * Formats acceptés :
 *  - `YYYYMMDDTHHMMSSZ` → ISO UTC direct
 *  - `YYYYMMDDTHHMMSS` (avec TZID en paramètre) → interprété en heure locale
 *    sans tentative de conversion ; pour les bookings (granularité jour),
 *    c'est acceptable.
 *  - `YYYYMMDD` (avec VALUE=DATE) → minuit local
 */
function parseICSDate(value: string, params: string[]): string {
  const isDateOnly = params.some((p) => /^VALUE=DATE$/i.test(p));
  if (isDateOnly && /^\d{8}$/.test(value)) {
    const y = value.slice(0, 4);
    const m = value.slice(4, 6);
    const d = value.slice(6, 8);
    return `${y}-${m}-${d}T00:00:00.000Z`;
  }
  const utc = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(value);
  if (utc) {
    return `${utc[1]}-${utc[2]}-${utc[3]}T${utc[4]}:${utc[5]}:${utc[6]}.000Z`;
  }
  const local = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})$/.exec(value);
  if (local) {
    // On considère l'event en heure de Paris : ajout naïf de l'offset été (+02:00).
    // La granularité d'affichage = jour, donc une dérive d'1 h sur les bornes
    // n'a pas d'impact visible côté visiteur.
    return `${local[1]}-${local[2]}-${local[3]}T${local[4]}:${local[5]}:${local[6]}+02:00`;
  }
  // Fallback : laisser Date essayer
  const fallback = new Date(value);
  if (!Number.isNaN(fallback.getTime())) return fallback.toISOString();
  return value;
}
