import { defineQuery } from "next-sanity";

// ============================================================================
// FRAGMENTS COMMUNS
// ============================================================================
const ctaFragment = /* groq */ `
  label,
  type,
  internalPath,
  externalUrl,
  anchor,
  variant
`;

const imageFragment = /* groq */ `
  ...,
  "alt": coalesce(alt, "")
`;

// ============================================================================
// SECTIONS GÉNÉRIQUES
// ============================================================================
const heroFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  subtitle,
  image{ ${imageFragment} },
  ctas[]{ ${ctaFragment} }
`;

const heroHomeFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  subtitle,
  image{ ${imageFragment} },
  ctas[]{ ${ctaFragment} },
  stats[]{ value, label },
  quoteBadge{ label, quote }
`;

const aboutFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  body,
  image{ ${imageFragment} },
  ctas[]{ ${ctaFragment} }
`;

const ctaSectionFragment = /* groq */ `
  enabled,
  title,
  description,
  image{ ${imageFragment} },
  ctas[]{ ${ctaFragment} }
`;

const packReference = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  type,
  level,
  tagline,
  description,
  priceFrom,
  priceLabel,
  image{ ${imageFragment} },
  includedItems,
  excludedItems,
  cta{ ${ctaFragment} },
  featured
`;

const packsSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  filterByType,
  "packs": coalesce(
    selectedPacks[]->{ ${packReference} },
    *[_type == "pack" && (^.filterByType == "all" || type == ^.filterByType)] | order(order asc, _createdAt asc){ ${packReference} }
  )
`;

const testimonialReference = /* groq */ `
  _id,
  quote,
  authorName,
  authorRole,
  authorImage{ ${imageFragment} },
  rating,
  eventType,
  source
`;

const testimonialsSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  filterByType,
  "testimonials": coalesce(
    selectedTestimonials[]->{ ${testimonialReference} },
    *[_type == "testimonial" && (^.filterByType == "all" || eventType == ^.filterByType)] | order(featured desc, order asc, _createdAt desc)[0...12]{ ${testimonialReference} }
  )
`;

const gallerySectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  images[]{ ${imageFragment} }
`;

const faqSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  scope,
  "items": coalesce(
    selectedItems[]->{ _id, question, answer },
    *[_type == "faqItem" && (^.scope == "all" || ^.scope in scope)] | order(order asc){ _id, question, answer }
  )
`;

const venueSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  capacities[]{ configuration, guestCount },
  address,
  mapEmbedUrl,
  highlights,
  image{ ${imageFragment} }
`;

// ============================================================================
// NOUVELLES SECTIONS PAGE-SPÉCIFIQUES
// ============================================================================
const marqueeSectionFragment = /* groq */ `
  enabled,
  items
`;

const pillarsSectionFragment = /* groq */ `
  enabled,
  quote,
  quoteAuthor,
  items[]{
    title,
    italic,
    description
  }
`;

const processSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  steps[]{
    italic,
    rest,
    description
  },
  cta{ ${ctaFragment} }
`;

const universesSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  items[]{
    title,
    italic,
    shortDesc,
    longDesc,
    tags,
    price{ label, value, note },
    image{ ${imageFragment} },
    primaryCta{ ${ctaFragment} },
    secondaryCta{ ${ctaFragment} }
  }
`;

const realisationCaseFragment = /* groq */ `
  _id,
  title,
  shortTitle,
  italicSubtitle,
  "slug": slug.current,
  type,
  typeLabel,
  eventDate,
  location,
  guestCount,
  theme,
  badge,
  story,
  quote,
  metaItems[]{ label, value },
  alignment,
  cover{ ${imageFragment} },
  moodBoard[]{ ${imageFragment} },
  tags
`;

const caseStudiesSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  "items": selectedRealisations[]->{ ${realisationCaseFragment} },
  footerEyebrow,
  footerCta{ ${ctaFragment} }
`;

const trustBarSectionFragment = /* groq */ `
  enabled,
  items[]{ value, label }
`;

const ceremoniesSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  items[]{
    title,
    description,
    image{ ${imageFragment} },
    highlights
  }
`;

const themesSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  items[]{
    name,
    description,
    image{ ${imageFragment} },
    accentColor,
    tags
  }
`;

const lieuxSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  items[]{
    title,
    description,
    image{ ${imageFragment} },
    highlights,
    cta{ ${ctaFragment} }
  }
`;

const timelineSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  items[]{
    when,
    title,
    description
  }
`;

