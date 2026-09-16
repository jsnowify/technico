"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { TECH_STACK, type TrustedBrand } from "@/lib/constants";

/* ================================================================
   TECH STACK
   ================================================================
   Same draggable/autoplay logo marquee as TrustedBy.tsx (see that
   file for the full write-up of the motion system: one xRef/targetXRef
   lerp chased through dragging, coasting, and cruising, endless loop
   via wrap-on-render, scroll-driven direction/speed/tilt, etc.) —
   copied here rather than shared because this variant renders a
   different data source (TECH_STACK instead of TRUSTED_BY), adds the
   centered "Technologies We Use To Build Your Website" heading above
   the strip, and drops the cursor-following "Trusted by" pill, which
   was specific to that section's copy.

   LOGOS FORCED WHITE: TECH_STACK's Cloudinary sources are full-color
   brand marks, so each URL (see lib/constants.ts) carries an
   `e_colorize:100,co_white` transformation baked in server-side —
   TechStack's <img> renders that result directly, with no CSS
   `filter` here. A live filter was tried first but meant every one of
   the 72 on-screen clones (12 logos x CLONE_COUNT 6) had that
   composited fresh each animation frame; baking it into the source
   image instead makes this identical, performance-wise, to
   TRUSTED_BY's already-white sources.
   ================================================================ */

// Rendered 6x back-to-back rather than just twice. With only two
// copies there's exactly one loop-width of buffer past the wrap point
// — fine for the slow, steady autoplay creep, but a manual drag/flick
// can yank the strip past that single buffer in one throw, and for a
// frame or two there's nothing left to render (a flash of empty
// space). 6 copies gives a hard, fast flick (see MAX_COAST_LOOPS below)
// enough room that its natural, uncapped coast distance almost never
// needs truncating, without the DOM/image cost of the original 8x.
const CLONE_COUNT = 6;

// Autoplay speed in px/sec, independent of frame rate — tune this one
// number to speed up/slow down the base loop (before the scroll-driven
// boost below is added on top).
const AUTOPLAY_SPEED = 70;

// Seconds for autoplay to ease from a dead stop back up to
// AUTOPLAY_SPEED once a coast decays below COAST_STOP_VELOCITY — the
// time to reach ~99% of full speed (see the decay-based lerp in
// tick()), not a rough guess. Ramping it in rather than snapping
// straight to cruising speed is what makes "coast settles -> autoplay
// resumes" read as one continuous motion instead of a stop then a
// jump.
const AUTOPLAY_RAMP_SECONDS = 0.45;

// Seconds for the rendered position (`xRef`) to close ~99% of the gap
// to whatever it's currently chasing (`targetXRef`) — this one number
// is what gives BOTH the live drag and the post-release coast their
// "controlled", weighted feel, since both phases are chased by this
// exact same lerp. Too small and it's basically a raw 1:1 drag again;
// too large and the strip feels sluggish/laggy behind the pointer.
const FOLLOW_SECONDS = 0.15;

// Half-life, in seconds, of a coast's velocity after release — it
// halves every this-many seconds until it drops below
// COAST_STOP_VELOCITY and autoplay takes back over. This is the whole
// "momentum" model: no separate physics plugin, just exponential
// decay applied to whatever velocity the release estimated.
const COAST_HALFLIFE_SECONDS = 0.5;

// px/sec — below this, a coast is considered settled and autoplay
// starts ramping back in. Also the threshold a release's velocity has
// to clear to override the current autoplay direction at all (see
// `directionRef` in the effect below) — a slow drag that basically
// stopped before the pointer lifted shouldn't be read as "user wants
// it going that way now".
const COAST_STOP_VELOCITY = 4;
const MIN_FLING_VELOCITY = 30;

