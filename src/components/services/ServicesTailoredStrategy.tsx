"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Button from "@/components/ui/Button";
import TextRevealBlock from "@/components/motion/TextRevealBlock";
import RevealUp from "@/components/motion/RevealUp";
import { gsap, Flip, prefersReducedMotion } from "@/lib/gsap";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* Pinwheel mark — one real instance of this shared across all three
   gradient cards below (see the FLIP setup further down), instead of
   one per card. Same shape as the SEO service icon elsewhere on the
   site (four curved blades), recolored via `currentColor`. */
function PinwheelIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 0C0 6.35086 2.52216 12.4416 7.0131 16.9319C11.504 21.4229 17.5948 23.9457 23.9456 23.9457V0H0ZM23.9456 23.9457H47.8918V0C41.5409 0 35.4497 2.52278 30.9587 7.0131C26.4678 11.504 23.9456 17.5942 23.9456 23.9457ZM23.9456 23.9457V47.8911H47.8918C47.8918 41.5404 45.3696 35.4497 40.8786 30.9588C36.3877 26.4684 30.2963 23.9457 23.9456 23.9457ZM23.9456 23.9457H0V47.8911C6.35086 47.8911 12.4422 45.3684 16.9331 40.878C21.4241 36.3871 23.9456 30.2964 23.9456 23.9457Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Copy for each gradient card, plus which corner its pinwheel slot
   sits in and its gradient direction — driven off an array instead
   of three near-identical hand-written blocks below. */
const STRATEGY_CARDS: {
  text: string;
  iconAlign: "left" | "right";
  gradient: string;
}[] = [
  {
    text: "A Law Firm May Need Qualified Local Leads From High-Intent Searches, While A Solar Company May Need To Educate Homeowners Before Turning Interest Into Quote Requests.",
    iconAlign: "right",
    gradient: "from-[#4a1740] via-[#9c2f74] to-pink-accent",
  },
  {
    text: "Our Digital Team Works With Businesses Across Industries, Locations, And Stages Of Growth, Building Strategies That Focus On How Your Customers Search, Compare, And Take Action.",
    iconAlign: "left",
    gradient: "from-[#160830] via-[#3c1470] to-purple-accent",
  },
  {
    text: "The Goal Is To Turn Your Digital Presence Into More Local Leads, Ecommerce Sales, Appointment Bookings, And Opportunities To Grow Into New Markets.",
    iconAlign: "right",
    gradient: "from-[#4a1740] via-[#9c2f74] to-pink-accent",
  },
];

/* ================================================================
   SERVICES TAILORED STRATEGY
   ================================================================
   First piece of the services page's 4th section (see
   services_4th_section.png), broken out as its own component per
   your request to build this section piece by piece. Covers just
   the top of that mock: the white intro CTA banner ("Deliver the
   right message...") through the "built around your business"
   block, ending at "The goal is to turn your digital presence...".
   Everything below that (Industries We Know, the Canada map, the
   engagement/deliverables block, the closing CTA) is intentionally
   NOT here yet — separate components, next.

   The "built around your business" block is a sticky-sidebar
   layout: the heading + subtext sit in the left column and pin in
   place (`lg:sticky lg:top-28 lg:self-start`) while the three
   gradient cards in the right column scroll past underneath. Plain
   CSS position:sticky, same pattern already used for the image in
   HoverImageSwap.

   The cards themselves render plain/static (no mount or scroll
   entrance animation on the card boxes) — only the pinwheel icon
   inside them moves.

   ONE PINWHEEL, SCROLL-SCRUBBED FLIP
   -----------------------------------
   Only card 1 renders a real, visible pinwheel (`iconBoxRef`). Cards
   2 and 3 each render an invisible same-size placeholder
   (`markerRefs`) that exists purely to reserve a target rect for
   GSAP Flip to read — this is exactly GSAP's own "Even tie your FLIP
   animations to scroll" pattern (codepen: cards ↔ container/box/
   marker), translated into React refs instead of hardcoded class
   selectors:
     1. `Flip.getState(marker)` captures each marker's on-page
        position/size before anything moves.
     2. A single `gsap.timeline` — its `scrollTrigger` spanning from
        card 1's top to card 3's bottom, `scrub: 1` — calls
        `Flip.fit(iconBox, state)` for card 2's marker, then card
        3's marker, so the one real icon visually "flies" from slot
        to slot in lockstep with scroll position instead of on a
        fixed timer.
   `build()` re-reads every marker's rect and rebuilds the timeline
   from scratch on mount and on window resize (same as the codepen's
   own resize listener), since a breakpoint change moves every
   card/marker to a new spot. `iconBoxRef`'s parent stays a normal
   fixed-size flow element the whole time — only the icon itself
   gets positioned by Flip — so card 1's layout never jumps when the
   icon leaves for card 2.

   Z-INDEX FIX: Flip.fit moves the icon purely with a transform — it
   never changes where the element actually sits in the DOM, so the
   icon is still a child of card 1 and still paints in card 1's spot
   in the stacking order. Cards 2 and 3 come *after* card 1 in the
   DOM, so by default they paint on top of it, which hid the "flying"
   icon the instant it crossed into their space even though it was
   geometrically sitting right on top of their marker. Giving the
   icon's wrapper (and the markers, so layout matches) a `relative
   z-20` — higher than the cards' own implicit stacking order — keeps
   it visible above every card, not just its home card.
   Skipped entirely under prefersReducedMotion: the icon just stays
   put in card 1's slot, no scroll-tied motion.

   Reuses the same building blocks as ServicesMarketOverview rather
   than introducing new patterns:
   - TextRevealBlock for the intro banner heading (curtain-wipe
     reveal, scrollTrigger since it sits below the fold)
   - RevealUp for the "built around your business" heading (mount-
     time-agnostic; wraps naturally at any width, see comment below)
   - Button (not GlossyButton) for "Book a Call", matching the plain
     black pill in the mock rather than the purple glossy CTA used
     at the very bottom of the market-overview section
   ================================================================ */

