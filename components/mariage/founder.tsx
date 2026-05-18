"use client";

import Image from "next/image";
import { MotionConfig, motion } from "motion/react";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { urlForImageString } from "@/lib/sanity/image";
import type { SiteSettingsQueryResult } from "@/sanity.types";

type Founder = NonNullable<SiteSettingsQueryResult>["founder"];

export function MariageFounder({ founder }: { founder?: Founder }) {
  if (!founder) return null;

  const photo = founder.photo;
  const imageUrl = photo?.asset
    ? urlForImageString(photo, { width: 1200, quality: 85 })
    : null;
  const imageAlt = photo?.alt ?? founder.name ?? "";
  const signatureName = founder.signatureName ?? founder.name;
  const role = founder.role;
  const bio = founder.bio;

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative bg-cream py-28 sm:py-36">
        <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
          <div className="grid items-center gap-14 lg:grid-cols-[5fr_6fr] lg:gap-20">
            {imageUrl && (
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
                {(signatureName || role) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4"
                  >
                    <div>
                      {signatureName && (
                        <p className="font-script text-[42px] leading-none text-cream">
                          {signatureName}
                        </p>
                      )}
                      {role && (
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-cream/85">
                          {role}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

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

              {bio && bio.length > 0 && (
                <div className="mt-8 space-y-5 text-[16px] leading-[1.8] text-ink-soft">
                  <PortableText value={bio} />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
