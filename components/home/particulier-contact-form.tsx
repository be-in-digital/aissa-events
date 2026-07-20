"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { renderInlineItalic } from "@/lib/sanity/text";
import { submitContactForm } from "@/app/actions/contact";
import {
  INITIAL_CONTACT_STATE,
  type ContactFormState,
} from "@/app/actions/contact-state";
import { TextField, TextAreaField, SelectField } from "./contact-fields";
import type { HomePageQueryResult } from "@/sanity.types";

type ContactData = NonNullable<HomePageQueryResult>["contact"];

const PREFIX = "contact";

/**
 * Formulaire destiné aux particuliers (mariage, anniversaire, baptême, henné…).
 * Circuit inchangé : `submitContactForm` → email Resend + contact HubSpot.
 */
export function ParticulierContactForm({ data }: { data?: ContactData }) {
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    INITIAL_CONTACT_STATE,
  );

  const formEyebrow = data?.formEyebrow;
  const formTitle = data?.formTitle;
  const formEventTypes = data?.formEventTypes ?? [];
  const formSubmitLabel = data?.formSubmitLabel || "Envoyer mon projet";
  const formSuccessTitle = data?.formSuccessTitle;
  const formSuccessMessage = data?.formSuccessMessage;

  const isSuccess = state.status === "success";
  const hasFieldErrors = state.status === "error" && Boolean(state.errors);
  const err = (name: keyof NonNullable<ContactFormState["errors"]>) =>
    hasFieldErrors ? state.errors?.[name]?.[0] : undefined;

  return (
    <>
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
              {renderInlineItalic(formTitle)}
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
            <TextField
              idPrefix={PREFIX}
              name="firstName"
              label="Prénom *"
              placeholder="Aïssa"
              required
              autoComplete="given-name"
              error={err("firstName")}
            />
            <TextField
              idPrefix={PREFIX}
              name="lastName"
              label="Nom *"
              placeholder="Dupont"
              required
              autoComplete="family-name"
              error={err("lastName")}
            />
          </div>
          <TextField
            idPrefix={PREFIX}
            name="email"
            type="email"
            label="Email *"
            placeholder="vous@exemple.com"
            required
            autoComplete="email"
            inputMode="email"
            error={err("email")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              idPrefix={PREFIX}
              name="phone"
              type="tel"
              label="Téléphone"
              placeholder="06 12 34 56 78"
              autoComplete="tel"
              inputMode="tel"
              error={err("phone")}
            />
            <SelectField
              idPrefix={PREFIX}
              name="eventType"
              label="Type d'événement *"
              options={formEventTypes}
              required
              error={err("eventType")}
            />
          </div>
          <TextField
            idPrefix={PREFIX}
            name="eventDate"
            label="Date envisagée"
            placeholder="Ex. juin 2026"
            error={err("eventDate")}
          />
          <TextAreaField
            idPrefix={PREFIX}
            name="message"
            label="Votre message *"
            required
            minLength={10}
            maxLength={5000}
            placeholder="Parlez-nous de votre projet, votre vision, vos envies…"
            error={err("message")}
          />

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
                {formSubmitLabel}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      )}
    </>
  );
}
