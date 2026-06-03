"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

function withEmbedParams(href: string): string {
  try {
    const url = new URL(href);
    if (typeof window !== "undefined") {
      url.searchParams.set("embed_domain", window.location.hostname);
      url.searchParams.set("embed_type", "Inline");
    }
    url.searchParams.set("hide_landing_page_details", "1");
    url.searchParams.set("hide_gdpr_banner", "1");
    return url.toString();
  } catch {
    return href;
  }
}

export function CalendlyDialog({
  href,
  open,
  onOpenChange,
}: {
  href: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Dérivé des props — pas d'effet (le dialog démarre fermé, donc embedUrl=null
  // au SSR et à l'hydratation ; window n'est lu que sur ouverture côté client).
  const embedUrl = useMemo(
    () => (open && href ? withEmbedParams(href) : null),
    [open, href],
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed inset-x-0 bottom-0 top-0 z-50 mx-auto flex h-[100dvh] w-full max-w-[1080px] flex-col overflow-hidden bg-cream pb-[env(safe-area-inset-bottom)] shadow-[0_30px_120px_rgba(44,31,51,0.3)] outline-none data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 sm:inset-y-8 sm:h-auto sm:pb-0 sm:rounded-3xl">
          <div className="flex items-start justify-between border-b border-[var(--rule-soft)] px-6 py-5 sm:px-8">
            <div>
              <DialogPrimitive.Title className="font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                Réserver un appel
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-2 font-serif text-[22px] leading-[1.15] tracking-[-0.01em] text-ink sm:text-[26px]">
                15 minutes pour comprendre votre projet.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              aria-label="Fermer"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
            >
              <X className="size-5" aria-hidden />
            </DialogPrimitive.Close>
          </div>
          <div className="relative flex-1 bg-cream">
            {embedUrl ? (
              <iframe
                key={embedUrl}
                src={embedUrl}
                title="Réserver un appel — Calendly"
                className="absolute inset-0 size-full"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-mono text-[11px] uppercase tracking-[0.22em] text-ink-soft">
                Chargement…
              </div>
            )}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
