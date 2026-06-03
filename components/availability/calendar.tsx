import { connection } from "next/server";
import { getAvailabilityData } from "@/lib/availability/server";
import { getStatusForDate, type DayStatus } from "@/lib/availability";
import { AvailabilityCalendarClient } from "./calendar-client";

const MAX_MONTHS = 12;

export type CalendarDay = {
  iso: string;
  dayOfMonth: number;
  status: DayStatus;
  isWeekend: boolean;
};

export type CalendarMonth = {
  key: string;
  label: string;
  year: number;
  monthIndex: number;
  /** Décalage de la première colonne (0=lundi … 6=dimanche). */
  startOffset: number;
  days: CalendarDay[];
};

const MONTH_FMT = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
});

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildMonth(
  year: number,
  monthIndex: number,
  resolveStatus: (date: Date) => DayStatus,
): CalendarMonth {
  const firstDay = new Date(year, monthIndex, 1);
  // Lundi = 0, Dimanche = 6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const days: CalendarDay[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, monthIndex, i);
    const dow = date.getDay();
    days.push({
      iso: toISODate(date),
      dayOfMonth: i,
      status: resolveStatus(date),
      isWeekend: dow === 0 || dow === 6,
    });
  }

  return {
    key: `${year}-${String(monthIndex + 1).padStart(2, "0")}`,
    label: MONTH_FMT.format(firstDay),
    year,
    monthIndex,
    startOffset,
    days,
  };
}

type Props = {
  utmSource: string;
  utmContent?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export async function AvailabilityCalendar({
  utmSource,
  utmContent = "calendar",
  eyebrow = "Disponibilités",
  title = "Quel jour vous tente ?",
  description,
}: Props) {
  await connection();
  const data = await getAvailabilityData();

  const resolveStatus = (date: Date) => getStatusForDate(data, date);

  const now = new Date();
  const months: CalendarMonth[] = [];
  for (let i = 0; i < MAX_MONTHS; i++) {
    const target = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push(buildMonth(target.getFullYear(), target.getMonth(), resolveStatus));
  }

  return (
    <AvailabilityCalendarClient
      months={months}
      utmSource={utmSource}
      utmContent={utmContent}
      eyebrow={eyebrow}
      title={title}
      description={description}
      lastSyncedAt={data.lastSyncedAt ?? null}
      isLive={data.enabled && data.busyRanges.length > 0}
    />
  );
}
