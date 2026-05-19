"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ArrowRight, Calendar as CalendarIcon, X } from "lucide-react";

/**
 * Event window que n'importe quel CTA peut dispatcher pour ouvrir la modale
 * de disponibilités sans avoir besoin d'un Context React partagé.
 */
export const AVAILABILITY_DIALOG_EVENT = "open-availability-dialog";

export function openAvailabilityDialog() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AVAILABILITY_DIALOG_EVENT));
}

type Props = {
  triggerLabel?: string;
  children: ReactNode;
};

/**
 * Ouvre le calendrier 3 mois (server component passé en `children`) dans une
 * modale. Le bouton trigger est visible inline sur la page produit, à côté du
 * bloc `NextSlots`.
 */
export function AvailabilityDialog({
  triggerLabel = "Voir tout l'agenda",
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(AVAILABILITY_DIALOG_EVENT, handler);
    return () => window.removeEventListener(AVAILABILITY_DIALOG_EVENT, handler);
  }, []);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        className="group inline-flex items-center gap-3 rounded-full border border-bordeaux/30 bg-cream px-6 py-3 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:border-bordeaux hover:shadow-[0_12px_32px_rgba(122,46,67,0.10)]"
      >
        <CalendarIcon className="size-4 text-bordeaux" strokeWidth={1.5} />
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
          {triggerLabel}
        </span>
        <ArrowRight
          className="size-3.5 text-bordeaux transition-transform duration-300 group-hover:translate-x-0.5"
          strokeWidth={1.5}
        />
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop
          className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
        />
        <DialogPrimitive.Popup
          className="fixed inset-x-3 top-1/2 z-50 max-h-[94vh] w-auto max-w-[960px] -translate-y-1/2 overflow-y-auto rounded-[28px] bg-cream shadow-[0_40px_120px_rgba(44,31,51,0.28)] ring-1 ring-[var(--rule)] outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:inset-x-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-[calc(100%-3rem)]"
        >
          <DialogPrimitive.Close
            className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full border border-[var(--rule)] bg-cream/90 text-ink transition-colors hover:bg-bordeaux hover:text-cream"
            aria-label="Fermer"
          >
            <X className="size-4" strokeWidth={1.5} />
          </DialogPrimitive.Close>
          <DialogPrimitive.Title className="sr-only">
            Disponibilités
          </DialogPrimitive.Title>
          {children}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
