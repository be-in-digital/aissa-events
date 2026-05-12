"use client";

import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { PortableText } from "@portabletext/react";
import { Eyebrow } from "@/components/home/eyebrow";
import { renderInlineItalic } from "@/lib/sanity/text";
import type { EspaceEventsPageQueryResult } from "@/sanity.types";

type FaqData = NonNullable<EspaceEventsPageQueryResult>["faq"];

export function FaqEspace({ data }: { data?: FaqData }) {
  if (data?.enabled === false) return null;
  if (!data?.title) return null;
  if (!data.items?.length) return null;

  const eyebrow = data.eyebrow;
  const title = data.title;
  const items = data.items;

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
            {eyebrow && (
              <div className="mb-6">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
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
