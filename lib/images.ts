/**
 * Single source for homepage imagery.
 * Swap Unsplash placeholders → real Aïssa photos by editing this file only.
 */

export const HOME_IMAGES = {
  hero: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85",

  about: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=85",

  universes: {
    espace:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=85",
    pro: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=85",
    mariage:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85",
  },

  portfolio: [
    {
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=85",
      tag: "Mariage · Domaine privé",
      title: "Une cérémonie à ciel ouvert",
    },
    {
      src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1400&q=85",
      tag: "Soirée corporate",
      title: "Lancement de marque, énergie nocturne",
    },
    {
      src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=85",
      tag: "Espace Events",
      title: "Henné en petit comité, lumières dorées",
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85",
      tag: "Mariage civil",
      title: "Bouquet maison, fleurs de saison",
    },
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=85",
      tag: "Réception",
      title: "Tablée d'honneur, nappage texturé",
    },
    {
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=85",
      tag: "After party",
      title: "Piste de danse, set live",
    },
    {
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=85",
      tag: "Anniversaire",
      title: "Décor floral suspendu",
    },
  ],

  catalogues: {
    mariage: "/images/catalogues/mariage.png",
    ambiance: "/images/catalogues/ambiance.png",
    espace: "/images/catalogues/espace-events.png",
  },
} as const;

/**
 * Imagerie page Mariages.
 * Remplacer les URLs Unsplash par les vraies photos d'Aïssa une fois
 * déposées dans `public/images/mariage/`.
 */
export const MARIAGE_IMAGES = {
  hero: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1100&q=85",

  founder:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=85",

  ceremonies: {
    civil:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85",
    religieux:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=85",
    henne:
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=85",
    fete:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85",
  },

  themes: {
    chic: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=85",
    boheme:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=85",
    orientale:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85",
    afro: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=85",
  },

  portfolio: [
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85",
      tag: "Mariage civil · Espace Events",
      title: "Sarah & Karim · 50 invités",
      description:
        "Cérémonie civile sous la verrière, Pack Premium thème Chic. Décoration table sur mesure, coordination jour J par Aïssa.",
      span: "lg:col-span-2 lg:row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=85",
      tag: "Henné · Domaine privé",
      title: "Yasmine & Amine · 120 invités",
      description:
        "Cérémonie henné au domaine du Plessis, scénographie orientale, drapés et bougies suspendues. Wedding planning complet.",
      span: "lg:col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=85",
      tag: "Mariage bohème · Château",
      title: "Léa & Mathieu · 90 invités",
      description:
        "Mariage civil + religieux + cocktail, château au sud de Paris. Thème bohème, fleurs séchées, arche en bois.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=85",
      tag: "Cérémonie laïque · Jardin",
      title: "Sofia & Adrien · 70 invités",
      description:
        "Cérémonie laïque en plein air, suivie d'une réception sous tente. Coordination & scénographie complète.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85",
      tag: "Mariage chic · Loft parisien",
      title: "Camille & Tom · 60 invités",
      description:
        "Réception en loft privé à Paris, ambiance chic & dorée. Coordination jour J + scénographie + DJ.",
      span: "lg:col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85",
      tag: "Mariage afro chic",
      title: "Aïcha & Brice · 150 invités",
      description:
        "Mariage couleurs chaudes, ocre et terracotta, salle privatisée à Marne-la-Vallée. Wedding planning A à Z.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=85",
      tag: "Mariage oriental · Salle privatisée",
      title: "Nadia & Yacine · 200 invités",
      description:
        "Cérémonie henné + civil + religieux + repas — trois jours, trois ambiances. Coordination complète, scénographie orientale signature, traiteur halal partenaire.",
      span: "lg:col-span-1",
    },
  ],

  testimonials: [
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=85",
    },
    {
      src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=85",
    },
    {
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=85",
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=85",
    },
  ],
} as const;

/**
 * Imagerie page Événements Pro.
 * Placeholders Unsplash — à remplacer par les vraies photos d'événements
 * pros réalisés (déposer dans `public/images/evenement/`).
 */
