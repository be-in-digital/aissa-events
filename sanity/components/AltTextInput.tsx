/**
 * AltTextInput — champ texte alternatif avec génération IA dans Sanity Studio.
 *
 * Remplace le StringInput standard pour le champ `alt` de `imageWithAlt`.
 * Ajoute un bouton "Générer avec l'IA ✨" qui :
 *  1. Récupère l'asset de l'image parente via useFormValue
 *  2. Construit l'URL Sanity CDN de l'image
 *  3. Appelle `/api/sanity/generate-alt` (OpenAI Vision gpt-4o-mini)
 *  4. Remplit le champ alt avec le texte généré
 */
import { useCallback, useState } from "react";
import { StringInputProps, set, useFormValue, useClient } from "sanity";

// Sanity asset reference shape
interface SanityImageAssetRef {
  _ref?: string;
  _type?: string;
  url?: string;
}

interface SanityImageValue {
  asset?: SanityImageAssetRef;
  _type?: string;
}

/**
 * Convertit une référence asset Sanity (image-<projectId>-<hash>-<dims>)
 * en URL CDN directement, sans appel réseau.
 */
function assetRefToUrl(ref: string, projectId: string, dataset: string): string {
  // format: image-<id>-<width>x<height>-<ext>
  const match = ref.match(/^image-([a-f0-9]+)-\d+x\d+-(\w+)$/);
  if (!match) return "";
  const [, id, ext] = match;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${ext}?w=800&auto=format`;
}

export function AltTextInput(props: StringInputProps) {
  const { onChange, renderDefault } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupère la valeur de l'image parente (le document imageWithAlt)
  const imageValue = useFormValue([]) as SanityImageValue | null;
  const client = useClient({ apiVersion: "2026-05-09" });

  const handleGenerate = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      let imageUrl = "";

      // Cas 1 : asset avec URL directe (déjà résolue)
      if (imageValue?.asset?.url) {
        imageUrl = imageValue.asset.url;
      }
      // Cas 2 : référence asset (_ref)
      else if (imageValue?.asset?._ref) {
        const ref = imageValue.asset._ref;
        // Essayer la construction directe depuis le _ref
        const projectId = client.config().projectId ?? "";
        const dataset = client.config().dataset ?? "production";
        imageUrl = assetRefToUrl(ref, projectId, dataset);

        // Si la construction directe échoue, fetch l'asset via API
        if (!imageUrl) {
          const assetId = ref.replace(/^image-/, "sanity.imageAsset/").replace(/-[^-]+-[^-]+$/, "");
          const asset = await client.fetch(`*[_id == $id][0]{ url }`, { id: assetId }) as { url?: string } | null;
          imageUrl = asset?.url ?? "";
        }
      }

      if (!imageUrl) {
        setError("Uploadez d'abord une image pour générer l'alt.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/sanity/generate-alt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? `Erreur ${res.status}`);
      }

      const { alt } = await res.json() as { alt: string };
      onChange(set(alt));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [imageValue, client, onChange]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {renderDefault(props)}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: 500,
            borderRadius: "4px",
            border: "1px solid #e5e7eb",
            background: loading ? "#f3f4f6" : "#fff",
            color: loading ? "#9ca3af" : "#374151",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            transition: "all 0.15s",
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  display: "inline-block",
                  width: "10px",
                  height: "10px",
                  border: "2px solid #d1d5db",
                  borderTopColor: "#6b7280",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                }}
              />
              Génération…
            </>
          ) : (
            <>✨ Générer avec l'IA</>
          )}
        </button>
        {error && (
          <span style={{ fontSize: "11px", color: "#ef4444" }}>{error}</span>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
