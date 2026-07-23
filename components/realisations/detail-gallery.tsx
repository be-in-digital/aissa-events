"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { urlForImageString } from "@/lib/sanity/image";
import { VideoLightboxPlayer } from "./video-player";
import type { VideoItem } from "./video-player";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

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
          {gallery.map((item, i) => {
            if (!item) return null;
            const span = SPANS[i % SPANS.length];

            // Vidéo
            if (item._type === "realisationVideo") {
              const video = item as unknown as VideoItem;
              const posterUrl = video.poster?.asset
                ? urlForImageString(video.poster, { width: 800, quality: 80 })
                : null;
              return (
                <motion.button
                  key={item._key ?? i}
                  type="button"
                  onClick={() => setActiveVideo(video)}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.08 }}
                  className={`group relative overflow-hidden rounded-[20px] focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux ${span}`}
                  aria-label={`Lire la vidéo${video.caption ? ` : ${video.caption}` : ""}`}
                >
                  {posterUrl ? (
                    <Image
                      src={posterUrl}
                      alt={video.poster?.alt ?? video.caption ?? "Vidéo"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                      style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-bordeaux/20 to-ink/40" />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-ink/30 transition-colors duration-300 group-hover:bg-ink/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-14 items-center justify-center rounded-full bg-cream/90 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play className="size-5 translate-x-0.5 fill-current" />
                    </div>
                  </div>
                </motion.button>
              );
            }

            // Image (imageWithAlt)
            const imgItem = item as { _type: "imageWithAlt"; _key?: string; asset?: { _id: string; url: string | null } | null; alt?: string | null };
            if (!imgItem?.asset) return null;
            const src = urlForImageString(imgItem as Parameters<typeof urlForImageString>[0], { width: 1200, quality: 85 });
            return (
              <motion.div
                key={imgItem._key ?? i}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.08 }}
                className={`relative overflow-hidden rounded-[20px] ${span}`}
              >
                <Image
                  src={src}
                  alt={imgItem.alt || ""}
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

      {/* Lightbox vidéo */}
      <Dialog open={activeVideo !== null} onOpenChange={(open) => { if (!open) setActiveVideo(null); }}>
        <DialogContent
          className="flex h-[100dvh] w-screen max-w-none items-center justify-center gap-0 border-0 bg-ink/95 p-0 ring-0 sm:rounded-none"
          showCloseButton
        >
          <DialogTitle className="sr-only">Vidéo — {activeVideo?.caption ?? "réalisation"}</DialogTitle>
          <DialogDescription className="sr-only">Lecteur vidéo plein écran.</DialogDescription>
          {activeVideo && (
            <div className="w-full max-w-4xl px-4">
              <VideoLightboxPlayer item={activeVideo} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
