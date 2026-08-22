// Ignition.tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

import Button from "../../components/ui/Button";
import TiltCard from "../../components/ui/TiltCard";
import OrbitDial from "../../components/effects/Orbitdial";
import ReactiveGrid from "../../components/effects/ReactiveGrid";
import ScrambleText from "../../components/motion/ScrambleText";
import ScrambleReveal from "../../components/motion/Scramblereveal";
import ScrollRevealWords from "../../components/motion/ScrollRevealWords";
import { Blink, StatusDot } from "../../components/motion/Blink";

/**
 * "10 / Ignition" — the closing section on the Home page, rendered
 * after Feedback and directly before <Footer>. Where Diagnostics (05)
 * runs the same four-rhetorical-question shape as a *pain-point*
 * record, this section runs the same device in reverse: four
 * capability signals the visitor can recognize themselves in, each
 * paired with the concrete lever that resolves it, closing on one
 * full-bleed final call to action rather than trailing off into the
 * footer with nothing said.
 *
 * White ground (bg-white/text-black), not black — Feedback (09), the
 * section directly above this one, already closes on black, so this
 * section flips light for the same reason Approach/Services/Process
 * alternate against their black neighbors: two black sections back
 * to back would read as one long section rather than two. The four
 * signal cards stay dark panels (`bg-[#111111]`) *inside* that white
 * ground rather than flipping light too — the same "embedded display
 * on a light frame" contrast Approach's QuoteMiniScreen already
 * establishes — and the closing CTA band stays a full-bleed dark
 * band, the identical device Approach/Process already close their
 * own white sections on.
 *
 * Deliberately invents no new motion primitive — same restraint the
 * rest of the site holds itself to:
 *
 *   - Top/footer meta bars, eyebrow dash+label, numbered chapter tag,
 *     hairline accent rule that draws itself in: identical chrome to
 *     every other numbered section (Approach, Diagnostics, Partners,
 *     Process, Feedback).
 *   - `[data-io-reveal]` fade/slide-in: same mechanism/easing/trigger
 *     as Approach/Diagnostics/Partners/Process.
 *   - Headline: <ScrambleText variant="display">, two lines, second
 *     line carrying the accent color — same treatment used by every
 *     other section's h2.
 *   - The four signal cards: <TiltCard>, the same pointer-reactive
 *     tilt+glare already used elsewhere, not a bespoke card effect —
 *     this is the one place on the page where all four are visible
 *     and interactive at once, which is intentional: the last thing
 *     a scrolling visitor's cursor touches before the footer should
 *     feel alive, not static.
 *   - Mid-page breakout line: <ScrollRevealWords>, identical to every
 *     other section's lead/breakout sentence.
 *   - Closing CTA band: full-bleed dark band, same device Approach
 *     already closes on, just given the last word on the page — a
 *     bigger moment (more vertical room, <OrbitDial> reused from
 *     Hero/Diagnostics as a decorative "system ready" companion to
 *     the button, xl+ only) rather than a new device.
 *   - Watermark "10" folio numeral + coordinate tag: same parallax
 *     technique as every prior section's own folio number.
 *
 * Everything respects prefers-reduced-motion identically to its
 * siblings — resolved end-states are set directly, no scroll-linked
 * motion at all when the OS setting is on.
 */

type Signal = {
  index: string;
  label: string;
  question: string;
  answer: string;
};

