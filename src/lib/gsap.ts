import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/*
 * Register plugins once, here, so every other file can just import
 * { gsap, ScrollTrigger } and trust the plugins are already wired up.
 *
 * useGSAP is registered as a gsap plugin too — this is what lets you
 * call the useGSAP() hook elsewhere without each file needing its own
 * registration call.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

/*
 * Single source of truth for "should this app animate."
 *
 * Read once at module load. This intentionally does NOT react to the
 * user flipping the OS setting mid-session — every component that
 * checks it already branches on this value at animation-setup time
 * (inside useGSAP), so a live-updating version would need those
 * effects to re-run on a media query change too. Simple + predictable
 * beats "technically reactive but nothing listens for it."
 */
export const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
 * Single source of truth for "does this device have a real hover/
 * precision pointer" — read once at module load, same reasoning as
 * `prefersReducedMotion` above (a device's pointer type doesn't
 * change mid-session).
 *
 * This exists because pointer *events* (onPointerMove/Enter/Leave)
 * fire for touch input too, not just mouse — a finger dragging
 * across a card mid-scroll, or tapping a nav link, still emits
 * pointermove/pointerenter/pointerleave. Any effect built around
 * "the pointer hovers, then leaves" (magnetic nav links, TiltCard,
 * OrbitDial's pointer-tilt) reads that touch gesture as a hover and
 * runs its GSAP quickTo math every frame during what is actually a
 * scroll — the worst possible moment to spend cycles on a phone or
 * tablet — and can leave the element visually "stuck" mid-tilt if
 * pointerleave never fires cleanly for the gesture.
 *
 * Gating those effects on `pointer: fine` (mouse/trackpad) rather
 * than only on prefersReducedMotion is what actually fixes that:
 * touch/coarse-pointer devices (phones, and — importantly — tablets
 * like iPad that are wide enough to render the desktop nav layout)
 * skip the pointer-tilt/magnetic math entirely and fall back to
 * their plain CSS states.
 */
export const supportsFinePointer =
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

export { gsap, ScrollTrigger };
