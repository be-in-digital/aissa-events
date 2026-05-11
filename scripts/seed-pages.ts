/**
 * Seed des pages singleton Mariage / Évènements pro / Espace Events / Réalisations.
 * Toutes les valeurs hardcodées (FALLBACK_*) extraites des composants sont retranscrites ici.
 * Les images Unsplash hardcodées ne sont PAS reprises (la cliente uploadera depuis Sanity).
 */

// ============================================================================
// MARIAGE PAGE
// ============================================================================
export const mariagePageDoc = {
  _id: "mariagePage",
  _type: "mariagePage",
  hero: {
    _type: "heroSection",
    enabled: true,
    eyebrow: "Univers 02 · Wedding planner diplômée",
    title: "Wedding\nplanning en _IDF._",
    subtitle:
      "Mariages civils, henné, fiançailles, cérémonies religieuses ou laïques. Organisation complète ou coordination à la carte. Dans notre lieu à Émerainville (77), chez vous, ou dans un lieu partenaire.",
    ctas: [
      { _type: "cta", _key: "h1", label: "Réserver un appel", type: "anchor", anchor: "contact", variant: "primary" },
      { _type: "cta", _key: "h2", label: "Voir les formules", type: "anchor", anchor: "packs", variant: "secondary" },
    ],
  },
  trustBar: {
    _type: "trustBarSection",
    enabled: true,
    items: [
      { _key: "t1", value: "Wedding planner diplômée", label: "Formation certifiante · 6 ans en activité" },
      { _key: "t2", value: "+60 mariages depuis 2020", label: "Civils, religieux, laïques, henné" },
      { _key: "t3", value: "Multi-cérémonies", label: "Henné, civil, religieux et fête sur 1 brief" },
      { _key: "t4", value: "Émerainville (77) · IDF", label: "Île-de-France toute l'année, France au-delà" },
    ],
  },
  intro: {
    _type: "aboutSection",
    enabled: true,
    eyebrow: "Notre approche",
    title: "Un mariage,\n_cent décisions._",
    body: [
      {
        _type: "block",
        _key: "i1",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Un mariage, c'est environ cent décisions à prendre sur 9 mois. Lieu, traiteur, fleurs, photographe, DJ, déco, timing, plan B météo, gestion des familles. Une vingtaine sont vraiment lourdes (budget, contrats, choix des prestataires) ; le reste, c'est de la coordination quotidienne qui finit par épuiser.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "i2",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "On en prend le maximum à votre place. Pour les autres, on vous donne ce qu'il faut pour trancher vite, sans avoir à comparer cinq devis le soir après le boulot. Civil, religieux, laïque, henné, fiançailles : on a déjà fait les quatre cérémonies dans le même week-end, plus d'une fois. Les codes, les ordres de passage, les contraintes des officiants (halal, casher, multi-confessions) : c'est devenu une routine pour nous, jamais pour vous.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: "i3",
        style: "normal",
        children: [
          {
            _type: "span",
            _key: "s1",
            text: "Aïssa, wedding planner diplômée, est votre interlocutrice du premier brief à la fin du dernier service. La même personne. Pas un commercial qui vous lâche dès la signature. ",
            marks: [],
          },
          {
            _type: "span",
            _key: "s2",
            text: "Le jour J, vous êtes invités à votre mariage. C'est nous qui travaillons.",
            marks: ["strong"],
          },
        ],
      },
    ],
  },
  packs: {
    _type: "packsSection",
    enabled: true,
    eyebrow: "Packs mariage",
    title: "Nos formules",
    filterByType: "mariage",
  },
  themes: {
    _type: "themesSection",
    enabled: true,
    eyebrow: "Décoration de table",
    title: "Quatre thèmes\n_prêts à servir._",
    intro:
      "Inclus dans la formule Organisation complète. Sinon, 55 € la table, montage et démontage compris : vous arrivez les mains vides, vous repartez les mains vides.",
    items: [
      {
        _key: "th1",
        name: "Chic",
        description:
          "Vaisselle dorée, lignes nettes, palette ivoire et bordeaux. Le format qui marche partout, du dîner de 30 personnes au mariage de 200. Notre best-seller, et aussi le moins risqué quand vous hésitez.",
      },
      {
        _key: "th2",
        name: "Bohème",
        description:
          "Fleurs séchées, bois brut, lin froissé, tons doux. Pensé pour les cérémonies en jardin ou en plein air. Attention si vous êtes plus de 80 invités : ça demande beaucoup de place et beaucoup de bougies.",
        accentColor: "sage",
        tags: ["Végétal"],
      },
      {
        _key: "th3",
        name: "Orientale",
        description:
          "Lanternes dorées, tissus drapés au plafond, bougeoirs en laiton, tapis bas. Parfait pour les henné, les pré-mariages, les fiançailles. On a fini par acheter notre propre stock parce que la location revenait trop cher.",
      },
      {
        _key: "th4",
        name: "Afro Chic",
        description:
          "Ocre, doré, terracotta, motifs wax. Une déco qui revendique les codes africains sans tomber dans le bric-à-brac touristique. On bosse avec une scénographe qui vit entre Paris et Abidjan, c'est elle qui calibre.",
      },
    ],
  },
  ceremonies: {
    _type: "ceremoniesSection",
    enabled: true,
    eyebrow: "Multi-cérémonies · notre spécialité",
    title: "Quatre cérémonies,\n_une seule équipe._",
    intro:
      "Civil, religieux, laïque, henné : chaque cérémonie a ses codes, ses prestataires et son rythme. On les prend toutes, parfois la même semaine, sans sous-traiter d'un format à l'autre.",
    items: [
      {
        _key: "c1",
        title: "Mariage civil",
        description:
          "Mairie, vin d'honneur, repas. On prend le relais à la sortie du bureau du maire (souvent en retard, jamais grave) et on tient jusqu'à la fin de la soirée. Coordination, scéno, prestataires.",
        highlights: ["Vin d'honneur", "Cocktail", "Repas servi"],
      },
      {
        _key: "c2",
        title: "Cérémonie religieuse",
        description:
          "Musulmane, chrétienne, juive, mixte. Mise en relation avec l'officiant qui correspond (on connaît ceux qui acceptent les cérémonies inter-confessions, c'est rare), déco aux codes, traiteur halal, casher ou végé. Pas de couac sur les rituels qu'on ne connaît pas.",
        highlights: ["Halal · Casher", "Officiant", "Tradition"],
      },
      {
        _key: "c3",
        title: "Cérémonie henné",
        description:
          "Soirée henné, fiançailles, pré-mariage oriental. Lanternes, drapés, bougies au sol, mise en scène des mariés sur estrade. Le plus souvent la veille du civil : il faut prévoir le sommeil de la mariée derrière, on en a vu défaillir au cocktail.",
        highlights: ["Oriental", "Drapés", "Lanternes"],
      },
      {
        _key: "c4",
        title: "Cérémonie laïque ou plein air",
        description:
          "Cérémonie laïque en jardin, baptême civil, renouvellement de vœux, fiançailles. Officiant·e laïque, déroulé écrit avec vous (vraiment avec vous, pas un template), plan B météo prêt à dégainer. En IDF, on apprend vite à toujours avoir un plan B.",
        highlights: ["Laïque", "Plein air", "Jardin"],
      },
    ],
  },
  lieux: {
    _type: "lieuxSection",
    enabled: true,
    eyebrow: "Lieu de la cérémonie",
    title: "Chez nous, ou _ailleurs._",
    intro:
      "Trois options, zéro lieu imposé. Notre salle d'Émerainville (77), un lieu partenaire de notre réseau IDF, ou directement chez vous. On s'adapte au lieu, pas l'inverse.",
    items: [
      {
        _key: "l1",
        title: "Espace Events _Émerainville_",
        description:
          "Notre salle à 25 min de Paris, jusqu'à 50 personnes. Pack tout inclus dès 1 250 €. Bonne adresse pour un mariage intime ou une cérémonie henné.",
        highlights: [
          "Salle 65 m², verrière, terrasse",
          "Mobilier, sono, lumières, vaisselle inclus",
          "Cuisine équipée pour traiteur",
        ],
        cta: {
          _type: "cta",
          label: "Découvrir l'Espace Events",
          type: "internal",
          internalPath: "/espace-emerainville",
          variant: "ghost",
        },
      },
      {
        _key: "l2",
        title: "Lieu _partenaire_",
        description:
          "Châteaux, domaines, lofts, salles privatisables. On vous propose 2 ou 3 options selon votre projet, votre budget et votre nombre d'invités.",
        highlights: [
          "Réseau IDF puis France entière",
          "Capacité 30 à 300+ personnes",
          "Repérage technique inclus",
        ],
      },
      {
        _key: "l3",
        title: "Chez _vous_",
        description:
          "Maison familiale, jardin, lieu déjà réservé. On s'adapte à votre choix et on coordonne sur place. Aucun lieu imposé.",
        highlights: [
          "Repérage technique préalable",
          "Adaptation aux contraintes du lieu",
          "Logistique pensée au cas par cas",
        ],
      },
    ],
  },
  timeline: {
    _type: "timelineSection",
    enabled: true,
    eyebrow: "Comment se déroule un mariage avec nous",
    title: "Six étapes,\ndu brief à la _fin de la fête._",
    intro:
      "Du premier mail jusqu'au moment où on rend les clés du lieu au gardien à 3h du mat'. Sans flou sur qui fait quoi, ni quand.",
    items: [
      {
        _key: "tl1",
        when: "J-9 à J-3 mois",
        title: "Préparation _et design_",
        description:
          "Brief, chasse du lieu, prestataires, scénographie. Un Google Sheet partagé (rien de plus, les outils sophistiqués finissent toujours abandonnés) qu'on met à jour ensemble. Point mensuel d'une heure ; entre deux, on s'envoie ce qu'il faut par WhatsApp.",
      },
      {
        _key: "tl2",
        when: "J-1 / Veille",
        title: "Henné _et pré-mariage_",
        description:
          "Installation de l'espace henné, accueil des proches, déco orientale, ambiance famille. On monte pendant que vous riez avec vos cousines, c'est le but.",
      },
      {
        _key: "tl3",
        when: "Jour J · Matin",
        title: "Préparatifs _et cérémonie civile_",
        description:
          "Coiffure, maquillage, premières photos. Direction la mairie (avec le créneau à respecter, parce qu'ils ne nous attendent pas) puis retour vers le lieu.",
      },
      {
        _key: "tl4",
        when: "Jour J · Après-midi",
        title: "Cérémonie _religieuse ou laïque_",
        description:
          "Accompagnement de l'officiant, placement des invités, photos de groupe (la partie qu'on déteste tous mais qu'il faut faire). Rituels respectés à la lettre. Le timing, on le tient en coulisses.",
      },
      {
        _key: "tl5",
        when: "Jour J · Soirée",
        title: "Cocktail _et vin d'honneur_",
        description:
          "Buffet, DJ ou orchestre, animations photo. Vous parlez à vos invités, on surveille l'heure et on signale au DJ quand il faut basculer en repas.",
      },
      {
        _key: "tl6",
        when: "Jour J · Nuit",
        title: "Repas _et fête_",
        description:
          "Service à table, discours (et témoin imprévu qui demande le micro à 23h45, ça arrive), ouverture de bal, piste pleine. Aïssa et l'équipe restent jusqu'au démontage. Vous, vous rentrez vous coucher.",
      },
    ],
  },
  alacarte: {
    _type: "aLaCarteSection",
    enabled: true,
    eyebrow: "Composez votre mariage",
    title: "Options _à la carte._",
    intro:
      "Chaque mode peut être enrichi de prestations complémentaires, selon vos envies et votre budget.",
    filterByScope: "mariage",
    footerNote:
      "Tous les tarifs sont nets, montage et démontage compris sauf mention contraire. Devis détaillé sous 48 h après l'appel découverte.",
  },
  gallery: {
    _type: "gallerySection",
    enabled: true,
    eyebrow: "Galerie",
    title: "Quelques images",
  },
  portfolio: {
    _type: "caseStudiesSection",
    enabled: true,
    eyebrow: "Études de cas",
    title: "Deux mariages,\n_deux briefs._",
    intro:
      "Deux exemples concrets de projets que nous avons accompagnés. Le brief reçu, ce qui a été décidé, comment ça s'est passé.",
    selectedRealisations: [
      { _type: "reference", _key: "r1", _ref: "realisation-sarah-david" },
    ],
  },
  testimonials: {
    _type: "testimonialsSection",
    enabled: true,
    eyebrow: "Témoignages",
    title: "Ce qu'ils en _disent._",
    filterByType: "mariage",
  },
  conditions: {
    _type: "conditionsSection",
    enabled: true,
    eyebrow: "Comment réserver",
    title: "Quatre étapes,\nc'est _tout._",
    intro:
      "On ne réserve la date qu'à réception de l'acompte. Avant, vous restez libre de comparer, de réfléchir, de revenir vers nous avec d'autres questions.",
    items: [
      {
        _key: "co1",
        title: "Devis personnalisé sous 48 h",
        description:
          "Appel découverte gratuit (30 min), on cadre le projet, on envoie un devis chiffré dans les deux jours ouvrés. Si on a besoin d'infos en plus pour chiffrer, on vous le dit tout de suite.",
      },
      {
        _key: "co2",
        title: "Validation & contrat signé en ligne",
        description:
          "Devis OK, contrat envoyé par mail. Signature électronique en quelques minutes, vous gardez une copie. Pas besoin d'imprimer ni de scanner.",
      },
      {
        _key: "co3",
        title: "Acompte 50 % à la réservation",
        description:
          "L'acompte verrouille votre date. Tant qu'il n'est pas reçu, on ne refuse pas les autres demandes pour ce jour-là (même si on vous prévient par mail si quelqu'un d'autre a brieffé).",
      },
      {
        _key: "co4",
        title: "Solde à régler 15 jours avant",
        description:
          "Le solde tombe deux semaines avant l'événement, par virement ou CB. Si c'est trop court vu votre cycle de paie, on en parle dès la signature et on adapte.",
      },
    ],
  },
  faq: {
    _type: "faqSection",
    enabled: true,
    eyebrow: "FAQ",
    title: "Questions fréquentes",
    scope: "mariage",
  },
  finalCta: {
    _type: "ctaSection",
    enabled: true,
    title: "Parlez-nous\nde votre\n_mariage._",
    description:
      "Appel de 30 minutes, gratuit et sans engagement. Aïssa répond elle-même : par téléphone, en visio, ou à l'Espace Events si vous voulez voir le lieu. Devis sous 48 h.",
    ctas: [
      { _type: "cta", _key: "f1", label: "Réserver un appel", type: "calendly", variant: "primary" },
      { _type: "cta", _key: "f2", label: "Écrire un message", type: "anchor", anchor: "contact", variant: "secondary" },
    ],
  },
  stickyCta: {
    _type: "stickyCtaSection",
    enabled: true,
    label: "Devis sous 48 h",
    subLabel: "Échange gratuit",
    cta: { _type: "cta", label: "Réserver un appel", type: "calendly", variant: "primary" },
  },
};

