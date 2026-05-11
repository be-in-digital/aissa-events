import { Fragment } from "react";

/**
 * Convertit un texte avec markup `_italique_` en JSX.
 * Ex : "Mariages à _votre image._" → "Mariages à <em>votre image.</em>"
 */
export function renderInlineItalic(
  input: string | null | undefined,
  options: { italicClassName?: string } = {},
): React.ReactNode {
  if (!input) return null;
  const parts = input.split(/(_[^_]+_)/g).filter(Boolean);

  return parts.map((part, i) => {
    if (part.startsWith("_") && part.endsWith("_") && part.length >= 3) {
      const inner = part.slice(1, -1);
      return (
        <em
          key={i}
          className={options.italicClassName ?? "italic text-bordeaux"}
          style={{ fontWeight: 400 }}
        >
          {inner}
        </em>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/**
 * Préserve les retours à la ligne (\n) dans un texte rendu en JSX.
 */
export function renderMultiline(input: string | null | undefined): React.ReactNode {
  if (!input) return null;
  return input.split("\n").map((line, i, arr) => (
    <Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </Fragment>
  ));
}
