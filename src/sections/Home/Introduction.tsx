import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";

import {
  useVisitorLocation,
  toDegreesMinutes,
  continentName,
} from "../../hooks/useVisitorLocation";

import ReactiveGrid from "../../components/effects/ReactiveGrid";
import Button from "../../components/ui/Button";
import ScrambleText from "../../components/motion/ScrambleText";
import ScrollRevealWords from "../../components/motion/ScrollRevealWords";
import { Blink, StatusDot } from "../../components/motion/Blink";

/**
 * Editorial / technical-archive direction, replacing the previous
 * click-to-expand capability accordion.
 *
 * Structure is plain normal document flow — no pin, no scrub, no
 * inner scroller. Everything reveals with a single restrained
 * mechanism: each `[data-io-reveal]` block fades/slides in once it
 * crosses into view (see the useGSAP effect below), so the numbered
 * entries read as one continuous document being progressively
 * uncovered rather than a set of separate animated cards.
 *
 * SCROLL REVEAL TIMING: duration 1.15s, 40px of travel, power3.out
 * easing — soft deceleration into rest rather than a snap. Trigger
 * point sits earlier (top 92%) so the longer animation has room to
 * resolve as the element crosses into view.
 *
 * FIX: querySelectorAll returns a NodeList, which has no .includes()
 * — the cleanup filters ScrollTrigger.getAll() against `items`, so
 * `items` is wrapped in Array.from(...) to make it a real array.
 *
 * TEXT LIFE: metadata/labels use <ScrambleText variant="micro">;
 * entry titles use variant="display". ScrambleText itself runs a
 * slow, eased resolve and caps how many instances can animate at
 * once page-wide (see ScrambleText.tsx) so scrolling quickly through
 * a text-dense section like this one can't spike main-thread load
 * and stutter unrelated animations (e.g. Header's sticky pill morph).
 *
 * The main headline is the one exception: it uses <ScrollRevealWords>
 * (word-by-word scroll-scrubbed opacity/blur) instead of ScrambleText,
 * so it isn't subject to that same concurrency cap.
 */

const ENTRIES = [
  {
    index: "001",
    title: "Data-Driven Growth",
    body: "We unlock your brand's potential with data-driven strategies focused on increasing your revenues and positioning your brand as a leader in the market.",
  },
  {
    index: "002",
    title: "Tracked Execution",
    body: "We establish a realistic timeline for implementing strategies and setting milestones to track progress — so you always know how we'll elevate your revenue and expand your reach.",
  },
] as const;

/* ============================================================
   ABSTRACT VISUAL — reuses the orbit motif, recentered to sit
   inside the sticky right-hand panel instead of being absolutely
   positioned against Hero's System section.
   ============================================================ */

function AbstractVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative h-[280px] w-[280px] lg:h-[360px] lg:w-[360px] xl:h-[420px] xl:w-[420px]"
    >
      <div className="absolute inset-0 rounded-full border border-dashed border-white/15" />
      <div className="absolute inset-10 rounded-full border border-dashed border-white/10" />

      <div className="absolute inset-0 animate-[spin_50s_linear_infinite]">
        <span
          className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
          style={{ background: "var(--color-accent)" }}
        />
      </div>

      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40" />

      <svg
        viewBox="0 0 500 500"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <circle
          cx="250"
          cy="250"
          r="205"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 8"
          className="text-white/20"
        />
        <ellipse
          cx="250"
          cy="250"
          rx="205"
          ry="80"
          transform="rotate(-25 250 250)"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 9"
          className="text-white/15"
        />
        <line
          x1="250"
          y1="25"
          x2="250"
          y2="475"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 9"
          className="text-white/10"
        />
        <line
          x1="25"
          y1="250"
          x2="475"
          y2="250"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 9"
          className="text-white/10"
        />
        <circle
          cx="250"
          cy="250"
          r="18"
          stroke="currentColor"
          strokeWidth="1"
          className="text-white/40"
        />
      </svg>
    </div>
  );
}

/* ============================================================
   NUMBERED ENTRY
   ============================================================ */

function Entry({
  index,
  title,
  body,
}: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <div data-io-reveal className="border-t border-white/10 py-6 lg:py-8">
      <div className="mb-3 flex items-baseline gap-4 lg:mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)] lg:text-[11px]">
          <ScrambleText as="span" variant="micro">
            {index}
          </ScrambleText>
        </span>
        <h3 className="text-lg font-semibold uppercase leading-tight tracking-[-0.02em] text-white lg:text-2xl">
          <ScrambleText as="span" variant="display">
            {title}
          </ScrambleText>
        </h3>
      </div>

      <p className="max-w-xl pl-[3.1rem] text-sm leading-relaxed text-white/55 lg:pl-[3.6rem] lg:text-[15px]">
        {body}
      </p>
    </div>
  );
}

/* ============================================================
   INTRODUCTION
   ============================================================ */

