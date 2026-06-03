import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";

const QUICK_LINKS = [
  { href: "/realisations", label: "Réalisations" },
  { href: "/mariage", label: "Mariages" },
  { href: "/evenements-pro", label: "Événements pro" },
  { href: "/espace-events", label: "Le lieu" },
  { href: "/#contact", label: "Contact" },
];

/**
 * Contenu de la page 404, partagé entre :
 *   - app/(site)/not-found.tsx  → rendu avec le header/footer du site
 *   - app/not-found.tsx         → rendu seul (URL hors site), donc auto-suffisant
 *
 * Volontairement un Server Component sans JS : une 404 doit être instantanée
 * et infaillible. L'entrée en fondu vient de tw-animate-css (pas de framer-motion).
 */
export function NotFoundContent() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-24 sm:py-32">
      {/* Halo décoratif discret, dans l'esprit chaleureux de la marque */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(184,146,78,0.16) 0%, rgba(61,37,73,0.08) 45%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[640px] animate-in fade-in-0 duration-700 text-center">
        <div className="flex justify-center">
          <Eyebrow align="center">Erreur 404</Eyebrow>
        </div>

        <p
          className="mt-8 font-serif leading-[0.85] tracking-[-0.04em] text-bordeaux text-[110px] sm:text-[150px]"
          style={{ fontWeight: 300 }}
        >
          4<span className="italic text-gold">0</span>4
        </p>

        <h1
          className="mt-4 font-serif text-[30px] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[40px]"
          style={{ fontWeight: 300 }}
        >
          Cette page est introuvable
        </h1>

        <p className="mx-auto mt-5 max-w-[440px] font-sans text-[15px] leading-[1.7] text-ink-soft">
          Le lien est peut-être incorrect, ou la page a changé d&apos;adresse.
          Reprenons depuis le début.
        </p>

        <div className="mt-10 flex flex-col items-center gap-7">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full bg-bordeaux px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-bordeaux-deep hover:shadow-[0_18px_42px_rgba(61,37,73,0.32)]"
          >
            Retour à l&apos;accueil
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>

          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
            aria-label="Liens utiles"
          >
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-transparent pb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-ink transition-colors hover:border-bordeaux hover:text-bordeaux"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
