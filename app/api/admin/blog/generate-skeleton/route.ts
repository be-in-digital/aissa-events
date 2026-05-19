import { z } from "zod";

import { checkBlogAdminGate } from "@/lib/blog/auth";
import { generateSkeleton } from "@/lib/blog/generate-skeleton";

export const maxDuration = 60;

const briefSchema = z.object({
  brief: z.object({
    subject: z.string().min(5).max(300),
    audience: z.string().min(3).max(200),
    intent: z.enum(["info", "seo", "lead-gen", "mixed"]),
    angle: z.string().min(3).max(300),
    seoKeywords: z.array(z.string().min(1).max(60)).max(10),
    targetWordCount: z.number().int().min(300).max(3000),
    keyPoints: z.array(z.string().min(3).max(300)).min(1).max(8),
    categorySlug: z.string().min(1).max(100),
  }),
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

  const parsed = briefSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Brief invalide", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const skeleton = await generateSkeleton(parsed.data.brief);
    return Response.json({ skeleton });
  } catch (err) {
    console.error("[api/blog/generate-skeleton] échec :", err);
    return Response.json(
      { error: "Échec de génération du squelette" },
      { status: 500 },
    );
  }
}
