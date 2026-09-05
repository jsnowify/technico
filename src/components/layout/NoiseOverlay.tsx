"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * NoiseOverlay — a faint SVG feTurbulence grain layered over the
 * entire viewport, purely decorative texture on top of whatever page
 * content is underneath.
 *
 * Mounted once in app/layout.tsx, as a sibling of Header/Footer
 * outside `{children}`, so it's `position: fixed` against the
 * viewport (not any one page's layout) and covers every route
 * uniformly instead of being re-implemented per section.
 *
 * Originally built inline inside Strategy.tsx as a one-off
 * background accent for that section only; promoted here so the same
 * grain reads consistently across the whole site instead of only
 * appearing on one panel.
 *
 * NO BLEND MODE. An earlier version used `mix-blend-screen` with
 * pure-white specks, which only ever *adds* light: fine on this
 * site's near-black sections, invisible on white ones (white-on-
 * white = no visible change). Any single blend mode has that same
 * one-sided problem, and this site has both light and dark sections.
 *
 * The feColorMatrix does two things at once:
 *   - RGB rows are constant 0.5 (not derived from the turbulence
 *     input at all) — every speck is a fixed mid-grey, equally
 *     visible against dark and light sections instead of skewing
 *     toward one or the other.
 *   - The alpha row (`0 0 0 4 -1`) pushes the turbulence's naturally
 *     low-contrast alpha so the *transparency* itself has real
 *     contrast — distinct denser specks rather than a flat haze.
 * True alpha compositing (no mix-blend-mode) means those grey specks
 * show up as grain on literally any background color underneath.
 *
 * TV-STATIC BEHAVIOR: the grain sits still while the page is
 * scrolling and only flickers/crawls (real TV-static style, via
 * `steps()` jumping between background positions rather than a
 * smooth pan) once scrolling has stopped for a beat. Static-while-
 * moving would just be visual noise competing with the scroll
 * itself; saving the flicker for when the page is at rest makes it
 * read as an idle/ambient detail instead.
 *
 * SCROLL DETECTION: a native `scroll` listener on window, not a
 * Lenis-specific hook. SmoothScrollProvider's Lenis instance smooths
 * *native* window scrolling directly rather than replacing it with
 * its own virtual scroll container, so the native `scroll` event
 * still fires throughout Lenis's eased glide — this component
 * doesn't need to reach into Lenis's instance to know the page is
 * moving. "Stopped" is debounced 150ms after the last scroll event
 * (not the instant it fires) so Lenis's trailing glide doesn't read
 * as a false "stopped" the moment the wheel tick ends.
 *
 * REDUCED MOTION: when the user prefers reduced motion, the overlay
 * renders as static grain only — the flicker animation is skipped
 * entirely rather than just paused, matching how
 * SmoothScrollProvider treats the same setting for scrolling itself.
 */

const NOISE_SVG_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix in='t' type='matrix' values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 4 -1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

// How long (ms) after the last scroll event before we call the page
// "stopped" and let the static flicker start.
const IDLE_DELAY_MS = 150;

export default function NoiseOverlay() {
  const [isIdle, setIsIdle] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleScroll = () => {
      setIsIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsIdle(true), IDLE_DELAY_MS);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <>
      {/* Scoped keyframes rather than a globals.css addition — this
          animation belongs to this one component and nothing else
          on the site needs to share or override it. */}
      <style>{`
        @keyframes noise-static-flicker {
          0%   { background-position: 0 0; }
          10%  { background-position: -37px 12px; }
          20%  { background-position: 22px -48px; }
          30%  { background-position: -63px -19px; }
          40%  { background-position: 41px 33px; }
          50%  { background-position: -18px 57px; }
          60%  { background-position: 54px -27px; }
          70%  { background-position: -44px -52px; }
          80%  { background-position: 16px 40px; }
          90%  { background-position: -29px -8px; }
          100% { background-position: 0 0; }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] opacity-[0.15]"
        style={{
          backgroundImage: NOISE_SVG_DATA_URI,
          animation: prefersReducedMotion
            ? undefined
            : "noise-static-flicker 0.5s steps(1) infinite",
          animationPlayState: isIdle ? "running" : "paused",
        }}
      />
    </>
  );
}
