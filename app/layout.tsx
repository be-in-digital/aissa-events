import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import {
  Manrope,
  Fraunces,
  JetBrains_Mono,
  Great_Vibes,
} from "next/font/google";
import { cn } from "@/lib/utils";
import { env } from "@/env";
import { VisualEditingOverlay } from "@/components/sanity/visual-editing";
import { SanityLiveWrapper } from "@/components/sanity/live-wrapper";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

const script = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aïssa Events — The Perfect Timing",
    template: "%s | Aïssa Events",
  },
  description:
    "Agence d'événementiel multi-spécialiste à Émerainville (77). Mariages, célébrations, événements corporate. Espace Events — votre lieu de réception en Seine-et-Marne.",
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={cn(
        "h-full antialiased font-sans",
        manrope.variable,
        fraunces.variable,
        mono.variable,
        script.variable,
      )}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {/* Frontière dynamique pour les pages qui fetchent du contenu Sanity.
            Sous cacheComponents, sanityFetch lit draftMode() + cookies() (donc
            dynamique) et doit obligatoirement vivre dans un Suspense. */}
        <Suspense fallback={null}>{children}</Suspense>
        <Suspense fallback={null}>
          <SanityLiveWrapper />
        </Suspense>
        <Suspense fallback={null}>
          <VisualEditingOverlay />
        </Suspense>
      </body>
    </html>
  );
}
