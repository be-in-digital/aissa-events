"use client";

import Script from "next/script";

const LIMOVA_SRC =
  "https://limova-web-sltj.onrender.com/scripts/chatbot-loader.js";
const LIMOVA_CONNECTION_ID = "5b3379aa-7b25-4f99-b2e6-2b93fdd7d91f";

/**
 * Widget Limova (chatbot). Chargé en `lazyOnload` pour ne pas pénaliser le LCP —
 * le script externe injecte son propre bouton flottant dans le DOM.
 *
 * Le domaine `limova-web-sltj.onrender.com` est autorisé dans la CSP
 * (`script-src` + `connect-src`) — cf. `next.config.ts`.
 */
export function LimovaChatbot() {
  return (
    <Script
      id="limova-chatbot-loader"
      src={LIMOVA_SRC}
      data-connection-id={LIMOVA_CONNECTION_ID}
      strategy="lazyOnload"
    />
  );
}
