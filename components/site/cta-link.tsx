import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ResolvedCta } from "@/lib/sanity/cta";

const variantClasses: Record<ResolvedCta["variant"], string> = {
  primary:
    "inline-flex items-center justify-center rounded-full bg-gold px-7 py-3 text-[11px] uppercase tracking-[0.22em] font-medium text-cream-soft transition-colors hover:bg-gold-soft hover:text-plum focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
  secondary:
    "inline-flex items-center justify-center rounded-full border border-ink/25 bg-transparent px-7 py-3 text-[11px] uppercase tracking-[0.22em] font-medium text-ink transition-colors hover:border-ink hover:bg-ink/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
  ghost:
    "inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] font-medium text-ink underline-offset-4 transition-colors hover:text-gold hover:underline",
};

export function CtaLink({
  cta,
  className,
}: {
  cta: ResolvedCta;
  className?: string;
}) {
  const classes = cn(variantClasses[cta.variant], className);

  if (cta.external) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {cta.label}
      </a>
    );
  }

  return (
    <Link href={cta.href} className={classes}>
      {cta.label}
    </Link>
  );
}
