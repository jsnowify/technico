"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import Cta from "@/components/ui/CTA";
import { gsap, Flip, prefersReducedMotion } from "@/lib/gsap";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* Pinwheel mark — one real instance of this shared across all three
   row placeholders below (see the FLIP setup further down), instead
   of one per row. Same shape as the SEO service icon elsewhere on
   the site (four curved blades), recolored via `currentColor`. */
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

/* Copy for each row, numbered top to bottom, plus which corner of its
   image placeholder the pinwheel slot sits in.
   UNCHANGED: this is the section's actual content/data and is not
   touched by the redesign — same text, same order as before. */
const STRATEGY_ROWS: {
  number: string;
  text: string;
  iconAlign: "left" | "right";
  image: string;
}[] = [
  {
    number: "01",
    text: "A Law Firm May Need Qualified Local Leads From High-Intent Searches, While A Solar Company May Need To Educate Homeowners Before Turning Interest Into Quote Requests.",
    iconAlign: "right",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788935799/temporary-placeholder/Gemini_Generated_Image_3nu4uo3nu4uo3nu4_o2cn3b.jpg",
  },
  {
    number: "02",
    text: "Our Digital Team Works With Businesses Across Industries, Locations, And Stages Of Growth, Building Strategies That Focus On How Your Customers Search, Compare, And Take Action.",
    iconAlign: "left",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788935799/temporary-placeholder/Gemini_Generated_Image_3nu4uo3nu4uo3nu4_o2cn3b.jpg",
  },
  {
    number: "03",
    text: "The Goal Is To Turn Your Digital Presence Into More Local Leads, Ecommerce Sales, Appointment Bookings, And Opportunities To Grow Into New Markets.",
    iconAlign: "right",
    image:
      "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788935799/temporary-placeholder/Gemini_Generated_Image_3nu4uo3nu4uo3nu4_o2cn3b.jpg",
  },
];

/* ================================================================
   SERVICES TAILORED STRATEGY
   ================================================================
   Layout: eyebrow/heading/description header, then three numbered,
   divider-separated rows each pairing a paragraph with an image
   placeholder on the right (unchanged from the last pass).

   PINWHEEL'S BACK — STRAIGHT FLOW THIS TIME
   ------------------------------------------
   Same technique as the old gradient-card version: only row 1 renders
   a real, visible pinwheel (`iconBoxRef`) in the corner of its image
   placeholder; rows 2 and 3 each render an invisible same-size
   placeholder (`markerRefs`) that exists purely to reserve a target
   rect for GSAP Flip to read. A single `gsap.timeline` — its
   `scrollTrigger` spanning from row 1's top to row 3's bottom,
   `scrub: 1` — calls `Flip.fit(iconBox, state)` for each marker in
   turn so the one real icon visually flies between corners in
   lockstep with scroll position.

   The flow itself is intentionally plain this time — no dwell holds,
   no eased wind-up/settle, no landing-bounce overshoot. Just one
   continuous, linear (`ease: "none"`) hop per marker tied directly to
   scroll position, so the icon's position always matches how far
   you've scrolled through the section, straight and predictable.
   A slow, constant spin plays the whole time via a second, entirely
   separate ScrollTrigger — not synced to the hops — so the icon never
   looks frozen without adding extra rhythm to the straight flow.

   `build()` re-reads every marker's rect and rebuilds the timeline
   from scratch on mount and on window resize, since a breakpoint
   change moves every row (and therefore every marker) to a new spot.
   Entirely skipped under `prefersReducedMotion`: the icon just stays
   put in row 1's corner, no scroll-tied motion.

   Z-INDEX: Flip.fit moves the icon purely with a transform, so it
   stays a DOM child of row 1 and paints in row 1's stacking position
   by default. Rows 2 and 3 come after row 1 in the DOM and would
   otherwise paint over it mid-flight. Giving the icon's wrapper (and
   the markers, so layout matches) a `relative z-20` keeps it visible
   above every row, not just its home row.
   ================================================================ */

