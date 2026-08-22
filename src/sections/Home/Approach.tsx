import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";

import Button from "../../components/ui/Button";
import QuoteMiniScreen from "../../components/ui/QuoteScreen";
import ScrambleText from "../../components/motion/ScrambleText";
import ScrollRevealWords from "../../components/motion/ScrollRevealWords";
import { Blink, StatusDot } from "../../components/motion/Blink";
import ReactiveGrid from "../../components/effects/ReactiveGrid";

/**
 * "04 / Approach" — the section directly following Introduction on the
 * Home page. Full ground-up redesign of what was previously a single
 * centered reading column (headline → lead → body → pull-quote → body
 * → CTA, all stacked on one axis). This version keeps every word of
 * that content but restructures it into an asymmetric editorial
 * spread: two uneven columns that break their own grid (the pull-quote
 * overlaps the gutter, the lead sentence spans wider than either
 * column beneath them, body copy staggers left/right instead of
 * running down a single line), closing on a full-bleed black CTA band
 * that echoes Introduction's dark ground as a deliberate interruption
 * rather than a plain color flip.
 *
 * Nothing here invents a new motion primitive — same restraint as the
 * rest of the site:
 *
 *   - Top/footer meta bars, eyebrow dash+label, numbered chapter tag:
 *     same chrome as Introduction, recolored for a white ground.
 *   - `[data-io-reveal]` fade/slide-in: identical mechanism (same
 *     duration/easing/trigger) used everywhere else on the page.
 *   - Headline: <ScrambleText variant="display">, same treatment as
 *     Introduction's entry titles, split across two lines with the
 *     second line carrying the accent color as a quiet emphasis.
 *   - Lead sentence: <ScrollRevealWords>, same word-by-word
 *     scroll-scrubbed blur/opacity as Hero and Introduction.
 *   - Watermark parallax: same fromTo xPercent/opacity, scrub 1.3
 *     technique as Hero/Introduction's background wordmark — swapped
 *     from a word to an oversized cropped "04" folio numeral so it
 *     reads as this chapter's own device rather than a repeat.
 *   - Pull-quote: the reusable <QuoteMiniScreen> component (see
 *     components/ui/QuoteScreen) — a small computer-monitor display
 *     (light frame, title bar with a status light/label/minimal
 *     window controls, black display area) rather than a card, with
 *     its own clip-path screen-unmask + word-level text reveal.
 *     Deliberately has no TiltCard association at all: no pointer
 *     tilt, no hover rotation, no floating/rotating-card identity —
 *     it is static except for its one scroll-triggered reveal, and
 *     joins the section's ordinary [data-io-reveal] fade/slide-in
 *     rather than a bespoke tilt-lean entrance. It's offset into its
 *     own column (col-start-8, span 5) rather than mirroring the
 *     left column's width, so it reads as a narrower embedded display
 *     breaking the grid rather than a same-size card swapped into the
 *     same slot,
 *     with a small "Fig." caption underneath reinforcing that it's a
 *     referenced display module, not a floating card.
 *
 * Ambient background runs <ReactiveGrid> (opacity kept low, one ship,
 * no scroll-reactive scan band) instead of the static CSS grid this
 * used to fall back to — that earlier choice was to avoid a second
 * continuous-loop surface directly under Introduction's, but the grid
 * is part of this site's visual identity throughout, so every section
 * carries it now, just tuned lighter here than Hero/Introduction.
 *
 * SCI-FI DETAIL PASS — layered on top of the redesign above without
 * touching its layout/composition/interactions. Every addition reuses
 * an existing primitive (ScrambleText, Blink, StatusDot) so it reads
 * as the same system as Hero/Introduction rather than a new visual
 * language:
 *
 *   - Top/footer meta bars gain a third, hidden-below-md status item
 *     (StatusDot + "System Nominal"), matching Hero's 3-up meta rows.
 *   - A hairline accent rule draws itself in (scaleX, one-shot, same
 *     power3.out easing as the rest of the section's reveals) under
 *     the top meta bar — a "thin interface line" rather than a static
 *     divider.
 *   - Small `§ 04.0x` technical labels sit above each body paragraph
 *     and the lead sentence, echoing Introduction's numbered-entry
 *     system without disturbing the paragraphs' own reveal timing.
 *   - The pull-quote's frame, title bar, and display all live inside
 *     <QuoteMiniScreen> itself — a self-contained, static "small
 *     monitor" with no TiltCard, no translateZ tilt layering, and no
 *     hover interaction of its own. QuoteMiniScreen's reveal is a
 *     clip-path unmask of the display area plus a staggered
 *     word-level blur/opacity cascade of the (unchanged) quote text
 *     — deliberately no scan line, status-dot HUD, corner ticks, or
 *     cursor here; this section keeps that chrome to Hero/
 *     Introduction and lets the quote display carry its own,
 *     restrained "small monitor" identity instead.
 *   - The watermark numeral gets one faint, one-shot scan line as it
 *     enters view (not a continuous animation) and a tiny static
 *     "GRID" coordinate tag — decorative, low-opacity, non-interactive.
 *   - A hairline vertical rule marks the column gutter as a minimal
 *     grid reference; static (no motion) since a moving vertical line
 *     down the reading column would fight the eye more than help it.
 *
 * All of it inherits the section's existing reduced-motion handling —
 * nothing here adds a new continuous-loop animation.
 */

