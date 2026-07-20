/**
 * Obtention (une seule fois) du refresh token OAuth Google Calendar, pour
 * l'intégration « écriture » du scheduler de RDV (création d'event + Meet).
 *
 * Prérequis dans .env.local :
 *   GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET
 *   → Google Cloud Console → API "Google Calendar API" activée
 *   → Identifiants → Créer un ID client OAuth → type « Application de bureau »
 *
 * Usage :
 *   pnpm tsx scripts/google-oauth.ts
 *
 * Le script ouvre le consentement Google (agenda), récupère le code via une
 * redirection loopback, l'échange contre un refresh token, et l'affiche.
 * Copier la valeur dans .env.local : GOOGLE_OAUTH_REFRESH_TOKEN=...
 *
 * Le compte Google connecté doit être celui qui possède (ou peut modifier)
 * l'agenda « Aïssa Events — Réservations ». Cf. BOOKING.md.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { createServer } from "node:http";
import { exec } from "node:child_process";

const PORT = 53682;
const REDIRECT_URI = `http://127.0.0.1:${PORT}`;
const SCOPE = "https://www.googleapis.com/auth/calendar.events";

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    "\n❌ GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET manquants dans .env.local.\n" +
      "   Crée un ID client OAuth « Application de bureau » dans Google Cloud Console,\n" +
      "   colle client_id + client_secret dans .env.local, puis relance.\n",
  );
  process.exit(1);
}

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
  }).toString();

async function exchangeCode(code: string): Promise<void> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId!,
      client_secret: clientSecret!,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  const json = (await res.json()) as { refresh_token?: string; error?: string; error_description?: string };
  if (!res.ok || !json.refresh_token) {
    console.error("\n❌ Échange du code échoué :", json.error, json.error_description ?? "");
    console.error("   (Si pas de refresh_token : révoque l'accès dans https://myaccount.google.com/permissions puis relance.)\n");
    process.exit(1);
  }
  console.log("\n✅ Refresh token obtenu. Colle cette ligne dans .env.local :\n");
  console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${json.refresh_token}\n`);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", REDIRECT_URI);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(
    `<html><body style="font-family:system-ui;padding:40px;text-align:center">` +
      (code
        ? "<h2>✅ C'est bon — revenez au terminal.</h2><p>Vous pouvez fermer cet onglet.</p>"
        : `<h2>❌ Autorisation refusée</h2><p>${error ?? ""}</p>`) +
      `</body></html>`,
  );
  server.close();
  if (error) {
    console.error("\n❌ Autorisation refusée :", error, "\n");
    process.exit(1);
  }
  if (code) await exchangeCode(code);
  process.exit(0);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("\n🔑 Ouvre cette URL dans ton navigateur (connecte le compte Google d'Aïssa) :\n");
  console.log(authUrl + "\n");
  // Tentative d'ouverture automatique (macOS `open`, Linux `xdg-open`).
  const opener = process.platform === "darwin" ? "open" : "xdg-open";
  exec(`${opener} "${authUrl}"`, () => {});
  console.log("En attente de l'autorisation…");
});
