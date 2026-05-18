import type { SchemaTypeDefinition } from "sanity";

// Objects (réutilisables)
import {
  seo,
  cta,
  imageWithAlt,
  blockContent,
} from "./objects/common";
import {
  heroSection,
  packsSection,
  testimonialsSection,
  gallerySection,
  ctaSection,
  faqSection,
  aboutSection,
  venueSection,
} from "./objects/sections";
import {
  heroHomeSection,
  marqueeSection,
  pillarsSection,
  processSection,
  universesSection,
  caseStudiesSection,
  trustBarSection,
  ceremoniesSection,
  themesSection,
  lieuxSection,
  timelineSection,
  aLaCarteSection,
  conditionsSection,
  stickyCtaSection,
  contactSection,
  locationPricingSection,
  crossServicesSection,
  leadMagnetSection,
} from "./objects/page-sections";

// Documents (collections)
import { pack } from "./documents/pack";
import { service } from "./documents/service";
import { realisation } from "./documents/realisation";
import { testimonial } from "./documents/testimonial";
import { faqItem } from "./documents/faqItem";
import { post } from "./documents/post";
import { category } from "./documents/category";

// Singletons
import { siteSettings } from "./singletons/siteSettings";
import { homePage } from "./singletons/homePage";
import { mariagePage } from "./singletons/mariagePage";
import { evenementPage } from "./singletons/evenementPage";
import { espaceEventsPage } from "./singletons/espaceEventsPage";
import { realisationsPage } from "./singletons/realisationsPage";
import { blogPage } from "./singletons/blogPage";
import {
  mentionsLegales,
  politiqueConfidentialite,
} from "./singletons/legalPages";
import { agentSettings } from "./singletons/agentSettings";
import { availability } from "./singletons/availability";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects de base
  seo,
  cta,
  imageWithAlt,
  blockContent,

  // Sections génériques
  heroSection,
  packsSection,
  testimonialsSection,
  gallerySection,
  ctaSection,
  faqSection,
  aboutSection,
  venueSection,

  // Sections spécifiques aux pages
  heroHomeSection,
  marqueeSection,
  pillarsSection,
  processSection,
  universesSection,
  caseStudiesSection,
  trustBarSection,
  ceremoniesSection,
  themesSection,
  lieuxSection,
  timelineSection,
  aLaCarteSection,
  conditionsSection,
  stickyCtaSection,
  contactSection,
  locationPricingSection,
  crossServicesSection,
  leadMagnetSection,

  // Documents
  pack,
  service,
  realisation,
  testimonial,
  faqItem,
  post,
  category,

  // Singletons
  siteSettings,
  homePage,
  mariagePage,
  evenementPage,
  espaceEventsPage,
  realisationsPage,
  blogPage,
  mentionsLegales,
  politiqueConfidentialite,
  agentSettings,
  availability,
];
