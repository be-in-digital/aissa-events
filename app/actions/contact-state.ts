import type { ContactFormErrors } from "@/lib/contact/schema";

export type ContactFormState = {
  status: "idle" | "success" | "error" | "rate_limited";
  errors?: ContactFormErrors;
  generalError?: string;
  submittedAt?: number;
};

export const INITIAL_CONTACT_STATE: ContactFormState = { status: "idle" };
