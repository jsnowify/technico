"use client";

import {
  useId,
  useRef,
  useState,
  useEffect,
  type RefObject,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import type { Service } from "@/lib/content/types";
import SlidingText from "@/components/motion/SlidingText";
import { gsap, prefersReducedMotion, supportsFinePointer } from "@/lib/gsap";

// Ribbon fill, alternating per row index (purple, pink, purple, ...)
// — ported from AboutFieldsAccordion.tsx's RIBBON_COLORS. Cycled via
// `index % colors.length` inside useRowHighlightRibbon so it still
// works regardless of how many services are passed in, unlike
// About's fixed 3-item array for its fixed 3 fields.
const RIBBON_COLORS = [
  "var(--color-purple-accent)",
  "var(--color-pink-accent)",
];

/* ----------------------------------------------------------------
    SLIDING ROW HIGHLIGHT — LIQUID RIBBON
    ----------------------------------------------------------------
    Not a single rectangle tweening top/height (that reads as a rigid
    box sliding). The reference clip's bar visibly deforms — its top
    and bottom edges bow and lag independently while moving fast, then
    relax flat once the cursor settles — a liquid/jelly ribbon, not a
    solid block.

    That's built from SIX independent 1D springs, not one: each edge
    (top, bottom) gets a left/mid/right point, and every point chases
    the same target (the hovered row's top or bottom edge) but at its
    own rate. The corner points are tuned stiffer/quicker; the two mid
    points are deliberately softer and lag further behind. Because all
    six ultimately converge on just two values (rowTop, rowBottom),
    the ribbon always relaxes into a flat rectangle at rest — the sag/
    bow only appears while the points are still catching up, exactly
    like the reference.

    The six points are then connected as one SVG path (quadratic
    curves through left→mid→right per edge) and redrawn every frame by
    writing the `d` attribute directly via a ref — never through React
    state — so the 60fps loop doesn't re-render the component. The
    `<svg>` uses a 0–100 viewBox with preserveAspectRatio="none" and
    fills its parent via CSS, so path math is done in percentage-of-
    container units and never needs to know the container's real
    pixel size or re-measure on resize.

    Brand purple-accent rather than a literal color match to the
    reference clip, to stay consistent with the rest of the site.
    ---------------------------------------------------------------- */
interface EdgeTarget {
  topPct: number;
  bottomPct: number;
  opacity: number;
}

interface PointSpring {
  value: number;
  velocity: number;
  stiffness: number;
  damping: number;
}

type PointKey =
  | "topLeft"
  | "topMid"
  | "topRight"
  | "bottomLeft"
  | "bottomMid"
  | "bottomRight";

// Corners react quickly; the two mid points are softer/slower so the
// edge visibly bows while in motion before catching up.
function makePointSprings(): Record<PointKey, PointSpring> {
  return {
    topLeft: { value: 0, velocity: 0, stiffness: 110, damping: 15 },
    topMid: { value: 0, velocity: 0, stiffness: 48, damping: 8 },
    topRight: { value: 0, velocity: 0, stiffness: 90, damping: 13 },
    bottomLeft: { value: 0, velocity: 0, stiffness: 90, damping: 13 },
    bottomMid: { value: 0, velocity: 0, stiffness: 48, damping: 8 },
    bottomRight: { value: 0, velocity: 0, stiffness: 110, damping: 15 },
  };
}

const OPACITY_RATE = 12; // 1/s, exponential approach — the fade itself never bounces

function buildRibbonPath(points: Record<PointKey, PointSpring>) {
  const { topLeft, topMid, topRight, bottomLeft, bottomMid, bottomRight } =
    points;
  // x in 0–100 (percent of width): left=0, mid=50, right=100.
  return [
    `M 0,${topLeft.value}`,
    `Q 25,${topLeft.value} 50,${topMid.value}`,
    `Q 75,${topRight.value} 100,${topRight.value}`,
    `L 100,${bottomRight.value}`,
    `Q 75,${bottomRight.value} 50,${bottomMid.value}`,
    `Q 25,${bottomLeft.value} 0,${bottomLeft.value}`,
    "Z",
  ].join(" ");
}

function useRowHighlightRibbon(
  wrapRef: RefObject<HTMLDivElement | null>,
  colors: string[],
) {
  const pathRef = useRef<SVGPathElement>(null);
  const points = useRef(makePointSprings());
  const opacity = useRef(0);
  const target = useRef<EdgeTarget>({ topPct: 0, bottomPct: 0, opacity: 0 });
  const rafId = useRef<number | null>(null);
  const initialized = useRef(false);

  const applyToDom = () => {
    const path = pathRef.current;
    if (!path) return;
    path.setAttribute("d", buildRibbonPath(points.current));
    path.style.opacity = `${opacity.current}`;
  };

  const runLoop = () => {
    if (rafId.current !== null) return;
    let last = performance.now();

    const tick = (now: number) => {
      // Clamp dt so a background tab / dropped frames can't fling the
      // springs — worst case it just takes one extra frame to settle.
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const p = points.current;
      const t = target.current;
      let allSettled = true;

      (
        [
          ["topLeft", t.topPct],
          ["topMid", t.topPct],
          ["topRight", t.topPct],
          ["bottomLeft", t.bottomPct],
          ["bottomMid", t.bottomPct],
          ["bottomRight", t.bottomPct],
        ] as [PointKey, number][]
      ).forEach(([key, targetValue]) => {
        const pt = p[key];
        const accel = (targetValue - pt.value) * pt.stiffness;
        pt.velocity = (pt.velocity + accel * dt) * Math.exp(-pt.damping * dt);
        pt.value += pt.velocity * dt;

        if (
          Math.abs(targetValue - pt.value) > 0.05 ||
          Math.abs(pt.velocity) > 0.05
        ) {
          allSettled = false;
        }
      });

      opacity.current +=
        (t.opacity - opacity.current) * Math.min(OPACITY_RATE * dt, 1);
      if (Math.abs(t.opacity - opacity.current) > 0.005) allSettled = false;

      applyToDom();

      if (allSettled) {
        (Object.keys(p) as PointKey[]).forEach((key) => {
          p[key].value = key.startsWith("top") ? t.topPct : t.bottomPct;
          p[key].velocity = 0;
        });
        opacity.current = t.opacity;
        applyToDom();
        rafId.current = null;
        return;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
  };

  const setTargetFromIndex = (
    headerRefs: RefObject<(HTMLButtonElement | null)[]>,
    index: number,
  ) => {
    const wrap = wrapRef.current;
    const el = headerRefs.current?.[index];
    if (!wrap || !el) return;
    const wrapRect = wrap.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const height = wrapRect.height || 1;

    target.current = {
      topPct: ((elRect.top - wrapRect.top) / height) * 100,
      bottomPct: ((elRect.bottom - wrapRect.top) / height) * 100,
      opacity: 1,
    };

    // Alternate ribbon fill per row (purple, pink, purple, ...) —
    // ported from AboutFieldsAccordion.tsx. Swapped as an inline
    // style the instant the target moves to a new row; the path's
    // own `transition: fill 300ms ease` (see JSX below) softens the
    // swap instead of it snapping instantly.
    if (pathRef.current) {
      pathRef.current.style.fill = colors[index % colors.length];
    }

    // First appearance: snap straight to position (only the opacity
    // fades in) rather than springing in from a resting 0,0 — moving
    // fast toward the very first hovered row would otherwise read as
    // an odd pop/slide-in from the top of the section.
    if (!initialized.current) {
      initialized.current = true;
      const p = points.current;
      (Object.keys(p) as PointKey[]).forEach((key) => {
        p[key].value = key.startsWith("top")
          ? target.current.topPct
          : target.current.bottomPct;
        p[key].velocity = 0;
      });
      applyToDom();
    }

    if (prefersReducedMotion) {
      const p = points.current;
      (Object.keys(p) as PointKey[]).forEach((key) => {
        p[key].value = key.startsWith("top")
          ? target.current.topPct
          : target.current.bottomPct;
        p[key].velocity = 0;
      });
      opacity.current = 1;
      applyToDom();
      return;
    }

    runLoop();
  };

  const hide = () => {
    target.current = { ...target.current, opacity: 0 };
    if (prefersReducedMotion) {
      opacity.current = 0;
      applyToDom();
      return;
    }
    runLoop();
  };

  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return { pathRef, setTargetFromIndex, hide };
}

/* ================================================================
    SERVICES ACCORDION
    ================================================================
    Recreation of the SERVICES_2ND_SECTION reference: one service is
    fully expanded (title, subtitle, pull-quote, copy, deliverable
    chips, "Learn More"), every other service collapses to just its
    name set in large type with a toggle box on the right. Clicking a
    collapsed row expands it and collapses whichever was open —
    standard single-open accordion, matching the reference. (The
    original "V" toggle can also collapse a row back to nothing open —
    kept exactly as-is, since that's the existing behavior.)

    Visual choices beyond the reference screenshot (which was a
    static mock, not a spec):
    - The toggle glyphs ("V" for the open row, "X" for closed rows)
        are kept as literal bracketed letters, consistent with this
        site's existing "[ SERVICES ]" / "[ LEARN MORE ]" bracket
        typography rather than swapped for icon-font chevrons.
    - Row dividers use border-white/10, matching the hairline
        dividers already used elsewhere in dark sections
        (ServicesMarketOverview's stats grid).
    - The giant collapsed titles sit at white/20 (visible but clearly
        secondary) and brighten on hover to signal they're clickable.

    MOTION
    ------
    Two layers, both skipped outright under prefers-reduced-motion
    rather than disabled after the fact: the GSAP entrance never
    registers, and each panel spring jumps straight to its end
    state instead of animating (the `prefersReducedMotion` check
    inside `useSpringPanel`, same flag the ribbon above uses):

    1. ENTRANCE — eyebrow + each row fade/rise in with a stagger as
        the section scrolls into view, the same
        useGSAP + ScrollTrigger + prefersReducedMotion shape used by
        every other animated section on this site (see home/Services.tsx).
        One-shot (no scrub, no repeat) since this is a reveal, not a
        scroll-linked effect.

    2. EXPAND/COLLAPSE — both the collapsed header and the expanded
        panel are always mounted per row, and the toggle just flips
        which one has height — same "never unmount, animate real
        layout height" shape as the project's other accordions
        (QuestionsAnswers.tsx / MobileNav's Services disclosure). Where
        this one now deliberately diverges: those use a CSS
        `grid-template-rows` transition on a fixed cubic-bezier ease;
        this one drives height with the same hand-rolled spring math as
        the ribbon above (see `useSpringPanel`), so opening/closing a
        row reads as the same physical material as the hover effect
        rather than a generic eased curve — a slight overshoot-and-
        settle instead of a slide that just stops. Opacity isn't a
        separate fade; it's derived from height progress (current /
        natural), so content only turns fully readable once it's
        actually had room to grow into.

        A closing block's spring starts immediately; an appearing block
        is deliberately delayed 150ms, so the outgoing content visibly
        recedes before the incoming content grows in, instead of both
        fighting for the same space mid-transition — carried over
        unchanged from the previous CSS version.

        No attempt to morph the title text itself between its two very
        different type sizes/positions (that would mean scaling live
        text via transform, which reads as a distracting stretch) — the
        crossfade sells the transition without warping any type.
    ================================================================ */

interface HeightSpring {
  value: number;
  velocity: number;
}

// Tuned snappier than the ribbon's lazy liquid chase above — this
// fires off a direct click, not a cursor-follow, so it needs to feel
// immediate — but keeps the same overshoot-then-settle character
// rather than a linear/eased stop, simulated at ~280ms to full size
// with a small (~5-7%) bounce that fully settles under ~800ms (this
// site's own "content reveal" duration guideline).
const PANEL_SPRING_STIFFNESS = 280;
const PANEL_SPRING_DAMPING = 20;
const PANEL_SETTLE_PX = 0.5;
const PANEL_SETTLE_VELOCITY = 1;

// A CLOSING panel's spring wants to overshoot past 0 by the same
// physics that make an OPENING panel overshoot past its natural
// height — but height can't go negative, so that overshoot used to
// just get clamped away, silently eating all the bounce energy below
// the visible floor. That's why opening read as springy but
// collapsing read as a flat stop. Treat 0 as a floor the spring
// bounces off instead: when the value dips below it, reflect it back
// up (losing some energy each bounce, like a ball), so the collapse
// visibly settles in a couple of diminishing hops — same physical
// character as the hover ribbon, now on both directions.
const PANEL_FLOOR_RESTITUTION = 0.45;

// A block that's *appearing* (growing from 0) waits this long before
// it starts moving — see the MOTION note above.
const PANEL_APPEAR_DELAY_MS = 150;

/**
 * Drives one collapsible block's height + opacity with the same
 * hand-rolled spring math as the row-highlight ribbon above, instead
 * of the CSS `grid-template-rows` easing this site's other
 * accordions use. Deliberately different from those: this is the one
 * spot that should feel like the same physical material as the hover
 * ribbon, so it gets its own physics rather than the shared
 * cubic-bezier pattern.
 *
 * `wrapRef` is the element whose height is animated — overflow
 * hidden, height written directly via the DOM every frame, never
 * through React state, same reasoning as the ribbon: a 60fps loop
 * shouldn't re-render the row. `contentRef` wraps the real content
 * and is only ever read (via `scrollHeight`) to find out how tall
 * "fully open" is; its own size is never touched, so it stays
 * measurable no matter what height the wrapper is currently at.
 *
 * The wrapper's *initial* inline style is captured once via a lazy
 * `useState` — giving the very first paint the correct height/opacity
 * with no JS measurement or flash of the wrong state — and is never
 * recomputed after that. Every update from then on goes through the
 * ref, so React's own re-renders (e.g. when the sibling block's
 * `isExpanded` flips) never fight the spring mid-flight.
 */
function useSpringPanel<ContentEl extends HTMLElement = HTMLDivElement>(
  isExpanded: boolean,
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Generic over the content element (the header row's measured
  // content is its <button>, the panel's is a <div>) and typed as a
  // nullable union — rather than useRef<ContentEl>(null), which TS
  // infers as the read-only RefObject variant — because the header
  // row merges this with an external callback ref and needs to
  // assign `.current` itself; see the merged ref on the header
  // <button> in AccordionRow below.
  const contentRef = useRef<ContentEl | null>(null);
  // Placeholder only — the mount effect below sets this to a real
  // measured value before anything ever reads it.
  const spring = useRef<HeightSpring>({ value: 0, velocity: 0 });
  const target = useRef(0);
  const naturalHeight = useRef(0);
  const rafId = useRef<number | null>(null);
  const delayId = useRef<number | null>(null);
  const mounted = useRef(false);

  const [initialStyle] = useState<CSSProperties>(() => ({
    height: isExpanded ? "auto" : "0px",
    opacity: isExpanded ? 1 : 0,
  }));

  const applySettled = (expanded: boolean) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.style.height = expanded ? "auto" : "0px";
    wrap.style.opacity = expanded ? "1" : "0";
  };

  const applyFrame = (heightPx: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const clamped = Math.max(0, heightPx);
    wrap.style.height = `${clamped}px`;
    wrap.style.opacity = `${Math.min(1, clamped / (naturalHeight.current || 1))}`;
  };

  const runLoop = () => {
    if (rafId.current !== null) return;
    let last = performance.now();

    const tick = (now: number) => {
      // Same dt clamp as the ribbon — a dropped frame just costs one
      // extra frame to settle instead of flinging the spring.
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const s = spring.current;
      const t = target.current;
      const accel = (t - s.value) * PANEL_SPRING_STIFFNESS;
      s.velocity =
        (s.velocity + accel * dt) * Math.exp(-PANEL_SPRING_DAMPING * dt);
      s.value += s.velocity * dt;

      // Bounce off the floor instead of clipping into it — see
      // PANEL_FLOOR_RESTITUTION above.
      if (s.value < 0) {
        s.value = -s.value * PANEL_FLOOR_RESTITUTION;
        s.velocity = -s.velocity * PANEL_FLOOR_RESTITUTION;
      }

      const settled =
        Math.abs(t - s.value) < PANEL_SETTLE_PX &&
        Math.abs(s.velocity) < PANEL_SETTLE_VELOCITY;

      if (settled) {
        s.value = t;
        s.velocity = 0;
        applySettled(t > 0);
        rafId.current = null;
        return;
      }

      applyFrame(s.value);
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
  };

  const beginTransition = (expanded: boolean) => {
    naturalHeight.current = contentRef.current?.scrollHeight ?? 0;
    target.current = expanded ? naturalHeight.current : 0;

    // Resync the spring's starting point from the real DOM only when
    // nothing is currently animating — a settled wrapper's actual
    // rendered height (whether "auto" or "0px") is the true starting
    // value. Mid-flight, `spring.current.value` already tracks it
    // frame by frame, so re-reading here would fight the loop instead
    // of helping it (and would kill the velocity a rapid re-toggle
    // should carry into its reversal).
    if (rafId.current === null) {
      spring.current.value =
        wrapRef.current?.getBoundingClientRect().height ?? 0;
    }

    if (prefersReducedMotion) {
      spring.current = { value: target.current, velocity: 0 };
      applySettled(expanded);
      return;
    }

    runLoop();
  };

  useEffect(() => {
    if (!mounted.current) {
      // First mount: snap straight to the current state — already
      // correct in the DOM via `initialStyle` above — rather than
      // springing in from a resting 0 the instant the row hydrates.
      mounted.current = true;
      naturalHeight.current = contentRef.current?.scrollHeight ?? 0;
      target.current = isExpanded ? naturalHeight.current : 0;
      spring.current = { value: target.current, velocity: 0 };
      return;
    }

    if (delayId.current !== null) {
      window.clearTimeout(delayId.current);
      delayId.current = null;
    }

    if (isExpanded) {
      delayId.current = window.setTimeout(() => {
        delayId.current = null;
        beginTransition(true);
      }, PANEL_APPEAR_DELAY_MS);
    } else {
      beginTransition(false);
    }
    // beginTransition/applySettled/runLoop close only over refs and
    // module-level constants, so they're stable in every way that
    // matters here even though they're redefined each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  useEffect(() => {
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      if (delayId.current !== null) window.clearTimeout(delayId.current);
    };
  }, []);

  return { wrapRef, contentRef, initialStyle };
}

function AccordionRow({
  service,
  isOpen,
  onOpen,
  onCollapse,
  headerRef,
  onHeaderHover,
}: {
  service: Service;
  isOpen: boolean;
  onOpen: () => void;
  onCollapse: () => void;
  headerRef: (el: HTMLButtonElement | null) => void;
  onHeaderHover: () => void;
}) {
  const [learnMoreHovered, setLearnMoreHovered] = useState(false);
  const panelId = useId();

  // Header is "expanded" (visible, full height) exactly when this row
  // is NOT the open one; the panel is expanded when it is. Each block
  // gets its own independent spring — see useSpringPanel above.
  const header = useSpringPanel<HTMLButtonElement>(!isOpen);
  const panel = useSpringPanel(isOpen);

  return (
    <div className="accordion-row">
      {/* Collapsed header — always mounted; springs to 0 height
            (rather than unmounting) when this row is the open one, so
            the swap is a height/opacity transition instead of a pop. */}
      <div
        ref={header.wrapRef}
        aria-hidden={isOpen}
        style={{ overflow: "hidden", ...header.initialStyle }}
      >
        <button
          ref={(el) => {
            headerRef(el);
            header.contentRef.current = el;
          }}
          type="button"
          onClick={onOpen}
          onPointerEnter={(e) => {
            // Touch/pen synthesize pointerenter on tap too — gate to
            // real mice so a tap-to-open doesn't also momentarily
            // fire the hover-ribbon path right before the scroll-
            // driven one (see ServicesAccordion) takes over, which
            // was producing a visible flicker on touch devices.
            if (e.pointerType === "mouse") onHeaderHover();
          }}
          onFocus={onHeaderHover}
          tabIndex={isOpen ? -1 : 0}
          aria-expanded={false}
          aria-controls={panelId}
          aria-label={`Expand ${service.title}`}
          className="group relative z-10 flex w-full items-center px-6 py-10 text-left sm:px-10 sm:py-14 md:px-14"
        >
          <span className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6">
            <span className="min-w-0 text-[clamp(1.75rem,8vw,104px)] leading-[0.95] font-medium tracking-tight break-words text-white/20 normal-case transition-colors duration-300 group-hover:text-white">
              {service.title}
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 font-mono text-sm text-white/40 transition-[color,border-color,transform] duration-300 group-hover:translate-x-1 group-hover:border-white/70 group-hover:text-white sm:h-12 sm:w-12">
              X
            </span>
          </span>
        </button>
      </div>

      {/* Expanded panel — always mounted; springs from 0 height when
            this row becomes the open one. */}
      <div
        id={panelId}
        ref={panel.wrapRef}
        aria-hidden={!isOpen}
        style={{ overflow: "hidden", ...panel.initialStyle }}
        className="bg-purple-accent"
      >
        <div
          ref={panel.contentRef}
          className="mx-auto max-w-6xl px-6 pt-16 pb-14 sm:px-10 sm:pt-20 sm:pb-16 md:px-14"
        >
          <div className="flex items-start justify-between gap-6 sm:gap-10">
            <button
              type="button"
              onClick={onCollapse}
              tabIndex={isOpen ? 0 : -1}
              aria-expanded={true}
              aria-label={`Collapse ${service.title}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/25 font-mono text-lg text-white transition-colors duration-300 hover:border-white/50 sm:h-14 sm:w-14"
            >
              V
            </button>

            <div className="min-w-0 text-right">
              <h2 className="text-[clamp(1.75rem,8vw,104px)] leading-[0.95] font-medium tracking-tight break-words text-white normal-case">
                {service.title}
              </h2>
              {service.subtitle && (
                <p className="mt-3 font-mono text-xs tracking-[0.14em] text-white/60 uppercase sm:text-sm">
                  {service.subtitle}
                </p>
              )}
            </div>
          </div>

          {service.quote && (
            <p className="mt-10 max-w-xl text-xl leading-snug font-normal tracking-tight text-white text-balance sm:mt-12 sm:text-2xl md:text-3xl">
              &ldquo;{service.quote}&rdquo;
            </p>
          )}

          <div className="mt-10 ml-auto max-w-xl space-y-5 text-right sm:mt-12">
            {service.description.map((paragraph, i) => (
              <p
                key={i}
                className="font-mono text-xs leading-loose tracking-wide text-white/50 uppercase text-pretty sm:text-sm"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {service.tags && service.tags.length > 0 && (
            <div className="mt-8 ml-auto flex max-w-xs flex-wrap justify-end gap-2 sm:max-w-sm">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-white/20 bg-white/5 px-3.5 py-2 font-mono text-[11px] tracking-[0.08em] text-white uppercase sm:text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <Link
            href={`/services/${service.slug}`}
            aria-label={`Learn more about ${service.title}`}
            onMouseEnter={() => setLearnMoreHovered(true)}
            onMouseLeave={() => setLearnMoreHovered(false)}
            className="mt-10 inline-flex w-fit items-center font-mono text-xs tracking-[0.14em] text-white uppercase transition-colors duration-300 hover:text-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-secondary sm:mt-12 sm:text-sm"
          >
            <span aria-hidden="true">[&nbsp;</span>
            <SlidingText text="Learn More" isHovered={learnMoreHovered} />
            <span aria-hidden="true">&nbsp;]</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ServicesAccordion({
  services,
}: {
  services: Service[];
}) {
  // No row is expanded on load — every service starts collapsed, and
  // only opens once the visitor actually clicks one. (Previously
  // defaulted to the first service open.)
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const rowsWrapRef = useRef<HTMLDivElement>(null);
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { pathRef, setTargetFromIndex, hide } = useRowHighlightRibbon(
    rowsWrapRef,
    RIBBON_COLORS,
  );
  // Persists across the scroll-effect's re-runs (it re-runs whenever
  // openSlug changes) so the hysteresis below has continuity instead
  // of resetting to "no active row" on every open/close.
  const scrollActiveIndexRef = useRef<number>(-1);

  /* --------------------------------------------------------------
      TOUCH FALLBACK — SCROLL-DRIVEN RIBBON
      --------------------------------------------------------------
      The ribbon above is driven by onPointerEnter/onFocus, which
      never fire on touch (no hover concept on phones/tablets/iPad,
      including Apple Pencil — same `pointer: fine` signal the rest
      of the site already uses to branch touch vs. mouse behavior).
      On those devices the ribbon instead tracks whichever collapsed
      row's header is nearest a fixed scan line as the page scrolls,
      so the same "current row" affordance survives without a
      cursor — scrolling stands in for hovering.

      Reads headerRefs directly rather than duplicating them, so
      this and the hover path always agree on row geometry. The
      currently-open row is skipped by slug rather than by measuring
      its header's height: that header's *button* element keeps its
      natural (unclipped) layout box even while its 0-height wrapper
      visually hides it, so a height check on the button itself would
      never actually exclude it.

      STABILITY — a plain "closest row wins" comparison flickers
      whenever the scan line sits near the midpoint between two rows:
      a couple of pixels of scroll can flip the winner back and forth
      every frame. `scrollActiveIndexRef` adds hysteresis — a new row
      only takes over once it's genuinely closer than the current one
      by more than SWITCH_MARGIN_PX, not just marginally closer — so
      the ribbon holds still through that boundary instead of
      juddering between two rows.

      PERFORMANCE — two guards keep this cheap:
      - An IntersectionObserver only attaches the scroll listener
          while the section is actually on/near screen, so a scroll
          listener isn't running for the entire page lifetime.
      - The listener itself only sets a flag; the actual
          getBoundingClientRect() pass and ribbon update happen once
          per animation frame via requestAnimationFrame, so a fast
          fling can't trigger more than one layout read per frame.
      -------------------------------------------------------------- */
  useEffect(() => {
    if (supportsFinePointer) return;

    if (openSlug !== null) {
      // A row is open — the ribbon has nothing left to track (the
      // open panel already reads as purple on its own), so it's
      // fully disabled rather than continuing to sweep across the
      // remaining collapsed rows behind it. It re-enables itself
      // automatically the moment openSlug goes back to null, since
      // that flips this effect's dependency and re-runs it.
      hide();
      scrollActiveIndexRef.current = -1;
      return;
    }

    const SWITCH_MARGIN_PX = 28;

    let ticking = false;
    let rafId: number | null = null;

    const scoreOf = (el: HTMLButtonElement, scanLine: number) => {
      const rect = el.getBoundingClientRect();
      const rowCenter = (rect.top + rect.bottom) / 2;
      return Math.abs(rowCenter - scanLine);
    };

    const updateFromScroll = () => {
      ticking = false;
      const refs = headerRefs.current;
      const viewportHeight = window.innerHeight;
      const scanLine = viewportHeight * 0.4;

      let bestIndex = -1;
      let bestScore = Infinity;

      refs.forEach((el, i) => {
        if (!el || services[i]?.slug === openSlug) return;
        const rect = el.getBoundingClientRect();
        // Skip rows nowhere near the viewport — no point ranking a
        // row that's several screens away.
        if (rect.bottom < -viewportHeight || rect.top > viewportHeight * 2)
          return;
        const score = Math.abs((rect.top + rect.bottom) / 2 - scanLine);
        if (score < bestScore) {
          bestScore = score;
          bestIndex = i;
        }
      });

      // Hysteresis: keep the current row unless the new candidate is
      // meaningfully closer, so a scan line hovering near a row
      // boundary doesn't flicker the ribbon between the two.
      const currentIndex = scrollActiveIndexRef.current;
      const currentEl = currentIndex >= 0 ? refs[currentIndex] : null;
      const currentStillValid =
        !!currentEl && services[currentIndex]?.slug !== openSlug;

      if (currentStillValid && bestIndex !== currentIndex) {
        const currentScore = scoreOf(currentEl, scanLine);
        if (currentScore - bestScore < SWITCH_MARGIN_PX) {
          bestIndex = currentIndex;
          bestScore = currentScore;
        }
      }

      scrollActiveIndexRef.current = bestIndex;

      if (bestIndex >= 0) {
        setTargetFromIndex(headerRefs, bestIndex);
      } else {
        hide();
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      rafId = requestAnimationFrame(updateFromScroll);
    };

    const attach = () => {
      // Idempotent: detach first so a stray extra intersection
      // callback (spec allows more than one per state) can't stack
      // duplicate listeners.
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    };

    const detach = () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          attach();
          updateFromScroll();
        } else {
          detach();
          scrollActiveIndexRef.current = -1;
          hide();
        }
      },
      { rootMargin: "20% 0px" },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      detach();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
    // setTargetFromIndex/hide close only over refs (see
    // useRowHighlightRibbon above) and services is the stable prop
    // array, so only openSlug needs to be a real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSlug]);

  // Entrance: eyebrow + rows fade/rise in with a stagger as the
  // section crosses into view. One-shot reveal, not scroll-linked —
  // no scrub, no repeat, no matchMedia breakpoint split (this one
  // doesn't need a different mobile behavior, unlike Services.tsx's
  // pin+scrub). Skipped entirely under prefers-reduced-motion, same
  // guard used everywhere else GSAP touches this site.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const rows = gsap.utils.toArray<HTMLElement>(".accordion-row");

      gsap.set(".accordion-eyebrow", { opacity: 0, y: 16 });
      gsap.set(rows, { opacity: 0, y: 40 });

      gsap.to(".accordion-eyebrow", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      gsap.to(rows, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="bg-black-bg">
      <div className="mx-auto max-w-6xl px-6 pt-16 sm:px-10 sm:pt-20 md:px-14">
        <div className="accordion-eyebrow flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 bg-white" />
          <span className="font-mono text-xs tracking-[0.14em] text-white uppercase sm:text-sm">
            Services
          </span>
        </div>
      </div>

      <div
        ref={rowsWrapRef}
        onPointerLeave={(e) => {
          // Same touch-vs-mouse gate as the header's onPointerEnter:
          // a tap's release synthesizes pointerleave here too, which
          // was killing the scroll-driven ribbon a frame after it
          // had just been set for the row the user tapped.
          if (e.pointerType === "mouse") hide();
        }}
        className="relative mt-10 divide-y divide-white/10 border-t border-white/10 sm:mt-14"
      >
        {/* Sliding highlight ribbon — a single SVG path whose six
                edge points spring-chase whichever collapsed row is
                currently hovered/focused (see useRowHighlightRibbon
                above). Fills the row-list container exactly via
                preserveAspectRatio="none" on a 0–100 viewBox, so the path
                math stays in percentage units and never needs to re-
                measure on resize. Sits behind the row content (headers
                are z-10) so the title reads clearly against it. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d=""
            opacity={0}
            style={{ transition: "fill 300ms ease" }}
          />
        </svg>

        {services.map((service, index) => (
          <AccordionRow
            key={service.slug}
            service={service}
            isOpen={service.slug === openSlug}
            onOpen={() => setOpenSlug(service.slug)}
            onCollapse={() => setOpenSlug(null)}
            headerRef={(el) => {
              headerRefs.current[index] = el;
            }}
            onHeaderHover={() => setTargetFromIndex(headerRefs, index)}
          />
        ))}
      </div>
    </section>
  );
}
