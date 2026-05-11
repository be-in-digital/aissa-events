import { cn } from "@/lib/utils";

export function Logo({
  className,
  tagline = true,
  tone = "gold",
}: {
  className?: string;
  tagline?: boolean;
  tone?: "gold" | "cream" | "ink";
}) {
  const colorClass =
    tone === "cream"
      ? "text-cream-soft"
      : tone === "ink"
        ? "text-ink"
        : "text-gold";

  return (
    <span
      className={cn(
        "inline-flex flex-col leading-none",
        colorClass,
        className,
      )}
    >
      <span
        className="font-serif italic font-normal text-[1.7em]"
        style={{ letterSpacing: "-0.02em" }}
        aria-label="Aïssa Events"
      >
        Aïssa Events
      </span>
      {tagline && (
        <span className="mt-1 text-[0.42em] uppercase tracking-[0.42em] font-sans font-normal opacity-90">
          The Perfect Timing
        </span>
      )}
    </span>
  );
}
