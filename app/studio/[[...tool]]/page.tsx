import { Suspense } from "react";
import { connection } from "next/server";
import { Studio } from "./Studio";

export { metadata, viewport } from "next-sanity/studio";

async function DynamicStudio() {
  await connection();
  return <Studio />;
}

export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <DynamicStudio />
    </Suspense>
  );
}
