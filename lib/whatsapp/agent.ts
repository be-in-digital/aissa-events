import "server-only";

import { generateText, type ModelMessage } from "ai";

import { type AgentSettings, interpolateMessage } from "./agent-settings";
import type { HistoryEntry } from "./hubspot-history";
import { buildSystemPrompt } from "./prompt-builder";

/**
 * Détermine si un message utilisateur contient un mot-clé qui doit
 * déclencher un handover immédiat vers Aïssa (sans appel IA).
 *
 * Les triggers système (devis, prix, urgent…) sont fusionnés avec ceux
 * configurés dans Sanity par Aïssa.
 */
const SYSTEM_HANDOVER_TRIGGERS = [
  // Demandes commerciales engageantes — Aïssa doit valider
  "devis",
  "prix exact",
  "prix définitif",
  "tarif exact",
  "réserver",
  "réservation",
  "signer",
  // Urgences / litiges — réponse humaine obligatoire
  "urgent",
  "urgence",
  "plainte",
  "remboursement",
  "annuler",
  "litige",
  // Demandes explicites de parler à un humain
  "parler à aïssa",
  "parler a aissa",
  "parler à un humain",
  "parler a un humain",
  "parler à une personne",
  "parler a une personne",
  "vraie personne",
  "vrai humain",
  "passer à un humain",
  "un humain svp",
  "un humain s'il vous plaît",
  "pas un bot",
  "pas une ia",
];

