import "server-only";

import { sanityClient } from "@/lib/sanity/client";

/**
 * Charge la configuration de l'assistante depuis Sanity, avec fallback
 * sur des valeurs par défaut si le singleton n'existe pas encore.
 *
 * Cache in-process 30 s pour éviter d'inonder Sanity en cas de burst de
 * messages entrants. Une publication Sanity met donc max 30 s à propager.
 */

export interface FaqEntry {
  question: string;
  reponse: string;
}

export interface PriceRange {
  label: string;
  prixMin: number;
  categorie?: "mariage" | "evenement" | "salle";
}

export interface AgentSettings {
  // Connexion (gérée séparément côté token-store)
  // Persona
  personaName: string;
  personaTone: "chaleureux" | "professionnel" | "decontracte";
  personaIntroLine?: string;

  // Messages-clés
  messageAccueil: string;
  messageRelanceSlaDepasse: string;
  messageFinDeConversation: string;
  messagePauseActivee: string;

  // Comportement
  faqPrioritaires: FaqEntry[];
  triggersHandover: string[];
  motsInterdits: string[];
  instructionsLibres: string;

  // Tarifs publics
  fourchettesPublic: PriceRange[];

  // SLA
  slaHeuresOuvreesMinutes: number;
  slaHorsHeuresHours: number;

  // Kill switch
  pauseAgent: boolean;
  pauseAgentUntil: string | null;
}

const DEFAULTS: AgentSettings = {
  personaName: "Ayo",
  personaTone: "chaleureux",
  personaIntroLine: undefined,

  messageAccueil:
    "Bonjour 🌿 Félicitations pour votre projet ! Je suis {personaName}, l'assistante d'{nomAgence} — je l'aide à recevoir vos demandes pour qu'elle puisse vous accompagner personnellement. Pour commencer, dites-moi tout sur votre projet ? Vos données restent confidentielles (aissaevents.com/politique-confidentialite).",
  messageRelanceSlaDepasse:
    "Bonjour, c'est {personaName}, l'assistante d'{nomAgence}. Je voulais vous confirmer qu'Aïssa a bien reçu votre message — elle revient vers vous dès qu'elle est disponible. Merci pour votre patience !",
  messageFinDeConversation:
    "Parfait, je transmets votre demande à Aïssa qui prendra le relais personnellement. Elle revient vers vous très rapidement.",
  messagePauseActivee:
    "Bonjour, votre message a bien été reçu. Aïssa revient vers vous personnellement très rapidement.",

  faqPrioritaires: [],
  triggersHandover: ["devis", "négocier", "rabais", "parler à Aïssa", "rendez-vous"],
  motsInterdits: ["tarif définitif", "réservation confirmée", "remise garantie", "date bloquée"],
  instructionsLibres: "",

  fourchettesPublic: [],

  slaHeuresOuvreesMinutes: 30,
  slaHorsHeuresHours: 12,

  pauseAgent: false,
  pauseAgentUntil: null,
};

const QUERY = `*[_type == "agentSettings"][0]{
  personaName,
  personaTone,
  personaIntroLine,
  messageAccueil,
  messageRelanceSlaDepasse,
  messageFinDeConversation,
  messagePauseActivee,
  faqPrioritaires[]{question, reponse},
  triggersHandover,
  motsInterdits,
  instructionsLibres,
  fourchettesPublic[]{label, prixMin, categorie},
  slaHeuresOuvreesMinutes,
  slaHorsHeuresHours,
  pauseAgent,
  pauseAgentUntil
}`;

type SanityPayload = Partial<AgentSettings>;

let cache: { value: AgentSettings; expiresAt: number } | null = null;
const TTL_MS = 30_000;

function merge(defaults: AgentSettings, fetched: SanityPayload | null): AgentSettings {
  if (!fetched) return defaults;
  return {
    ...defaults,
    ...Object.fromEntries(
      Object.entries(fetched).filter(([, v]) => v !== null && v !== undefined),
    ),
  } as AgentSettings;
}

export async function loadAgentSettings(): Promise<AgentSettings> {
  if (cache && cache.expiresAt > Date.now()) return cache.value;

  try {
    const data = await sanityClient.fetch<SanityPayload | null>(QUERY);
    const merged = merge(DEFAULTS, data);
    cache = { value: merged, expiresAt: Date.now() + TTL_MS };
    return merged;
  } catch (err) {
    console.error("[agent-settings] échec chargement Sanity :", err);
    return DEFAULTS;
  }
}

/** Force le rechargement (utile après publication Sanity ou tests). */
export function clearAgentSettingsCache(): void {
  cache = null;
}

/**
 * Détermine si l'agent est effectivement en pause, en tenant compte de
 * `pauseAgentUntil` (date d'expiration). Si l'expiration est passée,
 * la pause est considérée comme levée.
 */
export function isAgentPaused(settings: AgentSettings): boolean {
  if (!settings.pauseAgent) return false;
  if (!settings.pauseAgentUntil) return true;
  return new Date(settings.pauseAgentUntil) > new Date();
}

export function interpolateMessage(
  template: string,
  vars: { personaName: string; nomAgence?: string },
): string {
  return template
    .replace(/\{personaName\}/g, vars.personaName)
    .replace(/\{nomAgence\}/g, vars.nomAgence ?? "Aïssa Events");
}
