import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";

import Button from "../../components/ui/Button";
import TiltCard from "../../components/ui/TiltCard";
import OrbitDial from "../../components/effects/Orbitdial";
import ReactiveGrid from "../../components/effects/ReactiveGrid";
import ScrambleReveal from "../../components/motion/Scramblereveal";
import ScrollRevealWords from "../../components/motion/ScrollRevealWords";
import { Blink, StatusDot } from "../../components/motion/Blink";

/**
 * "05 / Diagnostics" — the section directly following Approach on the
 * Home page.
 *
 * V2 — REDESIGN NOTES
 *
 * The first pass reused the generic [data-io-reveal] fade/slide for
 * every entry, which read as flat next to Approach and Introduction's
 * bigger typographic moves. This version keeps the same diagnostic-
 * record concept (no cards, no accordion) but gives it real presence:
 *
 *   - Each entry gets its own clip-path "screen unmask" + scale-in
 *     timeline (the same technique QuoteMiniScreen already uses for
 *     its display area — inset(30% 0 30% 0) collapsing to 0 — applied
 *     here to a full-width block instead of a small monitor), rather
 *     than the plain autoAlpha/y fade every other section uses. Five
 *     independent ScrollTriggers, same pattern as Introduction's
 *     per-item loop.
 *   - A huge ghost ordinal (the accent color at ~10% opacity, up to
 *     9rem) sits behind each question, fading in with the unmask —
 *     the one clearly "premium editorial" typographic move the brief
 *     asked for, md+ only so it can never cause mobile overflow.
 *   - The scan-rail is rebuilt to size itself from normal document
 *     flow (`absolute inset-y-0` inside a plain relatively-positioned
 *     wrapper) instead of depending on CSS grid row-stretch matching
 *     an unrelated sibling column's height — that dependency was the
 *     likely source of the rail collapsing/misbehaving in the first
 *     pass. Five tick marks light up in accent as their entry
 *     resolves, tied to the same per-entry timeline as the unmask.
 *   - The closing "Resolvable" line is now an accent-bordered pill
 *     instead of a plain caption — the one deliberate color pop per
 *     entry, still a single restrained accent use, not five loud
 *     boxes.
 *   - The close swaps a plain CTA line for an asymmetric pairing: a
 *     single <TiltCard> carrying a big "05/05 Issues Identified"
 *     readout (same stat treatment Hero already uses for its metrics,
 *     reused rather than invented) next to the CTA paragraph and
 *     button — one tactile, pointer-reactive moment at the very end
 *     rather than a static line.
 *
 * Everything still respects prefers-reduced-motion (content is set to
 * its resolved end-state directly, no scroll-linked motion at all),
 * still uses only existing primitives (ScrambleReveal, ScrollRevealWords,
 * Blink, StatusDot, Button, TiltCard), still doesn't pin or scroll-
 * jack anything, and the rail/ghost-numeral chrome is hidden below
 * lg/md respectively so mobile stays a plain, readable single column.
 *
 * V3 — SCRAMBLE-ON-SCROLL FIX
 *
 * Every label/heading in this section previously used <ScrambleText>,
 * which fires a one-shot rAF loop off ScrollTrigger's onEnter /
 * onEnterBack. That loop runs on its own clock, independent of Lenis's
 * scroll-driven ticker — so scrolling quickly (or reversing direction)
 * through the five stacked entries here could leave a scramble still
 * mid-run, or stuck behind ScrambleText's page-wide MAX_CONCURRENT
 * queue, after its text had already scrolled off. That desync is what
 * read as the "bug in scrolling": labels glitching/re-scrambling
 * instead of settling.
 *
 * Swapped every instance to <ScrambleReveal> instead — same glyph-pool
 * decode look, but scrub-driven: glyph resolution is read straight off
 * ScrollTrigger's progress, the same idiom this section already uses
 * for the headline (ScrollRevealWords), the watermark parallax, and
 * the rail beam. No independent timer means nothing to fall out of
 * step with scroll, at any speed or direction.
 */

