import type { BriefInput, ImageVariant, SectionResult, Skeleton } from "@/lib/blog/types";

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface WizardState {
  step: WizardStep;
  brief: Partial<BriefInput>;
  skeleton: Skeleton | null;
  sections: SectionResult[];
  imageVariants: ImageVariant[];
  /** Asset _id de la cover sélectionnée parmi les variantes, ou null. */
  selectedCoverAssetId: string | null;
  /** Vrai quand l'utilisateur a explicitement choisi de gérer la cover plus tard. */
  skipCover: boolean;
  /**
   * Images générées et conservées par section, indexées par sectionId.
   * Elles sont injectées à la fin de chaque section dans le body Portable Text
   * au moment de l'insertion finale dans Sanity.
   */
  sectionImages: Record<string, ImageVariant[]>;
}

export const DEFAULT_BRIEF: Partial<BriefInput> = {
  subject: "",
  audience: "",
  intent: "info",
  angle: "",
  seoKeywords: [],
  targetWordCount: 900,
  keyPoints: [],
  categorySlug: "",
};

export const INITIAL_STATE: WizardState = {
  step: 1,
  brief: DEFAULT_BRIEF,
  skeleton: null,
  sections: [],
  imageVariants: [],
  selectedCoverAssetId: null,
  skipCover: false,
  sectionImages: {},
};

export interface StepProps {
  state: WizardState;
  onUpdate: (partial: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
  onCancel: () => void;
}
