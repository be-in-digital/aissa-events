import Image from "next/image";

export type Tutorial = {
  id: string;
  number: string;
  title: string;
  description: string;
  /** Capture utilisée comme aperçu (poster) de la vidéo. */
  poster: string;
  /** Chemin de la vidéo MP4 (dans /public). Absent = vidéo à venir. */
  src?: string;
  /** Sous-titres WebVTT (dans /public). Affichés par défaut dans le lecteur. */
  captions?: string;
  /** Pas-à-pas affiché à côté de la vidéo. */
  steps: string[];
};

/**
 * Carte d'un tutoriel : vidéo (ou aperçu si la vidéo n'est pas encore prête)
 * + liste d'étapes. Server Component, lecteur HTML natif (aucun JS custom).
 */
export function VideoCard({ tutorial }: { tutorial: Tutorial }) {
  const { id, number, title, description, poster, src, captions, steps } =
    tutorial;
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-[24px] border border-[var(--rule-soft)] bg-card-soft p-6 sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-start">
        {/* Vidéo / aperçu */}
        <div className="overflow-hidden rounded-[16px] border border-[var(--rule-soft)] bg-cream">
          {src ? (
            <video
              controls
              preload="none"
              poster={poster}
              className="aspect-video w-full bg-ink object-contain"
            >
              <source src={src} type="video/mp4" />
              {captions && (
                <track
                  kind="subtitles"
                  src={captions}
                  srcLang="fr"
                  label="Français"
                  default
                />
              )}
              Ton navigateur ne peut pas lire cette vidéo.
            </video>
          ) : (
            <div className="relative aspect-video w-full">
              <Image
                src={poster}
                alt={`Aperçu — ${title}`}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/45">
                <span className="rounded-full bg-cream/95 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
                  🎬 Vidéo en préparation
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Étapes */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
            Tutoriel {number}
          </p>
          <h3
            className="mt-2 font-serif text-[24px] leading-[1.15] tracking-[-0.01em] text-ink sm:text-[28px]"
            style={{ fontWeight: 400 }}
          >
            {title}
          </h3>
          <p className="mt-3 text-[14px] leading-[1.65] text-ink-soft">
            {description}
          </p>
          <ol className="mt-5 space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-[14px] leading-[1.55] text-ink">
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-bordeaux font-mono text-[11px] text-cream">
                  {i + 1}
                </span>
                <span dangerouslySetInnerHTML={{ __html: step }} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
