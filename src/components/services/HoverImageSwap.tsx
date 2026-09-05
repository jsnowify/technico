"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import SlidingText from "@/components/motion/SlidingText";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

/* ================================================================
   SCROLL IMAGE SWAP
   ================================================================
   The rollover list used in ServicesMarketOverview: a column of
   labels next to an image well. No longer hover/focus-driven — the
   active label (and which image shows) is set purely by scroll
   position, so touch users and mouse users see the exact same
   behavior. Client component so the scroll-driven state doesn't
   force the whole overview section into the client bundle.

   IMAGE TRANSITION — center-out clip-path reveal + crossfade.
     Each image sits in its own layer, stacked via next/image
     `fill`. Initial per-layer state (opacity/clip-path) is set
     once on mount. Every subsequent swap only ever tweens TOWARD
     a target with plain gsap.to() + overwrite:"auto" — it never
     hard-resets a layer's current value mid-flight. That's what
     makes a fast scroll (which can jump the active index more than
     once before a tween finishes) look natural instead of
     "rewinding": an interrupted fade just continues from wherever
     it actually is instead of snapping back first. A layer's
     clip-path is only reset back to the hidden inset (ready for
     its next reveal) inside onComplete, once it's already fully
     transparent — so that reset is never visible, and if the fade
     gets interrupted first, overwrite:"auto" kills the tween
     before onComplete can fire.

   ACTIVE/HIGHLIGHT MOTION — two states, kept separate on purpose:
     - `active` persists (it's "which image is showing").
     - `highlighted` is momentary (it's "which row does scroll
       currently have positioned as active") and drives the label
       motion: no dot, no bar, no position shift — just the label
       itself reusing the same SlidingText vertical-swap reveal the
       nav links use, so every transition reads as motion without
       moving any layout. Released on a short debounce rather than
       immediately, so a fast scrub doesn't flicker it on/off
       between every index.

   SCROLL SCRUB — the only driver of `active`/`highlighted` now.
     Which element drives the scrub differs by breakpoint (see the
     ScrollTrigger.matchMedia note above the effect below): the row
     on md+ (where the image is sticky), the `<ul>` itself below md
     (stacked layout, no sticky). Either way it scrubs between
     "top center" and "bottom center" of that element (i.e. the zone
     where it crosses the viewport's midpoint, ~50%), maps progress
     (0–1) to an item index, and updates active/highlighted whenever
     that index changes. Skipped entirely when prefersReducedMotion
     is set (the first item just stays shown).
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
  const [highlighted, setHighlighted] = useState<number | null>(null);

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

  // Scroll scrub: the only driver of `active`/`highlighted` now.
  // The right trigger element is DIFFERENT per layout, so this uses
  // ScrollTrigger.matchMedia to pick between them and re-pick
  // automatically on breakpoint changes:
  //   - md+ (sticky image column): trigger = the row (rootRef).
  //     The row is much taller than the list here (that's the point
  //     of the sticky image), so progress needs to span the row's
  //     full height to match how long the image stays pinned.
  //   - below md (stacked, no sticky): trigger = the list (listRef).
  //     Image and list are stacked in document order here, so the
  //     row's top is the image's top, not the list's. Scrubbing off
  //     the whole row meant progress was already partway through by
  //     the time the list itself scrolled into view — activating
  //     items while the list was still off-screen. Keying it back to
  //     the list's own bounds starts the scrub only once the list is
  //     actually the thing entering the viewport.
  const lastScrubIndexRef = useRef<number | null>(null);
  const highlightReleaseRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion || items.length === 0) return;

      const makeTrigger = (el: Element) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          scrub: true,
          onUpdate: (self) => {
            const index = Math.min(
              items.length - 1,
              Math.floor(self.progress * items.length),
            );

            if (index === lastScrubIndexRef.current) return;
            lastScrubIndexRef.current = index;

            setActive(index);
            setHighlighted(index);

            // Debounce the "no longer the current index" so a fast
            // scrub doesn't spam highlighted on/off between every
            // index change.
            highlightReleaseRef.current?.kill();
            highlightReleaseRef.current = gsap.delayedCall(0.35, () =>
              setHighlighted(null),
            );
          },
        });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const rowEl = rootRef.current;
        if (!rowEl) return;
        const trigger = makeTrigger(rowEl);
        return () => trigger.kill();
      });

      mm.add("(max-width: 767.98px)", () => {
        const listEl = listRef.current;
        if (!listEl) return;
        const trigger = makeTrigger(listEl);
        return () => trigger.kill();
      });

      return () => {
        mm.revert();
        highlightReleaseRef.current?.kill();
      };
    },
    { scope: rootRef, dependencies: [items] },
  );

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start md:gap-20"
    >
      {/* Sticky image well — stays pinned in the viewport (md+) while
          the label list scrolls past it, instead of just being
          height-matched/centered against the list column. `self-start`
          plus `top-24` gives it room to stick without ever needing to
          scroll further than the list column's own height allows;
          it un-sticks naturally once the list (and caption) end,
          since a sticky element can't scroll past its own parent's
          bottom edge. */}
      <div
        ref={wellRef}
        className={`relative aspect-4/3 w-full overflow-hidden sm:aspect-3/2 md:sticky md:top-24 md:self-start ${
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
            const isHighlighted = highlighted === i;

            return (
              <li key={item.label} className="border-b border-black-text/10">
                <div
                  aria-label={item.label}
                  className={`flex w-full items-center py-5 text-left text-[36px] font-normal tracking-tight transition-colors duration-300 ease-out sm:py-6 ${
                    isActive ? "text-black-text" : "text-black-text/35"
                  }`}
                >
                  <SlidingText text={item.label} isHovered={isHighlighted} />
                </div>
              </li>
            );
          })}
        </ul>
        {caption}
      </div>
    </div>
  );
}
