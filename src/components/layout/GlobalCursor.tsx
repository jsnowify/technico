"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, supportsFinePointer } from "@/lib/gsap";

/* ================================================================
   GLOBAL CURSOR
   ================================================================
   One circle-with-arrow cursor-replacement, mounted ONCE here
   (see app/layout.tsx, as a fixed sibling next to BottomGlassBlur /
   StickyConnectCTA / NoiseOverlay) instead of every section that
   wants this effect re-implementing its own circleRef + rectRef +
   three pointer handlers + useGSAP init, the way
   ServiceMarqueeCta.tsx and TrustedBy.tsx used to.

   OPT-IN VIA data-cursor="circle" — ANY element anywhere in the
   tree gets this cursor just by carrying that attribute:

     <a href="..." data-cursor="circle">some link text</a>

   No ref, no handler, no import needed at the call site. That's
   the whole point of making it global: FAQ.tsx's inline answer
   links, future rich-text/blog body links, ServiceMarqueeCta's
   "Let's talk" row, or anything else can opt in with one attribute
   instead of wiring up GSAP again. `data-cursor-accent="pink"` (or
   "purple") on the same element picks the fill color; omit it and
   it defaults to purple (the site's general-purpose brand accent —
   see Button.tsx's "purple" variant).

   NOT a React context — nothing here needs to call a hook or read
   a provider value. Detection is plain event delegation: one
   `pointermove` listener on `window`, `event.target.closest(...)`
   against the attribute above. That's deliberate — it's what makes
   this work on markup this component never rendered and doesn't
   know about (a future blog post's body HTML, a CMS string, an
   FAQ answer built from plain data), not just JSX call sites that
   remembered to import a hook.

   DETECTION VIA POINTERMOVE, NOT POINTEROVER/OUT — a single
   handler both re-positions the circle AND (by comparing this
   move's closest(...) match against the last one) detects
   enter/leave. That sidesteps the usual pointerover/pointerout
   headache with nested children (an <svg> inside the <a>, etc.)
   firing spurious leave/enter pairs as the pointer crosses child
   boundaries — closest() on every move is naturally immune to
   that, since it always walks up to the same ancestor regardless
   of which descendant the event landed on.

   NO LAG — same as the old ServiceMarqueeCta circle: gsap.set on
   every move, no quickTo/lerp trailing. It reads as the cursor
   itself rather than something chasing it.

   NATIVE CURSOR HIDDEN VIA JS, NOT A STATIC TAILWIND CLASS — the
   old per-component versions had to conditionally render a
   `cursor-none` className (gated behind the reactive
   useSupportsFinePointer/usePrefersReducedMotion hooks, to avoid an
   SSR/hydration mismatch) on every element that wanted this cursor.
   Centralized, that's unnecessary: this effect only ever attaches
   its listeners when the plain (non-reactive) prefersReducedMotion
   / supportsFinePointer constants both allow it, so `cursor: none`
   is only ever applied by setting the matched element's inline
   style right when the pointer actually enters it, and removed
   right when it leaves. Nothing to gate in render output, and
   nothing for a call site to remember to add.
   ================================================================ */

const CURSOR_SELECTOR = '[data-cursor="circle"]';

const ACCENT_VARS: Record<string, string> = {
  pink: "var(--color-pink-accent)",
  purple: "var(--color-purple-accent)",
};
const DEFAULT_ACCENT = "purple";

function resolveAccentColor(target: HTMLElement): string {
  const accent = target.getAttribute("data-cursor-accent");
  return ACCENT_VARS[accent ?? ""] ?? ACCENT_VARS[DEFAULT_ACCENT];
}

export default function GlobalCursor() {
  const circleRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const circle = circleRef.current;
    if (!circle || prefersReducedMotion || !supportsFinePointer) return;

    gsap.set(circle, {
      xPercent: -50,
      yPercent: -50,
      scaleX: 0,
      scaleY: 0,
      opacity: 0,
    });
    circle.style.willChange = "transform, opacity";

    // The element currently "owned" by the cursor — its native
    // cursor is set to none and gets restored the moment it stops
    // being the closest(...) match.
    let activeTarget: HTMLElement | null = null;

    const releaseTarget = () => {
      if (!activeTarget) return;
      activeTarget.style.cursor = "";
      activeTarget = null;
      gsap.to(circle, {
        scaleX: 0,
        scaleY: 0,
        opacity: 0,
        duration: 0.18,
        ease: "power2.in",
        overwrite: "auto",
      });
    };

    const claimTarget = (target: HTMLElement) => {
      activeTarget = target;
      target.style.cursor = "none";
      circle.style.backgroundColor = resolveAccentColor(target);
      // Fast, slightly-overshooting pop — see ServiceMarqueeCta's
      // original doc comment: this has to finish quickly because
      // the native cursor is already gone the instant the pointer
      // crossed in (cursor:none is an instant browser switch, not
      // something that can be animated), so a slow grow-in here is
      // what would read as "no cursor at all" for a beat.
      gsap.to(circle, {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.3,
        ease: "back.out(1.8)",
        overwrite: "auto",
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      // Straight gsap.set, no quickTo/lerp — see file header.
      gsap.set(circle, { x: event.clientX, y: event.clientY });

      const nextTarget =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(CURSOR_SELECTOR)
          : null;
      if (nextTarget === activeTarget) return;

      if (activeTarget) releaseTarget();
      if (nextTarget) claimTarget(nextTarget);
    };

    // Belt-and-suspenders: if the pointer leaves the document
    // entirely (off the edge of the browser window) rather than
    // drifting onto some other element, no further `pointermove`
    // fires to trigger the releaseTarget() above — this catches
    // that case so the circle can't get stuck visible.
    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) releaseTarget();
    };

    window.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerout", onPointerOut);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      if (activeTarget) activeTarget.style.cursor = "";
      gsap.killTweensOf(circle);
      circle.style.willChange = "auto";
    };
  }, []);

  return (
    <span
      ref={circleRef}
      aria-hidden="true"
      // Hidden from the very first paint via inline style, not just
      // the gsap.set() in the effect below — that gsap.set only runs
      // once useGSAP's effect fires (after mount/hydration), so
      // without this the circle rendered at full opacity/scale, top:0
      // left:0 (a visible blob in the corner) for the gap between
      // first paint and that effect running. Setting it here means
      // it's invisible from the static HTML onward; the effect's
      // gsap.set of the same properties afterward is a harmless
      // no-op re-assertion, not what's actually doing the hiding.
      style={{ opacity: 0, transform: "translate(-50%, -50%) scale(0)" }}
      className="pointer-events-none fixed top-0 left-0 z-[130] hidden h-24 w-24 shrink-0 items-center justify-center rounded-full bg-purple-accent sm:flex"
    >
      <svg
        viewBox="0 0 16 16"
        className="h-9 w-9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 12L12 4M12 4H5.5M12 4V10.5"
          stroke="white"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
