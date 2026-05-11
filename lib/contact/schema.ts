import { z } from "zod";

/**
 * Schema de validation du formulaire de contact.
 * Utilisé côté serveur (Server Action) ET côté client (affichage des erreurs).
 *
 * Le champ `website` est un honeypot anti-bot : il doit RESTER vide.
 * Les bots remplissent tous les champs, on les détecte comme ça.
 */
export const ContactFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Prénom requis")
    .max(80, "Prénom trop long"),
  lastName: z
    .string()
    .trim()
    .min(1, "Nom requis")
    .max(80, "Nom trop long"),
  email: z
    .string()
    .trim()
    .min(1, "Email requis")
    .max(160, "Email trop long")
    .email("Email invalide"),
  phone: z
    .string()
    .trim()
    .max(40, "Téléphone trop long")
    .optional()
    .or(z.literal("")),
  eventType: z
    .string()
    .trim()
    .min(1, "Type d'événement requis")
    .max(120),
  eventDate: z
    .string()
    .trim()
    .max(80, "Date trop longue")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Message trop court (10 caractères minimum)")
    .max(5000, "Message trop long (5000 caractères maximum)"),
  consent: z
    .union([z.literal("on"), z.literal("true"), z.literal(true)], {
      message: "Vous devez accepter la politique de confidentialité",
    })
    .transform(() => true),
  // Honeypot — doit rester vide
  website: z
    .string()
    .max(0, "Bot détecté")
    .optional()
    .or(z.literal("")),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

/**
 * Sérialise les erreurs Zod en `{ champ: ["message1", "message2"] }`.
 */
export type ContactFormErrors = Partial<Record<keyof ContactFormData, string[]>>;
