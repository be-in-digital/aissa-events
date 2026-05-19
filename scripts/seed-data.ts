/**
 * Données de seed pour Sanity. Tout le contenu actuel du site, prêt à être poussé.
 * Utilisé par scripts/seed-sanity.ts.
 *
 * Pour les images : on utilise des placeholders `imageRef("key")` qui sont
 * résolus en `imageWithAlt` au moment du push par `resolveImagePlaceholders()`.
 * Voir scripts/image-catalog.ts pour la liste des clés disponibles.
 */
import { imageRef } from "./image-catalog";

// ============================================================================
// SITE SETTINGS
// ============================================================================
export const siteSettingsDoc = {
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: "Aïssa Events",
  tagline: "The Perfect Timing",
  defaultOgImage: imageRef("og-default"),
  founder: {
    name: "Aïssa",
    role: "Fondatrice & Directrice Artistique",
    signatureName: "Aïssa",
    photo: imageRef("home-about-founder", "Aïssa, fondatrice d'Aïssa Events"),
    bio: [
      {
        _type: "block",
        _key: "bio1",
        style: "normal",
        children: [
          { _type: "span", _key: "s1", text: "Aïssa Events. Fondée en 2020 par Aïssa, wedding planner diplômée de l'Académie du Wedding Planning Paris. Avant ça, six ans à la production événementielle chez Art Academy.", marks: [] },
        ],
      },
      {
        _type: "block",
        _key: "bio2",
        style: "normal",
        children: [
          { _type: "span", _key: "s1", text: "Ce qu'on a retenu de ces années-là : sur un mariage de cent personnes, ce qui plante en premier, c'est rarement le décor. C'est la bande-son qui s'arrête au mauvais moment, ou le traiteur qui sert le plat principal pendant le discours du témoin. D'où le rétroplanning ultra-détaillé qu'on impose à tout le monde, prestataires inclus.", marks: [] },
        ],
      },
      {
        _type: "block",
        _key: "bio3",
        style: "normal",
        children: [
          { _type: "span", _key: "s1", text: "Aujourd'hui on travaille sur des mariages (la plus grosse partie du planning), des soirées pro, des anniversaires, des baptêmes, des henné. Notre salle d'Émerainville accueille jusqu'à 50 personnes ; pour les formats plus grands, on se déplace en Île-de-France. Le réseau de partenaires (fleuristes, DJ, traiteurs halal et casher, photographes, officiants) s'est construit sur soixante mariages. On en a viré quelques-uns en route.", marks: [] },
        ],
      },
    ],
    signatureQuote: "Une soirée tient grâce à sa bande-son. C'est ce qu'on travaille en premier.",
  },
  headerNav: [
    { _key: "n1", label: "Espace Events", cta: { _type: "cta", label: "Espace Events", type: "internal", internalPath: "/espace-events", variant: "ghost" } },
    { _key: "n2", label: "Événements pro", cta: { _type: "cta", label: "Événements pro", type: "internal", internalPath: "/evenements-pro", variant: "ghost" } },
    { _key: "n3", label: "Mariage", cta: { _type: "cta", label: "Mariage", type: "internal", internalPath: "/mariage", variant: "ghost" } },
    { _key: "n4", label: "Réalisations", cta: { _type: "cta", label: "Réalisations", type: "internal", internalPath: "/realisations", variant: "ghost" } },
    { _key: "n5", label: "Blog", cta: { _type: "cta", label: "Blog", type: "internal", internalPath: "/blog", variant: "ghost" } },
  ],
  headerCta: {
    _type: "cta",
    label: "Réserver un appel",
    type: "anchor",
    anchor: "contact",
    variant: "primary",
  },
  email: "contact@aissaevents.com",
  phone: "06 61 94 88 59",
  phoneHref: "+33661948859",
  address: {
    street: "35 Bd de Beaubourg",
    city: "Émerainville",
    postalCode: "77184",
    region: "Île-de-France",
    country: "France",
  },
  hours: [
    { _key: "h1", label: "Lundi-Vendredi", value: "9h-18h" },
    { _key: "h2", label: "Week-end", value: "Sur rendez-vous" },
  ],
  calendlyUrl: "https://calendly.com/aissaeventscontact",
  social: {
    items: [
      { _key: "s1", platform: "instagram", label: "Instagram", url: "https://instagram.com/aissa.events" },
      { _key: "s2", platform: "tiktok", label: "TikTok", url: "https://tiktok.com/@aissa.events" },
    ],
  },
  footerTagline:
    "Agence événementielle à Émerainville (77), depuis 2020. Notre lieu (Espace Events) accueille mariages, baptêmes, anniversaires, henné, événements pros et soirées jusqu'à 50 personnes. Pour les autres formats, nous nous déplaçons partout en Île-de-France.",
  footerColumns: [
    {
      _key: "c1",
      title: "Univers",
      links: [
        { _key: "l1", label: "Espace Events · le lieu", cta: { _type: "cta", label: "Espace Events", type: "internal", internalPath: "/espace-events", variant: "ghost" } },
        { _key: "l2", label: "Événements pro", cta: { _type: "cta", label: "Événements pro", type: "internal", internalPath: "/evenements-pro", variant: "ghost" } },
        { _key: "l3", label: "Mariages & cérémonies", cta: { _type: "cta", label: "Mariages & cérémonies", type: "internal", internalPath: "/mariage", variant: "ghost" } },
      ],
    },
    {
      _key: "c2",
      title: "Agence",
      links: [
        { _key: "l1", label: "À propos d'Aïssa", cta: { _type: "cta", label: "À propos", type: "internal", internalPath: "/#about", variant: "ghost" } },
        { _key: "l2", label: "Portfolio", cta: { _type: "cta", label: "Portfolio", type: "internal", internalPath: "/realisations", variant: "ghost" } },
        { _key: "l3", label: "Témoignages", cta: { _type: "cta", label: "Témoignages", type: "anchor", anchor: "testimonials", variant: "ghost" } },
        { _key: "l4", label: "Réserver un appel", cta: { _type: "cta", label: "Réserver", type: "anchor", anchor: "contact", variant: "ghost" } },
      ],
    },
  ],
  footerContactTitle: "Contact",
  footerCopyright: "© 2026 Aïssa Events · Tous droits réservés",
  footerLegalLinks: [
    { _key: "l1", label: "Mentions légales", cta: { _type: "cta", label: "Mentions", type: "internal", internalPath: "/mentions-legales", variant: "ghost" } },
    { _key: "l2", label: "Confidentialité", cta: { _type: "cta", label: "Confidentialité", type: "internal", internalPath: "/politique-confidentialite", variant: "ghost" } },
  ],
  legal: {
    companyName: "Aïssa Events",
    siret: "",
    rcs: "",
    vatNumber: "",
    directorName: "Aïssa",
    host: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA",
  },
  defaultSeo: {
    title: "Aïssa Events · Agence événementielle à Émerainville (77)",
    description:
      "Agence événementielle à Émerainville (Seine-et-Marne), depuis 2020. Mariages, baptêmes, anniversaires, henné, événements pros, séminaires. Espace Events — votre lieu de réception en Île-de-France.",
  },
};

