"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import SlidingText from "@/components/motion/SlidingText";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

/* ================================================================
   HOVER IMAGE SWAP
   ================================================================
   The rollover list used in ServicesMarketOverview: a column of
   labels next to an image well. Hovering (or focusing, for
   keyboard users) a label swaps the image well to that item's
   image and marks the label active; the rest sit dimmed. Client
   component so the hover state doesn't force the whole overview
   section into the client bundle.

   IMAGE TRANSITION — center-out clip-path reveal + crossfade.
     Each image sits in its own layer, stacked via next/image
     `fill`. Initial per-layer state (opacity/clip-path) is set
     once on mount. Every subsequent swap only ever tweens TOWARD
     a target with plain gsap.to() + overwrite:"auto" — it never
     hard-resets a layer's current value mid-flight. That's what
     makes rapid/reversed hovering look natural instead of
     "rewinding": an interrupted fade just continues from wherever
     it actually is instead of snapping back first. A layer's
     clip-path is only reset back to the hidden inset (ready for
     its next reveal) inside onComplete, once it's already fully
     transparent — so that reset is never visible, and if the fade
     gets interrupted first, overwrite:"auto" kills the tween
     before onComplete can fire.

   HOVER MOTION — two states, kept separate on purpose:
     - `active` persists (it's "which image is showing"), same as
       before — doesn't reset when the pointer leaves the list.
     - `hovered` is momentary (it's "is the pointer over THIS row
       right now") and drives the motion: no dot, no bar, no
       position shift — just the label itself reusing the same
       SlidingText vertical-swap reveal the nav links use, so every
       single hover reads as motion without moving any layout.

   SCROLL SCRUB — for anyone who never touches the list with the
     mouse, `active` also gets driven directly off scroll progress.
     A single ScrollTrigger sits on the <ul>, scrubbing between
     "top center" and "bottom center" (i.e. the zone where the list
     crosses the viewport's midpoint, ~50%). Its progress (0–1) is
     mapped to an item index, and every time that index changes it
     calls the exact same setActive/setHovered a real hover would —
     so the reveal animation in the useGSAP above never has to know
     or care whether it was triggered by a pointer or a scrollbar.
     `hovered` is released on a short debounce rather than
     immediately, so a fast scrub doesn't flicker it on/off between
     every index. Skipped entirely when prefersReducedMotion is set.
   ================================================================ */

export type HoverImageSwapItem = {
  label: string;
  image: string;
};

const HIDDEN_CLIP = "inset(38%)";
const SHOWN_CLIP = "inset(0%)";

export default function HoverImageSwap({
  items,
  imageFirst = true,
  caption,
}: {
  items: readonly HoverImageSwapItem[];
  /** Whether the image well sits left of the list on desktop (md+). */
  imageFirst?: boolean;
  /** Optional caption rendered under the list, in the list's own column. */
  caption?: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const prevActiveRef = useRef(0);
  const mountedRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const wellRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const well = wellRef.current;
      if (!well) return;

      const layers = well.querySelectorAll<HTMLElement>("[data-hover-img]");

      // First run: just set static initial state, no animation.
      if (!mountedRef.current) {
        mountedRef.current = true;
        gsap.set(layers, {
          opacity: (i) => (i === active ? 1 : 0),
          clipPath: (i) => (i === active ? SHOWN_CLIP : HIDDEN_CLIP),
          zIndex: (i) => (i === active ? 1 : 0),
        });
        return;
      }

      const prev = prevActiveRef.current;
      prevActiveRef.current = active;
      if (prev === active) return;

      const incoming = layers[active];
      const outgoing = layers[prev];
      if (!incoming || !outgoing) return;

      if (prefersReducedMotion) {
        gsap.set(layers, {
          opacity: (i) => (i === active ? 1 : 0),
          clipPath: (i) => (i === active ? SHOWN_CLIP : HIDDEN_CLIP),
        });
        return;
      }

      gsap.set(incoming, { zIndex: 2 });
      gsap.set(outgoing, { zIndex: 1 });

      gsap.to(incoming, {
        opacity: 1,
        clipPath: SHOWN_CLIP,
        duration: 0.65,
        ease: "power3.out",
        overwrite: "auto",
      });

      gsap.to(outgoing, {
        opacity: 0,
        duration: 0.55,
        ease: "power2.inOut",
        overwrite: "auto",
        onComplete: () => {
          // Safe to reset now — it's invisible. If this tween gets
          // interrupted instead, overwrite:"auto" kills it before
          // this ever runs, so a re-hovered layer never snaps.
          gsap.set(outgoing, { clipPath: HIDDEN_CLIP, zIndex: 0 });
        },
      });
    },
    { dependencies: [active] },
  );

  // Scroll scrub: map scroll progress through the list to `active`,
  // same as if the pointer were moving down the rows on its own.
  const lastScrubIndexRef = useRef<number | null>(null);
  const hoverReleaseRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const listEl = listRef.current;
      if (!listEl || items.length === 0) return;

      const trigger = ScrollTrigger.create({
        trigger: listEl,
        start: "top center", // list top hits 50% down the viewport
        end: "bottom center", // list bottom hits 50% down the viewport
        scrub: true,
        onUpdate: (self) => {
          const index = Math.min(
            items.length - 1,
            Math.floor(self.progress * items.length),
          );

          if (index === lastScrubIndexRef.current) return;
          lastScrubIndexRef.current = index;

          setActive(index);
          setHovered(index);

          // Debounce the "pointer leaving" so a fast scrub doesn't
          // spam hovered on/off between every index change.
          hoverReleaseRef.current?.kill();
          hoverReleaseRef.current = gsap.delayedCall(0.35, () =>
            setHovered(null),
          );
        },
      });

      return () => {
        trigger.kill();
        hoverReleaseRef.current?.kill();
      };
    },
    { scope: rootRef, dependencies: [items] },
  );

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-20"
    >
      <div
        ref={wellRef}
        className={`relative aspect-[4/3] w-full overflow-hidden sm:aspect-[3/2] ${
          imageFirst ? "md:order-1" : "md:order-2"
        }`}
      >
        {items.map((item, i) => (
          <Image
            key={item.image + i}
            data-hover-img
            src={item.image}
            alt={item.label}
            fill
            sizes="(min-width: 768px) 48vw, 90vw"
            className="object-cover"
          />
        ))}
      </div>

      <div className={imageFirst ? "md:order-2" : "md:order-1"}>
        <ul ref={listRef}>
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
                  className={`flex w-full items-center py-5 text-left text-[46px] font-normal tracking-tight transition-colors duration-300 ease-out sm:py-6 ${
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
        {caption}
      </div>
    </div>
  );
}
