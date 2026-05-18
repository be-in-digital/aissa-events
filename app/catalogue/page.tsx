import type { Metadata } from "next";
import { catalogueBody } from "./catalogue-body";
import { PrintButton } from "./print-button";
import "./catalogue.css";

export const metadata: Metadata = {
  title: "Catalogue 2026 — Espace Events Émerainville",
  description:
    "Catalogue 2026 de l'Espace Events Émerainville signé Aïssa Events : packs Célébration, packs Festivité, options à la carte, agencement, réservation.",
  robots: { index: false, follow: false },
};

export default function CataloguePage() {
  return (
    <div className="catalogue-shell">
      <div className="catalogue-toolbar">
        <span className="brand">Aïssa Events · Catalogue 2026</span>
        <PrintButton />
      </div>
      <div dangerouslySetInnerHTML={{ __html: catalogueBody }} />
    </div>
  );
}
