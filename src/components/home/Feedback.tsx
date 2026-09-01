"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { gsap, prefersReducedMotion, supportsFinePointer } from "@/lib/gsap";
import { FEEDBACK } from "@/lib/constants";

/* ================================================================
   FEEDBACK (eighth section)
   ================================================================
   ASSETS (expected in /public):
     /feedback/technico-feedback-1.jpg
     /feedback/technico-feedback-2.jpg
     /feedback/technico-feedback-3.jpg
     /feedback/technico-feedback-4.jpg
     /feedback/technico-feedback-5.jpg

   White section, same eyebrow + headline pattern as the rest of the
   home page (Overview.tsx / Strategy.tsx), followed by a short
   secondary sub-heading and intro paragraph, then a gallery of client
   feedback cards built around the reference clip's two behaviors —
   tuned per a second pass of feedback against the actual clip:

   1. MARQUEE THAT SLOWS, NEVER STOPS — driven by a single GSAP tween
      (xPercent 0 -> -50, `repeat: -1`, `ease: "none"`) rather than a
      CSS keyframe, because a CSS keyframe's `animation-duration`
      can't be changed mid-run without the position jumping (the
      browser reinterprets elapsed time against the new duration).
      GSAP's tween keeps its own elapsed-time clock, so hovering any
      card just eases the tween's `timeScale` down to a crawl and
      back up on leave — the row visibly decelerates and
      re-accelerates instead of freezing or snapping speed. The track
      renders FEEDBACK twice back-to-back so the -50% loop point is
      seamless.

      SEAMLESS ONLY IF THE TWO HALVES ARE EXACTLY THE SAME WIDTH:
      -50% shifts the track by exactly half of its OWN total width,
      so that has to equal exactly one FEEDBACK-length for the wrap
      to be invisible. Spacing between cards is a per-card trailing
      margin (`mr-10`/`md:mr-12`), not a `gap` on the flex container.
      `gap` only inserts space *between* items (N items => N-1 gaps),
      so doubling the array doesn't double the gap total the same
      way it doubles the card total — for 5 cards -> 10, that's 4
      gaps -> 9, not 8, and -50% lands half a gap short of the true
      loop point every cycle. It's a small, constant, 100%-repro
      offset, which is exactly what makes it read as "the reset is
      very noticeable" rather than a rare glitch. A trailing margin
      on every card (including the last) makes each "card + spacing"
      unit identical, so 10 units is exactly 2x 5 units and -50%
      lands exactly on the seam.

   2. SMOOTH, TRAILING CURSOR PILL — one shared pill (not one per
      card) tracks the pointer via `gsap.quickTo` on x/y, the same
      spring-like trailing easing `useMagneticHover` already uses
      elsewhere on this site, so it visibly glides toward the cursor
      rather than snapping to it. A second pair of quickTo setters on
      scale/opacity morphs it in with an overshoot ease (small dot ->
      full pill) on enter and eases it back down on leave — the
      "iMessage bubble" pop the brief asked for. Both are skipped
      entirely on coarse pointers / reduced-motion, matching how
      useMagneticHover already guards its own quickTo tweens. The
      pointermove handler only records the latest x/y; the actual
      `getBoundingClientRect()` + quickTo call is batched to at most
      once per animation frame (see `followCursor` below), so a
      high-poll-rate mouse sending far more than 60 events/sec isn't
      forcing a layout read for each one.

   3. CLEAN IMAGES — no gradient scrim over the photo and no
      hover-zoom; the photo stays exactly as shot. Name + quote moved
      off the image entirely and into a plain caption underneath, on
      the section's own white background, which is what keeps every
      card readable without needing an overlay in the first place.

   4. COMPOSITOR-FRIENDLY BY DEFAULT — `will-change: transform` is
      applied to the track and the pill (only when they'll actually
      animate — never under reduced-motion) so the browser promotes
      them to their own layer up front instead of doing it lazily on
      first paint, which is where a lot of the "first few seconds are
      janky, especially on mobile Safari" feeling comes from. The
      duplicate half of the track is `aria-hidden` so assistive tech
      doesn't announce every testimonial twice.

   5. MOBILE GETS A DIFFERENT, CHEAPER WIDGET ENTIRELY — below the
      `sm` breakpoint (see useIsMobile) this renders a plain
      horizontally-scrolling, scroll-snap carousel with < / > arrow
      buttons instead of the marquee: no GSAP tween ticking every
      frame, no doubled TRACK array (so half as many <Image>s mount),
      and no pointermove/rAF/quickTo pill machinery at all — that
      machinery is already skipped at runtime on touch/coarse
      pointers via supportsFinePointer, but on mobile it isn't even
      *mounted*, which is the actual perf win (no wrapper listener,
      no refs to set up, less JS shipped down the tree for that
      screen size). Paging is done by directly reading/scrolling the
      track DOM node on click (see scrollByCard) rather than tracking
      an index in React state, so a manual swipe never gets fought by
      a stale index on the next arrow tap, and arrow clicks don't
      trigger a re-render. The desktop marquee's GSAP tween is also
      paused via the Page Visibility API while the tab is hidden
      (backgrounded/minimized), so it isn't burning CPU/battery on a
      tab nobody's looking at.
   ================================================================ */

