"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Calendar, Eye } from "lucide-react";
import { buildCalendlyUrl } from "@/lib/calendly";
import { availabilityLine } from "@/lib/availability";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type NotYetDecidedData = NonNullable<EspaceEventsPageQueryResult>["notYetDecided"];

const FALLBACK_EYEBROW = "Étape intermédiaire";
const FALLBACK_TITLE = "Pas encore _décidé ?_";
const FALLBACK_DESCRIPTION =
  "Vérifiez si votre date est libre ou venez voir la salle (visite gratuite, 30-45 min). Pas d'engagement, pas de pression commerciale.";

export function NotYetDecided({ data }: { data?: NotYetDecidedData }) {
  if (data?.enabled === false) return null;

  const title = data?.title ?? FALLBACK_TITLE;
  const description = data?.description ?? FALLBACK_DESCRIPTION;

  const ctas = (data?.ctas ?? [])
    .map((c) => resolveCta(c))
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .slice(0, 2);

  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[28px] border border-[var(--rule)] bg-cream-soft p-9 sm:p-12 lg:p-14"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 right-[-10%] size-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(184, 146, 78, 0.10) 0%, transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 -left-20 size-96 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(122, 46, 67, 0.06) 0%, transparent 70%)",
            }}
          />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
            <div>
              <p className="mb-4 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-bordeaux">
                <span className="size-2 animate-pulse rounded-full bg-bordeaux" />
                {FALLBACK_EYEBROW}
              </p>
              <h2
                className="font-serif text-[34px] leading-[1] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]"
                style={{ fontWeight: 300 }}
              >
                {renderInlineItalic(title)}
              </h2>
              <p
                className="mt-5 max-w-[480px] font-serif text-[16px] italic leading-[1.6] text-ink-soft sm:text-[18px]"
                style={{ fontWeight: 300 }}
              >
                {description}
              </p>
            </div>

            <div>
              <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
                <span className="size-1.5 animate-pulse rounded-full bg-bordeaux" />
                {availabilityLine()}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:gap-3">
                {ctas.length > 0 ? (
                  ctas.map((cta, i) => {
                    const isPrimary = i === ctas.length - 1;
                    const Icon = isPrimary ? Eye : Calendar;
                    if (cta.external) {
                      return (
                        <a
                          key={cta.href + cta.label}
                          href={cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            isPrimary
                              ? "group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full bg-bordeaux px-6 py-4 text-cream transition-all duration-500 hover:-translate-y-0.5 hover:bg-bordeaux-deep hover:shadow-[0_14px_40px_rgba(122,46,67,0.20)]"
                              : "group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full border border-bordeaux/30 bg-cream px-6 py-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-bordeaux hover:shadow-[0_14px_40px_rgba(122,46,67,0.10)]"
                          }
                        >
                          <span className="flex items-center gap-3">
                            <Icon
                              className={
                                isPrimary
                                  ? "size-4"
                                  : "size-4 text-bordeaux"
                              }
                              strokeWidth={1.5}
                            />
                            <span
                              className={
                                isPrimary
                                  ? "font-mono text-[11px] uppercase tracking-[0.22em]"
                                  : "font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
                              }
                            >
                              {cta.label}
                            </span>
                          </span>
                          <ArrowUpRight
                            className={
                              isPrimary
                                ? "size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                : "size-3.5 text-bordeaux transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            }
                          />
                        </a>
                      );
                    }
                    return (
                      <Link
                        key={cta.href + cta.label}
                        href={cta.href}
                        className={
                          isPrimary
                            ? "group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full bg-bordeaux px-6 py-4 text-cream transition-all duration-500 hover:-translate-y-0.5 hover:bg-bordeaux-deep hover:shadow-[0_14px_40px_rgba(122,46,67,0.20)]"
                            : "group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full border border-bordeaux/30 bg-cream px-6 py-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-bordeaux hover:shadow-[0_14px_40px_rgba(122,46,67,0.10)]"
                        }
                      >
                        <span className="flex items-center gap-3">
                          <Icon
                            className={isPrimary ? "size-4" : "size-4 text-bordeaux"}
                            strokeWidth={1.5}
                          />
                          <span
                            className={
                              isPrimary
                                ? "font-mono text-[11px] uppercase tracking-[0.22em]"
                                : "font-mono text-[11px] uppercase tracking-[0.22em] text-ink"
                            }
                          >
                            {cta.label}
                          </span>
                        </span>
                        <ArrowUpRight
                          className={
                            isPrimary
                              ? "size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              : "size-3.5 text-bordeaux transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          }
                        />
                      </Link>
                    );
                  })
                ) : (
                  <>
                    <Link
                      href="/#contact"
                      className="group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full border border-bordeaux/30 bg-cream px-6 py-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-bordeaux hover:shadow-[0_14px_40px_rgba(122,46,67,0.10)]"
                    >
                      <span className="flex items-center gap-3">
                        <Calendar
                          className="size-4 text-bordeaux"
                          strokeWidth={1.5}
                        />
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                          Vérifier la disponibilité
                        </span>
                      </span>
                      <ArrowUpRight className="size-3.5 text-bordeaux transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                    <a
                      href={buildCalendlyUrl({ content: "not-yet-decided" })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full bg-bordeaux px-6 py-4 text-cream transition-all duration-500 hover:-translate-y-0.5 hover:bg-bordeaux-deep hover:shadow-[0_14px_40px_rgba(122,46,67,0.20)]"
                    >
                      <span className="flex items-center gap-3">
                        <Eye className="size-4" strokeWidth={1.5} />
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
                          Réserver une visite
                        </span>
                      </span>
                      <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
