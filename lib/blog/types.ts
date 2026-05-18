/**
 * Types partagés du générateur d'articles IA.
 * Utilisés côté backend (lib/blog) ET côté Sanity Studio (composants wizard).
 */

export interface BriefInput {
  /** Sujet libre, ex : « Pourquoi choisir un wedding planner en Île-de-France ». */
  subject: string;
  /** Audience cible, ex : « fiancés début préparatifs ». */
  audience: string;
  /** Intention éditoriale. */
  intent: "info" | "seo" | "lead-gen" | "mixed";
  /** Angle éditorial choisi, ex : « guide pratique étape par étape ». */
  angle: string;
  /** Mots-clés SEO locaux à intégrer naturellement (Émerainville, 77, IDF…). */
  seoKeywords: string[];
  /** Longueur cible en mots (typiquement 600-1500). */
  targetWordCount: number;
  /** 3-5 points-clés que l'article doit couvrir. */
  keyPoints: string[];
  /** Référence de catégorie Sanity (slug), choisie avant la génération. */
  categorySlug: string;
}

export interface SkeletonH3 {
  title: string;
}

export interface SkeletonH2 {
  title: string;
  /** Sous-titres H3, optionnels (peut être vide pour sections courtes). */
  children: SkeletonH3[];
}

export interface Skeleton {
  title: string;
  excerpt: string;
  /** Plan H2/H3 — l'IA structure, Aïssa peut éditer librement. */
  plan: SkeletonH2[];
  /** Tags suggérés, Aïssa coche/ajoute. */
  suggestedTags: string[];
  /** SEO meta proposé. */
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export interface SectionResult {
  /** Identifiant de la section dans le plan (ex : "h2-0", "h2-2-h3-1"). */
  sectionId: string;
  /** Markdown final après les couches anti-IA. */
  markdown: string;
  /** Indicateurs de qualité collectés par la couche 3 (optionnel). */
  qualityNotes?: {
    llmMarkers: number;
    variance: number;
    concreteness: number;
    voice: number;
  };
  /** Score IA 0-100 donné par le judge final (couche 5). Plus bas = plus humain. */
  aiDetectionScore?: number;
  /** Justification courte du score IA. */
  aiDetectionReasoning?: string;
  /** Nombre d'itérations de réécriture agressive effectuées (0-3). */
  humanizationRounds?: number;
}

export interface ImageVariant {
  /** Sanity asset _id (image-...) une fois uploadé. */
  assetId: string;
  /** URL CDN pour preview dans le wizard. */
  url: string;
  /** Prompt visuel utilisé (pour debug / réutilisation). */
  prompt: string;
}

export interface GenerateSkeletonRequest {
  brief: BriefInput;
}

export interface GenerateSectionRequest {
  brief: BriefInput;
  skeleton: Skeleton;
  sectionId: string;
  /** Sections déjà générées, pour cohérence narrative. */
  previousSections: Array<{ sectionId: string; markdown: string }>;
}

export interface GenerateImagesRequest {
  title: string;
  brief: BriefInput;
  /** Toujours 4 au MVP, paramètre pour flexibilité future. */
  count: number;
}
