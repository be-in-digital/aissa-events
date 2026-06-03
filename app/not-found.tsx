import { NotFoundContent } from "@/components/site/not-found-content";

/**
 * 404 globale (URL ne correspondant à aucune route). Rendue dans le root layout
 * uniquement (pas de header/footer du site), donc NotFoundContent est conçu
 * pour être auto-suffisant (CTA accueil + liens utiles).
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <NotFoundContent />
    </div>
  );
}
