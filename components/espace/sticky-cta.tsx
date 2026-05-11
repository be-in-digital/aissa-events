"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Calendar } from "lucide-react";
import { buildCalendlyUrl } from "@/lib/calendly";
import { AVAILABILITY } from "@/lib/availability";
import { resolveCta } from "@/lib/sanity/cta";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type StickyCtaData = NonNullable<EspaceEventsPageQueryResult>["stickyCta"];

const FALLBACK_LABEL = `${AVAILABILITY.remainingDates} dates ${AVAILABILITY.year}`;
const FALLBACK_SUBLABEL = "visite gratuite";
const FALLBACK_CTA_LABEL = "Réserver une visite";

export function StickyCta({ data }: { data?: StickyCtaData }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewport = window.innerHeight;
      const nearBottom = scrollY + viewport > docHeight - 400;
      setVisible(scrollY > 600 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (data?.enabled === false) return null;

  const label = data?.label ?? FALLBACK_LABEL;
  const subLabel = data?.subLabel ?? FALLBACK_SUBLABEL;
  const cta = resolveCta(data?.cta ?? null);
  const ctaHref = cta?.href ?? buildCalendlyUrl({ content: "sticky-cta" });
  const ctaLabel = cta?.label ?? FALLBACK_CTA_LABEL;
  const ctaExternal = cta?.external ?? true;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 lg:hidden"
        >
          <div className="mx-auto max-w-md">
            <p className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream/95 px-3 py-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-bordeaux backdrop-blur-md">
              <span className="size-1.5 animate-pulse rounded-full bg-bordeaux" />
              {label}
              <span className="text-muted-ink">·</span>
              <span className="text-muted-ink">{subLabel}</span>
            </p>
            <div className="flex items-center gap-2 rounded-full border border-[var(--rule)] bg-cream/95 p-1.5 shadow-[0_-10px_40px_rgba(44,31,51,0.18)] backdrop-blur-md">
              <a
                href={ctaHref}
                target={ctaExternal ? "_blank" : undefined}
                rel={ctaExternal ? "noopener noreferrer" : undefined}
                className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-bordeaux px-5 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition-all active:scale-[0.98]"
              >
                <Calendar className="size-3.5" />
                {ctaLabel}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
