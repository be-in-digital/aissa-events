import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlForImageString } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";

type SanityImageProps = {
  image: {
    asset?: unknown;
    alt?: string | null;
  } | null | undefined;
  width: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackAlt?: string;
};

export function SanityImage({
  image,
  width,
  height,
  className,
  sizes,
  priority,
  fallbackAlt = "",
}: SanityImageProps) {
  if (!image?.asset) return null;

  const src = urlForImageString(image as SanityImageSource, {
    width,
    height,
    quality: 80,
  });

  return (
    <Image
      src={src}
      width={width}
      height={height ?? Math.round(width * 0.66)}
      alt={image.alt || fallbackAlt}
      className={cn("h-auto w-full", className)}
      sizes={sizes}
      priority={priority}
    />
  );
}
