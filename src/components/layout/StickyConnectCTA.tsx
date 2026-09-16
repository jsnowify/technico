"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useMagneticHover } from "@/lib/hooks/useMagneticHover";

/** How many seconds one full lap of the square path takes at rest. */
const IDLE_LAP_SPEED = 14; // svg units per second, at rest

/** How long after scrolling stops before the ring eases back to idle speed. */
const IDLE_RESUME_DELAY_MS = 120;

/**
 * Geometry of the rounded-square ring path (see PATH_D below): a
 * 92x92 square, corner radius 14, centered in a 120x120 viewBox.
 * Its total perimeter is computed analytically (4 straight sides +
 * 4 quarter-circle corners = one full circle's circumference) rather
 * than measured via `path.getTotalLength()` at runtime — since we
 * authored the path ourselves, the two are guaranteed to match, and
 * this lets the character count be computed once at module scope
 * instead of waiting on a DOM read after mount.
 */
const CORNER_RADIUS = 14;
const STRAIGHT_SIDE_LENGTH = 92 - 2 * CORNER_RADIUS; // 64
const PATH_LENGTH = 4 * STRAIGHT_SIDE_LENGTH + 2 * Math.PI * CORNER_RADIUS; // ≈343.96

const PATH_D =
  "M 28,14 H92 A14,14 0 0 1 106,28 V92 A14,14 0 0 1 92,106 H28 A14,14 0 0 1 14,92 V28 A14,14 0 0 1 28,14 Z";

/** Spacing between character centers, in the same svg units as PATH_LENGTH. */
const CHAR_SPACING = 6.2;

/** Precomputed samples along the ring path — built once on mount so
 *  the per-frame tick never has to call the (comparatively expensive,
 *  layout-forcing) native `getPointAtLength()` itself. */
const PATH_SAMPLE_COUNT = 240;

const RING_PHRASE = "LET'S CONNECT  •  ";
const RING_CHAR_COUNT = Math.ceil(PATH_LENGTH / CHAR_SPACING);
const RING_CHARS = Array.from(
  { length: RING_CHAR_COUNT },
  (_, i) => RING_PHRASE[i % RING_PHRASE.length],
);

/**
 * StickyConnectCTA
 * -----------------
 * The little "spinning badge" CTA — reference was a circle (rotating
 * text ring + emoji in the middle). Ours keeps the same idea but:
 *
 *   1. The text travels around a SQUARE path (rounded corners to
 *      match the badge's own rounded-square shape), not a circle —
 *      so the ring itself reads as a squircle outline, same language
 *      as QaCard/Cta elsewhere on the site.
 *   2. It never stops: a continuous idle lap runs at all times, and
 *      scrolling temporarily speeds that same motion up — the ring
 *      is always "alive", scrolling just makes it excited. Speed is
 *      driven by real scroll velocity computed from raw
 *      `window.scrollY` deltas on the native `scroll` event (not
 *      ScrollTrigger's own velocity tracking, which only reports
 *      reliably when wired up with `scrub`) — so it reacts to
 *      however fast the page is actually being scrolled right now.
 *
 * WHY EACH CHARACTER IS POSITIONED BY HAND instead of a native SVG
 * `<textPath>`: a `<textPath>` only lays text out ONE forward pass
 * along the path starting from `startOffset` — it does not loop back
 * to the start when the text runs past the path's end. Since this
 * ring is continuously animating `startOffset` from 0–100% forever,
 * every time the offset gets close to 100% there's less path left
 * than the text needs, and browsers (Chrome included) don't wrap the
 * overflow back to the start — they extrapolate the remaining glyphs
 * off the end of the path in a straight line, so stray letters
 * visibly fly outside the ring. Positioning each character ourselves
 * via `path.getPointAtLength()` sidesteps that entirely: every
 * character's distance-along-path is wrapped with `% PATH_LENGTH`
 * ourselves, so the ring always reads as a clean, fully-wrapped loop
 * with no overflow, at any point in the animation.
 *
 * Mounted once in app/layout.tsx as a sibling of Header/Footer,
 * outside `{children}`, so it's `position: fixed` against the
 * viewport and persists across every route instead of being
 * per-page. Sits at z-[95] — above BottomGlassBlur's frosted strip
 * (z-[90]) so it never gets blurred out, below the header (z-[110])
 * and mobile nav (z-[120]) so an open menu still overlaps it.
 *
 * - The 👀 sits dead center, absolutely positioned OUTSIDE the SVG,
 *   so it never moves, no matter how fast the ring is spinning.
 * - useMagneticHover gives it the same subtle pointer-pull as
 *   NavItem/Button — bounds is the fixed hit-area Link, target is the
 *   inner visual square that actually translates, so the fixed
 *   positioning itself is never touched by the tween.
 * - Under prefers-reduced-motion, characters are laid out once at
 *   rest (distance 0) and never animated again.
 */
