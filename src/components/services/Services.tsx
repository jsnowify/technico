"use client";

import Link from "next/link";
import type { TransitionEvent } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { SERVICES, type Service } from "@/lib/constants";
import GeometricIcon from "@/components/ui/icons";

/* ================================================================
   SERVICES SECTION

   Static layout

   - 90px outer horizontal padding on large screens
   - 40 / 60 left-right split
   - 92px service typography on large screens
   - More vertical spacing between service items
   - No GSAP
   - No ScrollTrigger

   Hover (rows list):
   - Default (nothing hovered): every row's text is pure white.
   - Once any row is hovered: the hovered row stays pure white,
     every other row dims to 40% opacity.

   ReadCard (desktop):
   - Sticky, swaps text on row hover, else on scroll position.
   - Spinwheel badge pinned to its corner.

   Expand-on-click popup — SINGLE-CARD MORPH:
   - There is exactly ONE animating card element. It carries two
     stacked "faces" (trigger look + modal look) that crossfade
     into each other WHILE the card itself is being FLIP-animated
     from the trigger's on-screen rect to its full modal rect. It
     is not two separate elements swapping — it's one box that
     grows and simultaneously changes what's printed on it, so it
     reads as "the folder card became the modal" instead of "a
     modal appeared over the folder card."
   - The always-in-flow trigger <button> (the one sitting in the
     sticky/grid slot) is only ever used at rest. The instant the
     card starts expanding, that resting button is switched to
     `invisible` (not faded — a fade would imply two competing
     visuals). It's safe to hide it abruptly because the morphing
     card is, pixel-for-pixel, standing in its exact spot showing
     its exact face at that same instant, so nothing visibly pops.
   - The trigger itself gets a small `active:scale` press-down on
     pointerdown, purely as tactile feedback that THIS rectangle is
     the thing about to grow — it always reverts before the click
     handler fires, so it never pollutes the origin-rect measurement.
   - FLIP transform is now computed with independent X/Y scale
     (`scale(scaleX, scaleY)`), not a single width-derived scale —
     so the box always lands pixel-perfect on the origin rect even
     if the trigger and modal aspect ratios aren't identical. A
     uniform scale would quietly stretch/misalign one axis, which
     reads as the card "not really" coming from the click point.
   - Motion is deliberately asymmetric between open and close:
       OPEN  → a soft spring/overshoot on the transform only (the
               box grows a touch past its final size, then settles),
               while background-color/border-radius ease smoothly
               with no overshoot (color values shouldn't extrapolate
               past their target — that looks glitchy).
       CLOSE → a brief "anticipation" pull on the transform before
               it snaps back into the trigger's rect, like a rubber
               band gathering before release.
     Both are still driven by the same two cached rects, so closing
     mid-open is a clean CSS transition retarget either way.
   - The content crossfade is now SEQUENCED relative to the box,
     not simultaneous with it:
       OPEN  → the box starts growing first; the modal content only
               starts fading in ~140ms later, once the box is
               visibly already in motion — reads as "the rectangle
               grew, then revealed what's inside," not "a modal
               appeared and also there's a growing box behind it."
       CLOSE → content fades out quickly (faster than the box
               shrinks), so it's gone well before the box finishes
               collapsing back into the trigger.
   - Face crossfade timing: on open, the card mounts already
     showing the TRIGGER face (matching the resting button, so the
     hand-off is invisible), pinned down to the origin rect via an
     un-transitioned transform. A beat after the transform starts
     transitioning to identity (grow to full size), the face flips
     to the MODAL face — the "material" of the card visibly turns
     from the plain trigger rectangle to the modal mid-flight.
     Closing runs the same idea in reverse, just compressed.
   - There is no shape SVG anymore. The trigger and the modal are
     BOTH plain rounded rectangles — the background-color and the
     border-radius live directly on the single morphing card element
     (cardRef) and are transitioned imperatively in lockstep with
     the FLIP transform. This is what makes the animation "come from
     the rectangle itself": it's the same physical box changing its
     own paint properties over time, not two differently-shaped
     layers crossfading on top of each other.
   - The modal's natural ("rest") rect is measured ONCE per open
     cycle, right after the card mounts at full size but before any
     transform is applied, and cached. Both the open and close FLIP
     maths reuse that cached rect instead of re-measuring the DOM
     mid-animation — re-measuring while a transform is actively
     interpolating would read the current *visual* (already offset)
     box instead of the natural layout box, producing a jump. This
     is what makes closing safe to trigger from ANY point in the
     open animation, not just once it's finished.
   - Because the target transform is always computed from the same
     two fixed rects (origin + cached rest rect), closing while
     still opening is just a normal CSS "transition retarget": the
     browser smoothly interpolates from whatever the current
     transform happens to be toward the new target. No "wait for
     open to finish before you're allowed to close."
   - A forced reflow (`void card.offsetWidth`) sits between writing
     the "from" transform and re-enabling the transition, so the
     browser is guaranteed to commit the starting frame before the
     animation begins — without it, some browsers can coalesce both
     style writes into a single frame and skip the open animation
     entirely.
   - The backdrop is driven the same imperative way (ref + direct
     style writes), so its fade-in always has a real "from: 0"
     frame instead of mounting straight at full opacity.
   - Body scroll lock never touches scrollTop, so closing resumes
     scroll exactly where the user left off.
   ================================================================ */

