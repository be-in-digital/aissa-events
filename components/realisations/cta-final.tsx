"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import type { RealisationsPageQueryResult } from "@/sanity.types";

type FinalCtaData = NonNullable<RealisationsPageQueryResult>["finalCta"];

export function RealisationsCtaFinal({ data }: { data?: FinalCtaData }) {
  if (data?.enabled === false) return null;
  if (!data?.title) return null;

  const title = data.title;
  const description = data?.description;

  const ctas = (data?.ctas ?? [])
    .map((c) => resolveCta(c))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  if (!ctas.length) return null;

  return (
    <section className="relative py-28 sm:py-36">
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
              {ctas.map((cta, i) => {
                const isPrimary =
                  i === 0 &&
                  cta.variant !== "secondary" &&
                  cta.variant !== "ghost";
                return (
                  <a
                    key={cta.href + cta.label}
                    href={cta.href}
                    target={cta.external ? "_blank" : undefined}
                    rel={cta.external ? "noopener noreferrer" : undefined}
                    className={
                      isPrimary
                        ? "group inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-gold-soft hover:shadow-[0_12px_32px_rgba(184,146,78,0.35)]"
                        : "inline-flex items-center gap-2 rounded-full border border-cream px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-cream hover:text-ink"
                    }
                  >
                    {cta.label}
                    {isPrimary && (
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
