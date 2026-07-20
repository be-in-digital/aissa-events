"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { BookingFlow, type BookingContextInput } from "./booking-flow";

/**
 * Event-bus : n'importe quel CTA client peut ouvrir la modale de réservation
 * sans Context React partagé — via `openBookingDialog(context)`.
 */
export const BOOKING_DIALOG_EVENT = "open-booking-dialog";

export function openBookingDialog(context: BookingContextInput = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(BOOKING_DIALOG_EVENT, { detail: context }));
}

/**
 * Modale globale de réservation. Montée une seule fois (dans l'intercepteur).
 * Écoute `open-booking-dialog` et rend `<BookingFlow>` remonté à chaque
 * ouverture (clé `openId`) pour re-fetcher des créneaux frais.
 */
export function BookingDialog() {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<BookingContextInput>({});
  const [openId, setOpenId] = useState(0);
  const idRef = useRef(0);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<BookingContextInput>).detail ?? {};
      setContext(detail);
      idRef.current += 1;
      setOpenId(idRef.current);
      setOpen(true);
    };
    window.addEventListener(BOOKING_DIALOG_EVENT, handler);
    return () => window.removeEventListener(BOOKING_DIALOG_EVENT, handler);
  }, []);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed inset-x-0 bottom-0 top-0 z-50 mx-auto flex h-[100dvh] w-full max-w-[720px] flex-col overflow-hidden bg-cream pb-[env(safe-area-inset-bottom)] shadow-[0_30px_120px_rgba(44,31,51,0.3)] outline-none data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 sm:inset-y-8 sm:h-auto sm:max-h-[92vh] sm:rounded-[28px] sm:pb-0">
          <div className="flex items-center justify-end px-4 pt-4 sm:px-5">
            <DialogPrimitive.Close
              aria-label="Fermer"
              className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--rule)] bg-cream/90 text-ink transition-colors hover:bg-bordeaux hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
            >
              <X className="size-4" strokeWidth={1.5} aria-hidden />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Title className="sr-only">
            Réserver un appel découverte
          </DialogPrimitive.Title>
          <div className="flex-1 overflow-y-auto">
            {open && (
              <BookingFlow
                key={openId}
                context={context}
                onDone={() => setOpen(false)}
              />
            )}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
