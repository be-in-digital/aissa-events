"use client";

import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { Eyebrow } from "./eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import { submitContactForm } from "@/app/actions/contact";
import {
  INITIAL_CONTACT_STATE,
  type ContactFormState,
} from "@/app/actions/contact-state";
import type { HomePageQueryResult, SiteSettingsQueryResult } from "@/sanity.types";

type ContactData = NonNullable<HomePageQueryResult>["contact"];

export function ContactSection({
  data,
  calendlyUrl,
  settings,
}: {
  data?: ContactData;
  calendlyUrl: string;
  settings: SiteSettingsQueryResult;
}) {
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    INITIAL_CONTACT_STATE,
  );

  if (data?.enabled === false) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;
  const intro = data?.intro;
  const calendlyEyebrow = data?.calendlyEyebrow;
  const calendlyTitle = data?.calendlyTitle;
  const calendlyDescription = data?.calendlyDescription;
  const calendlyButtonLabel = data?.calendlyButtonLabel;

  const formEyebrow = data?.formEyebrow;
  const formTitle = data?.formTitle;
  const formEventTypes = data?.formEventTypes ?? [];
  const formSubmitLabel = data?.formSubmitLabel;
  const formSuccessTitle = data?.formSuccessTitle;
  const formSuccessMessage = data?.formSuccessMessage;

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

  const isSuccess = state.status === "success";
  const hasFieldErrors = state.status === "error" && Boolean(state.errors);

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
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink transition-all hover:-translate-y-0.5 hover:bg-gold-soft"
                >
                  {calendlyButtonLabel}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </a>
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
            {(formEyebrow || formTitle) && (
              <div className="mb-8 border-b border-[var(--rule)] pb-6">
                {formEyebrow && (
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                    {formEyebrow}
                  </p>
                )}
                {formTitle && (
                  <p
                    className="font-serif text-[24px] italic leading-[1.2]"
                    style={{ fontWeight: 400 }}
                  >
                    {formTitle}
                  </p>
                )}
              </div>
            )}

            {isSuccess ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-2xl border border-[var(--rule)] bg-cream p-10 text-center"
              >
                {formSuccessTitle && (
                  <p className="mb-3 font-script text-[44px] text-bordeaux">
                    {formSuccessTitle}
                  </p>
                )}
                {formSuccessMessage && (
                  <p className="text-[15px] text-ink-soft">{formSuccessMessage}</p>
                )}
              </div>
            ) : (
              <form action={formAction} noValidate className="space-y-6">
                {/* Honeypot — caché en CSS, ne doit jamais être rempli par un humain */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="contact-website">Site web (laisser vide)</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    defaultValue=""
                  />
                </div>

                {state.generalError && (
                  <div
                    role="alert"
                    className="rounded-2xl border border-bordeaux/30 bg-bordeaux/5 px-5 py-4 text-[14px] text-bordeaux"
                  >
                    {state.generalError}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    name="firstName"
                    label="Prénom *"
                    placeholder="Aïssa"
                    required
                    error={hasFieldErrors ? state.errors?.firstName?.[0] : undefined}
                  />
                  <Field
                    name="lastName"
                    label="Nom *"
                    placeholder="Dupont"
                    required
                    error={hasFieldErrors ? state.errors?.lastName?.[0] : undefined}
                  />
                </div>
                <Field
                  name="email"
                  type="email"
                  label="Email *"
                  placeholder="vous@exemple.com"
                  required
                  error={hasFieldErrors ? state.errors?.email?.[0] : undefined}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    name="phone"
                    type="tel"
                    label="Téléphone"
                    placeholder="06 12 34 56 78"
                    error={hasFieldErrors ? state.errors?.phone?.[0] : undefined}
                  />
                  <SelectField
                    name="eventType"
                    label="Type d'événement *"
                    options={formEventTypes}
                    error={hasFieldErrors ? state.errors?.eventType?.[0] : undefined}
                  />
                </div>
                <Field
                  name="eventDate"
                  label="Date envisagée"
                  placeholder="Ex. juin 2026"
                  error={hasFieldErrors ? state.errors?.eventDate?.[0] : undefined}
                />
                <div>
                  <Label htmlFor="contact-message">Votre message *</Label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={5000}
                    placeholder="Parlez-nous de votre projet, votre vision, vos envies…"
                    className="min-h-[110px] w-full resize-y border-b border-ink bg-transparent py-3 font-sans text-[15px] text-ink placeholder:italic placeholder:text-muted-ink focus:border-bordeaux focus:outline-none"
                  />
                  {hasFieldErrors && state.errors?.message?.[0] && (
                    <p className="mt-1 text-[12px] text-bordeaux">
                      {state.errors.message[0]}
                    </p>
                  )}
                </div>

                <label
                  htmlFor="contact-consent"
                  className="flex items-start gap-3 text-[12px] leading-[1.55] text-ink-soft"
                >
                  <input
                    id="contact-consent"
                    name="consent"
                    type="checkbox"
                    required
                    className="mt-0.5 size-4 shrink-0 cursor-pointer accent-bordeaux"
                  />
                  <span>
                    J&apos;accepte que mes données soient utilisées pour
                    répondre à ma demande, conformément à la{" "}
                    <a
                      href="/politique-confidentialite"
                      className="underline underline-offset-2 hover:text-bordeaux"
                    >
                      politique de confidentialité
                    </a>
                    .
                  </span>
                </label>
                {hasFieldErrors && state.errors?.consent?.[0] && (
                  <p className="-mt-3 text-[12px] text-bordeaux">
                    {state.errors.consent[0]}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-bordeaux px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-all hover:-translate-y-0.5 hover:bg-bordeaux-deep disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {pending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Envoi en cours…
                    </>
                  ) : (
                    <>
                      {formSubmitLabel}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink"
    >
      {children}
    </label>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  const id = `contact-${name}`;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        aria-invalid={Boolean(error) || undefined}
        className="w-full border-b border-ink bg-transparent py-3 font-sans text-[15px] text-ink placeholder:italic placeholder:text-muted-ink focus:border-bordeaux focus:outline-none aria-invalid:border-bordeaux"
      />
      {error && <p className="mt-1 text-[12px] text-bordeaux">{error}</p>}
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
  error,
}: {
  name: string;
  label: string;
  options: string[];
  error?: string;
}) {
  const id = `contact-${name}`;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        required
        defaultValue=""
        aria-invalid={Boolean(error) || undefined}
        className="w-full appearance-none border-b border-ink bg-transparent py-3 pr-8 font-sans text-[15px] text-ink focus:border-bordeaux focus:outline-none aria-invalid:border-bordeaux"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%232C1F33' stroke-width='1' d='M1 1.5l5 5 5-5'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 4px center",
        }}
      >
        <option value="" disabled>
          Sélectionnez
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-[12px] text-bordeaux">{error}</p>}
    </div>
  );
}
