"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import { gsap, prefersReducedMotion, supportsFinePointer } from "@/lib/gsap";

/** Persistent CTA using the same connected-grid language as the site. */

// --- marquee tuning -------------------------------------------------
// Idle pace, px/sec — deliberately slow/"quiet" so the button reads as
// calm chrome, not a distraction, when the user isn't scrolling.
const MARQUEE_BASE_SPEED = 26;
// Ceiling on how much a scroll-down fling can add on top of the base
// pace. Without a cap, a big scroll jump (momentum scrolling, an
// anchor-link jump) would compute a huge instantaneous velocity and
// spin the text unreadably fast for a frame or two.
const MARQUEE_MAX_BOOST = 260;
// How much of each scroll sample's velocity becomes boost. `scroll`
// fires many times a second during a fling, so this doesn't need to
// be large — small additions from consecutive samples stack up to the
// cap within a few frames of sustained scrolling.
const MARQUEE_BOOST_GAIN = 0.12;
// Boost half-life, in seconds — how quickly the extra speed decays
// back toward the idle pace once scrolling stops or reverses.
const MARQUEE_BOOST_HALF_LIFE = 0.4;
// Clamp on a single scroll sample's velocity, so one freak reading (a
// big momentum-scroll jump between two samples) can't blow past the
// boost cap in a single step.
const MARQUEE_MAX_SAMPLE_VELOCITY = 4000;
// Mobile: scroll boosts are capped and smoothed rather than accumulated
// per touch-scroll event. Rendering still runs at the display's native rate.
const MARQUEE_MOBILE_MAX_BOOST = 85;
const MARQUEE_MOBILE_BOOST_GAIN = 0.045;
const MARQUEE_MOBILE_SMOOTHING = 0.12; // seconds

const MARQUEE_WORD = "Let\u2019s connect";
const MARQUEE_REPEAT = 3;

/** Distance from the start of the first "half" to the start of the
 *  second — the true seamless-loop repeat period, gap included.
 *  Matters because `scrollWidth / 2` undershoots by half a gap
 *  whenever there's spacing between the two halves, which turns every
 *  wrap into a visible stutter. Same fix as components/ui/MarqueeText.tsx. */
function measurePeriod(track: HTMLElement): number {
  const first = track.children[0] as HTMLElement | undefined;
  const second = track.children[1] as HTMLElement | undefined;
  if (!first || !second) return track.scrollWidth / 2;
  return second.offsetLeft - first.offsetLeft;
}

