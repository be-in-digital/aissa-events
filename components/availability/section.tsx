import { AvailabilityCalendar } from "./calendar";
import { NextSlots } from "./next-slots";
import { AvailabilityDialog } from "./dialog";
import { getAvailabilityData } from "@/lib/availability/server";

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
 * Le bloc se masque si `enabled === false` côté Sanity.
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

  if (data.enabled === false) return null;

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
