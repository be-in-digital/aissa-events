"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { openBookingDialog } from "@/components/booking/booking-dialog";
import { ParticulierContactForm } from "./particulier-contact-form";
import { ProContactForm } from "./pro-contact-form";
import type { HomePageQueryResult, SiteSettingsQueryResult } from "@/sanity.types";

type ContactData = NonNullable<HomePageQueryResult>["contact"];
type Audience = "particulier" | "pro";

export function ContactSection({
  data,
  settings,
}: {
  data?: ContactData;
  settings: SiteSettingsQueryResult;
}) {
  const [audience, setAudience] = useState<Audience>("particulier");

  if (data?.enabled === false) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;
  const intro = data?.intro;
  const calendlyEyebrow = data?.calendlyEyebrow;
  const calendlyTitle = data?.calendlyTitle;
  const calendlyDescription = data?.calendlyDescription;
  const calendlyButtonLabel = data?.calendlyButtonLabel;

  const particulierLabel = data?.audienceParticulierLabel || "Particulier";
  const proLabel = data?.audienceProLabel || "Professionnel";

  // Build meta from siteSettings
  const phoneDisplay = settings?.phone;
  const phoneHref = settings?.phoneHref ?? settings?.phone?.replace(/\s+/g, "");
  const email = settings?.email;
  const addr = settings?.address;
  const fullAddress = [
    addr?.street,
    [addr?.postalCode, addr?.city].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
  const social = settings?.social?.items ?? [];

  const meta: {
    label: string;
    value: string;
    href?: string;
    links?: { label: string; href: string }[];
  }[] = [];
  if (phoneDisplay)
    meta.push({
      label: "Téléphone",
      value: phoneDisplay,
      href: `tel:${phoneHref}`,
    });
  if (email)
    meta.push({
      label: "Email",
      value: email,
      href: `mailto:${email}`,
    });
  if (fullAddress) meta.push({ label: "Adresse", value: fullAddress });
  if (social.length > 0)
    meta.push({
      label: "Réseaux",
      value: social.map((s) => s?.label || s?.platform).join(" · "),
      links: social
        .filter((s): s is { platform: typeof s.platform; label: string | null; url: string } =>
          Boolean(s?.url),
        )
        .map((s) => ({
          label: s.label || s.platform || "Lien",
          href: s.url,
        })),
    });

  return (
    <section id="contact" className="relative py-32 sm:py-40">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          {eyebrow && (
            <div className="mb-6">
              <Eyebrow align="center">{eyebrow}</Eyebrow>
            </div>
          )}
          <h2
            className="mb-8 font-serif text-[40px] leading-[0.95] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
            style={{ fontWeight: 300 }}
          >
            {title.split("\n").map((line, i, arr) => (
              <span key={i}>
                {renderInlineItalic(line)}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
          {intro && (
            <p className="mx-auto max-w-xl text-[16px] leading-[1.75] text-ink-soft">
              {intro}
            </p>
          )}
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="mb-10 rounded-3xl bg-ink p-10 text-cream">
              {calendlyEyebrow && (
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-soft">
                  {calendlyEyebrow}
                </p>
              )}
              {calendlyTitle && (
                <h3
                  className="mb-2 font-serif text-[28px] italic leading-[1.3]"
                  style={{ fontWeight: 400 }}
                >
                  {calendlyTitle}
                </h3>
              )}
              {calendlyDescription && (
                <p className="mb-7 text-[13px] text-cream/70">
                  {calendlyDescription}
                </p>
              )}
              {calendlyButtonLabel && (
                <button
                  type="button"
                  onClick={() =>
                    openBookingDialog({ source: "home", content: "contact-section" })
                  }
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-gold-soft"
                >
                  {calendlyButtonLabel}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              )}
            </div>

            {meta.length > 0 && (
              <ul className="space-y-1">
                {meta.map((m) => (
                  <li
                    key={m.label}
                    className="grid grid-cols-[100px_1fr] items-baseline gap-4 border-b border-[var(--rule)] py-4"
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink">
                      {m.label}
                    </span>
                    <span className="font-serif text-[16px] text-ink">
                      {m.href ? (
                        <a
                          href={m.href}
                          className="transition-colors hover:text-bordeaux"
                        >
                          {m.value}
                        </a>
                      ) : m.links ? (
                        m.links.map((l, i) => (
                          <span key={l.label}>
                            {i > 0 && " · "}
                            <a
                              href={l.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-colors hover:text-bordeaux"
                            >
                              {l.label}
                            </a>
                          </span>
                        ))
                      ) : (
                        m.value
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="rounded-3xl border border-[var(--rule)] bg-cream-soft p-8 sm:p-12"
          >
            {/* Sélecteur d'audience : Particulier / Professionnel */}
            <div
              role="tablist"
              aria-label="Vous êtes un particulier ou un professionnel ?"
              className="mb-8 grid grid-cols-2 gap-1 rounded-full border border-[var(--rule)] bg-cream p-1"
            >
              <AudienceTab
                id="contact-tab-particulier"
                controls="contact-panel-particulier"
                active={audience === "particulier"}
                onSelect={() => setAudience("particulier")}
              >
                {particulierLabel}
              </AudienceTab>
              <AudienceTab
                id="contact-tab-pro"
                controls="contact-panel-pro"
                active={audience === "pro"}
                onSelect={() => setAudience("pro")}
              >
                {proLabel}
              </AudienceTab>
            </div>

            {/* Les deux panneaux restent montés : bascule sans perdre la saisie. */}
            <div
              role="tabpanel"
              id="contact-panel-particulier"
              aria-labelledby="contact-tab-particulier"
              hidden={audience !== "particulier"}
            >
              <ParticulierContactForm data={data} />
            </div>
            <div
              role="tabpanel"
              id="contact-panel-pro"
              aria-labelledby="contact-tab-pro"
              hidden={audience !== "pro"}
            >
              <ProContactForm data={data} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AudienceTab({
  id,
  controls,
  active,
  onSelect,
  children,
}: {
  id: string;
  controls: string;
  active: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={active}
      aria-controls={controls}
      onClick={onSelect}
      className={cn(
        "rounded-full px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-[0.18em] transition-all sm:text-[12px]",
        active
          ? "bg-bordeaux text-cream shadow-sm"
          : "text-ink-soft hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
