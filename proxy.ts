import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protège la page d'aide privée `/admin/overview`.
 *
 * Accessible uniquement avec le bon lien secret :
 *   /admin/overview?secret=<ADMIN_OVERVIEW_SECRET>
 *
 * Le proxy s'exécute à chaque requête, AVANT le rendu et le cache de la page
 * (contrairement à une vérification dans la page, contournée par le prérendu
 * statique). Sans le bon secret → 404, comme si la page n'existait pas.
 */
export function proxy(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const required = process.env.ADMIN_OVERVIEW_SECRET;

  if (!required || secret !== required) {
    return new NextResponse("404 — Page introuvable.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/overview",
};