export default function StickyConnectCTA() {
  const pathRef = useRef<SVGPathElement>(null);
  const charRefs = useRef<(SVGTextElement | null)[]>([]);

  const { targetRef, boundsRef, handlePointerMove, reset } = useMagneticHover<
    HTMLDivElement,
    HTMLAnchorElement
  >({ maxX: 8, maxY: 8, radius: 90 });

  useGSAP(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;

    // Build the point lookup table ONCE — this is the only place
    // that touches the (expensive) native getPointAtLength API. Every
    // frame after this just interpolates between two pre-sampled
    // points, which is plain array indexing + arithmetic instead of
    // a layout-forcing geometry query per character, per frame.
    const lut: { x: number; y: number }[] = [];
    for (let i = 0; i < PATH_SAMPLE_COUNT; i++) {
      const point = pathEl.getPointAtLength(
        (i / PATH_SAMPLE_COUNT) * PATH_LENGTH,
      );
      lut.push({ x: point.x, y: point.y });
    }

    function positionChars(distance: number) {
      charRefs.current.forEach((el, i) => {
        if (!el) return;

        const charDistance =
          (((distance + i * CHAR_SPACING) % PATH_LENGTH) + PATH_LENGTH) %
          PATH_LENGTH;

        // Which two LUT samples straddle this character's position,
        // and how far between them it sits (0–1) — linear
        // interpolation between neighbouring samples instead of an
        // exact geometry query.
        const scaled = (charDistance / PATH_LENGTH) * PATH_SAMPLE_COUNT;
        const i0 = Math.floor(scaled) % PATH_SAMPLE_COUNT;
        const i1 = (i0 + 1) % PATH_SAMPLE_COUNT;
        const frac = scaled - Math.floor(scaled);

        const p0 = lut[i0];
        const p1 = lut[i1];
        const x = p0.x + (p1.x - p0.x) * frac;
        const y = p0.y + (p1.y - p0.y) * frac;

        // The direction from p0 → p1 doubles as the tangent — samples
        // are close enough together that this reads as smooth
        // rotation without needing a separate "ahead" query.
        const angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) * (180 / Math.PI);

        el.setAttribute("transform", `translate(${x} ${y}) rotate(${angle})`);
      });
    }

    // Always paint the ring at rest, even under reduced motion.
    positionChars(0);

    if (prefersReducedMotion) return;

    let distance = 0;
    let lastTime = performance.now();
    const speed = { scale: 1 };

    function tick() {
      // Skip the work while the tab is backgrounded — this repositions
      // every character on every single frame, forever, on every page,
      // so there's no reason to keep paying for it when nothing is
      // visible. `lastTime` is refreshed either way so the ring doesn't
      // "jump" to make up for elapsed background time once the tab is
      // visible again.
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (document.hidden) return;

      distance += IDLE_LAP_SPEED * speed.scale * dt;
      positionChars(distance);
    }

    gsap.ticker.add(tick);

    // Real scroll velocity, computed by hand from window.scrollY
    // deltas — no dependency on ScrollTrigger's own velocity
    // tracking, which needs `scrub` wired up to reliably report
    // non-zero speeds. This fires on every native scroll event, so
    // the boost responds to the actual scroll happening right now.
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let idleTimeout: ReturnType<typeof setTimeout>;

    function handleScroll() {
      const now = performance.now();
      const dt = (now - lastScrollTime) / 1000;
      const dy = window.scrollY - lastScrollY;

      if (dt > 0) {
        const velocity = Math.abs(dy / dt); // px/sec
        // Clamped so a hard flick speeds the ring up noticeably
        // without it spinning into a blur.
        const boost = 1 + Math.min(velocity / 300, 14);
        gsap.to(speed, { scale: boost, duration: 0.15, overwrite: true });
      }

      lastScrollY = window.scrollY;
      lastScrollTime = now;

      // Scrolling goes quiet the instant the user stops, so easing
      // back down to idle speed is our own job — a short debounce,
      // then a slow glide back to 1x.
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        gsap.to(speed, { scale: 1, duration: 1.2, ease: "power2.out" });
      }, IDLE_RESUME_DELAY_MS);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(idleTimeout);
    };
  }, []);

  return (
    <Link
      ref={boundsRef}
      href="/contact"
      aria-label="Let's Connect"
      data-cursor="highlight"
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      className="
        fixed right-6 bottom-6 z-[95]
        flex h-28 w-28 items-center justify-center
        sm:right-8 sm:bottom-8 sm:h-32 sm:w-32
      "
    >
      <div
        ref={targetRef}
        className="
          relative flex h-full w-full items-center justify-center
          overflow-hidden rounded-[28px] bg-[#8B5CF6]
          shadow-[0_8px_30px_rgba(0,0,0,0.35)]
        "
      >
        {/* Ring text — always looping, speeds up on scroll. Each
            character is placed by hand (see positionChars above)
            instead of via a native <textPath>. */}
        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {/* Geometry only — invisible, just gives getPointAtLength
              something to sample. Matches the badge's own
              rounded-[28px] look, scaled up to viewBox units. */}
          <path ref={pathRef} d={PATH_D} fill="none" stroke="none" />

          {RING_CHARS.map((char, i) => (
            <text
              key={i}
              ref={(el) => {
                charRefs.current[i] = el;
              }}
              fill="white"
              fontSize="8.6"
              fontFamily="var(--font-geist-mono)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {char}
            </text>
          ))}
        </svg>

        {/* Static center emoji — never moves, no matter the ring speed */}
        <span className="relative z-10 text-[28px] leading-none sm:text-[32px]">
          👀
        </span>

        {/* Screen-reader label — the visible content is decorative */}
        <span className="sr-only">Let&rsquo;s Connect</span>
      </div>
    </Link>
  );
}
