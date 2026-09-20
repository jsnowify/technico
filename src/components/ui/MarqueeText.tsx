"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import TransitionLink from "@/components/layout/TransitionLink";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

interface MarqueeTextProps {
  /** Short repeating phrase, e.g. "LET'S CONNECT". Keep it brief —
   *  a long phrase makes the loop feel sluggish. */
  text?: string;
  /** Optional — wraps the whole row in a link (whole-row CTA, like
   *  services' "Let's connect" band). Omit to render a plain,
   *  non-interactive marquee. */
  cta?: { label: string; href: string };
  /** Cursor accent when `cta` is set — see GlobalCursor.tsx's
   *  `data-cursor-accent` (defaults to purple there if omitted). */
  accent?: "pink" | "purple";
  /** How many times `text` repeats per half-set. Bump this up for
   *  short words on wide screens so the loop never shows a gap. */
  repeat?: number;
  className?: string;
}

/**
 * MarqueeText
 * -----------------------------------------------------------------
 * Reusable, full-bleed, two-row endless marquee — `text` repeats
 * edge-to-edge, row 1 drifting left and row 2 (mirrored) drifting
 * right. Optionally wraps the row in a single link via `cta` (opts
 * into the global cursor, same as the services "Let's connect" band).
 *
 * SEAMLESS LOOP, THE ACTUAL MATH — each track renders its content
 * TWICE back to back (two "half" wrapper divs) so it can be wrapped
 * mid-scroll without ever showing an edge. The distance to wrap by
 * has to be exactly the width of one half INCLUDING the gap that
 * follows it — call that the "period" — because that's the distance
 * after which the track looks identical to where it started.
 *
 * An earlier version of this used `track.scrollWidth / 2` for that
 * distance. That's wrong whenever there's a gap between the two
 * halves (there always is — see the `gap-*` on the track below):
 * `scrollWidth` is `2 * halfWidth + gap`, so dividing by 2 undershoots
 * the true period by half a gap. Every wrap then landed the visible
 * content in the MIDDLE of a gap instead of back at the start of the
 * pattern — a small but very visible stutter/snap on every cycle,
 * however long you let it run.
 *
 * Fixed by measuring the real period directly: the horizontal
 * distance between the two half-wrappers' `offsetLeft` (i.e. where
 * the second copy actually starts), which is exact regardless of the
 * gap's value at any breakpoint. Row 2 mirrors row 1 by starting its
 * running total a full period behind and counting the opposite way.
 *
 * PERFORMANCE, ACROSS LOW-END TO HIGH-END DEVICES:
 *  - One shared `gsap.ticker` callback drives both rows (was two
 *    separate callbacks) — half the per-frame function-call overhead
 *    for the same visual result.
 *  - `IntersectionObserver` pauses the ticker entirely while the
 *    marquee is scrolled out of view (with a little rootMargin so it
 *    resumes just before it's on screen). No point spending a
 *    rAF callback + two style writes a frame animating pixels nobody
 *    can see — this matters most on low-end/battery-constrained
 *    devices where every unnecessary rAF callback competes with
 *    everything else on the main thread.
 *  - `ResizeObserver` re-measures the period (rAF-throttled) whenever
 *    the track's rendered width changes — a responsive font-size
 *    breakpoint, a browser resize, an orientation flip — so the fix
 *    above can't quietly go stale and reintroduce the seam after a
 *    layout change.
 *  - Only `transform` is ever written per frame (no layout/paint
 *    triggered by the animation itself), and `will-change: transform`
 *    hints the compositor to keep both tracks on their own layer
 *    up front rather than promoting them mid-scroll.
 *  - `prefers-reduced-motion` still skips the whole effect, same as
 *    before — no observers, no ticker, static text.
 */

// px/sec, independent of frame rate.
const MARQUEE_SPEED = 90;

/** Distance from the start of the first "half" to the start of the
 *  second — i.e. the true repeat period, gap included. Falls back to
 *  scrollWidth / 2 only if the expected two-child structure isn't
 *  there for some reason. */
function measurePeriod(track: HTMLDivElement): number {
  const first = track.children[0] as HTMLElement | undefined;
  const second = track.children[1] as HTMLElement | undefined;
  if (!first || !second) return track.scrollWidth / 2;
  return second.offsetLeft - first.offsetLeft;
}

