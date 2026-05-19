import { z } from "zod";

import { checkBlogAdminGate } from "@/lib/blog/auth";
import { generateCoverImages } from "@/lib/blog/generate-cover-images";

export const maxDuration = 120;

const requestSchema = z.object({
  title: z.string().min(5).max(200),
  brief: z.object({
    subject: z.string(),
    audience: z.string(),
    intent: z.enum(["info", "seo", "lead-gen", "mixed"]),
    angle: z.string(),
    seoKeywords: z.array(z.string()),
    targetWordCount: z.number().int(),
    keyPoints: z.array(z.string()),
    categorySlug: z.string(),
  }),
  count: z.number().int().min(1).max(4).default(4),
});

export async function POST(req: Request) {
  const authError = await checkBlogAdminGate(req);
  if (authError) return authError;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON body invalide" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Requête invalide", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const variants = await generateCoverImages(parsed.data);
    if (variants.length === 0) {
      return Response.json(
        { error: "Aucune image générée (Imagen 4 et fallback Flux ont échoué)" },
        { status: 502 },
      );
    }
    return Response.json({ variants });
  } catch (err) {
    console.error("[api/blog/generate-images] échec :", err);
    return Response.json(
      { error: "Échec de génération d'images" },
      { status: 500 },
    );
  }
}
