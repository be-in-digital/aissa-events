/**
 * Convertit le markdown produit par Claude en Portable Text Sanity
 * compatible avec le schéma `blockContent` (cf. sanity/schemas/objects/common.ts).
 *
 * Styles supportés : normal, h2, h3, blockquote.
 * Listes : bullet, number.
 * Decorators : strong (**), em (*), underline non supporté en markdown.
 * Annotations : link (auto-detect [texte](url)).
 *
 * Implémentation volontairement simple (sans parser markdown lourd) car le
 * markdown généré par Claude suit un format prévisible et nous appliquons
 * déjà un post-processing strict.
 */

type Decorator = "strong" | "em" | "underline";

interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks: string[];
}

interface PortableTextMarkDef {
  _key: string;
  _type: "link";
  href: string;
  blank?: boolean;
}

interface PortableTextBlock {
  _type: "block";
  _key: string;
  style: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
  level?: number;
  children: PortableTextSpan[];
  markDefs: PortableTextMarkDef[];
}

let keyCounter = 0;
function genKey(prefix: string): string {
  keyCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${keyCounter.toString(36)}`;
}

/**
 * Parse les marques inline (**bold**, *italic*, [link](url)) d'une ligne
 * et retourne un tableau de spans avec marques et markDefs associées.
 */
function parseInlineMarks(
  line: string,
  blockKey: string,
): { spans: PortableTextSpan[]; markDefs: PortableTextMarkDef[] } {
  const spans: PortableTextSpan[] = [];
  const markDefs: PortableTextMarkDef[] = [];

  // 1. Extract liens markdown [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const segments: Array<{ text: string; linkKey?: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: line.slice(lastIndex, match.index) });
    }
    const linkKey = genKey("link");
    markDefs.push({
      _key: linkKey,
      _type: "link",
      href: match[2],
      blank: true,
    });
    segments.push({ text: match[1], linkKey });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < line.length) segments.push({ text: line.slice(lastIndex) });

  // 2. Pour chaque segment, parse **bold** et *italic*
  for (const seg of segments) {
    const subSpans = parseDecorators(seg.text, blockKey);
    if (seg.linkKey) {
      for (const s of subSpans) s.marks = [...s.marks, seg.linkKey];
    }
    spans.push(...subSpans);
  }

  return { spans, markDefs };
}

/**
 * Parse les decorators (**strong**, *em*) d'un fragment de texte.
 * Approche : itère sur les marqueurs et émet des spans.
 */
function parseDecorators(text: string, blockKey: string): PortableTextSpan[] {
  const tokens: Array<{ text: string; marks: Decorator[] }> = [];
  const activeMarks: Decorator[] = [];

  // Regex qui matche **...** ou *...* (non greedy)
  // On le tokenize manuellement pour gérer correctement les niveaux.
  const pattern = /(\*\*[^*]+\*\*|\*[^*\s][^*]*[^*\s]\*|\*[^*\s]\*)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > lastIndex) {
      tokens.push({ text: text.slice(lastIndex, m.index), marks: [...activeMarks] });
    }
    const token = m[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      tokens.push({ text: token.slice(2, -2), marks: [...activeMarks, "strong"] });
    } else if (token.startsWith("*") && token.endsWith("*")) {
      tokens.push({ text: token.slice(1, -1), marks: [...activeMarks, "em"] });
    } else {
      tokens.push({ text: token, marks: [...activeMarks] });
    }
    lastIndex = m.index + token.length;
  }
  if (lastIndex < text.length) {
    tokens.push({ text: text.slice(lastIndex), marks: [...activeMarks] });
  }
  if (tokens.length === 0) {
    tokens.push({ text, marks: [] });
  }

  return tokens
    .filter((t) => t.text.length > 0)
    .map((t) => ({
      _type: "span" as const,
      _key: genKey(`span-${blockKey}`),
      text: t.text,
      marks: t.marks,
    }));
}

function makeBlock(
  style: PortableTextBlock["style"],
  text: string,
  opts: { listItem?: "bullet" | "number"; level?: number } = {},
): PortableTextBlock {
  const blockKey = genKey("block");
  const { spans, markDefs } = parseInlineMarks(text, blockKey);
  return {
    _type: "block",
    _key: blockKey,
    style,
    ...(opts.listItem ? { listItem: opts.listItem, level: opts.level ?? 1 } : {}),
    children: spans.length > 0 ? spans : [
      { _type: "span", _key: genKey("span"), text, marks: [] },
    ],
    markDefs,
  };
}

/**
 * Convertit du markdown en tableau de blocs Portable Text.
 * Accepte plusieurs sections concaténées (chaque section commence par ## H2).
 */
export function markdownToPortableText(markdown: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = [];
  const lines = markdown.split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Ligne vide → skip
    if (trimmed === "") {
      i += 1;
      continue;
    }

    // Titres
    if (trimmed.startsWith("## ")) {
      blocks.push(makeBlock("h2", trimmed.slice(3).trim()));
      i += 1;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      blocks.push(makeBlock("h3", trimmed.slice(4).trim()));
      i += 1;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      // H1 en blog body est rare (le title du post sert d'H1) — converti en h2
      blocks.push(makeBlock("h2", trimmed.slice(2).trim()));
      i += 1;
      continue;
    }

    // Citations
    if (trimmed.startsWith("> ")) {
      blocks.push(makeBlock("blockquote", trimmed.slice(2).trim()));
      i += 1;
      continue;
    }

    // Listes à puces
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push(makeBlock("normal", trimmed.slice(2).trim(), { listItem: "bullet", level: 1 }));
      i += 1;
      continue;
    }

    // Listes numérotées
    if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s/, "");
      blocks.push(makeBlock("normal", text, { listItem: "number", level: 1 }));
      i += 1;
      continue;
    }

    // Paragraphe — regroupe les lignes consécutives jusqu'à ligne vide ou pattern spécial
    const paraLines: string[] = [trimmed];
    let j = i + 1;
    while (j < lines.length) {
      const next = lines[j].trim();
      if (
        next === "" ||
        next.startsWith("## ") ||
        next.startsWith("### ") ||
        next.startsWith("# ") ||
        next.startsWith("> ") ||
        next.startsWith("- ") ||
        next.startsWith("* ") ||
        /^\d+\.\s/.test(next)
      ) {
        break;
      }
      paraLines.push(next);
      j += 1;
    }
    blocks.push(makeBlock("normal", paraLines.join(" ")));
    i = j;
  }

  return blocks;
}