export default function MarqueeText({
  text = "LET'S CONNECT",
  cta,
  accent,
  repeat = 6,
  className,
}: MarqueeTextProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackRef2 = useRef<HTMLDivElement>(null);

  // One "set" is the text repeated a few times — each row renders
  // this set twice (see the two wrapper divs below) so the loop
  // wraps seamlessly in both directions.
  const SET = Array.from({ length: repeat }, () => text);

  const wordClassName =
    "text-[40px] leading-none font-medium tracking-tight text-white sm:text-[64px] md:text-[80px]";

  useGSAP(
    () => {
      const track = trackRef.current;
      const track2 = trackRef2.current;
      if (!track || !track2 || prefersReducedMotion) return;

      let period = measurePeriod(track);
      let wrap = gsap.utils.wrap(-period, 0);

      // Row 1 drifts left from 0; row 2 starts a full period behind
      // and drifts right, so the two are always mirrored.
      const xRef1 = { current: 0 };
      const xRef2 = { current: -period };

      const tick = () => {
        const dt = gsap.ticker.deltaRatio(60) / 60; // seconds this frame
        const delta = MARQUEE_SPEED * dt;

        xRef1.current -= delta;
        xRef2.current += delta;

        // Keep both running totals bounded over a long idle session —
        // shifting either by a whole period never changes where it
        // wraps to, so it's invisible to the render.
        if (Math.abs(xRef1.current) > period * 50) {
          xRef1.current -= Math.round(xRef1.current / period) * period;
        }
        if (Math.abs(xRef2.current) > period * 50) {
          xRef2.current -= Math.round(xRef2.current / period) * period;
        }

        gsap.set(track, { x: wrap(xRef1.current) });
        gsap.set(track2, { x: wrap(xRef2.current) });
      };

      // Only run the ticker while the marquee is actually visible.
      let ticking = false;
      let intersecting = false;
      const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const start = () => {
        if (ticking) return;
        ticking = true;
        track.style.willChange = "transform";
        track2.style.willChange = "transform";
        gsap.ticker.add(tick);
      };
      const stop = () => {
        if (!ticking) return;
        ticking = false;
        track.style.willChange = "auto";
        track2.style.willChange = "auto";
        gsap.ticker.remove(tick);
      };

      const sync = () => {
        if (intersecting && !document.hidden && !motion.matches) start();
        else stop();
      };
      const io = new IntersectionObserver(([entry]) => {
        intersecting = entry.isIntersecting;
        sync();
      });
      io.observe(track);
      document.addEventListener("visibilitychange", sync);
      motion.addEventListener("change", sync);

      // Re-measure whenever the track's rendered width changes, so a
      // responsive breakpoint or a window resize/orientation change
      // can't leave the period (and therefore the wrap point) stale.
      let resizeFrame = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          const next = measurePeriod(track);
          if (!next || next === period) return;
          period = next;
          wrap = gsap.utils.wrap(-period, 0);
          // Fold both running totals into the fresh bounds so the very
          // next frame after a resize is still seamless.
          xRef1.current = gsap.utils.wrap(-period, 0)(xRef1.current);
          xRef2.current =
            gsap.utils.wrap(-period, 0)(xRef2.current + period) - period;
        });
      });
      ro.observe(track);

      return () => {
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", sync);
        motion.removeEventListener("change", sync);
        cancelAnimationFrame(resizeFrame);
        stop();
      };
    },
    { dependencies: [text, repeat], revertOnUpdate: true },
  );

  const rows = (
    <>
      {/* Row 1 — drifts left. */}
      <div
        ref={trackRef}
        aria-hidden="true"
        className="flex w-max shrink-0 items-center gap-10 whitespace-nowrap sm:gap-14"
      >
        {[0, 1].map((half) => (
          <div
            key={half}
            className="flex shrink-0 items-center gap-10 sm:gap-14"
          >
            {SET.map((word, i) => (
              <span key={i} className={wordClassName}>
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Row 2 — mirrored, drifts right. */}
      <div
        ref={trackRef2}
        aria-hidden="true"
        className="flex w-max shrink-0 items-center gap-10 whitespace-nowrap sm:gap-14"
      >
        {[0, 1].map((half) => (
          <div
            key={half}
            className="flex shrink-0 items-center gap-10 sm:gap-14"
          >
            {SET.map((word, i) => (
              <span key={i} className={wordClassName}>
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <section className={className ?? "bg-black-bg"}>
      <div className="relative overflow-hidden py-14 sm:py-20 md:py-24">
        {cta ? (
          <TransitionLink
            to={cta.href}
            aria-label={cta.label}
            data-cursor="circle"
            data-cursor-label={cta.label}
            data-cursor-accent={accent}
            className="group flex w-full flex-col gap-6 sm:gap-8"
          >
            {rows}
            {/* Screen-reader-only accessible label — the marquee rows
                above are aria-hidden since they're decorative repetition. */}
            <span className="sr-only">{cta.label}</span>
          </TransitionLink>
        ) : (
          <div
            aria-label={text}
            className="flex w-full flex-col gap-6 sm:gap-8"
          >
            {rows}
          </div>
        )}
      </div>
    </section>
  );
}
