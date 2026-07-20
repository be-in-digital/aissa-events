"use client";

import { useEffect } from "react";
import { bookingTypeFromPath, isBookingPath } from "@/lib/booking/url";
import { BookingDialog, openBookingDialog } from "./booking-dialog";

/**
 * Intercepte les clics vers `/reserver` et `/reserver/<type>` pour ouvrir la
 * modale sans navigation — même pattern que l'ancien intercepteur Calendly.
 * Sans JS, le lien mène à la vraie page (fallback progressif + SEO).
 */
function parseBookingLink(target: EventTarget | null): {
  type?: string;
  date?: string;
  source?: string;
  content?: string;
} | null {
  if (!(target instanceof Element)) return null;
  const anchor = target.closest("a[href]");
  if (!anchor) return null;
  const href = anchor.getAttribute("href");
  if (!href) return null;
  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    if (!isBookingPath(url.pathname)) return null;
    return {
      type:
        bookingTypeFromPath(url.pathname) ??
        url.searchParams.get("type") ??
        undefined,
      date: url.searchParams.get("date") ?? undefined,
      source: url.searchParams.get("utm_source") ?? undefined,
      content: url.searchParams.get("utm_content") ?? undefined,
    };
  } catch {
    return null;
  }
}

export function BookingInterceptor() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const ctx = parseBookingLink(event.target);
      if (!ctx) return;

      event.preventDefault();
      openBookingDialog(ctx);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <BookingDialog />;
}
