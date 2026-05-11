"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Phone } from "lucide-react";
import { buildCalendlyUrl } from "@/lib/calendly";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import type { EvenementPageQueryResult } from "@/sanity.types";

type FinalCtaData = NonNullable<EvenementPageQueryResult>["finalCta"];

const FALLBACK_EYEBROW = "Parlons de votre événement";
const FALLBACK_TITLE = "Transformons\nvotre prochain\névénement _pro._";
const FALLBACK_DESCRIPTION =
  "Échange découverte de 30 minutes. Aïssa vous reçoit personnellement pour comprendre vos enjeux et imaginer l'événement qui marquera vos invités. Devis sous 48 h.";

export function EvenementCtaFinal({ data }: { data?: FinalCtaData }) {
  if (data?.enabled === false) return null;

  const title = data?.title ?? FALLBACK_TITLE;
  const description = data?.description ?? FALLBACK_DESCRIPTION;

  const ctas = (data?.ctas ?? [])
    .map((c) => resolveCta(c))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <section className="relative bg-cream-soft py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[28px] bg-ink px-10 py-20 text-center text-cream sm:px-16 sm:py-24 lg:py-28"
        >
          <motion.div
            aria-hidden
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 30% 50%, rgba(61, 37, 73, 0.5) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(184, 146, 78, 0.22) 0%, transparent 50%)",
              backgroundSize: "200% 100%",
            }}
          />

          <div className="relative">
            <p className="mb-6 inline-flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-soft">
              <span className="size-2 animate-pulse rounded-full bg-gold" />
              {FALLBACK_EYEBROW}
            </p>
            <h2
              className="mx-auto max-w-[860px] font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[60px] lg:text-[80px]"
              style={{ fontWeight: 300 }}
            >
              {title.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {renderInlineItalic(line, {
                    italicClassName: "italic text-gold-soft",
                  })}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>
            {description && (
              <p className="mx-auto mt-7 max-w-[620px] font-serif text-[18px] italic leading-[1.6] text-cream/75">
                {description}
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {ctas.length > 0 ? (
                ctas.map((cta, i) => {
                  const isPrimary =
                    i === 0 && cta.variant !== "secondary" && cta.variant !== "ghost";
                  if (cta.external) {
                    return (
                      <a
                        key={cta.href + cta.label}
                        href={cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          isPrimary
                            ? "group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-[0_12px_32px_rgba(184,146,78,0.35)]"
                            : "inline-flex items-center gap-2 rounded-full border border-cream px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-all hover:-translate-y-0.5 hover:bg-cream hover:text-ink"
                        }
                      >
                        {cta.label}
                        {isPrimary && (
                          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                        )}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={cta.href + cta.label}
                      href={cta.href}
                      className={
                        isPrimary
                          ? "group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-[0_12px_32px_rgba(184,146,78,0.35)]"
                          : "inline-flex items-center gap-2 rounded-full border border-cream px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-all hover:-translate-y-0.5 hover:bg-cream hover:text-ink"
                      }
                    >
                      {cta.label}
                      {isPrimary && (
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      )}
                    </Link>
                  );
                })
              ) : (
                <>
                  <a
                    href={buildCalendlyUrl({
                      source: "evenement",
                      content: "cta-final",
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-[0_12px_32px_rgba(184,146,78,0.35)]"
                  >
                    Réserver un appel
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </a>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 rounded-full border border-cream px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-all hover:-translate-y-0.5 hover:bg-cream hover:text-ink"
                  >
                    Décrire mon projet
                  </Link>
                </>
              )}
              <a
                href="tel:+33661948859"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-cream/70 transition-colors hover:text-cream"
              >
                <Phone className="size-3.5" strokeWidth={1.5} />
                06 61 94 88 59
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
