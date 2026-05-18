import { ComposeSparklesIcon } from "@sanity/icons";
import { useState } from "react";
import type { DocumentActionComponent } from "sanity";

import { GenerateWizardDialog } from "../components/blog-ai/GenerateWizardDialog";

/**
 * Document Action pour les docs `post` — déclenche le wizard de génération IA.
 * Filtrée pour n'apparaître que sur les docs de type `post`.
 *
 * Note : les Document Actions Sanity sont des hooks personnalisés au sens
 * React (utilisent useState/useEffect en interne) mais ne suivent pas la
 * convention de nommage `use*`. On désactive donc la règle ESLint locale.
 */
export const generateArticleAction: DocumentActionComponent = (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [open, setOpen] = useState(false);

  if (props.type !== "post") return null;

  return {
    label: "Générer avec IA",
    icon: ComposeSparklesIcon,
    onHandle: () => setOpen(true),
    dialog: open
      ? {
          type: "custom",
          component: (
            <GenerateWizardDialog
              docId={props.id}
              onClose={() => setOpen(false)}
            />
          ),
        }
      : null,
  };
};
