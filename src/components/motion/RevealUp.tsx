"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* ================================================================
   REVEAL UP
   ================================================================
   Scroll-into-view entrance: the wrapped block is completely masked
   off (clip-path: inset(100% 0 0 0) — the visible window has zero
   height, collapsed against the block's own bottom edge) until it
   scrolls into view. Once triggered, the mask's top edge sweeps
   fast from the very bottom of the block up to the true top,
   uncovering the content bottom-first as it goes — a hard-edge
   wipe, not a fade/slide, so the reveal reads as a quick "opening
   window" rather than the content itself easing into place. Fires
   once, on crossing `start: "top 80%"` — the same one-shot
   scroll-entrance shape used elsewhere on this site (see
   TextRevealBlock, ServicesAccordion).

   Unlike TextRevealBlock's per-line curtain wipe (which needs each
   line's text passed separately so its mask can match that line's
   width), this clips the whole wrapped block as one piece — so it
   works for content that mixes plain text with inline interactive
   elements (e.g. a heading containing a <Link>) where fluid,
   responsive wrapping means the exact line breaks aren't known
   ahead of time. The outer element (`as`) stays untouched so it
   keeps its semantic role (h2, etc.); the clip-path lives on an
   inner wrapper div, which inherits the outer element's typography
   via normal CSS inheritance.
   ================================================================ */

interface RevealUpProps {
  children: ReactNode;
  /** Outer semantic wrapper — defaults to a plain div. */
  as?: ElementType;
  /** Typography/layout classes — put these on the outer element as usual. */
  className?: string;
  duration?: number;
  delay?: number;
}

export default function RevealUp({
  children,
  as: Tag = "div",
  className = "",
  duration = 0.5,
  delay = 0,
}: RevealUpProps) {
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = innerRef.current;
      if (!el) return;

      if (prefersReducedMotion) {
        gsap.set(el, { clipPath: "inset(0% 0 0 0)" });
        return;
      }

      gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
      gsap.to(el, {
        clipPath: "inset(0% 0 0 0)",
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      });
    },
    { scope: innerRef },
  );

  return (
    <Tag className={className}>
      <div ref={innerRef}>{children}</div>
    </Tag>
  );
}