const serviceReference = /* groq */ `
  _id,
  title,
  category,
  scope,
  description,
  icon,
  priceLabel
`;

const aLaCarteSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  filterByScope,
  "services": coalesce(
    selectedServices[]->{ ${serviceReference} },
    *[_type == "service" && (^.filterByScope == "all" || scope == ^.filterByScope)] | order(order asc){ ${serviceReference} }
  ),
  footerNote,
  cta{ ${ctaFragment} }
`;

const conditionsSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  items[]{
    title,
    description
  },
  footnote
`;

const stickyCtaSectionFragment = /* groq */ `
  enabled,
  label,
  subLabel,
  cta{ ${ctaFragment} }
`;

const leadMagnetSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  bullets,
  emailPlaceholder,
  submitLabel,
  successMessage,
  privacyNote,
  catalogues[]{
    title,
    subtitle,
    cover{ ${imageFragment} },
    rotate
  }
`;

const locationPricingSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  rows[]{ day, hours, hoursNote, price }
`;

const crossServicesSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  items[]{
    eyebrow,
    titleStart,
    titleItalic,
    description,
    tags,
    ctaLabel,
    ctaHref
  }
`;

const contactSectionFragment = /* groq */ `
  enabled,
  eyebrow,
  title,
  intro,
  calendlyEyebrow,
  calendlyTitle,
  calendlyDescription,
  calendlyButtonLabel,
  formEyebrow,
  formTitle,
  formEventTypes,
  formSubmitLabel,
  formSuccessTitle,
  formSuccessMessage
`;

// ============================================================================
// SITE SETTINGS
// ============================================================================
export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0]{
    siteName,
    tagline,
    logo{ ${imageFragment} },
    logoDark{ ${imageFragment} },
    defaultOgImage{ ${imageFragment} },
    founder{
      name,
      role,
      photo{ ${imageFragment} },
      bio,
      signatureQuote,
      signatureName
    },
    headerNav[]{
      label,
      cta{ ${ctaFragment} }
    },
    headerCta{ ${ctaFragment} },
    email,
    phone,
    phoneHref,
    address,
    hours,
    calendlyUrl,
    social{
      items[]{ platform, label, url }
    },
    footerTagline,
    footerColumns[]{
      title,
      links[]{
        label,
        cta{ ${ctaFragment} }
      }
    },
    footerContactTitle,
    footerCopyright,
    footerLegalLinks[]{
      label,
      cta{ ${ctaFragment} }
    },
    legal,
    defaultSeo
  }
`);

// ============================================================================
// PAGES
// ============================================================================
export const homePageQuery = defineQuery(`
  *[_type == "homePage"][0]{
    hero{ ${heroHomeFragment} },
    marquee{ ${marqueeSectionFragment} },
    caseStudies{ ${caseStudiesSectionFragment} },
    universes{ ${universesSectionFragment} },
    process{ ${processSectionFragment} },
    about{ ${aboutFragment} },
    pillars{ ${pillarsSectionFragment} },
    testimonials{ ${testimonialsSectionFragment} },
    faq{ ${faqSectionFragment} },
    leadMagnet{ ${leadMagnetSectionFragment} },
    contact{ ${contactSectionFragment} },
    seo
  }
`);

export const mariagePageQuery = defineQuery(`
  *[_type == "mariagePage"][0]{
    hero{ ${heroFragment} },
    trustBar{ ${trustBarSectionFragment} },
    intro{ ${aboutFragment} },
    packs{ ${packsSectionFragment} },
    themes{ ${themesSectionFragment} },
    ceremonies{ ${ceremoniesSectionFragment} },
    lieux{ ${lieuxSectionFragment} },
    timeline{ ${timelineSectionFragment} },
    alacarte{ ${aLaCarteSectionFragment} },
    gallery{ ${gallerySectionFragment} },
    portfolio{ ${caseStudiesSectionFragment} },
    testimonials{ ${testimonialsSectionFragment} },
    conditions{ ${conditionsSectionFragment} },
    faq{ ${faqSectionFragment} },
    finalCta{ ${ctaSectionFragment} },
    stickyCta{ ${stickyCtaSectionFragment} },
    seo
  }
`);

