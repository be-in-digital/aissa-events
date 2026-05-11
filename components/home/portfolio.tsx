"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Maximize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eyebrow } from "./eyebrow";

type Item = {
  src: string;
  tag: string;
  title: string;
  className: string;
};

const ITEMS: Item[] = [
  {
    src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=85",
    tag: "Mariage · Domaine privé",
    title: "Une cérémonie à ciel ouvert",
    className: "lg:col-span-2 lg:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=85",
    tag: "Soirée corporate",
    title: "Lancement de marque, énergie nocturne",
    className: "lg:col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=85",
    tag: "Espace Events",
    title: "Henné en petit comité, lumières dorées",
    className: "lg:col-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85",
    tag: "Mariage civil",
    title: "Bouquet maison, fleurs de saison",
    className: "lg:col-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=85",
    tag: "Réception",
    title: "Tablée d'honneur, nappage texturé",
    className: "lg:col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=85",
    tag: "After party",
    title: "Piste de danse, set live",
    className: "lg:col-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=85",
    tag: "Anniversaire",
    title: "Décor floral suspendu",
    className: "lg:col-span-1",
  },
];

export function Portfolio() {
  const [active, setActive] = useState<number | null>(null);
  const item = active !== null ? ITEMS[active] : null;

  return (
    <section id="portfolio" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          <div className="mb-6">
            <Eyebrow align="center">Réalisations</Eyebrow>
          </div>
          <h2
            className="mx-auto max-w-3xl font-serif text-[44px] leading-[0.95] tracking-[-0.03em] sm:text-[60px] lg:text-[88px]"
            style={{ fontWeight: 300 }}
          >
            Des ambiances
            <br />
            qui marquent <em className="italic text-bordeaux">les esprits.</em>
          </h2>
        </motion.div>

        <div className="grid auto-rows-[260px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:auto-rows-[280px]">
          {ITEMS.map((it, i) => (
            <motion.button
              key={it.title}
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
              className={`group relative overflow-hidden rounded-[20px] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${it.className}`}
              aria-label={`Agrandir : ${it.title}`}
            >
              <Image
                src={it.src}
                alt={it.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
                style={{
                  filter: "contrast(1.06) saturate(0.95) sepia(0.05)",
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-cream/90 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                <Maximize2 className="size-4" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-7 text-cream opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-gold-soft">
                  {it.tag}
                </p>
                <p className="font-serif text-[20px] italic leading-tight">
                  {it.title}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 flex flex-col items-center gap-3 text-center"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-ink">
            + 50 événements orchestrés depuis 2020
          </p>
          <Link
            href="/realisations"
            className="group inline-flex items-center gap-2 rounded-full border border-ink px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-cream"
          >
            Voir toutes les réalisations
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
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
              <div className="relative aspect-[4/3] w-full bg-ink/5">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col gap-2 px-8 py-6 sm:px-10 sm:py-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                  {item.tag}
                </p>
                <DialogTitle
                  className="font-serif text-[26px] italic leading-[1.2] tracking-[-0.02em] text-ink sm:text-[30px]"
                  style={{ fontWeight: 400 }}
                >
                  {item.title}
                </DialogTitle>
                <DialogDescription className="text-[14px] text-ink-soft">
                  Une réalisation Aïssa Events. Découvrez l&apos;ensemble du
                  portfolio sur la page Réalisations.
                </DialogDescription>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
