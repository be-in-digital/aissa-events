import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";
import { env } from "@/env";

const builder = imageUrlBuilder({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
});

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

export function urlForImageString(
  source: SanityImageSource,
  options?: { width?: number; height?: number; quality?: number },
): string {
  let img = urlForImage(source);
  if (options?.width) img = img.width(options.width);
  if (options?.height) img = img.height(options.height);
  if (options?.quality) img = img.quality(options.quality);
  return img.url();
}
