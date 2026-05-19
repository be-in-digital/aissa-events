"use client";

import { useEffect, useState } from "react";
import { CalendlyDialog } from "./calendly-dialog";

function getCalendlyHref(target: EventTarget | null): string | null {
  if (!(target instanceof Element)) return null;
  const anchor = target.closest("a[href]");
  if (!anchor) return null;
  const href = anchor.getAttribute("href");
  if (!href) return null;
  try {
    const url = new URL(href, window.location.origin);
    if (!/(^|\.)calendly\.com$/i.test(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function CalendlyInterceptor() {
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const calendlyHref = getCalendlyHref(event.target);
      if (!calendlyHref) return;

      event.preventDefault();
      setHref(calendlyHref);
      setOpen(true);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return <CalendlyDialog href={href} open={open} onOpenChange={setOpen} />;
}
