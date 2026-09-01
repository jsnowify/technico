"use client";

import { Fragment, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* ================================================================
   SCROLL FILL TEXT
   ================================================================
   Word-by-word scroll-scrubbed "fill" for a single de-emphasized
   clause sitting inline after a static bold lead-in (see
   ServicesMarketOverview's closing section: the bold black sentence
   is plain static text, and only the dimmed follow-on clause — this
   component — animates in word by word as the page scrolls).

   Renders inline (a <span>, not a block element) so it can sit right
   after the static lead-in inside the same <p> and keep wrapping
   naturally as one paragraph.

   At rest every word sits at `restOpacity` (grayscale/dim); as the
   clause scrolls through the viewport each word's opacity ramps up
   to `targetOpacity` (fully solid) in reading order, tied to scroll
   position via ScrollTrigger's `scrub` — not a one-shot timed
   animation — so words fill in step with how far the user has
   actually scrolled.
   ================================================================ */

export default function ScrollFillText({
  text,
  targetOpacity = 1,
  restOpacity = 0.35,
  className = "",
}: {
  text: string;
  /** Opacity each word settles at once fully "filled"/solid (0–1). */
  targetOpacity?: number;
  /** Opacity every word starts at — the grayscale/dim resting state. */
  restOpacity?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  useGSAP(
    () => {
      const wordEls =
        containerRef.current?.querySelectorAll<HTMLElement>("[data-fill-word]");
      if (!wordEls || wordEls.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(wordEls, { opacity: targetOpacity });
        return;
      }

      gsap.set(wordEls, { opacity: restOpacity });

      gsap.to(wordEls, {
        opacity: targetOpacity,
        stagger: 0.04,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "bottom 55%",
          scrub: 0.4,
        },
      });
    },
    { scope: containerRef, dependencies: [words, targetOpacity, restOpacity] },
  );

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span data-fill-word className="inline">
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}
