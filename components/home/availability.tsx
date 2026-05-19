import { AvailabilityCalendar } from "@/components/availability/calendar";
import { NextSlots } from "@/components/availability/next-slots";
import { getAvailabilityData } from "@/lib/availability/server";
import { Eyebrow } from "./eyebrow";

/**
 * Section disponibilités de la home : full calendrier visible inline (pas en
 * modale comme sur les pages produits). Donne aux visiteurs de la landing un
 * accès direct à l'agenda d'Aïssa avant même d'avoir choisi un univers.
 *
 * Se masque si `availability.enabled === false` côté Sanity.
 */
export async function HomeAvailability() {
  const data = await getAvailabilityData();
  if (data.enabled === false) return null;

  return (
    <section
      id="disponibilites"
      className="relative scroll-mt-24 bg-cream py-28 sm:py-36"
    >
      <div className="mx-auto max-w-[1180px] px-6 sm:px-14">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-6">
            <Eyebrow align="center">Disponibilités</Eyebrow>
          </div>
          <h2
            className="font-serif text-[40px] leading-[0.95] tracking-[-0.03em] sm:text-[56px] lg:text-[64px]"
            style={{ fontWeight: 300 }}
          >
            L&apos;agenda d&apos;Aïssa,{" "}
            <span className="italic text-bordeaux">en clair</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-[1.7] text-ink-soft sm:text-[16px]">
            Cliquez sur une date pour bloquer un appel cadrage — confirmation
            sous 48 h. Les samedis libres restants apparaissent en surbrillance.
          </p>
        </div>

        <NextSlots
          utmSource="home"
          utmContent="home-next-slots"
          eyebrow="Prochaines dates"
          title="Les samedis encore libres"
        />

        <div className="mt-12">
          <AvailabilityCalendar
            utmSource="home"
            utmContent="home-calendar"
            eyebrow="Disponibilités"
            title="Quel jour vous tente ?"
            description="L'agenda d'Aïssa pour les mariages et événements pro."
          />
        </div>
      </div>
    </section>
  );
}
