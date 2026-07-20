import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { BookingFlow } from "@/components/booking/booking-flow";

export const metadata = buildMetadata({
  fallbackTitle: "Prendre rendez-vous · Aïssa Events",
  fallbackDescription:
    "Réservez votre rendez-vous avec Aïssa Events. Sans engagement.",
});

/**
 * Page de réservation d'un TYPE précis (ex. /reserver/appel, /reserver/visite).
 * Fallback progressif de la modale : l'intercepteur ouvre plutôt une modale sur
 * les clics internes ; cette page sert d'URL partageable et de cible sans-JS.
 */
export default async function ReserverTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ type }, sp] = await Promise.all([params, searchParams]);
  const str = (v: string | string[] | undefined) =>
    typeof v === "string" ? v : undefined;

  const context = {
    type,
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
