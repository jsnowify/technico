"use client";

import {
  useId,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type RefObject,
  type CSSProperties,
} from "react";
import { useGSAP } from "@gsap/react";
import Button from "@/components/ui/Button";
import SlidingText from "@/components/motion/SlidingText";
import { SITE_PHONE_HREF } from "@/lib/constants";
import { gsap, prefersReducedMotion, supportsFinePointer } from "@/lib/gsap";

/* ================================================================
   ABOUT FIELDS ACCORDION
   ================================================================
   Rebuilt to match ServicesAccordion.tsx's accordion pattern
   (row-highlight ribbon on hover/scroll, spring-driven expand/
   collapse, giant collapsed titles that push the rows below down,
   single-open behavior, GSAP entrance) instead of the previous
   "Wembi" centered/overlay-panel version.

   Adapted from Services in two ways:
   - Light theme: this section sits on bg-white-bg, so every color
     that was white/black in Services is flipped to black-text here
     (collapsed titles run black-text/25 -> black-text on hover,
     dividers use black-text/15).
   - Simpler data: FieldItem only has label/description/color (no
     subtitle, quote, tags, or slug), so the open panel only renders
     a close button + title, the description, and a "Book a Call"
     link standing in for Services' "Learn More" link.

   ROW-HIGHLIGHT RIBBON COLOR:
   The ribbon now alternates fill color per row (purple, pink,
   purple — see RIBBON_COLORS below) instead of a single static
   fill-purple-accent class. The color is applied directly as an
   inline style on the <path>, updated every time the ribbon target
   moves to a new row index (see setTargetFromIndex inside
   useRowHighlightRibbon). A short CSS transition on `fill` softens
   the swap when jumping between rows.

   The image well and the standalone "Book a Call" button above the
   list are page content, not part of the accordion itself, and are
   kept as they were.

   BUGFIX (ribbon stuck on collapse):
   onOpen/onCollapse used to only flip `openIndex` state. The ribbon
   and hover state are event-driven (real pointerenter/pointerleave),
   but clicking "V" to collapse changes layout under a *static*
   cursor — browsers don't fire pointer events just because an
   element moved under a motionless mouse. Result: the ribbon stayed
   parked at its last shape/position after collapsing. Fix: call
   `hide()` explicitly in both onOpen and onCollapse so the ribbon
   force-clears on every state change instead of waiting on a pointer
   event that may never come. Same root cause on the touch/scroll
   fallback — added an explicit `updateFromScroll()` call so the
   scan-line resyncs immediately on collapse instead of waiting for
   the next scroll/resize or the IntersectionObserver's first fire.
   ================================================================ */

// Shared link style for citation-style links inside panel body copy
// (e.g. "search engine results pages", "content marketing"). Kept as
// a constant so all three fields render links identically.
const FIELD_LINK_CLASS =
  "underline decoration-white/40 underline-offset-2 transition-colors duration-300 hover:text-white hover:decoration-white";

interface FieldItem {
  label: string;
  /** Short subhead shown above the body copy inside the open panel. */
  heading: string;
  /** Body copy — paragraphs and/or a bullet list, in source order.
   *  ReactNode (not a plain string) so inline links and <ul> lists
   *  can live in the same block. */
  content: ReactNode;
  /** Panel background. Defaults match below — swap in real per-field
   *  colors once picked; bg-purple-secondary is this site's only
   *  defined accent right now. */
  color: string;
}

