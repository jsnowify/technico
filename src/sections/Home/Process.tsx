// Process.tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";

import Button from "../../components/ui/Button";
import ReactiveGrid from "../../components/effects/ReactiveGrid";
import ScrambleText from "../../components/motion/ScrambleText";
import ScrambleReveal from "../../components/motion/Scramblereveal";
import ScrollRevealWords from "../../components/motion/ScrollRevealWords";
import { Blink, StatusDot } from "../../components/motion/Blink";

/**
 * "08 / Process" — new closing section, rendered after Partners on the
 * Home page (see pages/Home/Home.tsx). Covers the brief's "Technico
 * Digital Solutions Will Propel Your Business Forward" copy end to
 * end: the propel-forward headline + lead, the "How Our Digital
 * Marketing Experts Do It?" methodology copy, and the four-step
 * "Our Proven Approach" breakdown.
 *
 * WHY IT'S NUMBERED 08, PLACED AFTER PARTNERS
 *
 * 00–07 are already spoken for elsewhere on Home (Hero's own
 * 02/System + 03/Metrics readouts, Introduction 01, Approach 04,
 * Diagnostics 05, Services 06, Partners 07), and several of those
 * numbers are woven tightly into per-item content (Diagnostics'
 * "05/05 Issues Identified" stat, Services' six-item `§ 06.0x`
 * labels) in ways that make renumbering them error-prone without a
 * build to verify against. 08 is the first free slot, and closing on
 * "here is exactly what happens after you reach out" reads naturally
 * right before the footer — proof (Partners) then process (this),
 * each with its own CTA rather than reusing Partners'.
 *
 * THE "REVERSE" HORIZONTAL SEQUENCE
 *
 * Services.tsx's pinned horizontal scroll always starts on panel one
 * and drives forward (`xPercent = -progress * max * 100`). This
 * section is asked to do the opposite: start reversed. Rather than
 * just flipping the math and leaving the four steps in a still-
 * chronological "Strategy Call → Test, Run, Optimize" order (which
 * would just show them backwards for no reason), the whole section is
 * framed as a launch countdown — T‑04 down to T‑01, then liftoff —
 * which gives "reverse" an actual narrative reason to exist and fits
 * the sci-fi/systems-console language (StatusDot, ReactiveGrid ships,
 * scan lines) already used everywhere else on this page.
 *
 * Mechanically:
 *  - STEPS holds the four steps in normal chronological reading order
 *    (Strategy Call first, Test/Run/Optimize last) — that's what the
 *    mobile stacked fallback renders, top to bottom, so small screens
 *    still read the process in the order it actually happens.
 *  - The desktop pinned track renders `[...STEPS].reverse()` — Test/
 *    Run/Optimize (T‑01, the step closest to launch) is DOM-first,
 *    Strategy Call (T‑04, furthest from launch) is DOM-last.
 *  - The pin's render function inverts progress
 *    (`xPercent = -(1 - progress) * max * 100`), so at progress 0 the
 *    track is already scrolled to its far end — showing the DOM-last
 *    panel, which is T‑04 — and animates back toward xPercent 0 as
 *    the user keeps scrolling, arriving at the DOM-first panel, T‑01,
 *    right as the pin releases into the LIFTOFF band below it.
 *  - Net effect: the countdown genuinely counts down as you scroll
 *    forward (T‑04 → T‑03 → T‑02 → T‑01 → Liftoff), while the pin
 *    itself is mechanically the reverse of Services' — it starts at
 *    its scrolled-through end state and unwinds back to zero, instead
 *    of starting at zero and progressing forward.
 *
 * Every other primitive here is reused, not invented: ScrambleText/
 * ScrambleReveal for labels, ScrollRevealWords for the two lead
 * sentences, Blink/StatusDot for the console chrome, ReactiveGrid +
 * a cropped watermark numeral for the ambient background, the
 * `[data-io-reveal]` fade/slide loop for ordinary content, and the
 * same gsap.matchMedia lg-breakpoint pin/stack split Services.tsx
 * uses so touch devices never get a scroll-jacked track.
 */

type Step = {
  /** Chronological order, 1-indexed — what the mobile stack numbers. */
  order: number;
  /** Countdown label for the desktop launch-sequence track. */
  countdown: string;
  title: string;
  detail: string;
  items: readonly string[];
};