// ============================================================================
// EVENEMENT PAGE
// ============================================================================
export const evenementPageDoc = {
  _id: "evenementPage",
  _type: "evenementPage",
  hero: {
    _type: "heroSection",
    enabled: true,
    eyebrow: "Univers 03 · Événements Pro",
    title: "Quand l'image\ndevient _expérience._",
    subtitle:
      "Soirées clients, afterworks, lancements produits, séminaires. Dans notre Espace Events à Émerainville (77) ou chez vous, partout en Île-de-France.",
    ctas: [
      { _type: "cta", _key: "h1", label: "Réserver un appel", type: "anchor", anchor: "contact", variant: "primary" },
      { _type: "cta", _key: "h2", label: "Voir les packs", type: "anchor", anchor: "packs", variant: "secondary" },
    ],
  },
  trustBar: {
    _type: "trustBarSection",
    enabled: true,
    items: [
      { _key: "t1", value: "Formation Art Academy", label: "Direction artistique pro" },
      { _key: "t2", value: "30+ événements pro", label: "Afterworks · lancements · séminaires" },
      { _key: "t3", value: "Équipe interne + partenaires", label: "DJ · scéno · production · staff" },
      { _key: "t4", value: "Île-de-France", label: "Émerainville (77) · Paris · 25 min RER E" },
    ],
  },
  intro: {
    _type: "aboutSection",
    enabled: true,
    eyebrow: "Notre approche pro",
    title: "Un événement\npro qui _marque._",
    body: [
      {
        _type: "block",
        _key: "i1",
        style: "normal",
        children: [
          { _type: "span", _key: "s1", text: "Nous produisons ", marks: [] },
          { _type: "span", _key: "s2", text: "des événements professionnels", marks: ["strong"] },
          { _type: "span", _key: "s3", text: " en Île-de-France : 30+ projets livrés, du cocktail 40 personnes à la convention 2 jours.", marks: [] },
        ],
      },
      {
        _type: "block",
        _key: "i2",
        style: "normal",
        children: [
          { _type: "span", _key: "s1", text: "Aïssa Events est née au sein d'", marks: [] },
          { _type: "span", _key: "s2", text: "Art Academy", marks: ["strong"] },
          { _type: "span", _key: "s3", text: ". Notre métier s'est construit au contact direct des artistes et de la production live. Cette double culture, artistique et opérationnelle, change la façon dont nous lisons un brief B2B : la marque, le public, ce qu'on veut qu'il en reste.", marks: [] },
        ],
      },
      {
        _type: "block",
        _key: "i3",
        style: "normal",
        children: [
          { _type: "span", _key: "s1", text: "Sur chaque projet, vous avez ", marks: [] },
          { _type: "span", _key: "s2", text: "un seul interlocuteur", marks: ["strong"] },
          { _type: "span", _key: "s3", text: " du brief au debrief. Aïssa pilote, nos alternants exécutent, nos partenaires (sécurité, traiteur, photo, vidéo) sont activés selon le format. Photos et captation vidéo réutilisables en com post-event, prévues dès le rétroplanning.", marks: [] },
        ],
      },
    ],
  },
  usecases: {
    _type: "processSection",
    enabled: true,
    eyebrow: "Nos terrains de jeu",
    title: "Tous vos formats _pro._",
    steps: [
      {
        _key: "uc-1",
        italic: "Soirées",
        rest: "clients",
        description:
          "Format dîner ou cocktail dînatoire pour 30 à 120 invités. Programmation musicale calée sur votre marque, accueil VIP, hôtesses bilingues sur demande. Brief type : fidéliser un top 50 de prescripteurs.",
      },
      {
        _key: "uc-2",
        italic: "Afterworks",
        rest: "& cocktails",
        description:
          "Cocktails 17h-21h pour 30 à 80 personnes. Format ponctuel ou rendez-vous mensuel récurrent, à l'Espace Events Émerainville ou dans vos locaux. DJ set, mange-debout, bar partenaire.",
      },
      {
        _key: "uc-3",
        italic: "Lancements",
        rest: "produits",
        description:
          "Reveal produit, espaces brand, parcours invité, captation photo et vidéo pour réutilisation com. Brief type : 120 prescripteurs presse et influence sur 3 semaines de prep, livrables médias sous 7 jours.",
      },
      {
        _key: "uc-4",
        italic: "Séminaires",
        rest: "& internes",
        description:
          "Conventions, kick-offs, soirées fin d'année. Plénière, ateliers et soirée orchestrés sur 1 ou 2 jours, 50 à 200 collaborateurs. Coordination logistique, transport, hébergement si multi-jours.",
      },
    ],
  },
  packs: {
    _type: "packsSection",
    enabled: true,
    eyebrow: "Packs événement",
    title: "Nos formules",
    filterByType: "evenement",
  },
  process: {
    _type: "processSection",
    enabled: true,
    eyebrow: "Démarrer votre projet",
    title: "Trois étapes,\nune _vision claire._",
    steps: [
      {
        _key: "p1",
        italic: "Premier",
        rest: "échange",
        description:
          "On clarifie ensemble votre vision, votre public cible, votre image de marque et l'atmosphère recherchée. 30 minutes en visio ou présentiel, gratuit et sans engagement.",
      },
      {
        _key: "p2",
        italic: "Proposition",
        rest: "personnalisée",
        description:
          "Vous recevez sous 48 h un devis sur mesure, précis et adapté à votre budget et au périmètre choisi. Note de direction artistique + planning + budget cadre.",
      },
      {
        _key: "p3",
        italic: "Mise",
        rest: "en œuvre",
        description:
          "Nous trouvons le lieu, sélectionnons et briefons les prestataires, pilotons la prod jusqu'au jour J. Recap visuel (photos + teaser) livré sous 72 h post-event pour vos canaux LinkedIn et intranet.",
      },
    ],
    cta: { _type: "cta", label: "Réserver un appel", type: "anchor", anchor: "contact", variant: "primary" },
  },
  lieux: {
    _type: "lieuxSection",
    enabled: true,
    eyebrow: "Le lieu",
    title: "Chez nous, ou _chez vous._",
    intro:
      "Deux options. Soit vous venez chez nous à Émerainville (25 min de Paris, RER E), soit nous nous déplaçons : vos locaux, un partenaire que nous identifions, ou le lieu de votre choix.",
    items: [
      {
        _key: "l1",
        title: "Espace Events, _Émerainville_",
        description:
          "Notre lieu modulable de 65 m², adapté aux afterworks, cocktails, réunions clients ou showcases jusqu'à 50 personnes.",
        highlights: [
          "Salle principale spacieuse & lumineuse",
          "Verrière 25 m² (espace cosy ou buffet)",
          "Terrasse extérieure aménagée",
          "Cuisine équipée pour traiteur",
          "25 min de Paris · RER E · A4",
        ],
        cta: {
          _type: "cta",
          label: "Voir tous les tarifs lieu",
          type: "internal",
          internalPath: "/espace-emerainville",
          variant: "ghost",
        },
      },
      {
        _key: "l2",
        title: "Vos locaux ou _lieu partenaire_",
        description:
          "L'événement peut également se dérouler dans vos locaux, dans un lieu partenaire que nous identifions, ou tout endroit que vous avez choisi.",
        highlights: [
          "Recherche & sélection du lieu",
          "Repérage technique préalable",
          "Coordination logistique complète",
          "Adaptation à votre contexte (sécurité, réseau, ERP)",
          "Gestion sur place le jour J",
        ],
        cta: {
          _type: "cta",
          label: "Décrire mon projet",
          type: "anchor",
          anchor: "contact",
          variant: "ghost",
        },
      },
    ],
  },
  scope: {
    _type: "conditionsSection",
    enabled: true,
    eyebrow: "Sur-mesure · hors pack",
    title: "Tout ou partie\nde votre _événement._",
    intro:
      "Vous avez un brief atypique, un format hors pack ou un besoin précis ? Aïssa Events peut intervenir sur l'intégralité de l'organisation ou sur des prestations ciblées.",
    items: [
      {
        _key: "s-1",
        title: "Recherche & sélection du lieu",
        description:
          "Identification du lieu idéal selon votre brief, votre nombre d'invités, votre image de marque et vos contraintes (accessibilité, sécurité ERP, parking).",
      },
      {
        _key: "s-2",
        title: "Coordination globale",
        description:
          "Pilotage de A à Z, gestion du planning, supervision du jour J. Un interlocuteur unique de bout en bout.",
      },
      {
        _key: "s-3",
        title: "Gestion des prestataires",
        description:
          "Sélection, négociation, suivi de tous les intervenants externes (traiteur, fleuriste, captation, sécurité, vestiaires, hôtesses).",
      },
      {
        _key: "s-4",
        title: "Traiteur & service",
        description:
          "Buffet, cocktail, repas assis. Halal / casher / végé / sans gluten possibles. Tarifs négociés via partenariats récurrents.",
      },
      {
        _key: "s-5",
        title: "Staff événementiel",
        description:
          "Hôtesses d'accueil bilingues, serveurs, vestiaire, agents de sécurité. Tenue alignée à votre charte si demandé.",
      },
      {
        _key: "s-6",
        title: "Captation & com post-event",
        description:
          "Photographe corporate + vidéaste teaser/recap pour réutilisation sur LinkedIn, intranet, communication client. Livraison sous 72 h.",
      },
    ],
  },
  alacarte: {
    _type: "aLaCarteSection",
    enabled: true,
    eyebrow: "Personnalisez votre événement",
    title: "Options _à la carte._",
    intro:
      "Vous pouvez ajouter à chaque pack des options ciblées : musique, service, sécurité, brand & contenu. Tarifs nets, facturés au prestataire.",
    filterByScope: "evenement",
    footerNote:
      "Tous les tarifs sont nets, facturés au prestataire. TVA, SIRET et facturation entreprise possibles (paiement à 30 j sur dossier).",
  },
  gallery: {
    _type: "gallerySection",
    enabled: true,
    eyebrow: "Galerie",
    title: "Quelques images",
  },
  portfolio: {
    _type: "caseStudiesSection",
    enabled: true,
    eyebrow: "Études de cas",
    title: "Deux briefs,\n_livrés._",
    intro:
      "Deux exemples concrets d'événements pro que nous avons orchestrés. Le brief reçu, ce qui a été décidé, ce qui en est ressorti.",
    selectedRealisations: [
      { _type: "reference", _key: "r1", _ref: "realisation-cote-sud" },
    ],
  },
  timeline: {
    _type: "timelineSection",
    enabled: true,
    eyebrow: "Le déroulé d'un projet pro",
    title: "Du brief créatif\nà la _com post-event._",
    intro:
      "Cinq étapes balisées sur 3 mois standards. Pour les projets en urgence (4-6 semaines), le calendrier se compresse mais la méthode reste la même.",
    items: [
      {
        _key: "tl1",
        when: "J-3 mois",
        title: "Brief _& brief créatif_",
        description:
          "Atelier de cadrage : objectif, public, image, atmosphère, KPI. Sortie : note de direction artistique + budget cadre + calendrier de prod.",
      },
      {
        _key: "tl2",
        when: "J-1 mois",
        title: "Repérage _& production_",
        description:
          "Sélection des prestataires, repérage technique sur le lieu, brief des équipes, validation des contenus brand. Tout est calé.",
      },
      {
        _key: "tl3",
        when: "J-7",
        title: "Stress test _& dry run_",
        description:
          "Run-through des moments clés (reveal, plénière, soirée), test technique son/lumière, brief sécurité. Aucune surprise jour J.",
      },
      {
        _key: "tl4",
        when: "Jour J",
        title: "Exécution _live_",
        description:
          "Aïssa et l'équipe sur place du montage au démontage. Coordination prestataires, gestion VIP, pilotage timing, plan B en cas d'aléa.",
      },
      {
        _key: "tl5",
        when: "J+3",
        title: "Debrief _& livrables_",
        description:
          "Recap visuel (photos / vidéo teaser / vidéo recap) livré sous 72 h. Debrief client + analyse retour invités si capturé.",
      },
    ],
  },
  testimonials: {
    _type: "testimonialsSection",
    enabled: true,
    eyebrow: "Témoignages",
    title: "Ce qu'ils en _disent._",
    filterByType: "evenement",
  },
  faq: {
    _type: "faqSection",
    enabled: true,
    eyebrow: "FAQ",
    title: "Questions fréquentes",
    scope: "evenement",
  },
  finalCta: {
    _type: "ctaSection",
    enabled: true,
    title: "Transformons\nvotre prochain\névénement _pro._",
    description:
      "Échange découverte de 30 minutes. Aïssa vous reçoit personnellement pour comprendre vos enjeux et imaginer l'événement qui marquera vos invités. Devis sous 48 h.",
    ctas: [
      { _type: "cta", _key: "f1", label: "Réserver un appel", type: "calendly", variant: "primary" },
      { _type: "cta", _key: "f2", label: "Décrire mon projet", type: "anchor", anchor: "contact", variant: "secondary" },
    ],
  },
  stickyCta: {
    _type: "stickyCtaSection",
    enabled: true,
    label: "Devis sous 48 h",
    subLabel: "Facturation entreprise",
    cta: { _type: "cta", label: "Réserver un appel", type: "calendly", variant: "primary" },
  },
};

