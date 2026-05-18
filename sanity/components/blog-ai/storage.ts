import { INITIAL_STATE, type WizardState } from "./types";

const STORAGE_PREFIX = "aissa-blog-ai-wizard:";
const TTL_MS = 24 * 60 * 60 * 1000;

interface StoredEnvelope {
  savedAt: number;
  state: WizardState;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadWizardState(docId: string): WizardState | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + docId);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as StoredEnvelope;
    if (!envelope || typeof envelope.savedAt !== "number" || !envelope.state) return null;
    if (Date.now() - envelope.savedAt > TTL_MS) {
      window.localStorage.removeItem(STORAGE_PREFIX + docId);
      return null;
    }
    // Merge with INITIAL_STATE pour combler les champs ajoutés à WizardState
    // depuis la dernière sauvegarde (sectionImages, etc.).
    return { ...INITIAL_STATE, ...envelope.state };
  } catch {
    return null;
  }
}

export function saveWizardState(docId: string, state: WizardState): void {
  if (!isBrowser()) return;
  try {
    const envelope: StoredEnvelope = { savedAt: Date.now(), state };
    window.localStorage.setItem(STORAGE_PREFIX + docId, JSON.stringify(envelope));
  } catch {
    // Quota exceeded, silent fail
  }
}

export function clearWizardState(docId: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + docId);
  } catch {
    // ignore
  }
}
