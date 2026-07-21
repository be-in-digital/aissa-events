/**
 * Source d'images Dropbox pour le Studio Sanity.
 *
 * Ajoute un onglet « Dropbox » dans le sélecteur d'image (à côté de « Upload »).
 * L'éditeur choisit une photo dans son Dropbox via le Dropbox Chooser ; le lien
 * direct est renvoyé à Sanity qui IMPORTE l'image dans son propre asset store
 * (donc pas un lien externe fragile : une vraie image Sanity, optimisée).
 *
 * Prérequis : une App key Dropbox (Chooser) exposée en `NEXT_PUBLIC_DROPBOX_APP_KEY`.
 * Créer l'app sur https://www.dropbox.com/developers/apps (Scoped access, Full
 * Dropbox), puis ajouter le domaine du Studio dans « Chooser / Saver domains ».
 * Sans clé, l'onglet affiche un message de configuration (ne casse rien).
 */
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { env } from "@/env";

const APP_KEY = env.NEXT_PUBLIC_DROPBOX_APP_KEY;
const DROPINS_SRC = "https://www.dropbox.com/static/api/2/dropins.js";
const IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".avif",
  ".svg",
  ".heic",
  ".tiff",
];

/** Fichier renvoyé par le Dropbox Chooser (champs utiles seulement). */
type DropboxChooserFile = {
  name: string;
  link: string;
  bytes: number;
};

declare global {
  interface Window {
    Dropbox?: {
      choose: (options: {
        success: (files: DropboxChooserFile[]) => void;
        cancel?: () => void;
        linkType?: "preview" | "direct";
        multiselect?: boolean;
        extensions?: string[];
        folderselect?: boolean;
      }) => void;
    };
  }
}

/** Ce que Sanity attend de `onSelect` : on renvoie des URLs à importer. */
type AssetFromUrl = { kind: "url"; value: string };
type DropboxComponentProps = {
  onSelect: (assets: AssetFromUrl[]) => void;
  onClose: () => void;
};

/** Charge le script Dropbox Dropins une seule fois et signale quand il est prêt. */
function useDropboxChooser(appKey: string | undefined): boolean {
  const [ready, setReady] = useState<boolean>(
    () => typeof window !== "undefined" && Boolean(window.Dropbox),
  );

  useEffect(() => {
    if (!appKey || typeof document === "undefined") return;
    if (window.Dropbox) {
      setReady(true);
      return;
    }

    let script = document.getElementById(
      "dropboxjs",
    ) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement("script");
      script.id = "dropboxjs";
      script.src = DROPINS_SRC;
      script.setAttribute("data-app-key", appKey);
      document.body.appendChild(script);
    }

    const handleLoad = () => setReady(Boolean(window.Dropbox));
    script.addEventListener("load", handleLoad);
    // Filet de sécurité si le script était déjà en cours de chargement.
    const poll = window.setInterval(() => {
      if (window.Dropbox) {
        setReady(true);
        window.clearInterval(poll);
      }
    }, 300);

    return () => {
      script?.removeEventListener("load", handleLoad);
      window.clearInterval(poll);
    };
  }, [appKey]);

  return ready;
}

function DropboxAssetSource({ onSelect, onClose }: DropboxComponentProps) {
  const ready = useDropboxChooser(APP_KEY);

  const openChooser = useCallback(() => {
    if (!window.Dropbox) return;
    window.Dropbox.choose({
      linkType: "direct",
      multiselect: true,
      extensions: IMAGE_EXTENSIONS,
      success: (files) => {
        onSelect(files.map((file) => ({ kind: "url", value: file.link })));
        onClose();
      },
      cancel: onClose,
    });
  }, [onSelect, onClose]);

  if (!APP_KEY) {
    return (
      <Card padding={4} radius={2} tone="caution" shadow={1}>
        <Stack space={4}>
          <Text size={1} weight="semibold">
            Dropbox n’est pas encore configuré
          </Text>
          <Text size={1} muted>
            Ajoutez la clé <code>NEXT_PUBLIC_DROPBOX_APP_KEY</code> (App key du
            Dropbox Chooser) dans vos variables d’environnement, puis
            redéployez, pour activer la sélection d’images depuis Dropbox.
          </Text>
          <Box>
            <Button text="Fermer" mode="ghost" onClick={onClose} />
          </Box>
        </Stack>
      </Card>
    );
  }

  return (
    <Card padding={4} radius={2}>
      <Stack space={4}>
        <Text size={1} muted>
          Choisissez une image dans votre Dropbox. Elle sera importée dans
          Sanity (et optimisée comme n’importe quelle image du site).
        </Text>
        <Flex gap={2} align="center">
          <Button
            text="Choisir depuis Dropbox"
            tone="primary"
            disabled={!ready}
            onClick={openChooser}
          />
          <Button text="Annuler" mode="ghost" onClick={onClose} />
        </Flex>
        {!ready && (
          <Text size={1} muted>
            Chargement du sélecteur Dropbox…
          </Text>
        )}
      </Stack>
    </Card>
  );
}

/** Petit glyphe Dropbox (deux chevrons) pour l’onglet de la source. */
function DropboxIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 2 0 6l6 4 6-4-6-4Zm12 0-6 4 6 4 6-4-6-4ZM0 14l6 4 6-4-6-4-6 4Zm18-4-6 4 6 4 6-4-6-4ZM6 19.5l6 4 6-4-6-4-6 4Z" />
    </svg>
  );
}

/**
 * Objet « asset source » enregistré dans `sanity.config.ts`
 * (`form.image.assetSources`). Non typé explicitement en `AssetSource` : la
 * validation structurelle se fait au point d’enregistrement.
 */
export const dropboxAssetSource = {
  name: "dropbox",
  title: "Dropbox",
  icon: DropboxIcon,
  component: DropboxAssetSource,
};
