/**
 * Lien CTA de contact — remplace le scheduler de RDV natif (retiré). Les boutons
 * « Réserver / Prendre RDV » pointent vers le formulaire de contact en attendant
 * l'intégration d'un service externe. L'argument optionnel (ancien BookingContext)
 * est ignoré volontairement pour éviter de toucher tous les appelants.
 */
export const CONTACT_HREF = "/#contact";

export function buildContactUrl(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- signature conservée (ancien BookingContext), argument ignoré volontairement
  _context?: {
    source?: string;
    content?: string;
    type?: string;
    preferredDate?: string;
  },
): string {
  return CONTACT_HREF;
}
