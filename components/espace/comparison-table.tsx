"use client";

import { motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";

export type ComparisonRow = {
  label: string;
  values: [boolean, boolean, boolean];
};

export type ComparisonColumn = {
  name: string;
  price: string;
  featured?: boolean;
};

export type ComparisonTableProps = {
  titleStart: string;
  titleItalic: string;
  subtitle: string;
  columns: [ComparisonColumn, ComparisonColumn, ComparisonColumn];
  rows: ComparisonRow[];
  collapsible?: boolean;
};

export function ComparisonTable(props: ComparisonTableProps) {
  if (props.collapsible) {
    return <CollapsibleVariant {...props} />;
  }
  return <DefaultVariant {...props} />;
}

function DefaultVariant({
  titleStart,
  titleItalic,
  subtitle,
  columns,
  rows,
}: ComparisonTableProps) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <h2
            className="font-serif text-[32px] leading-[1] tracking-[-0.02em] sm:text-[40px] lg:text-[48px]"
            style={{ fontWeight: 400 }}
          >
            {titleStart} <em className="italic text-bordeaux">{titleItalic}</em>
          </h2>
          <p className="mt-3 font-serif text-[15px] italic text-muted-ink">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-[24px] border border-[var(--rule)] bg-cream"
        >
          <ComparisonTableBody columns={columns} rows={rows} />
        </motion.div>
      </div>
    </section>
  );
}

function CollapsibleVariant({
  titleStart,
  titleItalic,
  subtitle,
  columns,
  rows,
}: ComparisonTableProps) {
  return (
    <section className="relative pt-2 pb-16 sm:pt-4 sm:pb-24">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <AccordionPrimitive.Root className="overflow-hidden rounded-[24px] border border-[var(--rule)] bg-cream">
            <AccordionPrimitive.Item value="comparison">
              <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger className="group/trigger flex w-full items-center justify-between gap-6 px-7 py-6 text-left transition-colors hover:bg-cream-soft focus:outline-none sm:px-9">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-bordeaux">
                      — Comparatif détaillé
                    </p>
                    <p
                      className="mt-2 font-serif text-[20px] leading-[1.2] tracking-[-0.01em] text-ink sm:text-[24px]"
                      style={{ fontWeight: 400 }}
                    >
                      {titleStart}{" "}
                      <em className="italic text-bordeaux">{titleItalic}</em>
                    </p>
                  </div>
                  <span className="flex items-center gap-3">
                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-ink transition-colors group-aria-expanded/trigger:text-bordeaux sm:inline-block">
                      <span className="group-aria-expanded/trigger:hidden">
                        Voir
                      </span>
                      <span className="hidden group-aria-expanded/trigger:inline">
                        Replier
                      </span>
                    </span>
                    <ChevronDown
                      className="size-5 shrink-0 text-bordeaux transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-aria-expanded/trigger:rotate-180"
                      strokeWidth={1.5}
                    />
                  </span>
                </AccordionPrimitive.Trigger>
              </AccordionPrimitive.Header>
              <AccordionPrimitive.Panel className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up">
                <div className="h-(--accordion-panel-height)">
                  <div className="border-t border-[var(--rule)] px-7 py-5 sm:px-9">
                    <p className="font-serif text-[14px] italic text-muted-ink">
                      {subtitle}
                    </p>
                  </div>
                  <ComparisonTableBody columns={columns} rows={rows} />
                </div>
              </AccordionPrimitive.Panel>
            </AccordionPrimitive.Item>
          </AccordionPrimitive.Root>
        </motion.div>
      </div>
    </section>
  );
}

function ComparisonTableBody({
  columns,
  rows,
}: Pick<ComparisonTableProps, "columns" | "rows">) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-cream-deep px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.22em] text-ink">
              Inclusions
            </th>
            {columns.map((c) => (
              <th
                key={c.name}
                className={`bg-cream-deep px-4 py-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink ${
                  c.featured ? "bg-gold/10" : ""
                }`}
              >
                <span>
                  {c.name}
                  {c.featured && " ★"}
                </span>
                <br />
                <span className="font-serif text-[18px] italic tracking-normal text-bordeaux">
                  {c.price}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-t border-[var(--rule-soft)] transition-colors hover:bg-cream-soft"
            >
              <td className="px-5 py-4 font-serif text-[15px] italic text-ink">
                {r.label}
              </td>
              {r.values.map((v, j) => (
                <td
                  key={j}
                  className={`px-4 py-4 text-center ${
                    columns[j].featured ? "bg-gold/5" : ""
                  }`}
                >
                  {v ? (
                    <Check className="mx-auto size-4 stroke-[3] text-bordeaux" />
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-ink">
                      En option
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
