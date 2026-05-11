"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Eyebrow } from "@/components/home/eyebrow";
import { RichText } from "@/components/site/portable-text";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EvenementPageQueryResult } from "@/sanity.types";

type FaqData = NonNullable<EvenementPageQueryResult>["faq"];

const FALLBACK_EYEBROW = "Questions B2B";
const FALLBACK_TITLE = "Tout ce qu'un\n_acheteur pose._";
const FALLBACK_INTRO =
  "Facturation, NDA, sécurité ERP, droits photo, secteurs servis, délais. Les vraies questions des Heads of Marketing, COO, Office Managers et Procurement, regroupées ici.";

const FALLBACK_ITEMS = [
  {
    q: "Comment fonctionne la facturation entreprise ?",
    a: "Facturation à votre raison sociale avec SIRET et TVA, conforme aux obligations comptables (NF, mention légales, RCS). Acompte 50 % à la signature, solde à 15 j avant l'événement par défaut. Paiement à 30 j possible sur dossier (sous réserve d'accord).",
  },
  {
    q: "Travaillez-vous sous NDA / accord de confidentialité ?",
    a: "Oui, systématiquement pour les lancements sous embargo, soirées concours-related ou événements VIP. Un NDA standard peut être signé dans les 24 h, ou nous adaptons à votre modèle juridique. Aucun visuel ni mention publique de l'événement sans validation écrite préalable.",
  },
  {
    q: "Pouvez-vous gérer la sécurité incendie / ERP / agents de sécurité ?",
    a: "Oui. Nous travaillons avec des partenaires sécurité diplômés (CQP APS, SSIAP) et pouvons monter le dossier de sécurité (ERP type L, T, P selon le format) si le lieu l'exige. Nous coordonnons avec le service prévention de votre lieu si applicable.",
  },
  {
    q: "Qui possède les droits sur les photos / vidéos de l'événement ?",
    a: "Par défaut, vous récupérez l'usage interne et com (LinkedIn, intranet, site, réseaux). Aïssa Events conserve un droit d'usage pour son portfolio (sauf clause d'exclusivité explicite). Pour les collaborateurs en photo : nous gérons les autorisations RGPD via formulaire d'accueil signé.",
  },
  {
    q: "Quels secteurs avez-vous déjà servis ?",
    a: "Luxe & mode, banque privée & finance, tech & start-up, conseil & cabinets, agences créatives, médias & édition. Nous adaptons le ton et l'esthétique à votre univers : nos productions luxe ne ressemblent pas à nos productions tech, et c'est volontaire.",
  },
  {
    q: "Quel est le délai pour réserver ?",
    a: "Idéal : 8 à 12 semaines pour un événement 100+ pers, 4 à 6 semaines pour un afterwork 30-50 pers. Pour les projets en urgence (4 semaines voire moins), c'est possible avec un brief clair et un budget légèrement majoré (rush prestataires). Réponse à votre demande sous 48 h ouvrées.",
  },
  {
    q: "Êtes-vous engagés en moyens ou en résultats ?",
    a: "Engagement de moyens. Nous garantissons l'exécution du périmètre contractuel (équipe, planning, livrables) avec une exigence de qualité. Les résultats business (NPS clients, conversions, lead gen) sont liés à votre brief : nous co-construisons les KPI et fournissons un debrief structuré.",
  },
  {
    q: "Travaillez-vous avec des marques en concurrence ?",
    a: "Si vous travaillez dans un secteur sensible (concurrence directe), une clause d'exclusivité géographique et temporelle peut être négociée. Hors clause, nous pouvons travailler avec plusieurs marques d'un même secteur. Chaque projet est cloisonné, équipes confidentialisées.",
  },
  {
    q: "Pouvez-vous vous déplacer hors Île-de-France ?",
    a: "Oui, France entière sur les projets qui le justifient (séminaires multi-jours en région, lancements internationaux). Frais de déplacement et hébergement à votre charge en sus du devis. Précisez la zone dès le brief pour qu'on cale le périmètre.",
  },
  {
    q: "Pouvez-vous gérer un événement multi-jours / multi-lieux ?",
    a: "Oui. Convention 2 jours plénière + 1 soirée, séminaire mobile (3 lieux différents), tournée client multi-villes : c'est exactement le type de projet où une coordination centralisée chez nous ajoute le plus de valeur (un seul rétroplanning, un seul interlocuteur sur 3 villes).",
  },
  {
    q: "Comment gérez-vous la sous-traitance des prestataires ?",
    a: "Aïssa pilote la direction artistique et la coordination en direct, épaulée par deux alternants en production. Pour le reste (DJ, scénographie technique, sécurité, traiteur, photo, vidéo, fleurs, hôtesses), nous activons un réseau de partenaires franciliens dont nous portons la responsabilité contractuelle vis-à-vis de vous.",
  },
  {
    q: "Quel format de brief vous est le plus utile ?",
    a: "Idéal : note de 1-2 pages avec objectif, public cible, image / atmosphère, budget cadre, contraintes (lieu, dates, nombre invités). Mais on peut aussi partir d'un échange oral de 30 min, c'est même souvent plus efficace pour les briefs créatifs.",
  },
];

