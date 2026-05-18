import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/lib/sanity/client";

/**
 * Active le draft mode Next.js après validation du secret signé par la
 * Presentation tool Sanity. Doit pointer le `previewUrl.previewMode.enable`
 * vers `/api/draft-mode/enable`.
 *
 * Requiert `SANITY_API_READ_TOKEN` (token Viewer généré dans manage.sanity.io).
 */
export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({
    token: process.env.SANITY_API_READ_TOKEN,
  }),
});
