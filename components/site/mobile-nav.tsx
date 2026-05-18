"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav-config";
import type { ResolvedCta } from "@/lib/sanity/cta";

function isActiveRoute(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav({
  navItems,
  cta,
}: {
  navItems: NavItem[];
  cta: ResolvedCta;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger
        aria-label="Ouvrir le menu"
        className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2 lg:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-cream p-6 shadow-2xl outline-none data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right">
          <div className="flex items-center justify-between">
            <DialogPrimitive.Title className="font-mono text-[10px] uppercase tracking-[0.32em] text-bordeaux">
              Navigation
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Fermer le menu"
              className="inline-flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
            >
              <X className="size-5" aria-hidden />
            </DialogPrimitive.Close>
          </div>

          <nav className="mt-12 flex flex-col gap-2">
            {navItems.map((item) => {
              const active = isActiveRoute(item.href, pathname);
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-3 font-serif text-[28px] italic font-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2",
                    active
                      ? "text-bordeaux"
                      : "text-ink hover:bg-ink/5 hover:text-bordeaux",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-px bg-bordeaux transition-[width,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      active
                        ? "w-7 opacity-100"
                        : "w-0 opacity-0 group-hover:w-5 group-hover:opacity-60",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
            <a
              href={cta.href}
              target={cta.external ? "_blank" : undefined}
              rel={cta.external ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-bordeaux px-6 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-all hover:bg-bordeaux-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bordeaux focus-visible:ring-offset-2"
            >
              {cta.label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
