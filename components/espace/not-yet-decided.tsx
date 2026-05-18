"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Calendar, Eye } from "lucide-react";
import { availabilityLineSync } from "@/lib/availability";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta, type ResolvedCta } from "@/lib/sanity/cta";
import { openAvailabilityDialog } from "@/components/availability/dialog";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

/**
 * Reconnaît un CTA destiné à ouvrir la modale de disponibilités, soit par son
 * href (`#disponibilites`, scope page ou cross-page), soit par son label
 * (cas du seed historique qui pointe vers `/#contact`).
 */
function isAvailabilityCta(cta: ResolvedCta) {
  const href = cta.href.toLowerCase();
  if (href === "#disponibilites" || href.endsWith("/#disponibilites")) {
    return true;
  }
  const label = cta.label.toLowerCase();
  return label.includes("disponibilit") && label.includes("vérif");
}

type NotYetDecidedData = NonNullable<EspaceEventsPageQueryResult>["notYetDecided"];

export function NotYetDecided({
  data,
  availabilityLabel,
}: {
  data?: NotYetDecidedData;
  availabilityLabel?: string;
}) {
  if (data?.enabled === false) return null;
  if (!data?.title) return null;

  const title = data.title;
  const description = data.description;

  const ctas = (data.ctas ?? [])
    .map((c) => resolveCta(c))
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .slice(0, 2);

  if (ctas.length === 0) return null;

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
              <h2
                className="font-serif text-[34px] leading-[1] tracking-[-0.03em] sm:text-[44px] lg:text-[52px]"
                style={{ fontWeight: 300 }}
              >
                {renderInlineItalic(title)}
              </h2>
              {description && (
                <p
                  className="mt-5 max-w-[480px] font-serif text-[16px] italic leading-[1.6] text-ink-soft sm:text-[18px]"
                  style={{ fontWeight: 300 }}
                >
                  {description}
                </p>
              )}
            </div>

            <div>
              <p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
                <span className="size-1.5 animate-pulse rounded-full bg-bordeaux" />
                {availabilityLabel ?? availabilityLineSync()}
              </p>
              <div className="flex flex-col gap-3">
                {ctas.map((cta, i) => {
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
                            ? "group inline-flex w-full items-center justify-between gap-4 rounded-full bg-bordeaux px-6 py-4 text-cream transition-all duration-500 hover:-translate-y-0.5 hover:bg-bordeaux-deep hover:shadow-[0_14px_40px_rgba(122,46,67,0.20)] sm:w-auto sm:min-w-[300px]"
                            : "group inline-flex w-full items-center justify-between gap-4 rounded-full border border-bordeaux/30 bg-cream px-6 py-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-bordeaux hover:shadow-[0_14px_40px_rgba(122,46,67,0.10)] sm:w-auto sm:min-w-[300px]"
                        }
                      >
                        <span className="flex items-center gap-3">
                          <Icon
                            className={
                              isPrimary ? "size-4" : "size-4 text-bordeaux"
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
                  const opensDialog = isAvailabilityCta(cta);
                  return (
                    <Link
                      key={cta.href + cta.label}
                      href={opensDialog ? "#disponibilites" : cta.href}
                      onClick={
                        opensDialog
                          ? () => {
                              // Léger délai pour laisser le scroll vers la
                              // section démarrer avant l'ouverture du dialog.
                              window.setTimeout(openAvailabilityDialog, 200);
                            }
                          : undefined
                      }
                      className={
                        isPrimary
                          ? "group inline-flex w-full items-center justify-between gap-4 rounded-full bg-bordeaux px-6 py-4 text-cream transition-all duration-500 hover:-translate-y-0.5 hover:bg-bordeaux-deep hover:shadow-[0_14px_40px_rgba(122,46,67,0.20)] sm:w-auto sm:min-w-[300px]"
                          : "group inline-flex w-full items-center justify-between gap-4 rounded-full border border-bordeaux/30 bg-cream px-6 py-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-bordeaux hover:shadow-[0_14px_40px_rgba(122,46,67,0.10)] sm:w-auto sm:min-w-[300px]"
                      }
                    >
                      <span className="flex items-center gap-3">
                        <Icon
                          className={
                            isPrimary ? "size-4" : "size-4 text-bordeaux"
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
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
