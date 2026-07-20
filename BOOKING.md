# Réservation d'appel (scheduler natif) · Mise en place et exploitation

Ce document décrit le **scheduler de rendez-vous natif** qui a remplacé Calendly.
Tout vit dans l'app : les visiteurs réservent un appel découverte **sans quitter
le site** (modale ou page `/reserver`), les réglages sont éditables dans Sanity,
et aucun service tiers de prise de RDV n'est nécessaire.

## Pourquoi natif (et pas Calendly / Cal.com)

- **Interne à 100 %** : la réservation se fait sur `aissaevents.fr`, dans la
  charte du site.
- **Tout éditable dans Sanity** : horaires, durée, format, textes — cf. doc
  « Réservation d'appel ».
- **Zéro nouvelle infra / credential** : réutilise ce qui existe déjà —
  Resend (emails), HubSpot (contacts), le flux Google ICS du calendrier de
  dispo, Upstash (rate-limit + verrou anti-double-booking).

## Vue d'ensemble du pipeline

```
Sanity « Types de rendez-vous » (collection bookingType)
   │  chaque type : horaires, durée, buffer, délai, horizon, format, textes
   ▼
GET /api/booking/types → page de choix (si plusieurs types)
   ▼
GET /api/booking/availability?type=<slug>  (dynamique, jamais caché)
   │  créneaux du type = ses horaires ouvrables
   │            − occupé Google Calendar (flux ICS secret, lecture seule)
   │            − rendez-vous confirmés TOUS TYPES (documents Sanity `booking`)
   │            − délai mini / horizon
   ▼
Modale de réservation (booking-flow) OU page /reserver[/<type>]
   │  [choisir le type] → jour → créneau → coordonnées → confirmer
   ▼
POST /api/booking
   │  1. valide (Zod) + honeypot + rate-limit IP (Upstash)
   │  2. re-vérifie que le créneau est libre + verrou court Upstash
   │  3. (option) crée l'event Google Calendar + lien Meet si visio
   │  4. crée un document Sanity `booking` (source de vérité)
   │  5. envoie 2 emails Resend (agence + client) avec invitation .ics
   │  6. crée un contact HubSpot (optionnel)
   ▼
Rendez-vous confirmé — visible dans Sanity « Rendez-vous réservés »
```

> **La même source Google que le calendrier public.** Le scheduler réutilise le
> flux ICS secret configuré dans le doc « Disponibilités » (`feedUrl`). Il n'y a
> donc rien de plus à connecter côté Google : cf. `AVAILABILITY.md` §1-3.

## Écriture dans l'agenda : deux modes

Quand un RDV est réservé, le doc Sanity `booking` est créé (source de vérité,
rend le créneau indisponible). Pour l'agenda, deux modes selon la config :

**Mode A — Invitation `.ics` (toujours actif, zéro credential).**
Une invitation iCalendar est jointe aux emails de confirmation (client **et**
agence). Un clic → l'événement s'ajoute à l'agenda. C'est le repli par défaut.

**Mode B — API Google Calendar (si branchée, cf. section suivante).**
L'event est **créé automatiquement** sur l'agenda d'Aïssa (sans clic), et pour
les RDV de type **visio**, un **lien Google Meet unique** est généré et inséré
dans l'event + l'email + le `.ics`. Fail-soft : si l'API échoue ou n'est pas
configurée, on retombe sur le Mode A.

## Brancher Google Calendar (event auto + Meet)