// How far a single fling is allowed to carry the strip after release,
// as a multiple of one loop-width. A velocity's total coast distance
// under exponential decay is `velocity * halfLife / ln(2)`, so this
// caps the release velocity itself (see `clampReleaseVelocity` in the
// effect below, where loopWidth is known) rather than the distance
// directly — capping the fling itself, the way a well-behaved native
// scroll view does, means the strip can never travel further in one
// gesture than we've actually got buffered, no matter how fast or long
// the swipe was.
const MAX_COAST_LOOPS = 3;

// Multiplies the raw release velocity before it's used for the coast.
// This is the most direct knob for "quick drag + release feels too
// fast" — 1 = no change, lower values (e.g. 0.5) soften the kick a
// flick gives without changing how long the coast takes to settle.
const FLING_VELOCITY_MULTIPLIER = 0.3;

// Extra speed on top of AUTOPLAY_SPEED, driven by how fast the page is
// being scrolled. Capped so a wild, hard scroll can only ever
// double-ish the base speed rather than sending the strip flying.
// Decays back toward 0 every frame so the marquee eases back to its
// normal speed shortly after scrolling stops.
const SCROLL_BOOST_CAP = 160;
const SCROLL_VELOCITY_DIVISOR = 6;

// Degrees — a small, subtle tilt on each card, also driven by scroll
// velocity. Kept low on purpose: a light wobble, not a dramatic warp.
const MAX_TILT = 6;
const TILT_VELOCITY_DIVISOR = 320;

// Milliseconds the pointer must stay down before a drag actually
// activates. A plain click/tap does a pointerdown immediately followed
// by pointerup — well under this delay — so it never flips drag mode
// on at all (see onPointerDown / activateDrag / endDrag below). Only a
// press that's genuinely held past this window starts behaving like a
// drag.
const DRAG_ACTIVATION_DELAY_MS = 150;

// How much the cards shrink while the pointer is held down — a small,
// immediate "press" cue (1 = no shrink). This fires right on
// pointerdown, independent of DRAG_ACTIVATION_DELAY_MS above: it's
// just tactile feedback that something is being pressed, not a signal
// that a drag has started, so it shouldn't wait on the same delay that
// gates actual strip movement.
const CARD_PRESS_SCALE = 0.95;
const CARD_PRESS_DURATION = 0.2;

