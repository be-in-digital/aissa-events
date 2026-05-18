import { z } from "zod";

import { checkBlogAdminAuth } from "@/lib/blog/auth";
import { generateSection } from "@/lib/blog/generate-section";

export const maxDuration = 300;

const requestSchema = z.object({
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
  skeleton: z.object({
    title: z.string(),
    excerpt: z.string(),
    plan: z.array(
      z.object({
        title: z.string(),
        children: z.array(z.object({ title: z.string() })),
      }),
    ),
    suggestedTags: z.array(z.string()),
    seo: z.object({
      metaTitle: z.string(),
      metaDescription: z.string(),
    }),
  }),
  sectionId: z.string().regex(/^h2-\d+(-h3-\d+)?$/, "Format sectionId invalide"),
  previousSections: z
    .array(
      z.object({
        sectionId: z.string(),
        markdown: z.string(),
      }),
    )
    .default([]),
});

export async function POST(req: Request) {
  const authError = checkBlogAdminAuth(req);
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
    const section = await generateSection(parsed.data);
    return Response.json({ section });
  } catch (err) {
    console.error("[api/blog/generate-section] échec :", err);
    return Response.json(
      {
        error: "Échec de génération de la section",
        message: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 },
    );
  }
}
