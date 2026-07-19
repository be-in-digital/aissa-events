import type { BusinessLeadErrors } from "@/lib/contact/business-schema";

export type BusinessLeadState = {
  status: "idle" | "success" | "error" | "rate_limited";
  errors?: BusinessLeadErrors;
  generalError?: string;
  submittedAt?: number;
};

export const INITIAL_BUSINESS_STATE: BusinessLeadState = { status: "idle" };
