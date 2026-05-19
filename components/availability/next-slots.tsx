import Link from "next/link";
import { connection } from "next/server";
import { ArrowRight, Calendar } from "lucide-react";
import { buildCalendlyUrl } from "@/lib/calendly";
import { getAvailabilityData } from "@/lib/availability/server";
import { getNextFreeDates } from "@/lib/availability";

type Props = {
  /** Identifie la source dans l'UTM Calendly : `espace-events`, `mariage`, `evenements-pro`. */
  utmSource: string;
  /** Préfixe envoyé en `utm_content` (la date YYYY-MM-DD sera concaténée). */
  utmContent?: string;
  /** Nombre de slots à afficher (par défaut 3). */
  count?: number;
  /** Eyebrow optionnelle au-dessus de la liste. */
  eyebrow?: string;
  /** Titre principal de la pill. */
  title?: string;
};

const formatDateFR = (d: Date) =>
  d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export async function NextSlots({
  utmSource,
  utmContent = "next-slots",
  count = 3,
  eyebrow = "Prochaines dates",
  title = "Les samedis encore libres",
}: Props) {
  await connection();
  const data = await getAvailabilityData();
  const slots = getNextFreeDates(data, { count });

  if (slots.length === 0) {
    return (
      <div className="mx-auto max-w-[680px] rounded-2xl border border-[var(--rule)] bg-cream-soft px-6 py-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
          {eyebrow}
        </p>
        <p className="mt-2 font-serif text-[18px] italic text-ink-soft">
          Plus de samedis libres sur les prochains mois — on peut regarder plus
          loin ensemble.
        </p>
        <Link
          href={buildCalendlyUrl({
            source: utmSource,
            content: `${utmContent}-waitlist`,
          })}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-bordeaux underline-offset-4 hover:underline"
        >
          Échanger avec Aïssa
          <ArrowRight className="size-3.5" strokeWidth={1.5} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[760px] rounded-2xl border border-[var(--rule)] bg-cream-soft px-6 py-5 sm:px-8 sm:py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
            <span className="size-1.5 animate-pulse rounded-full bg-bordeaux" />
            {eyebrow}
          </p>
          <p className="mt-1 font-serif text-[18px] italic text-ink sm:text-[20px]">
            {title}
          </p>
        </div>
        <Calendar
          className="hidden size-5 text-bordeaux sm:block"
          strokeWidth={1.5}
        />
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {slots.map((slot) => {
          const iso = toISODate(slot);
          return (
            <li key={iso}>
              <Link
                href={buildCalendlyUrl({
                  source: utmSource,
                  content: `${utmContent}-${iso}`,
                  preferredDate: iso,
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-bordeaux/30 bg-cream px-4 py-2 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 hover:border-bordeaux hover:shadow-[0_8px_24px_rgba(122,46,67,0.10)]"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink">
                  {formatDateFR(slot)}
                </span>
                <ArrowRight
                  className="size-3.5 text-bordeaux transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
