import { AvailabilityCalendar } from "./calendar";
import { NextSlots } from "./next-slots";
import { AvailabilityDialog } from "./dialog";
import { getAvailabilityData } from "@/lib/availability/server";
import { buildBookingUrl } from "@/lib/booking/url";

type Props = {
  utmSource: string;
  utmContent?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  nextSlotsEyebrow?: string;
  nextSlotsTitle?: string;
  dialogTriggerLabel?: string;
};

/**
 * Bloc « disponibilités » des pages produits.
 *
 * Composition :
 *  1. `NextSlots` reste visible inline — preview avec les 3 prochains samedis
 *     libres, principal driver de conversion (clic → Calendly pré-rempli).
 *  2. Bouton « Voir tout l'agenda » qui ouvre `AvailabilityCalendar` dans une
 *     modale (vue 3 mois glissants + extension 12 mois).
 *
 * Si `enabled === false` côté Sanity, on affiche un fallback Calendly direct
 * au lieu de masquer la section entièrement.
 */
export async function AvailabilitySection({
  utmSource,
  utmContent = "calendar",
  eyebrow,
  title,
  description,
  nextSlotsEyebrow,
  nextSlotsTitle,
  dialogTriggerLabel,
}: Props) {
  const data = await getAvailabilityData();

  // Fallback : calendrier ICS désactivé → affichage minimal avec lien Calendly
  if (data.enabled === false) {
    const fallbackTitle = title ?? "Réservez votre date";
    const fallbackDescription =
      description ??
      "Prenez rendez-vous directement avec Aïssa pour vérifier la disponibilité de votre date et préparer votre projet.";
    return (
      <section id="disponibilites" className="relative scroll-mt-24">
        <div className="mx-auto max-w-[1180px] px-6 pt-16 sm:px-14 sm:pt-20">
          {eyebrow && (
            <p className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.22em] text-bordeaux">
              {eyebrow}
            </p>
          )}
          <h2
            className="font-serif text-[32px] leading-[1.05] tracking-[-0.03em] sm:text-[40px]"
            style={{ fontWeight: 300 }}
          >
            {fallbackTitle}
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-[1.7] text-ink-soft">
            {fallbackDescription}
          </p>
          <div className="mt-8">
            <a
              href={buildBookingUrl({
                source: utmSource,
                content: `${utmContent}-fallback`,
              })}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-bordeaux px-7 py-3.5 font-mono text-[11px] uppercase tracking-[0.22em] text-cream transition hover:bg-bordeaux/90 active:scale-[0.97]"
            >
              Voir les disponibilités
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="disponibilites" className="relative scroll-mt-24">
      <div className="mx-auto max-w-[1180px] px-6 pt-16 sm:px-14 sm:pt-20">
        <NextSlots
          utmSource={utmSource}
          utmContent={`${utmContent}-next`}
          eyebrow={nextSlotsEyebrow}
          title={nextSlotsTitle}
        />
        <div className="mt-8 flex justify-center">
          <AvailabilityDialog triggerLabel={dialogTriggerLabel}>
            <AvailabilityCalendar
              utmSource={utmSource}
              utmContent={utmContent}
              eyebrow={eyebrow}
              title={title}
              description={description}
            />
          </AvailabilityDialog>
        </div>
      </div>
    </section>
  );
}
