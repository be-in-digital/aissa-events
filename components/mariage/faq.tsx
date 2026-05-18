"use client";

import { MotionConfig, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { Eyebrow } from "@/components/home/eyebrow";
import { RichText } from "@/components/site/portable-text";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { MariagePageQueryResult } from "@/sanity.types";

type FaqData = NonNullable<MariagePageQueryResult>["faq"];

const FALLBACK_EYEBROW = "Questions fréquentes · wedding planning";
const FALLBACK_TITLE = "Les questions\n_qu'on nous pose._";
const FALLBACK_INTRO =
  "Celles qui reviennent vraiment au téléphone, dans l'ordre où on les entend. Si la vôtre n'y est pas, écrivez-nous : on répond en moins de 24h, souvent le soir même.";

const FALLBACK_ITEMS = [
  {
    q: "Êtes-vous présente le jour J ?",
    a: "Oui, toujours. Aïssa arrive avec les coiffeuses le matin et part après les derniers invités, avec au moins une coordinatrice à ses côtés. La personne qui vous a fait visiter le lieu, c'est aussi celle qui ira chercher la bouteille de champagne oubliée à 21h. Pas de commercial qui vous lâche dès la signature.",
  },
  {
    q: "Êtes-vous habilitée pour les cérémonies religieuses (musulmane, chrétienne, juive…) ?",
    a: "Non, et heureusement : ce n'est pas notre métier. C'est l'imam, le prêtre, le rabbin, le pasteur ou l'officiant laïque qui célèbre. Nous, on trouve le bon officiant (on en a vu défiler beaucoup, on sait qui parle bien et qui endort la salle), on cale la déco aux codes, on gère le timing entre les familles, et on évite que la belle-mère et la tante de Tunis ne se croisent au mauvais moment.",
  },
  {
    q: "Travaillez-vous avec des traiteurs halal, casher ou végétariens ?",
    a: "Oui. Halal, casher, végé, vegan, sans gluten : on a des traiteurs sous contrat dans chaque case, parce qu'on s'est cassé les dents au début à chercher dans l'urgence. Tarifs négociés, qualité testée par nos soins (on goûte avant de référencer), de 30 à 300+ couverts. Vous pouvez aussi imposer le traiteur de la famille, ça nous va ; on bosse avec lui en bonne intelligence.",
  },
  {
    q: "Combien de mariages organisez-vous par an ?",
    a: "Entre 12 et 15 organisations complètes, plus 8 à 10 coordinations à la carte. On plafonne volontairement, parce qu'au-delà Aïssa ne peut plus tenir la promesse d'être présente sur chaque dossier. Ça veut aussi dire qu'à partir de février, les samedis de juin sont souvent partis. Si vous visez juin-septembre, écrivez tôt.",
  },
  {
    q: "Pour quand faut-il vous contacter ?",
    a: "9 à 12 mois avant pour une organisation complète, surtout pour les samedis entre mai et septembre. Coordination jour J ou à la carte, 4 à 6 mois suffisent. Au-delà de 12 mois c'est très bien aussi : ça veut juste dire qu'on a le temps de faire les choses sans courir.",
  },
  {
    q: "Que se passe-t-il si Aïssa tombe malade le jour J ?",
    a: "C'est arrivé une fois, en 2023, gastro carabinée la veille. Le mariage s'est très bien passé : la coordinatrice avait le dossier en main depuis des mois, le timing minute par minute, les portables des prestataires, le plan B pluie. Chaque dossier est documenté à ce niveau, et on a un binôme de coordination prévu pour chaque date. Aucun mariage ne tient à une seule personne.",
  },
  {
    q: "Combien de rendez-vous avant le jour J ?",
    a: "Organisation complète : un RDV découverte offert, puis 4 à 6 RDV en physique étalés sur l'année, et autant d'appels visio ou téléphone que nécessaire (parfois deux par semaine sur les derniers mois). Coordination jour J : 2 RDV plus une visite technique sur le lieu, pour repérer où sont les prises et combien de temps prend l'ascenseur de service.",
  },
  {
    q: "Dans quelles régions intervenez-vous ?",
    a: "Île-de-France toute l'année, on est basés à Émerainville (77). Au-delà : Normandie, Picardie, Centre, Bourgogne sur les projets qui le justifient. France entière possible (on a fait Marseille et Strasbourg), mais avec frais de déplacement et hébergement à votre charge. C'est précisé dès le devis pour éviter les mauvaises surprises plus tard.",
  },
  {
    q: "Que comprend exactement la « coordination jour J » ?",
    a: "Aïssa et une coordinatrice de 8h à 23h. Avant ça : deux briefings prestataires (téléphone et mail), repérage du lieu, retroplanning de la journée. Le jour même : accueil des invités, gestion du timing, transitions cérémonie/cocktail/repas/soirée, accrochage des problèmes au passage (le DJ qui a oublié son câble, l'officiant en retard), démontage. Vous arrivez avec un mariage déjà ficelé, on prend les commandes.",
  },
  {
    q: "Avez-vous des prestataires partenaires obligatoires ?",
    a: "Aucun. Personne ne nous paie de commission, on ne dépend de personne. Notre réseau est là si vous voulez gagner du temps (tarifs négociés à force de revenir), mais vous pouvez très bien arriver avec votre photographe de cousin et votre traiteur de quartier : on bosse avec eux. Mix possible aussi, c'est même fréquent.",
  },
  {
    q: "Quelle est la politique d'annulation ?",
    a: "Acompte de 50 % non remboursable, mais reportable une fois dans les 12 mois (sous réserve qu'on ait la date). Le solde versé 15 jours avant le mariage n'est plus remboursable, parce qu'à ce stade les prestataires sont payés, le lieu est bloqué, on ne peut plus reculer. Force majeure (deuil, hospitalisation grave) : on regarde au cas par cas, on n'a jamais laissé personne dans le mur.",
  },
  {
    q: "Peut-on faire un mariage économique avec vous ?",
    a: "Oui, sans gêne. Le pack Espace Events à 1 250 € + coordination jour J à 800 € (env. 2 050 € hors traiteur) reste l'une des formules les plus accessibles d'Île-de-France pour 50 invités. Si votre budget est limité, dites-le franchement au premier RDV : on vous oriente vers ce qui rentre, on ne pousse pas à l'option supérieure pour gonfler la facture.",
  },
];

export function MariageFaq({ data }: { data?: FaqData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;

  const sanityItems = data?.items ?? [];
  // Build items as union of {q: string, a: string | blockContent}
  const items: { q: string; a: string | unknown }[] = sanityItems.length
    ? sanityItems.map((item) => ({
        q: item.question ?? "",
        a: item.answer ?? "",
      }))
    : FALLBACK_ITEMS;

  return (
    <MotionConfig reducedMotion="user">
      <section id="faq-mariage" className="relative bg-cream py-28 sm:py-36">
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
                  value={`mariage-${i}`}
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
    </MotionConfig>
  );
}