// ============================================================================
// ESPACE EVENTS PAGE
// ============================================================================
export const espaceEventsPageDoc = {
  _id: "espaceEventsPage",
  _type: "espaceEventsPage",
  hero: {
    _type: "heroSection",
    enabled: true,
    eyebrow: "Le lieu · Émerainville (77)",
    title: "Notre salle\n_à Émerainville_\n(77).",
    subtitle:
      "65 m² jusqu'à 50 personnes assises (60 debout). Verrière 25 m², terrasse, cuisine équipée, parking gratuit. Pour mariages civils, henné, baptêmes, anniversaires, baby showers, cocktails pro — en pack tout compris ou en location seule à partir de 350 €.",
    ctas: [
      { _type: "cta", _key: "h1", label: "Réserver une visite", type: "calendly", variant: "primary" },
      { _type: "cta", _key: "h2", label: "Voir les packs", type: "anchor", anchor: "packs", variant: "secondary" },
    ],
  },
  trustBar: {
    _type: "trustBarSection",
    enabled: true,
    items: [
      { _key: "t1", value: "25 min de Paris", label: "RER E · A4 · Émerainville (77)" },
      { _key: "t2", value: "Accessible PMR", label: "Plain-pied · sanitaires PMR" },
      { _key: "t3", value: "Climatisé", label: "Chaud / froid · été comme hiver" },
      { _key: "t4", value: "Parking gratuit", label: "Rue + parkings publics < 200 m" },
    ],
  },
  venue: {
    _type: "venueSection",
    enabled: true,
    eyebrow: "Caractéristiques",
    title: "Capacités & équipements",
    intro:
      "Notre salle de 65 m² s'aménage selon votre format : cocktail debout, dîner assis ou cérémonie en rangs. Tout l'équipement de base est inclus.",
    capacities: [
      { _key: "cp1", configuration: "Cocktail debout", guestCount: "Jusqu'à 60 personnes" },
      { _key: "cp2", configuration: "Dîner assis", guestCount: "Jusqu'à 50 personnes" },
      { _key: "cp3", configuration: "Cérémonie en rangs", guestCount: "Jusqu'à 50 personnes" },
    ],
    address: "35 Bd de Beaubourg, 77184 Émerainville",
    highlights: [
      "65 m² au sol + verrière 25 m²",
      "Terrasse extérieure aménagée",
      "Cuisine équipée pour traiteur",
      "Sono JBL + micros + éclairage LED",
      "Mobilier inclus (chaises Napoléon, tables, mange-debout)",
      "Climatisation chaud / froid",
      "Accessible PMR de plain-pied",
      "Parking gratuit < 200 m",
    ],
  },
  intro: {
    _type: "aboutSection",
    enabled: true,
    eyebrow: "Le lieu",
    title: "Notre maison\nà _Émerainville._",
    body: [
      {
        _type: "block",
        _key: "i1",
        style: "normal",
        children: [
          { _type: "span", _key: "s1", text: "Espace Events, c'est notre salle à Émerainville (77). ", marks: [] },
          { _type: "span", _key: "s2", text: "65 m² au sol, plus une verrière de 25 m²", marks: ["strong"] },
          { _type: "span", _key: "s3", text: ", une terrasse, une cuisine équipée et des vestiaires. Capacité : 50 personnes assises, 60 debout. À 25 min de Paris en RER E (sortie Émerainville-Pontault), accès direct A4.", marks: [] },
        ],
      },
      {
        _type: "block",
        _key: "i2",
        style: "normal",
        children: [
          { _type: "span", _key: "s1", text: "On l'a aménagé pour accueillir ", marks: [] },
          { _type: "span", _key: "s2", text: "mariage civil, henné, baptême", marks: ["strong"] },
          { _type: "span", _key: "s3", text: ", baby shower, anniversaire, EVJF, afterwork ou cocktail pro. Petit lieu mais bien équipé : sono JBL, mobilier (chaises Napoléon, tables, mange-debout), éclairage, climatisation chaud / froid.", marks: [] },
        ],
      },
      {
        _type: "block",
        _key: "i3",
        style: "normal",
        children: [
          { _type: "span", _key: "s1", text: "Trois manières de réserver : un ", marks: [] },
          { _type: "span", _key: "s2", text: "Pack Célébration", marks: ["strong"] },
          { _type: "span", _key: "s3", text: " pour les cérémonies assises, un ", marks: [] },
          { _type: "span", _key: "s4", text: "Pack Fiesta", marks: ["strong"] },
          { _type: "span", _key: "s5", text: " pour les soirées debout, ou la ", marks: [] },
          { _type: "span", _key: "s6", text: "location seule", marks: ["strong"] },
          { _type: "span", _key: "s7", text: " dès 350 € si vous arrivez avec vos prestataires.", marks: [] },
        ],
      },
    ],
  },
  packs: {
    _type: "packsSection",
    enabled: true,
    eyebrow: "Packs Espace Events",
    title: "Nos formules",
    filterByType: "celebration",
  },
  packsFiesta: {
    _type: "packsSection",
    enabled: true,
    eyebrow: "Pack Fiesta · soirées festives",
    title: "Pour les soirées\n_qui dansent._",
    intro:
      "Configuration debout, énergie festive. Anniversaires, baby showers, EVJF, fêtes privées. Sonorisation, mobilier et lumières d'ambiance inclus dans les trois formules — choisissez votre niveau de scénographie.",
    filterByType: "fiesta",
  },
  notYetDecided: {
    _type: "ctaSection",
    enabled: true,
    title: "Pas encore _décidé ?_",
    description:
      "Un dernier doute avant de composer ? Vérifiez si votre date est libre, ou venez voir le lieu de vos propres yeux. Aïssa vous accueille personnellement, sans engagement.",
    ctas: [
      {
        _type: "cta",
        _key: "nyd-cta-1",
        label: "Vérifier la disponibilité",
        type: "internal",
        internalPath: "/#contact",
        variant: "secondary",
      },
      {
        _type: "cta",
        _key: "nyd-cta-2",
        label: "Réserver une visite",
        type: "calendly",
        variant: "primary",
      },
    ],
  },
  occasions: {
    _type: "ceremoniesSection",
    enabled: true,
    eyebrow: "Pour quel événement ?",
    title: "Quatre formats,\nune _salle._",
    intro:
      "Cérémonies assises, soirées debout, fêtes de famille ou cocktails pro. On adapte la disposition (mobilier, sono, déco) selon votre format.",
    items: [
      {
        _key: "o1",
        title: "_Cérémonies_ assises",
        description:
          "Mariage civil, henné, baptêmes, cérémonies religieuses ou laïques. 50 personnes assises max, repas servi, mobilier inclus — voir le Pack Célébration.",
      },
      {
        _key: "o2",
        title: "_Anniversaires_ & baby showers",
        description:
          "Anniversaires adultes ou enfants, baby showers, gender reveal, EVJF, fêtes privées. 60 personnes debout, sono JBL, arche ballons en option — voir le Pack Fiesta.",
      },
      {
        _key: "o3",
        title: "_Familiaux_ & associatifs",
        description:
          "Fêtes de famille, événements associatifs, repas de baptême. Cuisine équipée pour traiteur, parking gratuit, accessible PMR de plain-pied.",
      },
      {
        _key: "o4",
        title: "_Afterworks_ & cocktails pro",
        description:
          "Soirées clients, lancements, séminaires, afterworks. À 25 min de Paris en RER E — voir l'accompagnement B2B sur la page Événements pro.",
      },
    ],
  },
  alacarte: {
    _type: "aLaCarteSection",
    enabled: true,
    eyebrow: "Composez votre événement",
    title: "Options _à la carte._",
    intro:
      "Tout ce qu'on peut ajouter à un pack ou à une location seule. Tarifs fermes, à composer selon votre format.",
    filterByScope: "espace",
    footerNote:
      "Tous les tarifs sont nets, montage et démontage compris sauf mention contraire. Devis détaillé sous 48 h après l'appel découverte.",
  },
  locationOnly: {
    _type: "locationPricingSection",
    enabled: true,
    eyebrow: "Location seule",
    title: "Juste _la salle._",
    intro:
      "Vous arrivez avec vos prestataires (traiteur, DJ, déco) ? Location seule à partir de 350 €. Cuisine équipée, sono et mobilier disponibles en option.",
    rows: [
      { _key: "lo-1", day: "Lundi — Jeudi", hours: "18h – 22h", price: "350 €" },
      { _key: "lo-2", day: "Vendredi", hours: "17h – 5h", price: "620 €" },
      { _key: "lo-3", day: "Samedi", hours: "12h – 3h ou 15h – 5h (12h)", price: "790 €" },
      { _key: "lo-4", day: "Dimanche", hours: "10h – 20h ou 12h – 22h", price: "590 €" },
      { _key: "lo-5", day: "Jour férié", hours: "15h – 5h", hoursNote: "1 000 € le 31/12", price: "900 €" },
    ],
  },
  gallery: {
    _type: "gallerySection",
    enabled: true,
    eyebrow: "Galerie de la salle",
    title: "Quelques images",
  },
  testimonials: {
    _type: "testimonialsSection",
    enabled: true,
    eyebrow: "Témoignages",
    title: "Ce qu'ils en _disent._",
    filterByType: "espace",
  },
  conditions: {
    _type: "conditionsSection",
    enabled: true,
    eyebrow: "Comment réserver",
    title: "Quatre étapes,\n_c'est tout._",
    intro:
      "Devis 48h, contrat en ligne, acompte 50 %, solde 15 jours avant. La date n'est bloquée qu'à réception de l'acompte.",
    items: [
      {
        _key: "co1",
        title: "Devis personnalisé sous 48h",
        description:
          "Appel découverte gratuit (15-30 min) pour cadrer votre format, votre date, votre budget. Devis envoyé par mail dans les 48h.",
      },
      {
        _key: "co2",
        title: "Contrat signé en ligne",
        description:
          "Devis validé ? Contrat envoyé par mail, signature électronique, archivage automatique.",
      },
      {
        _key: "co3",
        title: "Acompte 50 % à la réservation",
        description:
          "Virement ou CB. La date est bloquée dans l'agenda dès réception. Acompte non remboursable mais reportable une fois sur 12 mois.",
      },
      {
        _key: "co4",
        title: "Solde à régler 15 jours avant",
        description:
          "Le solde est dû 15 jours avant l'événement. Pas de paiement le Jour J, pas de mauvaise surprise sur la facture.",
      },
    ],
  },
  faq: {
    _type: "faqSection",
    enabled: true,
    eyebrow: "FAQ",
    title: "Questions fréquentes",
    scope: "espace",
  },
  finalCta: {
    _type: "ctaSection",
    enabled: true,
    title: "Venez voir\nle lieu\n_avant de signer._",
    description:
      "Visite gratuite sur rendez-vous (30-45 min), devis sous 48h. Aïssa vous fait passer dans toutes les configurations et répond aux questions concrètes (mobilier, options déco, prestataires).",
    ctas: [
      { _type: "cta", _key: "f1", label: "Réserver une visite", type: "calendly", variant: "primary" },
      { _type: "cta", _key: "f2", label: "Demander un devis", type: "anchor", anchor: "contact", variant: "secondary" },
    ],
  },
  otherServices: {
    _type: "crossServicesSection",
    enabled: true,
    eyebrow: "Le lieu accueille aussi",
    title: "Un lieu, et bien\n_d'autres services._",
    intro:
      "Espace Events est un lieu — pas un service. Mariages et événements professionnels peuvent s'y dérouler avec un accompagnement dédié, ou bien se dérouler ailleurs avec notre équipe à vos côtés.",
    items: [
      {
        _key: "os-1",
        eyebrow: "Service · Wedding planning",
        titleStart: "Un mariage",
        titleItalic: "organisé.",
        description:
          "Aïssa, wedding planner diplômée (Trouve ton expert, 2024), coordonne votre mariage de A à Z ou intervient à la carte. Cérémonie à Espace Events (50 pers.) ou dans un lieu partenaire en Île-de-France pour les grands formats.",
        tags: ["Organisation complète", "À la carte", "4 thèmes décor"],
        ctaLabel: "Découvrir le wedding planning",
        ctaHref: "/mariage",
      },
      {
        _key: "os-2",
        eyebrow: "Service · Événements pro",
        titleStart: "Un événement",
        titleItalic: "B2B.",
        description:
          "Soirées clients, afterworks, lancements, séminaires. Pack Ambiance clé en main ou organisation sur mesure — à Espace Events, dans vos locaux ou en lieu partenaire.",
        tags: ["Pack Ambiance", "Sur mesure", "Hors lieu"],
        ctaLabel: "Découvrir l'offre B2B",
        ctaHref: "/evenements-pro",
      },
    ],
  },
  stickyCta: {
    _type: "stickyCtaSection",
    enabled: true,
    label: "Visite gratuite",
    subLabel: "Sur rendez-vous",
    cta: { _type: "cta", label: "Réserver une visite", type: "calendly", variant: "primary" },
  },
};