// ============================================================================
// HOME PAGE
// ============================================================================
export const homePageDoc = {
  _id: "homePage",
  _type: "homePage",
  hero: {
    _type: "heroHomeSection",
    enabled: true,
    eyebrow: "Agence événementielle · Émerainville 77 · Depuis 2020",
    title: "Vos événements à _votre image._",
    subtitle:
      "Mariages, baptêmes, anniversaires, henné, événements pro, séminaires. Dans notre lieu à Émerainville (77) ou chez vous, partout en Île-de-France.",
    image: imageRef("home-hero"),
    ctas: [
      { _type: "cta", _key: "c1", label: "Réserver un appel", type: "anchor", anchor: "contact", variant: "primary" },
      { _type: "cta", _key: "c2", label: "Découvrir l'univers", type: "anchor", anchor: "universes", variant: "secondary" },
    ],
    stats: [
      { _key: "s1", value: "+60", label: "Événements orchestrés" },
      { _key: "s2", value: "Émerainville", label: "Notre lieu (77)" },
      { _key: "s3", value: "IDF", label: "& au-delà" },
    ],
    quoteBadge: {
      label: "Aïssa, fondatrice",
      quote: "Une soirée tient grâce à sa bande-son. C'est ce qu'on travaille en premier.",
    },
  },
  marquee: {
    _type: "marqueeSection",
    enabled: true,
    items: [
      "Mariages & cérémonies",
      "Événements professionnels",
      "Anniversaires & célébrations",
      "Direction artistique",
      "Scénographie sur mesure",
      "DJ & live performances",
    ],
  },
  caseStudies: {
    _type: "caseStudiesSection",
    enabled: true,
    eyebrow: "Études de cas",
    title: "Deux projets,\n_deux briefs._",
    intro:
      "Deux exemples concrets de projets que nous avons accompagnés. Le brief reçu, ce qui a été décidé, comment ça s'est passé.",
    selectedRealisations: [
      { _type: "reference", _key: "r1", _ref: "realisation-sarah-david" },
      { _type: "reference", _key: "r2", _ref: "realisation-cote-sud" },
    ],
    footerEyebrow: "+ 60 événements orchestrés depuis 2020",
    footerCta: {
      _type: "cta",
      label: "Voir toutes les réalisations",
      type: "internal",
      internalPath: "/realisations",
      variant: "secondary",
    },
  },
  universes: {
    _type: "universesSection",
    enabled: true,
    eyebrow: "1 lieu · 3 services · Émerainville (77)",
    title: "Trois services,\nun même _métier._",
    intro:
      "Aïssa Events propose trois services qui se complètent : la location de notre lieu à Émerainville, l'organisation d'événements pro (en Pack ou sur mesure), et le wedding planning partout en Île-de-France. Chaque service a son tarif et ses inclusions sur le devis.",
    items: [
      {
        _key: "u1",
        title: "Espace",
        italic: "Events",
        shortDesc: "Notre salle à Émerainville (77), 65 m² modulables, jusqu'à 50 personnes.",
        longDesc:
          "Mariages civils, henné, baptêmes, anniversaires, baby showers, EVJF : on prend tous ces formats. Trois options : cérémonies assises (Pack Célébration), fêtes debout (Pack Festivité), ou location seule si vous voulez vos propres prestataires.",
        tags: ["Le lieu", "Pack Célébration", "Pack Festivité", "Location seule"],
        price: { label: "Location seule", value: "350 €", note: "Packs tout compris dès 1 000 €" },
        image: imageRef("universe-espace"),
        primaryCta: { _type: "cta", label: "Découvrir le lieu", type: "internal", internalPath: "/espace-events", variant: "primary" },
        secondaryCta: { _type: "cta", label: "Réserver une visite", type: "anchor", anchor: "contact", variant: "secondary" },
      },
      {
        _key: "u2",
        title: "Événements",
        italic: "pro",
        shortDesc:
          "Soirées clients, afterworks, lancements de marque, séminaires. Chez vous, dans votre propre lieu, ou à l'Espace Events.",
        longDesc:
          "Deux formats : Pack Ambiance (clé en main) ou sur mesure (lieu + DJ + traiteur coordonnés ensemble). On gère la scéno, la musique et la logistique pour que vos équipes restent disponibles pour vos invités.",
        tags: ["Pack Ambiance", "Sur mesure", "DJ & traiteur", "Lieu inclus"],
        price: { label: "À partir de", value: "1 750 €", note: "Pack Ambiance Signature" },
        image: imageRef("universe-pro"),
        primaryCta: { _type: "cta", label: "Voir les formules", type: "internal", internalPath: "/evenements-pro", variant: "primary" },
        secondaryCta: { _type: "cta", label: "Réserver un appel", type: "anchor", anchor: "contact", variant: "secondary" },
      },
      {
        _key: "u3",
        title: "Mariages",
        italic: "Wedding planning",
        shortDesc:
          "Wedding planning à l'Espace Events ou dans le lieu de votre choix, partout en Île-de-France.",
        longDesc:
          "Deux formats : organisation complète (4 thèmes proposés : Orientale, Afro chic, Bohème, Chic) ou À la carte (coordination jour J seule). Wedding planner diplômée, scénographie adaptée à votre brief, et notre réseau de partenaires éprouvés depuis six ans.",
        tags: ["Complète A → Z", "À la carte", "4 thèmes proposés", "55 € / table"],
        price: { label: "À partir de", value: "1 250 €", note: "Espace Events ou ailleurs" },
        image: imageRef("universe-mariage"),
        primaryCta: { _type: "cta", label: "Voir les formules", type: "internal", internalPath: "/mariage", variant: "primary" },
        secondaryCta: { _type: "cta", label: "Réserver un appel", type: "anchor", anchor: "contact", variant: "secondary" },
      },
    ],
  },
  process: {
    _type: "processSection",
    enabled: true,
    eyebrow: "Comment ça se passe",
    title: "Du premier _échange_\nau jour de votre événement.",
    steps: [
      {
        _key: "p1",
        italic: "Vous prenez",
        rest: "rendez-vous",
        description:
          "15 minutes en visio ou téléphone, à votre rythme. Réservez le créneau qui vous convient.",
      },
      {
        _key: "p2",
        italic: "On échange",
        rest: "sur votre projet",
        description:
          "Vos envies, votre vision, votre date, votre budget. On comprend votre projet en profondeur.",
      },
      {
        _key: "p3",
        italic: "On vous propose",
        rest: "une solution",
        description: "Un devis clair sous 7 jours, sans engagement. Mood board et planning inclus.",
      },
      {
        _key: "p4",
        italic: "On organise",
        rest: "votre événement",
        description:
          "Du brief signé jusqu'à la coordination du jour J. Vous arrivez le matin, vous ne touchez à rien.",
      },
    ],
    cta: { _type: "cta", label: "Prendre rendez-vous", type: "anchor", anchor: "contact", variant: "primary" },
  },
  about: {
    _type: "aboutSection",
    enabled: true,
    eyebrow: "À propos d'Aïssa",
    title: "Agence événementielle\nà _Émerainville_\ndepuis 2020.",
    image: imageRef("home-about-founder"),
  },
  pillars: {
    _type: "pillarsSection",
    enabled: true,
    quote: "Le jour J,\nvous _profitez._\nLe reste, c'est notre métier.",
    quoteAuthor: "— Aïssa, Fondatrice",
    items: [
      {
        _key: "p1",
        title: "ADN",
        italic: "Musical",
        description:
          "DJ, artistes live, playlists curatées. La bande-son d'une soirée n'est jamais un détail : elle décide du moment où vos invités quittent leur table, et de l'heure à laquelle ils rentrent.",
      },
      {
        _key: "p2",
        title: "Vision",
        italic: "Artistique",
        description:
          "Décor, lumière, fleurs, signalétique. Une scénographie tient debout quand tous ces éléments répondent à la même intention. Notre rôle : choisir, marier, et savoir dire non quand un détail ne sert pas l'ensemble.",
      },
      {
        _key: "p3",
        title: "Organisation",
        italic: "Sereine",
        description:
          "Une coordinatrice référente, un réseau de partenaires testés depuis six ans (fleuristes, traiteurs, photographes, DJ). Rétroplanning tenu à la minute, plan B prévu pour ce qui peut déraper. Vous arrivez le jour J, vous profitez.",
      },
    ],
  },
  testimonials: {
    _type: "testimonialsSection",
    enabled: true,
    eyebrow: "Avis · Mariages 2025",
    title: "Ce qu'ils\nen _disent._",
    filterByType: "all",
  },
  faq: {
    _type: "faqSection",
    enabled: true,
    eyebrow: "Questions fréquentes",
    title: "Tout ce que vous\n_vouliez savoir._",
    scope: "homepage",
  },
  contact: {
    _type: "contactSection",
    enabled: true,
    eyebrow: "Parlons de votre projet",
    title: "Parlez-nous de\nvotre _projet._",
    intro:
      "Que vous ayez un brief précis ou juste une date en tête, on en discute. Un appel de 30 minutes, sans engagement, pour cadrer votre besoin et voir si on est sur la même longueur d'onde. Aïssa répond sous 48h ouvrées.",
    calendlyEyebrow: "— Le plus rapide",
    calendlyTitle: "Réservez un appel découverte de 30 minutes",
    calendlyDescription: "Gratuit, sans engagement. Pour cadrer votre projet et voir si on est aligné.",
    calendlyButtonLabel: "Choisir un créneau",
    formEyebrow: "— Ou écrivez-nous",
    formTitle: "Décrivez votre projet",
    formEventTypes: [
      "Mariage / Cérémonie",
      "Événement professionnel",
      "Anniversaire",
      "EVJF / EVG",
      "Baby shower / Baptême",
      "Autre célébration",
    ],
    formSubmitLabel: "Envoyer mon projet",
    formSuccessTitle: "Merci !",
    formSuccessMessage: "Aïssa répond sous 48h ouvrées.",
  },
};

