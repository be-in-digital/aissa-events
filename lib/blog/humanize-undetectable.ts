import "server-only";

import { env } from "@/env";

/**
 * Couche humanizer — service tiers Undetectable.AI.
 *
 * Workflow async :
 *   1. POST /submit avec le texte → renvoie un document `id`
 *   2. POST /document avec cet id, polling toutes les 5-8s jusqu'à ce que
 *      `output` soit rempli (ou timeout)
 *
 * Doc officielle : https://help.undetectable.ai/en/article/humanization-api-v2-p28b2n/
 *
 * Modèle v2 = supporte tous les langages avec medium humanization (le seul
 * compatible français). v11/v11sr = English-only, à ne pas utiliser.
 *
 * Si `UNDETECTABLE_API_KEY` n'est pas configurée, retourne null silencieusement
 * (la couche est best-effort : pas de clé = on garde le texte tel quel).
 */

const SUBMIT_URL = "https://humanize.undetectable.ai/submit";
const DOCUMENT_URL = "https://humanize.undetectable.ai/document";

/** Délai (ms) entre deux polls du document endpoint. */
const POLL_INTERVAL_MS = 5_000;
/** Timeout total (ms) avant d'abandonner le polling. */
const POLL_TIMEOUT_MS = 90_000;

export interface UndetectableResult {
  /** Texte humanisé, ou null si la couche a été skippée / a échoué. */
  output: string | null;
  /** Si une erreur s'est produite, le message court. */
  error?: string;
}

interface SubmitResponse {
  status?: string;
  id?: string;
}

interface DocumentResponse {
  id: string;
  output?: string | null;
  input?: string;
  readability?: string;
  purpose?: string;
  createdDate?: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Humanise un texte via Undetectable.AI. Best-effort : retourne `{ output: null }`
 * si la clé API est absente ou si le service échoue. Le pipeline appelant
 * garde alors le texte d'entrée.
 *
 * Paramètres calibrés pour Aïssa Events :
 *   - readability: "Marketing"  (registre marketing/éditorial, ni academic ni casual)
 *   - purpose: "Article"        (article de blog, pas essay ni cover letter)
 *   - strength: "More Human"    (max humanisation, on accepte un peu de paraphrase)
 *   - model: "v2"               (seul modèle qui supporte le français)
 */
export async function humanizeUndetectable(
  text: string,
): Promise<UndetectableResult> {
  const apiKey = env.UNDETECTABLE_API_KEY;
  if (!apiKey) return { output: null };

  const content = text.trim();
  // L'API exige minimum 50 caractères.
  if (content.length < 50) {
    return { output: null, error: "Texte < 50 caractères, skip Undetectable" };
  }

  // 1. Submit
  let submitJson: SubmitResponse;
  try {
    const res = await fetch(SUBMIT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        content,
        readability: "Marketing",
        purpose: "Article",
        strength: "More Human",
        model: "v2",
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return {
        output: null,
        error: `Submit HTTP ${res.status} : ${body.slice(0, 200)}`,
      };
    }
    submitJson = (await res.json()) as SubmitResponse;
  } catch (err) {
    return {
      output: null,
      error: `Submit network error : ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  const docId = submitJson.id;
  if (!docId) {
    return { output: null, error: "Submit response sans id" };
  }

  // 2. Poll document jusqu'à ce que output soit présent ou timeout.
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  // Premier poll un peu plus long, le doc n'est jamais prêt avant 5-8s.
  await sleep(POLL_INTERVAL_MS);

  while (Date.now() < deadline) {
    let docJson: DocumentResponse | null = null;
    try {
      const res = await fetch(DOCUMENT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
        },
        body: JSON.stringify({ id: docId }),
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        return {
          output: null,
          error: `Document HTTP ${res.status} : ${body.slice(0, 200)}`,
        };
      }
      docJson = (await res.json()) as DocumentResponse;
    } catch (err) {
      return {
        output: null,
        error: `Document network error : ${err instanceof Error ? err.message : String(err)}`,
      };
    }

    const out = docJson?.output;
    if (out && typeof out === "string" && out.trim().length > 0) {
      return { output: out.trim() };
    }

    // Pas encore prêt, on attend.
    await sleep(POLL_INTERVAL_MS);
  }

  return { output: null, error: `Timeout après ${POLL_TIMEOUT_MS / 1000}s` };
}