const STEPS: readonly Step[] = [
  {
    order: 1,
    countdown: "T—04",
    title: "Strategy Call",
    detail:
      "Understand your current business objectives, challenges, and what you aim to achieve through digital marketing.",
    items: [
      "Target audience, demographics, and behaviour patterns",
      "Customer preferences mapped to tailor strategy",
      "Competitor review — strengths, weaknesses, openings",
    ],
  },
  {
    order: 2,
    countdown: "T—03",
    title: "Audit & Value Mapping",
    detail:
      "We examine your website's performance, user experience, navigation, loading speed, mobile-friendliness, and design.",
    items: [
      "Keyword usage and on-page optimization review",
      "Backlink profile and local SEO considerations",
      "Detailed audit report with clear recommendations",
    ],
  },
  {
    order: 3,
    countdown: "T—02",
    title: "3-Month Plan, Pitch & Build",
    detail:
      "A detailed 3-month plan outlining specific strategies, tactics, and objectives aligned with your business goals.",
    items: [
      "Campaigns set up across SEO, PPC, social, and email",
      "Content creation scoped alongside the media plan",
      "Execution scheduled to the agreed-upon timeline",
    ],
  },
  {
    order: 4,
    countdown: "T—01",
    title: "Test, Run, Optimize",
    detail:
      "Campaigns go live across search, social, and email — then we watch the numbers, not our assumptions.",
    items: [
      "KPIs tracked across every active channel",
      "Organic traffic, conversion, and CTR monitored",
      "Cost-per-acquisition read weekly, not quarterly",
    ],
  },
];

const CHANNELS = ["SEO", "Paid Advertising", "Social Media", "Email Marketing"];

/* ============================================================
   COUNTDOWN RING — a slimmed-down relative of Services'
   PanelGeometry: one dashed reference ring plus one accent arc that
   fills as its panel becomes active. Positioned back-left/front-right
   depending on parity so it reads as a per-panel device rather than a
   repeated sticker.
   ============================================================ */
function CountdownRing({
  flipped,
  fillRef,
  compact = false,
}: {
  flipped: boolean;
  fillRef?: (el: SVGCircleElement | null) => void;
  compact?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 300"
      className={`pointer-events-none absolute ${
        compact
          ? "h-[140px] w-[140px] xl:h-[180px] xl:w-[180px]"
          : "h-[200px] w-[200px] xl:h-[260px] xl:w-[260px]"
      } ${
        flipped
          ? compact
            ? "-bottom-9 -right-9 rotate-180"
            : "-bottom-14 -right-14 rotate-180"
          : compact
            ? "-left-9 -top-9"
            : "-left-14 -top-14"
      }`}
    >
      <circle
        cx="150"
        cy="150"
        r="120"
        fill="none"
        stroke="black"
        strokeOpacity="0.12"
        strokeWidth="1"
        strokeDasharray="1 7"
      />
      <circle
        ref={fillRef}
        cx="150"
        cy="150"
        r="120"
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity="0.6"
        strokeWidth="1.5"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="1"
        transform="rotate(-90 150 150)"
      />
    </svg>
  );
}

/* ============================================================
   STEP PANEL
   ============================================================ */