export default function Introduction() {
  const rootRef = useRef<HTMLDivElement>(null);

  const { location, isFallback } = useVisitorLocation();

  /* ============================================================
     SCROLL REVEAL
     ============================================================ */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // Array.from(...) — NOT a raw NodeList — so the cleanup filter
      // below (`items.includes(...)`) has a real array method to call.
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

  return (
    <section
      ref={rootRef}
      className="relative bg-black py-20 text-white md:py-28 lg:py-32"
    >
      {/* ======================================================
          AMBIENT BACKGROUND
          ====================================================== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ReactiveGrid
          className="text-white"
          opacity={0.12}
          shipCount={1}
          scrollReactive
        />

        <div
          aria-hidden="true"
          className="absolute bottom-[-3vw] left-[-2vw] select-none whitespace-nowrap text-[22vw] font-bold uppercase leading-none tracking-[-0.08em] text-white/[0.025]"
        >
          INTRO
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-10 lg:px-12 xl:px-14">
        {/* ==================================================
            TOP META
            ================================================== */}
        <div className="flex items-center justify-between border-t border-white/15 pt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-white/50 lg:text-[10px]">
          <Blink as="span" className="text-[#6D28D9]">
            <ScrambleText as="span" variant="micro" start="top 95%">
              What We Do
            </ScrambleText>
          </Blink>
          <ScrambleText as="span" variant="micro" start="top 95%">
            01 / Introduction
          </ScrambleText>
        </div>

        {/* ==================================================
            TWO-COLUMN LAYOUT
            ================================================== */}
        <div className="mt-10 grid grid-cols-1 gap-y-10 lg:mt-16 lg:grid-cols-12 lg:gap-x-14">
          {/* ================================================
              LEFT — EDITORIAL CONTENT
              ================================================ */}
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <div
              data-io-reveal
              className="mb-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 lg:mb-7"
            >
              <span className="h-px w-8 bg-[var(--color-accent)]" />
              <ScrambleText as="span" variant="micro">
                Growth Infrastructure
              </ScrambleText>
            </div>

            {/* Headline — word-by-word scroll reveal (same mechanism as
                Hero's "Objective" readout), swapped in for the letter-
                scramble that used to live here. The block still gets its
                fade/slide entrance from `data-io-reveal` on the <h2>; this
                only changes how the words themselves resolve as the user
                continues scrolling past that point. */}
            <h2
              data-io-reveal
              className="max-w-[760px] font-semibold uppercase tracking-[-0.03em] lg:tracking-[-0.045em]"
            >
              <ScrollRevealWords
                as="span"
                className="block text-[2rem] leading-[1.05] sm:text-[2.5rem] lg:text-[3.75rem] lg:leading-[0.98] xl:text-[4.25rem]"
                start="top 85%"
                end="top 40%"
              >
                Boost revenues, maximize profits, generate qualified leads, and
                enhance brand visibility.
              </ScrollRevealWords>
            </h2>

            {/* Numbered content system */}
            <div className="mt-10 border-b border-white/10 lg:mt-16">
              {ENTRIES.map((entry) => (
                <Entry key={entry.index} {...entry} />
              ))}
            </div>

            {/* CTA */}
            <div data-io-reveal className="mt-10 lg:mt-12">
              <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.15em] text-white/30">
                <ScrambleText as="span" variant="micro">
                  Start a conversation
                </ScrambleText>
              </div>

              <div className="flex flex-col flex-wrap items-stretch gap-3 min-[420px]:flex-row min-[420px]:items-center lg:gap-4">
                <Button
                  to="/contact"
                  variant="primary"
                  size="md"
                  icon
                  className="w-full text-center whitespace-normal min-[420px]:w-auto lg:shrink-0 lg:whitespace-nowrap"
                >
                  Book A Call Now
                </Button>

                <Button
                  to="/contact"
                  variant="ghost"
                  size="md"
                  icon
                  className="w-full text-center whitespace-normal min-[420px]:w-auto lg:shrink-0 lg:whitespace-nowrap"
                >
                  Free Strategy Consultation
                </Button>
              </div>
            </div>

            {/* Footer meta */}
            <div
              data-io-reveal
              className="mt-10 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-white/30 lg:mt-14 lg:text-[9px]"
            >
              <ScrambleText as="span" variant="micro">
                Technico Digital Solutions Inc
              </ScrambleText>
              <Blink as="span">
                <ScrambleText as="span" variant="micro">
                  01.001
                </ScrambleText>
              </Blink>
            </div>
          </div>

          {/* ================================================
              RIGHT — STICKY ABSTRACT VISUAL
              ================================================ */}
          <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
            <div className="sticky top-24 flex flex-col items-center">
              <div className="relative flex h-[70vh] max-h-[560px] w-full items-center justify-center border border-white/10">
                <AbstractVisual />
              </div>

              <div className="mt-6 w-full border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">
                <ScrambleText as="span" variant="micro">
                  Coordinates
                </ScrambleText>

                <p className="mt-2 text-white/60">
                  {toDegreesMinutes(location.latitude, "N", "S")} /{" "}
                  {toDegreesMinutes(location.longitude, "E", "W")}
                  <br />
                  {location.countryCode} /{" "}
                  {continentName(location.continentCode)}
                  <br />
                  {isFallback ? "DIGITAL SYSTEM" : "VISITOR LOCATED"}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
                  <span>Status</span>
                  <span className="inline-flex items-center gap-1.5">
                    <StatusDot />
                    Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
