# Calendrier public · Mise en place et exploitation

Ce document décrit comment activer et maintenir le calendrier public affiché
sur les pages produit (`/espace-emerainville`, `/mariage`, `/evenements-pro`)
et utilisé par le bouton « Vérifier la disponibilité ».

## Vue d'ensemble du pipeline

```
Google Calendar (Aïssa)
        │  events avec convention de titre
        ▼
URL ICS publique (secret iCal)
        │
        ▼ fetch toutes les 7h/12h/18h UTC
Vercel Cron → /api/cron/sync-availability
        │  parseICS → toBusyRanges
        ▼
Sanity (singleton `availability`)
        │  busyRanges[]
        ▼
Pages produit (Next.js, SSR)
        │  getStatusForDate() → free / option / booked / past
        ▼
Calendrier interactif (modale + NextSlots)
        │  clic sur date libre
        ▼
Calendly (préfilled avec la date sélectionnée)
```

Calendly et le calendrier public **partagent la même source de vérité Google
Calendar** : chaque réservation Calendly atterrit dans l'agenda, et le site
relit ce même agenda toutes les quelques heures pour afficher les statuts.

## 1. Créer l'agenda Google dédié

Dans Google Calendar (compte Aïssa) :

1. Menu de gauche → **Autres agendas** → **+** → **Créer un agenda**.
2. Nom : `Aïssa Events — Réservations`.
3. Fuseau : `Europe/Paris`.
4. Description (optionnel) : « Source de vérité pour le calendrier public du site. Tout ce qui est dans cet agenda y apparaît. »

Choisir une couleur dédiée pour distinguer visuellement les events de cet
agenda du reste.

> ⚠️ **Un seul agenda** pour le site, partagé par tous les types d'événements
> (mariage, pro, espace). Les distinctions sont faites via les tags dans les
> titres (voir convention plus bas), pas via plusieurs agendas.

## 2. Connecter Calendly à Google Calendar

Dans Calendly (compte `aissaeventscontact`) :