// ============================================================================
// REALISATIONS (case studies)
// ============================================================================
export const realisationDocs = [
  {
    _id: "realisation-sarah-david",
    _type: "realisation",
    title: "Sarah & David — un afro-chic au Bois Joli",
    shortTitle: "Sarah & David —",
    italicSubtitle: "un afro-chic au Bois Joli",
    slug: { _type: "slug", current: "sarah-david-afro-chic" },
    type: "mariage",
    typeLabel: "Mariage",
    eventDate: "2025-09-13",
    location: "Domaine du Bois Joli (77)",
    guestCount: 180,
    theme: "Afro chic & dorures",
    badge: "Cas n°01",
    story:
      "Sarah & David nous contactent onze mois avant le mariage. Brief : 180 invités, deux familles (afro-européenne et française), un thème afro-chic à tenir sans tomber dans le déguisement. On travaille avec un fleuriste sur des protéas et des lys, on retaille du tissu wax en chemin de table, on cale la cérémonie laïque sur la lumière de fin d'après-midi. DJ live afro-house à partir de minuit. Personne n'est rentré avant trois heures du matin.",
    quote: {
      text: "Aïssa a tout de suite compris ce qu'on voulait, et surtout ce qu'on ne voulait pas. C'est rare. On lui a fait confiance sur les détails qu'on n'arrivait pas à trancher.",
      author: "Sarah & David",
    },
    metaItems: [
      { _key: "m1", label: "Lieu", value: "Domaine du Bois Joli (77)" },
      { _key: "m2", label: "Date", value: "Septembre 2025" },
      { _key: "m3", label: "Invités", value: "180 convives" },
      { _key: "m4", label: "Thème", value: "Afro chic & dorures" },
    ],
    alignment: "left",
    tags: ["mariage", "afro chic", "180 invités"],
    featured: true,
    cover: imageRef("realisation-sarah-david-cover"),
    moodBoard: [
      { _key: "mb1", ...imageRef("realisation-sarah-david-mood-1") },
      { _key: "mb2", ...imageRef("realisation-sarah-david-mood-2") },
      { _key: "mb3", ...imageRef("realisation-sarah-david-mood-3") },
    ],
  },
  {
    _id: "realisation-cote-sud",
    _type: "realisation",
    title: "Maison Côté Sud — un lancement de marque",
    shortTitle: "Maison Côté Sud —",
    italicSubtitle: "un lancement de marque",
    slug: { _type: "slug", current: "maison-cote-sud-lancement" },
    type: "corporate",
    typeLabel: "Événement pro",
    eventDate: "2026-03-15",
    location: "Loft privé, Paris 11ᵉ",
    guestCount: 120,
    theme: "Brutalist meets velvet",
    badge: "Cas n°02",
    story:
      "Maison Côté Sud, marque de mobilier qui sortait sa première collection grand public. Brief : un événement de lancement pour 120 prescripteurs (presse, influenceurs déco, distributeurs), avec un budget serré et trois semaines de prep. On a privatisé un loft à Paris 11ᵉ, découpé en six zones reprenant la palette de la collection. DJ live (un des artistes de leur campagne pub), cocktails signés avec leur chef ambassadeur. Bilan trois mois plus tard : couverture dans AD France, 180 000 vues Instagram cumulées, trois nouveaux distributeurs.",
    quote: {
      text: "On lui a donné un brief de 800 mots et un budget. Trois semaines après, on avait la soirée qu'on avait imaginée, sans avoir eu à recadrer une seule fois.",
      author: "Camille L. · Brand Director",
    },
    metaItems: [
      { _key: "m1", label: "Lieu", value: "Loft privé, Paris 11ᵉ" },
      { _key: "m2", label: "Date", value: "Mars 2026" },
      { _key: "m3", label: "Invités", value: "120 prescripteurs" },
      { _key: "m4", label: "Thème", value: "Brutalist meets velvet" },
    ],
    alignment: "right",
    tags: ["corporate", "lancement", "Paris"],
    featured: true,
    cover: imageRef("realisation-cote-sud-cover"),
    moodBoard: [
      { _key: "mb1", ...imageRef("realisation-cote-sud-mood-1") },
      { _key: "mb2", ...imageRef("realisation-cote-sud-mood-2") },
      { _key: "mb3", ...imageRef("realisation-cote-sud-mood-3") },
    ],
  },
];