const FIELDS: FieldItem[] = [
  {
    label: "Approach",
    heading:
      "Our Approach to Digital Marketing — Strategy First with Consistent Execution",
    content: (
      <>
        <ul className="space-y-2">
          <li>
            — Discovering important customer behaviours and analyzing trends to
            stay ahead of the curve.
          </li>
          <li>
            — Building integrated campaigns across SEO, social, design, and
            content that speak directly to your target.
          </li>
          <li>
            — Measuring success through web analytics, key performance
            indicators (KPIs), and transparent reporting, so you always know
            where your business stands.
          </li>
        </ul>
        <p>
          Our digital marketing positions your brand on top of{" "}
          <a
            href="https://www.coursera.org/articles/what-is-serp"
            target="_blank"
            rel="noopener noreferrer"
            className={FIELD_LINK_CLASS}
          >
            search engine results pages
          </a>{" "}
          (SERPs) and social media channels. We fine-tune campaigns to build
          brand awareness. It&rsquo;s all about results, not just reach.
        </p>
      </>
    ),
    color: "bg-purple-secondary",
  },
  {
    label: "Business",
    heading: "Businesses Choose Technico Digital Solutions and Here’s Why",
    content: (
      <>
        <p>
          We implement the perfect balance between creativity, data, and
          transparency to provide real results. Running a digital marketing
          campaign? Integrating{" "}
          <a
            href="https://nytlicensing.com/latest/marketing/what-value-content-marketing/"
            target="_blank"
            rel="noopener noreferrer"
            className={FIELD_LINK_CLASS}
          >
            content marketing
          </a>
          ? Our team brings the best of both worlds with modern digital tactics
          and a solid understanding of traditional marketing.
        </p>
        <ul className="space-y-2">
          <li>— Proven track record with measurable ROI</li>
          <li>— Clear communication and collaborative workflow</li>
          <li>— Tailored strategies, never one-size-fits-all</li>
          <li>— Ongoing optimization and support</li>
        </ul>
      </>
    ),
    color: "bg-pink-accent",
  },
  {
    label: "Marketing",
    heading: "Let Our Digital Marketing Team Put Your Business on Top",
    content: (
      <p>
        Ready to see your business soar? If you&rsquo;re tired of ineffective
        campaigns and low engagement, it&rsquo;s time to work with a team that
        knows how to turn things around. Partner with the{" "}
        <a
          href="https://technicosolutions.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={FIELD_LINK_CLASS}
        >
          digital agency marketing
        </a>{" "}
        team at Technico Digital Solutions and put your brand at the forefront
        of success today.
      </p>
    ),
    color: "bg-purple-secondary",
  },
];

// Placeholder tints only — swap for real per-field photos/renders,
// keyed the same way once they exist (see HoverImageSwap.tsx).
const IMAGE_TINTS = [
  "bg-black-text/10",
  "bg-purple-secondary/15",
  "bg-black-text/15",
];

// Ribbon fill per row index — purple, pink, purple. Uses the theme's
// CSS variables directly (see globals.css @theme block) so it stays
// in sync with the design tokens instead of hardcoding hex values.
const RIBBON_COLORS = [
  "var(--color-purple-accent)",
  "var(--color-pink-accent)",
  "var(--color-purple-accent)",
];

/* ----------------------------------------------------------------
    SLIDING ROW HIGHLIGHT — LIQUID RIBBON
    ----------------------------------------------------------------
    Ported from ServicesAccordion.tsx verbatim (see that file for the
    full design rationale on why this is six independent springs
    instead of one rectangle tween). Kept as its own copy rather than
    a shared import so each accordion stays self-contained.

    Extended here to accept a `colors` array: whenever the ribbon's
    target moves to a new row (setTargetFromIndex), the <path>'s
    fill is swapped to colors[index] via inline style, so the shape
    animation and the color swap are decoupled — color changes
    instantly (softened by a CSS transition), shape springs as
    before.
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

const OPACITY_RATE = 12; // 1/s, exponential approach

function buildRibbonPath(points: Record<PointKey, PointSpring>) {
  const { topLeft, topMid, topRight, bottomLeft, bottomMid, bottomRight } =
    points;
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

    // Swap fill to this row's color. Plain style assignment (not
    // springed) — the shape ribbon animates via RAF above, while the
    // color swap is handled by the CSS transition on the <path>
    // itself (see the `style` prop where pathRef is rendered).
    if (pathRef.current && colors[index]) {
      pathRef.current.style.fill = colors[index];
    }

    const wrapRect = wrap.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const height = wrapRect.height || 1;

    target.current = {
      topPct: ((elRect.top - wrapRect.top) / height) * 100,
      bottomPct: ((elRect.bottom - wrapRect.top) / height) * 100,
      opacity: 1,
    };

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

/* ----------------------------------------------------------------
    SPRING PANEL — ported from ServicesAccordion's `useSpringPanel`
    ----------------------------------------------------------------
    Same two-block shape as Services: the collapsed HEADER and the
    expanded PANEL are both always mounted, each with its own
    independent spring, and the toggle just flips which one has
    height. Height is written directly to the DOM every frame via a
    ref (never through React state), so the 60fps loop doesn't
    re-render the row.
    ---------------------------------------------------------------- */
interface HeightSpring {
  value: number;
  velocity: number;
}

const PANEL_SPRING_STIFFNESS = 280;
const PANEL_SPRING_DAMPING = 20;
const PANEL_SETTLE_PX = 0.5;
const PANEL_SETTLE_VELOCITY = 1;

