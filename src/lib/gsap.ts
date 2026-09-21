import { useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Header.tsx (and anything else animated) imports gsap/ScrollTrigger
 * from here rather than straight from the packages so plugin
 * registration happens exactly once, in exactly one place.
 *
 * Only register ScrollTrigger: no current component imports Draggable,
 * InertiaPlugin or Flip, and eagerly bundling all three increases JS cost.
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
 * Built on `useSyncExternalStore` rather than a `useEffect` that
 * calls `setState` once on mount: matchMedia is genuinely external
 * state (the browser owns it, not React), which is exactly what
 * `useSyncExternalStore` exists for. It also solves the SSR/hydration
 * problem the old effect-based version was working around by hand —
 * `getServerSnapshot` returns `false` during the server render (and
 * during hydration, before the client has committed), so there's no
 * server/client markup mismatch, and React swaps in the real
 * `getSnapshot` value right after. No effect body, so nothing here
 * calls setState synchronously inside one.
 *
 * `subscribe` is a no-op (never invokes its callback) rather than
 * wiring up matchMedia's own `change` event, on purpose: same as
 * before, if the user flips their OS-level setting mid-session, the
 * app won't reactively pick it up. Effects and event handlers can
 * keep using the plain constants above; they never run during SSR,
 * so there's nothing for them to mismatch.
 */
function subscribeNoop() {
  return () => {};
}

function getReducedMotionSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function getSupportsFinePointerSnapshot(): boolean {
  return window.matchMedia("(pointer: fine)").matches;
}

function getSupportsFinePointerServerSnapshot(): boolean {
  return false;
}

export function useSupportsFinePointer(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    getSupportsFinePointerSnapshot,
    getSupportsFinePointerServerSnapshot,
  );
}

export { gsap, ScrollTrigger };