// Feedback copy + asset paths live in lib/constants.ts (FEEDBACK), shared
// with the rest of the site's content-in-constants.ts convention.

// Rendered twice back-to-back so the marquee tween can loop at xPercent -50.
const TRACK = [...FEEDBACK, ...FEEDBACK];

const BASE_DURATION = 48;
const SLOW_TIME_SCALE = 0.18;

// "Sidhu Personal Injury Lawyers" -> "Lawyers' Story", not "Lawyers's Story".
const possessive = (name: string) =>
  name.endsWith("s") ? `${name}'` : `${name}'s`;

// Real useLayoutEffect in the browser, so the mobile carousel swaps in
// before the first paint instead of flashing the desktop marquee for
// a frame. React warns if useLayoutEffect runs during SSR (it's a
// no-op there), and this "use client" component still gets rendered
// once on the server — so on the server (and during that first
// pre-hydration pass) this falls back to a no-op.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : () => {};

// Matches Tailwind's `sm` breakpoint (640px) used everywhere else in
// this component tree — below it is the single-column mobile layout,
// where the marquee is replaced entirely by a static, arrow-driven
// carousel (see point 5 in the doc comment above). Kept inline here
// (rather than a separate hooks file) so this component's mobile
// behavior can never end up half-wired from a missed file.
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    setIsMobile(mql.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}

