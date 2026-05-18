import "server-only";

import { env } from "@/env";

/**
 * Vérifie qu'une requête vers les routes /api/admin/blog/* est autorisée.
 *
 * MVP : secret partagé via header `Authorization: Bearer <secret>`.
 * Le secret côté serveur est `BLOG_AI_ADMIN_SECRET`. Côté Sanity Studio,
 * l'action custom récupère ce secret via une variable d'env publique
 * `NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN` (les deux doivent être configurées
 * avec la même valeur). Trade-off documenté dans .context/blog-ai-generator-design.md.
 *
 * Returns null if authorized, or a Response with 401/403 if not.
 */
export function checkBlogAdminAuth(req: Request): Response | null {
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

  return null;
}

/** Force le typecheck à voir env utilisé pour éviter un warning unused (et signaler la dep). */
void env;
