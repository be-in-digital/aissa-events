import Image from "next/image";
import { cn } from "@/lib/utils";

type Tone = "gold" | "cream" | "ink";

// Les PNG fournis n'ont pas de canal alpha : on neutralise leur fond via
// mix-blend-mode pour qu'il se confonde avec celui du conteneur.
// - "gold" : texte doré sur fond blanc → multiply efface le blanc sur le cream
// - "cream" : texte blanc sur fond noir → screen efface le noir sur l'ink
// - "ink" : variante dorée sombre sur fond clair → multiply identique au gold
const VARIANTS: Record<
  Tone,
  { src: string; blend: string }
> = {
  gold: { src: "/logos/aissa-events-gold.png", blend: "mix-blend-multiply" },
  cream: { src: "/logos/aissa-events-white.png", blend: "mix-blend-screen" },
  ink: { src: "/logos/aissa-events-gold.png", blend: "mix-blend-multiply" },
};

export function Logo({
  className,
  tone = "gold",
  priority = false,
}: {
  className?: string;
  /** `tagline` est conservée pour compat API mais le PNG inclut toujours le tagline. */
  tagline?: boolean;
  tone?: Tone;
  priority?: boolean;
}) {
  const { src, blend } = VARIANTS[tone];

  return (
    <span
      className={cn(
        "relative inline-block aspect-[3.6/1] h-12 w-auto overflow-hidden",
        className,
      )}
      aria-label="Aïssa Events — The Perfect Timing"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 640px) 240px, 180px"
        priority={priority}
        className={cn("object-cover object-center", blend)}
      />
    </span>
  );
}
