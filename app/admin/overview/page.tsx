/* eslint-disable react/no-unescaped-entities -- page de doc 100% texte français : les apostrophes droites sont volontaires et lisibles dans la source. */
import Image from "next/image";
import type { Metadata } from "next";
import { VideoCard, type Tutorial } from "./video-card";

export const metadata: Metadata = {
  title: "Centre d'aide — Gérer ton site | Aïssa Events",
  description: "Guide complet pour gérer le site Aïssa Events.",
  robots: { index: false, follow: false },
};

const A = "/overview-assets";

const TUTORIALS: Tutorial[] = [
  {
    id: "tuto-page",
    number: "01",
    title: "Créer et modifier une page",
    description:
      "Changer un titre, un texte ou une photo sur une page existante (Accueil, Mariage, Espace Events…).",
    poster: `${A}/poster-page.jpg`,
    src: `${A}/videos/tuto-page.mp4`,
    captions: `${A}/videos/tuto-page.vtt`,
    steps: [
      "Barre de gauche → <b>Pages du site</b> → choisis la page (ex. <b>Accueil</b>).",
      "En haut, clique sur l'<b>onglet</b> de la partie à changer (ils sont numérotés dans l'ordre de la page).",
      "Clique dans le champ, efface l'ancien texte, écris le nouveau.",
      "Pour une photo : clique dessus → <b>Replace</b>, et remplis le <b>texte alternatif</b>.",
      "Clique sur <b>Publier</b> (en bas à droite). Rafraîchis le site : c'est changé.",
    ],
  },
  {
    id: "tuto-article",
    number: "02",
    title: "Écrire un article de blog",
    description:
      "Rédiger un nouvel article de A à Z : titre, image, contenu, et mise en ligne.",
    poster: `${A}/poster-article.jpg`,
    src: `${A}/videos/tuto-article.mp4`,
    captions: `${A}/videos/tuto-article.vtt`,
    steps: [
      "Barre de gauche → <b>Blog</b> → <b>Articles</b> → bouton <b>+</b>.",
      "Remplis le <b>Titre</b>, puis clique <b>Generate</b> à côté du <b>Slug</b> (adresse auto).",
      "Ajoute l'<b>Extrait</b> (résumé), l'<b>Image de couverture</b> et sa description.",
      "Choisis une <b>Catégorie</b> et la <b>Date de publication</b>.",
      "Écris le <b>Contenu</b> (titres, paragraphes, gras, listes, images).",
      "Clique sur <b>Publier</b>.",
    ],
  },
  {
    id: "tuto-ia",
    number: "03",
    title: "Générer un article avec l'assistant IA",
    description:
      "Laisser l'assistant te proposer un brouillon d'article à partir d'un simple sujet, puis le relire et le publier.",
    poster: `${A}/poster-ia.jpg`,
    src: `${A}/videos/tuto-ia.mp4`,
    captions: `${A}/videos/tuto-ia.vtt`,
    steps: [
      "Ouvre un article (ou crée-en un) dans <b>Blog → Articles</b>.",
      "Dans le menu d'actions de la fiche, clique sur <b>« Générer un article avec l'IA »</b>.",
      "Donne le <b>sujet</b> et les détails demandés, puis lance la génération.",
      "<b>Relis tout</b> et corrige : l'IA propose un point de départ, pas un texte final.",
      "Ajoute une vraie image de couverture, vérifie le titre, puis <b>Publie</b>.",
    ],
  },
  {
    id: "tuto-realisation",
    number: "04",
    title: "Ajouter une réalisation (avec galerie)",
    description:
      "Mettre en ligne un événement passé avec sa photo de couverture et une galerie complète.",
    poster: `${A}/poster-realisation.jpg`,
    src: `${A}/videos/tuto-realisation.mp4`,
    captions: `${A}/videos/tuto-realisation.vtt`,
    steps: [
      "Barre de gauche → <b>Réalisations</b> → bouton <b>+</b>.",
      "Remplis <b>Titre</b>, <b>Slug</b> (Generate), <b>Type d'événement</b> (range la réalisation dans le bon filtre).",
      "Ajoute la <b>Photo de couverture</b> (la vignette).",
      "Dans <b>Galerie complète</b> → <b>Add item</b> pour chaque photo. Glisse pour réordonner.",
      "Coche <b>Mis en avant</b> pour la faire passer en premier (optionnel).",
      "Clique sur <b>Publier</b>.",
    ],
  },
];

function Anchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-full border border-[var(--rule)] bg-cream-soft px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-bordeaux/40 hover:text-bordeaux"
    >
      {children}
    </a>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] border border-[var(--rule-soft)] bg-card-soft p-6 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

const SIDEBAR = [
  ["📄 Pages du site", "Les grandes pages : Accueil, Mariage, Événements pro, Espace Events, et les textes des pages Réalisations / Blog + les pages légales."],
  ["🖼️ Réalisations", "La liste de tes événements passés, avec photos et galeries. (Tutoriel 04.)"],
  ["⭐ Témoignages", "Les avis de tes clients affichés sur le site."],
  ["📦 Packs (formules)", "Tes formules de prix (Pack Célébration, Pack Fiesta…)."],
  ["🏷️ Services à la carte", "Les prestations individuelles."],
  ["❓ FAQ (questions)", "Les questions / réponses fréquentes."],
  ["🌍 Blog", "Tes articles (Tutoriels 02 et 03) et leurs catégories."],
  ["⚙️ Réglages du site", "Logo, email, téléphone, adresse, menu du haut, bas de page, réseaux sociaux. Visible partout sur le site."],
  ["🤖 Assistante virtuelle", "Réglages de l'assistante automatique (avancé, avec Be in Digital)."],
  ["📅 Disponibilités (calendrier)", "Le réglage du calendrier de disponibilités (voir plus bas)."],
];

const GLOSSARY = [
  ["Sanity / Studio", "Ton tableau de bord, là où tu modifies le contenu."],
  ["Vercel", "L'entreprise qui héberge (garde allumé) ton site."],
  ["Publier / Publish", "Rendre tes changements visibles sur le vrai site."],
  ["Brouillon / Draft", "Un changement pas encore publié, visible par toi seul."],
  ["Slug", "La fin de l'adresse d'une page (ex. .../mariage)."],
  ["Alt / Texte alternatif", "La description d'une image (pour Google et l'accessibilité)."],
  ["404", "Le code d'une page qui n'existe pas (« page introuvable »)."],
  ["SEO", "Tout ce qui aide Google à bien te placer dans les résultats."],
];

