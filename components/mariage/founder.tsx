"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Award, Heart, Users } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { MARIAGE_IMAGES } from "@/lib/images";
import { urlForImageString } from "@/lib/sanity/image";
import type { SiteSettingsQueryResult } from "@/sanity.types";

type Founder = NonNullable<SiteSettingsQueryResult>["founder"];

const STATS = [
  {
    Icon: Award,
    label: "Wedding planner diplômée",
    sub: "Académie Wedding Planning · Paris",
  },
  {
    Icon: Heart,
    label: "+60 mariages depuis 2020",
    sub: "Île-de-France · ponctuellement au-delà",
  },
  {
    Icon: Users,
    label: "Aïssa + son réseau",
    sub: "Coordinatrice · scéno · DJ partenaires",
  },
];

export function MariageFounder({ founder }: { founder?: Founder }) {
  const photo = founder?.photo;
  const imageUrl = photo?.asset
    ? urlForImageString(photo, { width: 1200, quality: 85 })
    : MARIAGE_IMAGES.founder;
  const imageAlt =
    photo?.alt ?? "Aïssa, fondatrice et wedding planner d'Aïssa Events";
  const signatureName = founder?.signatureName ?? founder?.name ?? "Aïssa";
  const role = founder?.role ?? "Fondatrice · Wedding planner";

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
                  {signatureName}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/85">
                  {role}
                </p>
              </div>
              <span className="rounded-full bg-cream/95 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] text-bordeaux backdrop-blur-sm">
                Depuis 2020
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
              <Eyebrow>Aïssa, fondatrice</Eyebrow>
            </div>
            <h2
              className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[52px] lg:text-[68px]"
              style={{ fontWeight: 300 }}
            >
              Une seule
              <br />
              <em className="italic text-bordeaux">interlocutrice,</em>
              <br />
              du brief au bal.
            </h2>

            <div className="mt-8 space-y-5 text-[16px] leading-[1.8] text-ink-soft">
              {founder?.bio && founder.bio.length > 0 ? (
                <PortableText value={founder.bio} />
              ) : (
                <>
                  <p>
                    Aïssa Events, c&apos;est Aïssa. Wedding planner diplômée,
                    installée à Émerainville depuis 2020. Concrètement : la
                    personne qui répond à votre premier mail est la même qui sera
                    là le matin du mariage, et qui, à 1h du mat&apos;, ira
                    négocier avec le DJ pour qu&apos;il continue jusqu&apos;à 2h
                    au lieu de couper net.
                  </p>
                  <p>
                    Sur le terrain, elle bosse avec ses alternants et un réseau de
                    prestataires construit lentement : fleuristes, traiteurs halal
                    et casher, photographes, DJ, officiants pour cérémonies
                    multi-confessions. Lentement, parce qu&apos;on en a viré
                    quelques-uns en route, après le premier mariage où ils
                    n&apos;avaient pas livré ce qui était dans le devis.
                  </p>
                  <p>
                    Le principe de la maison :{" "}
                    <strong className="font-medium text-ink">
                      ce qui se passe en coulisses ne vous regarde pas.
                    </strong>{" "}
                    Logistique, timing, retards, météo qui tourne au moment du
                    cocktail. C&apos;est notre boulot, pas le vôtre.
                  </p>
                </>
              )}
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {STATS.map(({ Icon, label, sub }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.7,
                    delay: 0.35 + i * 0.1,
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
