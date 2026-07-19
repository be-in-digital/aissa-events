import { z } from "zod";

/**
 * Schéma de validation du formulaire de qualification B2B (page Entreprises).
 *
 * Utilisé côté serveur (Server Action) ET côté client (affichage des erreurs).
 * Le champ `website` est un honeypot anti-bot : il doit RESTER vide.
 *
 * Champs obligatoires (directives cliente) : coordonnées (entreprise, contact,
 * email, téléphone), type d'événement, effectif, période et budget.
 */
const optionalString = (max: number) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const BusinessLeadSchema = z.object({
  // — Coordonnées (obligatoires) —
  company: z.string().trim().min(1, "Nom de l'entreprise requis").max(120, "Trop long"),
  sector: optionalString(120),
  contactName: z.string().trim().min(1, "Nom du contact requis").max(120, "Trop long"),
  role: optionalString(120),
  email: z
    .string()
    .trim()
    .min(1, "Email requis")
    .max(160, "Email trop long")
    .email("Email invalide"),
  phone: z.string().trim().min(1, "Téléphone requis").max(40, "Numéro trop long"),

  // — Événement (type / effectif / période obligatoires) —
  eventType: z.string().trim().min(1, "Type d'événement requis").max(120),
  headcount: z.string().trim().min(1, "Nombre de participants requis").max(60),
  period: z.string().trim().min(1, "Date ou période requise").max(120),
  location: optionalString(160),
  schedule: optionalString(160),

  // — Prestations (multi-choix, optionnel) —
  services: z.array(z.string().trim().max(80)).max(30).optional(),

  // — Budget (obligatoire) —
  budget: z.string().trim().min(1, "Budget prévisionnel requis").max(120),

  // — Contexte (optionnel) —
  objective: optionalString(2000),
  notes: optionalString(4000),

  // — Pack d'origine (rempli automatiquement quand on vient d'une carte pack) —
  pack: optionalString(120),

  // — Consentement RGPD (obligatoire) —
  consent: z
    .union([z.literal("on"), z.literal("true"), z.literal(true)], {
      message: "Vous devez accepter la politique de confidentialité",
    })
    .transform(() => true),

  // — Honeypot — doit rester vide —
  website: z.string().max(0, "Bot détecté").optional().or(z.literal("")),
});

export type BusinessLeadData = z.infer<typeof BusinessLeadSchema>;

/** Erreurs sérialisées `{ champ: ["message1", …] }`. */
export type BusinessLeadErrors = Partial<Record<keyof BusinessLeadData, string[]>>;
