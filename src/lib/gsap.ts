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

export { gsap, ScrollTrigger };
