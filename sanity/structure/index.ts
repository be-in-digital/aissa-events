import {
  HomeIcon,
  HeartFilledIcon,
  CalendarIcon,
  PinIcon,
  ImagesIcon,
  DocumentTextIcon,
  EarthGlobeIcon,
  CogIcon,
  StarIcon,
  PackageIcon,
  HelpCircleIcon,
  TagIcon,
  ClipboardIcon,
  RobotIcon,
} from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

const SINGLETON_TYPES = new Set<string>([
  "siteSettings",
  "homePage",
  "mariagePage",
  "evenementPage",
  "espaceEventsPage",
  "realisationsPage",
  "blogPage",
  "mentionsLegales",
  "politiqueConfidentialite",
  "agentSettings",
]);

const HIDDEN_FROM_DEFAULT = new Set<string>([
  "pack",
  "service",
  "realisation",
  "testimonial",
  "faqItem",
  "post",
  "category",
]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Aïssa Events")
    .items([
      // ─────────────── PAGES DU SITE ───────────────
      S.listItem()
        .title("Pages du site")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Pages du site")
            .items([
              S.listItem()
                .title("Accueil")
                .icon(HomeIcon)
                .child(
                  S.editor()
                    .id("homePage")
                    .schemaType("homePage")
                    .documentId("homePage")
                    .title("Page d'accueil"),
                ),
              S.listItem()
                .title("Mariage")
                .icon(HeartFilledIcon)
                .child(
                  S.editor()
                    .id("mariagePage")
                    .schemaType("mariagePage")
                    .documentId("mariagePage")
                    .title("Page Mariage"),
                ),
              S.listItem()
                .title("Événements pro")
                .icon(CalendarIcon)
                .child(
                  S.editor()
                    .id("evenementPage")
                    .schemaType("evenementPage")
                    .documentId("evenementPage")
                    .title("Page Événements"),
                ),
              S.listItem()
                .title("Espace Émerainville")
                .icon(PinIcon)
                .child(
                  S.editor()
                    .id("espaceEventsPage")
                    .schemaType("espaceEventsPage")
                    .documentId("espaceEventsPage")
                    .title("Page Espace Events"),
                ),
              S.listItem()
                .title("Réalisations (page)")
                .icon(ImagesIcon)
                .child(
                  S.editor()
                    .id("realisationsPage")
                    .schemaType("realisationsPage")
                    .documentId("realisationsPage")
                    .title("Page Réalisations"),
                ),
              S.listItem()
                .title("Blog (page)")
                .icon(DocumentTextIcon)
                .child(
                  S.editor()
                    .id("blogPage")
                    .schemaType("blogPage")
                    .documentId("blogPage")
                    .title("Page Blog"),
                ),
              S.divider(),
              S.listItem()
                .title("Mentions légales")
                .icon(ClipboardIcon)
                .child(
                  S.editor()
                    .id("mentionsLegales")
                    .schemaType("mentionsLegales")
                    .documentId("mentionsLegales")
                    .title("Mentions légales"),
                ),
              S.listItem()
                .title("Politique de confidentialité")
                .icon(ClipboardIcon)
                .child(
                  S.editor()
                    .id("politiqueConfidentialite")
                    .schemaType("politiqueConfidentialite")
                    .documentId("politiqueConfidentialite")
                    .title("Politique de confidentialité"),
                ),
            ]),
        ),

      S.divider(),

      // ─────────────── CONTENUS RÉUTILISABLES ───────────────
      S.listItem()
        .title("Réalisations")
        .icon(ImagesIcon)
        .child(
          S.documentTypeList("realisation")
            .title("Réalisations")
            .defaultOrdering([{ field: "featured", direction: "desc" }, { field: "eventDate", direction: "desc" }]),
        ),

      S.listItem()
        .title("Témoignages")
        .icon(StarIcon)
        .child(
          S.documentTypeList("testimonial")
            .title("Témoignages")
            .defaultOrdering([{ field: "featured", direction: "desc" }, { field: "order", direction: "asc" }]),
        ),

      S.listItem()
        .title("Packs (formules)")
        .icon(PackageIcon)
        .child(
          S.documentTypeList("pack")
            .title("Packs")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),

      S.listItem()
        .title("Services à la carte")
        .icon(TagIcon)
        .child(
          S.documentTypeList("service")
            .title("Services à la carte")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),

      S.listItem()
        .title("FAQ (questions)")
        .icon(HelpCircleIcon)
        .child(
          S.documentTypeList("faqItem")
            .title("FAQ")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),

      S.divider(),

      // ─────────────── BLOG ───────────────
      S.listItem()
        .title("Blog")
        .icon(EarthGlobeIcon)
        .child(
          S.list()
            .title("Blog")
            .items([
              S.listItem()
                .title("Articles")
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList("post")
                    .title("Articles")
                    .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                ),
              S.listItem()
                .title("Catégories")
                .icon(TagIcon)
                .child(S.documentTypeList("category").title("Catégories")),
            ]),
        ),

      S.divider(),

      // ─────────────── RÉGLAGES GLOBAUX ───────────────
      S.listItem()
        .title("Réglages du site")
        .icon(CogIcon)
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Réglages du site"),
        ),

      S.listItem()
        .title("Assistante virtuelle")
        .icon(RobotIcon)
        .child(
          S.editor()
            .id("agentSettings")
            .schemaType("agentSettings")
            .documentId("agentSettings")
            .title("Assistante virtuelle"),
        ),

      // Catch-all
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !SINGLETON_TYPES.has(listItem.getId() ?? "") &&
          !HIDDEN_FROM_DEFAULT.has(listItem.getId() ?? ""),
      ),
    ]);

export { SINGLETON_TYPES };
