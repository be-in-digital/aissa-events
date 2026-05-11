import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-ink",
        align === "center" && "justify-center",
        className,
      )}
    >
      <span className="size-2 animate-pulse rounded-full bg-bordeaux" />
      {children}
    </span>
  );
}
