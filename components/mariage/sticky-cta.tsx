"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { ArrowRight, Calendar } from "lucide-react";
import { resolveCta } from "@/lib/sanity/cta";
import { buildCalendlyUrl } from "@/lib/calendly";
import type { MariagePageQueryResult } from "@/sanity.types";

type StickyCtaData = NonNullable<MariagePageQueryResult>["stickyCta"];

const FALLBACK_CTA = {
  label: "Réserver un appel",
  href: buildCalendlyUrl({ source: "mariage", content: "sticky-cta" }),
  external: true,
  variant: "primary" as const,
};
const FALLBACK_LABEL = "Aïssa répond";
const FALLBACK_SUB_LABEL = "Devis sous 48 h";

export function MariageStickyCta({ data }: { data?: StickyCtaData }) {
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
  const cta = resolveCta(data?.cta ?? null) ?? FALLBACK_CTA;

  const label = data?.label ?? FALLBACK_LABEL;
  const subLabel = data?.subLabel ?? FALLBACK_SUB_LABEL;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
          >
            <div className="mx-auto max-w-md">
              {(label || subLabel) && (
                <p className="mb-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream/95 px-3 py-1 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-bordeaux backdrop-blur-md">
                  <span className="size-1.5 animate-pulse rounded-full bg-bordeaux" />
                  {label}
                  {label && subLabel && (
                    <>
                      <span className="text-muted-ink">·</span>
                      <span className="text-muted-ink">{subLabel}</span>
                    </>
                  )}
                  {!label && subLabel && (
                    <span className="text-muted-ink">{subLabel}</span>
                  )}
                </p>
              )}
              <div className="flex items-center gap-2 rounded-full border border-[var(--rule)] bg-cream/95 p-1.5 shadow-[0_-10px_40px_rgba(44,31,51,0.18)] backdrop-blur-md">
                <a
                  href={cta.href}
                  target={cta.external ? "_blank" : undefined}
                  rel={cta.external ? "noopener noreferrer" : undefined}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-bordeaux px-5 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                >
                  <Calendar className="size-3.5" />
                  {cta.label}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