const PAIN_POINTS = [
  {
    index: "01",
    question: "Are you experiencing low website traffic?",
    cause:
      "Low website traffic is most often caused by weak SEO foundations, insufficient content output, or misaligned keyword targeting, all of which are fixable with the right strategy.",
    consequence:
      "If your pages aren’t ranking, visitors aren’t finding you, and every day without action widens the gap between you and your competitors.",
  },
  {
    index: "02",
    question:
      "Do you find building and engaging a meaningful audience on social media platforms challenging?",
    cause:
      "A meaningful social media audience grows through consistent posting schedules, platform-specific content formats, and genuine two-way engagement, not follower counts alone.",
    consequence:
      "Without a structured approach, even active accounts struggle to convert followers into customers.",
  },
  {
    index: "03",
    question:
      "Is your website design outdated or not user-friendly, leading to a poor user experience?",
    cause:
      "An outdated or difficult-to-navigate website directly increases bounce rates and reduces conversions. Google’s Core Web Vitals now factor page experience into search rankings.",
    consequence:
      "Visitors form an opinion about your site in under a second, and a poor first impression sends them straight to a competitor.",
  },
  {
    index: "04",
    question:
      "Are you struggling to create high-quality and engaging content for your digital channels consistently?",
    cause:
      "Consistent, high-quality content requires a documented strategy, a repeatable production workflow, and clear alignment between audience intent and business goals.",
    consequence:
      "Without that structure, content output becomes sporadic and fails to build the authority your brand needs to compete.",
  },
  {
    index: "05",
    question:
      "Do you lack clear visibility into your digital marketing efforts' return on investment (ROI)?",
    cause:
      "Clear ROI visibility in digital marketing comes from properly configured tracking, defined KPIs, and attribution models that connect campaigns directly to revenue outcomes.",
    consequence:
      "Without that data, budget decisions are guesswork, and underperforming channels continue to drain resources undetected.",
  },
] as const;

type PainPoint = (typeof PAIN_POINTS)[number];

/* ============================================================
   DIAGNOSTIC ENTRY — animation is driven centrally by the parent
   (one ScrollTrigger per entry, see the useGSAP effect below), so
   this component only renders markup and forwards the two refs it
   needs to be animated.
   ============================================================ */