// Same floor-bounce as Services: a closing spring wants to overshoot
// past 0 the same way an opening spring overshoots past its natural
// height, so 0 is treated as a floor it bounces off instead of a
// hard clamp — otherwise collapsing reads as a flat stop while
// opening reads as springy.
const PANEL_FLOOR_RESTITUTION = 0.45;

// A block that's *appearing* (growing from 0) waits this long so the
// outgoing block visibly recedes first instead of both fighting for
// the same space mid-transition.
const PANEL_APPEAR_DELAY_MS = 150;

function useSpringPanel<ContentEl extends HTMLElement = HTMLDivElement>(
  isExpanded: boolean,
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<ContentEl | null>(null);
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
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const s = spring.current;
      const t = target.current;
      const accel = (t - s.value) * PANEL_SPRING_STIFFNESS;
      s.velocity =
        (s.velocity + accel * dt) * Math.exp(-PANEL_SPRING_DAMPING * dt);
      s.value += s.velocity * dt;

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

function FieldRow({
  item,
  isOpen,
  onOpen,
  onCollapse,
  headerRef,
  onHeaderEnter,
  onHeaderLeave,
}: {
  item: FieldItem;
  isOpen: boolean;
  onOpen: () => void;
  onCollapse: () => void;
  headerRef: (el: HTMLButtonElement | null) => void;
  onHeaderEnter: () => void;
  onHeaderLeave: () => void;
}) {
  const [ctaHovered, setCtaHovered] = useState(false);
  const panelId = useId();

  const header = useSpringPanel<HTMLButtonElement>(!isOpen);
  const panel = useSpringPanel(isOpen);

  return (
    <div className="accordion-row">
      {/* Collapsed header — always mounted; springs to 0 height when
          this row is the open one, so the swap is a height/opacity
          transition instead of a pop. Light-theme version of
          Services' row: dim black-text instead of dim white. */}
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
            if (e.pointerType === "mouse") onHeaderEnter();
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") onHeaderLeave();
          }}
          onFocus={onHeaderEnter}
          onBlur={onHeaderLeave}
          tabIndex={isOpen ? -1 : 0}
          aria-expanded={false}
          aria-controls={panelId}
          aria-label={`Expand ${item.label}`}
          className="group relative z-10 flex w-full items-center px-5 py-8 text-left sm:px-8 sm:py-10"
        >
          <span className="mx-auto flex w-full max-w-3xl items-center justify-between gap-6">
            <span className="min-w-0 text-[28px] leading-[0.95] font-medium tracking-tight break-words text-black-text/25 transition-colors duration-300 group-hover:text-black-text sm:text-[104px]">
              {item.label}
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-black-text/20 font-mono text-sm text-black-text/40 transition-[color,border-color,transform] duration-300 group-hover:translate-x-1 group-hover:border-black-text/70 group-hover:text-black-text sm:h-12 sm:w-12">
              X
            </span>
          </span>
        </button>
      </div>

      {/* Expanded panel — always mounted; springs from 0 height when
          this row becomes the open one. Pushes the rows below it
          down (never overlays), matching Services. */}
      <div
        id={panelId}
        ref={panel.wrapRef}
        aria-hidden={!isOpen}
        style={{ overflow: "hidden", ...panel.initialStyle }}
        className={item.color}
      >
        <div
          ref={panel.contentRef}
          className="mx-auto max-w-3xl px-5 pt-12 pb-10 sm:px-8 sm:pt-16 sm:pb-12"
        >
          <div className="flex items-start justify-between gap-6">
            <button
              type="button"
              onClick={onCollapse}
              tabIndex={isOpen ? 0 : -1}
              aria-expanded={true}
              aria-label={`Collapse ${item.label}`}
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/30 font-mono text-base text-white transition-colors duration-300 hover:border-white/60 sm:h-12 sm:w-12"
            >
              V
            </button>

            <h3 className="min-w-0 text-right text-[28px] leading-[0.95] font-medium tracking-tight break-words text-white sm:text-[104px]">
              {item.label}
            </h3>
          </div>

          <div className="mt-8 ml-auto max-w-xl space-y-6 text-right sm:mt-10">
            <h4 className="text-lg leading-snug font-semibold text-white sm:text-xl">
              {item.heading}
            </h4>
            <div className="space-y-4 font-mono text-xs leading-loose tracking-wide text-white/70 text-pretty sm:text-sm [&_ul]:space-y-2">
              {item.content}
            </div>
          </div>

          <a
            href={SITE_PHONE_HREF}
            aria-label={`Book a call about ${item.label}`}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            className="mt-8 ml-auto inline-flex w-fit items-center font-mono text-xs tracking-[0.14em] text-white uppercase transition-colors duration-300 hover:text-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white sm:mt-10 sm:text-sm"
          >
            <span aria-hidden="true">[&nbsp;</span>
            <SlidingText text="Book a Call" isHovered={ctaHovered} />
            <span aria-hidden="true">&nbsp;]</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AboutFieldsAccordion() {
  // No row is expanded on load, matching Services' current behavior.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const rowsWrapRef = useRef<HTMLDivElement>(null);
  const headerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { pathRef, setTargetFromIndex, hide } = useRowHighlightRibbon(
    rowsWrapRef,
    RIBBON_COLORS,
  );
  const scrollActiveIndexRef = useRef<number>(-1);

  const activeImageIndex = openIndex ?? hoverIndex ?? 0;

  /* --------------------------------------------------------------
      TOUCH FALLBACK — SCROLL-DRIVEN RIBBON
      --------------------------------------------------------------
      Ported from ServicesAccordion: on devices without a fine
      pointer, the ribbon tracks whichever collapsed row's header is
      nearest a fixed scan line as the page scrolls, so the "current
      row" affordance survives without a cursor.
      -------------------------------------------------------------- */
  useEffect(() => {
    if (supportsFinePointer) return;

    if (openIndex !== null) {
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
        if (!el || i === openIndex) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -viewportHeight || rect.top > viewportHeight * 2)
          return;
        const score = Math.abs((rect.top + rect.bottom) / 2 - scanLine);
        if (score < bestScore) {
          bestScore = score;
          bestIndex = i;
        }
      });

      const currentIndex = scrollActiveIndexRef.current;
      const currentEl = currentIndex >= 0 ? refs[currentIndex] : null;
      const currentStillValid = !!currentEl && currentIndex !== openIndex;

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

    // BUGFIX: force an immediate resync when we land back in the
    // collapsed state (e.g. right after tapping "V" to collapse),
    // instead of waiting for the IntersectionObserver's first async
    // callback or the next scroll/resize event. Without this the
    // ribbon can sit stale until the user scrolls again.
    updateFromScroll();

    return () => {
      observer.disconnect();
      detach();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  // Entrance: rows fade/rise in with a stagger as the section
  // crosses into view — same one-shot useGSAP + ScrollTrigger shape
  // as Services, skipped under prefers-reduced-motion.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const rows = gsap.utils.toArray<HTMLElement>(".accordion-row");

      gsap.set(rows, { opacity: 0, y: 40 });

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
    <section
      ref={sectionRef}
      aria-label="About: our fields"
      className="w-full bg-white-bg"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pt-24 sm:pt-32">
        {/* Image well — flat placeholder tint, swapped per
            hovered/open item; see IMAGE_TINTS note above. */}
        <div
          className={`aspect-[4/5] w-full max-w-md transition-colors duration-500 ${IMAGE_TINTS[activeImageIndex]}`}
        />

        <div className="mt-10 w-full max-w-xs sm:w-auto">
          <Button to={SITE_PHONE_HREF} variant="primary" size="md">
            Book a Call
          </Button>
        </div>
      </div>

      <div
        ref={rowsWrapRef}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") hide();
        }}
        className="relative mt-16 divide-y divide-black-text/15 border-t border-black-text/15 sm:mt-20"
      >
        {/* Sliding highlight ribbon — see useRowHighlightRibbon
            above. Sits behind the row content (headers are z-10).
            No static fill class anymore — color is set per-frame in
            setTargetFromIndex from RIBBON_COLORS, softened by the
            transition below. */}
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

        {FIELDS.map((item, index) => (
          <FieldRow
            key={item.label}
            item={item}
            isOpen={index === openIndex}
            onOpen={() => {
              setOpenIndex(index);
              // BUGFIX: force-clear the ribbon immediately. Without
              // this, collapsing/expanding under a static cursor
              // leaves the ribbon parked at its pre-click shape
              // since no pointer event fires just from layout moving
              // under a motionless mouse. It will reappear on the
              // next real hover/scroll.
              hide();
            }}
            onCollapse={() => {
              setOpenIndex(null);
              hide();
            }}
            headerRef={(el) => {
              headerRefs.current[index] = el;
            }}
            onHeaderEnter={() => {
              setHoverIndex(index);
              setTargetFromIndex(headerRefs, index);
            }}
            onHeaderLeave={() => {
              setHoverIndex((h) => (h === index ? null : h));
            }}
          />
        ))}
      </div>
    </section>
  );
}
