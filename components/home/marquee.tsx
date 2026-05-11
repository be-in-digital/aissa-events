import type { HomePageQueryResult } from "@/sanity.types";

type MarqueeData = NonNullable<HomePageQueryResult>["marquee"];

const FALLBACK_ITEMS = [
  "Mariages & cérémonies",
  "Événements professionnels",
  "Anniversaires & célébrations",
  "Direction artistique",
  "Scénographie sur mesure",
  "DJ & live performances",
];

export function Marquee({ data }: { data?: MarqueeData }) {
  if (data?.enabled === false) return null;
  const items = data?.items?.length ? data.items : FALLBACK_ITEMS;
  const loop = [...items, ...items];

  return (
    <div className="relative z-[3] overflow-hidden border-y border-[var(--rule)] bg-cream-soft py-8">
      <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-20 whitespace-nowrap">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-20 font-serif text-[26px] italic leading-none text-ink sm:text-[28px]"
            style={{ fontWeight: 300 }}
          >
            {item}
            <span aria-hidden className="text-[16px] not-italic text-bordeaux">
              ✦
            </span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
