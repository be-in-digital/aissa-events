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
  const wordmarkColor =
    tone === "cream"
      ? "text-cream"
      : tone === "ink"
        ? "text-ink"
        : "text-[#887666]";

  const taglineColor =
    tone === "cream"
      ? "text-cream/80"
      : tone === "ink"
        ? "text-ink/80"
        : "text-ink/90";

  return (
    <span
      className={cn("inline-flex flex-col items-center leading-none", className)}
      aria-label="Aïssa Events — The Perfect Timing"
    >
      <span
        className={cn("font-normal text-[3em]", wordmarkColor)}
        style={{
          fontFamily: "var(--font-logo), cursive",
          letterSpacing: "0.005em",
          lineHeight: 1,
        }}
      >
        Aïssa Events
      </span>
      {tagline && (
        <span
          className={cn(
            "mt-[0.2em] font-sans font-light uppercase text-[0.7em]",
            taglineColor,
          )}
          style={{ letterSpacing: "0.42em" }}
        >
          The Perfect Timing
        </span>
      )}
    </span>
  );
}
