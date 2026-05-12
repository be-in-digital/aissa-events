"use client";

import Image from "next/image";
import { motion, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";
import { Eyebrow } from "./eyebrow";
import { PortableText } from "@portabletext/react";
import { renderInlineItalic } from "@/lib/sanity/text";
import { urlForImageString } from "@/lib/sanity/image";
import type { HomePageQueryResult, SiteSettingsQueryResult } from "@/sanity.types";

type AboutData = NonNullable<HomePageQueryResult>["about"];
type Founder = NonNullable<SiteSettingsQueryResult>["founder"];

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const value = useMotionValue(0);
  const display = useTransform(value, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, to, value]);

  return (
    <span ref={ref}>
      +<motion.span>{display}</motion.span>
    </span>
  );
}

function extractCounterFromBio(): number | null {
  return null;
}

export function About({
  data,
  founder,
}: {
  data?: AboutData;
  founder?: Founder;
}) {
  if (data?.enabled === false) return null;
  if (!data?.title) return null;

  const eyebrow = data?.eyebrow;
  const title = data.title;
  const body = data?.body;
  const founderImage = founder?.photo;
  const imageUrl = founderImage?.asset
    ? urlForImageString(founderImage, { width: 1200, quality: 85 })
    : data?.image?.asset
      ? urlForImageString(data.image, { width: 1200, quality: 85 })
      : null;
  const imageAlt =
    founderImage?.alt ??
    data?.image?.alt ??
    (founder?.name ? `${founder.name}, fondatrice` : "");
  const signatureName = founder?.signatureName ?? founder?.name;
  const role = founder?.role;
  const counterValue = extractCounterFromBio() ?? 60;

  return (
    <section id="about" className="relative bg-cream-soft py-32 sm:py-40">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <div className="grid items-center gap-20 lg:grid-cols-[0.85fr_1fr] lg:gap-24">
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px]">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  style={{
                    filter: "contrast(1.06) saturate(0.95) sepia(0.05)",
                  }}
                />
              </div>
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -right-8 -z-10 hidden h-[80%] w-[80%] rounded-[20px] border border-bordeaux lg:block"
                style={{ top: "8rem", left: "8rem" }}
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-8 right-0 rounded-3xl border border-[var(--rule)] bg-cream px-9 py-7 shadow-[0_30px_80px_rgba(44,31,51,0.12)] sm:-right-16"
              >
                <div className="font-serif text-[56px] italic leading-none text-bordeaux">
                  <Counter to={counterValue} />
                </div>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-ink">
                  Mariages
                  <br />
                  orchestrés
                </p>
              </motion.div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            {eyebrow && (
              <div className="mb-8">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            <h2
              className="mb-8 font-serif text-[40px] leading-[1] tracking-[-0.03em] sm:text-[56px] lg:text-[72px]"
              style={{ fontWeight: 300 }}
            >
              {title.split("\n").map((line, i, arr) => (
                <span key={i}>
                  {renderInlineItalic(line)}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
            </h2>

            {body && body.length > 0 ? (
              <div className="space-y-5 text-[16px] leading-[1.75] text-ink-soft">
                <PortableText value={body} />
              </div>
            ) : founder?.bio ? (
              <div className="space-y-5 text-[16px] leading-[1.75] text-ink-soft">
                <PortableText value={founder.bio} />
              </div>
            ) : null}

            {(signatureName || role) && (
              <div className="mt-12 flex items-center gap-6 border-t border-[var(--rule)] pt-8">
                {signatureName && (
                  <span className="font-script text-[64px] leading-none text-bordeaux">
                    {signatureName}
                  </span>
                )}
                {role && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] leading-relaxed text-muted-ink">
                    {role.split(" & ").map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <>
                            {" "}
                            <br />&{" "}
                          </>
                        )}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
