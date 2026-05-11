"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { urlForImageString } from "@/lib/sanity/image";
import type { RealisationBySlugQueryResult } from "@/sanity.types";

type GalleryItem = NonNullable<
  NonNullable<RealisationBySlugQueryResult>["gallery"]
>[number];

const SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-1",
  "sm:col-span-2",
  "sm:col-span-1",
  "sm:col-span-1",
];

export function RealisationDetailGallery({
  gallery,
}: {
  gallery: GalleryItem[];
}) {
  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="relative bg-cream-soft py-20 sm:py-28">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="mb-5">
            <Eyebrow>Galerie</Eyebrow>
          </div>
          <h2
            className="font-serif text-[32px] leading-[1.05] tracking-[-0.03em] sm:text-[40px] lg:text-[48px]"
            style={{ fontWeight: 300 }}
          >
            Le projet en <em className="font-normal italic text-bordeaux">images.</em>
          </h2>
        </motion.div>

        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 sm:auto-rows-[240px] sm:grid-cols-3 sm:gap-5 lg:auto-rows-[260px] lg:grid-cols-4">
          {gallery.map((img, i) => {
            if (!img?.asset) return null;
            const src = urlForImageString(img, { width: 1200, quality: 85 });
            const span = SPANS[i % SPANS.length];
            return (
              <motion.div
                key={img._key ?? i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: (i % 4) * 0.08,
                }}
                className={`relative overflow-hidden rounded-[20px] ${span}`}
              >
                <Image
                  src={src}
                  alt={img.alt || ""}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[800ms] ease-out hover:scale-[1.04]"
                  style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