function StepPanel({
  step,
  showGeometry,
  arcFillRef,
  countRef,
}: {
  step: Step;
  showGeometry: boolean;
  arcFillRef?: (el: SVGCircleElement | null) => void;
  countRef?: (el: HTMLDivElement | null) => void;
}) {
  const flipped = step.order % 2 === 0;

  return (
    <div className="relative w-full px-6 sm:px-10 lg:px-0">
      {showGeometry && <CountdownRing flipped={flipped} fillRef={arcFillRef} />}

      <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-14">
        <div className="relative lg:col-span-5">
          <div
            ref={countRef}
            aria-hidden="true"
            className="pointer-events-none absolute -top-8 left-0 hidden select-none font-mono text-[7rem] font-black leading-none tracking-[-0.04em] text-black/[0.05] will-change-transform md:block lg:text-[8.5rem]"
          >
            {step.countdown}
          </div>

          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-black/45">
              <span className="text-[var(--color-accent)]">
                {step.countdown}
              </span>
              <span className="hidden text-black/30 sm:inline">{`Step 0${step.order} / 04`}</span>
              <span className="ml-auto hidden items-center gap-1.5 text-black/40 sm:inline-flex">
                <StatusDot />
                Armed
              </span>
            </div>

            <h3 className="text-2xl font-semibold uppercase leading-[1.05] tracking-[-0.02em] text-black sm:text-3xl lg:text-[2.35rem]">
              {step.title}
            </h3>

            <p className="mt-6 max-w-md text-sm leading-relaxed text-black/65 lg:text-[15px]">
              {step.detail}
            </p>
          </div>
        </div>

        <div className="relative border-t border-black/10 pt-8 lg:col-span-7 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
          <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.14em] text-black/35">
            Checklist
          </div>
          <ul>
            {step.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-t border-black/10 py-3 text-sm text-black/75 first:border-t-0 lg:text-[15px]"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STEP PEEK PANEL — desktop pinned-track card only, mirrors
   Services.tsx's ServicePeekPanel. Narrower than the canvas so the
   next/previous step peeks in at the card edges, big countdown
   digit standing in for the reference's giant stat number, real
   step copy kept intact with the checklist compressed into a tag
   row so it fits the narrower card. StepPanel above is untouched
   and still powers the mobile / reduced-motion stacked fallback.
   ============================================================ */
function StepPeekPanel({
  step,
  arcFillRef,
  countRef,
}: {
  step: Step;
  arcFillRef?: (el: SVGCircleElement | null) => void;
  countRef?: (el: HTMLDivElement | null) => void;
}) {
  const flipped = step.order % 2 === 0;

  const header = (
    <div className="relative z-10">
      <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-black/45">
        <span className="text-[var(--color-accent)]">{step.countdown}</span>
        <span className="hidden text-black/30 sm:inline">{`Step 0${step.order} / 04`}</span>
        <span className="ml-auto hidden items-center gap-1.5 text-black/40 sm:inline-flex">
          <StatusDot />
          Armed
        </span>
      </div>

      <h3 className="max-w-md text-[1.6rem] font-semibold uppercase leading-[1.08] tracking-[-0.02em] text-black xl:text-[2rem]">
        {step.title}
      </h3>

      <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-black/60 xl:text-sm">
        {step.detail}
      </p>

      <div className="mt-6 flex max-w-sm flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9.5px] uppercase tracking-[0.13em] text-black/40">
        {step.items.map((item) => (
          <span key={item} className="flex items-center gap-1.5">
            <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );

  const stat = (
    <div className="relative z-10">
      <div
        ref={countRef}
        className="font-mono text-[3.5rem] font-black leading-none tracking-[-0.02em] text-black will-change-transform xl:text-[4.5rem]"
      >
        {step.countdown}
      </div>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-black/35">
        Checklist · {step.items.length} items
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full flex-col justify-between py-6">
      <CountdownRing flipped={flipped} fillRef={arcFillRef} compact />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute select-none font-mono text-[5.5rem] font-black leading-none tracking-[-0.03em] text-black/[0.045] xl:text-[7rem] ${
          flipped ? "-bottom-2 -right-1" : "-top-2 -left-1"
        }`}
      >
        {step.countdown}
      </div>
      {flipped ? stat : header}
      {flipped ? header : stat}
    </div>
  );
}

/* ============================================================
   SECTION
   ============================================================ */
export default function Process() {
  const rootRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const countRefs = useRef<Array<HTMLDivElement | null>>([]);
  const arcRefs = useRef<Array<SVGCircleElement | null>>([]);
  const tickerRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const railRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const stackedRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Desktop track is DOM-reversed — see header comment. Order here is
  // [T-01 ... T-04], i.e. the step closest to launch comes first in
  // the DOM and the first chronological step comes last.
  const trackSteps = [...STEPS].reverse();
  const maxIndex = STEPS.length - 1;

  /* ============================================================
     ORDINARY REVEALS — identical pattern to every other section.
     ============================================================ */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const items = Array.from(
        root.querySelectorAll<HTMLElement>("[data-io-reveal]"),
      );

      if (prefersReducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        if (topLineRef.current) gsap.set(topLineRef.current, { scaleX: 1 });
        return;
      }

      if (items.length) {
        gsap.set(items, { autoAlpha: 0, y: 40 });
        items.forEach((el) => {
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          });
        });
      }

      const line = topLineRef.current;
      if (line) {
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(line, {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: line,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });
      }

      const watermark = watermarkRef.current;
      if (watermark) {
        gsap.fromTo(
          watermark,
          { xPercent: 6, opacity: 0.5 },
          {
            xPercent: -2,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: watermark,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.3,
            },
          },
        );
      }

      const scan = scanLineRef.current;
      if (scan && watermark) {
        gsap.fromTo(
          scan,
          { top: "0%", opacity: 0 },
          {
            top: "100%",
            opacity: 0.9,
            duration: 1.8,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: watermark,
              start: "top 75%",
              toggleActions: "play none none none",
            },
            onComplete: () => {
              gsap.to(scan, { opacity: 0, duration: 0.7, delay: 0.1 });
            },
          },
        );
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => items.includes(st.trigger as HTMLElement))
          .forEach((st) => st.kill());
      };
    },
    { scope: rootRef },
  );

  /* ============================================================
     LAUNCH-SEQUENCE PIN — reversed Services.tsx mechanism.
     ============================================================ */
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();
      const panelCount = trackSteps.length;

      mm.add("(min-width: 1024px)", () => {
        const canvas = canvasRef.current;
        const track = trackRef.current;
        if (!canvas || !track) return;

        const setTrackX = gsap.quickSetter(track, "x", "px");

        // TIMING FIX — same reasoning as Services.tsx's pin: no
        // opacity/scale fade at the pin boundaries (the reference cuts
        // straight in/out), and real dwell time per card comes from
        // stretching the scroll distance the pin consumes, not from
        // touching how far the track itself travels.
        const RUNWAY_MULTIPLIER = 1.6;

        // PEEK-CARD MATH — same reasoning as Services.tsx's pin: cards
        // are now a fraction of the canvas width instead of 100% of
        // it, so the old "xPercent -100 per panel" trick (which only
        // worked because track width === child width) no longer
        // lines up. Measure the real overflow and drive x in pixels.
        //
        // NOTE: only the translateX uses this pixel measurement. The
        // active-card figure (`continuous`, below) stays plain
        // `inverted * maxIndex` — progress-based, not pixel-based.
        // Deriving it from viewport-center pixel position (an earlier
        // pass did this) breaks the moment cards aren't full-viewport
        // width: the countdown ticker would open already reading the
        // wrong T-minus value before any scrolling happened, since
        // "viewport center" doesn't land on the first visible card
        // once ~2 cards are peeking in at once.
        let scrollLength = 0;
        const measure = () => {
          scrollLength = Math.max(0, track.scrollWidth - canvas.offsetWidth);
          return scrollLength;
        };
        measure();

        const setCountY: Array<((v: number) => void) | undefined> = [];
        const setCountScale: Array<((v: number) => void) | undefined> = [];
        for (let i = 0; i < panelCount; i++) {
          const el = countRefs.current[i];
          if (!el) continue;
          setCountY[i] = gsap.quickSetter(el, "yPercent") as (
            v: number,
          ) => void;
          setCountScale[i] = gsap.quickSetter(el, "scale") as (
            v: number,
          ) => void;
        }

        const lastArcFill = new Array<number>(panelCount).fill(-1);
        let lastActive = -1;

        // progress 0 -> continuous starts at maxIndex (DOM-last panel,
        // T-04); progress 1 -> continuous reaches 0 (DOM-first panel,
        // T-01). This is the inversion described in the header comment.
        const render = (progress: number) => {
          const inverted = 1 - progress;
          const x = -inverted * scrollLength;
          setTrackX(x);

          const continuous = inverted * maxIndex;

          for (let i = 0; i < panelCount; i++) {
            const delta = i - continuous;
            const absDelta = delta < 0 ? -delta : delta;

            const setY = setCountY[i];
            const setScale = setCountScale[i];
            if (setY && setScale) {
              const yRaw = delta * 10;
              setY(yRaw < -12 ? -12 : yRaw > 12 ? 12 : yRaw);
              setScale(1 - (absDelta > 1 ? 1 : absDelta) * 0.06);
            }

            const arc = arcRefs.current[i];
            if (arc) {
              const fill = (absDelta > 1 ? 0 : 1 - absDelta) * 0.86;
              if (Math.abs(fill - lastArcFill[i]) > 0.001) {
                arc.style.strokeDashoffset = String(1 - fill);
                lastArcFill[i] = fill;
              }
            }
          }

          const active = Math.min(maxIndex, Math.round(continuous));

          if (active !== lastActive) {
            lastActive = active;

            const activeStep = trackSteps[active];

            if (tickerRef.current && activeStep) {
              tickerRef.current.textContent = `${activeStep.countdown} / SEQUENCE`;
            }

            for (let i = 0; i < panelCount; i++) {
              const dot = railRefs.current[i];
              if (!dot) continue;
              dot.style.backgroundColor =
                i === active ? "var(--color-accent)" : "";
              dot.style.transform = i === active ? "scale(1.6)" : "scale(1)";
            }
          }

          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${progress})`;
          }
        };

        render(0);

        const st = ScrollTrigger.create({
          trigger: canvas,
          start: "top top",
          end: () => "+=" + measure() * RUNWAY_MULTIPLIER,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => render(self.progress),
          onRefresh: (self) => {
            measure();
            render(self.progress);
          },
        });

        const refreshHandle = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });

        return () => {
          cancelAnimationFrame(refreshHandle);
          st.kill();
        };
      });

      mm.add("(max-width: 1023px)", () => {
        const entries = stackedRefs.current;
        const triggers: ScrollTrigger[] = [];

        entries.forEach((el) => {
          if (!el) return;

          gsap.set(el, {
            clipPath: "inset(24% 0% 24% 0%)",
            opacity: 0,
            scale: 0.98,
            transformOrigin: "center",
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });
          triggers.push(tl.scrollTrigger as ScrollTrigger);

          tl.to(el, {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
          });
        });

        return () => {
          triggers.forEach((t) => t.kill());
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-white py-24 text-black md:py-32 lg:py-40"
    >
      {/* ======================================================
          AMBIENT BACKGROUND
          ====================================================== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ReactiveGrid className="z-0 text-black" opacity={0.08} shipCount={1} />

        <div
          aria-hidden="true"
          ref={watermarkRef}
          className="absolute -right-[6vw] top-[4%] select-none text-[38vw] font-black leading-none tracking-[-0.05em] text-black/[0.04] md:top-[6%] md:text-[30vw]"
        >
          08
          <div
            aria-hidden="true"
            ref={scanLineRef}
            className="absolute inset-x-0 h-px opacity-0"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--color-accent), transparent)",
            }}
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-8 left-6 hidden select-none font-mono text-[8px] uppercase tracking-[0.15em] text-black/20 md:block lg:left-10"
        >
          Grid 08 / A—B
        </div>
      </div>

      <div className="relative z-10">
        {/*
           Header + intro copy get the section's normal side padding.
           The pinned countdown track below is deliberately rendered
           OUTSIDE this padded wrapper (see the comment on canvasRef)
           so it spans the full viewport width on desktop instead of
           inheriting this padding.
        */}
        <div className="px-6 md:px-10 lg:px-12 xl:px-14">
          {/* ==================================================
            TOP META
            ================================================== */}
          <div className="border-t border-black/15 pt-4">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-black/50 lg:text-[10px]">
              <Blink as="span" className="text-[#6D28D9]">
                <ScrambleReveal as="span" variant="micro" start="top 95%">
                  Why Technico
                </ScrambleReveal>
              </Blink>
              <span className="hidden items-center gap-1.5 text-black/35 md:inline-flex">
                <StatusDot />
                <ScrambleReveal as="span" variant="micro" start="top 95%">
                  System Nominal
                </ScrambleReveal>
              </span>
              <ScrambleReveal as="span" variant="micro" start="top 95%">
                08 / Process
              </ScrambleReveal>
            </div>

            <div
              ref={topLineRef}
              aria-hidden="true"
              className="mt-4 h-px w-full bg-[var(--color-accent)]/40"
            />
          </div>

          {/* ==================================================
            HEADLINE — "Technico Digital Solutions Will Propel
            Your Business Forward"
            ================================================== */}
          <div className="mt-14 lg:mt-20">
            <div
              data-io-reveal
              className="mb-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-black/40 lg:mb-8"
            >
              <span className="h-px w-8 bg-[var(--color-accent)]" />
              <ScrambleReveal as="span" variant="micro">
                Forward Motion
              </ScrambleReveal>
            </div>

            <h2 className="max-w-5xl uppercase tracking-[-0.03em] lg:tracking-[-0.05em]">
              <ScrambleText
                as="span"
                variant="display"
                className="block text-[2.5rem] font-semibold leading-[0.98] sm:text-[3.25rem] lg:text-[4.25rem] xl:text-[4.75rem]"
              >
                Technico Digital Solutions Inc
              </ScrambleText>
              <ScrambleText
                as="span"
                variant="display"
                className="block text-[2.5rem] font-semibold leading-[0.98] text-[var(--color-accent)] sm:text-[3.25rem] lg:text-[4.25rem] xl:text-[4.75rem]"
              >
                Will Propel Your Business Forward
              </ScrambleText>
            </h2>

            <ScrollRevealWords
              as="p"
              className="mt-10 max-w-3xl text-xl font-medium leading-snug text-black sm:text-2xl lg:mt-14 lg:text-[1.85rem]"
              start="top 85%"
              end="top 45%"
            >
              We give you a tailored digital marketing strategy to boost
              appointments, optimize ad performance, enhance SEO efforts, and
              streamline client management for maximum growth and profitability.
            </ScrollRevealWords>
          </div>

          {/* ==================================================
            "How Our Digital Marketing Experts Do It?"
            ================================================== */}
          <div className="mt-16 lg:relative lg:mt-24 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-black/10 to-transparent lg:block"
            />

            <div className="lg:col-span-6">
              <div
                data-io-reveal
                className="mb-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-black/30"
              >
                <StatusDot />
                <ScrambleReveal as="span" variant="micro">
                  § 08.01 — Methodology
                </ScrambleReveal>
              </div>

              <h3
                data-io-reveal
                className="text-2xl font-semibold uppercase leading-[1.05] tracking-[-0.02em] text-black sm:text-3xl lg:text-[2.5rem]"
              >
                How Our Digital Marketing Experts Do It?
              </h3>

              <p
                data-io-reveal
                className="mt-6 max-w-md border-l-2 border-black/10 pl-5 text-base leading-relaxed text-black/60 lg:text-[17px]"
              >
                Technico's SEO strategists implement online marketing strategies
                because even the best products shine brighter in the spotlight.
                Data-driven campaigns attract qualified leads and convert them
                into paying clients.
              </p>
            </div>

            <div className="mt-10 lg:col-span-6 lg:mt-0">
              <p
                data-io-reveal
                className="text-sm leading-relaxed text-black/60 lg:text-[15px]"
              >
                Every campaign is backed by audience research, competitor
                analysis, and performance tracking, so your budget targets the
                people most likely to book, buy, or call. If you need more
                inbound leads, stronger local visibility, or a higher return on
                ad spend, let our experts identify the highest-impact channels
                for your market and execute with precision. No guesswork — just
                a clear strategy, consistent execution, and measurable results.
              </p>

              <div
                data-io-reveal
                className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em]"
              >
                {CHANNELS.map((channel) => (
                  <span
                    key={channel}
                    className="rounded-full border border-black/15 px-3 py-1.5 text-black/55"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ==================================================
            "Our Proven Approach" — intro
            ================================================== */}
          <div className="mt-20 lg:mt-28">
            <div
              data-io-reveal
              className="mb-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-black/40 lg:mb-7"
            >
              <span className="h-px w-8 bg-[var(--color-accent)]" />
              <ScrambleReveal as="span" variant="micro">
                Launch Sequence
              </ScrambleReveal>
            </div>

            <h2
              data-io-reveal
              className="max-w-[880px] font-semibold uppercase tracking-[-0.03em] text-black lg:tracking-[-0.04em]"
            >
              <span className="block text-[2.15rem] leading-[1.06] sm:text-[2.75rem] lg:text-[3.5rem] lg:leading-[1.01] xl:text-[3.9rem]">
                Our Proven Approach
              </span>
            </h2>

            <p
              data-io-reveal
              className="mt-7 max-w-2xl text-base leading-relaxed text-black/65 lg:mt-8 lg:text-lg"
            >
              Every engagement follows the same four-step countdown — from first
              call to a fully optimized, live campaign. Scroll to run the
              sequence.
            </p>
          </div>
        </div>

        {/* ==================================================
            DESKTOP PINNED COUNTDOWN TRACK
            ================================================== */}
        <div
          ref={canvasRef}
          className={
            prefersReducedMotion
              ? "hidden"
              : /*
                 * FULL-BLEED FIX: same technique as Services.tsx's
                 * pinned track — this div is a SIBLING of the header's
                 * padded wrapper (`px-6 md:px-10 lg:px-12 xl:px-14`),
                 * not a child of it, so it never inherits that side
                 * padding to begin with. No negative-margin values to
                 * keep in sync with the padding elsewhere; it's full
                 * width by construction, at every breakpoint.
                 */
                "relative mt-20 hidden overflow-hidden lg:block"
          }
          style={{ height: "100vh" }}
          data-cursor="label"
          data-cursor-label="Scroll"
          data-cursor-variant="scroll"
        >
          {/*
             No entry/exit fade — same as Services.tsx, matching the
             reference's hard cut into and out of the pin. This
             wrapper just groups panels + overlays; render() no longer
             touches its opacity/scale/y.
          */}
          <div ref={contentRef} className="absolute inset-0">
            <div className="absolute inset-0 flex items-center">
              <div
                ref={trackRef}
                className="flex h-full w-full will-change-transform"
              >
                {trackSteps.map((step, i) => (
                  <div
                    key={step.order}
                    className="flex h-full w-[80vw] shrink-0 items-center border-r border-black/10 px-7 last:border-r-0 sm:w-[64vw] lg:w-[58vw] lg:px-9 xl:w-[46vw] xl:px-11 2xl:w-[40vw]"
                  >
                    <StepPeekPanel
                      step={step}
                      arcFillRef={(el) => {
                        arcRefs.current[i] = el;
                      }}
                      countRef={(el) => {
                        countRefs.current[i] = el;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-28 z-20 flex items-center justify-between px-10 font-mono text-[10px] uppercase tracking-[0.15em] text-black/45 xl:px-16">
              <span ref={tickerRef}>T—04 / SEQUENCE</span>
              <span>Countdown to Launch</span>
            </div>

            <div className="pointer-events-none absolute bottom-10 right-10 z-20 flex items-center gap-2 xl:right-16">
              {trackSteps.map((step, i) => (
                <span
                  key={step.order}
                  ref={(el) => {
                    railRefs.current[i] = el;
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-black/15 transition-transform"
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px bg-black/10">
              <div
                ref={progressRef}
                className="h-full origin-left bg-[var(--color-accent)]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 lg:px-12 xl:px-14">
          {/* ==================================================
            MOBILE / REDUCED-MOTION STACK — natural chronological
            order, Strategy Call first.
            ================================================== */}
          <div
            className={prefersReducedMotion ? "mt-16 block" : "mt-16 lg:hidden"}
          >
            {STEPS.map((step, i) => (
              <div
                key={step.order}
                ref={(el) => {
                  stackedRefs.current[i] = el;
                }}
                className="border-t border-black/10 py-12 first:border-t-0 sm:py-14"
              >
                <StepPanel step={step} showGeometry={false} />
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================
            LIFTOFF CTA — full-bleed black band, rendered as its
            own sibling (not nested in the padded wrapper above) so
            the background spans the true viewport width; its own
            inner div supplies the matching side padding for content.
            ================================================== */}
        <div
          data-io-reveal
          className="relative z-10 mt-20 bg-black py-14 text-white md:mt-28 md:py-20"
        >
          <div className="flex flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12 xl:px-14">
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/40">
              <ScrambleReveal as="span" variant="micro">
                T—00 / Liftoff
              </ScrambleReveal>
              <div className="mt-2 flex items-center gap-1.5 text-white/25">
                <StatusDot />
                <ScrambleReveal as="span" variant="micro">
                  Availability — Open
                </ScrambleReveal>
              </div>
            </div>

            <Button
              to="/contact"
              variant="primary"
              size="lg"
              icon
              className="w-full text-center whitespace-normal md:w-auto lg:shrink-0 lg:whitespace-nowrap"
            >
              Start Your Countdown to Growth
            </Button>
          </div>
        </div>

        <div className="px-6 md:px-10 lg:px-12 xl:px-14">
          {/* ==================================================
            FOOTER META
            ================================================== */}
          <div className="relative z-10 mt-10">
            <div className="flex items-center justify-between border-t border-black/10 pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-black/30 lg:text-[9px]">
              <ScrambleReveal as="span" variant="micro">
                Technico Digital Solutions Inc
              </ScrambleReveal>
              <span className="hidden items-center gap-1.5 md:inline-flex">
                <StatusDot />
                <ScrambleReveal as="span" variant="micro">
                  System Nominal
                </ScrambleReveal>
              </span>
              <Blink as="span">
                <ScrambleReveal as="span" variant="micro">
                  08.001
                </ScrambleReveal>
              </Blink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
