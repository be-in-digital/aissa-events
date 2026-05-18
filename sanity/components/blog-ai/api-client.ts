import type {
  GenerateImagesRequest,
  GenerateSectionRequest,
  GenerateSkeletonRequest,
  ImageVariant,
  SectionResult,
  Skeleton,
} from "@/lib/blog/types";

import { env } from "@/env";

function getAuthHeader(): string {
  const token = env.NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN;
  if (!token) {
    throw new Error(
      "NEXT_PUBLIC_BLOG_AI_ADMIN_TOKEN n'est pas configuré. Ajoute-le dans .env.local.",
    );
  }
  return `Bearer ${token}`;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(
      `Requête ${path} a échoué (${res.status}): ${errBody.slice(0, 300) || res.statusText}`,
    );
  }
  return (await res.json()) as T;
}

export async function callGenerateSkeleton(
  body: GenerateSkeletonRequest,
): Promise<{ skeleton: Skeleton }> {
  return postJson("/api/admin/blog/generate-skeleton", body);
}

export async function callGenerateSection(
  body: GenerateSectionRequest,
): Promise<{ section: SectionResult }> {
  return postJson("/api/admin/blog/generate-section", body);
}

export async function callGenerateImages(
  body: GenerateImagesRequest,
): Promise<{ variants: ImageVariant[] }> {
  return postJson("/api/admin/blog/generate-images", body);
}

interface SuggestKeypointsRequest {
  subject: string;
  audience: string;
  angle: string;
  intent: "info" | "seo" | "lead-gen" | "mixed";
  seoKeywords?: string[];
}

export async function callSuggestKeypoints(
  body: SuggestKeypointsRequest,
): Promise<{ keyPoints: string[] }> {
  return postJson("/api/admin/blog/suggest-keypoints", body);
}
