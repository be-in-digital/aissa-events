import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const alt =
  "Aïssa Events — agence événementielle à Émerainville (77)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Image OG par défaut pour le segment `(site)` (= toutes les pages publiques
 * qui ne définissent pas leur propre `opengraph-image`). Génère un PNG
 * 1200×630 conforme aux exigences LinkedIn / Twitter / Slack (le SVG était
 * rejeté par ces plateformes).
 *
 * `dynamic = "force-static"` est obligatoire sous `cacheComponents: true` —
 * sans ça, Vercel répondait 500 (FUNCTION_INVOCATION_FAILED). On n'utilise
 * pas non plus `fontFamily: "serif"` parce que Satori (sous-jacent à
 * ImageResponse) ne reconnaît pas les familles CSS génériques.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #2C1F33 0%, #3D2549 55%, #7A2E43 100%)",
          color: "#F4EFE6",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#D9B26F",
          }}
        >
          <div
            style={{
              width: 48,
              height: 1,
              background: "#D9B26F",
            }}
          />
          Aïssa Events
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              maxWidth: 980,
            }}
          >
            Wedding planner &
            <br />
            agence événementielle
          </div>
          <div
            style={{
              fontSize: 34,
              fontStyle: "italic",
              color: "#D9B26F",
              maxWidth: 880,
            }}
          >
            Émerainville · Seine-et-Marne — depuis 2020
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 20,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(244,239,230,0.7)",
          }}
        >
          <div>Espace Events · Mariage · Pro</div>
          <div>aissaevents.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
