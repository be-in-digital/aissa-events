import { env } from "@/env";

export type CalendlyContext = {
  source?: string;
  content?: string;
};

export function buildCalendlyUrl(context: CalendlyContext = {}): string {
  const { source = "espace-emerainville", content } = context;
  const url = new URL(env.NEXT_PUBLIC_CALENDLY_URL);
  url.searchParams.set("utm_source", source);
  if (content) {
    url.searchParams.set("utm_content", content);
  }
  return url.toString();
}