// ============================================================================
// TESTIMONIALS
// ============================================================================
export const testimonialDocs = [
  {
    _id: "testimonial-alessiane-fahmi",
    _type: "testimonial",
    quote:
      "On a contacté Aïssa neuf mois avant le mariage, paniqués parce qu'on n'avait rien décidé. Elle a tout pris en main : le lieu, le traiteur, les fleurs, le DJ. Pendant la préparation, elle nous appelait quand il fallait trancher quelque chose, pas tous les trois jours pour nous demander notre avis sur des nappes. Le jour J, on n'a même pas eu à regarder l'heure. Notre seul regret : que ça n'ait pas duré deux jours.",
    authorName: "Alessiane & Fahmi",
    authorRole: "Mariage · Décembre 2025",
    rating: 5,
    eventType: "mariage",
    source: "direct",
    featured: true,
    order: 1,
  },
  {
    _id: "testimonial-hamlaoui-lilia",
    _type: "testimonial",
    quote:
      "Mariage de ma sœur en juillet, 90 invités, à l'Espace Events d'Émerainville. On a appelé Aïssa parce qu'elle gère le henné aussi, ce qu'on n'avait pas trouvé ailleurs. Tout s'est enchaîné sans qu'on ait à courir entre les prestataires : elle parlait au traiteur, au DJ, au photographe à notre place. La salle est petite mais intelligemment aménagée, sur 90 personnes on n'était jamais serrés. Bonne adresse pour les mariages mixtes.",
    authorName: "Hamlaoui Lilia",
    authorRole: "Mariage · Juillet 2025",
    rating: 5,
    eventType: "mariage",
    source: "direct",
    featured: true,
    order: 2,
  },
];

