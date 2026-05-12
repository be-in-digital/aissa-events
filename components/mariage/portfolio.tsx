"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { resolveCta } from "@/lib/sanity/cta";
import { urlForImageString } from "@/lib/sanity/image";
import type { MariagePageQueryResult } from "@/sanity.types";

type PortfolioData = NonNullable<MariagePageQueryResult>["portfolio"];

// Pattern de spans pour la grille bento, appliqué de façon cyclique
const SPAN_PATTERN = [
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
];

export function MariagePortfolio({ data }: { data?: PortfolioData }) {
  const [active, setActive] = useState<number | null>(null);

  if (data?.enabled === false) return null;
  if (!data?.items?.length) return null;

  const eyebrow = data?.eyebrow;
  const title = data?.title;
  const intro = data?.intro;
  const footerEyebrow = data?.footerEyebrow;
  const footerCta = resolveCta(data?.footerCta ?? null);

  const items = data.items.map((item, idx) => ({
    title: item?.shortTitle ?? item?.title ?? "",
    tag: item?.typeLabel ?? item?.type ?? "",
    description: item?.story ?? "",
    src: item?.cover?.asset
      ? urlForImageString(item.cover, { width: 1200, quality: 85 })
      : null,
    alt: item?.cover?.alt || item?.shortTitle || item?.title || "",
    span: SPAN_PATTERN[idx % SPAN_PATTERN.length],
  }));

  const item = active !== null ? items[active] : null;

  return (
    <section
      id="portfolio-mariage"
      className="relative bg-cream py-28 sm:py-36"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 grid items-end gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20"
        >
          <div>
            {eyebrow && (
              <div className="mb-6">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            {title && (
              <h2
                className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
                style={{ fontWeight: 300 }}
              >
                {title.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {renderInlineItalic(line)}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </h2>
            )}
          </div>
          {intro && (
            <p
              className="max-w-md font-serif text-[17px] italic leading-[1.55] text-ink-soft sm:text-[19px]"
              style={{ fontWeight: 300 }}
            >
              {intro}
            </p>
          )}
        </motion.div>

        <div className="grid auto-rows-[240px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:auto-rows-[260px]">
          {items.map((it, i) => (
            <motion.button
              key={`${it.title}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: i * 0.06,
              }}
              className={`group relative overflow-hidden rounded-[20px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${it.span}`}
              aria-label={`Agrandir : ${it.title}`}
            >
              {it.src && (
                <Image
                  src={it.src}
                  alt={it.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
                  style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
                />
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-cream/90 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                <Maximize2 className="size-4" />
              </div>
              <div className="absolute inset-x-0 bottom-0 translate-y-3 p-6 text-cream opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                {it.tag && (
                  <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-gold-soft">
                    {it.tag}
                  </p>
                )}
                <p className="font-serif text-[19px] italic leading-tight">
                  {it.title}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {(footerEyebrow || footerCta) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 flex flex-col items-center gap-3 text-center"
          >
            {footerEyebrow && (
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-ink">
                {footerEyebrow}
              </p>
            )}
            {footerCta && (
              <a
                href={footerCta.href}
                target={footerCta.external ? "_blank" : undefined}
                rel={footerCta.external ? "noopener noreferrer" : undefined}
                className="group inline-flex items-center gap-2 rounded-full border border-ink px-9 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.22em] text-ink transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream"
              >
                {footerCta.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </motion.div>
        )}
      </div>

      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent
          className="grid w-[calc(100%-2rem)] max-w-5xl gap-0 overflow-hidden rounded-[20px] border-0 bg-cream p-0 ring-0 sm:max-w-5xl"
          showCloseButton={false}
        >
          {item && (
            <>
              {item.src && (
                <div className="relative aspect-[4/3] w-full bg-ink/5">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <div className="flex flex-col gap-2 px-8 py-6 sm:px-10 sm:py-8">
                {item.tag && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                    {item.tag}
                  </p>
                )}
                <DialogTitle
                  className="font-serif text-[26px] italic leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]"
                  style={{ fontWeight: 400 }}
                >
                  {item.title}
                </DialogTitle>
                {item.description && (
                  <DialogDescription className="text-[14px] leading-[1.7] text-ink-soft">
                    {item.description}
                  </DialogDescription>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