const SERVICE_ROW_ICONS = [9, 3, 21, 26, 16, 12];

const HEADLINE =
  "Turn more online attention into leads and sales. Use the right mix of digital services to build awareness, generate demand, & support long-term growth.";

/* ---- timing ---- */
const OPEN_MS = 560;
const CLOSE_MS = 380;

/* Transform gets its own, more expressive easing than the paint
   properties (background-color / border-radius) do — overshooting
   a transform looks springy and alive, overshooting a color value
   looks like a rendering bug, so they're kept independent. */
const OPEN_TRANSFORM_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)"; // soft overshoot growth
const OPEN_PAINT_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"; // smooth, no overshoot
const CLOSE_TRANSFORM_EASE = "cubic-bezier(0.36, 0, 0.66, -0.56)"; // anticipation pull, then snap back
const CLOSE_PAINT_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

/* Content crossfade is sequenced relative to the box, not glued to
   it — see the big comment block above for why. */
const OPEN_FACE_DELAY_MS = 140;
const OPEN_FACE_MS = OPEN_MS - OPEN_FACE_DELAY_MS;
const CLOSE_FACE_MS = 200;

/* Both the trigger and the modal are plain rounded rectangles now.
   These are the two end states the single morphing box animates
   between — its own background-color and border-radius, not a
   shape swap. */
const TRIGGER_RADIUS = 24; // px, at the trigger's own (small) scale
const MODAL_RADIUS = 40; // px, at the modal's full scale
const TRIGGER_BG = "#6D28D9";
const MODAL_BG = "#D9D9D9";

function ClosePinwheelIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 121 121"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 0V60.5H60.5009L0 0ZM60.5009 60.5L121 0H60.5009V60.5ZM60.5009 60.5L121 121V60.5H60.5009ZM60.5009 60.5L0 121H60.5009V60.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ================================================================
   SPINWHEEL
   ================================================================ */