// ============================================================================
// FAQ ITEMS (homepage scope)
// ============================================================================
export const faqItemDocs = [
  {
    _id: "faq-1",
    _type: "faqItem",
    question: "À partir de quand faut-il vous contacter pour un mariage ?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Idéalement 9 à 12 mois avant la date, c'est le plus confortable pour caler le lieu et les prestataires. On prend aussi des projets à 4-6 mois sans baisser la qualité. On a même déjà organisé un mariage en 8 semaines (cas exceptionnel, surcoût lié à l'urgence). Plus tôt vous nous parlez, plus on a de marge.",
            marks: [],
          },
        ],
      },
    ],
    scope: ["homepage", "mariage"],
    order: 1,
  },
  {
    _id: "faq-2",
    _type: "faqItem",
    question: "Mon mariage est ailleurs qu'à l'Espace Events. Vous vous déplacez ?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Bien sûr. Le service Mariages couvre toute l'Île-de-France et le reste de la France pour les projets qui le justifient. L'Espace Events est notre lieu, mais ce n'est qu'une option parmi d'autres. On travaille régulièrement chez vous, dans des domaines, châteaux, lofts ou lieux atypiques.",
            marks: [],
          },
        ],
      },
    ],
    scope: ["homepage", "mariage"],
    order: 2,
  },
  {
    _id: "faq-3",
    _type: "faqItem",
    question: "Peut-on garder son traiteur, son DJ ou son fleuriste ?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Oui. Nos formules incluent nos partenaires habituels, mais rien n'est figé. Si vous avez déjà des prestataires que vous voulez garder, on s'intègre à votre équipe et on les coordonne. Si vous n'avez personne, on vous propose les nôtres, éprouvés au fil des années.",
            marks: [],
          },
        ],
      },
    ],
    scope: ["homepage", "mariage"],
    order: 3,
  },
  {
    _id: "faq-4",
    _type: "faqItem",
    question: "Vos prix incluent-ils tout, ou y a-t-il des extras cachés ?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Tout est listé dans le devis. Aucun frais surprise. On précise même les options qui pourraient être ajoutées plus tard (lumières d'ambiance, photographe, vidéo, fleurs supplémentaires) pour que vous gardiez le contrôle. Si le budget devient serré, on en parle avant.",
            marks: [],
          },
        ],
      },
    ],
    scope: ["homepage", "mariage", "evenement", "espace"],
    order: 4,
  },
  {
    _id: "faq-5",
    _type: "faqItem",
    question: "Comment fonctionne le paiement ?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "30 % d'acompte à la signature pour bloquer la date, 40 % deux mois avant l'événement, le solde 7 jours avant. On peut adapter pour les projets longs ou les budgets serrés. C'est un échange, pas une formule rigide.",
            marks: [],
          },
        ],
      },
    ],
    scope: ["homepage", "mariage", "evenement", "espace"],
    order: 5,
  },
  {
    _id: "faq-6",
    _type: "faqItem",
    question: "Et s'il pleut, ou s'il y a un imprévu majeur ?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Plan B systématique inscrit dans le rétroplanning : repli intérieur, prestataire de secours, marges sur les horaires. On gère les imprévus pour que vous n'en ayez pas connaissance. Notre travail, c'est aussi de prévoir ce que vous n'avez pas envie de prévoir.",
            marks: [],
          },
        ],
      },
    ],
    scope: ["homepage", "mariage", "evenement"],
    order: 6,
  },
  {
    _id: "faq-7",
    _type: "faqItem",
    question: "Travaillez-vous aussi pour des événements professionnels ?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "C'est l'un de nos trois services. Soirées clients, lancements, séminaires, afterworks. En Pack Ambiance clé en main, ou en formule sur mesure (lieu + DJ + traiteur coordonnés ensemble). Le brief diffère du mariage, mais le niveau d'exigence reste le même.",
            marks: [],
          },
        ],
      },
    ],
    scope: ["homepage", "evenement"],
    order: 7,
  },
  {
    _id: "faq-8",
    _type: "faqItem",
    question: "Comment se passe le premier contact concrètement ?",
    answer: [
      {
        _type: "block",
        _key: "b1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Vous réservez un appel découverte de 30 minutes via le bouton « Réserver un appel ». On échange sur votre projet, vos envies, votre date. Sans engagement. Ensuite, devis sous 5 jours si on continue ensemble.",
            marks: [],
          },
        ],
      },
    ],
    scope: ["homepage", "mariage", "evenement", "espace"],
    order: 8,
  },
];

