import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { muxInput } from "sanity-plugin-mux-input";
import { schemaTypes } from "./sanity/schemas";
import { structure, SINGLETON_TYPES } from "./sanity/structure";
import { env } from "./env";

const isDev = process.env.NODE_ENV === "development";

export default defineConfig({
  name: "aissa-events",
  title: "Aïssa Events",
  basePath: "/studio",
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  plugins: [
    structureTool({ structure }),
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
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action && !["unpublish", "delete", "duplicate"].includes(action),
          )
        : input,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter(
            (template) => !SINGLETON_TYPES.has(template.templateId),
          )
        : prev,
  },
});
