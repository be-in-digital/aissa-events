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
  const next = url.searchParams.get("next") ?? "/";
  return NextResponse.redirect(new URL(next, request.url));
}