const SIGNALS: readonly Signal[] = [
  {
    index: "01",
    label: "Growth",
    question:
      "Are you a business seeking rapid, consistent, and repeatable profit growth?",
    answer:
      "Search engine optimization and targeted digital marketing are proven drivers of scalable revenue. Now, it's easier to convert visibility into measurable results.",
  },
  {
    index: "02",
    label: "Market Position",
    question:
      "Do you aim to dominate your local market, compete with larger corporations, or establish a national or international brand presence?",
    answer:
      "Local SEO, authority-building content, and multi-channel campaigns are what close the gap between small businesses and industry leaders, regardless of budget.",
  },
  {
    index: "03",
    label: "Acquisition",
    question:
      "Do you want to expand your customer base and attract new clients?",
    answer:
      "The most effective way to do that today is through search-optimized content, paid ads, and conversion-focused landing pages that work around the clock.",
  },
  {
    index: "04",
    label: "Retention",
    question:
      "Are you looking to establish a reliable and sustainable business generation funnel to ensure continuous growth and success?",
    answer:
      "A well-structured digital marketing funnel that combines SEO, lead nurturing, and retargeting turns one-time visitors into long-term clients.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Signal card                                                                */
/* -------------------------------------------------------------------------- */

function SignalCard({ item }: { item: Signal }) {
  return (
    <div data-io-reveal className="h-full">
      <TiltCard className="h-full rounded-[2px] border border-white/15 bg-[#111111] p-6 sm:p-7 lg:p-8">
        {/* Ghost ordinal — same restrained "premium editorial" device
            Diagnostics uses behind each entry, tuned down to sit
            behind this card's own content instead of a full-width
            block. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -top-4 select-none text-[5.5rem] font-black leading-none text-[var(--color-accent)]/[0.09] sm:text-[6.5rem]"
        >
          {item.index}
        </span>

        <div className="relative flex h-full flex-col">
          <div className="mb-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 sm:mb-5">
            <StatusDot />
            <ScrambleText as="span" variant="micro">
              {item.label}
            </ScrambleText>
            <span className="ml-auto text-white/20">{item.index}</span>
          </div>

          <p className="text-lg font-semibold leading-snug text-white [text-wrap:pretty] sm:text-xl">
            {item.question}
          </p>

          <p className="mt-4 flex-1 text-sm leading-relaxed text-white/55 sm:text-[15px]">
            {item.answer}
          </p>
        </div>
      </TiltCard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ignition                                                                   */
/* -------------------------------------------------------------------------- */

export default function Ignition() {
  const rootRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const bandLineRef = useRef<HTMLDivElement>(null);

  /* ============================================================
     SCROLL REVEAL — identical to Approach/Diagnostics/Partners/
     Process's [data-io-reveal].
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

      gsap.set(items, { autoAlpha: 0, y: 32 });

      items.forEach((el) => {
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: rootRef },
  );

  /* ============================================================
     WATERMARK PARALLAX — same fromTo/scrub pattern as every prior
     section's own folio numeral.
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
    },
    { scope: rootRef },
  );

  /* ============================================================
     RULES — top meta hairline and CTA band hairline both draw
     themselves in (scaleX 0→1), same power3.out one-shot as every
     other section's top rule.
     ============================================================ */
  useGSAP(
    () => {
      const lines = [topLineRef.current, bandLineRef.current].filter(
        (el): el is HTMLDivElement => Boolean(el),
      );
      if (!lines.length) return;

      if (prefersReducedMotion) {
        gsap.set(lines, { scaleX: 1 });
        return;
      }

      gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });

      lines.forEach((line) => {
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
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-white py-16 text-black sm:py-24 md:py-32 lg:py-40"
    >
      {/* ======================================================
          AMBIENT BACKGROUND
          ====================================================== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ReactiveGrid className="z-0 text-black" opacity={0.12} shipCount={1} />

        <div
          aria-hidden="true"
          ref={watermarkRef}
          className="absolute -right-[6vw] top-[4%] select-none text-[38vw] font-black leading-none tracking-[-0.05em] text-black/[0.045] md:top-[6%] md:text-[30vw]"
        >
          10
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-8 left-6 hidden select-none font-mono text-[8px] uppercase tracking-[0.15em] text-black/15 md:block lg:left-10"
        >
          Grid 10 / A—B
        </div>
      </div>

      <div className="relative z-10 px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
        {/* ==================================================
            TOP META
            ================================================== */}
        <div className="border-t border-black/15 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-y-2 font-mono text-[9px] uppercase tracking-[0.15em] text-black/50 lg:text-[10px]">
            <Blink as="span" className="text-[#6D28D9]">
              <ScrambleText as="span" variant="micro">
                Outshine The Competition
              </ScrambleText>
            </Blink>

            <span className="hidden items-center gap-1.5 text-black/35 md:inline-flex">
              <StatusDot />
              <ScrambleText as="span" variant="micro">
                System Nominal
              </ScrambleText>
            </span>

            <ScrambleText as="span" variant="micro">
              10 / Ignition
            </ScrambleText>
          </div>

          <div
            ref={topLineRef}
            aria-hidden="true"
            className="mt-4 h-px w-full bg-[var(--color-accent)]/40"
          />
        </div>

        {/* ==================================================
            HEADER
            ================================================== */}
        <div className="mt-14 lg:mt-20">
          <div
            data-io-reveal
            className="mb-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-black/40 lg:mb-8"
          >
            <span className="h-px w-8 bg-[var(--color-accent)]" />
            <ScrambleReveal as="span" variant="micro">
              Search Visibility
            </ScrambleReveal>
          </div>

          <h2 className="max-w-5xl uppercase tracking-[-0.03em] [text-wrap:balance] lg:tracking-[-0.05em]">
            <ScrambleText
              as="span"
              variant="display"
              className="block text-[2rem] font-semibold leading-[1.04] sm:text-[2.5rem] sm:leading-[1] lg:text-[4.25rem] lg:leading-[0.98] xl:text-[4.75rem]"
            >
              Outshine Your Competition
            </ScrambleText>
            <ScrambleText
              as="span"
              variant="display"
              className="block text-[2rem] font-semibold leading-[1.04] text-[var(--color-accent)] sm:text-[2.5rem] sm:leading-[1] lg:text-[4.25rem] lg:leading-[0.98] xl:text-[4.75rem]"
            >
              Secure Top Rankings on SERPs
            </ScrambleText>
          </h2>

          <ScrollRevealWords
            as="p"
            className="mt-8 max-w-3xl text-lg font-medium leading-snug text-black/70 [text-wrap:pretty] sm:mt-10 sm:text-xl lg:mt-12 lg:text-[1.65rem]"
            start="top 85%"
            end="top 45%"
          >
            No More Searching for "Digital Marketing Near Me" — let's discuss
            your project right away.
          </ScrollRevealWords>
        </div>

        {/* ==================================================
            SIGNAL GRID — four capability checks, each paired
            with the lever that resolves it
            ================================================== */}
        <div className="relative mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5 lg:mt-20 lg:gap-6">
          {SIGNALS.map((item) => (
            <SignalCard key={item.index} item={item} />
          ))}
        </div>

        {/* ==================================================
            BREAKOUT LINE
            ================================================== */}
        <div className="mt-14 lg:mt-20">
          <div
            data-io-reveal
            className="mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.15em] text-black/30 lg:mb-6"
          >
            <span className="h-px w-10 bg-black/15" />
            <Blink as="span">
              <ScrambleReveal as="span" variant="micro">
                Transmission 10.01
              </ScrambleReveal>
            </Blink>
          </div>

          <ScrollRevealWords
            as="p"
            className="max-w-4xl text-2xl font-medium leading-snug text-black sm:text-3xl lg:text-[2.5rem]"
            start="top 85%"
            end="top 45%"
          >
            If any of these questions resonate with your business goals, book a
            strategy call to explore digital marketing solutions built around
            your needs, budget, and aspirations.
          </ScrollRevealWords>
        </div>
      </div>

      {/* ======================================================
          FINAL CTA — full-bleed, the last thing said before the
          footer. Same device Approach closes on, given more room
          and its own orbit dial companion since it carries the
          whole page's last word.
          ====================================================== */}
      <div className="relative z-10 mt-20 border-t border-white/10 bg-[#0a0712] py-16 md:mt-28 md:py-24">
        <div
          ref={bandLineRef}
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-[var(--color-accent)]/50"
        />

        {/* Orbit dial — decorative "system ready" companion to the
            final CTA, reused from Hero/Diagnostics. xl+ only, same
            reasoning as Diagnostics: below that the copy and button
            already fill the available width. pointer-events-auto so
            it can receive the pointer move/leave it reacts to. */}
        <div
          data-io-reveal
          className="pointer-events-auto absolute -right-6 top-1/2 hidden h-[240px] w-[240px] -translate-y-1/2 xl:block 2xl:h-[280px] 2xl:w-[280px]"
        >
          <OrbitDial ringClassName="text-white/15" />
        </div>

        <div className="relative px-5 sm:px-6 md:px-10 lg:px-12 xl:max-w-3xl xl:px-14">
          <div
            data-io-reveal
            className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/30"
          >
            <StatusDot />
            <ScrambleReveal as="span" variant="micro">
              Availability — Open
            </ScrambleReveal>
          </div>

          <p
            data-io-reveal
            className="mt-5 max-w-2xl text-xl font-medium leading-relaxed text-white/70 [text-wrap:pretty] sm:text-2xl lg:text-[1.75rem]"
          >
            We've worked across e-commerce stores, local service providers, and
            service-sector entrepreneurs — marketers who navigate Google's
            algorithms and the psychology of impactful advertising to drive
            results for businesses like yours.
          </p>

          <div data-io-reveal className="mt-9 sm:mt-10">
            <Button
              to="/contact"
              variant="primary"
              size="lg"
              icon
              className="w-full text-center whitespace-normal sm:w-auto lg:whitespace-nowrap"
            >
              Secure Your Free Strategy Consultation Today
            </Button>
          </div>
        </div>
      </div>

      {/* ======================================================
          FOOTER META
          ====================================================== */}
      <div
        data-io-reveal
        className="relative z-10 mt-10 px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14"
      >
        <div className="flex flex-wrap items-center justify-between gap-y-2 border-t border-black/10 pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-black/30 lg:text-[9px]">
          <ScrambleReveal as="span" variant="micro">
            Technico Digital Solutions
          </ScrambleReveal>

          <span className="hidden items-center gap-1.5 md:inline-flex">
            <StatusDot />
            <ScrambleReveal as="span" variant="micro">
              System Nominal
            </ScrambleReveal>
          </span>

          <Blink as="span">
            <ScrambleReveal as="span" variant="micro">
              10.001
            </ScrambleReveal>
          </Blink>
        </div>
      </div>
    </section>
  );
}