export default function StickyConnectCTA() {
  const pathname = usePathname();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    const main = document.querySelector("main");
    const track = trackRef.current;
    if (!link || !main) return;

    let frame = 0;
    let hidden = false;
    // Cache geometry: measuring offsetTop/offsetHeight every scroll frame
    // can force layout while the mobile marquee is trying to animate.
    let mainBottom = main.offsetTop + main.offsetHeight;

    const update = () => {
      frame = 0;
      const nextHidden = window.scrollY + window.innerHeight > mainBottom + 1;
      if (nextHidden === hidden) return;
      hidden = nextHidden;
      link.style.pointerEvents = hidden ? "none" : "";
      syncTicker();

      if (prefersReducedMotion) {
        gsap.set(link, { autoAlpha: hidden ? 0 : 1, y: hidden ? 14 : 0 });
        return;
      }

      gsap.to(link, {
        autoAlpha: hidden ? 0 : 1,
        y: hidden ? 14 : 0,
        duration: hidden ? 0.28 : 0.42,
        ease: hidden ? "power2.in" : "power3.out",
        overwrite: true,
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      mainBottom = main.offsetTop + main.offsetHeight;
      requestUpdate();
    };

    // --- marquee: seamless loop + scroll-velocity speed boost -------
    // One shared `gsap.ticker` callback drives the loop. The same
    // passive `scroll` listener already needed for show/hide also
    // feeds it a velocity sample below, so the marquee adds zero
    // extra event listeners on top of what this component already had.
    let period = track ? measurePeriod(track) : 0;
    let wrap = period > 0 ? gsap.utils.wrap(-period, 0) : (_value: number) => 0;
    // quickSetter avoids building a GSAP vars object and parsing it each frame.
    const setTrackX = track ? gsap.quickSetter(track, "x", "px") : null;
    let x = 0;
    let boost = 0;
    let targetBoost = 0;
    let ticking = false;

    // Do not throttle mobile to 30fps: uneven frame skipping makes an
    // otherwise smooth translate look especially choppy on 90/120Hz phones.
    // GSAP supplies frame delta in ms; cap it to avoid jumps after stalls.
    const tick = (_time: number, deltaTime: number) => {
      if (!period || !setTrackX) return;
      const dt = Math.min(deltaTime / 1000, 0.05);
      const decay = Math.exp((-Math.LN2 * dt) / MARQUEE_BOOST_HALF_LIFE);

      if (supportsFinePointer) {
        boost *= decay; // retain existing desktop scroll response
      } else {
        targetBoost *= decay;
        // Ease mobile speed changes instead of stepping the text at each
        // scroll event. Idle speed and direction stay the same.
        boost +=
          (targetBoost - boost) *
          (1 - Math.exp(-dt / MARQUEE_MOBILE_SMOOTHING));
      }

      x = wrap(x - (MARQUEE_BASE_SPEED + boost) * dt);
      setTrackX(x);
    };

    const startTicker = () => {
      if (ticking || !track) return;
      ticking = true;
      // Only promote the active marquee to its own composited layer.
      track.style.willChange = "transform";
      gsap.ticker.add(tick);
    };
    const stopTicker = () => {
      if (!ticking) return;
      ticking = false;
      if (track) track.style.willChange = "auto";
      gsap.ticker.remove(tick);
    };
    // The marquee only needs to run while the button itself is
    // visible. Reusing the show/hide state above instead of a second
    // IntersectionObserver — this element is `position: fixed`, so
    // it's always geometrically "in the viewport" and IO alone
    // wouldn't notice the opacity-hidden state anyway.
    const syncTicker = () => {
      if (!hidden && !document.hidden && !prefersReducedMotion) startTicker();
      else stopTicker();
    };

    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const y = window.scrollY;
      const t = performance.now();
      const dt = (t - lastT) / 1000;
      if (dt > 0) {
        const dy = y - lastY;
        // Only a downward scroll adds boost — scrolling up (or a
        // stray sub-pixel jitter) leaves the marquee at its idle pace
        // instead of speeding it up too.
        if (dy > 0) {
          const sampleVelocity = Math.min(MARQUEE_MAX_SAMPLE_VELOCITY, dy / dt);
          if (supportsFinePointer) {
            boost = Math.min(
              MARQUEE_MAX_BOOST,
              boost + sampleVelocity * MARQUEE_BOOST_GAIN,
            );
          } else {
            targetBoost = Math.max(
              targetBoost,
              Math.min(
                MARQUEE_MOBILE_MAX_BOOST,
                sampleVelocity * MARQUEE_MOBILE_BOOST_GAIN,
              ),
            );
          }
        }
      }
      lastY = y;
      lastT = t;
      requestUpdate();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", syncTicker);
    const mainResizeObserver = new ResizeObserver(onResize);
    mainResizeObserver.observe(main);

    // Re-measure the loop period whenever the track's rendered width
    // changes (a responsive text-size breakpoint, a window resize) so
    // the seamless-wrap math can't quietly go stale.
    let resizeFrame = 0;
    let ro: ResizeObserver | null = null;
    if (track) {
      ro = new ResizeObserver(() => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
          const next = measurePeriod(track);
          if (!next || next === period) return;
          period = next;
          wrap = gsap.utils.wrap(-period, 0);
          x = wrap(x);
          setTrackX?.(x);
        });
      });
      ro.observe(track);
    }

    update();
    syncTicker();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", syncTicker);
      mainResizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      ro?.disconnect();
      gsap.killTweensOf(link);
      link.style.pointerEvents = "";
      stopTicker();
    };
  }, [pathname]);

  if (pathname === "/contact") return null;

  return (
    <Link
      ref={linkRef}
      href="/contact"
      aria-label="Let's Connect"
      data-stagger-hover
      data-stagger-static
      className="group !fixed right-4 z-[95] grid h-24 w-24 grid-rows-[30px_1fr_30px] overflow-hidden border border-black-bg/30 bg-accent text-black-bg shadow-[6px_6px_0_rgba(0,0,0,0.28)] [-webkit-tap-highlight-color:transparent] sm:right-6 sm:h-28 sm:w-28 lg:right-8 lg:h-32 lg:w-32"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom))" }}
    >
      <HorizontalStaggerRows />

      <span className="relative z-[1] flex items-center justify-between border-b border-black-bg/25 px-2.5 font-mono text-[8px] tracking-[0.05em] uppercase">
        <span>/ TECHNICO_ </span>
        <span>+</span>
      </span>

      <span className="relative z-[1] flex items-center overflow-hidden px-3">
        <span
          ref={trackRef}
          aria-hidden="true"
          className="flex w-max shrink-0 items-center gap-3 whitespace-nowrap font-mono text-[13px] font-bold leading-none tracking-[-0.02em] uppercase lg:text-[15px]"
        >
          {[0, 1].map((half) => (
            <span key={half} className="flex shrink-0 items-center gap-3">
              {Array.from({ length: MARQUEE_REPEAT }, (_, i) => (
                <span key={i} className="flex shrink-0 items-center gap-3">
                  <span>{MARQUEE_WORD}</span>
                  <span aria-hidden="true">•</span>
                </span>
              ))}
            </span>
          ))}
        </span>
      </span>

      <span className="relative z-[1] flex items-center border-t border-black-bg/25 px-2.5 font-mono text-[9px] uppercase">
        <span>Start</span>
      </span>
    </Link>
  );
}
