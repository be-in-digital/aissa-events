/* eslint-disable no-console */
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

async function main() {
  const id = `probe-${Date.now()}`;
  console.log("project=", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log("dataset=", process.env.NEXT_PUBLIC_SANITY_DATASET);
  console.log("token length=", process.env.SANITY_API_WRITE_TOKEN?.length);

  const draftId = `drafts.${id}`;
  console.log("Creating draft", draftId);

  const result = await client
    .transaction()
    .createIfNotExists({ _id: draftId, _type: "post" })
    .patch(draftId, (p) =>
      p.set({ title: "Probe minimal" }).setIfMissing({ publishedAt: new Date().toISOString() }),
    )
    .commit();

  console.log("Result:", JSON.stringify(result, null, 2));

  const fetched = await client.fetch(`*[_id==$id][0]{_id,title,publishedAt}`, { id: draftId });
  console.log("Fetched:", JSON.stringify(fetched, null, 2));
}

main().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
