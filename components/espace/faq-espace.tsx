"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type FaqData = NonNullable<EspaceEventsPageQueryResult>["faq"];

const FALLBACK_EYEBROW = "Questions sur le lieu";
const FALLBACK_TITLE = "Tout ce qu'on\nvous a déjà _demandé._";
const FALLBACK_INTRO =
  "Traiteur, parking, capacité, annulation, horaires : les questions qui reviennent au téléphone. Si la vôtre n'y est pas, écrivez-nous.";

const FALLBACK_ITEMS = [
  {
    q: "Peut-on amener son propre traiteur ?",
    a: "Oui. La cuisine équipée (frigo, plan de travail, point d'eau) est à disposition de votre traiteur. Pas de cuisine pro, mais largement de quoi finir et servir. Si vous préférez, on a aussi des traiteurs partenaires — tarifs négociés.",
  },
  {
    q: "Quelle est la capacité maximale ?",
    a: "50 personnes en cérémonie assise, jusqu'à 60 en debout (cocktail / soirée). Au-delà, on peut vous orienter vers des lieux partenaires en Île-de-France via le service Mariages ou Événements pro.",
  },
  {
    q: "Y a-t-il un parking sur place ?",
    a: "Stationnement gratuit dans la rue (35 Bd de Beaubourg, 77184 Émerainville). Plusieurs parkings publics à moins de 200 m. Émerainville-Pontault est à 25 min de Paris en RER E, accès direct A4.",
  },
  {
    q: "Quelle est la politique d'annulation ?",
    a: "Acompte 50 % non remboursable mais reportable une fois sur 12 mois (sous réserve de disponibilité). Le solde réglé 15 jours avant n'est plus remboursable. En cas de force majeure (deuil, hospitalisation), on étudie chaque cas au cas par cas.",
  },
  {
    q: "Le lieu est-il accessible aux personnes à mobilité réduite ?",
    a: "Oui : entrée de plain-pied, salle principale et terrasse accessibles, sanitaires PMR sur place. Si vous avez un besoin spécifique (rampe, espace dédié, accompagnement), précisez-le au devis.",
  },
  {
    q: "Peut-on visiter avant de réserver ?",
    a: "Oui, on recommande même la visite avant de signer. Gratuit, 30-45 min, sur rendez-vous. Aïssa vous fait passer dans toutes les configurations et répond aux questions concrètes (mobilier dispo, options déco, prestataires).",
  },
  {
    q: "Quels sont les horaires d'événement ?",
    a: "Lundi-jeudi 18h-22h, vendredi 17h-5h, samedi 12h-3h ou 15h-5h, dimanche 10h-22h. Heure supplémentaire à 100 €. Fermeture stricte à 5h pour le voisinage — l'after-party peut se faire en lieu partenaire.",
  },
  {
    q: "Pour quand faut-il réserver ?",
    a: "3 à 6 mois avant pour les samedis (mai à septembre = haute saison). En semaine et en hiver, on prend des projets à 4-6 semaines. La date n'est bloquée qu'à réception de l'acompte.",
  },
];

export function FaqEspace({ data }: { data?: FaqData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;

  const sanityItems = data?.items ?? [];
  const useFallback = sanityItems.length === 0;

  return (
    <section id="faq-espace" className="relative py-28 sm:py-36">
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
            {useFallback
              ? FALLBACK_ITEMS.map((item, i) => (
                  <AccordionPrimitive.Item
                    key={item.q}
                    value={`espace-${i}`}
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
                        <p className="max-w-[720px] text-[15px] leading-[1.75] text-ink-soft sm:text-[16px]">
                          {item.a}
                        </p>
                      </div>
                    </AccordionPrimitive.Panel>
                  </AccordionPrimitive.Item>
                ))
              : sanityItems.map((item, i) => (
                  <AccordionPrimitive.Item
                    key={item?._id ?? i}
                    value={`espace-${i}`}
                    className="border-b border-[var(--rule)] last:border-b-0"
                  >
                    <AccordionPrimitive.Header className="flex">
                      <AccordionPrimitive.Trigger className="group/trigger flex w-full items-start justify-between gap-6 px-7 py-6 text-left transition-colors hover:bg-cream focus:outline-none sm:px-9 sm:py-7">
                        <span
                          className="font-serif text-[18px] leading-[1.35] tracking-[-0.01em] text-ink sm:text-[21px]"
                          style={{ fontWeight: 400 }}
                        >
                          {item?.question}
                        </span>
                        <Plus
                          className="mt-1 size-5 shrink-0 text-bordeaux transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-aria-expanded/trigger:rotate-45"
                          strokeWidth={1.5}
                        />
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>
                    <AccordionPrimitive.Panel className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up">
                      <div className="h-(--accordion-panel-height) px-7 pb-7 sm:px-9 sm:pb-8">
                        {item?.answer && (
                          <div className="max-w-[720px] space-y-3 text-[15px] leading-[1.75] text-ink-soft sm:text-[16px]">
                            <PortableText value={item.answer} />
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