// ============================================================================
// REALISATIONS PAGE
// ============================================================================
export const realisationsPageDoc = {
  _id: "realisationsPage",
  _type: "realisationsPage",
  hero: {
    _type: "heroSection",
    enabled: true,
    eyebrow: "Portfolio · 2020-2026",
    title: "Six ans\nde _projets_\nà Émerainville.",
    subtitle:
      "Mariages multi-cérémonies, lancements de marque, soirées clients, séminaires, anniversaires en petit comité. Une sélection filtrable par univers, plus trois études de cas détaillées plus bas.",
  },
  trustBar: {
    _type: "trustBarSection",
    enabled: true,
    items: [
      { _key: "t1", value: "60+", label: "Mariages orchestrés" },
      { _key: "t2", value: "30+", label: "Événements pros" },
      { _key: "t3", value: "6 ans", label: "Depuis 2020" },
      { _key: "t4", value: "77 · IDF", label: "Émerainville & au-delà" },
    ],
  },
  introText: [
    {
      _type: "block",
      _key: "intro1",
      style: "normal",
      children: [
        {
          _type: "span",
          _key: "s1",
          text: "Cliquez sur une réalisation pour découvrir le contexte et la scénographie. Filtrez par univers pour zoomer sur ce qui vous ressemble.",
          marks: [],
        },
      ],
    },
  ],
  galleryEyebrow: "Galerie filtrable",
  galleryTitle: "Tout, en un\n_coup d'œil._",
  filters: [
    { _key: "f1", label: "Tous", value: "all" },
    { _key: "f2", label: "Mariages", value: "mariage" },
    { _key: "f3", label: "Événements pros", value: "corporate" },
    { _key: "f4", label: "Espace Events", value: "anniversaire" },
    { _key: "f5", label: "Cérémonies", value: "ceremonie" },
    { _key: "f6", label: "Henné", value: "henne" },
  ],
  caseStudies: {
    _type: "caseStudiesSection",
    enabled: true,
    eyebrow: "Études de cas · long format",
    title: "Deux projets,\n_deux briefs._",
    intro:
      "Deux exemples concrets de projets que nous avons accompagnés. Un mariage multi-cérémonies, un lancement de marque. Le brief reçu, ce qui a été décidé, comment ça s'est passé.",
    selectedRealisations: [
      { _type: "reference", _key: "r1", _ref: "realisation-sarah-david" },
      { _type: "reference", _key: "r2", _ref: "realisation-cote-sud" },
    ],
    footerEyebrow: "+ 60 mariages & 30 événements pro orchestrés depuis 2020",
    footerCta: {
      _type: "cta",
      label: "Réserver un appel",
      type: "anchor",
      anchor: "contact",
      variant: "secondary",
    },
  },
  finalCta: {
    _type: "ctaSection",
    enabled: true,
    title: "Faisons de votre\névénement le _prochain cas._",
    description:
      "Appel de 30 minutes, gratuit et sans engagement. Aïssa répond elle-même et cadre le brief avec vous. Devis sous 48 h.",
    ctas: [
      { _type: "cta", _key: "f1", label: "Réserver un appel", type: "calendly", variant: "primary" },
      { _type: "cta", _key: "f2", label: "Décrire mon projet", type: "anchor", anchor: "contact", variant: "secondary" },
    ],
  },
  stickyCta: {
    _type: "stickyCtaSection",
    enabled: true,
    label: "120+ événements orchestrés",
    subLabel: "Devis sous 48 h",
    cta: { _type: "cta", label: "Réserver un appel", type: "calendly", variant: "primary" },
  },
};