export default function ServicesTailoredStrategy() {
  const rowsColumnRef = useRef<HTMLDivElement>(null);
  const iconBoxRef = useRef<HTMLDivElement>(null);
  const iconSpinRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const iconBox = iconBoxRef.current;
      const iconSpin = iconSpinRef.current;
      const firstRow = rowRefs.current[0];
      const lastRow = rowRefs.current[STRATEGY_ROWS.length - 1];
      if (!iconBox || !firstRow || !lastRow) return;

      let tl: gsap.core.Timeline | undefined;
      let spinTween: gsap.core.Tween | undefined;

      // Rebuilds the Flip states + scrubbed timeline from the
      // markers' current on-page rects. Called once up front and
      // again on every resize, since a breakpoint change moves every
      // row (and therefore every marker) to a new position.
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

        tl = gsap.timeline({
          scrollTrigger: {
            trigger: firstRow,
            start: "clamp(top center)",
            endTrigger: lastRow,
            end: "clamp(bottom center)",
            scrub: 1,
          },
        });

        // One straight, linear hop per marker — no dwell, no easing,
        // no settle bounce. Position tracks scroll directly.
        states.forEach((state) => {
          const flipTween = Flip.fit(iconBox, state, {
            ease: "none",
            duration: 1,
          }) as gsap.core.Tween | null;
          if (flipTween) tl!.add(flipTween);
        });

        // Constant slow spin for the whole section, independent of
        // the hops, so the icon never looks frozen mid-flight.
        if (iconSpin) {
          spinTween = gsap.to(iconSpin, {
            rotate: "+=360",
            ease: "none",
            scrollTrigger: {
              trigger: firstRow,
              start: "clamp(top center)",
              endTrigger: lastRow,
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
    { scope: rowsColumnRef, dependencies: [] },
  );

  return (
    <>
      {/* Intro CTA banner */}
      <Cta
        className="bg-black-bg"
        title="Deliver The Right Message To Your Ideal Audience"
        description="With customized digital marketing solutions. Let's create a strategy that works for your business."
        cta={{ label: "Book A Call", href: SITE_PHONE_HREF }}
      />

      {/* Tailored strategy — eyebrow/heading/description header,
          then three numbered, divider-separated rows each pairing a
          paragraph with an image placeholder on the right. */}
      <section className="bg-black-bg text-white">
        <div className="container-x pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-14">
          {/* ==========================================================
              HEADER
             ========================================================== */}

          <div className="flex flex-col gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 lg:w-48 lg:shrink-0">
              <span className="font-mono text-xs tracking-[0.16em] whitespace-nowrap text-white/85 uppercase sm:text-sm">
                [ ] Tailored Strategy
              </span>
            </div>

            {/* Heading — plain heading, no reveal/mask animation. */}
            <h2 className="lg:max-w-2xl lg:flex-1">
              <span className="block text-[32px] leading-[1.1] font-medium tracking-heading text-white sm:text-[40px] md:text-[44px]">
                Digital Marketing Built Around Your Business, Market & Customers
              </span>
            </h2>

            {/* Description */}
            <p className="max-w-70 text-[18px] leading-relaxed font-light tracking-body text-white/60 text-pretty lg:w-64 lg:shrink-0">
              Your Business Doesn&rsquo;t Need The Same Marketing Strategy As
              Everyone Else.
            </p>
          </div>

          {/* ==========================================================
              ROWS
             ========================================================== */}

          <div ref={rowsColumnRef}>
            {STRATEGY_ROWS.map((row, i) => (
              <div
                key={row.number}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className={`grid grid-cols-1 gap-6 py-10 sm:py-12 lg:grid-cols-[100px_1fr_420px] lg:items-center lg:gap-10 ${
                  i !== STRATEGY_ROWS.length - 1
                    ? "border-b border-white/10"
                    : ""
                }`}
              >
                {/* Numbered tag */}
                <span className="font-mono text-xs tracking-[0.16em] whitespace-nowrap text-white/85 uppercase sm:text-sm">
                  [ ]{row.number}
                </span>

                {/* Paragraph */}
                <p className="max-w-md text-[16px] leading-[1.5] font-light tracking-body text-white/80 sm:text-[17px]">
                  {row.text}
                </p>

                {/* Image placeholder — plain <img> for now, since this
                    Cloudinary temp-placeholder host isn't whitelisted
                    in next.config.js's images.remotePatterns yet.
                    Swap to next/image once the real photo is hosted
                    somewhere already in remotePatterns.

                    Split into two layers on purpose: the rounded,
                    `overflow-hidden` layer holds ONLY the photo, and
                    the pinwheel's corner slot sits in a separate,
                    non-clipping sibling on top of it. The icon needs
                    to visually fly out past this row's own box toward
                    the next row's — if it lived inside the clipped
                    photo layer, `overflow-hidden` would chop it off
                    the instant it crossed this row's edge mid-flight. */}
                <div className="relative aspect-[16/10] w-full lg:aspect-auto lg:h-[220px]">
                  <div className="absolute inset-0 overflow-hidden rounded-[20px] bg-white/[0.06] ring-1 ring-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={row.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>

                  {/* Fixed-size wrapper reserves the icon's spot in
                      normal flow regardless of what Flip does to the
                      real icon inside it. `z-20` keeps whichever slot
                      is currently hosting the real icon painting above
                      every row, not just its home row. Sits outside
                      the overflow-hidden photo layer above — see note
                      on the wrapper. */}
                  <div
                    className={`absolute top-4 z-20 h-10 w-10 ${
                      row.iconAlign === "right" ? "right-4" : "left-4"
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
