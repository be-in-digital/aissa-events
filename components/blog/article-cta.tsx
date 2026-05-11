"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { buildCalendlyUrl } from "@/lib/calendly";
import { resolveCta } from "@/lib/sanity/cta";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { BlogPageQueryResult } from "@/sanity.types";

type ArticleCtaData = NonNullable<BlogPageQueryResult>["articleCta"];

const FALLBACK_EYEBROW = "Et si on en parlait ?";
const FALLBACK_TITLE = "Votre projet\nmérite la _même attention._";
const FALLBACK_DESCRIPTION =
  "Échange découverte de 30 minutes, gratuit et sans engagement. Aïssa vous reçoit personnellement pour comprendre vos enjeux.";

export function BlogArticleCta({ data }: { data?: ArticleCtaData }) {
  if (data?.enabled === false) return null;

  const title = data?.title ?? FALLBACK_TITLE;
  const description = data?.description ?? FALLBACK_DESCRIPTION;

  const ctas = (data?.ctas ?? [])
    .map((c) => resolveCta(c))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <section className="relative bg-cream-soft py-20 sm:py-28">
      <div className="mx-auto max-w-[1100px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[28px] border border-[var(--rule)] bg-cream p-10 sm:p-14 lg:p-16"
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
                className="font-serif text-[32px] leading-[1.05] tracking-[-0.03em] sm:text-[40px] lg:text-[52px]"
                style={{ fontWeight: 300 }}
              >
                {title.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {renderInlineItalic(line)}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
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

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              {ctas.length > 0 ? (
                ctas.map((cta, i) => {
                  const isPrimary =
                    i === 0 &&
                    cta.variant !== "secondary" &&
                    cta.variant !== "ghost";
                  const className = isPrimary
                    ? "group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full bg-bordeaux px-6 py-4 text-cream transition-all duration-500 hover:-translate-y-0.5 hover:bg-bordeaux-deep hover:shadow-[0_14px_40px_rgba(122,46,67,0.20)]"
                    : "group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full border border-bordeaux/30 bg-cream px-6 py-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-bordeaux";

                  const labelSpan = (
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.22em] ${
                        isPrimary ? "" : "text-ink"
                      }`}
                    >
                      {cta.label}
                    </span>
                  );
                  const arrow = (
                    <ArrowRight
                      className={`size-3.5 transition-transform group-hover:translate-x-0.5 ${
                        isPrimary ? "" : "text-bordeaux"
                      }`}
                    />
                  );

                  if (cta.external) {
                    return (
                      <a
                        key={cta.href + cta.label}
                        href={cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {labelSpan}
                        {arrow}
                      </a>
                    );
                  }
                  return (
                    <Link
                      key={cta.href + cta.label}
                      href={cta.href}
                      className={className}
                    >
                      {labelSpan}
                      {arrow}
                    </Link>
                  );
                })
              ) : (
                <>
                  <a
                    href={buildCalendlyUrl({
                      source: "blog",
                      content: "article-cta",
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full bg-bordeaux px-6 py-4 text-cream transition-all duration-500 hover:-translate-y-0.5 hover:bg-bordeaux-deep hover:shadow-[0_14px_40px_rgba(122,46,67,0.20)]"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em]">
                      Réserver un appel
                    </span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <Link
                    href="/realisations"
                    className="group inline-flex min-w-[260px] items-center justify-between gap-4 rounded-full border border-bordeaux/30 bg-cream px-6 py-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-bordeaux"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink">
                      Voir nos réalisations
                    </span>
                    <ArrowRight className="size-3.5 text-bordeaux transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
