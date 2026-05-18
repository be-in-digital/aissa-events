import { draftMode } from "next/headers";
import { SanityLive } from "@/lib/sanity/live";

/**
 * Petite frontière dynamique autour de `<SanityLive />` : résout `draftMode()`
 * hors d'une boundary `'use cache'` et passe `includeDrafts` requis par le
 * mode strict. À monter dans un `<Suspense>` pour ne pas dynamiser tout le
 * layout.
 */
export async function SanityLiveWrapper() {
  const { isEnabled: isDraftMode } = await draftMode();
  return <SanityLive includeDrafts={isDraftMode} />;
}
