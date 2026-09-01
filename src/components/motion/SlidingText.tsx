"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

/* ================================================================
   SLIDING TEXT
   ================================================================
   Shared by Header's NavItem and Footer's MagneticSlideLink (and
   anywhere else that wants the effect) so the tween values only
   live in one place.

   Two stacked copies of the label sit in an overflow-hidden
   viewport. On hover the current copy slides up and out
   (0 -> -100%) while the next copy slides up and in from below
   (100% -> 0%). Leave reverses both.

   No pointer handlers here on purpose — the parent link is the only
   hit target, so this can't fight the parent's own hover state by
   firing its own enter/leave.
   ================================================================ */

interface SlidingTextProps {
  text: string;
  isHovered: boolean;
  /** Optional extra classes on the outer overflow-hidden viewport. */
  className?: string;
}

export default function SlidingText({
  text,
  isHovered,
  className = "",
}: SlidingTextProps) {
  const viewportRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const nextRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const viewport = viewportRef.current;
      const current = currentRef.current;
      const next = nextRef.current;

      if (!viewport || !current || !next) return;

      if (prefersReducedMotion) {
        gsap.set(current, { yPercent: 0, opacity: 1 });
        gsap.set(next, { yPercent: 100, opacity: 1 });
        return;
      }

      gsap.killTweensOf([current, next]);

      if (isHovered) {
        gsap.to(current, {
          yPercent: -100,
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });
        gsap.to(next, {
          yPercent: 0,
          duration: 0.55,
          ease: "power3.out",
          overwrite: true,
        });
      } else {
        gsap.to(current, {
          yPercent: 0,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        });
        gsap.to(next, {
          yPercent: 100,
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
      className={`relative inline-block h-[1em] min-w-0 overflow-hidden align-middle leading-none ${className}`}
    >
      <span
        ref={currentRef}
        className="block leading-none whitespace-nowrap will-change-transform"
      >
        {text}
      </span>
      <span
        ref={nextRef}
        className="absolute inset-x-0 top-0 block leading-none whitespace-nowrap will-change-transform"
      >
        {text}
      </span>
    </span>
  );
}
