import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Header.tsx (and anything else animated) imports gsap/ScrollTrigger
 * from here rather than straight from the packages so plugin
 * registration happens exactly once, in exactly one place.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Read once per client render, not tracked reactively. If the user
 * flips their OS-level reduced-motion or pointer setting mid-session
 * the app won't pick it up without a refresh — that's the same
 * behavior these flags had before this file existed as a shared
 * module, just centralized so every component reads the same value
 * instead of re-querying matchMedia itself.
 *
 * `typeof window` guards let these evaluate safely during SSR /
 * the client component's first server-rendered pass (both resolve
 * to `false` there and pick up the real value on hydration).
 */
export const prefersReducedMotion: boolean =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const supportsFinePointer: boolean =
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/**
 * Hook versions of the two flags above, for the rare cases where the
 * value feeds directly into RENDER OUTPUT (a className, some text)
 * rather than just gating a useGSAP effect or an event handler.
 *
 * The module-level constants are evaluated the instant the client JS
 * bundle loads — before React hydrates — so they already hold the
 * real browser value by the time hydration runs, while the server
 * always rendered `false`. Reading them straight in JSX makes React
 * see a live mismatch between server and client markup.
 *
 * These hooks avoid that by starting at `false` (matching the server)
 * on every render up through hydration, then flipping to the real
 * value in a `useEffect`, which only ever runs after hydration is
 * done. Effects and event handlers can keep using the plain constants
 * above; they never run during SSR, so there's nothing for them to
 * mismatch.
 */
export function usePrefersReducedMotion(): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    setValue(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return value;
}

export function useSupportsFinePointer(): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    setValue(window.matchMedia("(pointer: fine)").matches);
  }, []);

  return value;
}

export { gsap, ScrollTrigger };
