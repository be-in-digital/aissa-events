"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Loader2, Phone } from "lucide-react";
import {
  MEETING_TYPE_LABELS,
  type AvailabilityResponse,
  type BookingDay,
  type BookingSlot,
  type BookingTypesResponse,
  type BookingTypeSummary,
  type ChooserConfig,
} from "@/lib/booking/types";

export type BookingContextInput = {
  /** Slug du type ciblé (ex. "appel"). Omis → page de choix si plusieurs types. */
  type?: string;
  date?: string;
  source?: string;
  content?: string;
};

type Phase = "loading" | "error" | "empty" | "choose" | "pick" | "form" | "success";

type FieldErrors = Partial<Record<string, string[]>>;

function formatPreferredDate(iso?: string): string | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

export function BookingFlow({
  context,
  onDone,
}: {
  context?: BookingContextInput;
  onDone?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [data, setData] = useState<AvailabilityResponse | null>(null);
  const [types, setTypes] = useState<BookingTypeSummary[]>([]);
  const [chooser, setChooser] = useState<ChooserConfig | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slot, setSlot] = useState<BookingSlot | null>(null);
  const [successLabel, setSuccessLabel] = useState<string>("");

  const preferred = formatPreferredDate(context?.date);
  const forcedType = context?.type;
  // Peut-on revenir à la page de choix ? Seulement si plusieurs types et pas
  // de type imposé par l'URL/CTA.
  const canChangeType = !forcedType && types.length > 1;

  const loadAvailability = useCallback(async (slug: string, signal?: AbortSignal) => {
    try {
      const res = await fetch(
        `/api/booking/availability?type=${encodeURIComponent(slug)}`,
        { headers: { accept: "application/json" }, signal },
      );
      if (signal?.aborted) return;
      if (res.status === 404) {
        // Type inconnu (ex. renommé) → retomber sur la page de choix.
        setPhase("choose");
        return;
      }
      const json: AvailabilityResponse & { error?: string } = await res.json();
      if (!res.ok || json.enabled === false || !json.days) {
        setData(json.days ? json : null);
        setPhase(json.enabled === false ? "empty" : "error");
        return;
      }
      setData(json);
      setSelectedDate((prev) =>
        prev && json.days.some((d) => d.date === prev) ? prev : json.days[0]?.date ?? null,
      );
      setPhase(json.days.length === 0 ? "empty" : "pick");
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setPhase("error");
    }
  }, []);

  const loadTypes = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch("/api/booking/types", {
        headers: { accept: "application/json" },
        signal,
      });
      if (signal?.aborted) return;
      const json: BookingTypesResponse & { error?: string } = await res.json();
      if (!res.ok || json.enabled === false) {
        setPhase("empty");
        return;
      }
      setTypes(json.types ?? []);
      setChooser(json.chooser ?? null);
      if (!json.types || json.types.length === 0) {
        setPhase("empty");
      } else if (json.types.length === 1) {
        await loadAvailability(json.types[0].slug, signal);
      } else {
        setPhase("choose");
      }
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setPhase("error");
    }
  }, [loadAvailability]);

  const boot = useCallback(
    (signal?: AbortSignal) =>
      forcedType ? loadAvailability(forcedType, signal) : loadTypes(signal),
    [forcedType, loadAvailability, loadTypes],
  );

  const retry = useCallback(() => {
    setPhase("loading");
    void boot();
  }, [boot]);

  useEffect(() => {
    const ac = new AbortController();
    // Fetch-on-mount volontaire : setState uniquement après `await`, annulable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void boot(ac.signal);
    return () => ac.abort();
  }, [boot]);

  const activeDay = useMemo<BookingDay | null>(
    () => data?.days.find((d) => d.date === selectedDate) ?? null,
    [data, selectedDate],
  );

  const handleChooseType = (slug: string) => {
    setPhase("loading");
    void loadAvailability(slug);
  };

  const backToChoose = () => {
    setData(null);
    setSlot(null);
    setPhase("choose");
  };

  const handleSlotTaken = async () => {
    if (!data) return;
    setSlot(null);
    setPhase("loading");
    await loadAvailability(data.type.slug);
  };

  // Copy de l'en-tête selon la phase.
  const header =
    phase === "choose"
      ? {
          eyebrow: chooser?.eyebrow ?? "Prendre rendez-vous",
          title: chooser?.title ?? "Quel type de rendez-vous ?",
          description: chooser?.description ?? null,
        }
      : {
          eyebrow: data?.copy.eyebrow ?? "Réserver un rendez-vous",
          title: data?.copy.headline ?? "Choisissez votre créneau.",
          description: data?.copy.description ?? null,
        };

  return (
    <div className="px-5 py-8 sm:px-10 sm:py-12">
      <header className="mx-auto max-w-[560px] text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
          {header.eyebrow}
        </p>
        <h2
          className="mt-3 font-serif text-[26px] leading-[1.1] tracking-[-0.01em] text-ink sm:text-[32px]"
          style={{ fontWeight: 300 }}
        >
          {header.title}
        </h2>
        {phase !== "success" && header.description && (
          <p className="mt-3 font-serif text-[15px] italic leading-[1.6] text-ink-soft sm:text-[16px]">
            {header.description}
          </p>
        )}
        {phase !== "success" && phase !== "choose" && preferred && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-bordeaux/25 bg-[var(--cream-deep)] px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
            Projet envisagé · {preferred}
          </p>
        )}
      </header>

      <div className="mx-auto mt-8 max-w-[620px]">
        {phase === "loading" && <SkeletonState />}

        {phase === "error" && (
          <FallbackState
            title="Impossible de charger la réservation"
            body="Un souci technique passager. Réessayez, ou écrivez-nous."
            onRetry={retry}
          />
        )}

        {phase === "empty" && (
          <FallbackState
            title="Réservation indisponible pour l'instant"
            body="Aucun créneau ouvert sur la période. Laissez-nous un message, on trouve un moment ensemble."
          />
        )}

        {phase === "choose" && (
          <ChooseStep types={types} onChoose={handleChooseType} />
        )}

        {phase === "pick" && data && activeDay && (
          <PickStep
            days={data.days}
            activeDay={activeDay}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onPickSlot={(s) => {
              setSlot(s);
              setPhase("form");
            }}
            onBack={canChangeType ? backToChoose : undefined}
          />
        )}

        {phase === "form" && slot && data && (
          <FormStep
            typeSlug={data.type.slug}
            slot={slot}
            timezone={data.timezone}
            consentLabel={data.copy.consentLabel}
            context={context}
            onBack={() => setPhase("pick")}
            onSlotTaken={handleSlotTaken}
            onSuccess={(label) => {
              setSuccessLabel(label);
              setPhase("success");
            }}
          />
        )}

        {phase === "success" && (
          <SuccessStep
            title={data?.copy.confirmationTitle ?? "Votre rendez-vous est réservé."}
            body={data?.copy.confirmationBody ?? ""}
            label={successLabel}
            onDone={onDone}
          />
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Étape 0 : choix du type ──────────────────────── */

function ChooseStep({
  types,
  onChoose,
}: {
  types: BookingTypeSummary[];
  onChoose: (slug: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {types.map((t) => (
        <button
          key={t.slug}
          type="button"
          onClick={() => onChoose(t.slug)}
          className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--rule)] bg-cream px-5 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-bordeaux hover:shadow-[0_10px_28px_rgba(122,46,67,0.10)]"
        >
          <div>
            <p className="font-serif text-[18px] leading-tight text-ink">{t.title}</p>
            {t.cardDescription && (
              <p className="mt-1 text-[13px] leading-snug text-ink-soft">
                {t.cardDescription}
              </p>
            )}
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-bordeaux">
              {MEETING_TYPE_LABELS[t.meetingType]} · {t.durationMinutes} min
            </p>
          </div>
          <ArrowRight
            className="size-5 shrink-0 text-bordeaux transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────── Étape 1 : jour + créneau ─────────────────────── */

function PickStep({
  days,
  activeDay,
  selectedDate,
  onSelectDate,
  onPickSlot,
  onBack,
}: {
  days: BookingDay[];
  activeDay: BookingDay;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onPickSlot: (slot: BookingSlot) => void;
  onBack?: () => void;
}) {
  return (
    <div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bordeaux underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.5} /> Changer de rendez-vous
        </button>
      )}
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
        1 · Choisissez un jour
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
        {days.map((day) => {
          const isActive = day.date === selectedDate;
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelectDate(day.date)}
              className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                isActive
                  ? "border-bordeaux bg-bordeaux text-cream shadow-[0_8px_24px_rgba(122,46,67,0.18)]"
                  : "border-[var(--rule)] bg-cream text-ink hover:border-bordeaux/50"
              }`}
            >
              <span className="block font-serif text-[15px] capitalize leading-tight">
                {day.label}
              </span>
              <span
                className={`mt-1 block font-mono text-[9px] uppercase tracking-[0.14em] ${
                  isActive ? "text-cream/70" : "text-ink-soft"
                }`}
              >
                {day.slots.length} créneau{day.slots.length > 1 ? "x" : ""}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mb-3 mt-7 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
        2 · Choisissez une heure
      </p>
      <motion.div
        key={activeDay.date}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-3 gap-2 sm:grid-cols-4"
      >
        {activeDay.slots.map((s) => (
          <button
            key={s.startIso}
            type="button"
            onClick={() => onPickSlot(s)}
            className="rounded-xl border border-[var(--rule-soft)] bg-cream py-3 font-mono text-[13px] tracking-wide text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-bordeaux hover:bg-bordeaux hover:text-cream hover:shadow-[0_6px_16px_rgba(122,46,67,0.16)] active:translate-y-0"
          >
            {s.timeLabel}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────── Étape 2 : coordonnées ────────────────────────── */

function FormStep({
  typeSlug,
  slot,
  timezone,
  consentLabel,
  context,
  onBack,
  onSlotTaken,
  onSuccess,
}: {
  typeSlug: string;
  slot: BookingSlot;
  timezone: string;
  consentLabel: string;
  context?: BookingContextInput;
  onBack: () => void;
  onSlotTaken: () => void;
  onSuccess: (label: string) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const slotLabel = useMemo(() => {
    const start = Date.parse(slot.startIso);
    return new Intl.DateTimeFormat("fr-FR", {
      timeZone: timezone,
      weekday: "long",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(new Date(start));
  }, [slot.startIso, timezone]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setErrors({});
    setGeneralError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      type: typeSlug,
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      slotStart: slot.startIso,
      preferredDate: context?.date ?? "",
      source: context?.source ?? "",
      content: context?.content ?? "",
      website: String(fd.get("website") ?? ""),
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok && json.ok) {
        onSuccess(json.booking?.label ?? slotLabel);
        return;
      }
      if (json.code === "slot_taken") {
        setGeneralError("Ce créneau vient d'être pris — on recharge les disponibilités.");
        setTimeout(onSlotTaken, 1200);
        return;
      }
      if (json.errors) setErrors(json.errors as FieldErrors);
      setGeneralError(json.error ?? "Une erreur est survenue. Réessayez.");
    } catch {
      setGeneralError("Connexion impossible. Vérifiez votre réseau et réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-bordeaux/25 bg-[var(--cream-deep)] px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-bordeaux">
            Créneau choisi
          </p>
          <p className="mt-0.5 font-serif text-[15px] capitalize text-ink">{slotLabel}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-bordeaux underline-offset-4 hover:underline"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.5} /> Changer
        </button>
      </div>

      <div className="grid gap-4">
        <Field label="Nom et prénom" error={errors.name}>
          <input name="name" autoComplete="name" required className={inputCls} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" error={errors.email}>
            <input name="email" type="email" autoComplete="email" required className={inputCls} />
          </Field>
          <Field label="Téléphone" error={errors.phone}>
            <input name="phone" type="tel" autoComplete="tel" required className={inputCls} />
          </Field>
        </div>
        <Field label="Votre projet en deux mots (optionnel)" error={errors.message}>
          <textarea name="message" rows={3} className={`${inputCls} resize-none`} />
        </Field>

        {/* Honeypot anti-bot — masqué aux humains */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Ne pas remplir
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="flex items-start gap-3 text-[13px] leading-relaxed text-ink-soft">
          <input
            name="consent"
            type="checkbox"
            required
            className="mt-1 size-4 shrink-0 accent-bordeaux"
          />
          <span>{consentLabel || "J'accepte d'être recontacté(e) au sujet de ma demande."}</span>
        </label>
        {errors.consent && <p className="text-[12px] text-bordeaux">{errors.consent[0]}</p>}

        {generalError && (
          <p className="rounded-xl border border-bordeaux/30 bg-bordeaux/5 px-4 py-3 text-[13px] text-bordeaux">
            {generalError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-bordeaux px-7 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-cream transition-all hover:-translate-y-0.5 active:translate-y-0 hover:bg-[var(--bordeaux-deep,#5f2333)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Réservation…
            </>
          ) : (
            <>
              Confirmer le rendez-vous
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

/* ─────────────────────────── Étape 3 : succès ─────────────────────────────── */

function SuccessStep({
  title,
  body,
  label,
  onDone,
}: {
  title: string;
  body: string;
  label: string;
  onDone?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-[460px] text-center"
    >
      <span className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-full bg-bordeaux text-cream">
        <Check className="size-6" strokeWidth={2} />
      </span>
      <h3 className="font-serif text-[24px] leading-[1.15] text-ink" style={{ fontWeight: 300 }}>
        {title}
      </h3>
      {label && (
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-bordeaux/25 bg-[var(--cream-deep)] px-5 py-2 font-serif text-[15px] capitalize text-ink">
          <Phone className="size-4 text-bordeaux" strokeWidth={1.5} /> {label}
        </p>
      )}
      {body && <p className="mt-5 text-[14px] leading-relaxed text-ink-soft">{body}</p>}
      {onDone && (
        <button
          type="button"
          onClick={onDone}
          className="mt-7 font-mono text-[11px] uppercase tracking-[0.22em] text-bordeaux underline-offset-4 hover:underline"
        >
          Fermer
        </button>
      )}
    </motion.div>
  );
}

/* ─────────────────────────── Sous-composants ──────────────────────────────── */

const inputCls =
  "w-full rounded-xl border border-[var(--rule)] bg-cream px-4 py-3 font-sans text-[15px] text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-bordeaux focus:ring-1 focus:ring-bordeaux";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-bordeaux">{error[0]}</span>}
    </label>
  );
}

function SkeletonState() {
  return (
    <div className="flex flex-col items-center gap-3 py-10">
      <Loader2 className="size-6 animate-spin text-bordeaux" />
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
        Chargement…
      </p>
    </div>
  );
}

function FallbackState({
  title,
  body,
  onRetry,
}: {
  title: string;
  body: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto max-w-[420px] rounded-2xl border border-[var(--rule)] bg-cream-soft px-6 py-8 text-center">
      <p className="font-serif text-[19px] text-ink" style={{ fontWeight: 300 }}>
        {title}
      </p>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{body}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full border border-bordeaux/30 px-5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bordeaux hover:border-bordeaux"
          >
            Réessayer
          </button>
        )}
        <Link
          href="/#contact"
          className="rounded-full bg-bordeaux px-5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-cream hover:bg-[var(--bordeaux-deep,#5f2333)]"
        >
          Nous écrire
        </Link>
      </div>
    </div>
  );
}