export const EVENEMENT_IMAGES = {
  hero: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1100&q=85",

  founder:
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=900&q=85",

  portfolio: [
    {
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=85",
      tag: "Lancement collection · Marque luxe",
      title: "Showroom Marais · 150 invités",
      description:
        "Lancement de collection en showroom privatisé. Direction artistique complète, scénographie sur mesure, DJ Aïssa Events, photographe corporate. Format hybride cocktail + reveal produit.",
      span: "lg:col-span-2 lg:row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85",
      tag: "Soirée client · Banque privée",
      title: "Yacht Club · 80 invités",
      description:
        "Soirée client haut de gamme, ambiance feutrée, programmation musicale jazz live + DJ. Coordination logistique et staff événementiel pris en charge de A à Z.",
      span: "lg:col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=85",
      tag: "Séminaire · Tech start-up",
      title: "Domaine Sud · 120 collaborateurs",
      description:
        "Convention annuelle 2 jours, alternant plénière et team building. Mise en lumière, son, scénographie de scène, captation vidéo recap.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=85",
      tag: "Afterwork · Agence créative",
      title: "Espace Events · 50 invités",
      description:
        "Afterwork mensuel à l'Espace Events, format cocktail debout + DJ set. Pack Ambiance Signature en formule récurrente.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=85",
      tag: "Kick-off · Cabinet conseil",
      title: "Loft Bastille · 200 invités",
      description:
        "Lancement d'année, mise en scène stratégie + concert privé. Coordination prestataires, scénographie brand-aligned, sécurité.",
      span: "lg:col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85",
      tag: "Vernissage · Marque mode",
      title: "Galerie privée · 90 invités",
      description:
        "Vernissage capsule + soirée privée. Mise en lumière galerie, programmation musicale curatée, hôtesses bilingues, photographe.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=85",
      tag: "Soirée fin d'année · Tech",
      title: "Rooftop Paris · 180 collaborateurs",
      description:
        "Soirée corporate fin d'année, animation interactive, DJ et chanteuse live, captation photo / vidéo pour com interne.",
      span: "lg:col-span-1",
    },
  ],
} as const;

/**
 * Imagerie page Réalisations.
 * Galerie filtrable agrégée — placeholders Unsplash à remplacer par les
 * vraies photos une fois disponibles dans `public/images/realisations/`.
 */
