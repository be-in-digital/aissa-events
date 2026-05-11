import { cache } from "react";
import { sanityFetch } from "./fetch";
import { siteSettingsQuery } from "./queries";
import type { SiteSettingsQueryResult } from "@/sanity.types";

export const getSiteSettings = cache(async (): Promise<SiteSettingsQueryResult> => {
  return sanityFetch<SiteSettingsQueryResult>({
    query: siteSettingsQuery,
    tags: ["siteSettings"],
  });
});
