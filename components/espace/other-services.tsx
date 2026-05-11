"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type OtherServicesData = NonNullable<EspaceEventsPageQueryResult>["otherServices"];

type Service = {
  href: string;
  eyebrow: string;
  titleStart: string;
  titleItalic: string;
  desc: string;
  tags: string[];
  cta: string;
};

const FALLBACK_SERVICES: Service[] = [
  {
    href: "/mariage",
    eyebrow: "Service · Wedding planning",
    titleStart: "Un mariage",
    titleItalic: "organisé.",
    desc: "Aïssa, wedding planner diplômée (Trouve ton expert, 2024), coordonne votre mariage de A à Z ou intervient à la carte. Cérémonie à Espace Events (50 pers.) ou dans un lieu partenaire en Île-de-France pour les grands formats.",
    tags: ["Organisation complète", "À la carte", "4 thèmes décor"],
    cta: "Découvrir le wedding planning",
  },
  {
    href: "/evenements-pro",
    eyebrow: "Service · Événements pro",
    titleStart: "Un événement",
    titleItalic: "B2B.",
    desc: "Soirées clients, afterworks, lancements, séminaires. Pack Ambiance clé en main ou organisation sur mesure — à Espace Events, dans vos locaux ou en lieu partenaire.",
    tags: ["Pack Ambiance", "Sur mesure", "Hors lieu"],
    cta: "Découvrir l'offre B2B",
  },
];

const FALLBACK_EYEBROW = "Le lieu accueille aussi";
const FALLBACK_TITLE = "Le lieu, et\n_deux services en plus._";
const FALLBACK_INTRO =
  "Au-delà de la location, on organise aussi votre mariage ou votre événement pro — à Espace Events, dans vos locaux ou en lieu partenaire. Aïssa et son équipe d'alternants s'adaptent au format.";

export function OtherServices({ data }: { data?: OtherServicesData }) {
  if (data?.enabled === false) return null;

  const eyebrow = data?.eyebrow ?? FALLBACK_EYEBROW;
  const title = data?.title ?? FALLBACK_TITLE;
  const intro = data?.intro ?? FALLBACK_INTRO;

  const services: Service[] = data?.items?.length
    ? data.items.map((item) => ({
        href: item.ctaHref ?? "#",
        eyebrow: item.eyebrow ?? "",
        titleStart: item.titleStart ?? "",
        titleItalic: item.titleItalic ?? "",
        desc: item.description ?? "",
        tags: item.tags ?? [],
        cta: item.ctaLabel ?? "En savoir plus",
      }))
    : FALLBACK_SERVICES;

  return (
    <section className="relative overflow-hidden bg-ink py-28 text-cream sm:py-36">
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 80% 30%, rgba(184, 146, 78, 0.18) 0%, transparent 60%), radial-gradient(circle at 20% 70%, rgba(61, 37, 73, 0.45) 0%, transparent 55%)",
            backgroundSize: "200% 200%",
          }}
        />
      </motion.div>

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-16 max-w-[720px] text-center"
        >
          <p className="mb-6 inline-flex items-center justify-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-soft">
            <span className="size-2 animate-pulse rounded-full bg-gold" />
            {eyebrow}
          </p>
          <h2
            className="font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[52px] lg:text-[64px]"
            style={{ fontWeight: 300 }}
          >
            {title.split("\n").map((line, i, arr) => (
              <span key={i}>
                {renderInlineItalic(line, {
                  italicClassName: "italic text-gold-soft",
                })}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </h2>
          {intro && (
            <p
              className="mt-6 font-serif text-[19px] italic leading-[1.5] text-cream/75"
              style={{ fontWeight: 300 }}
            >
              {intro}
            </p>
          )}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {services.map((s, i) => (
            <ServiceCard key={`${s.href}-${i}`} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-160, 160], [4, -4]), {
    stiffness: 140,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mouseX, [-260, 260], [-5, 5]), {
    stiffness: 140,
    damping: 18,
  });
  const glowX = useTransform(mouseX, [-260, 260], ["10%", "90%"]);
  const glowY = useTransform(mouseY, [-160, 160], ["10%", "90%"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.15,
      }}
      style={{ perspective: 1200 }}
    >
      <Link
        ref={cardRef}
        href={service.href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative block overflow-hidden rounded-[28px] border border-cream/12 bg-cream/[0.04] p-10 backdrop-blur-sm transition-colors duration-500 hover:border-gold/40 sm:p-12"
        aria-label={`${service.titleStart} ${service.titleItalic}`}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) =>
                `radial-gradient(420px circle at ${x as string} ${y as string}, rgba(212, 178, 122, 0.16), transparent 70%)`,
            ),
          }}
        />

        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative"
        >
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.28em] text-gold-soft">
            — {service.eyebrow}
          </p>

          <h3
            className="mb-5 font-serif text-[30px] leading-[1.05] tracking-[-0.02em] text-cream sm:text-[34px]"
            style={{ fontWeight: 400 }}
          >
            {service.titleStart}{" "}
            <em className="italic text-gold-soft">{service.titleItalic}</em>
          </h3>

          <p className="max-w-[480px] text-[14px] leading-[1.7] text-cream/70">
            {service.desc}
          </p>

          <ul className="mt-7 flex flex-wrap gap-2">
            {service.tags.map((tag, t) => (
              <motion.li
                key={tag}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: index * 0.15 + 0.3 + t * 0.08,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-full border border-gold-soft/30 bg-gold-soft/[0.04] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-gold-soft transition-all duration-500 group-hover:border-gold-soft/60 group-hover:bg-gold-soft/10"
              >
                {tag}
              </motion.li>
            ))}
          </ul>

          <span className="mt-9 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.22em] text-gold transition-all duration-500 group-hover:gap-3.5">
            {service.cta}
            <ArrowRight className="size-3.5 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </motion.div>

        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[28px] border border-gold/0 transition-all duration-700 group-hover:border-gold/30"
        />
      </Link>
    </motion.div>
  );
}