export default function Approach() {
  const rootRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  /* ============================================================
     SCROLL REVEAL — identical to Introduction.tsx's [data-io-reveal]
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
     WATERMARK PARALLAX — same fromTo/scrub pattern as Hero/
     Introduction, applied to the cropped "04" folio numeral instead
     of a wordmark.
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
     TOP RULE — hairline accent line draws itself in (scaleX 0→1)
     beneath the top meta bar. One-shot, same easing family as the
     section's other reveals, so it reads as part of the same system
     rather than a separate flourish.
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
     WATERMARK SCAN — a single faint line sweeps once down the "04"
     numeral as it enters view (not a continuous loop), reading as
     the interface "scanning" the folio number rather than a generic
     shimmer.
     ============================================================ */
  useGSAP(
    () => {
      const scan = scanLineRef.current;
      const watermark = watermarkRef.current;
      if (!scan || !watermark || prefersReducedMotion) return;

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
     Note: the pull-quote no longer gets a bespoke tilt/rotate
     entrance here — QuoteMiniScreen has no TiltCard association at
     all now, so its wrapper simply joins the section's ordinary
     [data-io-reveal] fade/slide-in below rather than a separate
     rotating-card effect.
     ============================================================ */

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-white py-24 text-black md:py-32 lg:py-40"
    >
      {/* ======================================================
          AMBIENT BACKGROUND — live ReactiveGrid (was a static
          texture) + cropped "04" folio numeral (large numerical
          element, bleeding off the edge rather than centered)
          ====================================================== */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ReactiveGrid className="z-0 text-black" opacity={0.12} shipCount={1} />

        <div
          aria-hidden="true"
          ref={watermarkRef}
          className="absolute -right-[6vw] top-[4%] select-none text-[38vw] font-black leading-none tracking-[-0.05em] text-black/[0.045] md:top-[6%] md:text-[30vw]"
        >
          04
          {/* One-shot scan sweep — see the useGSAP effect above. */}
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

        {/* Static coordinate tag — same restrained "system metadata"
            device as Hero/Introduction's location readouts, kept
            purely decorative and non-interactive here. */}
        <div
          aria-hidden="true"
          className="absolute bottom-8 left-6 hidden select-none font-mono text-[8px] uppercase tracking-[0.15em] text-black/15 md:block lg:left-10"
        >
          Grid 04 / A—B
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-10 lg:px-12 xl:px-14">
        {/* ==================================================
            TOP META
            ================================================== */}
        <div className="border-t border-black/15 pt-4">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-black/50 lg:text-[10px]">
            <Blink as="span" className="text-[#6D28D9]">
              <ScrambleText as="span" variant="micro" start="top 95%">
                Why Technico
              </ScrambleText>
            </Blink>
            <span className="hidden items-center gap-1.5 text-black/35 md:inline-flex">
              <StatusDot />
              <ScrambleText as="span" variant="micro" start="top 95%">
                System Nominal
              </ScrambleText>
            </span>
            <ScrambleText as="span" variant="micro" start="top 95%">
              04 / Approach
            </ScrambleText>
          </div>

          {/* Hairline accent rule — draws itself in, see useGSAP above. */}
          <div
            ref={topLineRef}
            aria-hidden="true"
            className="mt-4 h-px w-full bg-[var(--color-accent)]/40"
          />
        </div>

        {/* ==================================================
            ASYMMETRIC GRID — headline + body 1 on the left,
            the pull-quote floating and overlapping the gutter
            on the right, pushed down to break the row
            ================================================== */}
        <div className="mt-14 lg:relative lg:mt-20 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-10">
          {/* Gutter guideline — static, minimal grid reference marking
              the column split. No motion: a moving vertical rule
              through the reading column would distract rather than
              read as "technical." */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-black/10 to-transparent lg:block"
          />

          {/* Eyebrow + headline + body 1 */}
          <div className="lg:col-span-6">
            <div
              data-io-reveal
              className="mb-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-black/40 lg:mb-8"
            >
              <span className="flex items-center gap-2">
                <span className="h-px w-8 bg-[var(--color-accent)]" />
                <ScrambleText as="span" variant="micro">
                  Market Position
                </ScrambleText>
              </span>
              <ScrambleText as="span" variant="micro" className="text-black/25">
                Sec 04—A
              </ScrambleText>
            </div>

            <h2
              data-io-reveal
              className="uppercase tracking-[-0.03em] lg:tracking-[-0.05em]"
            >
              <ScrambleText
                as="span"
                variant="display"
                className="block text-[2.5rem] font-semibold leading-[0.98] sm:text-[3.25rem] lg:text-[4.25rem] xl:text-[4.75rem]"
              >
                Establish Your Brand
              </ScrambleText>
              <ScrambleText
                as="span"
                variant="display"
                className="block text-[2.5rem] font-semibold leading-[0.98] text-[var(--color-accent)] sm:text-[3.25rem] lg:text-[4.25rem] xl:text-[4.75rem]"
              >
                as a Market Leader
              </ScrambleText>
            </h2>

            <div
              data-io-reveal
              className="mt-10 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-black/30 lg:mt-14"
            >
              <StatusDot />
              <ScrambleText as="span" variant="micro">
                § 04.01 — Overview
              </ScrambleText>
            </div>

            <p
              data-io-reveal
              className="mt-3 max-w-md border-l-2 border-black/10 pl-5 text-base leading-relaxed text-black/60 lg:text-[17px]"
            >
              Our expertise lies in leveraging the latest technology to assist
              you in scaling your businesses, whether through generating more
              appointments or driving increased sales.
            </p>
          </div>

          {/* Pull-quote — now a narrower embedded display offset into
              its own column (skipping col 7, which the gutter
              guideline above already marks) rather than mirroring the
              left column's width. Reads as a referenced module
              breaking the grid, not a same-size card dropped into the
              same slot the headline column occupies. Joins the
              section's ordinary [data-io-reveal] fade/slide-in — no
              bespoke tilt/rotate entrance, since QuoteMiniScreen has
              no TiltCard association to keep separate from. */}
          <div className="mt-14 lg:col-span-5 lg:col-start-8 lg:mt-24">
            <div data-io-reveal>
              <QuoteMiniScreen
                quote="A powerful marketing strategy is not just about promotions; it’s about maximizing revenue opportunities through strategic outreach."
                label="Client Feedback"
              />

              {/* Figure caption — small technical index tying the
                  display back into the editorial layout, reinforcing
                  it as an embedded module rather than a floating
                  card. */}
              <div className="mt-3 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.15em] text-black/30">
                <span className="h-px w-6 bg-black/15" />
                <ScrambleText as="span" variant="micro">
                  Fig. 04.A — Client Statement
                </ScrambleText>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            LEAD — breaks out full width beneath the grid, wider
            than either column above it
            ================================================== */}
        <div className="mt-16 lg:mt-24">
          <div
            data-io-reveal
            className="mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.15em] text-black/30 lg:mb-6"
          >
            <span className="h-px w-10 bg-black/15" />
            <Blink as="span">
              <ScrambleText as="span" variant="micro">
                Transmission 04.02
              </ScrambleText>
            </Blink>
          </div>

          <ScrollRevealWords
            as="p"
            className="max-w-4xl text-2xl font-medium leading-snug text-black sm:text-3xl lg:text-[2.75rem]"
            start="top 85%"
            end="top 45%"
          >
            We Drive Your Brand Forward, Automate Strategies, and Boost Revenue
          </ScrollRevealWords>
        </div>

        {/* ==================================================
            BODY 2 — offset to the right, staggering the reading
            rhythm instead of continuing straight down one column
            ================================================== */}
        <div className="mt-10 lg:mt-14 lg:flex lg:justify-end">
          <div className="max-w-xl">
            <div
              data-io-reveal
              className="mb-3 flex items-center justify-end gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-black/30"
            >
              <ScrambleText as="span" variant="micro">
                § 04.03 — Execution
              </ScrambleText>
              <StatusDot />
            </div>

            <p
              data-io-reveal
              className="text-base leading-relaxed text-black/60 lg:text-[17px]"
            >
              Successful marketing strategies are the key drivers of revenue
              acceleration. A digital campaign gets you the recognition you
              deserve and brings you new, high-intent customers. Technico
              Digital Solutions supports businesses of all sizes to grow and
              succeed. Our business solutions provide a holistic, multi-faceted
              approach that supports your online presence, driving growth,
              market position, and revenues.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          CTA — full-bleed black band, a deliberate interruption
          of the white ground rather than a plain color flip
          ====================================================== */}
      <div
        data-io-reveal
        className="relative z-10 mt-20 bg-black py-14 text-white md:mt-28 md:py-20"
      >
        <div className="flex flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between md:px-10 lg:px-12 xl:px-14">
          <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/40">
            <ScrambleText as="span" variant="micro">
              Ready When You Are
            </ScrambleText>
            <div className="mt-2 flex items-center gap-1.5 text-white/25">
              <StatusDot />
              <ScrambleText as="span" variant="micro">
                Availability — Open
              </ScrambleText>
            </div>
          </div>

          <Button
            to="/contact"
            variant="primary"
            size="lg"
            icon
            className="w-full text-center whitespace-normal md:w-auto lg:shrink-0 lg:whitespace-nowrap"
          >
            Secure Your Free Strategy Consultation Today
          </Button>
        </div>
      </div>

      {/* ======================================================
          FOOTER META
          ====================================================== */}
      <div
        data-io-reveal
        className="relative z-10 mt-10 px-6 md:px-10 lg:px-12 xl:px-14"
      >
        <div className="flex items-center justify-between border-t border-black/10 pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-black/30 lg:text-[9px]">
          <ScrambleText as="span" variant="micro">
            Technico Digital Solutions
          </ScrambleText>
          <span className="hidden items-center gap-1.5 md:inline-flex">
            <StatusDot />
            <ScrambleText as="span" variant="micro">
              System Nominal
            </ScrambleText>
          </span>
          <Blink as="span">
            <ScrambleText as="span" variant="micro">
              04.001
            </ScrambleText>
          </Blink>
        </div>
      </div>
    </section>
  );
}
