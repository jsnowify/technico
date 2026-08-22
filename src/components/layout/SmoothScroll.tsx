import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { setLenis } from "../../lib/smoothScroll";
import { getDeviceCapabilitySignals } from "../../lib/deviceCapability";

/*
 * ============================================================
 * DEVICE TIER
 *
 * Same signal-based approach as ReactiveGrid's detectTier — read once
 * on mount, not re-checked on resize (a phone rotating doesn't change
 * its CPU). Three outcomes:
 *
 *   "off"   — touch/coarse-pointer devices. Lenis's inertia only ever
 *             applies to wheel input; touch already scrolls natively.
 *             Skipping instantiation entirely here means zero Lenis
 *             overhead on phones/tablets rather than an unused
 *             instance quietly ticking in the background.
 *   "light" — lower-core-count or low-memory desktops/laptops. Still
 *             smoothed, but a shorter duration settles faster and
 *             costs less per-frame easing work than the full curve.
 *   "full"  — everything else. The premium, longer-tail easing.
 * ============================================================
 */
type ScrollTier = "off" | "light" | "full";

function detectScrollTier(): ScrollTier {
  if (typeof window === "undefined") return "full";

  const { coarsePointer, cores, memory } = getDeviceCapabilitySignals();
  if (coarsePointer) return "off";

  if (cores <= 4 || (memory !== undefined && memory <= 4)) {
    return "light";
  }

  return "full";
}

const TIER_CONFIG: Record<
  Exclude<ScrollTier, "off">,
  { duration: number; easing: (t: number) => number; wheelMultiplier: number }
> = {
  light: {
    duration: 0.6,
    easing: (t) => 1 - Math.pow(1 - t, 3), // cheap cubic-out, settles fast
    wheelMultiplier: 1,
  },
  full: {
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    wheelMultiplier: 1,
  },
};

/**
 * Mounts a single Lenis instance for the lifetime of the app and drives
 * it from GSAP's own ticker rather than a separate requestAnimationFrame
 * loop. This keeps every ScrollTrigger-based animation already in the
 * site (Header's scroll morph, ReactiveGrid's scan sweep, Introduction's
 * scroll reveals, etc.) reading the same, single source of scroll
 * truth as Lenis itself, so nothing drifts a frame out of sync.
 *
 * Renders nothing — this is a behavior-only component, same pattern as
 * <Loader />, <PageTransition />, and <CustomCursor /> in App.tsx.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Respect prefers-reduced-motion: skip Lenis entirely and leave the
    // browser's native (non-inertial) scroll in place.
    if (prefersReducedMotion) return;

    const tier = detectScrollTier();

    // Touch devices: no Lenis instance at all — native scroll handles
    // it, and this avoids the (small but nonzero) per-frame cost of an
    // idle Lenis instance on the devices least able to spare it.
    //
    // NOTE (audit, current pass): the normalizeScroll workaround below
    // was built specifically for the pinned `<Stack>` "pile of folders"
    // effect Home used to use. Stack/StackSection/useStackScrollGate
    // have since been removed as dead code (nothing imported them),
    // and a project-wide search turns up zero `pin: true` ScrollTriggers
    // and zero `[data-stack-scroll]` elements anywhere in the current
    // codebase. That means the specific bugs this fixes (pin desync on
    // mobile viewport-resize, touch input skipping straight past a
    // pinned section) can't currently occur — there's nothing pinned to
    // desync. Left in place rather than removed, since normalizeScroll
    // is still a reasonable general touch-scroll normalization and pin
    // effects (Services page? future sections?) could come back — but
    // if touch scroll ever feels off, this is the first thing to
    // reassess, and it can likely be deleted outright if no pinned
    // ScrollTrigger reappears.
    //
    // FIX (pin never engages on mobile) [original]: mobile browsers resize the
    // viewport as the address bar hides/shows while scrolling, firing
    // extra resize/scroll events mid-gesture. ScrollTrigger caches
    // pin-start measurements against the viewport size at creation
    // time, so those spurious resizes desync the trigger and the pin
    // for Stack's Introduction card either fires at the wrong offset
    // or never latches at all — it just scrolls past like a normal
    // section. ScrollTrigger.normalizeScroll(...) is GSAP's documented
    // fix: it unifies scroll handling across touch/wheel input and
    // ignores address-bar-driven resize noise, without needing Lenis
    // (which we're intentionally skipping on touch anyway).
    //
    // FIX (Hero content skipped, jumps straight to Introduction):
    // normalizeScroll's default behavior captures ALL touch input on
    // the page, the same way Lenis does for wheel input on desktop —
    // including input starting inside Hero's own
    // `[data-stack-scroll]` container. Without `allowNestedScroll`,
    // every touch tick gets fed straight into the pinned
    // ScrollTrigger's scrub instead of scrolling Hero's own content
    // first, so a single swipe can jump the scrub timeline straight
    // toward Introduction. `allowNestedScroll: true` is
    // normalizeScroll's equivalent of Lenis's `data-lenis-prevent`
    // (see Hero.tsx): a touch gesture starting inside a scrollable
    // descendant scrolls that element natively first, and only
    // bubbles out to drive the pin once that element hits its own
    // scroll limit.
    if (tier === "off") {
      ScrollTrigger.normalizeScroll({ allowNestedScroll: true });

      return () => {
        ScrollTrigger.normalizeScroll(false);
      };
    }

    const { duration, easing, wheelMultiplier } = TIER_CONFIG[tier];

    const lenis = new Lenis({
      duration,
      easing,
      smoothWheel: true,
      wheelMultiplier,
      // Touch scroll stays native/unsmoothed regardless of tier — this
      // is Lenis's default and matches "keep mobile behavior natural".
      touchMultiplier: 1,
    });

    setLenis(lenis);

    // Every Lenis scroll tick re-checks ScrollTrigger-pinned/scrubbed
    // elements against the new scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    // Keep Lenis's own scroll-limit math in sync with ScrollTrigger.
    // A pin (Services' horizontal sequence today, any future pinned
    // section) mutates document height via its pin-spacer whenever
    // ScrollTrigger refreshes/re-measures. Lenis computes its scroll
    // limit from document height independently, and nothing previously
    // told it to recompute that after such a refresh — so Lenis could
    // keep scrolling against a stale limit for a moment right at a pin
    // boundary. That mismatch is what reads as a "snap/adjust" exactly
    // where vertical scroll hands off to a pinned section and back.
    // ScrollTrigger's "refresh" event is global (fires for every
    // trigger's refresh, not just one section's), so listening once
    // here — rather than duplicating this per-section — keeps every
    // pinned trigger on the page correctly synced with Lenis.
    const handleRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    // Skip driving Lenis while the tab is hidden — nothing on screen is
    // visible to animate, so there's no reason to keep computing scroll
    // easing every frame in the background.
    let paused = false;

    const handleVisibility = () => {
      paused = document.hidden;
    };

    document.addEventListener("visibilitychange", handleVisibility);

    // Drive Lenis from GSAP's ticker (time is seconds since the ticker
    // started; Lenis expects milliseconds) instead of its own rAF loop.
    const update = (time: number) => {
      if (paused) return;
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);

    // GSAP's ticker normally "catches up" after a long tab-away pause,
    // which would otherwise fight with Lenis's own frame timing.
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      document.removeEventListener("visibilitychange", handleVisibility);
      gsap.ticker.remove(update);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