export const evenementPageQuery = defineQuery(`
  *[_type == "evenementPage"][0]{
    hero{ ${heroFragment} },
    trustBar{ ${trustBarSectionFragment} },
    intro{ ${aboutFragment} },
    usecases{ ${processSectionFragment} },
    packs{ ${packsSectionFragment} },
    process{ ${processSectionFragment} },
    lieux{ ${lieuxSectionFragment} },
    scope{ ${conditionsSectionFragment} },
    alacarte{ ${aLaCarteSectionFragment} },
    gallery{ ${gallerySectionFragment} },
    portfolio{ ${caseStudiesSectionFragment} },
    timeline{ ${timelineSectionFragment} },
    testimonials{ ${testimonialsSectionFragment} },
    faq{ ${faqSectionFragment} },
    finalCta{ ${ctaSectionFragment} },
    stickyCta{ ${stickyCtaSectionFragment} },
    seo
  }
`);

export const espaceEventsPageQuery = defineQuery(`
  *[_type == "espaceEventsPage"][0]{
    hero{ ${heroFragment} },
    trustBar{ ${trustBarSectionFragment} },
    venue{ ${venueSectionFragment} },
    intro{ ${aboutFragment} },
    packs{ ${packsSectionFragment} },
    packsFiesta{ ${packsSectionFragment} },
    notYetDecided{ ${ctaSectionFragment} },
    occasions{ ${ceremoniesSectionFragment} },
    alacarte{ ${aLaCarteSectionFragment} },
    locationOnly{ ${locationPricingSectionFragment} },
    gallery{ ${gallerySectionFragment} },
    testimonials{ ${testimonialsSectionFragment} },
    conditions{ ${conditionsSectionFragment} },
    faq{ ${faqSectionFragment} },
    finalCta{ ${ctaSectionFragment} },
    otherServices{ ${crossServicesSectionFragment} },
    stickyCta{ ${stickyCtaSectionFragment} },
    seo
  }
`);

export const realisationsPageQuery = defineQuery(`
  *[_type == "realisationsPage"][0]{
    hero{ ${heroFragment} },
    trustBar{ ${trustBarSectionFragment} },
    introText,
    galleryEyebrow,
    galleryTitle,
    filters[]{ label, value },
    caseStudies{ ${caseStudiesSectionFragment} },
    finalCta{ ${ctaSectionFragment} },
    stickyCta{ ${stickyCtaSectionFragment} },
    seo
  }
`);

export const blogPageQuery = defineQuery(`
  *[_type == "blogPage"][0]{
    eyebrow,
    title,
    intro,
    emptyStateTitle,
    emptyStateMessage,
    articleCta{ ${ctaSectionFragment} },
    seo
  }
`);

export const legalPageQuery = defineQuery(`
  *[_type == $type][0]{
    title,
    lastUpdated,
    body,
    seo
  }
`);

// ============================================================================
// COLLECTIONS
// ============================================================================
export const realisationsListQuery = defineQuery(`
  *[_type == "realisation"] | order(featured desc, eventDate desc){
    _id,
    title,
    shortTitle,
    italicSubtitle,
    "slug": slug.current,
    type,
    typeLabel,
    eventDate,
    location,
    cover{ ${imageFragment} },
    gallery[]{ ${imageFragment} },
    tags,
    featured
  }
`);

export const realisationBySlugQuery = defineQuery(`
  *[_type == "realisation" && slug.current == $slug][0]{
    _id,
    title,
    shortTitle,
    italicSubtitle,
    "slug": slug.current,
    type,
    typeLabel,
    eventDate,
    location,
    guestCount,
    theme,
    badge,
    story,
    quote,
    metaItems[]{ label, value },
    cover{ ${imageFragment} },
    moodBoard[]{ ${imageFragment} },
    gallery[]{ ${imageFragment} },
    description,
    tags,
    "linkedTestimonial": linkedTestimonial->{ ${testimonialReference} },
    seo
  }
`);

export const allRealisationSlugsQuery = defineQuery(`
  *[_type == "realisation" && defined(slug.current)]{ "slug": slug.current }
`);

export const postsListQuery = defineQuery(`
  *[_type == "post"] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    cover{ ${imageFragment} },
    publishedAt,
    readingTime,
    "category": category->{ title, "slug": slug.current }
  }
`);

export const postBySlugQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    excerpt,
    cover{ ${imageFragment} },
    publishedAt,
    readingTime,
    body,
    tags,
    "category": category->{ title, "slug": slug.current },
    seo
  }
`);

export const allPostSlugsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current }
`);

export const sitemapQuery = defineQuery(`
  {
    "realisations": *[_type == "realisation" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
    "posts": *[_type == "post" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
  }
`);
