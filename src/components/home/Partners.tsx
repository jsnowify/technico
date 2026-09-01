import Image from "next/image";
import { PARTNERS } from "@/lib/constants";

/* ================================================================
   PARTNERS (sixth section)
   ================================================================
   A calm, edge-to-edge checkerboard of partner logos on the black
   section background. No gaps between tiles — the alternating fill
   (light tile vs. transparent-onto-section-bg) is what separates
   each logo, so there's nothing to visually tidy up beyond that.

   LAYOUT: flexbox, not CSS grid. Each tile is a fixed fraction of
   the row (1/2, 1/3, 1/5 depending on breakpoint) with `flex-wrap`,
   and the row is `justify-center`. That's what makes the final,
   incomplete row of 3 logos (13 items ÷ 5 columns) center itself
   with empty space on both sides — exactly like the approved
   layout — instead of hugging the left edge the way CSS grid's
   auto-placement would.

   TILE COLOR: hand-mapped per index (TILE_LIGHT) rather than derived
   from `i % 2`. A pure alternating-by-index formula reproduces the
   checkerboard perfectly for any *full* row (5 is odd, so the start
   color flips every row on its own), but breaks on the last,
   centered row: visually its 3 tiles sit in columns 2–4, not 0–2, so
   the color that continues the checkerboard there doesn't match
   what plain index parity would give. Hard-coding the 13 values
   keeps the desktop layout pixel-accurate; at the 2- and 3-column
   breakpoints it still reads as a clean, mostly-alternating pattern.
   ================================================================ */

const TILE_LIGHT = [
  true,
  false,
  true,
  false,
  true,
  false,
  true,
  false,
  true,
  false,
  false,
  true,
  false,
];

export default function Partners() {
  return (
    <section className="bg-black-bg">
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24 md:pt-28">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 bg-white" />
          <span className="font-mono text-xs tracking-[0.14em] text-white/70 uppercase text-balance sm:text-sm">
            Partners
          </span>
        </div>
      </div>

      {/* Checkerboard grid */}
      <div className="mx-auto mt-16 max-w-6xl px-6 pb-20 sm:mt-20 sm:pb-24 md:mt-24 md:pb-28">
        <div className="flex flex-wrap justify-center">
          {PARTNERS.map((partner, i) => (
            <div
              key={partner.name}
              className={`flex aspect-square w-1/2 shrink-0 items-center justify-center p-9 sm:w-1/3 sm:p-11 lg:w-1/5 lg:p-10 ${
                (TILE_LIGHT[i] ?? i % 2 === 0) ? "bg-[#e7e7e5]" : ""
              }`}
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={240}
                height={240}
                sizes="(min-width: 1024px) 12vw, (min-width: 640px) 22vw, 40vw"
                className="h-auto max-h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
