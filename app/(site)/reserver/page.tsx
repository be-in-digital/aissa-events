import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { BookingFlow } from "@/components/booking/booking-flow";

export const metadata = buildMetadata({
  fallbackTitle: "Prendre rendez-vous · Aïssa Events",
  fallbackDescription:
    "Réservez un rendez-vous avec Aïssa Events pour parler de votre projet d'événement : appel découverte, visite de l'Espace Events… Sans engagement.",
  pathname: "/reserver",
});

/**
 * Page de réservation — fallback progressif de la modale globale. Elle rend le
 * même `<BookingFlow>` (qui charge les créneaux côté client). L'intercepteur
 * ouvre plutôt une modale sur les clics internes ; cette page sert d'URL
 * partageable, de cible sans-JS et de surface SEO.
 */
export default async function ReserverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const str = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : undefined;

  const context = {
    date: str(sp.date),
    source: str(sp.utm_source),
    content: str(sp.utm_content),
  };

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-14 sm:py-20">
      <div className="overflow-hidden rounded-[28px] border border-[var(--rule)] bg-cream shadow-[0_24px_80px_rgba(44,31,51,0.12)]">
        <BookingFlow context={context} />
      </div>
      <noscript>
        <p className="mt-6 text-center text-[14px] text-ink-soft">
          La réservation en ligne nécessite JavaScript.{" "}
          <Link href="/#contact" className="text-bordeaux underline underline-offset-4">
            Écrivez-nous via le formulaire de contact
          </Link>{" "}
          et nous fixons un créneau ensemble.
        </p>
      </noscript>
    </div>
  );
}
