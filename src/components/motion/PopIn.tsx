"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* ================================================================
   POP IN
   ================================================================
   One-shot scroll-into-view entrance: the wrapped element starts
   scaled to 0 and pops up to its resting scale (1) with a bouncy
   overshoot, the same "hidden until scrolled in, fires once" shape
   as TiltIn/RevealUp elsewhere on this site — just a scale pop
   instead of a rotation settle or a clip-path wipe.

   Meant for small sticker-style badges (e.g. a highlighted word)
   where the resting rotation is a plain CSS utility class on the
   SAME element — `clearProps: "transform"` on the settle tween
   strips GSAP's inline transform the moment it lands, so a
   Tailwind `-rotate-2` (or similar) on this element keeps applying
   afterward instead of being permanently overridden by GSAP's
   inline style.
   ================================================================ */

interface PopInProps {
  children: ReactNode;
  /** Layout classes for the wrapping element — defaults to an inline-block span so it doesn't disturb inline flow. */
  className?: string;
  duration?: number;
  delay?: number;
  /** ScrollTrigger `start` position. */
  start?: string;
}

export default function PopIn({
  children,
  className = "inline-block",
  duration = 0.6,
  delay = 0,
  start = "top 85%",
}: PopInProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion) {
        gsap.set(el, { scale: 1 });
        return;
      }

      gsap.set(el, { scale: 0, transformOrigin: "50% 50%" });
      gsap.to(el, {
        scale: 1,
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
    { scope: ref, dependencies: [duration, delay, start] },
  );

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
