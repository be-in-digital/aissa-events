"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { renderInlineItalic } from "@/lib/sanity/text";
import { submitBusinessForm } from "@/app/actions/business-contact";
import {
  INITIAL_BUSINESS_STATE,
  type BusinessLeadState,
} from "@/app/actions/business-contact-state";
import { TextField, TextAreaField, SelectField } from "./contact-fields";
import type { HomePageQueryResult } from "@/sanity.types";

type ContactData = NonNullable<HomePageQueryResult>["contact"];

const PREFIX = "pro";
/** Le formulaire complet (qualification détaillée) vit sur la page Entreprises. */
const FULL_FORM_HREF = "/entreprises#devis";

/**
 * Repli si le document Sanity est antérieur à l'ajout des champs pro : les
 * `select` obligatoires (type / budget) doivent toujours proposer des options.
 */
const DEFAULT_EVENT_TYPES = [
  "Séminaire / Réunion",
  "Afterwork / Cocktail",
  "Soirée client / Lancement",
  "Événement de fin d'année",
  "Team building",
  "Convention / Conférence",
  "Autre",
];
const DEFAULT_BUDGET_RANGES = [
  "Moins de 5 000 €",
  "5 000 – 10 000 €",
  "10 000 – 20 000 €",
  "20 000 – 50 000 €",
  "Plus de 50 000 €",
  "À définir ensemble",
];

/**
 * Formulaire destiné aux entreprises (séminaire, soirée client, lancement, team
 * building…). Version compacte de la demande de qualification B2B : même circuit
 * serveur que la page Entreprises (`submitBusinessForm` → email + HubSpot). Les
 * champs avancés (secteur, fonction, prestations, objectif…) restent sur
 * `/entreprises#devis`, accessible via le lien sous le bouton.
 */
export function ProContactForm({ data }: { data?: ContactData }) {
  const [state, formAction, pending] = useActionState<BusinessLeadState, FormData>(
    submitBusinessForm,
    INITIAL_BUSINESS_STATE,
  );

  const eyebrow = data?.proFormEyebrow;
  const title = data?.proFormTitle;
  const eventTypes =
    data?.proEventTypes && data.proEventTypes.length > 0
      ? data.proEventTypes
      : DEFAULT_EVENT_TYPES;
  const budgetRanges =
    data?.proBudgetRanges && data.proBudgetRanges.length > 0
      ? data.proBudgetRanges
      : DEFAULT_BUDGET_RANGES;
  const submitLabel = data?.proFormSubmitLabel || "Demander une étude";
  const successTitle = data?.proFormSuccessTitle;
  const successMessage = data?.proFormSuccessMessage;
  const fullLinkLabel = data?.proFormFullLinkLabel;

  const isSuccess = state.status === "success";
  const hasFieldErrors = state.status === "error" && Boolean(state.errors);
  const err = (name: keyof NonNullable<BusinessLeadState["errors"]>) =>
    hasFieldErrors ? state.errors?.[name]?.[0] : undefined;

  return (
    <>
      {(eyebrow || title) && (
        <div className="mb-8 border-b border-[var(--rule)] pb-6">
          {eyebrow && (
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
              {eyebrow}
            </p>
          )}
          {title && (
            <p
              className="font-serif text-[24px] italic leading-[1.2]"
              style={{ fontWeight: 400 }}
            >
              {renderInlineItalic(title)}
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
          {successTitle && (
            <p className="mb-3 font-script text-[44px] text-bordeaux">
              {successTitle}
            </p>
          )}
          {successMessage && (
            <p className="text-[15px] text-ink-soft">{successMessage}</p>
          )}
        </div>
      ) : (
        <form action={formAction} noValidate className="space-y-6">
          {/* Honeypot — caché en CSS, ne doit jamais être rempli par un humain */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
          >
            <label htmlFor="pro-website">Site web (laisser vide)</label>
            <input
              id="pro-website"
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
            <TextField
              idPrefix={PREFIX}
              name="company"
              label="Entreprise *"
              placeholder="Votre société"
              required
              autoComplete="organization"
              error={err("company")}
            />
            <TextField
              idPrefix={PREFIX}
              name="contactName"
              label="Nom et prénom *"
              placeholder="Aïssa Dupont"
              required
              autoComplete="name"
              error={err("contactName")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              idPrefix={PREFIX}
              name="email"
              type="email"
              label="Email professionnel *"
              placeholder="vous@societe.com"
              required
              autoComplete="email"
              inputMode="email"
              error={err("email")}
            />
            <TextField
              idPrefix={PREFIX}
              name="phone"
              type="tel"
              label="Téléphone *"
              placeholder="06 12 34 56 78"
              required
              autoComplete="tel"
              inputMode="tel"
              error={err("phone")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              idPrefix={PREFIX}
              name="eventType"
              label="Type d'événement *"
              options={eventTypes}
              required
              error={err("eventType")}
            />
            <TextField
              idPrefix={PREFIX}
              name="headcount"
              label="Nombre de participants *"
              placeholder="Ex. 40"
              required
              inputMode="numeric"
              error={err("headcount")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              idPrefix={PREFIX}
              name="period"
              label="Date ou période *"
              placeholder="Ex. octobre 2026"
              required
              error={err("period")}
            />
            <SelectField
              idPrefix={PREFIX}
              name="budget"
              label="Budget prévisionnel *"
              options={budgetRanges}
              required
              error={err("budget")}
            />
          </div>
          <TextAreaField
            idPrefix={PREFIX}
            name="notes"
            label="Votre projet"
            rows={3}
            placeholder="Contexte, objectif, contraintes…"
            error={err("notes")}
          />

          <label
            htmlFor="pro-consent"
            className="flex items-start gap-3 text-[12px] leading-[1.55] text-ink-soft"
          >
            <input
              id="pro-consent"
              name="consent"
              type="checkbox"
              required
              className="mt-0.5 size-4 shrink-0 cursor-pointer accent-bordeaux"
            />
            <span>
              J&apos;accepte que mes données soient utilisées pour répondre à ma
              demande, conformément à la{" "}
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
            className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-bordeaux px-7 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-cream transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-bordeaux-deep disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                {submitLabel}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          {fullLinkLabel && (
            <p className="pt-1 text-center text-[12.5px] text-ink-soft">
              <a
                href={FULL_FORM_HREF}
                className="underline underline-offset-2 transition-colors hover:text-bordeaux"
              >
                {fullLinkLabel}
              </a>
            </p>
          )}
        </form>
      )}
    </>
  );
}
