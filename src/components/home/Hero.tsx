"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import SlidingText from "@/components/motion/SlidingText";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   HOME HERO
   ================================================================
   Copied from about/AboutHero.tsx (itself copied from
   services/ServicesHero.tsx) so all three heroes share one design
   system: left text column on plain bg-black-bg, right image panel
   (backdrop + floating asset + overlapping white card), instead of
   the previous centered single-column layout with the big radial
   vignette behind the headline. That vignette treatment and the
   centered layout are gone along with the old structure.

   ASSETS (both expected in /public):
     /technico-digital-solutions-inc-bg.webp     — right panel backdrop
     /technico-digital-solutions-inc-square.webp — floating 3D square
       (kept as the home page's own asset — ServicesHero/AboutHero
       use the circle instead — so this page still reads as its own
       hero within the shared layout, not a literal duplicate.)

   The square's motion now matches AboutHero.tsx's circle exactly
   (same float range/rotation/duration, same scroll-scrubbed
   parallax distance and `scrollTrigger` bounds), rather than the
   square's own previous tuning — skipped outright under
   prefersReducedMotion, same as SmoothScrollProvider / NavItem /
   SlidingText:

     1. IDLE FLOAT — fromTo -24→24 y / -2→2deg rotation, 2.4s yoyo,
        purely decorative.
     2. SCROLL PARALLAX — fromTo -160→280 y, `scrub: true` (locked
        1:1 to scroll position, no lag), over "top bottom" to
        "bottom+=600 top".

   Two nested refs on the square for the same reason ServicesHero/
   AboutHero document: the scroll-parallax offset and the idle float
   both animate `y`/transform, and GSAP tweens a property by writing
   the element's whole transform each tick — two tweens sharing one
   element would silently overwrite each other.

   The "2.5k+ Project Completed / 100+ Happy Client / 5+ Years Of
   Experience" stats live in their own component, HeroStats.tsx
   (rendered as a separate section right after this one in
   app/page.tsx) — unaffected by this layout change.
   ================================================================ */

const HERO_BG = "/technico-digital-solutions-inc-bg.webp";
const HERO_SQUARE = "/technico-digital-solutions-inc-square.webp";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  // Hover state for the "Free Strategy" link's SlidingText — same
  // mechanic as ui/Button.tsx, and the same pattern ServicesHero.tsx
  // / AboutHero.tsx use for their floating card's link.
  const [linkHovered, setLinkHovered] = useState(false);
  // Two nested refs on purpose: the scroll-parallax offset and the
  // idle float both animate `y`/transform, and GSAP tweens a
  // property by writing the element's whole transform each tick —
  // two tweens sharing one element would silently overwrite each
  // other. Same reasoning useMagneticHover documents for why
  // targetRef/boundsRef must be different elements.
  const parallaxRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const parallaxEl = parallaxRef.current;
    const floatEl = floatRef.current;

    if (!section || !parallaxEl || !floatEl || prefersReducedMotion) return;

    const float = gsap.fromTo(
      floatEl,
      { y: -24, rotation: -2 },
      {
        y: 24,
        rotation: 2,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      },
    );

    // Parallax: as the hero scrolls fully through the viewport the
    // square drifts from above its resting spot to well below it,
    // layered on top of (not replacing) the idle float.
    //
    // `scrub: true` locks the tween's progress directly to the
    // scrollbar — no lag, no easing catch-up — so the square's
    // descent stays perfectly in sync with the user scrolling down
    // (and reverses immediately if they scroll back up). Same
    // treatment as AboutHero.tsx's circle.
    const parallax = gsap.fromTo(
      parallaxEl,
      { y: -160 },
      {
        y: 280,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom+=600 top",
          scrub: true,
        },
      },
    );

    return () => {
      float.kill();
      parallax.scrollTrigger?.kill();
      parallax.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-black-bg"
    >
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 md:items-stretch">
        {/* LEFT — text column. Plain bg-black-bg, no backdrop image
            here (that's reserved for the right panel now), so the
            headline stays high-contrast — same pattern as
            ServicesHero/AboutHero's left column. */}
        <div className="flex flex-col justify-center gap-6 px-5 pt-24 pb-14 sm:px-5 sm:pt-32 sm:pb-16 md:justify-start md:px-5 md:pt-32 lg:px-5 lg:pt-36 xl:pt-40">
          <h1 className="max-w-2xl text-[42px] leading-[0.9] font-medium tracking-[-1px] text-white sm:text-[56px] sm:tracking-[-1.5px] md:text-[64px] md:tracking-[-2px] lg:text-[88px] lg:tracking-[-3px] xl:text-[72px]">
            Digital Marketing Agency That Prioritizes Your Profit, Not Just
            Traffic.
          </h1>

          {/* Divider — same beat as ServicesHero/AboutHero's thin
              rule between the headline and the supporting line
              underneath it. */}
          <div className="h-px w-full max-w-md bg-white/15" />

          <p className="max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            Achieve Business Success Through Effective Brand Development.
            Explore new digital marketing opportunities with Technico Digital
            Solutions.
          </p>

          <div className="w-full max-w-xs sm:w-auto">
            <Button to={SITE_PHONE_HREF} variant="white-static" size="lg">
              Book a Call
            </Button>
          </div>
        </div>

        {/* RIGHT — image panel. Backdrop lives here now instead of
            spanning the whole section, mirroring ServicesHero/
            AboutHero's photo column. Square asset + floating card sit
            on top of it. */}
        <div className="relative isolate min-h-80 overflow-hidden sm:min-h-105 md:min-h-160 lg:min-h-205 xl:min-h-220">
          <div className="absolute inset-0 -z-20 scale-125">
            <Image
              src={HERO_BG}
              loading="eager"
              alt=""
              fill
              unoptimized
              sizes="50vw"
              className="object-cover object-center"
            />
          </div>

          {/* Square asset — outer div carries the scroll-scrubbed
              parallax offset; inner div carries the continuous idle
              float — kept on separate elements so the two tweens
              don't fight over `transform`. */}
          <div
            ref={parallaxRef}
            className="absolute top-1/2 left-1/2 w-55 -translate-x-1/2 -translate-y-1/2 sm:w-70 lg:w-85"
          >
            <div ref={floatRef}>
              <Image
                src={HERO_SQUARE}
                alt=""
                width={800}
                height={800}
                className="h-auto w-full drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Floating accent card — same overlapping white card as
              ServicesHero/AboutHero, copy adjusted for the home page. */}
          <div className="absolute bottom-6 left-6 max-w-55 rounded-[5px] bg-white-primary px-5 py-4 shadow-xl sm:bottom-8 sm:left-8">
            <p className="font-mono text-[11px] tracking-wide text-black-primary/50">
              H . 000
            </p>
            <p className="mt-1 text-sm leading-snug font-medium text-black-primary">
              Free strategy call, no commitment
            </p>
            <a
              href={SITE_PHONE_HREF}
              aria-label="FREE STRATEGY"
              data-cursor="highlight"
              onMouseEnter={() => setLinkHovered(true)}
              onMouseLeave={() => setLinkHovered(false)}
              className="mt-3 inline-flex items-center font-mono text-sm tracking-wide text-black-primary/70 hover:text-black-primary"
            >
              <SlidingText text="FREE STRATEGY" isHovered={linkHovered} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
