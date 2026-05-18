// Route: suggest 3-6 key points from a partial brief
import { z } from "zod";

import { checkBlogAdminAuth } from "@/lib/blog/auth";
import { suggestKeypoints } from "@/lib/blog/suggest-keypoints";

export const maxDuration = 30;

const requestSchema = z.object({
  subject: z.string().min(5).max(300),
  audience: z.string().min(3).max(200),
  angle: z.string().min(3).max(300),
  intent: z.enum(["info", "seo", "lead-gen", "mixed"]),
  seoKeywords: z.array(z.string().min(1).max(60)).max(10).optional(),
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
      { error: "Champs invalides", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const keyPoints = await suggestKeypoints(parsed.data);
    return Response.json({ keyPoints });
  } catch (err) {
    console.error("[api/blog/suggest-keypoints] échec :", err);
    return Response.json(
      {
        error: "Échec de la suggestion",
        message: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 },
    );
  }
}