// ============================================================================
// PACKS
// ============================================================================
export const packDocs = [
  // Mariage
  {
    _id: "pack-mariage-complet",
    _type: "pack",
    title: "Wedding planning complet",
    slug: { _type: "slug", current: "mariage-complet" },
    type: "mariage",
    tagline: "Du brief signé à la coordination du jour J. On gère tout, vous profitez.",
    priceFrom: 4500,
    priceLabel: "À partir de 4 500 €",
    includedItems: [
      "Recherche du lieu & visites",
      "Sélection des prestataires (traiteur, DJ, photographe, fleurs)",
      "Direction artistique & mood board",
      "Rétroplanning détaillé",
      "Coordination jour J (10-12h sur place)",
      "Plan B météo & imprévus",
    ],
    excludedItems: ["Budget des prestataires", "Voyage de noces"],
    cta: { _type: "cta", label: "Demander un devis", type: "anchor", anchor: "contact", variant: "primary" },
    order: 1,
    featured: true,
  },
  {
    _id: "pack-mariage-alacarte",
    _type: "pack",
    title: "Wedding planning à la carte",
    slug: { _type: "slug", current: "mariage-a-la-carte" },
    type: "mariage",
    tagline: "Pour les couples qui veulent garder la main, avec notre soutien sur les points clés.",
    priceFrom: 1250,
    priceLabel: "À partir de 1 250 €",
    includedItems: [
      "Coordination jour J seule",
      "Recherche prestataires (modulable)",
      "Direction artistique partielle",
      "Conseils stratégiques",
    ],
    cta: { _type: "cta", label: "Demander un devis", type: "anchor", anchor: "contact", variant: "primary" },
    order: 2,
  },
  // Evenement
  {
    _id: "pack-evenement-ambiance",
    _type: "pack",
    title: "Pack Ambiance Signature",
    slug: { _type: "slug", current: "evenement-ambiance-signature" },
    type: "evenement",
    tagline: "Direction artistique, DJ, mise en lumière, déco, coordination — tout inclus.",
    priceFrom: 1750,
    priceLabel: "À partir de 1 750 €",
    includedItems: [
      "Direction artistique & mood board",
      "DJ professionnel (5 h)",
      "Mise en lumière",
      "Décoration scénographique",
      "Coordination jour J",
    ],
    cta: { _type: "cta", label: "Demander un devis", type: "anchor", anchor: "contact", variant: "primary" },
    order: 1,
    featured: true,
  },
  {
    _id: "pack-evenement-surmesure",
    _type: "pack",
    title: "Sur mesure",
    slug: { _type: "slug", current: "evenement-sur-mesure" },
    type: "evenement",
    tagline: "Pour les briefs ambitieux : lieu + DJ + traiteur coordonnés ensemble.",
    priceLabel: "Sur devis",
    includedItems: [
      "Recherche de lieu",
      "Brief créatif & direction artistique",
      "Coordination prestataires",
      "Production événementielle",
      "Coordination jour J",
    ],
    cta: { _type: "cta", label: "Discutons-en", type: "anchor", anchor: "contact", variant: "primary" },
    order: 2,
  },
  // Espace Events / Celebration
  {
    _id: "pack-celebration-classic",
    _type: "pack",
    title: "Pack Célébration Classic",
    slug: { _type: "slug", current: "celebration-classic" },
    type: "celebration",
    level: "classic",
    tagline: "Notre lieu équipé pour vos cérémonies et célébrations jusqu'à 50 personnes.",
    priceFrom: 1000,
    priceLabel: "À partir de 1 000 €",
    includedItems: [
      "Privatisation 6 h",
      "Mobilier de base",
      "Sono & lumières",
      "Mise en place & nettoyage",
    ],
    cta: { _type: "cta", label: "Réserver une visite", type: "anchor", anchor: "contact", variant: "primary" },
    order: 1,
  },
  {
    _id: "pack-celebration-premium",
    _type: "pack",
    title: "Pack Célébration Premium",
    slug: { _type: "slug", current: "celebration-premium" },
    type: "celebration",
    level: "premium",
    tagline: "Le confort total : décoration, DJ, et coordination incluses.",
    priceFrom: 1750,
    priceLabel: "À partir de 1 750 €",
    includedItems: [
      "Privatisation 8 h",
      "Mobilier premium",
      "DJ professionnel (4 h)",
      "Décoration florale",
      "Coordination",
    ],
    cta: { _type: "cta", label: "Réserver une visite", type: "anchor", anchor: "contact", variant: "primary" },
    order: 2,
    featured: true,
  },
  {
    _id: "pack-celebration-prestige",
    _type: "pack",
    title: "Pack Célébration Prestige",
    slug: { _type: "slug", current: "celebration-prestige" },
    type: "celebration",
    level: "prestige",
    tagline: "Tout compris pour un événement clé en main mémorable.",
    priceFrom: 3200,
    priceLabel: "À partir de 3 200 €",
    includedItems: [
      "Privatisation journée complète",
      "Mobilier prestige",
      "DJ + animation live",
      "Décoration florale signature",
      "Coordination + photographe",
      "Service traiteur partenaire",
    ],
    cta: { _type: "cta", label: "Réserver une visite", type: "anchor", anchor: "contact", variant: "primary" },
    order: 3,
  },
];

