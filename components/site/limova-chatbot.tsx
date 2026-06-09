"use client";

import Script from "next/script";

const LIMOVA_SRC =
  "https://limova-web-sltj.onrender.com/scripts/chatbot-loader.js";
const LIMOVA_CONNECTION_ID = "9b0b1115-18a7-48b4-a3fb-986a57ca1889";

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
