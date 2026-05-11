# DESIGN.md — Aïssa Events

## 1. Vision générale

Créer le site web haut de gamme, éditorial et très élégant d'**Aïssa Events** — agence d'événementiel multi-spécialiste basée à Émerainville (77). La marque s'articule autour de trois univers complémentaires :

- **Mariages & cérémonies** — wedding planner premium en Île-de-France ;
- **Événements professionnels & célébrations privées** — soirées corporate, anniversaires, soirées signature ;
- **Espace Events Émerainville** — lieu de réception privatisable en Seine-et-Marne.

Le site est composé d'une **landing principale unifiée**, de trois pages de service dédiées (`/mariage`, `/evenement`, `/espace-emerainville`), d'une galerie `/realisations`, d'un blog actif au lancement et des pages légales.

Le rendu doit évoquer :
- le luxe discret ;
- la douceur ;
- l'élégance florale ;
- l'univers mariage / réception ;
- une expérience sur-mesure ;
- une marque premium, rassurante et artistique.

Le site doit être très proche du design Figma fourni : fond crème, typographie serif élégante, touches violet prune profond, accents dorés, grandes photos événementielles, cartes arrondies, beaucoup d'espace blanc, sections alternées claires et sombres.

---

## 2. Direction artistique

### Style visuel

Le style est **premium, doux, féminin, raffiné et institutionnel**.

Inspiration :
- maison événementielle haut de gamme ;
- magazine de mariage ;
- direction artistique florale ;
- portfolio premium ;
- site vitrine de wedding designer / event designer.

Le design ne doit pas être trop "template". Il doit paraître conçu sur mesure.

### Atmosphère

- Crème, chaleureux, lumineux.
- Violet prune profond pour créer du contraste et du prestige.
- Doré doux pour les CTA et les détails premium.
- Photographies élégantes, naturelles, avec lumière douce.
- Mise en page très espacée, calme, respirante.

### À éviter

- Ne pas faire un design trop corporate.
- Ne pas utiliser de couleurs flashy.
- Ne pas utiliser de typographie basique pour les titres.
- Ne pas surcharger les sections.
- Ne pas faire un rendu "IA" ou générique.
- Ne pas utiliser de grosses ombres modernes trop visibles.

---

## 3. Palette de couleurs

Utiliser une palette proche de celle-ci :

```css
:root {
  --color-bg: #F4EDE5;
  --color-bg-soft: #FAF5EF;
  --color-bg-alt: #EFE5DA;

  --color-ink: #2C1F33;
  --color-ink-soft: #5F515F;
  --color-muted: #8A7A6F;

  --color-plum: #2C1F33;
  --color-plum-deep: #24172B;
  --color-plum-card: #33223C;

  --color-gold: #B8924E;
  --color-gold-soft: #D6BA76;

  --color-border: #E4D7CB;
  --color-card: #FFF9F2;
  --color-white: #FFFFFF;
}
```

### Usage

- **Fond principal** : `#F4EDE5`
- **Sections très claires** : `#FAF5EF`
- **Texte principal** : `#2C1F33`
- **Texte secondaire** : `#8A7A6F`
- **CTA principal / sections sombres** : `#2C1F33`
- **Accent premium** : `#B8924E`
- **Bordures** : `#E4D7CB`

### Accent végétal — Sage (usage strict)

```css
--sage: #4A5D3E;        /* sauge profond */
--sage-soft: #7B8C5C;   /* sauge clair, peu utilisé */
```

Le **sage** est un accent végétal exceptionnel ajouté à la palette pour répondre au brief client (vert demandé). Il est volontairement **réservé aux contextes nature / bohème / plein air** — il n'est ni une 3e couleur principale, ni un remplaçant du bordeaux.

**Usages autorisés** :
- Thème *Bohème* dans la section thèmes mariage (badge "Végétal" + titre + hover border).
- 4e cérémonie *"Cérémonie laïque & plein air"* dans la section multi-cérémonies (num + italique + hover border).
- Filtre *"Plein air"* dans la galerie réalisations (badge actif + hover border).

**Interdits explicites** :
- ❌ Ne jamais utiliser le sage pour un CTA principal (toujours bordeaux ou or).
- ❌ Ne jamais remplacer un eyebrow dot pulsant bordeaux par du sage.
- ❌ Ne pas étendre l'usage aux pages `/evenement`, `/espace-emerainville`, `/blog` (univers business / lieu — ils restent en bordeaux/or pur).
- ❌ Ne pas créer de fond pleine page sage. Le sage reste un accent ponctuel sur fond cream.

**Pourquoi cette discipline** : la palette cream/plum/bordeaux/or est l'identité signature. Le sage la complète sans la diluer, à condition qu'il garde sa charge sémantique ("nature / végétal / plein air").

---

## 4. Typographies

### Titres

Utiliser une serif éditoriale très élégante.

Recommandations :
- `Cormorant Garamond`
- `Playfair Display`
- `Bodoni Moda`
- `Libre Baskerville`
- ou une police premium type Editorial New / Roslindale si disponible.

Les titres doivent être fins, hauts de gamme, avec des italiques expressives.

Exemple :

```css
font-family: "Cormorant Garamond", serif;
font-weight: 400;
letter-spacing: -0.04em;
line-height: 0.92;
```

Les mots importants peuvent être en italique :

```css
font-style: italic;
font-weight: 400;
```

### Texte courant

Utiliser une sans-serif propre, discrète et lisible.

Recommandations :
- `Inter`
- `Satoshi`
- `Manrope`
- `DM Sans`

Exemple :

```css
font-family: "Inter", sans-serif;
font-size: 14px;
line-height: 1.7;
```

### Style global

- Titres : très grands, fins, élégants.
- Paragraphes : petits, discrets, espacés.
- Boutons : petits, uppercase, tracking large.
- Eyebrows : uppercase, petit corps, letter-spacing important.

---

## 5. Layout global

### Container

```css
max-width: 1180px;
margin-inline: auto;
padding-inline: 24px;
```

Sur desktop, utiliser une grille 12 colonnes.

### Espacement

- Sections principales : `96px` à `128px` de padding vertical.
- Petites sections CTA : `56px` à `72px`.
- Espacement entre titres et paragraphes : `20px` à `32px`.
- Espacement entre cartes : `20px` à `28px`.

### Radius

```css
--radius-card: 18px;
--radius-large: 28px;
--radius-pill: 999px;
```

### Bordures

Les cartes doivent avoir une bordure très fine et subtile :

```css
border: 1px solid rgba(44, 31, 51, 0.10);
```
