import { Quote } from "lucide-react";

export type TestimonialCardData = {
  quote: string;
  name: string;
  /** Texte affiché à droite du nom : rôle, événement, secteur, etc. */
  meta?: string;
  rating?: number;
};

/**
 * Carte témoignage unifiée, partagée par toutes les pages (home, mariage,
 * espace, événements pro). Design éditorial minimal : étoiles, citation,
 * nom en script, meta en mono uppercase.
 */
export function TestimonialCard({ data }: { data: TestimonialCardData }) {
  const rating = Math.min(Math.max(data.rating ?? 5, 0), 5);
  return (
    <figure className="relative flex h-full flex-col rounded-3xl border border-[var(--rule-soft)] bg-cream-soft p-12 sm:p-16">
      <Quote
        aria-hidden
        className="absolute right-10 top-10 size-12 -scale-x-100 text-bordeaux/15"
        strokeWidth={1.25}
        fill="currentColor"
      />
      {rating > 0 && (
        <p className="mb-7 font-mono text-[14px] tracking-[0.32em] text-gold">
          {"★ ".repeat(rating).trim()}
        </p>
      )}
      {data.quote && (
        <blockquote
          className="mb-9 font-serif text-[20px] italic leading-[1.55] text-ink sm:text-[24px]"
          style={{ fontWeight: 300 }}
        >
          {data.quote}
        </blockquote>
      )}
      <figcaption className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-[var(--rule)] pt-6">
        <span className="font-script text-[40px] leading-none text-bordeaux">
          {data.name}
        </span>
        {data.meta && (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink">
            {data.meta}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
