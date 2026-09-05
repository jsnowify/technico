"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* ================================================================
   TILT IN
   ================================================================
   One-shot scroll-into-view entrance: the wrapped element starts
   rotated off its resting angle and settles back to 0deg, the same
   "hidden until scrolled in, fires once" shape as RevealUp/
   RevealUpText elsewhere on this site — just a rotation settle
   instead of a clip-path wipe or a word-by-word y-rise.

   `clearProps: "transform"` on the settle tween strips GSAP's inline
   transform the moment it lands, so a CSS-driven transform utility
   on the SAME element (e.g. a Tailwind `group-hover:-rotate-6`)
   keeps working afterward. Without it, GSAP's inline style would
   permanently win over the class-based hover rotate — inline styles
   beat stylesheet rules regardless of the hover class being applied.
   ================================================================ */

interface TiltInProps {
  children: ReactNode;
  /** Layout classes for the wrapping element — defaults to an inline-block span so it doesn't disturb inline flow. */
  className?: string;
  /** Starting angle (degrees) the element rotates in from. */
  from?: number;
  duration?: number;
  delay?: number;
  /** ScrollTrigger `start` position. */
  start?: string;
}

export default function TiltIn({
  children,
  className = "inline-block",
  from = -20,
  duration = 0.7,
  delay = 0,
  start = "top 85%",
}: TiltInProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion) {
        gsap.set(el, { rotate: 0 });
        return;
      }

      gsap.set(el, { rotate: from, transformOrigin: "50% 50%" });
      gsap.to(el, {
        rotate: 0,
        duration,
        delay,
        ease: "back.out(1.7)",
        clearProps: "transform",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "restart pause resume reverse",
          fastScrollEnd: true,
        },
      });
    },
    { scope: ref, dependencies: [from, duration, delay, start] },
  );

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
