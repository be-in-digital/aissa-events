import "server-only";

import { generateImage } from "ai";

import { sanityWriteClient } from "@/lib/sanity/client.server";

import type { BriefInput, ImageVariant } from "./types";

const IMAGE_MODEL_CHAIN = [
  "openai/gpt-image-1",
  "openai/dall-e-3",
  "xai/grok-2-image",
  "black-forest-labs/flux-schnell",
];

/**
 * Construit un prompt visuel cohérent avec DESIGN.md (palette crème/prune/or,
 * lumière douce, esthétique premium-feminine-éditoriale).
 *
 * Le prompt évite explicitement les défauts classiques des images IA pour
 * événementiel : mains visibles, visages frontaux, lumière artificielle.
 */
function buildVisualPrompt(title: string, brief: BriefInput): string {
  const subjectHint = brief.subject.toLowerCase();
  const themeHints: string[] = [];

  if (subjectHint.includes("mariage")) themeHints.push("wedding scene", "florals", "soft daylight");
  if (subjectHint.includes("seminaire") || subjectHint.includes("séminaire") || subjectHint.includes("corporate")) {
    themeHints.push("elegant corporate venue", "warm interior", "minimal decor");
  }
  if (subjectHint.includes("baptême") || subjectHint.includes("bapteme")) {
    themeHints.push("intimate celebration", "soft natural light");
  }
  if (subjectHint.includes("anniversaire") || subjectHint.includes("gala")) {
    themeHints.push("refined evening setting", "candlelight ambiance");
  }
  if (subjectHint.includes("emerainville") || subjectHint.includes("77") || subjectHint.includes("seine-et-marne")) {
    themeHints.push("Île-de-France countryside light");
  }
  if (themeHints.length === 0) themeHints.push("elegant event setup", "refined atmosphere");

  return [
    `Editorial wedding magazine photograph illustrating: "${title}".`,
    themeHints.join(", "),
    "Color palette: warm cream (#F4EDE5) background, deep plum (#2C1F33) accents, soft gold (#B8924E) highlights, subtle ivory.",
    "Soft natural light from large windows, golden hour quality, no harsh shadows, no flash.",
    "Composition: wide editorial framing, refined floral or table details in foreground, blurred elegant background.",
    "No people facing camera, no hands visible, no text overlays, no logos.",
    "Style: high-end French wedding planner portfolio, magazine quality, calm, spacious, feminine, premium, institutional.",
    "Avoid: oversaturated colors, harsh contrast, modern minimalism, corporate stock photo look, AI-generated artifacts.",
    "Aspect ratio: 16:9 cinematic horizontal.",
  ].join(" ");
}

async function uploadImageToSanity(args: {
  uint8Array: Uint8Array;
  filename: string;
  alt: string;
}): Promise<{ assetId: string; url: string }> {
  const buffer = Buffer.from(args.uint8Array);
  const asset = await sanityWriteClient.assets.upload("image", buffer, {
    filename: args.filename,
    contentType: "image/png",
  });
  return { assetId: asset._id, url: asset.url };
}

/**
 * Génère N variantes d'image cover via Imagen 4 (fallback Flux Pro 1.1 en cas d'échec).
 * Upload chaque variante réussie vers Sanity Assets.
 * Renvoie les variantes uploadées (peut être < N si certains uploads échouent).
 */
export async function generateCoverImages(args: {
  title: string;
  brief: BriefInput;
  count: number;
}): Promise<ImageVariant[]> {
  const prompt = buildVisualPrompt(args.title, args.brief);
  const baseFilename = args.title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

  async function generateWithModel(model: string) {
    return generateImage({
      model,
      prompt,
      n: args.count,
      aspectRatio: "16:9",
    });
  }

  let images: { uint8Array: Uint8Array }[] | undefined;
  const failures: Array<{ model: string; error: unknown }> = [];
  for (const model of IMAGE_MODEL_CHAIN) {
    try {
      const result = await generateWithModel(model);
      images = result.images;
      console.info(`[generate-cover-images] succès avec ${model}`);
      break;
    } catch (err) {
      failures.push({ model, error: err });
      console.warn(`[generate-cover-images] ${model} indisponible :`, err);
    }
  }

  if (!images) {
    console.error(
      "[generate-cover-images] échec total — tous les modèles indisponibles :",
      failures.map((f) => `${f.model}: ${f.error instanceof Error ? f.error.message : String(f.error)}`),
    );
    throw new Error(
      `Aucun modèle d'image disponible sur ton AI Gateway (${IMAGE_MODEL_CHAIN.join(", ")}). Vérifie la config Vercel AI Gateway ou choisis « plus tard » pour ajouter la cover manuellement.`,
    );
  }

  const uploads = await Promise.allSettled(
    images.map(async (img, i) => {
      const filename = `${baseFilename || "cover"}-${i + 1}.png`;
      const { assetId, url } = await uploadImageToSanity({
        uint8Array: img.uint8Array,
        filename,
        alt: args.title,
      });
      return { assetId, url, prompt } satisfies ImageVariant;
    }),
  );

  return uploads
    .filter((r): r is PromiseFulfilledResult<ImageVariant> => r.status === "fulfilled")
    .map((r) => r.value);
}
