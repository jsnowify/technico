"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * Lenis eases every wheel tick out over ~1 second instead of moving
 * the page 1:1 with the input — great for the marketing pages' feel,
 * but on a long article it reads as the page "lagging" behind your
 * scrolling, because that's literally what it's doing on purpose.
 * Blog post pages are skipped so reading scrolls natively (instant,
 * no residual glide) while the rest of the site keeps the smoothed
 * feel.
 */
function isLongFormReadingRoute(pathname: string): boolean {
  return pathname.startsWith("/blog/") && pathname !== "/blog";
}

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
 * TUNING: eased for a smooth "glassy" glide without an exaggerated
 * trailing tail — a shorter duration + cubic ease (vs. the earlier
 * 1.8s quintic) so a quick reversal (scroll up right after scrolling
 * down) doesn't visibly fight the previous glide's residual motion,
 * which read as a "bounce back." Touch is intentionally left at its
 * native multiplier (see above) since touch isn't smoothed at all
 * here.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion || isLongFormReadingRoute(pathname)) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
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
    // Re-run on route change: this is a persistent layout-level
    // provider (mounted once in app/layout.tsx), so navigating
    // between a blog post and any other page needs to tear down or
    // (re)create the Lenis instance rather than being decided once
    // on first mount.
  }, [pathname]);

  return <>{children}</>;
}
