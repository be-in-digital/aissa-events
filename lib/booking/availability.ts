import "server-only";
import { getBookingType, getBookingTypes, getChooserConfig } from "./settings";
import { getBusyIntervals } from "./busy";
import { generateBookingDays } from "./slots";
import type {
  AvailabilityResponse,
  BookingType,
  BookingTypesResponse,
  BusyInterval,
} from "./types";

/**
 * Type + plages occupées à un instant donné. Base commune de l'endpoint de
 * dispo (GET) et de la re-validation au moment de la réservation (POST).
 * `type` est null si le slug est inconnu.
 */
export async function getBookingContext(
  slug: string,
  nowMs: number,
): Promise<{
  type: BookingType | null;
  busy: BusyInterval[];
  globallyEnabled: boolean;
}> {
  const [chooser, type] = await Promise.all([
    getChooserConfig(),
    getBookingType(slug),
  ]);
  if (!type) return { type: null, busy: [], globallyEnabled: chooser.enabled };
  const busy = await getBusyIntervals(type, nowMs);
  return { type, busy, globallyEnabled: chooser.enabled };
}

/** Dispo complète d'un type pour l'UI. `null` si le slug est inconnu. */
export async function getBookingAvailability(
  slug: string,
  nowMs: number,
): Promise<AvailabilityResponse | null> {
  const { type, busy, globallyEnabled } = await getBookingContext(slug, nowMs);
  if (!type) return null;

  const enabled = globallyEnabled && type.enabled;
  const days = enabled ? generateBookingDays({ settings: type, busy, nowMs }) : [];

  return {
    enabled,
    timezone: type.timezone,
    type: {
      slug: type.slug,
      title: type.title,
      meetingType: type.meetingType,
      durationMinutes: type.durationMinutes,
    },
    copy: {
      eyebrow: type.eyebrow,
      headline: type.headline,
      description: type.description,
      consentLabel: type.consentLabel,
      confirmationTitle: type.confirmationTitle,
      confirmationBody: type.confirmationBody,
    },
    days,
  };
}

/** Liste des types actifs + copy de la page de choix. */
export async function getBookingTypesList(): Promise<BookingTypesResponse> {
  const [chooser, types] = await Promise.all([
    getChooserConfig(),
    getBookingTypes(),
  ]);
  return {
    enabled: chooser.enabled,
    chooser,
    types: types.map((t) => ({
      slug: t.slug,
      title: t.title,
      cardDescription: t.cardDescription,
      meetingType: t.meetingType,
      durationMinutes: t.durationMinutes,
    })),
  };
}
