import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Désactive le draft mode et redirige vers l'accueil (ou ?next=/chemin).
 * Appelé par le bouton "Quitter le preview" injecté par `<VisualEditing />`.
 */
export async function GET(request: Request) {
  const dm = await draftMode();
  dm.disable();
  const url = new URL(request.url);
  const nextParam = url.searchParams.get("next") ?? "/";
  // Anti open-redirect : on n'accepte qu'un chemin relatif `/…`.
  const safeNext = nextParam.startsWith("/") && !nextParam.startsWith("//")
    ? nextParam
    : "/";
  return NextResponse.redirect(new URL(safeNext, request.url));
}
