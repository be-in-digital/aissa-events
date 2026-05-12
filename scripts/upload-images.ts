/**
 * Upload des images du catalogue vers Sanity (avec cache local).
 *
 * Le cache `.sanity-image-cache.json` stocke pour chaque clé :
 *   { assetId: "image-xyz...", url: "...", uploadedAt: "..." }
 * Pour ré-uploader une image, supprimer son entrée du cache (ou tout le fichier).
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { SanityClient } from "@sanity/client";
import { IMAGE_CATALOG, type ImageKey } from "./image-catalog";

const CACHE_PATH = resolve(process.cwd(), ".sanity-image-cache.json");

type CacheEntry = {
  assetId: string;
  url: string;
  uploadedAt: string;
};

type Cache = Record<string, CacheEntry>;

function loadCache(): Cache {
  if (!existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_PATH, "utf-8")) as Cache;
  } catch {
    return {};
  }
}

function saveCache(cache: Cache) {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

async function fetchToBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Échec téléchargement ${url} (HTTP ${res.status})`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export type ResolvedImage = {
  _type: "imageWithAlt";
  asset: { _type: "reference"; _ref: string };
  alt: string;
};

export type ImageMap = Record<ImageKey, ResolvedImage>;

/**
 * Upload toutes les images du catalogue dans Sanity (skip celles en cache)
 * et retourne le mapping `imageKey -> imageWithAlt` prêt à être inséré dans
 * un document Sanity.
 */
export async function uploadAllImages(client: SanityClient): Promise<ImageMap> {
  const cache = loadCache();
  const result = {} as ImageMap;
  const keys = Object.keys(IMAGE_CATALOG) as ImageKey[];

  let uploaded = 0;
  let cached = 0;

  for (const key of keys) {
    const entry = IMAGE_CATALOG[key];
    const cacheHit = cache[key];

    // Si l'URL a changé, on invalide le cache pour cette clé
    let assetId: string;
    if (cacheHit && cacheHit.url === entry.url) {
      assetId = cacheHit.assetId;
      cached += 1;
    } else {
      process.stdout.write(`     ⬆ Upload "${key}"… `);
      const buffer = await fetchToBuffer(entry.url);
      const asset = await client.assets.upload("image", buffer, {
        filename: entry.filename ?? `${key}.jpg`,
        contentType: "image/jpeg",
      });
      assetId = asset._id;
      cache[key] = {
        assetId,
        url: entry.url,
        uploadedAt: new Date().toISOString(),
      };
      saveCache(cache);
      uploaded += 1;
      process.stdout.write("✓\n");
    }

    result[key] = {
      _type: "imageWithAlt",
      asset: { _type: "reference", _ref: assetId },
      alt: entry.alt,
    };
  }

  console.log(`     → ${uploaded} uploadées · ${cached} depuis cache`);
  return result;
}

/**
 * Walke récursivement un document et remplace tout `{ __imageKey: K }`
 * (ou `{ __imageKey: K, altOverride: string }`) par l'image résolue.
 */
export function resolveImagePlaceholders<T>(input: T, images: ImageMap): T {
  if (input === null || input === undefined) return input;

  if (Array.isArray(input)) {
    return input.map((item) => resolveImagePlaceholders(item, images)) as T;
  }

  if (typeof input === "object") {
    const obj = input as Record<string, unknown>;

    // Cas placeholder
    if (typeof obj.__imageKey === "string") {
      const key = obj.__imageKey as ImageKey;
      const resolved = images[key];
      if (!resolved) {
        throw new Error(`Image inconnue dans le catalogue : "${key}"`);
      }
      const altOverride = obj.altOverride;
      return {
        ...resolved,
        alt:
          typeof altOverride === "string" && altOverride.length > 0
            ? altOverride
            : resolved.alt,
      } as T;
    }

    // Walk profond
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = resolveImagePlaceholders(v, images);
    }
    return out as T;
  }

  return input;
}