function DiagnosticEntry({
  point,
  entryRef,
  numeralRef,
}: {
  point: PainPoint;
  entryRef: (el: HTMLElement | null) => void;
  numeralRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <article
      ref={entryRef}
      className="relative overflow-hidden border-t border-white/10 py-10 first:border-t-0 lg:py-14"
    >
      {/* Ghost ordinal — decorative, md+ only so it can never push the
          layout wide or overlap text on small screens. */}
      <div
        ref={numeralRef}
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden select-none font-mono text-[6rem] font-black leading-none text-[var(--color-accent)]/[0.14] md:-right-1 md:block lg:-right-2 lg:text-[8rem] xl:text-[9rem]"
      >
        {point.index}
      </div>

      <div className="relative z-10">
        {/* ID + status row */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-mono text-[9px] uppercase tracking-[0.15em] lg:mb-6">
          <span className="flex items-center gap-3">
            <span className="text-[var(--color-accent)]">
              <ScrambleReveal as="span" variant="micro">
                {`P${point.index}`}
              </ScrambleReveal>
            </span>
            <span className="hidden text-white/25 sm:inline">
              <ScrambleReveal as="span" variant="micro">
                {`§ 05.${point.index}`}
              </ScrambleReveal>
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 text-white/45">
            <StatusDot />
            <ScrambleReveal as="span" variant="micro">
              Issue Detected
            </ScrambleReveal>
          </span>
        </div>

        {/* Question — the hero of the entry. Sentence case, on
            purpose: every other string on the page is an uppercase
            system label; leaving the question itself un-uppercased is
            what makes it read as the one line addressed directly to
            the visitor. */}
        <h3 className="max-w-3xl">
          <ScrambleReveal
            as="span"
            variant="display"
            className="block text-2xl font-semibold leading-snug tracking-[-0.01em] text-white sm:text-[1.75rem] lg:text-[2.5rem]"
          >
            {point.question}
          </ScrambleReveal>
        </h3>

        {/* Cause / consequence — split from the supplied explanation
            at its existing sentence boundaries, not rewritten. */}
        <div className="mt-7 grid gap-6 lg:mt-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
              <ScrambleReveal as="span" variant="micro">
                Root Cause
              </ScrambleReveal>
            </div>
            <p className="text-sm leading-relaxed text-white/60 lg:text-[15px]">
              {point.cause}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
              <ScrambleReveal as="span" variant="micro">
                If Ignored
              </ScrambleReveal>
            </div>
            <p className="border-l-2 border-[var(--color-accent)]/40 pl-4 text-sm leading-relaxed text-white/60 lg:text-[15px]">
              {point.consequence}
            </p>
          </div>
        </div>

        {/* Resolvable — the section's one visual implication that the
            problem is solvable, without stating an unsupported claim.
            An accent-bordered pill: the one deliberate color pop per
            entry. */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/40 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-accent)]">
          <StatusDot />
          <ScrambleReveal as="span" variant="micro">
            Resolvable — Technico Protocol Available
          </ScrambleReveal>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   DIAGNOSTICS SECTION
   ============================================================ */

export default function Diagnostics() {
  const rootRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const railPulseRef = useRef<HTMLDivElement>(null);
  const railReadoutRef = useRef<HTMLDivElement>(null);

  const entryRefs = useRef<Array<HTMLElement | null>>([]);
  const numeralRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tickRefs = useRef<Array<HTMLSpanElement | null>>([]);

  /* ============================================================
     SCROLL REVEAL (chrome only — eyebrow / headline / CTA / footer)
     — identical mechanism to every other section. Entries are NOT
     included here; they get their own richer timeline below so the
     two effects never fight over the same element.
     ============================================================ */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const items = Array.from(
        root.querySelectorAll<HTMLElement>("[data-io-reveal]"),
      );
      if (!items.length) return;

      if (prefersReducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }

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

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => items.includes(st.trigger as HTMLElement))
          .forEach((st) => st.kill());
      };
    },
    { scope: rootRef },
  );

  /* ============================================================
     WATERMARK PARALLAX + ONE-SHOT SCAN SWEEP — same technique as
     Approach's "04" numeral, swapped to "05".
     ============================================================ */
  useGSAP(
    () => {
      const watermark = watermarkRef.current;
      if (!watermark || prefersReducedMotion) return;

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

      const scan = scanLineRef.current;
      if (!scan) return;

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
    },
    { scope: rootRef },
  );

  /* ============================================================
     TOP RULE — hairline accent line draws itself in, same
     technique as Approach.
     ============================================================ */
  useGSAP(
    () => {
      const line = topLineRef.current;
      if (!line) return;

      if (prefersReducedMotion) {
        gsap.set(line, { scaleX: 1 });
        return;
      }

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
    },
    { scope: rootRef },
  );

  /* ============================================================
     SCAN-RAIL SHIP — replaces the old solid growing beam (a bar that
     just scales up top-to-bottom — the generic scroll-progress line
     every other site does), and then its comet-glow replacement, with
     the same ship glyph ReactiveGrid's background grid already uses
     — reused directly rather than invented twice — rotated to travel
     down the rail, with a live "Scan NN%" mono readout riding
     alongside it.
     Sized purely by `absolute inset-y-0` against the plain
     relatively-positioned wrapper around the entry list, so it
     always matches the list's real content height — no dependency
     on CSS grid row-stretch matching an unrelated sibling.
     Position and readout are both driven off the same scrub
     ScrollTrigger's `progress`, straight from onUpdate — no
     independent rAF/timer running alongside scroll, same fix
     applied to ScrambleReveal, so the ship can't drift out of sync
     with the scrollbar the way ScrambleText's old timer-based
     scramble did.
     ============================================================ */
  useGSAP(
    () => {
      const pulse = railPulseRef.current;
      const readout = railReadoutRef.current;
      const wrapper = rootRef.current?.querySelector<HTMLElement>(
        "[data-entries-wrapper]",
      );
      if (!pulse || !wrapper) return;

      const setReadout = (progress: number) => {
        if (!readout) return;
        readout.textContent = `Scan ${Math.round(progress * 100)
          .toString()
          .padStart(2, "0")}%`;
      };

      if (prefersReducedMotion) {
        gsap.set(pulse, { top: "100%" });
        setReadout(1);
        return;
      }

      gsap.set(pulse, { top: "0%" });
      setReadout(0);

      gsap.to(pulse, {
        top: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 75%",
          end: "bottom 55%",
          scrub: 0.6,
          onUpdate: (self) => setReadout(self.progress),
          onRefresh: (self) => setReadout(self.progress),
        },
      });
    },
    { scope: rootRef },
  );

  /* ============================================================
     PER-ENTRY UNMASK — clip-path + scale reveal of the whole
     entry, the ghost ordinal fading in alongside it, and the
     matching rail tick lighting up in accent. One ScrollTrigger
     per entry (five total), same "loop over items" pattern
     Introduction/Approach already use elsewhere.
     ============================================================ */
  useGSAP(
    () => {
      const entries = entryRefs.current;
      if (!entries.length) return;

      const triggers: ScrollTrigger[] = [];

      entries.forEach((el, i) => {
        if (!el) return;
        const numeral = numeralRefs.current[i];
        const tick = tickRefs.current[i];

        if (prefersReducedMotion) {
          gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
          if (numeral) gsap.set(numeral, { opacity: 1 });
          if (tick) gsap.set(tick, { backgroundColor: "var(--color-accent)" });
          return;
        }

        gsap.set(el, {
          clipPath: "inset(28% 0% 28% 0%)",
          opacity: 0,
          scale: 0.98,
          transformOrigin: "center",
        });
        if (numeral) gsap.set(numeral, { opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
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

        if (numeral) {
          tl.to(
            numeral,
            { opacity: 1, duration: 0.8, ease: "power2.out" },
            0.15,
          );
        }

        if (tick) {
          tl.to(
            tick,
            {
              backgroundColor: "var(--color-accent)",
              scale: 1.5,
              duration: 0.35,
              ease: "power2.out",
            },
            0.1,
          ).to(tick, { scale: 1, duration: 0.3, ease: "power2.out" }, ">");
        }
      });

      return () => {
        triggers.forEach((st) => st.kill());
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-black py-24 text-white md:py-32 lg:py-40"
    >
      {/* ======================================================
          AMBIENT BACKGROUND — live ReactiveGrid (was a static
          texture) + cropped "05" folio numeral, same device as
          Approach's "04"
          ====================================================== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ReactiveGrid className="z-0 text-white" opacity={0.1} shipCount={1} />

        <div
          aria-hidden="true"
          ref={watermarkRef}
          className="absolute -right-[6vw] top-[4%] select-none text-[38vw] font-black leading-none tracking-[-0.05em] text-white/[0.04] md:top-[6%] md:text-[30vw]"
        >
          05
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
          className="absolute bottom-8 left-6 hidden select-none font-mono text-[8px] uppercase tracking-[0.15em] text-white/15 md:block lg:left-10"
        >
          Grid 05 / A—B
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-10 lg:px-12 xl:px-14">
        {/* ==================================================
            TOP META
            ================================================== */}
        <div className="border-t border-white/15 pt-4">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-white/50 lg:text-[10px]">
            <Blink as="span" className="text-[#6D28D9]">
              <ScrambleReveal as="span" variant="micro" start="top 95%">
                System Diagnostics
              </ScrambleReveal>
            </Blink>
            <span className="hidden items-center gap-1.5 text-white/35 md:inline-flex">
              <StatusDot />
              <ScrambleReveal as="span" variant="micro" start="top 95%">
                Scan In Progress
              </ScrambleReveal>
            </span>
            <ScrambleReveal as="span" variant="micro" start="top 95%">
              05 / Diagnostics
            </ScrambleReveal>
          </div>

          <div
            ref={topLineRef}
            aria-hidden="true"
            className="mt-4 h-px w-full bg-[var(--color-accent)]/40"
          />
        </div>

        {/* ==================================================
            SECTION STATEMENT
            ================================================== */}
        <div className="relative mt-14 lg:mt-20">
          {/* Orbit dial — same motif as Hero's "02 / System" readout
              and Introduction's sticky abstract visual, reused here
              and made pointer-interactive (see OrbitDial.tsx): the
              dial tilts toward the cursor and a target-lock marker
              tracks its live bearing. xl+ only — at lg the headline
              alone already fills most of the available width, so
              there's no room to give this presence without crowding
              it. pointer-events-auto (unlike the ambient background
              layer below, which stays click-through) so it can
              actually receive the pointer move/leave it reacts to. */}
          <div
            data-io-reveal
            className="pointer-events-auto absolute -top-8 right-0 hidden h-[220px] w-[220px] xl:block 2xl:h-[260px] 2xl:w-[260px]"
          >
            <OrbitDial ringClassName="text-white/20" />
          </div>

          <div
            data-io-reveal
            className="mb-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 lg:mb-7"
          >
            <span className="h-px w-8 bg-[var(--color-accent)]" />
            <ScrambleReveal as="span" variant="micro">
              Marketing Pain Points
            </ScrambleReveal>
          </div>

          <h2
            data-io-reveal
            className="max-w-[880px] font-semibold uppercase tracking-[-0.03em] lg:tracking-[-0.04em]"
          >
            <ScrollRevealWords
              as="span"
              className="block text-[2.15rem] leading-[1.06] sm:text-[2.75rem] lg:text-[3.75rem] lg:leading-[1.01] xl:text-[4.15rem]"
              start="top 85%"
              end="top 40%"
            >
              Drive Traffic, Engagement, & Conversions: We Have Tailored
              Solutions for Every Marketing Pain Point
            </ScrollRevealWords>
          </h2>

          <div
            data-io-reveal
            className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/30 lg:mt-8"
          >
            <Blink as="span">
              <StatusDot />
            </Blink>
            <ScrambleReveal as="span" variant="micro">
              Scanning Active Signals — 5 Records Found
            </ScrambleReveal>
          </div>
        </div>

        {/* ==================================================
            DIAGNOSTIC ENTRIES + SCAN RAIL
            ================================================== */}
        <div
          data-entries-wrapper
          className="relative mt-16 lg:mt-20 lg:pl-24 xl:pl-32"
        >
          {/* Scan rail — decorative, non-interactive, lg+ only.
              Sized by `inset-y-0` against this wrapper's own content
              height, not a CSS-grid sibling assumption.

              The base line is now a segmented/dashed rail — a "data
              feed" look — rather than a plain solid hairline. What
              travels down it is the same ship glyph ReactiveGrid uses
              for the chevrons riding its grid lines (see
              components/effects/ReactiveGrid.tsx) — rotated to point
              down the rail — rather than a generic glowing bar/comet,
              so the "something is actively scanning" read ties back
              to a motif already established by the background grid
              instead of inventing a new one. A live "Scan NN%"
              readout rides alongside it, xl+ only where there's room. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-8 hidden w-3 lg:block"
          >
            <div
              className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(255,255,255,0.16) 0px, rgba(255,255,255,0.16) 3px, transparent 3px, transparent 9px)",
              }}
            />

            <div
              ref={railPulseRef}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ top: "0%" }}
            >
              {/* Same two shapes as ReactiveGrid's ship — a small
                  thruster-glow circle trailing a chevron — just
                  reused directly rather than re-invented, then
                  rotated 90° so the tip (drawn pointing +x in
                  ReactiveGrid's own local space) points down the
                  rail instead of along a grid line. */}
              <svg
                width="20"
                height="20"
                viewBox="-10 -10 20 20"
                className="overflow-visible"
                style={{ filter: "drop-shadow(0 0 4px var(--color-accent))" }}
              >
                <g transform="rotate(90)" fill="var(--color-accent)">
                  <circle cx="-6" cy="0" r="3" opacity="0.35" />
                  <path d="M -5 -4.5 L 5 0 L -5 4.5 Z" />
                </g>
              </svg>

              {/* Nested inside the same wrapper as the ship (not a
                  sibling) so it rides the exact same `top` tween
                  automatically — no second property to keep in sync
                  by hand. */}
              <div
                ref={railReadoutRef}
                className="absolute left-full top-1/2 ml-3 hidden -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-accent)]/80 xl:block"
              >
                Scan 00%
              </div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-between py-1">
              {PAIN_POINTS.map((_, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    tickRefs.current[i] = el;
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-white/20"
                />
              ))}
            </div>
          </div>

          <div>
            {PAIN_POINTS.map((point, i) => (
              <DiagnosticEntry
                key={point.index}
                point={point}
                entryRef={(el) => {
                  entryRefs.current[i] = el;
                }}
                numeralRef={(el) => {
                  numeralRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>

        {/* ==================================================
            CTA — a tactile stat readout + the CTA line, closing on
            a single pointer-reactive TiltCard rather than a plain
            band or a caption underneath a button.
            ================================================== */}
        <div
          data-io-reveal
          className="mt-16 border-t border-white/15 pt-14 md:mt-20 md:pt-16 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-x-10"
        >
          <div className="lg:col-span-4">
            <TiltCard className="h-full border border-white/10 bg-white/[0.02]">
              <div
                className="flex h-full flex-col justify-between p-8 md:p-10"
                style={{ minHeight: 180 }}
              >
                <ScrambleReveal
                  as="span"
                  variant="micro"
                  className="font-mono text-5xl font-bold uppercase leading-none tracking-[-0.03em] text-white md:text-6xl"
                >
                  05/05
                </ScrambleReveal>
                <span className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                  <ScrambleReveal as="span" variant="micro">
                    Issues Identified
                  </ScrambleReveal>
                </span>
              </div>
            </TiltCard>
          </div>

          <div className="mt-8 lg:col-span-8 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:pl-10">
            <div className="mb-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40">
              <StatusDot />
              <ScrambleReveal as="span" variant="micro">
                Diagnosis Complete
              </ScrambleReveal>
            </div>

            <p className="text-xl leading-snug text-white sm:text-2xl lg:text-[1.75rem]">
              If you find yourself saying yes to these questions, it’s time to
              take action to transform your digital marketing strategy and drive
              impactful results for your business. Schedule a strategy call with
              Technico Digital Solutions today.
            </p>

            <div className="mt-8">
              <Button
                to="/contact"
                variant="primary"
                size="lg"
                icon
                className="w-full text-center whitespace-normal sm:w-auto sm:whitespace-nowrap"
              >
                Schedule Your Strategy Call
              </Button>
            </div>
          </div>
        </div>

        {/* ==================================================
            FOOTER META
            ================================================== */}
        <div
          data-io-reveal
          className="mt-10 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-white/30 lg:mt-14 lg:text-[9px]"
        >
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
              05.001
            </ScrambleReveal>
          </Blink>
        </div>
      </div>
    </section>
  );
}
