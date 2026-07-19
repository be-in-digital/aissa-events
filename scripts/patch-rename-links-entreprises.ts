/**
 * Renomme les liens internes « /evenements-pro » → « /entreprises » dans le
 * contenu Sanity publié (menu, footer, sections d'accueil…), suite au
 * renommage de la page (directives cliente, juillet 2026).
 *
 * - Remplacement du chemin EXACT uniquement (aucun risque de toucher autre chose).
 * - Renomme aussi le libellé du menu « Événements pro » → « Entreprises ».
 * - La redirection 308 couvre déjà les anciens liens ; ce patch garde le contenu
 *   propre (URL affichée à jour, libellé conforme à la doc).
 *
 * Idempotent : relançable sans effet de bord.
 *
 * Usage : pnpm tsx scripts/patch-rename-links-entreprises.ts
 */
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_WRITE_TOKEN",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "published",
});

const OLD_PATH = "/evenements-pro";
const NEW_PATH = "/entreprises";
const OLD_LABEL_RE = /^\s*événements?\s*pro\s*$/i;
const NEW_LABEL = "Entreprises";

type Json = unknown;

/** Remplace récursivement toute valeur `internalPath === "/evenements-pro"`. */
function replacePaths(value: Json): { value: Json; changed: boolean } {
  if (Array.isArray(value)) {
    let changed = false;
    const arr = value.map((v) => {
      const r = replacePaths(v);
      if (r.changed) changed = true;
      return r.value;
    });
    return { value: arr, changed };
  }
  if (value && typeof value === "object") {
    let changed = false;
    const obj: Record<string, Json> = { ...(value as Record<string, Json>) };
    for (const k of Object.keys(obj)) {
      if (k === "internalPath" && obj[k] === OLD_PATH) {
        obj[k] = NEW_PATH;
        changed = true;
        continue;
      }
      const r = replacePaths(obj[k]);
      obj[k] = r.value;
      if (r.changed) changed = true;
    }
    return { value: obj, changed };
  }
  return { value, changed: false };
}

/** Renomme le libellé du menu « Événements pro » → « Entreprises ». */
function renameNavLabels(items: Json): { value: Json; changed: boolean } {
  if (!Array.isArray(items)) return { value: items, changed: false };
  let changed = false;
  const out = items.map((raw) => {
    if (!raw || typeof raw !== "object") return raw;
    const item = raw as Record<string, Json>;
    const cta = item.cta as Record<string, Json> | undefined;
    const pointsToPro =
      cta?.internalPath === NEW_PATH ||
      cta?.internalPath === OLD_PATH ||
      (typeof item.label === "string" && OLD_LABEL_RE.test(item.label));
    if (!pointsToPro) return item;
    const next: Record<string, Json> = { ...item };
    if (typeof item.label === "string" && OLD_LABEL_RE.test(item.label)) {
      next.label = NEW_LABEL;
      changed = true;
    }
    if (cta && typeof cta.label === "string" && OLD_LABEL_RE.test(cta.label)) {
      next.cta = { ...cta, label: NEW_LABEL };
      changed = true;
    }
    return next;
  });
  return { value: out, changed };
}

async function patchDoc(doc: Record<string, Json>): Promise<boolean> {
  const type = doc._type as string;
  const setPayload: Record<string, Json> = {};
  for (const key of Object.keys(doc)) {
    if (key.startsWith("_")) continue;
    const pathRes = replacePaths(doc[key]);
    let value = pathRes.value;
    let changed = pathRes.changed;
    // Le renommage du libellé « Événements pro » → « Entreprises » ne concerne
    // que le menu principal (siteSettings.headerNav).
    if (type === "siteSettings" && key === "headerNav") {
      const navRes = renameNavLabels(value);
      value = navRes.value;
      if (navRes.changed) changed = true;
    }
    if (changed) setPayload[key] = value;
  }
  const keys = Object.keys(setPayload);
  if (keys.length === 0) return false;
  await client
    .patch(doc._id as string)
    .set(setPayload)
    .commit({ autoGenerateArrayKeys: false });
  console.log(`   ✅ ${type} (${doc._id}) → ${keys.join(", ")}`);
  return true;
}

async function main() {
  console.log(`→ Connecté à Sanity ${projectId}/${dataset}. Scan de TOUS les documents…`);
  const docs = await client.fetch<Record<string, Json>[]>(
    `*[!(_id in path("drafts.**"))]`,
  );
  console.log(`   ${docs.length} document(s) publié(s) à scanner.`);
  let patched = 0;
  for (const doc of docs) {
    if (await patchDoc(doc)) patched++;
  }
  console.log(
    patched === 0
      ? "✔ Aucun lien /evenements-pro dans le contenu — déjà propre."
      : `✅ ${patched} document(s) patché(s). (Revalidation ~60 s.)`,
  );
}

main().catch((err) => {
  console.error("❌ Patch échoué :", err);
  process.exit(1);
});
