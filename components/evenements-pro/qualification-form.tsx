"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { renderInlineItalic } from "@/lib/sanity/text";
import { submitBusinessForm } from "@/app/actions/business-contact";
import {
  INITIAL_BUSINESS_STATE,
  type BusinessLeadState,
} from "@/app/actions/business-contact-state";
import type { EvenementPageQueryResult } from "@/sanity.types";

type QualifData = NonNullable<EvenementPageQueryResult>["qualificationForm"];

/** Renvoie la valeur Sanity si présente, sinon le texte de secours. */
const t = (v: string | null | undefined, fallback: string) =>
  (v && v.trim()) || fallback;

export function QualificationForm({ data }: { data?: QualifData }) {
  const [state, formAction, pending] = useActionState<BusinessLeadState, FormData>(
    submitBusinessForm,
    INITIAL_BUSINESS_STATE,
  );
  // Préremplissage : quand on arrive depuis une carte pack (lien ?pack=…),
  // on capte le nom du pack pour le transmettre avec la demande.
  const pack = useSearchParams().get("pack") ?? "";

  if (data?.enabled === false) return null;

  const eventTypes = data?.eventTypes ?? [];
  const locationOptions = data?.locationOptions ?? [];
  const serviceOptions = data?.serviceOptions ?? [];
  const budgetRanges = data?.budgetRanges ?? [];

  const isSuccess = state.status === "success";
  const hasFieldErrors = state.status === "error" && Boolean(state.errors);
  const fieldError = (name: keyof NonNullable<BusinessLeadState["errors"]>) =>
    hasFieldErrors ? state.errors?.[name]?.[0] : undefined;

  const title = t(data?.title, "Parlons de votre prochain événement");
  const intro = t(
    data?.intro,
    "Confiez-nous votre projet et recevez une première orientation adaptée à vos objectifs, à votre effectif et à votre budget.",
  );

  return (
    <section id="devis" className="scroll-mt-24 bg-cream py-28 sm:py-36">
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
            {t(data?.eyebrow, "Parlons de votre projet")}
          </p>
          <h2
            className="font-serif text-[36px] leading-[1.02] tracking-[-0.03em] sm:text-[52px]"
            style={{ fontWeight: 300 }}
          >
            {title.split("\n").map((line, i, arr) => (
              <span key={i}>
                {renderInlineItalic(line)}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[15.5px] leading-[1.7] text-ink-soft">
            {intro}
          </p>
        </motion.div>

        <div className="rounded-3xl border border-[var(--rule)] bg-cream-soft p-6 sm:p-10">
          {isSuccess ? (
            <div
              role="status"
              aria-live="polite"
              className="rounded-2xl border border-[var(--rule)] bg-cream p-10 text-center"
            >
              <p className="mb-3 font-script text-[44px] text-bordeaux">
                {t(data?.successTitle, "Merci !")}
              </p>
              <p className="mx-auto max-w-[440px] text-[15px] text-ink-soft">
                {t(
                  data?.successMessage,
                  "Votre demande a bien été transmise. Aïssa Events revient vers vous pour préciser votre projet.",
                )}
              </p>
            </div>
          ) : (
            <form action={formAction} noValidate className="space-y-6">
              {/* Honeypot anti-bot */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
              >
                <label htmlFor="biz-website">Site web (laisser vide)</label>
                <input
                  id="biz-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
              </div>

              {/* Pack d'origine (rempli automatiquement depuis une carte) */}
              <input type="hidden" name="pack" value={pack} readOnly />

              {state.generalError && (
                <div
                  role="alert"
                  className="rounded-2xl border border-bordeaux/30 bg-bordeaux/5 px-5 py-4 text-[14px] text-bordeaux"
                >
                  {state.generalError}
                </div>
              )}

              {pack && (
                <div className="rounded-2xl border border-dashed border-bordeaux/30 bg-bordeaux/5 px-5 py-3 text-[13.5px] text-ink">
                  Votre demande concerne :{" "}
                  <span className="font-serif italic text-bordeaux">{pack}</span>.
                </div>
              )}

              {/* Entreprise / secteur */}
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="company" label={`${t(data?.companyLabel, "Entreprise")} *`} required error={fieldError("company")} />
                <TextField name="sector" label={t(data?.sectorLabel, "Secteur d'activité")} error={fieldError("sector")} />
              </div>

              {/* Contact / fonction */}
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="contactName" label={`${t(data?.contactNameLabel, "Nom et prénom")} *`} required autoComplete="name" error={fieldError("contactName")} />
                <TextField name="role" label={t(data?.roleLabel, "Fonction")} autoComplete="organization-title" error={fieldError("role")} />
              </div>

              {/* Email / téléphone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="email" type="email" inputMode="email" label={`${t(data?.emailLabel, "Email professionnel")} *`} required autoComplete="email" error={fieldError("email")} />
                <TextField name="phone" type="tel" inputMode="tel" label={`${t(data?.phoneLabel, "Téléphone")} *`} required autoComplete="tel" error={fieldError("phone")} />
              </div>

              {/* Type / participants */}
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField name="eventType" label={`${t(data?.eventTypeLabel, "Type d'événement")} *`} options={eventTypes} required error={fieldError("eventType")} />
                <TextField name="headcount" label={`${t(data?.headcountLabel, "Nombre de participants")} *`} required inputMode="numeric" placeholder="Ex. 40" error={fieldError("headcount")} />
              </div>

              {/* Période / lieu */}
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="period" label={`${t(data?.periodLabel, "Date ou période souhaitée")} *`} required placeholder="Ex. octobre 2026" error={fieldError("period")} />
                <SelectField name="location" label={t(data?.locationLabel, "Lieu souhaité")} options={locationOptions} error={fieldError("location")} />
              </div>

              {/* Horaires */}
              <TextField name="schedule" label={t(data?.scheduleLabel, "Horaires et durée")} placeholder="Ex. 18h–23h, soirée" error={fieldError("schedule")} />

              {/* Prestations (multi) */}
              {serviceOptions.length > 0 && (
                <fieldset>
                  <legend className="mb-3 block font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink">
                    {t(data?.servicesLabel, "Prestations envisagées")}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {serviceOptions.map((opt) => (
                      <label
                        key={opt}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[var(--rule)] bg-cream px-4 py-2 text-[13px] text-ink-soft transition-colors hover:border-bordeaux/40 has-[:checked]:border-bordeaux has-[:checked]:bg-bordeaux/5 has-[:checked]:text-bordeaux"
                      >
                        <input type="checkbox" name="services" value={opt} className="size-3.5 accent-bordeaux" />
                        {opt}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {/* Budget */}
              <SelectField name="budget" label={`${t(data?.budgetLabel, "Budget global prévisionnel")} *`} options={budgetRanges} required error={fieldError("budget")} />

              {/* Objectif */}
              <TextArea name="objective" label={t(data?.objectiveLabel, "Objectif principal de l'événement")} rows={2} placeholder="Ce que vous voulez que vos invités retiennent…" error={fieldError("objective")} />

              {/* Notes */}
              <TextArea name="notes" label={t(data?.notesLabel, "Informations complémentaires")} rows={3} error={fieldError("notes")} />

              {/* Consentement */}
              <label htmlFor="biz-consent" className="flex items-start gap-3 text-[12px] leading-[1.55] text-ink-soft">
                <input id="biz-consent" name="consent" type="checkbox" required className="mt-0.5 size-4 shrink-0 cursor-pointer accent-bordeaux" />
                <span>
                  {t(data?.consentText, "J'accepte que mes données soient utilisées pour répondre à ma demande.")}{" "}
                  <a href="/politique-confidentialite" className="underline underline-offset-2 hover:text-bordeaux">
                    Politique de confidentialité
                  </a>
                  .
                </span>
              </label>
              {hasFieldErrors && state.errors?.consent?.[0] && (
                <p className="-mt-3 text-[12px] text-bordeaux">{state.errors.consent[0]}</p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-bordeaux px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-bordeaux-deep disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    {t(data?.submitLabel, "Demander une étude personnalisée")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink">
      {children}
    </label>
  );
}

function TextField({
  name,
  label,
  type = "text",
  placeholder,
  required,
  error,
  autoComplete,
  inputMode,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal" | "search" | "url" | "none";
}) {
  const id = `biz-${name}`;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={Boolean(error) || undefined}
        className="w-full border-b border-ink bg-transparent py-3 font-sans text-[15px] text-ink placeholder:italic placeholder:text-muted-ink focus-visible:border-bordeaux focus-visible:outline-none aria-invalid:border-bordeaux"
      />
      {error && <p className="mt-1 text-[12px] text-bordeaux">{error}</p>}
    </div>
  );
}

function TextArea({
  name,
  label,
  rows = 3,
  placeholder,
  error,
}: {
  name: string;
  label: string;
  rows?: number;
  placeholder?: string;
  error?: string;
}) {
  const id = `biz-${name}`;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error) || undefined}
        className="w-full resize-y border-b border-ink bg-transparent py-3 font-sans text-[15px] text-ink placeholder:italic placeholder:text-muted-ink focus-visible:border-bordeaux focus-visible:outline-none aria-invalid:border-bordeaux"
      />
      {error && <p className="mt-1 text-[12px] text-bordeaux">{error}</p>}
    </div>
  );
}

function SelectField({
  name,
  label,
  options,
  required,
  error,
}: {
  name: string;
  label: string;
  options: string[];
  required?: boolean;
  error?: string;
}) {
  const id = `biz-${name}`;
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={Boolean(error) || undefined}
        className="w-full appearance-none border-b border-ink bg-transparent py-3 pr-8 font-sans text-[15px] text-ink focus-visible:border-bordeaux focus-visible:outline-none aria-invalid:border-bordeaux"
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