function normalise(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectHandoverTrigger(
  userMessage: string,
  customTriggers: string[],
): string | null {
  const normalised = normalise(userMessage);
  const all = [...SYSTEM_HANDOVER_TRIGGERS, ...customTriggers.map(normalise)];
  for (const trigger of all) {
    if (!trigger) continue;
    if (normalised.includes(normalise(trigger))) return trigger;
  }
  return null;
}

/**
 * Détecte une intention d'opt-out RGPD (« stop », « arrêter », « ne plus »).
 * À utiliser AVANT tout appel IA. Si match, demander une confirmation explicite
 * plutôt que de purger directement.
 */
const OPTOUT_PATTERNS = [
  /\bstop\b/i,
  /\barr[ée]tez?\b/i,
  /\bne plus\b/i,
  /\beffacer?\b/i,
  /\bsupprimer?\b/i,
  /\bunsubscribe\b/i,
];

export function detectOptoutIntent(userMessage: string): boolean {
  return OPTOUT_PATTERNS.some((re) => re.test(userMessage));
}

export interface AgentReply {
  text: string;
  modelUsed: string;
  tokensUsage: { input: number; output: number } | null;
}

const DEFAULT_MODEL = "anthropic/claude-haiku-4-5";

/**
 * Génère une réponse de l'assistante via Vercel AI Gateway, avec mémoire
 * conversationnelle reconstruite depuis l'historique HubSpot.
 *
 * Le system prompt (règles non négociables + persona + FAQ + fourchettes prix
 * + instructions libres Aïssa) est marqué `cacheControl: 'ephemeral'` pour bénéficier
 * du prompt caching Anthropic (1h TTL) — coût quasi nul en cache hit.
 *
 * Limite : on garde max 20 derniers tours (40 messages) pour rester sous la
 * limite de contexte Haiku 4.5 et éviter une explosion de tokens. La compression
 * par résumé sera l'objet d'une étape ultérieure.
 */
const MAX_HISTORY_TURNS = 20;

function historyToMessages(history: HistoryEntry[]): ModelMessage[] {
  const trimmed = history.slice(-MAX_HISTORY_TURNS);
  return trimmed.map((h) => ({
    role: h.role,
    content: h.text,
  }));
}

export async function runAgentReply(args: {
  settings: AgentSettings;
  userMessage: string;
  contactName: string | null;
  channel: "whatsapp" | "instagram";
  history?: HistoryEntry[];
}): Promise<AgentReply | null> {
  const systemPrompt = buildSystemPrompt(args.settings);

  const userIntro = args.contactName
    ? `Le prospect s'appelle « ${args.contactName} » et écrit via ${args.channel === "whatsapp" ? "WhatsApp" : "Instagram"}.`
    : `Le prospect écrit via ${args.channel === "whatsapp" ? "WhatsApp" : "Instagram"} (nom inconnu).`;

  const historyMessages = historyToMessages(args.history ?? []);

  const messages: ModelMessage[] = [
    ...historyMessages,
    {
      role: "user",
      content: `${userIntro}\n\nDernier message :\n"""\n${args.userMessage}\n"""`,
    },
  ];

  try {
    const result = await generateText({
      model: DEFAULT_MODEL,
      system: systemPrompt,
      messages,
      // providerOptions Anthropic — caching du system prompt sur 1h pour limiter les coûts
      providerOptions: {
        anthropic: {
          cacheControl: { type: "ephemeral" },
        },
      },
    });

    const reply = result.text?.trim();
    if (!reply) return null;

    return {
      text: reply,
      modelUsed: DEFAULT_MODEL,
      tokensUsage: {
        input: result.usage?.inputTokens ?? 0,
        output: result.usage?.outputTokens ?? 0,
      },
    };
  } catch (err) {
    console.error("[agent] échec generateText :", err);
    return null;
  }
}

/**
 * Compose la réponse de handover quand un trigger est détecté
 * (sans appel IA — pré-écrite + variables interpolées).
 */
export function composeHandoverReply(settings: AgentSettings): string {
  return interpolateMessage(settings.messageFinDeConversation, {
    personaName: settings.personaName,
  });
}

/**
 * Compose la réponse de pause (sans appel IA).
 * Si le template est vide, l'agent reste silencieux.
 */
export function composePauseReply(settings: AgentSettings): string | null {
  const tmpl = settings.messagePauseActivee?.trim();
  if (!tmpl) return null;
  return interpolateMessage(tmpl, { personaName: settings.personaName });
}

/**
 * Compose la réponse de demande de confirmation opt-out RGPD.
 * Avant de purger les données, on demande au prospect de confirmer.
 */
export function composeOptoutConfirmationReply(settings: AgentSettings): string {
  const persona = settings.personaName;
  return `Bonjour, c'est ${persona}, l'assistante d'Aïssa Events. Souhaitez-vous arrêter notre conversation et que nous supprimions vos données ? Répondez « OUI EFFACER » pour confirmer la suppression. Sinon, dites-moi simplement comment vous accompagner !`;
}

/**
 * Génère un résumé structuré de la conversation pour Aïssa au moment du
 * handover. Permet à Aïssa de prendre le relais en 10 secondes sans relire
 * tout l'historique. Format optimisé pour WhatsApp (gras `*texte*`).
 *
 * Coût : 1 appel Haiku 4.5 (~0.05 cents), latence ~1-2s.
 * Tourne en background via waitUntil donc pas bloquant pour le webhook.
 */
const SUMMARY_SYSTEM_PROMPT = `Tu es un assistant qui prépare un brief pour Aïssa, fondatrice d'une agence d'événementiel (Aïssa Events), quand une conversation WhatsApp doit lui être transférée.

Ton job : analyser tout l'historique conversationnel et produire un brief STRUCTURÉ ultra-concis (max 12 lignes) qu'Aïssa lit en 10 secondes pour comprendre :
- qui est le client (nom si dispo)
- ce qu'il veut concrètement (type d'événement, projet)
- les infos collectées (date, lieu, invités, budget, contraintes)
- pourquoi il demande à parler à Aïssa (devis ? question complexe ? confirmation ?)
- ce qu'Aïssa devrait dire en premier dans sa réponse

FORMAT STRICT (utilise *gras WhatsApp* avec UN seul astérisque, JAMAIS **double**) :

*Demande :*
[1-2 phrases qui expliquent le besoin clair du client]

*Infos collectées :*
• Type : [...]
• Date / période : [...]
• Lieu : [...]
• Invités : [...]
• Budget : [...]
(omet les lignes sans info)

*Raison du transfert :*
[1 ligne, ex : "Demande explicite de parler à Aïssa" ou "Demande de devis personnalisé"]

*Suggestion de première réponse :*
[1-2 phrases que Aïssa peut copier-coller ou s'inspirer]

Règles :
- Tu n'inventes RIEN. Si une info n'est pas dans l'historique, omets la ligne.
- Pas d'emoji autre que ceux dans le format.
- Pas de mention de tarifs précis (Aïssa fait les devis).
- Français uniquement.
- Reste factuel, pas de flatterie.`;

export async function summarizeForHandover(args: {
  history: HistoryEntry[];
  lastUserMessage: string;
  contactName: string | null;
  triggerMatched: string | null;
}): Promise<string | null> {
  if (args.history.length === 0 && !args.lastUserMessage) return null;

  const historyText = args.history
    .map((e) => {
      const speaker = e.role === "user" ? "CLIENT" : "ASSISTANTE";
      return `[${speaker}] ${e.text}`;
    })
    .join("\n");

  const userPrompt = `Contact : ${args.contactName ?? "Inconnu"}
Trigger qui a déclenché le handover : ${args.triggerMatched ?? "(non précisé)"}

=== HISTORIQUE CONVERSATIONNEL ===
${historyText}

=== DERNIER MESSAGE DU CLIENT (qui a déclenché le handover) ===
${args.lastUserMessage}

Génère le brief pour Aïssa selon le format strict.`;

  try {
    const result = await generateText({
      model: DEFAULT_MODEL,
      system: SUMMARY_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });
    return result.text?.trim() || null;
  } catch (err) {
    console.error("[agent] échec summarizeForHandover :", err);
    return null;
  }
}
