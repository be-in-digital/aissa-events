"use client";

import { motion } from "motion/react";

const LINE_1 = "AÏSSA";
const LINE_2 = "EVENTS";

export function MegaTypo() {
  return (
    <div className="relative overflow-hidden bg-ink pt-8 text-cream sm:pt-12">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-14">
        <div className="text-center" style={{ marginBottom: "-0.18em" }}>
          <Line text={LINE_1} />
          <Line text={LINE_2} italic offset={LINE_1.length} />
        </div>
      </div>
    </div>
  );
}

function Line({
  text,
  italic = false,
  offset = 0,
}: {
  text: string;
  italic?: boolean;
  offset?: number;
}) {
  return (
    <p
      className="font-serif leading-[0.85] tracking-[-0.06em] text-cream"
      style={{
        fontWeight: 300,
        fontSize: "clamp(80px, 24vw, 360px)",
      }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0, y: 100, rotate: 8 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 1.2,
            delay: (offset + i) * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`inline-block ${italic ? "italic text-gold-soft" : ""}`}
          style={italic ? { fontWeight: 400 } : undefined}
        >
          {char}
        </motion.span>
      ))}
    </p>
  );
}