function SpinWheel() {
  return (
    <div
      aria-hidden="true"
      className="absolute -right-5 -bottom-5 h-[76px] w-[76px] md:h-[92px] md:w-[92px]"
    >
      <div className="h-full w-full animate-[spin_9s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <defs>
            <path
              id="spinwheel-track"
              d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
            />
          </defs>
          <circle cx="50" cy="50" r="49" fill="#0A0A0C" />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.2"
          />
          <text fill="#ffffff" fontSize="7.5" letterSpacing="1.5">
            <textPath href="#spinwheel-track" startOffset="0%">
              SCROLL TO EXPLORE • SCROLL TO EXPLORE •
            </textPath>
          </text>
        </svg>
      </div>

      <span className="absolute inset-0 flex animate-[spin_9s_linear_infinite_reverse] items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 md:h-5 md:w-5"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
        >
          <path
            d="M12 5v14M12 19l-5-5M12 19l5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

/* ================================================================
   CARD FACES
   Pure content — no sizing wrapper of their own. Whatever box they
   sit in (the small resting trigger, or the big morphing card)
   defines the aspect ratio; these just fill it with percentage-
   based positioning, which is why the same markup can be reused
   at both the trigger's ~1.405 aspect ratio and the modal's
   ~1.404 one without looking off.
   ================================================================ */

function TriggerFaceContent({ service }: { service: Service }) {
  return (
    <>
      {/* READ */}
      <span className="absolute top-[10%] left-[7%] font-mono text-[11px] leading-none tracking-[0.06em] text-white-primary uppercase md:text-[12px]">
        Read
      </span>

      {/* Service name */}
      <span className="absolute inset-0 flex items-center justify-center pt-[8%] text-[20px] leading-none font-medium tracking-tight text-white-primary md:text-[24px] lg:text-[27px]">
        {service.shortTitle}
      </span>
    </>
  );
}

function ModalFaceContent({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  return (
    <>
      {/* Title — sits in the narrow top-left block */}
      <span className="absolute top-[8%] left-[6%] max-w-[28%] text-[18px] leading-tight font-medium tracking-tight text-[#0A0A0C] md:text-[24px] lg:text-[28px]">
        {service.title}
      </span>

      {/* Content — full-width lower area, below the notch. Real
          copy from lib/constants.ts's SERVICES: description first,
          then the same bullet list shown on the /services page and
          the homepage panel (components/home/Services.tsx), so this
          card isn't saying anything different from the rest of the
          site — just a more compact read of it. */}
      <div className="absolute top-[28%] right-[6%] bottom-[7%] left-[6%] overflow-y-auto pr-2 md:top-[26%]">
        <p className="text-[13px] leading-relaxed text-[#0A0A0C]/80 md:text-[15px] lg:text-[17px]">
          {service.description}
        </p>

        <ul className="mt-3 space-y-1.5 md:mt-4 md:space-y-2">
          {service.bullets.map((bullet) => (
            <li
              key={bullet}
              className="text-[12px] leading-relaxed text-[#0A0A0C]/60 md:text-[14px] lg:text-[15px]"
            >
              <span aria-hidden="true" className="mr-1 text-[#0A0A0C]/35">
                &gt;
              </span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* Close — sits in the wide top-right strip */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="group absolute top-[9%] right-[5%] flex items-center gap-3 text-[#0A0A0C]"
      >
        <span className="font-mono text-[11px] tracking-[0.08em] uppercase opacity-70 transition-opacity group-hover:opacity-100 md:text-[13px]">
          Close
        </span>
        <ClosePinwheelIcon className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90 md:h-7 md:w-7" />
      </button>
    </>
  );
}

/* ================================================================
   EXPANDABLE READ CARD
   Owns the resting trigger, the morphing card, the FLIP animation,
   the face crossfade, and the scroll lock lifecycle.
   ================================================================ */

type ModalPhase = "closed" | "opening" | "open" | "closing";

/* Independent X/Y scale — NOT a single width-derived scale — so the
   card always lands pixel-perfect on the origin rect even if the
   trigger and modal boxes don't share an exact aspect ratio. A
   uniform scale would quietly stretch one axis, which is the kind
   of tiny mismatch that makes a "morph" read as "two different
   boxes" instead of "one box that grew." */
function computeFlipTransform(origin: DOMRect, target: DOMRect) {
  const scaleX = origin.width / target.width;
  const scaleY = origin.height / target.height;
  const dx = origin.left - target.left;
  const dy = origin.top - target.top;
  return `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
}

/* Locks page scroll without touching scrollTop (so releasing it
 * resumes exactly where the user left off) and WITHOUT going
 * through a React effect. This used to be a `useBodyScrollLock`
 * hook applied reactively to `expanded`, but that meant the
 * scrollbar-compensation (which changes real viewport width, and
 * this card is sized in vw) could land in the SAME commit as — but
 * AFTER — the card's own rect measurement, so the card would
 * silently resize by the scrollbar's width mid-open. That's the
 * "glitch"/collision: the modal visibly snapping a few pixels right
 * as it started growing. Calling lockScroll() synchronously, before
 * ANY rect is read, guarantees every measurement in this component
 * — origin, rest, everything — happens against the exact same,
 * already-settled viewport. */
function lockScroll(stateRef: {
  current: { overflow: string; paddingRight: string } | null;
}) {
  if (stateRef.current) return; // already locked, no-op
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  stateRef.current = {
    overflow: document.documentElement.style.overflow,
    paddingRight: document.documentElement.style.paddingRight,
  };
  document.documentElement.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
  }
}

function unlockScroll(stateRef: {
  current: { overflow: string; paddingRight: string } | null;
}) {
  if (!stateRef.current) return;
  document.documentElement.style.overflow = stateRef.current.overflow;
  document.documentElement.style.paddingRight = stateRef.current.paddingRight;
  stateRef.current = null;
}

function ExpandableReadCard({ service }: { service: Service }) {
  const [phase, setPhase] = useState<ModalPhase>("closed");
  const [activeService, setActiveService] = useState(service);
  // Flips true a beat into the open animation (after OPEN_FACE_DELAY_MS,
  // once the FLIP transform transition is already visibly moving) —
  // that's the signal to crossfade from the trigger face to the
  // modal face. Reset to false the instant closing starts (a plain
  // state update, not a mount trick, so it runs as a normal reverse
  // crossfade back to the trigger face).
  const [faceCrossfadeReady, setFaceCrossfadeReady] = useState(false);

  const originRectRef = useRef<DOMRect | null>(null);
  // The modal's natural, untransformed layout rect — measured once
  // per open cycle, then reused for BOTH the open and close FLIP
  // maths. Re-measuring via getBoundingClientRect() mid-transition
  // would return the current *visual* (already-offset) box instead
  // of the natural one, which is what makes it safe to close from
  // any point in the open animation without a jump.
  const restRectRef = useRef<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // Background-color/border-radius (and the overflow clip) live on
  // this INNER layer now, not on cardRef itself. cardRef only ever
  // carries the FLIP transform. That split is what lets the
  // SpinWheel badge sit inside cardRef (so it still scales/moves
  // with the card) while sitting outside cardPaintRef (so it never
  // gets clipped by the rounded corner it overlaps).
  const cardPaintRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  // Pending "reveal the modal face" timer for the open sequence —
  // tracked so it can be cancelled if closing interrupts it.
  const faceTimeoutRef = useRef<number | null>(null);
  const scrollLockRef = useRef<{
    overflow: string;
    paddingRight: string;
  } | null>(null);

  const clearFaceTimeout = useCallback(() => {
    if (faceTimeoutRef.current !== null) {
      window.clearTimeout(faceTimeoutRef.current);
      faceTimeoutRef.current = null;
    }
  }, []);

  const handleOpen = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    // Lock FIRST — before reading anything's position — so the
    // viewport is already in its final (post-scrollbar-removal)
    // state for every measurement this open cycle makes.
    lockScroll(scrollLockRef);
    originRectRef.current = trigger.getBoundingClientRect();
    restRectRef.current = null;
    setActiveService(service);
    setPhase("opening");
  }, [service]);

  // Closing is allowed from "opening" OR "open" — this is what
  // makes clicking close/backdrop/Escape responsive even while the
  // open animation is still mid-flight, instead of being ignored.
  // The face-crossfade reset and pending-reveal cancel live HERE
  // (in the handler that actually decides to close) rather than in
  // the layout effect below — calling setState synchronously inside
  // an effect body triggers an extra cascading render, which is
  // exactly what react-hooks/set-state-in-effect flags. Doing it in
  // the event handler means it's just one more state update in the
  // same batch as setPhase, no extra render.
  const handleClose = useCallback(() => {
    clearFaceTimeout();
    setFaceCrossfadeReady(false);
    setPhase((current) =>
      current === "opening" || current === "open" ? "closing" : current,
    );
  }, [clearFaceTimeout]);

  useEffect(() => {
    if (phase !== "opening" && phase !== "open") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, handleClose]);

  // Safety net: if this card unmounts while its modal happens to be
  // open (route change, parent unmount, etc.), don't leave the page
  // permanently scroll-locked.
  useEffect(() => {
    return () => unlockScroll(scrollLockRef);
  }, []);

  const expanded = phase !== "closed";

  useLayoutEffect(() => {
    const card = cardRef.current;
    const backdrop = backdropRef.current;
    const origin = originRectRef.current;
    if (!card || !origin) return;

    if (phase === "opening") {
      // Measure the natural rect BEFORE any transform is applied,
      // and cache it — this is the only time it's safe to read via
      // getBoundingClientRect().
      const rest = card.getBoundingClientRect();
      restRectRef.current = rest;

      // Pin the card down to the trigger's exact position/size —
      // AND its exact paint (background/radius). At this instant
      // it's still showing the trigger face (faceCrossfadeReady is
      // freshly false), so this frame reads as pixel-identical to
      // the resting button it just replaced. Nothing pops, because
      // it's the same box, not a different shape underneath.
      const paint = cardPaintRef.current;
      card.style.transition = "none";
      card.style.transform = computeFlipTransform(origin, rest);
      if (paint) {
        paint.style.transition = "none";
        paint.style.backgroundColor = TRIGGER_BG;
        paint.style.borderRadius = `${TRIGGER_RADIUS}px`;
      }

      if (backdrop) {
        backdrop.style.transition = "none";
        backdrop.style.opacity = "0";
      }

      // Force a synchronous reflow so the browser commits the
      // "none transition" starting frame before we flip transitions
      // back on below. Without this, a single requestAnimationFrame
      // isn't a hard guarantee — some browsers can coalesce both
      // style writes into one frame and skip the open animation
      // entirely (the modal just pops in at full size).
      void card.offsetWidth;

      const raf = requestAnimationFrame(() => {
        card.style.transition = `transform ${OPEN_MS}ms ${OPEN_TRANSFORM_EASE}`;
        card.style.transform = "translate(0px, 0px) scale(1, 1)";
        if (paint) {
          paint.style.transition = [
            `background-color ${OPEN_MS}ms ${OPEN_PAINT_EASE}`,
            `border-radius ${OPEN_MS}ms ${OPEN_PAINT_EASE}`,
          ].join(", ");
          paint.style.backgroundColor = MODAL_BG;
          paint.style.borderRadius = `${MODAL_RADIUS}px`;
        }

        if (backdrop) {
          backdrop.style.transition = `opacity ${OPEN_MS}ms ease-out`;
          backdrop.style.opacity = "0.8";
        }

        // Let the box visibly start growing on its own for a beat
        // before the content reveals — this is what sells "the
        // rectangle grew" rather than "a modal appeared over a
        // growing box." Cancelled below if closing interrupts it.
        clearFaceTimeout();
        faceTimeoutRef.current = window.setTimeout(() => {
          setFaceCrossfadeReady(true);
          faceTimeoutRef.current = null;
        }, OPEN_FACE_DELAY_MS);
      });
      return () => {
        cancelAnimationFrame(raf);
        clearFaceTimeout();
      };
    }

    if (phase === "closing") {
      // Reuse the cached rest rect instead of re-measuring — the
      // card may currently be mid-transform (if we're interrupting
      // an in-progress open), so a fresh getBoundingClientRect()
      // here would read the wrong (already-offset) box. Because the
      // target values are the same fixed rects either way, this is
      // a plain CSS "transition retarget": the browser smoothly
      // interpolates from whatever transform is currently showing
      // toward the new target — no jump, no waiting for the open
      // animation to finish first.
      const rest = restRectRef.current ?? card.getBoundingClientRect();

      // If we're interrupting an open that hadn't revealed the
      // modal face yet, kill that pending reveal — we're on our way
      // out now, it should never fire.
      clearFaceTimeout();

      const paint = cardPaintRef.current;
      card.style.transition = `transform ${CLOSE_MS}ms ${CLOSE_TRANSFORM_EASE}`;
      card.style.transform = computeFlipTransform(origin, rest);
      if (paint) {
        paint.style.transition = [
          `background-color ${CLOSE_MS}ms ${CLOSE_PAINT_EASE}`,
          `border-radius ${CLOSE_MS}ms ${CLOSE_PAINT_EASE}`,
        ].join(", ");
        paint.style.backgroundColor = TRIGGER_BG;
        paint.style.borderRadius = `${TRIGGER_RADIUS}px`;
      }
      // Content evaporates faster than the box collapses — it
      // should be gone well before the rectangle finishes shrinking
      // back into the trigger's spot. (faceCrossfadeReady was
      // already reset to false in handleClose, before phase ever
      // changed — not here, see the comment on handleClose.)

      if (backdrop) {
        backdrop.style.transition = `opacity ${CLOSE_MS}ms ease-in`;
        backdrop.style.opacity = "0";
      }
    }
  }, [phase, clearFaceTimeout]);

  const handleTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLDivElement>) => {
      // Guard against bubbled transitionend events — from the face
      // crossfade divs' own opacity transitions, or the Close
      // label's hover transition. Only the card's own transform
      // transition should drive the phase machine.
      if (e.target !== e.currentTarget) return;
      if (e.propertyName !== "transform") return;

      if (phase === "opening") {
        setPhase("open");
      } else if (phase === "closing") {
        setPhase("closed");
        originRectRef.current = null;
        restRectRef.current = null;
        clearFaceTimeout();
        setFaceCrossfadeReady(false);
        unlockScroll(scrollLockRef);
        if (cardRef.current) {
          cardRef.current.style.transition = "";
          cardRef.current.style.transform = "";
        }
        if (cardPaintRef.current) {
          cardPaintRef.current.style.transition = "";
          cardPaintRef.current.style.backgroundColor = "";
          cardPaintRef.current.style.borderRadius = "";
        }
        if (backdropRef.current) {
          backdropRef.current.style.transition = "";
          backdropRef.current.style.opacity = "";
        }
      }
    },
    [phase, clearFaceTimeout],
  );

  // Which face is showing, and how long the crossfade between them
  // takes. Open and close intentionally use different durations —
  // see the OPEN_FACE_MS / CLOSE_FACE_MS comments above.
  const modalFaceVisible =
    phase === "open" || (phase === "opening" && faceCrossfadeReady);
  const faceMs = phase === "closing" ? CLOSE_FACE_MS : OPEN_FACE_MS;

  return (
    <>
      {/* Resting trigger — the only place this shows up when
          closed. Hidden abruptly (not faded) the instant the card
          starts expanding, because the morphing card is standing in
          its exact spot with its exact face at that same instant.
          The small active:scale press-down is just tactile feedback
          that THIS box is what's about to grow — it always reverts
          before onClick fires, so it never taints the origin-rect
          measurement taken in handleOpen. */}
      <button
        type="button"
        ref={triggerRef}
        onClick={handleOpen}
        aria-label={`Open details for ${service.title}`}
        aria-hidden={expanded}
        tabIndex={expanded ? -1 : 0}
        className={`relative block w-full max-w-[260px] text-left transition-transform duration-150 ease-out active:scale-[0.97] md:max-w-[300px] lg:max-w-[340px] ${
          expanded ? "invisible pointer-events-none" : ""
        }`}
      >
        {/* Painted, clipped layer — background + rounded corners +
            the Read/title text. Only THIS layer clips, so the
            SpinWheel badge below (which deliberately sits half
            outside this box) never gets chopped by the corner. */}
        <div
          style={{
            backgroundColor: TRIGGER_BG,
            borderRadius: `${TRIGGER_RADIUS}px`,
          }}
          className="relative aspect-[444/316] w-full overflow-hidden"
        >
          <TriggerFaceContent service={service} />
        </div>

        {/* Sits outside the clipped layer above, positioned against
            the button (which IS `relative` but has no overflow of
            its own) — so it reads over the corner instead of being
            sliced off at the card's edge. */}
        <SpinWheel />
      </button>

      {expanded && (
        <div
          className="fixed inset-0 z-[100] isolate flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
        >
          {/* Opacity driven imperatively via the ref above — not by
              a React className toggle — so entrance always has a
              real "from: 0" frame to transition out of. */}
          <div
            ref={backdropRef}
            onClick={handleClose}
            aria-hidden="true"
            className="absolute inset-0 bg-[#0A0A0C]"
          />

          {/* The one and only morphing card. Its size classes are
              always the modal's natural size — the FLIP transform
              is what makes it visually start at the trigger's size
              and grow from there. This outer element carries ONLY
              the transform now — no overflow-hidden — so anything
              deliberately positioned outside its bounds (the
              SpinWheel) still scales and moves with it instead of
              getting clipped.
              `will-change: transform` + `backface-visibility: hidden`
              push this onto its own GPU layer for the whole
              animation, instead of the browser repainting it on the
              main thread every frame — that's what actually reads
              as smooth/"floating" rather than janky. */}
          <div
            ref={cardRef}
            onTransitionEnd={handleTransitionEnd}
            style={{
              transformOrigin: "top left",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
            className="relative aspect-[1283/914] w-[min(78vw,760px)] drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
          >
            {/* Painted, clipped layer — background + rounded
                corners + both face contents. This is the layer
                background-color/border-radius animate on. */}
            <div
              ref={cardPaintRef}
              className="absolute inset-0 overflow-hidden"
            >
              <div
                aria-hidden={modalFaceVisible}
                style={{ transitionDuration: `${faceMs}ms` }}
                className={`absolute inset-0 transition-opacity ease-out ${
                  modalFaceVisible
                    ? "pointer-events-none opacity-0"
                    : "opacity-100"
                }`}
              >
                <TriggerFaceContent service={activeService} />
              </div>

              <div
                aria-hidden={!modalFaceVisible}
                style={{ transitionDuration: `${faceMs}ms` }}
                className={`absolute inset-0 transition-opacity ease-out ${
                  modalFaceVisible
                    ? "opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <ModalFaceContent
                  service={activeService}
                  onClose={handleClose}
                />
              </div>
            </div>

            {/* Outside the clipped layer above, so the badge reads
                over the corner instead of being sliced off. Fades
                with the trigger face since it only belongs to that
                look. */}
            <div
              aria-hidden={modalFaceVisible}
              style={{ transitionDuration: `${faceMs}ms` }}
              className={`transition-opacity ease-out ${
                modalFaceVisible
                  ? "pointer-events-none opacity-0"
                  : "opacity-100"
              }`}
            >
              <SpinWheel />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================================================================
   DESKTOP SERVICE ROW
   ================================================================ */

function ServiceRow({
  service,
  iconIndex,
  index,
  onHoverStart,
  onHoverEnd,
}: {
  service: Service;
  iconIndex: number;
  index: number;
  onHoverStart: (index: number) => void;
  onHoverEnd: () => void;
}) {
  return (
    <Link
      href={service.href}
      data-row-index={index}
      onMouseEnter={() => onHoverStart(index)}
      onMouseLeave={onHoverEnd}
      onFocus={() => onHoverStart(index)}
      onBlur={onHoverEnd}
      className="group flex items-center gap-6 border-b border-white-primary/30 py-10 first:pt-0 last:pb-12 md:gap-8"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center text-white-primary/25 transition-colors duration-300 ease-out group-hover:text-white-primary group-focus-visible:text-white-primary md:h-12 md:w-12 lg:h-14 lg:w-14 xl:h-16 xl:w-16"
      >
        <GeometricIcon index={iconIndex} className="h-full w-full" />
      </span>

      <span className="block whitespace-nowrap text-[54px] leading-[0.98] font-normal tracking-[-0.035em] text-white-primary opacity-100 transition-opacity duration-300 ease-out md:text-[64px] lg:text-[76px] xl:text-[92px] group-hover/rows:opacity-40 group-hover/rows:group-hover:opacity-100 group-hover/rows:group-focus-visible:opacity-100">
        {service.shortTitle}
      </span>
    </Link>
  );
}

/* ================================================================
   MOBILE SERVICE ROW
   ================================================================ */

function MobileServiceRow({
  service,
  iconIndex,
  index,
}: {
  service: Service;
  iconIndex: number;
  index: number;
}) {
  return (
    <Link
      href={service.href}
      data-row-index={index}
      className="group flex items-center gap-5 border-b border-white-primary/25 py-7 first:pt-0 last:pb-8"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center text-white-primary/25 transition-colors duration-300 ease-out group-hover:text-white-primary group-focus-visible:text-white-primary group-active:text-white-primary"
      >
        <GeometricIcon index={iconIndex} className="h-full w-full" />
      </span>

      <span className="block text-[29px] leading-[1.1] font-normal tracking-[-0.02em] text-white-primary opacity-100 transition-opacity duration-300 ease-out group-hover/rows:opacity-40 group-hover/rows:group-hover:opacity-100 group-hover/rows:group-active:opacity-100">
        {service.shortTitle}
      </span>
    </Link>
  );
}

/* ================================================================
   SERVICES
   ================================================================ */

export default function Services() {
  const featuredService = SERVICES[0];

  const [scrollIndex, setScrollIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  // Was scoped to the desktop list wrapper only, so on mobile (where
  // that wrapper is `hidden md:grid` → display:none) it never
  // observed anything and scrollIndex just sat frozen at 0. Scoped to
  // the whole section now so it picks up whichever set of
  // `[data-row-index]` rows — desktop or mobile — is actually
  // rendered/visible at the current breakpoint.
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = sectionRef.current;
    if (!container) return;

    const rows = Array.from(
      container.querySelectorAll<HTMLElement>("[data-row-index]"),
    );
    if (rows.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-row-index"));
            if (!Number.isNaN(idx)) setScrollIndex(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  // On mobile nothing ever sets hoverIndex (no mouse enter/focus from
  // a touch tap), so this resolves to plain scrollIndex there —
  // exactly the scroll-driven behavior wanted, no touch tracking.
  const activeIndex = hoverIndex ?? scrollIndex;
  const activeService = SERVICES[activeIndex] ?? featuredService;

  return (
    <section ref={sectionRef} className="bg-[#0A0A0C] text-white-primary">
      {/* ==========================================================
          INTRO
          ========================================================== */}

      <div className="container-x pt-10 sm:pt-12 md:pt-14 lg:pt-16">
        <div className="grid grid-cols-1 md:grid-cols-[40%_60%]">
          <div>
            <p className="font-mono text-sm leading-none tracking-[0.12em] text-white-primary/60 uppercase">
              [ ] Our Services
            </p>
          </div>

          <div className="w-full max-w-[700px]">
            <h2 className="h2-section indent-16 leading-[1.04] font-medium tracking-heading text-white-primary">
              {HEADLINE}
            </h2>
          </div>
        </div>
      </div>

      {/* ==========================================================
          SERVICES AREA
          ========================================================== */}

      <div className="container-x pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-14 lg:pt-36 lg:pb-16">
        {/* DESKTOP */}
        <div className="hidden md:grid md:grid-cols-[40%_60%]">
          <div className="sticky top-28 self-start pt-2 lg:top-32">
            <ExpandableReadCard service={activeService} />
          </div>

          <div className="group/rows w-full">
            {SERVICES.map((service, index) => (
              <ServiceRow
                key={service.title}
                service={service}
                index={index}
                iconIndex={SERVICE_ROW_ICONS[index % SERVICE_ROW_ICONS.length]}
                onHoverStart={setHoverIndex}
                onHoverEnd={() => setHoverIndex(null)}
              />
            ))}
          </div>
        </div>

        {/* MOBILE */}
        <div className="md:hidden">
          {/* Featured ExpandableReadCard removed here — the
              scroll-driven floating icon below now covers "what's
              currently active" on mobile, so a static featuredService
              card pinned above the list was redundant with it. */}

          {/* Floating icon preview — purely scroll-driven (same
              scrollIndex/activeIndex the desktop hover state reads),
              NOT touch/drag tracked. `sticky` on a zero-height wrapper
              so it doesn't push the list down: it holds roughly at
              the vertical center of the viewport while the row text
              scrolls past behind/around it, then un-sticks naturally
              once it reaches the bottom of this relative container
              (last row). All service icons are stacked and crossfade
              via opacity — same idea as HoverImageSwap's layered
              swap, just CSS-only since these are simple SVG marks
              rather than photos needing a clip-path reveal.
              Clickable — links to whichever service is currently
              active, same destination as tapping that row directly.
              `pointer-events-none` stays on the two zero-height/
              full-width wrappers around it (so the empty space to
              either side of the icon still lets taps fall through to
              the row underneath); `pointer-events-auto` is re-enabled
              only on the Link itself, i.e. the actual visible box. */}
          <div className="relative">
            <div className="pointer-events-none sticky top-1/2 z-10 h-0">
              <div className="flex -translate-y-1/2 justify-center">
                <Link
                  href={activeService.href}
                  aria-label={`Open details for ${activeService.title}`}
                  className="pointer-events-auto relative flex h-28 w-28 items-center justify-center rounded-[24px] border border-white-primary/15 bg-white-primary/10 p-6 backdrop-blur-sm transition-transform duration-150 ease-out active:scale-95"
                >
                  {SERVICES.map((service, i) => (
                    <span
                      key={service.title}
                      aria-hidden={i !== activeIndex}
                      className={`absolute inset-0 flex items-center justify-center p-6 text-white-primary transition-opacity duration-500 ease-out ${
                        i === activeIndex ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <GeometricIcon
                        index={SERVICE_ROW_ICONS[i % SERVICE_ROW_ICONS.length]}
                        className="h-full w-full"
                      />
                    </span>
                  ))}
                </Link>
              </div>
            </div>

            <div className="group/rows">
              {SERVICES.map((service, index) => (
                <MobileServiceRow
                  key={service.title}
                  service={service}
                  index={index}
                  iconIndex={
                    SERVICE_ROW_ICONS[index % SERVICE_ROW_ICONS.length]
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
