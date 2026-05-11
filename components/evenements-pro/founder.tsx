"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Disc3, Lightbulb, Megaphone, ShieldCheck } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { EVENEMENT_IMAGES } from "@/lib/images";
import { urlForImageString } from "@/lib/sanity/image";
import type { SiteSettingsQueryResult } from "@/sanity.types";

type Founder = NonNullable<SiteSettingsQueryResult>["founder"];

const TEAM = [
  {
    Icon: Megaphone,
    label: "Direction artistique",
    sub: "Aïssa · brand alignment",
  },
  {
    Icon: Disc3,
    label: "DJ & programmation",
    sub: "Réseau in-house · live & set",
  },
  {
    Icon: Lightbulb,
    label: "Scénographie & lumière",
    sub: "Régie son · light · stage",
  },
  {
    Icon: ShieldCheck,
    label: "Production & sécurité",
    sub: "Partenaires · staff · sécu · logistique",
  },
];

export function EvenementFounder({ founder }: { founder?: Founder }) {
  const photo = founder?.photo;
  const imageUrl = photo?.asset
    ? urlForImageString(photo, { width: 1200, quality: 85 })
    : EVENEMENT_IMAGES.founder;
  const imageAlt =
    photo?.alt ?? "Aïssa & l'équipe Aïssa Events en production événementielle";

  return (
    <section className="relative bg-cream py-28 sm:py-36">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <div className="grid items-center gap-14 lg:grid-cols-[5fr_6fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] shadow-[0_30px_80px_rgba(44,31,51,0.12)]"
          >
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              style={{ filter: "contrast(1.06) saturate(0.95) sepia(0.05)" }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4"
            >
              <div>
                <p className="font-script text-[42px] leading-none text-cream">
                  Aïssa &amp; team
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/85">
                  Direction artistique pro
                </p>
              </div>
              <span className="rounded-full bg-cream/95 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-bordeaux backdrop-blur-sm">
                DNA Art Academy
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6">
              <Eyebrow>L&apos;équipe pro</Eyebrow>
            </div>
            <h2
              className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[52px] lg:text-[68px]"
              style={{ fontWeight: 300 }}
            >
              ADN Art Academy,
              <br />
              <em className="italic text-bordeaux">exécution</em>
              <br />
              événementielle.
            </h2>

            <div className="mt-8 space-y-5 text-[16px] leading-[1.8] text-ink-soft">
              {founder?.bio && founder.bio.length > 0 ? (
                <PortableText value={founder.bio} />
              ) : (
                <>
                  <p>
                    Aïssa Events est née au sein d&apos;
                    <strong className="font-medium text-ink">Art Academy</strong>,
                    au contact direct des artistes et de la production live. Sur un
                    événement de marque, ça change la lecture du brief : ce
                    qu&apos;on veut qu&apos;il en reste, comment la salle réagit, ce
                    que la captation pourra réutiliser ensuite.
                  </p>
                  <p>
                    Aïssa est seule à temps plein, épaulée par deux alternants en
                    production. Sur les briques spécialisées (sécurité, traiteur,
                    photo, vidéo, fleurs), nous activons un réseau de partenaires
                    franciliens dont nous portons la responsabilité contractuelle.
                    Tarifs négociés, qualité validée sur nos productions précédentes.
                  </p>
                  <p>
                    Aïssa pilote chaque projet du brief au debrief.{" "}
                    <strong className="font-medium text-ink">
                      Un seul interlocuteur, un seul fil
                    </strong>
                    , c&apos;est ce qui tient en B2B quand les marges d&apos;erreur
                    sont fines (lancement sous embargo, dirigeant à l&apos;agenda
                    serré, presse en salle).
                  </p>
                </>
              )}
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {TEAM.map(({ Icon, label, sub }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.35 + i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="rounded-[18px] border border-[var(--rule)] bg-cream-soft p-5"
                >
                  <span className="grid size-9 place-items-center rounded-full border border-bordeaux/20 bg-cream text-bordeaux">
                    <Icon className="size-[16px]" strokeWidth={1.5} />
                  </span>
                  <p
                    className="mt-3 font-mono text-[10.5px] uppercase leading-[1.4] tracking-[0.18em] text-ink"
                    style={{ fontWeight: 500 }}
                  >
                    {label}
                  </p>
                  <p className="mt-1 font-serif text-[12px] italic leading-[1.4] text-muted-ink">
                    {sub}
                  </p>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
