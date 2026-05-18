"use client";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()}>
      Imprimer en PDF
    </button>
  );
}