1. **Account → Calendar Connection** (https://calendly.com/app/calendar_connection).
2. **Add Calendar Connection → Google** → s'authentifier.
3. Régler les deux options distinctes :
   - **Check for conflicts** : cocher l'agenda `Aïssa Events — Réservations`. Cocher aussi l'agenda perso d'Aïssa si on veut éviter les double-bookings sur les RDV découverte (les détails perso ne sont jamais publiés).
   - **Add events to** : choisir l'agenda `Aïssa Events — Réservations`. Toutes les nouvelles réservations Calendly y atterriront.

## 3. Récupérer l'URL ICS secrète

Toujours dans Google Calendar :

1. Survoler `Aïssa Events — Réservations` dans la sidebar → **⋮** → **Paramètres et partage**.
2. Faire défiler jusqu'à **Intégrer le calendrier**.
3. Copier l'**URL secrète au format iCal** (se termine par `/basic.ics`).

> 🔒 **Cette URL est secrète mais publique** : toute personne qui l'a peut
> lire l'agenda complet. Ne pas la committer dans le repo. Elle vit
> uniquement dans Sanity (et dans le cache du cron).

## 4. Configurer Sanity

Dans le Studio (`/studio`) :

1. Ouvrir le document **« Disponibilités (calendrier) »**.
2. Onglet **Source Google Calendar** :
   - **Activer le calendrier public** : `true`
   - **URL ICS publique** : coller l'URL `/basic.ics` copiée à l'étape 3.
3. Onglet **Réglages d'affichage** (valeurs par défaut généralement OK) :
   - **Nombre de mois affichés par défaut** : `3`
   - **Durée par défaut d'une option (jours)** : `14`
   - **Repli : dates libres / année** : `12` / `2026` (affiché si la synchro est cassée).
4. **Publier**.

Tant que `feedUrl` est vide, le calendrier reste visible côté site mais
**toutes les dates apparaissent libres** — mode démo utile pour tester la
mise en page.

## 5. Variables d'environnement Vercel

Trois variables à configurer dans **Vercel → Project → Settings → Environment Variables** (Production + Preview) :

| Variable | Valeur | Rôle |
|---|---|---|
| `CRON_SECRET` | une chaîne aléatoire générée par `openssl rand -hex 32` | Authentifie les requêtes du cron de Vercel. Sans elle, le cron renvoie 401. |
| `NEXT_PUBLIC_CALENDLY_URL` | `https://calendly.com/aissaeventscontact` | URL de la fiche Calendly. Utilisée par `buildCalendlyUrl()` (avec UTM et `date` préfillée). |
| `SANITY_API_WRITE_TOKEN` | token Sanity « Editor » ou « Maintainer » | Permet au cron d'écrire les `busyRanges` dans Sanity. |

> Pour la prod, le cron Vercel n'a accès qu'aux variables **Production**.
> Pour tester en local, voir « Tester en local » plus bas.

## 6. Convention de saisie des events Google

Le **titre de l'event** détermine son statut et son type côté site. Tout le
reste (description, lieu) est ignoré.

### Statut (visible côté visiteur)

| Préfixe titre | Statut côté site | Affichage |
|---|---|---|
| (aucun) | `booked` | 🔴 Réservé — case grisée, non cliquable |
| `[option]` | `option` | 🟡 Option en cours — case ambre, expire après 14 j |
| `[option:YYYY-MM-DD]` | `option` | 🟡 Option — expire à cette date précise |

### Type (interne, jamais affiché)

Ajouter optionnellement un tag de type **après** le tag statut :

| Tag | Type interne (`kind`) |
|---|---|
| `[mariage]` ou `[wedding]` | `mariage` |
| `[pro]` ou `[corp]` | `pro` |
| `[salle]` ou `[venue]` | `salle` |
| `[perso]` ou `[prive]` | `perso` |

### Exemples

| Titre Google | Résultat |
|---|---|
| `Famille Bouali` | 🔴 Réservé, kind = unknown |
| `[mariage] Famille Bouali` | 🔴 Réservé, kind = mariage |
| `[option] Sarah & Yacine` | 🟡 Option (expire J+14), kind = unknown |
| `[option:2026-06-30][pro] Société X` | 🟡 Option jusqu'au 30 juin 2026, kind = pro |
| `[perso] Vacances` | 🔴 Réservé, kind = perso (Aïssa bloque sa dispo) |

> 💡 Pour bloquer un week-end sans qu'un nom apparaisse côté site, mettre
> juste `[perso]` ou `Indisponible`. Le visiteur ne voit que le statut, pas
> le titre.

### Granularité

Les events sont résolus **au jour près** : un event de 14h à 18h marque toute
la journée comme occupée. Pour bloquer plusieurs jours, créer un event
multi-jours.

## 7. Vérifier la première synchro

Après avoir configuré Sanity + variables Vercel :

1. **Déclencher le cron manuellement** depuis le terminal :

   ```bash
   curl -X GET \
     -H "Authorization: Bearer $CRON_SECRET" \
     https://aissaevents.fr/api/cron/sync-availability
   ```

   Réponse attendue : `{ "ok": true, "events": N, "ranges": N, "warnings": [] }`.

2. **Vérifier dans Sanity** : ouvrir le doc « Disponibilités », onglet
   **État de synchronisation** :
   - `Dernière synchronisation` : timestamp récent
   - `Statut` : OK
   - Onglet **Plages occupées** : doit lister les events parsés.

3. **Vérifier sur le site** : ouvrir `/espace-emerainville`, cliquer
   « Vérifier la disponibilité », vérifier que les dates bloquées dans
   Google apparaissent bien grisées / ambre.

## 8. Forcer une resynchronisation

Le cron tourne à 7h, 12h et 18h UTC (cf. `vercel.json`). Pour forcer une
synchro entre deux passages :

```bash
curl -X GET \
  -H "Authorization: Bearer $CRON_SECRET" \
  https://aissaevents.fr/api/cron/sync-availability
```

Note : Sanity met en cache les données (tag `availability`). Le cron
appelle `revalidateTag("availability")` après écriture, donc la prochaine
visite voit les données fraîches.

## 9. Tester en local

```bash
# 1. Renseigner .env.local
CRON_SECRET=<le même qu'en prod ou un local>
SANITY_API_WRITE_TOKEN=<token Sanity avec droit d'écriture>
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/aissaeventscontact

# 2. Lancer le dev
pnpm dev

# 3. Trigger le cron
curl -H "Authorization: Bearer $CRON_SECRET" \
  http://localhost:3000/api/cron/sync-availability
```

## 10. Troubleshooting

| Symptôme | Cause probable | Fix |
|---|---|---|
| Le cron renvoie 401 | `CRON_SECRET` mal configuré | Vérifier la variable dans Vercel + l'en-tête `Authorization: Bearer …` |
| `lastSyncStatus = error`, message « HTTP 404 » | URL ICS invalide / révoquée | Régénérer l'URL secrète dans Google (Paramètres calendrier → Réinitialiser les URL) et la coller dans Sanity. ⚠️ ça invalide toutes les anciennes URL. |
| `lastSyncStatus = ok`, mais 0 ranges | Calendrier vide ou tous les events sont dans le passé | Le parser ignore les events de plus de 7 jours dans le passé. Créer un test futur. |
| Les options n'expirent pas | Tag mal formé | Le format strict est `[option]` ou `[option:YYYY-MM-DD]` (avec crochets, minuscules, sans espace). |
| Le calendrier reste sur les fallbacks | `enabled = false` côté Sanity, ou `feedUrl` vide | Vérifier les deux dans le doc « Disponibilités ». |
| Une réservation Calendly n'apparaît pas | Calendly écrit dans le **mauvais agenda** | Vérifier dans Calendly → Calendar Connection → « Add events to » : doit être `Aïssa Events — Réservations`. |
| Double-booking Calendly | « Check for conflicts » ne lit pas tous les agendas pertinents | Cocher aussi l'agenda perso d'Aïssa dans Calendar Connection. |
| Les modifs côté Sanity n'apparaissent pas sur le site | Cache ISR Next.js | Le cron appelle déjà `revalidateTag`. Pour une modif manuelle, déclencher `POST /api/revalidate` avec le tag `availability`. |

## 11. Désactiver temporairement le calendrier

Dans Sanity → doc « Disponibilités » → décocher **Activer le calendrier public** → publier.

Effet : la section disponibilités disparaît côté site (et le bouton
« Vérifier la disponibilité » se retrouve sans cible — il faudra revoir le
CTA dans la section « Pas encore décidé ? » de la page espace).

## 12. Architecture · fichiers à connaître

- `sanity/schemas/singletons/availability.ts` — schéma Sanity du singleton
- `lib/availability.ts` — types + logique pure (`getStatusForDate`, `getNextFreeDates`)
- `lib/availability/server.ts` — fetcher Sanity (server-only)
- `lib/availability/ics-parser.ts` — parser ICS minimaliste + détection des tags
- `app/api/cron/sync-availability/route.ts` — handler cron Vercel
- `vercel.json` — schedule du cron
- `components/availability/section.tsx` — bloc UI inséré sur les pages produit
- `components/availability/dialog.tsx` — modale + event bus `open-availability-dialog`
- `components/availability/calendar.tsx` / `calendar-client.tsx` — vue 3 mois interactive
- `components/availability/next-slots.tsx` — pill des 3 prochaines dates libres
- `lib/calendly.ts` — `buildCalendlyUrl()` (UTM + date préfillée)
