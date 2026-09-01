"use client";

import { useLayoutEffect, useState } from "react";

// Real useLayoutEffect in the browser, so the mobile carousel swaps in
// before the first paint instead of flashing the desktop marquee for
// a frame. React warns if useLayoutEffect runs during SSR (it's a
// no-op there), and this "use client" component still gets rendered
// once on the server — so on the server (and during that first
// pre-hydration pass) this falls back to a no-op, same trick as
// react-use's useIsomorphicLayoutEffect.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : () => {};

// Matches Tailwind's `sm` breakpoint (640px) used everywhere else in
// this component tree — below it is the single-column mobile layout.
const MOBILE_QUERY = "(max-width: 639px)";

/**
 * Starts `false` (matching SSR and the pre-hydration client render —
 * same reasoning as usePrefersReducedMotion/useSupportsFinePointer in
 * lib/gsap.ts), then syncs to the real value. Unlike those two, this
 * one keeps listening: rotating a phone or resizing a desktop window
 * across the breakpoint should still swap layouts without a refresh.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY);
    setIsMobile(mql.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
