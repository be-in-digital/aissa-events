import { sanityClient } from "./client";
import type { QueryParams } from "next-sanity";

type FetchOptions = {
  tags?: string[];
  revalidate?: number | false;
};

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 60,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
} & FetchOptions): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags: tags.length > 0 ? tags : undefined,
    },
  });
}
