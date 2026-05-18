/* eslint-disable no-console */
/**
 * Diagnostic — dump tous les documents mariagePage (incluant drafts) avec
 * leur section lieux.items pour comprendre l'état réel de la donnée.
 *
 * Usage : pnpm tsx scripts/debug-mariage-lieux.ts
 */
import { config as loadDotenv } from "dotenv";
loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_API_WRITE_TOKEN!;

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
  perspective: "raw",
});

async function main() {
  console.log(`→ Inspecting mariagePage docs in ${projectId}/${dataset}`);

  const docs = await client.fetch<
    Array<{
      _id: string;
      _rev?: string;
      _updatedAt?: string;
      lieux?: {
        items?: Array<{
          _key?: string;
          title?: string;
          description?: string;
          highlights?: string[];
        }>;
      };
    }>
  >(`*[_type == "mariagePage"]{_id, _rev, _updatedAt, lieux}`);

  console.log(`Found ${docs.length} doc(s).\n`);

  for (const d of docs) {
    console.log("———");
    console.log(`_id        : ${d._id}`);
    console.log(`_updatedAt : ${d._updatedAt}`);
    const items = d.lieux?.items ?? [];
    console.log(`lieux.items : ${items.length} item(s)`);
    items.forEach((it, idx) => {
      console.log(`  [${idx}] _key="${it._key}" title="${it.title ?? ""}"`);
      if (it.description) console.log(`       desc: ${it.description.slice(0, 120)}…`);
      if (it.highlights?.length) {
        console.log(`       highlights: ${JSON.stringify(it.highlights)}`);
      }
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
