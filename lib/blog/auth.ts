import "server-only";

import { env } from "@/env";
import { checkBlogAdminRateLimit } from "./rate-limit";

/**
 * Vérifie qu'une requête vers les routes /api/admin/blog/* est autorisée.
 *
 * MVP : secret partagé via header `Authorization: Bearer <secret>`.
 * Le secret côté serveur est `BLOG_AI_ADMIN_SECRET`. Côté Sanity Studio,
 * l'action custom récupère ce secret via une variable d'env publique
 * `NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN` (les deux doivent être configurées
 * avec la même valeur). Trade-off documenté dans .context/blog-ai-generator-design.md.
 *
 * Returns null if authorized, or a Response with 401/403/429 if not.
 */
export async function checkBlogAdminGate(
  req: Request,
): Promise<Response | null> {
  const secret = process.env.BLOG_AI_ADMIN_SECRET;
  if (!secret) {
    return new Response(
      JSON.stringify({ error: "BLOG_AI_ADMIN_SECRET non configuré côté serveur" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Authorization header manquant" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (token !== secret) {
    return new Response(JSON.stringify({ error: "Token invalide" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anonymous";

  const rl = await checkBlogAdminRateLimit(ip);
  if (!rl.success) {
    return new Response(
      JSON.stringify({
        error: "Trop de requêtes. Réessaye dans une minute.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.max(1, Math.ceil((rl.reset - Date.now()) / 1000)).toString(),
        },
      },
    );
  }

  return null;
}


/** Force le typecheck à voir env utilisé pour éviter un warning unused (et signaler la dep). */
void env;
