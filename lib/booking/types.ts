// Module sûr côté client : types + constantes partagés entre l'UI (modale /
// page de réservation) et les fetchers serveur. Pas d'import Sanity / server-only.

export type MeetingType = "phone" | "video" | "inperson";

/** Une plage d'ouverture hebdomadaire (heure locale du type). */
export type WeeklyHour = {
  /** Jour ISO : 1 = lundi … 7 = dimanche. */
  weekday: number;
  /** Heure de début "HH:mm". */
  start: string;
  /** Heure de fin "HH:mm". */
  end: string;
};

/**
 * Un TYPE de rendez-vous, autonome et éditable dans Sanity (collection
 * `bookingType`). Ex. « Appel découverte », « Visite de l'Espace Events ».
 * Chaque type a ses propres horaires, format, durée et textes.
 */
export type BookingType = {
  slug: string;
  /** Nom du type, ex. « Appel découverte ». Affiché sur la page de choix. */
  title: string;
  order: number;
  /** Description courte pour la carte de la page de choix. */
  cardDescription: string;
  enabled: boolean;
  meetingType: MeetingType;
  /** Détail selon le format : n° de tél, lien visio ou adresse. Optionnel. */
  meetingDetail: string | null;
  durationMinutes: number;
  bufferMinutes: number;
  minNoticeHours: number;
  horizonDays: number;
  timezone: string;
  weeklyHours: WeeklyHour[];
  useAvailabilityFeed: boolean;
  createHubspotContact: boolean;
  // Copy du flux de ce type
  eyebrow: string;
  headline: string;
  description: string;
  consentLabel: string;
  confirmationTitle: string;
  confirmationBody: string;
};

/** Réglages globaux de la page de choix (singleton `bookingSettings`). */
export type ChooserConfig = {
  /** Kill switch global : coupe toute la réservation en ligne. */
  enabled: boolean;
  eyebrow: string;
  title: string;
  description: string;
};

/** Résumé d'un type pour la page/liste de choix. */
export type BookingTypeSummary = {
  slug: string;
  title: string;
  cardDescription: string;
  meetingType: MeetingType;
  durationMinutes: number;
};

/** Un intervalle occupé [startMs, endMs) en epoch ms UTC. */
export type BusyInterval = { startMs: number; endMs: number };

/** Un créneau réservable, instants UTC (ISO) + libellé local. */
export type BookingSlot = {
  startIso: string;
  endIso: string;
  timeLabel: string;
};

/** Un jour proposé à la réservation avec ses créneaux libres. */
export type BookingDay = {
  date: string;
  label: string;
  slots: BookingSlot[];
};

/** Réponse de `GET /api/booking/availability?type=<slug>`. */
export type AvailabilityResponse = {
  enabled: boolean;
  timezone: string;
  type: {
    slug: string;
    title: string;
    meetingType: MeetingType;
    durationMinutes: number;
  };
  copy: {
    eyebrow: string;
    headline: string;
    description: string;
    consentLabel: string;
    confirmationTitle: string;
    confirmationBody: string;
  };
  days: BookingDay[];
};

/** Réponse de `GET /api/booking/types`. */
export type BookingTypesResponse = {
  enabled: boolean;
  chooser: ChooserConfig;
  types: BookingTypeSummary[];
};

/**
 * Type par défaut utilisé quand aucune collection `bookingType` n'existe encore
 * (ex. avant que l'agence n'en crée dans le Studio). Garantit que la feature
 * marche « out of the box » avec « Appel découverte ».
 */
export const DEFAULT_BOOKING_TYPE: BookingType = {
  slug: "appel",
  title: "Appel découverte",
  order: 0,
  cardDescription: "Un premier échange de 15 min, par téléphone.",
  enabled: true,
  meetingType: "phone",
  meetingDetail: null,
  durationMinutes: 15,
  bufferMinutes: 15,
  minNoticeHours: 24,
  horizonDays: 30,
  timezone: "Europe/Paris",
  weeklyHours: [
    { weekday: 2, start: "10:00", end: "18:00" },
    { weekday: 3, start: "10:00", end: "18:00" },
    { weekday: 4, start: "10:00", end: "18:00" },
    { weekday: 5, start: "10:00", end: "18:00" },
    { weekday: 6, start: "10:00", end: "13:00" },
  ],
  useAvailabilityFeed: true,
  createHubspotContact: true,
  eyebrow: "Réserver un appel",
  headline: "15 minutes pour comprendre votre projet.",
  description:
    "Choisissez un créneau : Aïssa vous rappelle pour un premier échange, sans engagement.",
  consentLabel:
    "J'accepte d'être recontacté(e) par Aïssa Events au sujet de ma demande.",
  confirmationTitle: "C'est noté — votre rendez-vous est réservé.",
  confirmationBody:
    "Vous allez recevoir un email de confirmation avec l'invitation à ajouter à votre agenda.",
};

export const CHOOSER_DEFAULTS: ChooserConfig = {
  enabled: true,
  eyebrow: "Prendre rendez-vous",
  title: "Quel type de rendez-vous ?",
  description: "Choisissez le format qui vous convient — on s'occupe du reste.",
};

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  phone: "Appel téléphonique",
  video: "Visioconférence",
  inperson: "Rendez-vous sur place",
};
