"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { urlForImageString } from "@/lib/sanity/image";

// ─── Types ──────────────────────────────────────────────────────────────────

export type VideoItem = {
  _type: "realisationVideo";
  _key?: string;
  videoType: "url" | "mux";
  url?: string | null;
  muxPlaybackId?: string | null;
  poster?: {
    asset?: { _id: string; url: string; metadata?: { dimensions?: { width: number; height: number }; lqip?: string } } | null;
    alt?: string | null;
  } | null;
  caption?: string | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Transforme une URL YouTube/Vimeo en embed URL avec autoplay */
function toEmbedUrl(raw: string, autoplay = false): string | null {
  try {
    const u = new URL(raw);

    // YouTube: youtu.be/<id> ou youtube.com/watch?v=<id>
    if (u.hostname === "youtu.be" || u.hostname.includes("youtube.com")) {
      const id =
        u.hostname === "youtu.be"
          ? u.pathname.slice(1)
          : u.searchParams.get("v") ?? u.pathname.split("/").pop();
      if (!id) return null;
      const params = new URLSearchParams({
        autoplay: autoplay ? "1" : "0",
        mute: "1",
        controls: autoplay ? "0" : "1",
        loop: "1",
        playlist: id,
        rel: "0",
        modestbranding: "1",
      });
      return `https://www.youtube-nocookie.com/embed/${id}?${params}`;
    }

    // Vimeo: vimeo.com/<id>
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      if (!id) return null;
      const params = new URLSearchParams({
        autoplay: autoplay ? "1" : "0",
        muted: "1",
        loop: "1",
        controls: autoplay ? "0" : "1",
        title: "0",
        byline: "0",
        portrait: "0",
      });
      return `https://player.vimeo.com/video/${id}?${params}`;
    }

    // URL directe MP4 — pas d'embed, on gère avec <video>
    return null;
  } catch {
    return null;
  }
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url);
}

// ─── Composant thumbnail (dans la grille) ────────────────────────────────────

export function VideoThumbnail({
  item,
  onClick,
}: {
  item: VideoItem;
  onClick: () => void;
}) {
  const posterUrl = item.poster?.asset
    ? urlForImageString(item.poster, { width: 800, quality: 85 })
    : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-[20px] bg-ink/10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      aria-label={`Lire la vidéo${item.caption ? ` : ${item.caption}` : ""}`}
    >
      {/* Poster */}
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt={item.poster?.alt ?? item.caption ?? "Vidéo"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.05]"
          style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-bordeaux/20 to-ink/40" />
      )}

      {/* Overlay sombre */}
      <div className="pointer-events-none absolute inset-0 bg-ink/30 transition-colors duration-300 group-hover:bg-ink/50" />

      {/* Bouton play */}
      <div className="relative z-10 flex size-16 items-center justify-center rounded-full bg-cream/90 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
        <Play className="size-6 translate-x-0.5 fill-current" />
      </div>

      {/* Badge vidéo */}
      <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-ink/55 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cream backdrop-blur-sm">
        <Play className="size-2.5 fill-current" />
        Vidéo
      </div>

      {/* Caption */}
      {item.caption && (
        <div className="absolute inset-x-0 bottom-0 translate-y-2 p-6 text-cream opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100">
          <p className="font-serif text-[16px] italic leading-tight">
            {item.caption}
          </p>
        </div>
      )}
    </button>
  );
}

// ─── Player plein écran (dans le lightbox) ───────────────────────────────────

export function VideoLightboxPlayer({ item }: { item: VideoItem }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  // Cas Mux
  if (item.videoType === "mux" && item.muxPlaybackId) {
    const src = `https://stream.mux.com/${item.muxPlaybackId}.m3u8`;
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay
          playsInline
          className="max-h-full max-w-full rounded-lg"
          style={{ aspectRatio: "16/9", width: "100%" }}
        />
      </div>
    );
  }

  if (!item.url) return null;

  // MP4 direct
  if (isDirectVideo(item.url)) {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <video
          ref={videoRef}
          src={item.url}
          controls
          autoPlay
          playsInline
          className="max-h-full max-w-full rounded-lg"
          style={{ aspectRatio: "16/9", width: "100%" }}
        />
      </div>
    );
  }

  // YouTube / Vimeo embed
  const embedUrl = toEmbedUrl(item.url, true);
  if (embedUrl) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-lg"
        style={{ aspectRatio: "16/9" }}
      >
        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={item.caption ?? "Vidéo réalisation"}
        />
      </div>
    );
  }

  // Lien non-reconnu : bouton externe
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-cream">
      <Play className="size-16 opacity-50" />
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-cream/20 px-6 py-3 text-sm backdrop-blur transition hover:bg-cream/30"
      >
        Ouvrir la vidéo
      </a>
    </div>
  );

  // Évite le warning de variable non utilisée
  void playing;
  void setPlaying;
}