export default function ServicesTailoredStrategy() {
  const cardsColumnRef = useRef<HTMLDivElement>(null);
  const iconBoxRef = useRef<HTMLDivElement>(null);
  const iconSpinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const iconBox = iconBoxRef.current;
      const iconSpin = iconSpinRef.current;
      const firstCard = cardRefs.current[0];
      const lastCard = cardRefs.current[STRATEGY_CARDS.length - 1];
      if (!iconBox || !firstCard || !lastCard) return;

      let tl: gsap.core.Timeline | undefined;
      let spinTween: gsap.core.Tween | undefined;

      // Rebuilds the Flip states + scrubbed timeline from the
      // markers' current on-page rects. Called once up front and
      // again on every resize, since a breakpoint change moves every
      // card (and therefore every marker) to a new position — same
      // as the reference codepen's own `window.addEventListener(
      // "resize", createTimeline)`.
      const build = () => {
        tl?.scrollTrigger?.kill();
        tl?.kill();
        spinTween?.scrollTrigger?.kill();
        spinTween?.kill();

        const markers = markerRefs.current.filter(
          (el): el is HTMLDivElement => el !== null,
        );
        if (markers.length === 0) return;

        const states = markers.map((marker) => Flip.getState(marker));
        const flipConfig = { ease: "none", duration: 1 };

        tl = gsap.timeline({
          scrollTrigger: {
            trigger: firstCard,
            start: "clamp(top center)",
            endTrigger: lastCard,
            end: "clamp(bottom center)",
            scrub: 1,
          },
        });

        states.forEach((state, i) => {
          // Flip.fit()'s type signature is `object | Tween | null` —
          // wider than what it actually returns. Passing `flipConfig`
          // (real animation vars: ease + duration) always makes it
          // hand back a genuine Tween at runtime; the plain-`object`
          // case in its type only applies when you call it with no
          // vars at all (an instant, non-animated snap), which we
          // never do here. The null check above already rules out the
          // other non-Tween case, so this cast is safe.
          const flipTween = Flip.fit(iconBox, state, flipConfig);
          if (flipTween) {
            tl!.add(
              flipTween as gsap.core.Tween,
              i === 0 ? undefined : "+=0.5",
            );
          }
        });

        // Continuous spin, decoupled from the Flip timeline above —
        // it targets the inner wrapper (`iconSpin`), not `iconBox`
        // itself, so the rotation transform never fights with the
        // translate/scale Flip.fit applies to move the icon between
        // slots. Its own scrub'd ScrollTrigger spans the same range
        // as the Flip timeline, so the icon keeps spinning the whole
        // time it's flying from card to card.
        if (iconSpin) {
          spinTween = gsap.to(iconSpin, {
            rotate: 720,
            ease: "none",
            scrollTrigger: {
              trigger: firstCard,
              start: "clamp(top center)",
              endTrigger: lastCard,
              end: "clamp(bottom center)",
              scrub: 1,
            },
          });
        }
      };

      build();
      window.addEventListener("resize", build);

      return () => {
        window.removeEventListener("resize", build);
        tl?.scrollTrigger?.kill();
        tl?.kill();
        spinTween?.scrollTrigger?.kill();
        spinTween?.kill();
      };
    },
    { scope: cardsColumnRef, dependencies: [] },
  );

  return (
    <>
      {/* Intro CTA banner */}
      <section className="w-full bg-white-bg px-5 py-20 sm:py-24 md:py-28">
        <div className="flex flex-col items-center text-center">
          <TextRevealBlock
            as="h2"
            lines={[
              "Deliver The Right Message To Your Ideal Audience",
              "With Customized Digital Marketing Solutions. Let\u2019s",
              "Create A Strategy That Works For Your Business.",
            ]}
            className="max-w-6xl text-3xl leading-[1.2] font-semibold tracking-tight text-black-text capitalize sm:text-4xl md:text-5xl md:leading-[1.15] lg:text-[45px]"
            revealColorDark="#000000"
            scrollTrigger
          />

          <div className="mt-10 w-full max-w-xs sm:w-auto">
            <Button to={SITE_PHONE_HREF} variant="primary" size="lg">
              Book a Call
            </Button>
          </div>
        </div>
      </section>

      {/* Tailored strategy — sticky heading beside scrolling cards */}
      <section className="w-full bg-white-bg px-5 py-20 sm:py-24 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[420px_1fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            {/* Plain heading + RevealUp (whole-block mask wipe) instead of
                TextRevealBlock here: TextRevealBlock needs each visual
                line passed in explicitly so its per-line mask can match
                that line's exact width, which only works if you already
                know where it wraps. At this size (scaling up to 72px)
                that break point keeps moving across breakpoints, so a
                plain heading that wraps naturally — masked as one block
                via RevealUp — holds up better than fixed manual lines. */}
            <RevealUp as="h2">
              <span className="block text-3xl leading-[1.1] font-semibold tracking-tight text-black-text sm:text-4xl md:text-5xl lg:text-6xl xl:text-[72px]">
                Digital Marketing Built Around Your Business, Market & Customers
              </span>
            </RevealUp>
            <p className="mt-5 max-w-xs text-sm text-black-text/60 sm:text-base">
              Your Business Doesn&rsquo;t Need The Same Marketing Strategy As
              Everyone Else.
            </p>
          </div>

          {/* max-w here (not on the section) is the actual fix for
              ultrawide monitors: the section itself stays edge-to-edge
              like Services.tsx, but without a cap on this column
              specifically it just stretches to fill the entire `1fr`
              track. `justify-self-end` pins the capped column to the
              right edge of the section instead of leaving it stranded
              next to the heading with empty space past it. */}
          <div
            ref={cardsColumnRef}
            className="flex w-full max-w-180 flex-col justify-self-end gap-6 sm:gap-8"
          >
            {STRATEGY_CARDS.map((card, i) => (
              <div
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`flex min-h-45 flex-col justify-between rounded-[28px] bg-linear-to-br p-6 sm:min-h-55 sm:p-8 ${card.gradient}`}
              >
                {/* Fixed-size wrapper reserves the icon's spot in
                    normal flow regardless of what Flip does to the
                    real icon inside it, so card 1's layout never
                    jumps once the icon flies off toward card 2.
                    `z-20` keeps whichever slot is currently hosting
                    the real icon painting above every card, not just
                    its home card — see Z-INDEX FIX above. */}
                <div
                  className={`relative z-20 h-12 w-12 sm:h-14 sm:w-14 ${
                    card.iconAlign === "right" ? "ml-auto" : ""
                  }`}
                >
                  {i === 0 ? (
                    <div ref={iconBoxRef} className="absolute inset-0">
                      <div ref={iconSpinRef} className="h-full w-full">
                        <PinwheelIcon className="h-full w-full text-white" />
                      </div>
                    </div>
                  ) : (
                    <div
                      ref={(el) => {
                        markerRefs.current[i] = el;
                      }}
                      aria-hidden="true"
                      className="absolute inset-0"
                    />
                  )}
                </div>
                <p className="max-w-md text-lg leading-[1.4] font-normal text-white sm:text-xl md:text-2xl">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
