"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

/* ================================================================
   SLIDING ICON
   ================================================================
   Horizontal sibling to SlidingText — same "two stacked copies in
   an overflow-hidden viewport" mechanic, but slides on the X axis
   instead of Y, and takes an icon (ReactNode) instead of a text
   string. Direction controls which way the current copy exits and
   which side the incoming copy enters from:
     - "left"  -> current exits toward -100%, next enters from +100%
     - "right" -> current exits toward +100%, next enters from -100%
   Meant for small directional affordances like prev/next arrows,
   where the icon itself should slide the way it points.

   Structured to match SlidingText exactly: ONE useGSAP call, keyed
   off `isHovered`, that both establishes the resting position (on
   mount, when isHovered is initially false) and drives the hover
   tween — same as SlidingText, no separate mount-only effect. An
   earlier version of this file used a second, separate mount-only
   useGSAP call to pre-set the resting position; that split the
   "current" and "next" copies across two different GSAP contexts,
   and the "next" copy's position ended up not animating in on hover
   as a result — it just sat there statically instead of sliding in.
   Keeping everything in one context (as SlidingText already does)
   avoids that.

   No pointer handlers here on purpose, same as SlidingText — the
   parent button/link is the hit target and owns the hover state.
   ================================================================ */

interface SlidingIconProps {
  icon: React.ReactNode;
  isHovered: boolean;
  /** Which way the current icon exits on hover; the incoming copy enters from the opposite side. */
  direction: "left" | "right";
  /** Optional extra classes on the outer overflow-hidden viewport. */
  className?: string;
}

export default function SlidingIcon({
  icon,
  isHovered,
  direction,
  className = "",
}: SlidingIconProps) {
  const viewportRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const nextRef = useRef<HTMLSpanElement>(null);

  const exitPercent = direction === "left" ? -100 : 100;
  const enterFromPercent = direction === "left" ? 100 : -100;

  useGSAP(
    () => {
      const viewport = viewportRef.current;
      const current = currentRef.current;
      const next = nextRef.current;

      if (!viewport || !current || !next) return;

      if (prefersReducedMotion) {
        gsap.set(current, { xPercent: 0, opacity: 1 });
        gsap.set(next, { xPercent: enterFromPercent, opacity: 1 });
        return;
      }

      gsap.killTweensOf([current, next]);

      if (isHovered) {
        gsap.to(current, {
          xPercent: exitPercent,
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });
        gsap.to(next, {
          xPercent: 0,
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });
      } else {
        gsap.to(current, {
          xPercent: 0,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        });
        gsap.to(next, {
          xPercent: enterFromPercent,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        });
      }
    },
    { dependencies: [isHovered] },
  );

  return (
    <span
      ref={viewportRef}
      aria-hidden="true"
      className={`relative inline-flex h-4 w-4 items-center justify-center overflow-hidden ${className}`}
    >
      <span
        ref={currentRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
      >
        {icon}
      </span>
      <span
        ref={nextRef}
        className="absolute inset-0 flex items-center justify-center will-change-transform"
      >
        {icon}
      </span>
    </span>
  );
}
