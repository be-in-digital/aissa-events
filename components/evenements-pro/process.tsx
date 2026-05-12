"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EvenementPageQueryResult } from "@/sanity.types";

type ProcessData = NonNullable<EvenementPageQueryResult>["process"];

export function EvenementProcess({ data }: { data?: ProcessData }) {
  if (data?.enabled === false) return null;
  if (!data?.steps?.length) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;

  const steps = data.steps.map((s, idx) => ({
    italic: s?.italic ?? null,
    rest: s?.rest ?? null,
    description: s?.description ?? "",
    num: String(idx + 1).padStart(2, "0"),
  }));

  return (
    <section className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-14">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            {eyebrow && (
              <div className="mb-6">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            <h2
              className="font-serif text-[36px] leading-[1] tracking-[-0.03em] sm:text-[48px] lg:text-[56px]"
              style={{ fontWeight: 300 }}
            >
              {title.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {renderInlineItalic(line)}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>
          </motion.div>

          <div className="grid gap-5">
            {steps.map((s, i) => (
              <motion.div
                key={`${s.num}-${s.rest}`}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.08,
                }}
                whileHover={{ y: -4 }}
                className="group grid gap-6 rounded-[24px] border border-[var(--rule)] bg-cream-soft p-7 transition-all duration-500 hover:border-bordeaux hover:shadow-[0_30px_80px_rgba(44,31,51,0.08)] sm:grid-cols-[68px_1fr] sm:p-8"
              >
                <div
                  className="font-serif text-[56px] italic leading-none text-bordeaux transition-transform duration-500 group-hover:scale-110"
                  style={{ fontWeight: 400 }}
                >
                  {s.num}
                </div>
                <div>
                  <h3
                    className="mb-2 font-serif text-[20px] leading-[1.2]"
                    style={{ fontWeight: 500 }}
                  >
                    {s.italic && <em className="italic">{s.italic}</em>}
                    {s.italic && s.rest && " "}
                    {s.rest}
                  </h3>
                  <p className="text-[14px] leading-[1.65] text-ink-soft">
                    {s.description}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.32,
              }}
              className="grid gap-6 rounded-[24px] border border-bordeaux/40 bg-cream p-7 sm:grid-cols-[68px_1fr] sm:p-8"
            >
              <div className="grid size-14 place-items-center rounded-full bg-bordeaux text-cream">
                <Star className="size-6 fill-current" />
              </div>
              <div>
                <h3
                  className="mb-2 font-serif text-[20px] leading-[1.2] text-bordeaux"
                  style={{ fontWeight: 500 }}
                >
                  Conditions de réservation
                </h3>
                <p className="text-[14px] leading-[1.65] text-ink-soft">
                  Devis sous 48 h · Contrat signé en ligne · Acompte 50 % à la
                  réservation · Solde 15 jours avant l&apos;événement ·
                  Facturation entreprise (TVA, SIRET, paiement à 30 j possible
                  sur dossier).
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
