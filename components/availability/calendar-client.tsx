"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildCalendlyUrl } from "@/lib/calendly";
import { Eyebrow } from "@/components/home/eyebrow";
import type { CalendarMonth, CalendarDay } from "./calendar";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

const formatLastSync = (iso: string | null) => {
  if (!iso) return null;
  const date = new Date(iso);
  const diffMin = Math.round((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH} h`;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};

type Props = {
  months: CalendarMonth[];
  utmSource: string;
  utmContent: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  lastSyncedAt: string | null;
  isLive: boolean;
};

/**
 * Pattern standard "datepicker" : 1 mois sur mobile, 2 mois côte à côte sur
 * desktop, navigation par flèches prev/next. Pensé pour vivre dans une modale
 * — beaucoup plus aéré que la grille 3-mois précédente.
 */
export function AvailabilityCalendarClient({
  months,
  utmSource,
  utmContent,
  eyebrow,
  title,
  description,
  lastSyncedAt,
  isLive,
}: Props) {
  const [cursor, setCursor] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  // 2 mois côte à côte dès qu'on a la place horizontale (≥ 720 px).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 720px)");
    const update = () => setVisibleCount(mql.matches ? 2 : 1);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const maxCursor = Math.max(0, months.length - visibleCount);
  const safeCursor = Math.min(cursor, maxCursor);

  const visibleMonths = useMemo(
    () => months.slice(safeCursor, safeCursor + visibleCount),
    [months, safeCursor, visibleCount],
  );

  const syncLabel = formatLastSync(lastSyncedAt);
  const canPrev = safeCursor > 0;
  const canNext = safeCursor < maxCursor;

  return (
    <section className="relative px-5 py-10 sm:px-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-[680px] text-center"
      >
        {eyebrow && (
          <div className="mb-4">
            <Eyebrow align="center">{eyebrow}</Eyebrow>
          </div>
        )}
        {title && (
          <h2
            className="font-serif text-[28px] leading-[1.05] tracking-[-0.02em] sm:text-[36px]"
            style={{ fontWeight: 300 }}
          >
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-3 font-serif text-[15px] italic leading-[1.6] text-ink-soft sm:text-[17px]">
            {description}
          </p>
        )}
        <Legend isLive={isLive} syncLabel={syncLabel} />
      </motion.div>

      <div className="mx-auto mt-10 max-w-[840px]">
        <div className="mb-5 flex items-center justify-between">
          <NavButton
            direction="prev"
            disabled={!canPrev}
            onClick={() => setCursor((c) => Math.max(0, c - 1))}
          />
          <div className="flex-1 text-center">
            <p className="font-serif text-[20px] capitalize tracking-tight text-ink sm:text-[22px]">
              {visibleMonths.length === 2
                ? `${visibleMonths[0].label} — ${visibleMonths[1].label}`
                : visibleMonths[0]?.label}
            </p>
          </div>
          <NavButton
            direction="next"
            disabled={!canNext}
            onClick={() => setCursor((c) => Math.min(maxCursor, c + 1))}
          />
        </div>

        <div
          className={
            visibleCount === 2
              ? "grid grid-cols-2 gap-8"
              : "grid grid-cols-1 gap-6"
          }
        >
          {visibleMonths.map((month) => (
            <MonthGrid
              key={month.key}
              month={month}
              utmSource={utmSource}
              utmContent={utmContent}
            />
          ))}
        </div>

        <p className="mt-8 text-center font-serif text-[14px] italic text-ink-soft">
          Cliquez sur une date libre pour réserver un appel découverte —
          Aïssa confirme sous 48 h.
        </p>
      </div>
    </section>
  );
}

function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Mois précédent" : "Mois suivant"}
      className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--rule)] bg-cream text-ink transition-all duration-200 hover:border-bordeaux hover:text-bordeaux disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[var(--rule)] disabled:hover:text-ink"
    >
      <Icon className="size-5" strokeWidth={1.5} />
    </button>
  );
}

function Legend({
  isLive,
  syncLabel,
}: {
  isLive: boolean;
  syncLabel: string | null;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-soft">
      <span className="inline-flex items-center gap-2">
        <span className="size-2.5 rounded-full border border-bordeaux/40 bg-cream" />
        Libre
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="size-2.5 rounded-full border border-bordeaux/40 bg-[var(--cream-deep)]" />
        Option en cours
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="size-2.5 rounded-full bg-bordeaux/20" />
        Réservé
      </span>
      {isLive && syncLabel && (
        <span className="inline-flex items-center gap-2 normal-case tracking-normal">
          <span className="size-1.5 animate-pulse rounded-full bg-bordeaux" />
          Mise à jour {syncLabel}
        </span>
      )}
    </div>
  );
}

function MonthGrid({
  month,
  utmSource,
  utmContent,
}: {
  month: CalendarMonth;
  utmSource: string;
  utmContent: string;
}) {
  const cells: ({ kind: "spacer" } | { kind: "day"; day: CalendarDay })[] = [];
  for (let i = 0; i < month.startOffset; i++) cells.push({ kind: "spacer" });
  for (const day of month.days) cells.push({ kind: "day", day });

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
        {WEEKDAYS.map((d, i) => (
          <div key={i} className="py-2 text-center">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {cells.map((cell, i) => {
          if (cell.kind === "spacer") {
            return <div key={`s-${i}`} className="aspect-square" />;
          }
          return (
            <DayCell
              key={cell.day.iso}
              day={cell.day}
              utmSource={utmSource}
              utmContent={utmContent}
            />
          );
        })}
      </div>
    </div>
  );
}

function DayCell({
  day,
  utmSource,
  utmContent,
}: {
  day: CalendarDay;
  utmSource: string;
  utmContent: string;
}) {
  const base =
    "relative flex aspect-square items-center justify-center rounded-lg text-[14px] font-medium transition-all duration-200 sm:text-[15px]";

  if (day.status === "past") {
    return (
      <div className={`${base} text-ink-soft/25`} aria-hidden>
        {day.dayOfMonth}
      </div>
    );
  }

  if (day.status === "booked") {
    return (
      <div
        className={`${base} cursor-not-allowed bg-bordeaux/12 text-ink-soft/55 line-through decoration-bordeaux/40`}
        title="Réservé"
        aria-label={`${day.dayOfMonth} — réservé`}
      >
        {day.dayOfMonth}
      </div>
    );
  }

  const isOption = day.status === "option";
  const href = buildCalendlyUrl({
    source: utmSource,
    content: `${utmContent}${isOption ? "-option" : ""}-${day.iso}`,
    preferredDate: day.iso,
  });

  const tooltip = isOption
    ? "Pré-réservation en cours — encore négociable si vous êtes rapide"
    : "Libre — réserver une visite à cette date";

  const cls = isOption
    ? `${base} bg-[var(--cream-deep)] text-ink hover:bg-bordeaux hover:text-cream hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_6px_16px_rgba(122,46,67,0.18)]`
    : `${base} bg-cream text-ink ring-1 ring-inset ring-[var(--rule-soft)] hover:bg-bordeaux hover:text-cream hover:-translate-y-0.5 active:translate-y-0 hover:ring-bordeaux hover:shadow-[0_6px_16px_rgba(122,46,67,0.18)] ${
        day.isWeekend ? "font-semibold" : ""
      }`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      title={tooltip}
      aria-label={`${day.dayOfMonth} — ${isOption ? "option" : "libre"}`}
    >
      {day.dayOfMonth}
      {isOption && (
        <span
          aria-hidden
          className="absolute right-1 top-1 size-1.5 rounded-full bg-bordeaux/70"
        />
      )}
    </Link>
  );
}