// ============================================================================
// SERVICES À LA CARTE
// ============================================================================
export const serviceDocs = [
  // Mariage
  { _id: "srv-m-1", _type: "service", title: "Coordination jour J", category: "coordination", scope: "mariage", description: "Une coordinatrice dédiée pour gérer le timing, les prestataires, les imprévus.", icon: "calendar", priceLabel: "Sur devis", order: 1 },
  { _id: "srv-m-2", _type: "service", title: "Direction artistique", category: "design", scope: "mariage", description: "Mood board, palette, scénographie. On dessine l'ambiance avant tout le reste.", icon: "palette", priceLabel: "À partir de 800 €", order: 2 },
  { _id: "srv-m-3", _type: "service", title: "Recherche de lieu", category: "venue", scope: "mariage", description: "On identifie 3 à 5 lieux qui correspondent à votre brief, votre budget, votre date.", icon: "map-pin", priceLabel: "Forfait 350 €", order: 3 },
  { _id: "srv-m-4", _type: "service", title: "Cérémonie laïque", category: "ceremonie", scope: "mariage", description: "Écriture du déroulé, choix de l'officiant, coordination des prises de parole.", icon: "heart", priceLabel: "Forfait 600 €", order: 4 },
  // Evenement
  { _id: "srv-e-1", _type: "service", title: "DJ professionnel", category: "music", scope: "evenement", description: "DJ confirmé, matériel inclus, brief musical sur mesure.", icon: "music", priceLabel: "À partir de 800 €", order: 1 },
  { _id: "srv-e-2", _type: "service", title: "Mise en lumière", category: "design", scope: "evenement", description: "Création d'ambiance avec light design, projecteurs, gobos.", icon: "sparkles", priceLabel: "Sur devis", order: 2 },
  { _id: "srv-e-3", _type: "service", title: "Coordination logistique", category: "coordination", scope: "evenement", description: "On gère le timing et les prestataires pour que vos équipes restent disponibles.", icon: "calendar", priceLabel: "Forfait 500 €", order: 3 },
  // Espace
  { _id: "srv-s-1", _type: "service", title: "Décoration florale", category: "design", scope: "espace", description: "Compositions florales pour table d'honneur, arche, arrivée.", icon: "flower", priceLabel: "À partir de 350 €", order: 1 },
  { _id: "srv-s-2", _type: "service", title: "Photographe", category: "photo", scope: "espace", description: "Photographe de notre réseau, reportage 4 h ou journée.", icon: "camera", priceLabel: "À partir de 600 €", order: 2 },
  { _id: "srv-s-3", _type: "service", title: "Service traiteur", category: "catering", scope: "espace", description: "Traiteurs partenaires (halal, casher, végétarien). Cocktails ou repas assis.", icon: "utensils", priceLabel: "Sur devis", order: 3 },
];

