import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { SanityImage } from "./sanity-image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-4 text-base leading-relaxed text-ink/80 first:mt-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 font-serif italic text-2xl text-ink first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-serif italic text-xl text-ink first:mt-0">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-gold/60 pl-5 font-serif italic text-lg leading-relaxed text-ink/85">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-1 pl-5 text-ink/80 marker:text-gold">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-1 pl-5 text-ink/80 marker:text-gold">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-ink">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
    link: ({ children, value }) => {
      const raw = typeof value?.href === "string" ? value.href : "";
      const isSafe = /^(https?:|mailto:|tel:|\/[^/]|#)/i.test(raw);
      const href = isSafe ? raw : "#";
      const isExternal = Boolean(value?.blank);
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="underline underline-offset-2 hover:text-gold"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    imageWithAlt: ({ value }) => (
      <div className="mt-6 overflow-hidden rounded-2xl">
        <SanityImage image={value} width={1200} sizes="(min-width: 1024px) 800px, 100vw" />
      </div>
    ),
  },
};

export function RichText({ value }: { value: unknown }) {
  if (!value) return null;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <PortableText value={value as any} components={components} />
  );
}