Optionnel. Donne l'event auto sur l'agenda + le Meet par RDV visio. Auth par
**OAuth2 refresh token** (seul moyen d'avoir un Meet, y compris sur Gmail perso).

1. **Google Cloud Console** (avec le compte Google d'Aïssa) → nouveau projet →
   **activer « Google Calendar API »**.
2. **Identifiants → Créer un ID client OAuth → « Application de bureau »**.
   Copier `client_id` + `client_secret` dans `.env.local` :
   `GOOGLE_OAUTH_CLIENT_ID=…` / `GOOGLE_OAUTH_CLIENT_SECRET=…`.
   - ⚠️ **Écran de consentement** : si le compte est une **Gmail perso**,
     l'app reste « en test » → ajouter l'email d'Aïssa comme *utilisateur test*
     (sinon le refresh token peut expirer après 7 j). Si c'est un **Google
     Workspace** (domaine pro), publier l'app en **« Interne »** → aucun souci
     d'expiration ni de vérification.
3. **Obtenir le refresh token** (une fois) : `pnpm tsx scripts/google-oauth.ts`
   → ouvre le consentement, autorise l'agenda, copie la ligne affichée dans
   `.env.local` : `GOOGLE_OAUTH_REFRESH_TOKEN=…`.
4. **Choisir l'agenda cible** : `GOOGLE_CALENDAR_ID` = l'« ID de l'agenda »
   (Paramètres Google Calendar → Intégrer le calendrier). Idéalement l'agenda
   dédié « Aïssa Events — Réservations ». Défaut : `primary`.
5. Reporter ces 4 variables dans **Vercel → Settings → Environment Variables**.

> Le **Meet** n'est généré que pour les types de RDV en **visio**. Pour un type
> « appel » ou « sur place », l'event est créé sans Meet. Un RDV **annulé** dans
> le Studio n'efface pas (encore) l'event Google automatiquement — à supprimer à
> la main, ou brancher un webhook Sanity plus tard (`deleteCalendarEvent` existe déjà).

## Plusieurs types de rendez-vous

La réservation gère **autant de types que l'agence veut** (ex. « Appel
découverte », « Visite de l'Espace Events »). Chaque type a **ses propres**
horaires, durée, format, délai et textes, et **sa propre URL** (`/reserver/appel`,
`/reserver/visite`).

Point clé : les créneaux occupés sont **partagés entre tous les types** — un
RDV « appel » à 11h bloque une « visite » à 11h (Aïssa ne peut pas être à deux
endroits). C'est automatique (le calcul d'occupation lit tous les `booking`
confirmés + Google Calendar).

## Configurer dans Sanity

**Studio → « Types de rendez-vous »** (collection) — créer / activer un type,
chacun avec :

| Groupe | Réglage | Défaut (1er type « Appel découverte ») |
|---|---|---|
| Général | Nom + identifiant d'URL (slug) | Appel découverte · `appel` |
| Général | Activer / Ordre / Description courte | ✅ / 0 / — |
| Général | Format (appel / visio / sur place) + détail | Appel (Aïssa rappelle) |
| Horaires | Durée · battement · délai mini · fenêtre | 15 min · 15 · 24 h · 30 j |
| Horaires | Fuseau · plages hebdo | Europe/Paris · Mar–Ven 10–18, Sam 10–13 |
| Textes | Sur-titre / titre / sous-titre / confirmation | (pré-remplis) |
| Avancé | Retirer l'occupé Google · Contact HubSpot | ✅ / ✅ |

**Studio → « Réservation — page de choix »** (singleton) — kill-switch général
+ textes de la page « Quel type de rendez-vous ? » (affichée quand il y a plus
d'un type).

> Tant qu'aucun type n'est créé, la réservation tourne sur un type par défaut
> « Appel découverte » (défini dans `lib/booking/types.ts` → `DEFAULT_BOOKING_TYPE`).
> Avec **un seul** type, la page de choix est sautée (accès direct au flux).

Les rendez-vous réservés apparaissent dans **« Rendez-vous réservés »** (chaque
RDV note son type). Passer un RDV en **« Annulé »** libère le créneau côté site.

## Variables d'environnement

Aucune variable **nouvelle**. Le scheduler réutilise :

| Variable | Rôle | Déjà utilisée par |
|---|---|---|
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` | Emails confirmation + invitation | Formulaire de contact |
| `HUBSPOT_PRIVATE_APP_TOKEN` | Contact CRM (optionnel) | Formulaire de contact |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Rate-limit + verrou anti-double-booking | Contact, blog, webhook Meta |
| `SANITY_API_WRITE_TOKEN` | Écriture du document `booking` | Cron de dispo |
| `GOOGLE_OAUTH_CLIENT_ID` / `_SECRET` / `_REFRESH_TOKEN` / `GOOGLE_CALENDAR_ID` | **Optionnel** — event auto + Meet (sinon repli `.ics`) | Nouveau (cf. section Google) |

Le flux Google ICS (lecture) vit dans Sanity (`availability.feedUrl`), pas dans l'env.

## Où placer les CTA « Réserver un rendez-vous »

Toutes reliées à la même modale (l'intercepteur global l'ouvre ; sans JS, la
page prend le relais) :

1. **Vers la page de choix** : `buildBookingUrl({ source, content, preferredDate })`
   → `/reserver`. Avec un seul type actif, va direct au flux ; avec plusieurs,
   affiche « Quel type de rendez-vous ? ».
2. **Vers un type précis** : `buildBookingUrl({ type: "visite", source, content })`
   → `/reserver/visite`. Idéal pour un CTA ciblé (ex. « Réserver une visite »
   sur la page Espace Events).
3. **CTA Sanity** de type « Réserver un appel » (valeur `calendly`, rétro-compat)
   → `/reserver` (page de choix).
4. **Programmatique** (composant client) : `openBookingDialog({ type?, source, content, date })`.

## Limite connue (fuseau des events Google)

Le parser ICS partagé (`lib/availability/ics-parser.ts`) résout les heures des
events **timés** en supposant l'heure d'été de Paris (+02:00). En hiver, un
event Google timé peut donc déborder de ±1 h sur ses bornes. Impact réel très
faible :

- les events **journée entière** (mariages, blocages `[perso]`) couvrent
  totalement les heures ouvrables → le jour est correctement bloqué ;
- seuls des events **timés** chevauchant partiellement les heures d'appel sont
  concernés, et Aïssa confirme chaque RDV.

Si un jour la précision devient critique : parser dédié avec walk VTIMEZONE, ou
brancher l'API Google Calendar.

## Architecture · fichiers à connaître

**Logique (sûre client + serveur)**
- `lib/booking/types.ts` — types + `DEFAULT_BOOKING_TYPE` / `CHOOSER_DEFAULTS`
- `lib/booking/time.ts` — fuseau Europe/Paris DST-correct via `Intl` (sans dépendance)
- `lib/booking/slots.ts` — génération pure des créneaux + `isSlotBookable`
- `lib/booking/url.ts` — `buildBookingUrl()` (+ helpers `isBookingPath` / `bookingTypeFromPath`)
- `lib/booking/schema.ts` — validation Zod du POST (inclut `type`)
- `lib/booking/ics.ts` — invitation iCalendar

**Serveur**
- `lib/booking/settings.ts` — `getBookingTypes` / `getBookingType(slug)` / `getChooserConfig`
- `lib/booking/busy.ts` — agrège l'occupé (Google ICS + bookings Sanity, tous types)
- `lib/booking/availability.ts` — dispo par type + liste des types
- `lib/booking/email.ts` — envoi Resend (agence + client) + .ics
- `lib/booking/google-calendar.ts` — **écriture** Google Calendar (event + Meet, OAuth, fail-soft)
- `lib/booking/hubspot.ts` — contact CRM optionnel
- `lib/booking/rate-limit.ts` — rate-limit + verrou de créneau Upstash
- `scripts/google-oauth.ts` — obtention (une fois) du refresh token Google

**API**
- `app/api/booking/types/route.ts` — `GET` liste des types + copy de la page de choix
- `app/api/booking/availability/route.ts` — `GET ?type=<slug>` créneaux frais d'un type
- `app/api/booking/route.ts` — `POST` création d'un RDV (charge le type)

**UI**
- `components/booking/booking-flow.tsx` — choix du type → jour → créneau → form → succès
- `components/booking/booking-dialog.tsx` — modale + `openBookingDialog({ type? })`
- `components/booking/booking-interceptor.tsx` — capte `/reserver` et `/reserver/<type>`
- `app/(site)/reserver/page.tsx` — page de choix (fallback sans JS + SEO)
- `app/(site)/reserver/[type]/page.tsx` — accès direct à un type

**Sanity**
- `sanity/schemas/documents/bookingType.ts` — un TYPE de RDV (collection éditable)
- `sanity/schemas/singletons/bookingSettings.ts` — page de choix (kill-switch + textes)
- `sanity/schemas/documents/booking.ts` — un RDV réservé (avec son type)

## Troubleshooting

| Symptôme | Cause probable | Fix |
|---|---|---|
| « Aucun créneau disponible » | `enabled = false`, ou plages hebdo vides, ou horizon/délai trop stricts | Vérifier le doc « Réservation d'appel » |
| Tous les jours pleins | Le flux Google ICS renvoie beaucoup d'occupé | Décocher « Retirer l'occupé Google » pour tester, ou vérifier `availability.feedUrl` |
| Pas d'email de confirmation | `RESEND_API_KEY` manquant | Le RDV est **quand même** enregistré dans Sanity ; configurer Resend |
| Un créneau réservé reste proposé | Document `booking` en statut « Annulé », ou cache | Un RDV `confirmed` bloque ; l'endpoint dispo n'est pas caché (frais à chaque appel) |
| Double-booking | Deux POST quasi simultanés | Verrou Upstash + re-check Sanity ; sans Upstash configuré, seul le re-check protège |
| 429 à la réservation | Rate-limit IP (5/h) atteint | Attendre, ou passer par le formulaire de contact |