// ============================================================================
// LEGAL PAGES
// ============================================================================
export const mentionsLegalesDoc = {
  _id: "mentionsLegales",
  _type: "mentionsLegales",
  title: "Mentions légales",
  lastUpdated: "2026-05-10",
  body: [
    {
      _type: "block",
      _key: "b1",
      style: "h2",
      children: [{ _type: "span", _key: "s1", text: "Éditeur du site", marks: [] }],
    },
    {
      _type: "block",
      _key: "b2",
      style: "normal",
      children: [
        { _type: "span", _key: "s1", text: "Aïssa Events — 35 Bd de Beaubourg, 77184 Émerainville, France. Email : contact@aissaevents.com — Téléphone : 06 61 94 88 59. Directeur de publication : Aïssa.", marks: [] },
      ],
    },
    {
      _type: "block",
      _key: "b3",
      style: "h2",
      children: [{ _type: "span", _key: "s1", text: "Hébergement", marks: [] }],
    },
    {
      _type: "block",
      _key: "b4",
      style: "normal",
      children: [
        { _type: "span", _key: "s1", text: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.", marks: [] },
      ],
    },
    {
      _type: "block",
      _key: "b5",
      style: "h2",
      children: [{ _type: "span", _key: "s1", text: "Propriété intellectuelle", marks: [] }],
    },
    {
      _type: "block",
      _key: "b6",
      style: "normal",
      children: [
        { _type: "span", _key: "s1", text: "L'ensemble des contenus présents sur le site (textes, images, vidéos, logos) est la propriété d'Aïssa Events ou de leurs ayants droit. Toute reproduction, totale ou partielle, est interdite sans autorisation préalable.", marks: [] },
      ],
    },
  ],
};

export const politiqueConfidentialiteDoc = {
  _id: "politiqueConfidentialite",
  _type: "politiqueConfidentialite",
  title: "Politique de confidentialité",
  lastUpdated: "2026-05-10",
  body: [
    {
      _type: "block",
      _key: "b1",
      style: "h2",
      children: [{ _type: "span", _key: "s1", text: "Données collectées", marks: [] }],
    },
    {
      _type: "block",
      _key: "b2",
      style: "normal",
      children: [
        { _type: "span", _key: "s1", text: "Lorsque vous nous contactez via le formulaire, nous collectons : nom, prénom, email, téléphone, type d'événement, message. Ces données sont utilisées uniquement pour répondre à votre demande de devis.", marks: [] },
      ],
    },
    {
      _type: "block",
      _key: "b3",
      style: "h2",
      children: [{ _type: "span", _key: "s1", text: "Conservation", marks: [] }],
    },
    {
      _type: "block",
      _key: "b4",
      style: "normal",
      children: [
        { _type: "span", _key: "s1", text: "Vos données sont conservées 3 ans après le dernier échange, sauf si vous demandez leur suppression.", marks: [] },
      ],
    },
    {
      _type: "block",
      _key: "b5",
      style: "h2",
      children: [{ _type: "span", _key: "s1", text: "Vos droits", marks: [] }],
    },
    {
      _type: "block",
      _key: "b6",
      style: "normal",
      children: [
        { _type: "span", _key: "s1", text: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, écrivez-nous à contact@aissaevents.com.", marks: [] },
      ],
    },
  ],
};

// ============================================================================
// BLOG PAGE
// ============================================================================
export const blogPageDoc = {
  _id: "blogPage",
  _type: "blogPage",
  eyebrow: "Inspirations & conseils",
  title: "Le journal d'Aïssa Events",
  intro:
    "Conseils, retours d'expérience et inspirations pour vous aider à imaginer et organiser votre événement.",
  emptyStateTitle: "Bientôt en ligne",
  emptyStateMessage:
    "Les premiers articles arrivent bientôt. En attendant, n'hésitez pas à nous contacter pour parler de votre projet.",
  articleCta: {
    _type: "ctaSection",
    enabled: true,
    title: "Votre projet mérite la même _attention._",
    description:
      "Échange découverte de 30 minutes, gratuit et sans engagement. Aïssa vous reçoit personnellement pour comprendre vos enjeux.",
    ctas: [
      {
        _type: "cta",
        _key: "blog-cta-1",
        label: "Réserver un appel",
        type: "calendly",
        variant: "primary",
      },
      {
        _type: "cta",
        _key: "blog-cta-2",
        label: "Voir nos réalisations",
        type: "internal",
        internalPath: "/realisations",
        variant: "secondary",
      },
    ],
  },
};