export default function Feedback() {
  const isMobile = useIsMobile();

  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  // Name shown in the shared pill — written directly to the DOM (see
  // nameRef below) instead of React state, so hovering a card never
  // triggers a re-render of the whole TRACK list; it's a pure GSAP/DOM
  // side effect, same as the position/scale/opacity tweens already are.
  const nameRef = useRef<HTMLSpanElement>(null);

  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const movePillXRef = useRef<((value: number) => void) | null>(null);
  const movePillYRef = useRef<((value: number) => void) | null>(null);
  // Split into scaleX/scaleY rather than the shorthand `scale`: GSAP's
  // useGSAP() auto-reverts tweened props on cleanup by snapshotting
  // and restoring the `transform` string, which x/y/xPercent/yPercent
  // all resolve into cleanly. The standalone CSS `scale` property
  // doesn't revert the same way when mixed with those, which is what
  // throws GSAP's "scale not eligible for reset" warning on every
  // cleanup. scaleX/scaleY resolve into `transform` like the others,
  // so they revert cleanly too.
  const setPillScaleXRef = useRef<((value: number) => void) | null>(null);
  const setPillScaleYRef = useRef<((value: number) => void) | null>(null);
  const setPillOpacityRef = useRef<((value: number) => void) | null>(null);

  // rAF-throttling for followCursor: pointermove can fire far more
  // often than the screen repaints (well over 60/sec on a high-poll-
  // rate mouse). Only the latest x/y is kept here; the pending rAF
  // callback below is what actually reads layout + moves the pill,
  // at most once per frame, instead of doing that work on every raw
  // event.
  const pendingPointerRef = useRef<{ x: number; y: number } | null>(null);
  const followCursorRafRef = useRef<number | null>(null);

  // Debounces speedUp() across the ~2.5–3rem gaps between cards
  // (mr-10/md:mr-12), which belong to no card element. Without this,
  // crossing straight from one card into the next fires this card's
  // pointerleave -> speedUp() (marquee re-accelerates, pill fades)
  // immediately followed by the next card's pointerenter ->
  // slowDown(), which reads as a visible flicker on a fast mouse
  // move. Leaving now schedules speedUp() a beat later; entering the
  // next card cancels that pending call so the slow/visible state
  // carries through the gap uninterrupted.
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useGSAP(() => {
    // Skipped on mobile entirely — that screen size gets the
    // scroll-snap carousel below instead, so there's no track to
    // animate and no tween to tick every frame.
    //
    // NOTE: this re-checks matchMedia live (instead of trusting only
    // the `isMobile` state) because `isMobile` starts `false` on
    // purpose (to match SSR) and only flips after its own
    // useLayoutEffect runs. On the very first effect pass — before
    // that flip has happened — `isMobile` here can still read stale
    // `false` even on an actual mobile viewport, which would let a
    // tween get created for a frame before the isMobile-driven
    // re-render unmounts it. Reading the media query directly closes
    // that race regardless of effect/state ordering.
    const isActuallyMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches;

    if (
      !trackRef.current ||
      prefersReducedMotion ||
      isMobile ||
      isActuallyMobile
    )
      return;

    // Set imperatively, only once we know the tween is actually
    // starting — rather than via a className driven by the
    // usePrefersReducedMotion() hook, which starts `false` (to match
    // SSR) and only flips after its own effect runs. That render-time
    // approach let `will-change-transform` apply for one client
    // render even for reduced-motion users, right up until the hook
    // caught up. Gating it here instead means it's only ever set
    // when this effect has already confirmed the tween is running.
    trackRef.current.style.willChange = "transform";

    tweenRef.current = gsap.to(trackRef.current, {
      xPercent: -50,
      ease: "none",
      duration: BASE_DURATION,
      repeat: -1,
    });

    return () => {
      // slowDown()/speedUp() animate `tweenRef.current.timeScale` via a
      // separate tween that TARGETS the marquee tween object itself —
      // killing the marquee tween below stops the marquee, but doesn't
      // stop a different tween that's mid-flight adjusting a property
      // on it. Without this, hovering/unhovering right as this effect
      // tears down (isMobile flip or unmount) can leave that
      // timeScale-adjustment tween running against an already-killed
      // target.
      if (tweenRef.current) gsap.killTweensOf(tweenRef.current);
      tweenRef.current?.kill();
      tweenRef.current = null;
      if (trackRef.current) trackRef.current.style.willChange = "auto";
    };
  }, [isMobile]);

  // Pauses the marquee tween while the tab is hidden (backgrounded,
  // minimized, switched away from) so it isn't burning CPU/battery on
  // a page nobody's looking at, and resumes it — at whatever
  // timeScale it was already at, hovered-slow or not — the moment the
  // tab becomes visible again. No-op on mobile / reduced-motion,
  // where tweenRef.current is never set in the first place.
  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;

    const handleVisibilityChange = () => {
      if (!tweenRef.current) return;
      if (document.hidden) {
        tweenRef.current.pause();
      } else {
        tweenRef.current.play();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isMobile]);

  useGSAP(() => {
    const pill = pillRef.current;
    // Skipped on mobile too — the cursor-following pill is a
    // fine-pointer-only affordance (supportsFinePointer already
    // guards it at runtime), but on mobile it's better to not even
    // mount the quickTo setters/refs for it at all.
    const isActuallyMobile =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 639px)").matches;

    if (
      !pill ||
      prefersReducedMotion ||
      !supportsFinePointer ||
      isMobile ||
      isActuallyMobile
    )
      return;

    // Anchors the pill on the cursor point: xPercent/yPercent center it
    // on its own (auto) width/height, x/y (below) then move that
    // centered point around in px via quickTo. Corner radius is a
    // fixed 5px the whole time (set in the className below, not
    // animated) — the pill only scales up/down and fades, it never
    // morphs shape.
    gsap.set(pill, {
      xPercent: -50,
      yPercent: -50,
      scaleX: 0.4,
      scaleY: 0.4,
      opacity: 0,
    });
    // Same reasoning as the track above: set only once this effect
    // has confirmed the pill is actually going to animate, instead
    // of via a hook-driven className.
    pill.style.willChange = "transform";

    movePillXRef.current = gsap.quickTo(pill, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    movePillYRef.current = gsap.quickTo(pill, "y", {
      duration: 0.5,
      ease: "power3.out",
    });
    // Scale and opacity durations/eases are tuned together on
    // purpose: opacity used to finish faster (0.25s) than the scale
    // grow (0.45s), and scaleX/Y used "back.out(1.8)" — an overshoot
    // ease that resolves most of its motion very early in its
    // duration. Combined, the pill was already ~fully formed by the
    // time it became visible, so the grow read as an instant "pop"
    // rather than a visible size change. Now opacity reveals it fast
    // (0.18s) while scale keeps growing smoothly (0.55s, no-overshoot
    // "power3.out"), so the size is still visibly changing well after
    // it's already on screen.
    setPillScaleXRef.current = gsap.quickTo(pill, "scaleX", {
      duration: 0.55,
      ease: "power3.out",
    });
    setPillScaleYRef.current = gsap.quickTo(pill, "scaleY", {
      duration: 0.55,
      ease: "power3.out",
    });
    setPillOpacityRef.current = gsap.quickTo(pill, "opacity", {
      duration: 0.18,
      ease: "power1.out",
    });

    return () => {
      movePillXRef.current = null;
      movePillYRef.current = null;
      setPillScaleXRef.current = null;
      setPillScaleYRef.current = null;
      setPillOpacityRef.current = null;
      gsap.killTweensOf(pill);
      // gsap.killTweensOf(pill) only catches tweens targeting `pill`
      // itself — nameRef's span is a separate child node with its own
      // crossfade tween (see setPillName below), which isn't touched
      // by that call and was never being killed anywhere. Without
      // this, a mid-flight name crossfade (plus its onComplete, which
      // queues a second tween) keeps running after this effect tears
      // down and can still write into the span after cleanup.
      if (nameRef.current) gsap.killTweensOf(nameRef.current);
      pill.style.willChange = "auto";
      if (followCursorRafRef.current !== null) {
        cancelAnimationFrame(followCursorRafRef.current);
        followCursorRafRef.current = null;
      }
      if (leaveTimeoutRef.current !== null) {
        clearTimeout(leaveTimeoutRef.current);
        leaveTimeoutRef.current = null;
      }
      pendingPointerRef.current = null;
    };
  }, [isMobile]);

  // Drives scaleX/scaleY together so call sites can treat pill scale
  // as one value, same as before the scale/scaleX+scaleY split above.
  const setPillScale = (value: number) => {
    setPillScaleXRef.current?.(value);
    setPillScaleYRef.current?.(value);
  };

  const slowDown = () => {
    // Cancel any speedUp() that's still waiting to fire from the
    // previous card's pointerleave — see leaveTimeoutRef above.
    if (leaveTimeoutRef.current !== null) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }

    if (tweenRef.current) {
      gsap.to(tweenRef.current, {
        timeScale: SLOW_TIME_SCALE,
        duration: 0.6,
        ease: "power2.out",
      });
    }
    setPillScale(1);
    setPillOpacityRef.current?.(1);
  };

  const speedUp = () => {
    if (tweenRef.current) {
      gsap.to(tweenRef.current, {
        timeScale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    }
    setPillScale(0.4);
    setPillOpacityRef.current?.(0);
  };

  // Called on pointerleave. Waits one short beat before actually
  // speeding back up, so crossing the gap into the next card (which
  // calls slowDown() -> clears this timeout) reads as one continuous
  // slow glide instead of a speedUp/slowDown flicker.
  const scheduleSpeedUp = () => {
    if (leaveTimeoutRef.current !== null) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      leaveTimeoutRef.current = null;
      speedUp();
    }, 80);
  };

  // Smoothly crossfades the pill's name text instead of swapping it
  // instantly, so sweeping from one card straight into the next
  // reads as a soft dissolve rather than the label popping mid-hover.
  // Kills any in-flight crossfade first so a fast sweep across
  // several cards in quick succession doesn't stack up tweens or
  // apply an older card's name after a newer one.
  const setPillName = (text: string) => {
    // Matches the guard snapPillTo/followCursor already use. Without
    // this, setPillName could still fire off a tween on nameRef even
    // when the pill effect above skipped setup entirely (reduced
    // motion / coarse pointer) — the pill is invisible either way, so
    // this doesn't change what's shown, it just stops creating an
    // animation nothing ever cleans up in that case.
    if (prefersReducedMotion || !supportsFinePointer) return;

    const el = nameRef.current;
    if (!el) return;

    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      duration: 0.12,
      ease: "power1.out",
      onComplete: () => {
        el.textContent = text;
        gsap.to(el, { opacity: 1, duration: 0.15, ease: "power1.out" });
      },
    });
  };

  // The wrapper is `overflow-hidden` (needed to mask the doubled
  // marquee track's excess width) and the pill lives inside it,
  // centered on the cursor via xPercent/yPercent -50. Left unclamped,
  // hovering near the wrapper's top/left/right edge pushes half the
  // pill past that boundary and it gets visibly sliced off. Clamping
  // x/y here keeps the full pill on-screen no matter where the
  // cursor is. `offsetWidth`/`offsetHeight` are the pill's unscaled
  // layout size — GSAP's `scale` is a transform, so it doesn't affect
  // them — so this clamps against the pill's full size even while
  // it's mid-way through its enter/leave scale tween.
  const clampPillPosition = (x: number, y: number, wrapperRect: DOMRect) => {
    const pill = pillRef.current;
    if (!pill) return { x, y };

    const halfWidth = pill.offsetWidth / 2;
    const halfHeight = pill.offsetHeight / 2;

    return {
      x: Math.min(Math.max(x, halfWidth), wrapperRect.width - halfWidth),
      y: Math.min(Math.max(y, halfHeight), wrapperRect.height - halfHeight),
    };
  };

  // Snaps the pill straight to the entering pointer's position (no
  // trailing ease) so it doesn't visibly fly in from wherever it was
  // last left, then morphs it in from there via slowDown().
  const snapPillTo = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      prefersReducedMotion ||
      !supportsFinePointer ||
      event.pointerType !== "mouse" ||
      !wrapperRef.current ||
      !pillRef.current
    ) {
      return;
    }

    const rect = wrapperRef.current.getBoundingClientRect();
    const { x, y } = clampPillPosition(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect,
    );
    gsap.set(pillRef.current, { x, y });
  };

  const followCursor = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      prefersReducedMotion ||
      !supportsFinePointer ||
      event.pointerType !== "mouse"
    ) {
      return;
    }

    // Just stash the latest position — the rect read + quickTo calls
    // happen at most once per animation frame below, not once per
    // raw event (see the doc comment above for why).
    pendingPointerRef.current = { x: event.clientX, y: event.clientY };

    if (followCursorRafRef.current !== null) return;

    followCursorRafRef.current = requestAnimationFrame(() => {
      followCursorRafRef.current = null;

      const pending = pendingPointerRef.current;
      if (
        !pending ||
        !wrapperRef.current ||
        !movePillXRef.current ||
        !movePillYRef.current
      ) {
        return;
      }

      const rect = wrapperRef.current.getBoundingClientRect();
      const { x, y } = clampPillPosition(
        pending.x - rect.left,
        pending.y - rect.top,
        rect,
      );
      movePillXRef.current(x);
      movePillYRef.current(y);
    });
  };

  // Mobile carousel paging. Finds whichever card is currently
  // nearest-centered in the scroll container (by real offsetLeft/
  // width, not an assumed fixed step) and scrolls straight to the
  // next/previous one via scrollIntoView.
  //
  // A fixed "step" derived from the first card's width + margin used
  // to be used here, but that broke because (a) the last card has no
  // trailing margin (`last:mr-0`) so its true position doesn't match
  // N * step, and (b) cards snap-center rather than snap to their
  // left edge, so left-edge-style stepping drifts from where the
  // browser actually settles. That drift meant the last card was
  // sometimes never fully reachable, and the accumulated overshoot
  // could make `target > maxScroll` fire a click early — snapping
  // straight back to the first card instead of landing on the last
  // one. Reading each card's real offsetLeft/offsetWidth and letting
  // scrollIntoView do the centering sidesteps both issues.
  const scrollByCard = (direction: 1 | -1) => {
    const track = mobileTrackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;

    const viewportCenter = track.scrollLeft + track.clientWidth / 2;

    let currentIndex = 0;
    let smallestDistance = Infinity;
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        currentIndex = i;
      }
    });

    const nextIndex = (currentIndex + direction + cards.length) % cards.length;

    cards[nextIndex].scrollIntoView({
      behavior: "instant",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section className="bg-white-bg">
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24 md:pt-28">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 bg-black-primary" />
          <span className="font-mono text-xs tracking-[0.14em] text-black-text uppercase text-balance sm:text-sm">
            Real Feedbacks
          </span>
        </div>

        {/* Headline */}
        <h2 className="mx-auto mt-7 max-w-3xl text-balance text-center text-[2rem] leading-[1.2] font-normal tracking-tight text-black-text sm:mt-8 sm:text-[42px] sm:leading-[1.15] sm:tracking-[-1.5px] md:text-[50px] md:leading-[1.12] md:tracking-[-2px]">
          Where Performance Meets Results
        </h2>

        {/* Sub-heading */}
        <p className="mx-auto mt-6 text-center text-base tracking-wide text-black-text/45 sm:mt-7 sm:text-lg">
          How Our Solutions Deliver Success
        </p>

        {/* Intro paragraph */}
        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-loose text-black-text/50 text-pretty sm:mt-6 sm:text-base">
          Our marketing solutions help businesses across Canada grow through
          targeted digital content strategies to turn search visibility into
          measurable leads, bookings, and consultations. Notable results
          include:
        </p>
      </div>

      {isMobile ? (
        /* Mobile carousel — plain scroll-snap track + arrow buttons,
           no GSAP tween, no doubled array, no pointer/pill machinery.
           See point 5 in the doc comment above. */
        <div className="mt-14">
          <div
            ref={mobileTrackRef}
            className="flex snap-x snap-mandatory overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {FEEDBACK.map((item) => (
              <div
                key={item.name}
                className="mr-5 w-[78vw] shrink-0 snap-center last:mr-0"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="78vw"
                    className="object-cover"
                  />
                </div>

                <div className="pt-5">
                  <span className="block text-lg font-medium text-black-text">
                    {item.name}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-black-text/55 text-pretty">
                    {item.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => scrollByCard(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black-text/15 text-black-text active:bg-black-text/5"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => scrollByCard(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black-text/15 text-black-text active:bg-black-text/5"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* Feedback marquee */
        <div
          ref={wrapperRef}
          className="relative mt-14 overflow-hidden sm:mt-16 md:mt-20"
          onPointerMove={followCursor}
        >
          <div ref={trackRef} className="flex w-max items-start">
            {TRACK.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                aria-hidden={i >= FEEDBACK.length || undefined}
                className="mr-10 w-[78vw] shrink-0 sm:w-[46vw] md:mr-12 md:w-[23rem]"
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return;
                  setPillName(possessive(item.name));
                  snapPillTo(event);
                  slowDown();
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") scheduleSpeedUp();
                }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 768px) 23rem, (min-width: 640px) 46vw, 78vw"
                    className="object-cover"
                  />
                </div>

                <div className="pt-5 sm:pt-6">
                  <span className="block text-lg font-medium text-black-text sm:text-xl">
                    {item.name}
                  </span>
                  <p className="mt-2 text-sm leading-relaxed text-black-text/55 text-pretty">
                    {item.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shared cursor-following pill. Labeled with whichever card is
              currently hovered — written via setPillName's crossfade into
              nameRef's textContent (no React state involved), so hovering
              never re-renders the TRACK list. Reads e.g. "MAG SOLAR'S
              STORY". This only ever renders on fine-pointer/mouse input (see
              supportsFinePointer above) — never on touch — so it's one
              fixed, generous size instead of scaling down at narrow
              breakpoints; a resized desktop window is still a desktop, not a
              phone, and the previous responsive sizing was quietly shrinking
              it back to tiny on any viewport under 640px, which is what kept
              reading as "small". Corner radius is a fixed 5px at all times
              (rounded-[5px] below, not GSAP-driven) — the pill only scales
              and fades in the effect above, it never morphs shape.
              Glass/blur treatment: translucent dark fill + backdrop-blur so
              whatever's under the cursor (card image, white section bg)
              shows through softened, with a hairline border to keep the
              edge readable against light backgrounds. */}
          <span
            ref={pillRef}
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-10 flex items-baseline gap-2 rounded-[5px] border border-white/15 bg-black-text/40 px-8 py-4 font-mono text-2xl tracking-[0.02em] text-white uppercase whitespace-nowrap opacity-0 backdrop-blur-xl"
          >
            <span ref={nameRef} className="font-semibold" />
            <span className="font-normal text-white/55">Story</span>
          </span>
        </div>
      )}

      <div className="pb-20 sm:pb-24 md:pb-28" />
    </section>
  );
}