export const REALISATIONS_IMAGES = {
  /**
   * Galerie filtrable. Chaque entrée a un `universe` pour les filtres.
   * `span` détermine la place dans la grille bento.
   */
  gallery: [
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=85",
      universe: "mariage",
      tag: "Mariage civil · Espace Events",
      title: "Sarah & Karim · 50 invités",
      description:
        "Cérémonie civile sous la verrière, Pack Premium thème Chic. Décoration table sur mesure, coordination jour J par Aïssa.",
      span: "lg:col-span-2 lg:row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=85",
      universe: "pro",
      tag: "Lancement collection · Marque luxe",
      title: "Showroom Marais · 150 invités",
      description:
        "Lancement de collection en showroom privatisé. Direction artistique complète, scénographie sur mesure, DJ Aïssa Events.",
      span: "lg:col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=85",
      universe: "mariage",
      tag: "Henné · Domaine privé",
      title: "Yasmine & Amine · 120 invités",
      description:
        "Cérémonie henné au domaine du Plessis, scénographie orientale, drapés et bougies suspendues.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=85",
      universe: "mariage",
      outdoor: true,
      tag: "Mariage bohème · Château",
      title: "Léa & Mathieu · 90 invités",
      description:
        "Mariage civil + religieux + cocktail, château au sud de Paris. Thème bohème, fleurs séchées, arche en bois.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=85",
      universe: "pro",
      tag: "Soirée client · Banque privée",
      title: "Yacht Club · 80 invités",
      description:
        "Soirée client haut de gamme, ambiance feutrée, programmation jazz live + DJ.",
      span: "lg:col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=85",
      universe: "mariage",
      outdoor: true,
      tag: "Cérémonie laïque · Jardin",
      title: "Sofia & Adrien · 70 invités",
      description:
        "Cérémonie laïque en plein air, suivie d'une réception sous tente. Coordination & scénographie complète.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&q=85",
      universe: "espace",
      tag: "Afterwork · Agence créative",
      title: "Espace Events · 50 invités",
      description:
        "Afterwork mensuel à l'Espace Events, format cocktail debout + DJ set. Pack Ambiance Signature en formule récurrente.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=85",
      universe: "pro",
      tag: "Séminaire · Tech start-up",
      title: "Domaine Sud · 120 collaborateurs",
      description:
        "Convention annuelle 2 jours, alternant plénière et team building. Mise en lumière, son, scénographie de scène.",
      span: "lg:col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85",
      universe: "mariage",
      tag: "Mariage chic · Loft parisien",
      title: "Camille & Tom · 60 invités",
      description:
        "Réception en loft privé à Paris, ambiance chic & dorée. Coordination jour J + scénographie + DJ.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85",
      universe: "mariage",
      tag: "Mariage afro chic",
      title: "Aïcha & Brice · 150 invités",
      description:
        "Mariage couleurs chaudes, ocre et terracotta, salle privatisée à Marne-la-Vallée. Wedding planning A à Z.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=85",
      universe: "pro",
      tag: "Kick-off · Cabinet conseil",
      title: "Loft Bastille · 200 invités",
      description:
        "Lancement d'année, mise en scène stratégie + concert privé. Coordination prestataires, scénographie brand-aligned.",
      span: "lg:col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&q=85",
      universe: "espace",
      outdoor: true,
      tag: "Anniversaire · Privé",
      title: "Mélissa B. · 40 invités",
      description:
        "Anniversaire 30 ans à l'Espace Events. Location seule, déco maison, terrasse exploitée pour les photos.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=85",
      universe: "espace",
      tag: "Baby shower · Espace Events",
      title: "Naïma & Sofia · 35 invités",
      description:
        "Baby shower scénographié comme un magazine. Pack Fiesta avec arche ballons, terrasse extérieure pour les photos.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1496024840928-4c417adf211d?w=1200&q=85",
      universe: "pro",
      tag: "Vernissage · Marque mode",
      title: "Galerie privée · 90 invités",
      description:
        "Vernissage capsule + soirée privée. Mise en lumière galerie, programmation curatée, hôtesses bilingues.",
      span: "lg:col-span-1",
    },
  ],
} as const;

/**
 * Galerie Espace Events Émerainville.
 * Remplacer les URLs Unsplash par les vraies photos d'Aïssa une fois
 * déposées dans `public/images/espace/`.
 */
export const ESPACE_IMAGES = {
  hero: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1100&q=85",

  gallery: [
    {
      src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=85",
      tag: "La salle principale",
      title: "Configuration cérémonie",
      description:
        "65 m² lumineux, modulables. Chaises Napoléon, tables rondes ou rectangle, scénographie sur mesure.",
      span: "lg:col-span-2 lg:row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=85",
      tag: "La verrière",
      title: "25 m² baignés de lumière",
      description:
        "L'espace signature du lieu : verrière de 25 m² qui se transforme en coin photo, en espace lounge ou en piste de danse selon votre brief.",
      span: "lg:col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=85",
      tag: "La terrasse",
      title: "Extérieur privé",
      description:
        "Terrasse extérieure pour vos cocktails, photos de groupe et bouffées d'air entre deux moments.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85",
      tag: "Configuration repas",
      title: "Tablée d'honneur",
      description:
        "Mise en place pour cérémonies assises — vaisselle, chemins de table, fleurs, lumières d'ambiance.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85",
      tag: "Configuration debout",
      title: "Énergie festive",
      description:
        "Mange-debout, buffet, DJ, lumières d'ambiance — la salle bascule en mode soirée en quelques minutes.",
      span: "lg:col-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=85",
      tag: "La cuisine",
      title: "Équipée pour traiteurs",
      description:
        "Cuisine pro à disposition de votre traiteur. Frigo, plan de travail, point d'eau, espace de stockage.",
      span: "lg:col-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=85",
      tag: "Décoration thème",
      title: "Mood Bohème · Chic · Afro",
      description:
        "Trois univers décoratifs au choix dans le Pack Premium — chemins de table, arches, signalétique, fleurs.",
      span: "lg:col-span-1",
    },
  ],
} as const;
