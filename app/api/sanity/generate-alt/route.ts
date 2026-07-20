import { generateText } from "ai";
import { NextResponse } from "next/server";

/**
 * Route POST `/api/sanity/generate-alt`
 *
 * Appelée depuis le Studio Sanity (composant AltTextInput) pour générer
 * automatiquement un texte alternatif descriptif en français à partir d'une image.
 * Utilise OpenAI gpt-4o-mini via Vercel AI Gateway (même pattern que le reste du projet).
 *
 * Body : { imageUrl: string }
 * Retour : { alt: string }
 */

const VISION_MODEL = "openai/gpt-4o-mini";

export async function POST(req: Request) {
  try {
    const body = await req.json() as { imageUrl?: string };
    const { imageUrl } = body;

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json(
        { error: "imageUrl manquant ou invalide." },
        { status: 400 },
      );
    }

    const { text } = await generateText({
      model: VISION_MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: new URL(imageUrl),
            },
            {
              type: "text",
              text: `Décris cette image en une phrase courte et précise en français (max 120 caractères).
Le texte sera utilisé comme attribut alt HTML pour l'accessibilité et le SEO.
Il doit décrire concrètement ce qui est visible : personnes, lieu, ambiance, action.
Ne commence pas par "Image de" ou "Photo de".
Réponds uniquement avec le texte descriptif, sans ponctuation finale.`,
            },
          ],
        },
      ],
    });

    const alt = text.trim().replace(/\.$/, "").slice(0, 150);

    return NextResponse.json({ alt });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[generate-alt] Erreur:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
