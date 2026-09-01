"use client";

import { useState } from "react";
import Image from "next/image";
import SlidingText from "@/components/motion/SlidingText";

/* ================================================================
   HOVER IMAGE SWAP
   ================================================================
   The rollover list used twice in ServicesMarketOverview: a column
   of labels next to an image well. Hovering (or focusing, for
   keyboard users) a label swaps the image well to that item's
   image instantly (no crossfade) and marks the label active; the
   rest sit dimmed. Client component so the hover state doesn't
   force the whole overview section into the client bundle.

   HOVER MOTION — two states, kept separate on purpose:
     - `active` persists (it's "which image is showing"), same as
       before — doesn't reset when the pointer leaves the list.
     - `hovered` is momentary (it's "is the pointer over THIS row
       right now") and drives the motion: no dot, no bar, no
       position shift — just the label itself reusing the same
       SlidingText vertical-swap reveal the nav links use, so every
       single hover reads as motion without moving any layout.
   ================================================================ */

export type HoverImageSwapItem = {
  label: string;
  image: string;
};

export default function HoverImageSwap({
  items,
  imageFirst = true,
}: {
  items: readonly HoverImageSwapItem[];
  /** Whether the image well sits left of the list on desktop (md+). */
  imageFirst?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-20">
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden sm:aspect-[3/2] ${
          imageFirst ? "md:order-1" : "md:order-2"
        }`}
      >
        {items.map((item, i) => (
          <Image
            key={item.image + i}
            src={item.image}
            alt={item.label}
            fill
            sizes="(min-width: 768px) 48vw, 90vw"
            className={`object-cover ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <ul className={imageFirst ? "md:order-2" : "md:order-1"}>
        {items.map((item, i) => {
          const isActive = i === active;
          const isHovered = hovered === i;

          return (
            <li key={item.label} className="border-b border-black-text/10">
              <button
                type="button"
                aria-label={item.label}
                onMouseEnter={() => {
                  setActive(i);
                  setHovered(i);
                }}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => {
                  setActive(i);
                  setHovered(i);
                }}
                onBlur={() => setHovered(null)}
                className={`flex w-full items-center py-5 text-left font-mono text-xl font-semibold tracking-[0.02em] uppercase transition-colors duration-300 ease-out sm:py-6 sm:text-2xl md:text-[28px] ${
                  isActive
                    ? "text-black-text"
                    : "text-black-text/35 hover:text-black-text/60"
                }`}
              >
                <SlidingText text={item.label} isHovered={isHovered} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
