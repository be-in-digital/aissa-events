import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { muxInput } from "sanity-plugin-mux-input";
import { schemaTypes } from "./sanity/schemas";
import { structure, SINGLETON_TYPES } from "./sanity/structure";
import { generateArticleAction } from "./sanity/actions/generateArticleAction";
import { env } from "./env";

const isDev = process.env.NODE_ENV === "development";

const PREVIEW_ORIGIN =
  typeof window === "undefined"
    ? env.NEXT_PUBLIC_SITE_URL
    : window.location.origin;

export default defineConfig({
  name: "aissa-events",
  title: "Aïssa Events",
  basePath: "/studio",
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      title: "Aperçu en direct",
      previewUrl: {
        origin: PREVIEW_ORIGIN,
        preview: "/",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    muxInput(),
    ...(isDev ? [visionTool({ defaultApiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION })] : []),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !SINGLETON_TYPES.has(schemaType),
      ),
  },
  document: {
    actions: (input, context) => {
      if (SINGLETON_TYPES.has(context.schemaType)) {
        return input.filter(
          ({ action }) => action && !["unpublish", "delete", "duplicate"].includes(action),
        );
      }
      if (context.schemaType === "post") {
        return [...input, generateArticleAction];
      }
      return input;
    },
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter(
            (template) => !SINGLETON_TYPES.has(template.templateId),
          )
        : prev,
  },
});