export default function TechStack({
  items = TECH_STACK,
  heading = (
    <>
      Technologies We Use To
      <br />
      Build Your Website
    </>
  ),
}: {
  /** Defaults to TECH_STACK. Pass a different array (e.g.
   * GRAPHIC_DESIGN_WORK) to render this same marquee as its own
   * standalone strip instead of mixing items into the tech logos. */
  items?: TrustedBrand[];
  heading?: ReactNode;
}) {
  const track = Array.from({ length: CLONE_COUNT }, () => items).flat();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Motion state. `xRef` is what's actually rendered; `targetXRef` is
  // what it's chasing this frame (see the big doc comment above for
  // how the latter gets driven in each phase). Both are unwrapped
  // running totals — wrapping only happens at render time.
  const loopWidthRef = useRef(0);
  const xRef = useRef(0);
  const targetXRef = useRef(0);
  // Smoothed px/sec estimate, live during a drag (fed by pointermove)
  // and decaying during the coast that follows release.
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  // Current effective autoplay speed factor (0 -> 1) — ramps back up
  // toward 1 once a coast settles below COAST_STOP_VELOCITY.
  const autoplayRampRef = useRef(0);
  // Pending "should this pointerdown become a drag?" timer — see
  // DRAG_ACTIVATION_DELAY_MS above.
  const dragActivationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useGSAP(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion) return;

    loopWidthRef.current = Math.round(track.scrollWidth / CLONE_COUNT);
    const wrap = gsap.utils.wrap(-loopWidthRef.current, 0);

    // A release's velocity can't push the coast past MAX_COAST_LOOPS
    // loop-widths — see the constant's doc comment for the math.
    const maxReleaseVelocity =
      (MAX_COAST_LOOPS * loopWidthRef.current * Math.LN2) /
      COAST_HALFLIFE_SECONDS;
    const clampReleaseVelocity = gsap.utils.clamp(
      -maxReleaseVelocity,
      maxReleaseVelocity,
    );
    const clampRamp = gsap.utils.clamp(0, 1);

    // Direction flips with the page's scroll direction (scrolling down
    // keeps the strip moving left, the default; scrolling up sends it
    // right) — or with the last drag/fling, once a release clears
    // MIN_FLING_VELOCITY (see endDrag below).
    const directionRef = { current: 1 };
    const boostRef = { current: 0 };
    const clampBoost = gsap.utils.clamp(0, SCROLL_BOOST_CAP);

    const cards = Array.from(track.children) as HTMLElement[];
    // Promoted to their own compositor layer up front rather than only
    // once the first skewY tween fires: promoting on the fly (right as
    // a scroll-driven tilt kicks in, possibly mid-drag) is exactly the
    // kind of one-time cost that shows up as a hitch.
    cards.forEach((card) => {
      card.style.willChange = "transform";
    });
    const clampSkew = gsap.utils.clamp(-MAX_TILT, MAX_TILT);
    const skewRef = { current: 0 };
    const setSkew = gsap.quickTo(cards, "skewY", {
      duration: 0.6,
      ease: "power3",
    });

    // Press-shrink feedback — see CARD_PRESS_SCALE above. Separate
    // quickTo pair from the skew one since they animate different
    // properties but both run on every card. scaleX/scaleY used
    // explicitly rather than the "scale" shorthand property.
    const setCardScaleX = gsap.quickTo(cards, "scaleX", {
      duration: CARD_PRESS_DURATION,
      ease: "power3.out",
    });
    const setCardScaleY = gsap.quickTo(cards, "scaleY", {
      duration: CARD_PRESS_DURATION,
      ease: "power3.out",
    });
    const setCardScale = (value: number) => {
      setCardScaleX(value);
      setCardScaleY(value);
    };

    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollY;
      const deltaT = Math.max(now - lastTime, 1);
      const velocity = (deltaY / deltaT) * 1000; // px/sec

      if (velocity > 0) directionRef.current = 1;
      else if (velocity < 0) directionRef.current = -1;

      // Only grow from a faster scroll; let the per-frame decay below
      // shrink it back down. Prevents a slower scroll event landing
      // right after a fast one from cutting the boost/tilt short early.
      const incomingBoost = clampBoost(
        Math.abs(velocity) / SCROLL_VELOCITY_DIVISOR,
      );
      boostRef.current = Math.max(boostRef.current, incomingBoost);

      const skew = clampSkew(velocity / -TILT_VELOCITY_DIVISOR);
      if (Math.abs(skew) > Math.abs(skewRef.current)) {
        skewRef.current = skew;
        setSkew(skew);
      }

      lastScrollY = currentY;
      lastTime = now;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      const dr = gsap.ticker.deltaRatio(60);
      const dt = dr / 60; // seconds elapsed this frame

      // Decay boost/tilt regardless of drag/coast state so they don't
      // hang around mid-drag and then suddenly resume once released.
      boostRef.current *= 0.85;
      if (Math.abs(skewRef.current) > 0.02) {
        skewRef.current *= 0.9;
        setSkew(skewRef.current);
      } else if (skewRef.current !== 0) {
        skewRef.current = 0;
        setSkew(0);
      }

      // Whether targetXRef is presently just cruising on autoplay
      // (used below to decide whether to round the rendered pixel —
      // crisp during a steady cruise, sub-pixel during any transient
      // motion so nothing stutters).
      let cruising = false;

      if (isDraggingRef.current) {
        // targetXRef is being driven live by onPointerMove — nothing
        // to do here except let the lerp below keep chasing it.
      } else if (Math.abs(velocityRef.current) > COAST_STOP_VELOCITY) {
        // Coasting: keep advancing the target by the decaying release
        // velocity. The lerp below chasing this exactly the same way
        // it chases a live drag is what makes release feel like a
        // continuation of the same motion instead of a handoff.
        targetXRef.current += velocityRef.current * dt;
        velocityRef.current *= Math.pow(0.5, dt / COAST_HALFLIFE_SECONDS);
        autoplayRampRef.current = 0;
      } else {
        // Settled — ease autoplay back in. Framerate-independent decay
        // toward 1 (reaches ~99% of target by AUTOPLAY_RAMP_SECONDS
        // regardless of frame rate).
        velocityRef.current = 0;
        cruising = true;
        const decay = Math.pow(0.01, dt / AUTOPLAY_RAMP_SECONDS);
        autoplayRampRef.current = clampRamp(
          autoplayRampRef.current + (1 - autoplayRampRef.current) * (1 - decay),
        );
        const speed =
          (AUTOPLAY_SPEED + boostRef.current) * autoplayRampRef.current;
        targetXRef.current -= speed * directionRef.current * dt;
      }

      // The one lerp that chases targetXRef in every phase — dragging,
      // coasting, or cruising.
      const followDecay = Math.pow(0.01, dt / FOLLOW_SECONDS);
      xRef.current += (targetXRef.current - xRef.current) * (1 - followDecay);

      // Keep both running totals bounded over a long idle session.
      // Shifting both by the same multiple of loopWidth never changes
      // their difference, so it's invisible to the lerp or the render.
      if (Math.abs(xRef.current) > loopWidthRef.current * 50) {
        const shift =
          Math.round(xRef.current / loopWidthRef.current) *
          loopWidthRef.current;
        xRef.current -= shift;
        targetXRef.current -= shift;
      }

      const renderX = wrap(xRef.current);
      gsap.set(track, { x: cruising ? Math.round(renderX) : renderX });
    };
    gsap.ticker.add(tick);

    // Actually flips drag mode on. Only called once
    // DRAG_ACTIVATION_DELAY_MS has elapsed since pointerdown without an
    // intervening pointerup/cancel — see onPointerDown/endDrag.
    const activateDrag = () => {
      isDraggingRef.current = true;
      velocityRef.current = 0;
      // Start the chase target exactly where the visual currently is
      // — otherwise the first pointermove after activation would yank
      // targetXRef (and the strip) toward wherever the raw math
      // landed, a jump right at the start of the gesture.
      targetXRef.current = xRef.current;
      track.style.cursor = "grabbing";
    };

    const onPointerDown = (event: PointerEvent) => {
      if (prefersReducedMotion) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;

      activePointerIdRef.current = event.pointerId;
      track.setPointerCapture(event.pointerId);
      lastPointerXRef.current = event.clientX;
      lastPointerTimeRef.current = performance.now();

      // Immediate visual feedback that something is being held — not
      // gated behind the drag-activation delay below, since this is
      // just a press cue, not a signal that dragging has started.
      setCardScale(CARD_PRESS_SCALE);

      // Don't activate drag mode immediately — wait to see if the
      // pointer is actually held past DRAG_ACTIVATION_DELAY_MS. A
      // quick tap/click gets its pointerup before this fires and never
      // touches drag state at all (see endDrag).
      if (dragActivationTimeoutRef.current !== null) {
        clearTimeout(dragActivationTimeoutRef.current);
      }
      dragActivationTimeoutRef.current = setTimeout(() => {
        dragActivationTimeoutRef.current = null;
        activateDrag();
      }, DRAG_ACTIVATION_DELAY_MS);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (
        !isDraggingRef.current ||
        event.pointerId !== activePointerIdRef.current
      ) {
        return;
      }

      const now = performance.now();
      const deltaX = event.clientX - lastPointerXRef.current;
      const deltaT = Math.max(now - lastPointerTimeRef.current, 1);

      // Raw 1:1 with the pointer — it's targetXRef, not the rendered
      // xRef, so the strip itself still only ever moves via the lerp
      // in tick(). That gap between "where the pointer says it should
      // be" and "where it's actually drawn" is what reads as a
      // controlled, weighted drag instead of a bare cursor-follow.
      targetXRef.current += deltaX;

      // Smoothed so one jittery pointer sample right before release
      // doesn't produce a wild, unrepresentative fling velocity.
      const instantVelocity = (deltaX / deltaT) * 1000;
      velocityRef.current += (instantVelocity - velocityRef.current) * 0.35;

      lastPointerXRef.current = event.clientX;
      lastPointerTimeRef.current = now;
    };

    const endDrag = (event: PointerEvent) => {
      if (event.pointerId !== activePointerIdRef.current) return;

      // Released before the activation delay elapsed — this was a
      // tap/click, not a drag. Cancel the pending activation and bail
      // out before touching any drag/coast/autoplay state.
      if (dragActivationTimeoutRef.current !== null) {
        clearTimeout(dragActivationTimeoutRef.current);
        dragActivationTimeoutRef.current = null;
        activePointerIdRef.current = null;
        track.style.cursor = "";
        setCardScale(1);
        return;
      }

      isDraggingRef.current = false;
      activePointerIdRef.current = null;
      track.style.cursor = "";

      const releaseVelocity = clampReleaseVelocity(
        velocityRef.current * FLING_VELOCITY_MULTIPLIER,
      );
      if (Math.abs(releaseVelocity) >= MIN_FLING_VELOCITY) {
        // Whichever way the fling actually went wins — not whatever
        // direction the page's last scroll happened to leave behind.
        directionRef.current = releaseVelocity > 0 ? -1 : 1;
        velocityRef.current = releaseVelocity;
      } else {
        // Basically at rest before release — no fling, settle in
        // place and let autoplay pick back up in its existing
        // direction.
        velocityRef.current = 0;
      }
      setCardScale(1);
    };

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    return () => {
      if (dragActivationTimeoutRef.current !== null) {
        clearTimeout(dragActivationTimeoutRef.current);
        dragActivationTimeoutRef.current = null;
      }
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", onScroll);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
      gsap.killTweensOf(cards);
      cards.forEach((card) => {
        card.style.willChange = "auto";
      });
    };
  }, []);

  return (
    <section className="bg-black-bg px-6 pb-14 sm:px-8 sm:pb-16 md:px-10 md:pb-20">
      <h2 className="text-center text-[32px] leading-[1.2] font-medium tracking-tight text-white sm:text-[40px] md:text-[44px]">
        {heading}
      </h2>

      <div
        ref={wrapperRef}
        className="relative mt-14 overflow-hidden sm:mt-16 md:mt-20"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="flex w-max cursor-grab items-center [-webkit-user-select:none] select-none"
          style={{ touchAction: "pan-y" }}
        >
          {track.map((brand, i) => (
            <div
              key={i}
              aria-hidden={i >= items.length || undefined}
              className="mr-8 flex aspect-square h-36 shrink-0 items-center justify-center border border-white/10 bg-white/3 p-6 sm:h-48 sm:p-8 md:mr-12 md:h-60 md:p-10"
            >
              {/* No loading="lazy" here on purpose: this track gets
                  moved by transform (autoplay + drag), not native
                  scroll, so the browser's lazy-load heuristic has no
                  reliable signal for "about to be visible" the way it
                  does for a real scroll container. A hard flick can
                  reveal a clone the browser never bothered to
                  fetch/decode yet, and that decode landing mid-gesture
                  is exactly the kind of one-frame stall that reads as
                  the drag stuttering. These are small logo marks, not
                  hero images, so loading everything up front is cheap. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={brand.logo}
                alt={brand.name ?? ""}
                decoding="async"
                draggable={false}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
