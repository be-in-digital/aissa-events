/**
 * Catalogue de toutes les images utilisées dans le seed Sanity.
 *
 * Format de placeholder dans les docs seed :
 *   image: { __imageKey: "home-hero", alt: "Mariage à Émerainville" }
 *
 * Le script `upload-images.ts` télécharge chaque URL, l'upload dans Sanity et
 * remplit un cache local (`.sanity-image-cache.json`) avec les `asset._id`.
 * Le script `seed-sanity.ts` walke ensuite les docs et remplace les
 * `{ __imageKey: X }` par des `imageWithAlt` résolus.
 */

export type ImageCatalogEntry = {
  url: string;
  alt: string;
  /** Optionnel : nom de fichier proprement nommé pour Sanity. */
  filename?: string;
};

export const IMAGE_CATALOG = {
  // ───── Homepage ─────
  "home-hero": {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85",
    alt: "Mariage organisé par Aïssa Events à Émerainville",
    filename: "home-hero.jpg",
  },
  "home-about-founder": {
    url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1600&q=85",
    alt: "Aïssa, fondatrice et directrice artistique d'Aïssa Events",
    filename: "home-about.jpg",
  },

  // ───── Univers (3 cartes) ─────
  "universe-espace": {
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=85",
    alt: "Espace Events à Émerainville, salle de réception modulable",
    filename: "universe-espace.jpg",
  },
  "universe-pro": {
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=85",
    alt: "Soirée corporate organisée par Aïssa Events",
    filename: "universe-pro.jpg",
  },
  "universe-mariage": {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=85",
    alt: "Mariage afro-chic orchestré par Aïssa Events",
    filename: "universe-mariage.jpg",
  },

  // ───── Réalisations (case studies) ─────
  "realisation-sarah-david-cover": {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1800&q=85",
    alt: "Mariage afro-chic de Sarah et David au Domaine du Bois Joli",
    filename: "real-sarah-david.jpg",
  },
  "realisation-sarah-david-mood-1": {
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85",
    alt: "Détails fleurs protéas et lys, mariage Sarah & David",
    filename: "real-sarah-david-mood-1.jpg",
  },
  "realisation-sarah-david-mood-2": {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85",
    alt: "Mise en place tablée, mariage Sarah & David",
    filename: "real-sarah-david-mood-2.jpg",
  },
  "realisation-sarah-david-mood-3": {
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=85",
    alt: "Lumières dorées au crépuscule, mariage Sarah & David",
    filename: "real-sarah-david-mood-3.jpg",
  },
  "realisation-cote-sud-cover": {
    url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1800&q=85",
    alt: "Lancement de marque Maison Côté Sud à Paris 11ᵉ",
    filename: "real-cote-sud.jpg",
  },
  "realisation-cote-sud-mood-1": {
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=85",
    alt: "DJ set lancement Maison Côté Sud",
    filename: "real-cote-sud-mood-1.jpg",
  },
  "realisation-cote-sud-mood-2": {
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=85",
    alt: "Espace cocktail Maison Côté Sud",
    filename: "real-cote-sud-mood-2.jpg",
  },
  "realisation-cote-sud-mood-3": {
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85",
    alt: "Palette brutalist velvet, Maison Côté Sud",
    filename: "real-cote-sud-mood-3.jpg",
  },

  // ───── Page Mariage ─────
  "mariage-hero": {
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=85",
    alt: "Décor de mariage organisé par Aïssa Events en Île-de-France",
    filename: "mariage-hero.jpg",
  },
  "mariage-intro": {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=85",
    alt: "Préparation mariage, scénographie Aïssa Events",
    filename: "mariage-intro.jpg",
  },

  // ───── Thèmes mariage (4) ─────
  "theme-chic": {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85",
    alt: "Thème de mariage Chic — vaisselle dorée et palette ivoire",
    filename: "theme-chic.jpg",
  },
  "theme-boheme": {
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=85",
    alt: "Thème de mariage Bohème — fleurs séchées et lin",
    filename: "theme-boheme.jpg",
  },
  "theme-orientale": {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=85",
    alt: "Thème oriental — lanternes dorées et drapés",
    filename: "theme-orientale.jpg",
  },
  "theme-afro": {
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85",
    alt: "Thème afro chic — palette ocre et terracotta",
    filename: "theme-afro.jpg",
  },

  // ───── Cérémonies (4) ─────
  "ceremonie-civil": {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=85",
    alt: "Cérémonie civile orchestrée par Aïssa Events",
    filename: "ceremonie-civil.jpg",
  },
  "ceremonie-religieux": {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1400&q=85",
    alt: "Cérémonie religieuse mixte, scénographie Aïssa Events",
    filename: "ceremonie-religieux.jpg",
  },
  "ceremonie-henne": {
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1400&q=85",
    alt: "Cérémonie henné, mise en scène orientale",
    filename: "ceremonie-henne.jpg",
  },
  "ceremonie-fete": {
    url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=85",
    alt: "Cérémonie laïque en plein air, jardin privé",
    filename: "ceremonie-fete.jpg",
  },

  // ───── Page Événements pro ─────
  "evenement-hero": {
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=85",
    alt: "Événement pro orchestré par Aïssa Events à Paris",
    filename: "evenement-hero.jpg",
  },
  "evenement-intro": {
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=85",
    alt: "Soirée client en yacht club, DJ et ambiance feutrée",
    filename: "evenement-intro.jpg",
  },

  // ───── Page Espace Events ─────
  "espace-hero": {
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=85",
    alt: "Espace Events Émerainville, salle modulable jusqu'à 50 invités",
    filename: "espace-hero.jpg",
  },
  "espace-intro": {
    url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=85",
    alt: "Vue de la verrière de l'Espace Events",
    filename: "espace-intro.jpg",
  },
  "espace-venue": {
    url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=85",
    alt: "La salle principale, configuration cérémonie",
    filename: "espace-venue.jpg",
  },

  // ───── Galerie Espace ─────
  "espace-gallery-1": {
    url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=85",
    alt: "Salle principale, configuration cérémonie",
    filename: "espace-gallery-1.jpg",
  },
  "espace-gallery-2": {
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=85",
    alt: "Verrière de 25 m² baignée de lumière",
    filename: "espace-gallery-2.jpg",
  },
  "espace-gallery-3": {
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=85",
    alt: "Terrasse extérieure privative",
    filename: "espace-gallery-3.jpg",
  },
  "espace-gallery-4": {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85",
    alt: "Tablée d'honneur, configuration dîner",
    filename: "espace-gallery-4.jpg",
  },
  "espace-gallery-5": {
    url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85",
    alt: "Configuration debout, énergie festive",
    filename: "espace-gallery-5.jpg",
  },
  "espace-gallery-6": {
    url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=85",
    alt: "Cuisine équipée pour les traiteurs",
    filename: "espace-gallery-6.jpg",
  },

  // ───── Galerie Mariage (partagée page Mariage + Réalisations) ─────
  "gallery-mariage-1": {
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=85",
    alt: "Mariage civil à l'Espace Events",
    filename: "gallery-mariage-1.jpg",
  },
  "gallery-mariage-2": {
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1400&q=85",
    alt: "Henné en domaine privé, scénographie orientale",
    filename: "gallery-mariage-2.jpg",
  },
  "gallery-mariage-3": {
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=85",
    alt: "Mariage bohème en château",
    filename: "gallery-mariage-3.jpg",
  },
  "gallery-mariage-4": {
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1400&q=85",
    alt: "Cérémonie laïque en jardin",
    filename: "gallery-mariage-4.jpg",
  },

  // ───── Réalisations page — gallery additionnelle ─────
  "gallery-pro-1": {
    url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=85",
    alt: "Soirée client en yacht club",
    filename: "gallery-pro-1.jpg",
  },
  "gallery-pro-2": {
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1400&q=85",
    alt: "Séminaire tech start-up, domaine au sud de Paris",
    filename: "gallery-pro-2.jpg",
  },

  // ───── Open Graph ─────
  "og-default": {
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&fit=crop&q=85",
    alt: "Aïssa Events — Wedding planner & agence événementielle",
    filename: "og-default.jpg",
  },
} as const satisfies Record<string, ImageCatalogEntry>;

export type ImageKey = keyof typeof IMAGE_CATALOG;

/**
 * Helper pour créer un placeholder qui sera résolu au moment du seed.
 */
export function imageRef(key: ImageKey, altOverride?: string) {
  return {
    __imageKey: key,
    altOverride,
  } as const;
}

export type ImagePlaceholder = ReturnType<typeof imageRef>;
