"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Wires up Lenis smooth scrolling for the whole site and keeps it in
 * lockstep with GSAP's ScrollTrigger (used in Header/index.tsx for
 * the scroll-triggered pill morph).
 *
 * Renders no DOM of its own — Lenis v1 smooths native window
 * scrolling directly, it doesn't need a wrapper/content div pair the
 * way older smooth-scroll libraries did. That means it doesn't
 * interfere with the header's `position: sticky` or with anything
 * else already in the tree.
 *
 * REDUCED MOTION: Lenis is never instantiated when the user prefers
 * reduced motion. Native scrolling, keyboard navigation (PageUp/
 * PageDown/Home/End/arrows), and #anchor jumps are left completely
 * untouched in that case rather than being smoothed and then
 * disabled — there's no in-between state to accidentally ship.
 *
 * KEYBOARD / ANCHOR LINKS: even when Lenis IS active, it only
 * intercepts wheel and touch input. Keyboard scrolling and anchor
 * links still go through the browser's native scroll, which Lenis
 * then smooths like any other scroll — it doesn't hijack or replace
 * that input path.
 *
 * TUNING: duration/wheelMultiplier bumped from the defaults to get a
 * heavier, more "glassy" glide (longer settle instead of snapping to
 * a stop) matching the reference site's feel. Each wheel tick eases
 * out over ~1.8s using a quintic tail, so after the user stops
 * scrolling there's a clearly visible bit of leftover glide before
 * it settles — not just an instant stop. Touch is intentionally left
 * at its native multiplier (see above) since touch isn't smoothed at
 * all here.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => 1 - Math.pow(1 - t, 5),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    // ScrollTrigger normally reads the raw native scroll position.
    // With Lenis interpolating that position across frames, anything
    // pinned or scrubbed would visually lag a frame behind unless
    // ScrollTrigger is explicitly told to re-check on every Lenis
    // tick instead.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis off GSAP's existing rAF ticker rather than starting
    // a second, independent requestAnimationFrame loop alongside it —
    // one driver for both instead of two competing for the same frame.
    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);

    // GSAP's ticker smooths over long frames (tab switches, etc.) by
    // faking elapsed time, which fights with Lenis doing its own
    // interpolation. Lenis owns that job now, so GSAP's is turned off.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