export function EvenementFaq({ data }: { data?: FaqData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;

  const sanityItems = data?.items ?? [];
  const items: { q: string; a: string | unknown }[] = sanityItems.length
    ? sanityItems.map((item) => ({
        q: item.question ?? "",
        a: item.answer ?? "",
      }))
    : FALLBACK_ITEMS;

  return (
    <section
      id="faq-pro"
      className="relative bg-cream py-28 sm:py-36"
    >
      <div className="mx-auto max-w-[1180px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 grid items-end gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20"
        >
          <div>
            <div className="mb-6">
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
            <h2
              className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
              style={{ fontWeight: 300 }}
            >
              {title.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {renderInlineItalic(line)}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>
          </div>
          <p
            className="max-w-md font-serif text-[17px] italic leading-[1.55] text-ink-soft sm:text-[19px]"
            style={{ fontWeight: 300 }}
          >
            {FALLBACK_INTRO}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <AccordionPrimitive.Root className="flex w-full flex-col overflow-hidden rounded-[24px] border border-[var(--rule)] bg-cream-soft">
            {items.map((item, i) => (
              <AccordionPrimitive.Item
                key={`${item.q}-${i}`}
                value={`pro-${i}`}
                className="border-b border-[var(--rule)] last:border-b-0"
              >
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="group/trigger flex w-full items-start justify-between gap-6 px-7 py-6 text-left transition-colors hover:bg-cream focus:outline-none sm:px-9 sm:py-7">
                    <span
                      className="font-serif text-[18px] leading-[1.35] tracking-[-0.01em] text-ink sm:text-[21px]"
                      style={{ fontWeight: 400 }}
                    >
                      {item.q}
                    </span>
                    <Plus
                      className="mt-1 size-5 shrink-0 text-bordeaux transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-aria-expanded/trigger:rotate-45"
                      strokeWidth={1.5}
                    />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Panel className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up">
                  <div className="h-(--accordion-panel-height) px-7 pb-7 sm:px-9 sm:pb-8">
                    {typeof item.a === "string" ? (
                      <p className="max-w-[780px] text-[15px] leading-[1.75] text-ink-soft sm:text-[16px]">
                        {item.a}
                      </p>
                    ) : (
                      <div className="max-w-[780px] text-[15px] leading-[1.75] text-ink-soft sm:text-[16px]">
                        <RichText value={item.a} />
                      </div>
                    )}
                  </div>
                </AccordionPrimitive.Panel>
              </AccordionPrimitive.Item>
            ))}
          </AccordionPrimitive.Root>
        </motion.div>
      </div>
    </section>
  );
}
