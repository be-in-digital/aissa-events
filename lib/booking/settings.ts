import "server-only";
import { sanityClient } from "@/lib/sanity/client";
import {
  CHOOSER_DEFAULTS,
  DEFAULT_BOOKING_TYPE,
  type BookingType,
  type ChooserConfig,
  type MeetingType,
  type WeeklyHour,
} from "./types";

const TYPE_FIELDS = /* groq */ `
  "slug": slug.current,
  title,
  order,
  cardDescription,
  enabled,
  meetingType,
  meetingDetail,
  durationMinutes,
  bufferMinutes,
  minNoticeHours,
  horizonDays,
  timezone,
  "weeklyHours": coalesce(weeklyHours[]{ weekday, start, end }, []),
  useAvailabilityFeed,
  createHubspotContact,
  eyebrow,
  headline,
  description,
  consentLabel,
  confirmationTitle,
  confirmationBody
`;

const TYPES_QUERY = /* groq */ `
  *[_type == "bookingType" && enabled != false && defined(slug.current)]
    | order(order asc, title asc){ ${TYPE_FIELDS} }
`;

const TYPE_BY_SLUG_QUERY = /* groq */ `
  *[_type == "bookingType" && enabled != false && slug.current == $slug][0]{ ${TYPE_FIELDS} }
`;

const TYPE_COUNT_QUERY = /* groq */ `count(*[_type == "bookingType" && enabled != false && defined(slug.current)])`;

const CHOOSER_QUERY = /* groq */ `
  *[_type == "bookingSettings"][0]{ enabled, chooserEyebrow, chooserTitle, chooserDescription }
`;

type RawType = Partial<Record<keyof BookingType, unknown>> & {
  weeklyHours?: WeeklyHour[];
};

function sanitizeWeeklyHours(raw: WeeklyHour[] | undefined): WeeklyHour[] {
  if (!raw || raw.length === 0) return DEFAULT_BOOKING_TYPE.weeklyHours;
  const clean = raw.filter(
    (w) =>
      typeof w?.weekday === "number" &&
      w.weekday >= 1 &&
      w.weekday <= 7 &&
      typeof w.start === "string" &&
      typeof w.end === "string",
  );
  return clean.length > 0 ? clean : DEFAULT_BOOKING_TYPE.weeklyHours;
}

function mapType(raw: RawType): BookingType {
  const d = DEFAULT_BOOKING_TYPE;
  const s = <T>(v: unknown, fallback: T): T =>
    v === undefined || v === null ? fallback : (v as T);
  return {
    slug: s(raw.slug, d.slug),
    title: s(raw.title, d.title),
    order: s(raw.order, d.order),
    cardDescription: s(raw.cardDescription, d.cardDescription),
    enabled: s(raw.enabled, d.enabled),
    meetingType: s(raw.meetingType as MeetingType, d.meetingType),
    meetingDetail: s(raw.meetingDetail, d.meetingDetail),
    durationMinutes: s(raw.durationMinutes, d.durationMinutes),
    bufferMinutes: s(raw.bufferMinutes, d.bufferMinutes),
    minNoticeHours: s(raw.minNoticeHours, d.minNoticeHours),
    horizonDays: s(raw.horizonDays, d.horizonDays),
    timezone: s(raw.timezone, d.timezone),
    weeklyHours: sanitizeWeeklyHours(raw.weeklyHours),
    useAvailabilityFeed: s(raw.useAvailabilityFeed, d.useAvailabilityFeed),
    createHubspotContact: s(raw.createHubspotContact, d.createHubspotContact),
    eyebrow: s(raw.eyebrow, d.eyebrow),
    headline: s(raw.headline, d.headline),
    description: s(raw.description, d.description),
    consentLabel: s(raw.consentLabel, d.consentLabel),
    confirmationTitle: s(raw.confirmationTitle, d.confirmationTitle),
    confirmationBody: s(raw.confirmationBody, d.confirmationBody),
  };
}

async function fetchNoStore<T>(query: string, params: Record<string, unknown> = {}) {
  return sanityClient.fetch<T>(query, params, { cache: "no-store" });
}

/** Tous les types actifs (ordonnés). Repli : [Appel découverte] si aucun. */
export async function getBookingTypes(): Promise<BookingType[]> {
  let raw: RawType[] | null = null;
  try {
    raw = await fetchNoStore<RawType[] | null>(TYPES_QUERY);
  } catch {
    raw = null;
  }
  if (!raw || raw.length === 0) return [DEFAULT_BOOKING_TYPE];
  return raw.map(mapType);
}

/**
 * Un type par slug. Repli sur « Appel découverte » si aucun type n'existe
 * encore en base. Renvoie `null` si le slug est inconnu ALORS que des types
 * existent (→ l'appelant retombe sur la page de choix).
 */
export async function getBookingType(slug: string): Promise<BookingType | null> {
  try {
    const raw = await fetchNoStore<RawType | null>(TYPE_BY_SLUG_QUERY, { slug });
    if (raw) return mapType(raw);
    const count = await fetchNoStore<number>(TYPE_COUNT_QUERY);
    if (!count || count === 0) return DEFAULT_BOOKING_TYPE;
    return null;
  } catch {
    return DEFAULT_BOOKING_TYPE;
  }
}

/** Config de la page de choix (singleton), fusionnée avec les défauts. */
export async function getChooserConfig(): Promise<ChooserConfig> {
  const d = CHOOSER_DEFAULTS;
  try {
    const raw = await fetchNoStore<{
      enabled?: boolean;
      chooserEyebrow?: string;
      chooserTitle?: string;
      chooserDescription?: string;
    } | null>(CHOOSER_QUERY);
    if (!raw) return d;
    return {
      enabled: raw.enabled ?? d.enabled,
      eyebrow: raw.chooserEyebrow ?? d.eyebrow,
      title: raw.chooserTitle ?? d.title,
      description: raw.chooserDescription ?? d.description,
    };
  } catch {
    return d;
  }
}
