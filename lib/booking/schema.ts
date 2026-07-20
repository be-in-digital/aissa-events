// Schéma de validation de la soumission de réservation (POST /api/booking).
// Sûr côté client comme serveur (utilisé par les deux pour un feedback cohérent).

import { z } from "zod";

export const BookingSubmitSchema = z.object({
  /** Slug du type de rendez-vous (ex. "appel", "visite"). */
  type: z.string().trim().min(1, "Type de rendez-vous manquant.").max(80),
  name: z
    .string()
    .trim()
    .min(2, "Merci d'indiquer votre nom.")
    .max(80, "Nom trop long."),
  email: z.string().trim().email("Adresse email invalide."),
  phone: z
    .string()
    .trim()
    .min(6, "Numéro de téléphone requis.")
    .max(30, "Numéro trop long."),
  message: z.string().trim().max(1000, "Message trop long.").optional().default(""),
  /** ISO UTC du début du créneau choisi (ex. "2026-07-21T08:00:00.000Z"). */
  slotStart: z.string().datetime({ message: "Créneau invalide." }),
  consent: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .refine((v) => v === true || v === "on" || v === "true", {
      message: "Votre accord est nécessaire pour être recontacté(e).",
    }),
  /** Date d'événement qui intéresse le visiteur (YYYY-MM-DD), contexte optionnel. */
  preferredDate: z.string().trim().max(20).optional().default(""),
  source: z.string().trim().max(60).optional().default(""),
  content: z.string().trim().max(120).optional().default(""),
  /** Honeypot anti-bot — doit rester vide. */
  website: z.string().max(0).optional().default(""),
});

export type BookingSubmitInput = z.infer<typeof BookingSubmitSchema>;

export type BookingFieldErrors = Partial<
  Record<keyof BookingSubmitInput, string[]>
>;
