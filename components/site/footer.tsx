import Link from "next/link";
import { Logo } from "./logo";
import { resolveCta } from "@/lib/sanity/cta";
import type { SiteSettingsQueryResult } from "@/sanity.types";

const POWERED_BY = {
  label: "Powered by Be in Digital",
  href: "https://beindigital.fr",
} as const;

type FooterColumn = {
  title: string;
  links: { label: string; href: string; external: boolean }[];
};

function buildFooterColumns(settings: SiteSettingsQueryResult): FooterColumn[] {
  const columns = settings?.footerColumns;
  if (!columns?.length) return [];

  return columns
    .map((col) => {
      if (!col?.title) return null;
      const links =
        col.links
          ?.map((link) => {
            const resolved = resolveCta(link?.cta ?? null);
            if (!link?.label || !resolved) return null;
            return {
              label: link.label,
              href: resolved.href,
              external: resolved.external,
            };
          })
          .filter((x): x is FooterColumn["links"][number] => x !== null) ?? [];
      return { title: col.title, links };
    })
    .filter((x): x is FooterColumn => x !== null);
}

function buildLegalLinks(settings: SiteSettingsQueryResult) {
  const items = settings?.footerLegalLinks;
  if (!items?.length) return [];

  return items
    .map((link) => {
      const resolved = resolveCta(link?.cta ?? null);
      if (!link?.label || !resolved) return null;
      return {
        label: link.label,
        href: resolved.href,
        external: resolved.external,
      };
    })
    .filter((x): x is { label: string; href: string; external: boolean } => x !== null);
}

function formatAddressLines(settings: SiteSettingsQueryResult): string[] {
  const addr = settings?.address;
  if (!addr) return [];
  const line1 = addr.street?.trim();
  const line2 = [addr.postalCode, addr.city].filter(Boolean).join(" ").trim();
  return [line1, line2].filter((x): x is string => Boolean(x));
}

export function SiteFooter({ settings }: { settings: SiteSettingsQueryResult }) {
  const columns = buildFooterColumns(settings);
  const legalLinks = buildLegalLinks(settings);
  const addressLines = formatAddressLines(settings);
  const social = settings?.social?.items ?? [];
  const phoneDisplay = settings?.phone;
  const phoneHref = settings?.phoneHref ?? settings?.phone?.replace(/\s+/g, "");
  const email = settings?.email;
  const tagline = settings?.footerTagline;
  const contactTitle = settings?.footerContactTitle ?? "Contact";
  const copyright = settings?.footerCopyright ?? "© 2026 Aïssa Events · Tous droits réservés";

  const lgGridCols =
    columns.length > 0
      ? `2fr ${columns.map(() => "1fr").join(" ")} 1fr`
      : "2fr 1fr";

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div className="mx-auto max-w-[1440px] px-6 pt-16 sm:px-14 sm:pt-24">
        <div
          className="grid grid-cols-1 gap-10 border-b border-cream/15 pb-14 sm:grid-cols-2 sm:gap-12 sm:pb-20 lg:[grid-template-columns:var(--footer-lg-cols)]"
          style={{ ["--footer-lg-cols" as string]: lgGridCols }}
        >
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo tone="cream" className="text-[15px]" />
            {tagline && (
              <p className="mt-6 max-w-md text-[14px] leading-[1.7] text-cream/80 whitespace-pre-line">
                {tagline}
              </p>
            )}
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-soft">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noopener noreferrer" : undefined}
                      className="text-[14px] text-cream/80 transition-colors hover:text-cream"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-soft">
              {contactTitle}
            </h4>
            {phoneDisplay && (
              <p className="text-[14px] leading-[1.8] text-cream/80">
                <a
                  href={`tel:${phoneHref}`}
                  className="border-b border-cream/30 text-cream transition-colors hover:border-gold-soft"
                >
                  {phoneDisplay}
                </a>
              </p>
            )}
            {email && (
              <p className="mt-2 text-[14px] leading-[1.8] text-cream/80">
                <a
                  href={`mailto:${email}`}
                  className="border-b border-cream/30 text-cream transition-colors hover:border-gold-soft"
                >
                  {email}
                </a>
              </p>
            )}
            {addressLines.length > 0 && (
              <p className="mt-3 text-[14px] leading-[1.8] text-cream/80">
                {addressLines.map((line, i) => (
                  <span key={line}>
                    {line}
                    {i < addressLines.length - 1 && <br />}
                  </span>
                ))}
              </p>
            )}
            {social.length > 0 && (
              <p className="mt-4 flex flex-wrap gap-x-2 text-[14px] text-cream/80">
                {social.map((s, i) => {
                  if (!s?.url) return null;
                  return (
                    <span key={s.url}>
                      {i > 0 && <span className="text-cream/60">·</span>}{" "}
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-b border-cream/30 text-cream transition-colors hover:border-gold-soft"
                      >
                        {s.label || s.platform}
                      </a>{" "}
                    </span>
                  );
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 pb-10 sm:px-14 sm:pb-12">
        <div className="flex flex-col gap-4 pt-8 font-mono text-[10px] uppercase tracking-[0.22em] text-cream/70 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span>{copyright}</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="transition-colors hover:text-cream"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={POWERED_BY.href}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-cream"
            >
              {POWERED_BY.label}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
