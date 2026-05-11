/**
 * Sérialise un objet JSON-LD en chaîne sûre pour `dangerouslySetInnerHTML`.
 * Échappe les séquences qui pourraient s'évader du contexte `<script>`
 * ou casser le parsing :
 * - `<` et `>` (empêchent une potentielle balise `</script>` injectée)
 * - `&` (entité HTML)
 * - U+2028 / U+2029 (séparateurs de ligne JS qui cassent les littéraux)
 */
const LINE_SEPARATORS = new RegExp("[\\u2028\\u2029]", "g");

export function safeJsonLd(payload: unknown): string {
  return JSON.stringify(payload)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(LINE_SEPARATORS, (m) =>
      m === " " ? "\\u2028" : "\\u2029",
    );
}
