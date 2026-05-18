import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

/**
 * Affiche l'overlay Visual Editing de Sanity uniquement quand le draft mode
 * Next est actif. Côté visiteur normal : rend `null` (zéro coût runtime).
 *
 * À monter dans `app/layout.tsx`, idéalement dans un `<Suspense>` pour scoper
 * la frontière dynamique.
 */
export async function VisualEditingOverlay() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return <VisualEditing />;
}