// Accès protégé en amont par `proxy.ts` (vérifie ?secret=ADMIN_OVERVIEW_SECRET).
export default function OverviewPage() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      {/* HERO */}
      <header className="border-b border-[var(--rule-soft)] bg-cream-soft px-6 py-16 sm:px-10 sm:py-20">
        <div className="mx-auto max-w-[1080px]">
          <p className="inline-flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-ink">
            <span className="size-2 animate-pulse rounded-full bg-bordeaux" />
            Centre d'aide · Espace privé
          </p>
          <h1
            className="mt-6 font-serif text-[40px] leading-[1.05] tracking-[-0.03em] sm:text-[56px]"
            style={{ fontWeight: 300 }}
          >
            Gérer ton site,{" "}
            <span className="italic text-bordeaux">pas à pas</span>.
          </h1>
          <p className="mt-5 max-w-[620px] text-[16px] leading-[1.7] text-ink-soft">
            Tout est ici : des vidéos qui montrent chaque geste, des exemples
            concrets, et un mode d'emploi clair. Aucune connaissance technique
            requise. Tu ne peux rien casser en modifiant du texte ou des photos,
            alors n'aie pas peur d'essayer.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Anchor href="#demarrer">Démarrer</Anchor>
            <Anchor href="#tutos">Vidéos</Anchor>
            <Anchor href="#tableau-de-bord">Le tableau de bord</Anchor>
            <Anchor href="#calendrier">Calendrier</Anchor>
            <Anchor href="#photos">Photos</Anchor>
            <Anchor href="#depannage">Dépannage</Anchor>
            <Anchor href="#glossaire">Glossaire</Anchor>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1080px] space-y-16 px-6 py-16 sm:px-10 sm:py-20">
        {/* DÉMARRER */}
        <section id="demarrer" className="scroll-mt-24">
          <h2 className="font-serif text-[32px] tracking-[-0.02em]" style={{ fontWeight: 300 }}>
            Démarrer en 3 minutes
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Card>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                Étape 1 · Se connecter
              </p>
              <h3 className="mt-2 font-serif text-[22px]" style={{ fontWeight: 400 }}>
                Ouvre ton tableau de bord
              </h3>
              <p className="mt-3 text-[14px] leading-[1.65] text-ink-soft">
                Va sur <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[12px]">aissaevents.com/studio</code>{" "}
                et connecte-toi avec ton compte (Google ou email). Mets cette
                adresse en favori, tu iras tout le temps dessus.
              </p>
              <div className="mt-5 overflow-hidden rounded-[14px] border border-[var(--rule-soft)]">
                <Image
                  src={`${A}/studio-login.png`}
                  alt="Écran de connexion du tableau de bord Sanity"
                  width={1440}
                  height={900}
                  className="w-full"
                />
              </div>
            </Card>

            <Card className="flex flex-col">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-bordeaux">
                Étape 2 · La règle d'or
              </p>
              <h3 className="mt-2 font-serif text-[22px]" style={{ fontWeight: 400 }}>
                Toujours cliquer sur « Publier »
              </h3>
              <p className="mt-3 text-[14px] leading-[1.65] text-ink-soft">
                Tant que tu n'as pas cliqué sur <b>Publier</b> (bouton en bas à
                droite), tes changements restent un brouillon visible par toi
                seul. Une fois publié, c'est en ligne en moins d'une minute.
              </p>
              <div className="mt-5 rounded-[14px] border border-dashed border-bordeaux/30 bg-bordeaux/5 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
                  ⚠️ L'erreur n°1
                </p>
                <p className="mt-2 text-[14px] leading-[1.6] text-ink">
                  « J'ai modifié mais ça n'apparaît pas. » → 9 fois sur 10, c'est
                  qu'on a <b>oublié de Publier</b>. Vérifie ça en premier, puis
                  rafraîchis la page du site (touche <b>F5</b>).
                </p>
              </div>
              <div className="mt-5 rounded-[14px] bg-ink/[0.03] p-5">
                <p className="text-[13px] leading-[1.6] text-ink-soft">
                  💾 Bonne nouvelle : Sanity sauvegarde ton brouillon tout seul.
                  Si ton ordinateur s'éteint, tu ne perds rien.
                </p>
              </div>
            </Card>
          </div>
        </section>

        {/* TUTORIELS VIDÉO */}
        <section id="tutos" className="scroll-mt-24 space-y-8">
          <div>
            <h2 className="font-serif text-[32px] tracking-[-0.02em]" style={{ fontWeight: 300 }}>
              Les vidéos (les gestes du quotidien)
            </h2>
            <p className="mt-3 max-w-[620px] text-[15px] leading-[1.7] text-ink-soft">
              Chaque vidéo montre la manipulation en vrai, avec les étapes
              écrites à côté. Regarde, puis fais pareil de ton côté.
            </p>
          </div>
          {TUTORIALS.map((t) => (
            <VideoCard key={t.id} tutorial={t} />
          ))}
        </section>

        {/* TABLEAU DE BORD */}
        <section id="tableau-de-bord" className="scroll-mt-24">
          <h2 className="font-serif text-[32px] tracking-[-0.02em]" style={{ fontWeight: 300 }}>
            Le tableau de bord, rubrique par rubrique
          </h2>
          <p className="mt-3 max-w-[620px] text-[15px] leading-[1.7] text-ink-soft">
            La barre de gauche du Studio est ton sommaire. Voici ce que contient
            chaque ligne, de haut en bas.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SIDEBAR.map(([title, desc]) => (
              <div
                key={title}
                className="rounded-[16px] border border-[var(--rule-soft)] bg-card-soft p-5"
              >
                <p className="font-serif text-[17px] text-ink" style={{ fontWeight: 500 }}>
                  {title}
                </p>
                <p className="mt-1.5 text-[13.5px] leading-[1.55] text-ink-soft">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CALENDRIER */}
        <section id="calendrier" className="scroll-mt-24">
          <h2 className="font-serif text-[32px] tracking-[-0.02em]" style={{ fontWeight: 300 }}>
            Le calendrier de disponibilités
          </h2>
          <Card className="mt-6">
            <p className="text-[14.5px] leading-[1.7] text-ink-soft">
              Magie : tu ne remplis pas le calendrier à la main. Il se synchronise
              tout seul avec <b>ton Google Agenda</b> (« Aïssa Events —
              Réservations »), plusieurs fois par jour. Pour bloquer une date, tu
              crées juste un événement dans cet agenda. Le <b>titre</b> décide de
              ce que voit le visiteur :
            </p>
            <div className="mt-5 overflow-hidden rounded-[14px] border border-[var(--rule-soft)]">
              <table className="w-full border-collapse text-left text-[13.5px]">
                <thead>
                  <tr className="bg-ink/[0.04] text-ink">
                    <th className="p-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                      Titre dans Google Agenda
                    </th>
                    <th className="p-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                      Ce que voit le visiteur
                    </th>
                  </tr>
                </thead>
                <tbody className="text-ink-soft">
                  <tr className="border-t border-[var(--rule-soft)]">
                    <td className="p-3"><code>Famille Bouali</code></td>
                    <td className="p-3">🔴 Réservé (date grisée)</td>
                  </tr>
                  <tr className="border-t border-[var(--rule-soft)]">
                    <td className="p-3"><code>[option] Sarah & Yacine</code></td>
                    <td className="p-3">🟡 Option en cours (ambre)</td>
                  </tr>
                  <tr className="border-t border-[var(--rule-soft)]">
                    <td className="p-3"><code>[perso] Vacances</code></td>
                    <td className="p-3">🔴 Réservé (le mot n'est pas visible)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[13px] leading-[1.6] text-ink-soft">
              Le visiteur ne voit jamais le titre, seulement la couleur. La mise
              à jour prend quelques heures (pas instantané). La connexion initiale
              de l'agenda est faite une seule fois par Be in Digital.
            </p>
          </Card>
        </section>

        {/* PHOTOS */}
        <section id="photos" className="scroll-mt-24">
          <h2 className="font-serif text-[32px] tracking-[-0.02em]" style={{ fontWeight: 300 }}>
            Bien préparer tes photos
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-sage">✅ À faire</p>
              <ul className="mt-3 space-y-2 text-[14px] leading-[1.6] text-ink-soft">
                <li>Format <b>.jpg</b> (photos) ou <b>.webp</b> (léger).</li>
                <li>Photos nettes, larges (au moins <b>1600 px</b> pour une couverture).</li>
                <li>Rester sous <b>1 Mo</b> par photo (un site rapide = mieux référencé).</li>
                <li>Toujours remplir le <b>texte alternatif</b>.</li>
              </ul>
            </Card>
            <Card>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">❌ À éviter</p>
              <ul className="mt-3 space-y-2 text-[14px] leading-[1.6] text-ink-soft">
                <li>Photos floues ou prises de très loin.</li>
                <li>Images énormes sorties de l'appareil (10 Mo) sans les réduire.</li>
                <li>Photos dont tu n'as pas les droits (trouvées sur Google).</li>
              </ul>
              <p className="mt-4 rounded-[12px] bg-ink/[0.03] p-4 text-[13px] leading-[1.55] text-ink-soft">
                🛠️ Pour alléger une photo en 30 s, sans logiciel :{" "}
                <b>squoosh.app</b> ou <b>tinypng.com</b>.
              </p>
            </Card>
          </div>
        </section>

        {/* DÉPANNAGE */}
        <section id="depannage" className="scroll-mt-24">
          <h2 className="font-serif text-[32px] tracking-[-0.02em]" style={{ fontWeight: 300 }}>
            Quand ça coince
          </h2>
          <div className="mt-6 space-y-3">
            {[
              ["« Ma modif n'apparaît pas. »", "1) As-tu cliqué sur Publier ? 2) Rafraîchis (F5). 3) Attends 1-2 min. Toujours rien ? Contacte Be in Digital."],
              ["« J'ai supprimé un truc par erreur ! »", "Pas encore publié : ferme l'onglet, rien n'est perdu. Déjà publié : utilise l'« History » (horloge, en haut de la fiche) pour revenir en arrière. Sinon, on récupère."],
              ["« Une image ne s'affiche pas. »", "Vérifie que tu as publié, et que l'image n'est pas trop lourde / au bon format (.jpg, .png, .webp)."],
              ["« Le calendrier n'affiche pas les bonnes dates. »", "Il se met à jour quelques heures après une modif dans Google Agenda. Vérifie que l'événement est dans le bon agenda."],
            ].map(([q, a]) => (
              <details
                key={q}
                className="group rounded-[16px] border border-[var(--rule-soft)] bg-card-soft p-5"
              >
                <summary className="cursor-pointer list-none font-serif text-[17px] text-ink marker:hidden">
                  <span className="mr-2 text-bordeaux">›</span>
                  {q}
                </summary>
                <p className="mt-3 pl-5 text-[14px] leading-[1.6] text-ink-soft">{a}</p>
              </details>
            ))}
          </div>

          <div className="mt-6 rounded-[16px] border border-dashed border-bordeaux/30 bg-bordeaux/5 p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
              🚫 À ne jamais toucher
            </p>
            <p className="mt-2 text-[14px] leading-[1.6] text-ink">
              Les clés / tokens / variables (sur Vercel), le code du site, la
              mention « Powered by Be in Digital », et le <b>Slug</b> d'une page
              déjà partagée. Dans le doute : demande d'abord.
            </p>
          </div>
        </section>

        {/* GLOSSAIRE */}
        <section id="glossaire" className="scroll-mt-24">
          <h2 className="font-serif text-[32px] tracking-[-0.02em]" style={{ fontWeight: 300 }}>
            Glossaire
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {GLOSSARY.map(([term, def]) => (
              <div key={term} className="rounded-[14px] border border-[var(--rule-soft)] bg-card-soft p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-bordeaux">{term}</p>
                <p className="mt-1 text-[13.5px] leading-[1.5] text-ink-soft">{def}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="rounded-[24px] bg-plum px-8 py-12 text-center text-cream">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-soft">
            Besoin d'aide ?
          </p>
          <h2 className="mt-3 font-serif text-[28px]" style={{ fontWeight: 300 }}>
            On est là.
          </h2>
          <p className="mx-auto mt-3 max-w-[440px] text-[14.5px] leading-[1.65] text-cream/75">
            Bloquée, ou envie d'ajouter une fonctionnalité ? Contacte Be in
            Digital. Dis-nous ce que tu voulais faire, ce qui s'est passé, et
            joins une capture d'écran si possible. Il n'y a pas de question bête.
          </p>
        </section>
      </div>

      <footer className="border-t border-[var(--rule-soft)] px-6 py-8 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-ink">
          Centre d'aide Aïssa Events · réalisé par Be in Digital
        </p>
      </footer>
    </main>
  );
}
