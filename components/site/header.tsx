"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { Logo } from "./logo";
import { FALLBACK_NAV, FALLBACK_HEADER_CTA, type NavItem } from "./nav-config";
import { resolveCta, type ResolvedCta } from "@/lib/sanity/cta";
import { cn } from "@/lib/utils";
import type { SiteSettingsQueryResult } from "@/sanity.types";

function isActiveRoute(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function buildNavItems(settings: SiteSettingsQueryResult): NavItem[] {
  const headerNav = settings?.headerNav;
  if (!headerNav?.length) return FALLBACK_NAV;

  return headerNav
    .map((item) => {
      const resolved = resolveCta(item?.cta ?? null);
      if (!item?.label || !resolved) return null;
      return {
        label: item.label,
        href: resolved.href,
        external: resolved.external,
      } satisfies NavItem;
    })
    .filter((x): x is NavItem => x !== null);
}

function buildHeaderCta(settings: SiteSettingsQueryResult): ResolvedCta {
  return resolveCta(settings?.headerCta ?? null) ?? FALLBACK_HEADER_CTA;
}

export function SiteHeader({ settings }: { settings: SiteSettingsQueryResult }) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navItems = buildNavItems(settings);
  const headerCta = buildHeaderCta(settings);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 transition-all duration-300",
        "bg-cream/85 backdrop-blur-xl supports-[backdrop-filter]:bg-cream/70",
        scrolled
          ? "border-b border-[var(--rule)] py-3"
          : "border-b border-transparent py-5",
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-14">
        <Link
          href="/"
          aria-label={`${settings?.siteName ?? "Aïssa Events"} — accueil`}
          className="transition-opacity hover:opacity-80"
        >
          <Logo tone="gold" className="text-[13px]" />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navItems.map((item) => {
            const active = isActiveRoute(item.href, pathname);
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative font-sans text-[13px] font-normal transition-colors",
                  active ? "text-bordeaux" : "text-ink hover:text-bordeaux",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1 left-0 h-px bg-bordeaux transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={headerCta.href}
            target={headerCta.external ? "_blank" : undefined}
            rel={headerCta.external ? "noopener noreferrer" : undefined}
            className="group hidden items-center gap-2 rounded-full bg-bordeaux px-6 py-3 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition-all hover:-translate-y-0.5 hover:bg-bordeaux-deep hover:shadow-[0_10px_28px_rgba(61,37,73,0.3)] lg:inline-flex"
          >
            {headerCta.label}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
          <MobileNav navItems={navItems} cta={headerCta} />
        </div>
      </div>
    </header>
  );
}
