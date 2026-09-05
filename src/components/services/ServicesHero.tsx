"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import SlidingText from "@/components/motion/SlidingText";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   SERVICES HERO
   ================================================================
   Same design system as home/Hero.tsx and about/AboutHero.tsx — left
   text column on plain bg-black-bg, right image panel (backdrop +
   floating circle + overlapping white card). Layout, font sizes,
   spacing units, and the float/parallax animation values are now
   identical across all three heroes; only the copy (headline,
   subhead, card label) and the circle vs square asset differ.

   ASSET: reuses the same backdrop as home/Hero.tsx (rather than a
   separate services-only image) so the two heroes are visibly the
   same design system, not just similarly styled.
     /technico-digital-solutions-inc-bg.webp

   FLOATING ASSET: same idle-float + scroll-parallax treatment as
   home/Hero.tsx's square / about/AboutHero.tsx's circle (two nested
   refs, one per tween, same reasoning — a shared element would fight
   over transform), using the circle asset here.
     /technico-digital-solutions-inc-circle.png
   ================================================================ */

const HERO_IMAGE = "/technico-digital-solutions-inc-bg.webp";
const HERO_CIRCLE = "/technico-digital-solutions-inc-circle.png";

export default function ServicesHero() {
  const sectionRef = useRef<HTMLElement>(null);
  // Hover state for the "Free Strategy" link's SlidingText — same
  // mechanic as ui/Button.tsx (local state driving the slide-up/out,
  // slide-in/up tween).
  const [linkHovered, setLinkHovered] = useState(false);
  // Two nested refs on purpose: the scroll-parallax offset and the
  // idle float both animate `y`/transform, and GSAP tweens a
  // property by writing the element's whole transform each tick —
  // two tweens sharing one element would silently overwrite each
  // other. Same reasoning home/Hero.tsx documents for its square.
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
    // circle drifts from above its resting spot to well below it,
    // layered on top of (not replacing) the idle float.
    //
    // `scrub: true` locks the tween's progress directly to the
    // scrollbar — no lag, no easing catch-up — so the circle's
    // descent stays perfectly in sync with the user scrolling down
    // (and reverses immediately if they scroll back up). Same
    // treatment as home/Hero.tsx and about/AboutHero.tsx.
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
            home/Hero.tsx and about/AboutHero.tsx's left column. */}
        <div className="flex flex-col justify-center gap-6 px-5 pt-24 pb-14 sm:px-5 sm:pt-32 sm:pb-16 md:justify-start md:px-5 md:pt-32 lg:px-5 lg:pt-36 xl:pt-40">
          <h1 className="max-w-2xl text-[42px] leading-[0.9] font-medium tracking-[-1px] text-white sm:text-[56px] sm:tracking-[-1.5px] md:text-[64px] md:tracking-[-2px] lg:text-[88px] lg:tracking-[-3px] xl:text-[72px]">
            Digital Marketing Services That
            <br />
            Deliver Real Business Growth
          </h1>

          {/* Divider — same beat as home/Hero.tsx and
              about/AboutHero.tsx's thin rule between the headline and
              the supporting line underneath it. */}
          <div className="h-px w-full max-w-md bg-white/15" />

          <p className="max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            Join the growing number of clients who trust Technico Digital
            Solutions.
          </p>

          <div className="w-full max-w-xs sm:w-auto">
            <Button to={SITE_PHONE_HREF} variant="white-static" size="lg">
              Book a Call
            </Button>
          </div>
        </div>

        {/* RIGHT — image panel. Backdrop lives here now instead of
            spanning the whole section, mirroring home/Hero.tsx and
            about/AboutHero.tsx's photo column. Circle asset +
            floating card sit on top of it. */}
        <div className="relative isolate min-h-80 overflow-hidden sm:min-h-105 md:min-h-160 lg:min-h-205 xl:min-h-220">
          <div className="absolute inset-0 -z-20 scale-125">
            <Image
              src={HERO_IMAGE}
              loading="eager"
              alt=""
              fill
              unoptimized
              sizes="50vw"
              className="object-cover object-center"
            />
          </div>

          {/* Circle asset — outer div carries the scroll-scrubbed
              parallax offset; inner div carries the continuous idle
              float — kept on separate elements so the two tweens
              don't fight over `transform`. */}
          <div
            ref={parallaxRef}
            className="absolute top-1/2 left-1/2 w-55 -translate-x-1/2 -translate-y-1/2 sm:w-70 lg:w-85"
          >
            <div ref={floatRef}>
              <Image
                src={HERO_CIRCLE}
                alt=""
                width={800}
                height={800}
                className="h-auto w-full drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Floating accent card — same overlapping white card as
              home/Hero.tsx and about/AboutHero.tsx, copy adjusted for
              the Services page. */}
          <div className="absolute bottom-6 left-6 max-w-55 rounded-[5px] bg-white-primary px-5 py-4 shadow-xl sm:bottom-8 sm:left-8">
            <p className="font-mono text-[11px] tracking-wide text-black-primary/50">
              S . 000
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
