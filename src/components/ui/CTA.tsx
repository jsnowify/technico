"use client";

import { useId, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import Button from "@/components/ui/Button";
import { gsap, Draggable, prefersReducedMotion } from "@/lib/gsap";

/**
 * Cta
 * -----------
 * Redesigned to match the client's reference mock exactly, instead
 * of the previous editorial/About-chapter treatment: a single
 * rounded (30px) gradient card (no wrapping section background --
 * it inherits whatever the parent page section already uses),
 * carrying a grain-textured pink -> purple -> indigo diagonal
 * gradient, a checkerboard cutout bleeding off its top-right
 * corner, and a spinning four-blade pinwheel beside the button.
 *
 *   - The gradient + grain background is the client's own bg SVG,
 *     ported 1:1 (same feTurbulence noise recipe on the same
 *     gradient stops) instead of approximated with a flat CSS
 *     gradient plus a raster noise PNG -- it scales losslessly with
 *     the card at any breakpoint and the grain stays crisp instead
 *     of visibly tiling.
 *   - The checkerboard is the client's own squares SVG, sized as a
 *     percentage of the card and nudged past the top/right edges so
 *     the card's own overflow-hidden does the clipping -- the same
 *     bleed-off-canvas look as the mock, without a fixed pixel size
 *     that would misalign on other breakpoints.
 *   - Both SVGs' ids are namespaced with a useId() suffix so two
 *     Cta instances on the same page (About uses this twice) never
 *     collide on a shared `id="paint0_linear..."` / `id="filter0..."`.
 *   - The pinwheel sits beside the Book A Call button and does
 *     three things (all skipped under reduced motion): a slow
 *     continuous spin, a periodic "incoming call" shake to draw the
 *     eye toward the button, and it's draggable via GSAP's
 *     Draggable/InertiaPlugin (already registered in lib/gsap.ts),
 *     hard-bounded to a 50px radius (edgeResistance: 1, so it can't
 *     be dragged past that -- no rubber-band overshoot) with an
 *     elastic snap back to rest on release -- inviting a poke
 *     without ever actually moving the button itself.
 *   - Copy defaults and the CtaLink shape are unchanged so both
 *     existing call sites (AboutStory.tsx, AboutBusinessMarketing.tsx)
 *     keep working without edits. The old `tag`/`accent` props are
 *     gone -- neither call site used them, and the new mock has no
 *     tag pill. The description renders as static text (no
 *     RevealUpText reveal) to match the mock, which has no
 *     scroll-triggered copy animation.
 *
 * Usage:
 *   <Cta
 *     title="We go the extra mile to help you"
 *     description="Fulfill your business plans with targeted
 *       digital marketing strategies. Partner with us today and see
 *       competitive results."
 *     cta={{ label: "Book A Call", href: SITE_PHONE_HREF }}
 *   />
 */

interface CtaLink {
  label: string;
  href: string;
}

interface CtaProps {
  /** Usually a plain string, but accepts JSX (e.g. a manual <br />)
   *  for call sites that need a specific line break in the headline
   *  rather than relying on natural wrapping. */
  title?: ReactNode;
  description?: string;
  cta?: CtaLink;
  className?: string;
  /** Widens the description column past the default `max-w-sm` (built
   *  for a short one-line blurb) to `max-w-md sm:max-w-lg`, for call
   *  sites whose copy runs to a couple of sentences instead. */
  wide?: boolean;
}

export default function Cta({
  title = "We go the extra mile to help you",
  description = "Fulfill your business plans with targeted digital marketing strategies. Partner with us today and see competitive results.",
  cta = { label: "Book A Call", href: "#" },
  className = "",
  wide = false,
}: CtaProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const pinwheelRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!pinwheelRef.current || prefersReducedMotion) return;
    const el = pinwheelRef.current;

    // Continuous slow spin.
    gsap.to(el, {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    });

    // Idle "incoming call" shake -- a quick side-to-side jitter that
    // repeats every few seconds, next to the Book A Call button, as
    // a psychological nudge to look/click: the same attention-grab
    // as a phone buzzing for a call rather than a static icon.
    const shake = gsap
      .timeline({ repeat: -1, repeatDelay: 3.5 })
      .to(el, { x: -5, duration: 0.07, ease: "power1.inOut" })
      .to(el, { x: 5, duration: 0.07, ease: "power1.inOut" })
      .to(el, { x: -4, duration: 0.07, ease: "power1.inOut" })
      .to(el, { x: 4, duration: 0.07, ease: "power1.inOut" })
      .to(el, { x: -2, duration: 0.07, ease: "power1.inOut" })
      .to(el, { x: 0, duration: 0.07, ease: "power1.inOut" });

    // Draggable + elastic snap-back: picking it up and letting go
    // pulls it right back to rest, like it's tethered, instead of
    // leaving it wherever it's dropped -- reinforces that it's a
    // toy to poke at, not a control.
    const [draggable] = Draggable.create(el, {
      type: "x,y",
      inertia: true,
      bounds: { minX: -50, maxX: 50, minY: -50, maxY: 50 },
      edgeResistance: 1,
      onPress() {
        shake.pause();
        gsap.to(el, { scale: 1.08, duration: 0.15 });
      },
      onRelease() {
        gsap.to(el, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "elastic.out(1, 0.45)",
          onComplete: () => shake.restart(),
        });
      },
    });

    return () => {
      draggable.kill();
      shake.kill();
    };
  }, []);

  return (
    <section className={`px-4 py-16 sm:px-6 sm:py-20 md:py-24 ${className}`}>
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[30px]">
        {/* Grain-textured gradient background -- ported from the
            client's bg SVG, see file header. `preserveAspectRatio
            ="none"` so it stretches to fill the card at any width
            instead of letterboxing. */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1165 362"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g filter={`url(#${uid}-noise)`}>
            <rect width="1165" height="362" fill={`url(#${uid}-grad)`} />
          </g>
          <defs>
            <filter
              id={`${uid}-noise`}
              x="0"
              y="0"
              width="1165"
              height="362"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feTurbulence
                type="fractalNoise"
                baseFrequency="2 2"
                stitchTiles="stitch"
                numOctaves={3}
                result="noise"
                seed={8078}
              />
              <feColorMatrix
                in="noise"
                type="luminanceToAlpha"
                result="alphaNoise"
              />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA
                  type="discrete"
                  tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
                />
              </feComponentTransfer>
              <feComposite
                operator="in"
                in2="shape"
                in="coloredNoise1"
                result="noise1Clipped"
              />
              <feFlood floodColor="rgba(0, 0, 0, 0.25)" result="color1Flood" />
              <feComposite
                operator="in"
                in2="noise1Clipped"
                in="color1Flood"
                result="color1"
              />
              <feMerge>
                <feMergeNode in="shape" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
            <linearGradient
              id={`${uid}-grad`}
              x1="1165"
              y1="-2.3883e-5"
              x2="230.57"
              y2="679.209"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FE96C9" />
              <stop offset="0.625" stopColor="#6625CB" />
              <stop offset="1" stopColor="#3A1573" />
            </linearGradient>
          </defs>
        </svg>

        {/* Checkerboard cutout, bleeding off the card's top-right
            corner -- overflow-hidden on the parent does the clip. */}
        <svg
          className="pointer-events-none absolute top-0 -right-2 aspect-square w-28 sm:-right-4 sm:w-40 md:w-56 lg:h-full lg:w-auto"
          viewBox="0 0 361 361"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 0V90.045H90.0404V0H0ZM90.0404 90.045V180.09H180.085V90.045H90.0404ZM180.09 0V90.045H270.135V0H180.09ZM270.135 90.045V180.09H360.181V90.045H270.135ZM0 180.09V270.135H90.0404V180.09H0ZM90.0404 270.135V360.18H180.085V270.135H90.0404ZM180.09 180.09V270.135H270.135V180.09H180.09ZM270.135 270.135V360.18H360.181V270.135H270.135Z"
            fill="white"
          />
        </svg>

        {/* Content -- capped to the left ~60% so it never runs
            under the checkerboard on narrow tablet widths. */}
        <div className="relative z-10 max-w-[62%] px-8 py-14 sm:px-12 sm:py-16 md:px-14 md:py-20 lg:px-16">
          <h2 className="text-[28px] leading-[1.15] font-semibold tracking-tight text-white sm:text-[36px] md:text-[42px]">
            {title}
          </h2>

          <p
            className={`mt-5 text-sm leading-relaxed text-white/80 sm:mt-6 sm:text-base ${
              wide ? "max-w-md sm:max-w-lg" : "max-w-sm"
            }`}
          >
            {description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10 sm:flex-nowrap">
            <Button to={cta.href} variant="purple" size="lg">
              {cta.label}
            </Button>
            <svg
              ref={pinwheelRef}
              className="h-7 w-7 shrink-0 cursor-grab touch-none [will-change:transform] active:cursor-grabbing sm:h-8 sm:w-8 md:h-9 md:w-9"
              viewBox="0 0 37 37"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M0 0C0 4.89546 1.94417 9.59041 5.40594 13.0517C8.86771 16.5135 13.5626 18.4581 18.4581 18.4581V0L0 0ZM18.4581 18.4581L36.9166 18.4581V0C32.0211 0 27.3258 1.94464 23.864 5.40593C20.4023 8.8677 18.4581 13.5622 18.4581 18.4581ZM18.4581 18.4581L18.4581 36.9161H36.9166C36.9166 32.0208 34.9724 27.3258 31.5106 23.864C28.0489 20.4028 23.3534 18.4581 18.4581 18.4581ZM18.4581 18.4581H0L0 36.9161C4.89546 36.9161 9.59086 34.9714 13.0526 31.5102C16.5144 28.0484 18.4581 23.3535 18.4581 18.4581Z"
                fill="#FFFFF9"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
