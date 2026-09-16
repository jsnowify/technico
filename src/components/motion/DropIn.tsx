"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* ================================================================
   DROP IN
   ================================================================
   One-shot scroll-into-view entrance: the wrapped element starts
   above its resting spot and rotated off-angle, then falls + tilts
   back to its natural position with a springy overshoot — reads as
   "dropped in and settled," not a continuous physics simulation.
   Same "hidden until scrolled in, fires once" shape as TiltIn/PopIn
   elsewhere on this site; this one just combines a y-fall with the
   rotation settle instead of doing either alone.

   Deliberately NOT Matter.js/a real physics engine (see
   ServiceTagsPhysics.tsx for that heavier approach) — a single
   GSAP tween with a `back.out` ease gets the same "fell into place,
   slight overshoot, done" read for a one-shot entrance, at a
   fraction of the cost and with zero risk of the element continuing
   to drift/jitter after landing. It settles once and stays put.

   `clearProps: "transform"` on the settle tween strips GSAP's inline
   transform the moment it lands, so a CSS-driven transform utility
   on the SAME element (e.g. a Tailwind `-rotate-3`) keeps applying
   afterward instead of being permanently pinned at rotate:0 — same
   trick TiltIn/PopIn use. Pass that resting tilt as a Tailwind class
   in `className`, not as a prop here.
   ================================================================ */

interface DropInProps {
  children: ReactNode;
  /** Layout classes for the wrapping element. Put the element's
   *  RESTING rotation here too (e.g. `-rotate-3`) if it should land
   *  tilted — clearProps hands control back to this class once the
   *  entrance tween finishes. */
  className?: string;
  /** Starting vertical offset (px) it falls in from — negative = above resting spot. */
  fromY?: number;
  /** Starting angle (degrees) it rotates in from, on top of whatever resting tilt the className provides. */
  fromRotate?: number;
  duration?: number;
  delay?: number;
  /** ScrollTrigger `start` position. */
  start?: string;
}

export default function DropIn({
  children,
  className = "",
  fromY = -60,
  fromRotate = -12,
  duration = 0.8,
  delay = 0,
  start = "top 85%",
}: DropInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion) {
        gsap.set(el, { y: 0, rotate: 0 });
        return;
      }

      gsap.set(el, {
        y: fromY,
        rotate: fromRotate,
        transformOrigin: "50% 50%",
      });
      gsap.to(el, {
        y: 0,
        rotate: 0,
        duration,
        delay,
        ease: "back.out(1.6)",
        clearProps: "transform",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "restart pause resume reverse",
          fastScrollEnd: true,
        },
      });
    },
    { scope: ref, dependencies: [fromY, fromRotate, duration, delay, start] },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
