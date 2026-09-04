"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import SlidingText from "@/components/motion/SlidingText";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   ABOUT HERO
   ================================================================
   Copied from services/ServicesHero.tsx's two-column layout: left
   text column on plain bg-black-bg, right image panel (backdrop +
   floating circle + overlapping white card) instead of the previous
   centered single-column layout. Same idle-float + scroll-parallax
   treatment on the circle, same reasoning for the two nested refs
   (see ServicesHero.tsx's comment — two tweens on one element would
   fight over `transform`).

   Only the copy (headline, subhead, card text) and button variant
   change; layout, classes, and animation are the same as
   ServicesHero.tsx so the two pages read as the same design system.

   SCROLL SYNC: parallax uses `scrub: true` (not a numeric scrub)
   so the circle's vertical offset is driven 1:1 by scroll position
   with no smoothing/catch-up lag — it should visually move together
   with the page as you scroll, not trail behind it. The idle float
   still runs independently on its own nested ref so it keeps
   breathing even while the parallax tween is scroll-locked.

   ASSETS (expected in /public, already used elsewhere in the site):
     /technico-digital-solutions-inc-bg.webp     (home/Hero.tsx)
     /technico-digital-solutions-inc-circle.png  (ServicesHero.tsx)
   ================================================================ */

const HERO_IMAGE = "/technico-digital-solutions-inc-bg.webp";
const HERO_CIRCLE = "/technico-digital-solutions-inc-circle.png";

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  // Hover state for the "Free Strategy" link's SlidingText — same
  // mechanic as ui/Button.tsx (local state driving the slide-up/out,
  // slide-in/up tween).
  const [linkHovered, setLinkHovered] = useState(false);
  // Two nested refs on purpose: the scroll-parallax offset and the
  // idle float both animate `y`/transform, and GSAP tweens a
  // property by writing the element's whole transform each tick —
  // two tweens sharing one element would silently overwrite each
  // other. Same reasoning ServicesHero.tsx documents for its circle.
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
    // (and reverses immediately if they scroll back up).
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
            ServicesHero's left column. */}
        <div className="flex flex-col justify-center gap-6 px-5 pt-24 pb-14 sm:px-5 sm:pt-32 sm:pb-16 md:justify-start md:px-5 md:pt-32 lg:px-5 lg:pt-36 xl:pt-40">
          <h1 className="max-w-2xl text-[42px] leading-[0.9] font-medium tracking-[-1px] text-white sm:text-[56px] sm:tracking-[-1.5px] md:text-[64px] md:tracking-[-2px] lg:text-[88px] lg:tracking-[-3px] xl:text-[72px]">
            Your Trusted Digital Marketers For Business Transformation
          </h1>

          {/* Divider — same beat as ServicesHero's thin rule between
              the headline and the supporting line underneath it. */}
          <div className="h-px w-full max-w-md bg-white/15" />

          <p className="max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            At Technico Solutions, We&apos;re Your Trusted Digital Marketers,
            All About Driving Results That Matter.
          </p>

          <div className="w-full max-w-xs sm:w-auto">
            <Button to={SITE_PHONE_HREF} variant="white-static" size="lg">
              Book a Call
            </Button>
          </div>
        </div>

        {/* RIGHT — image panel. Backdrop lives here now instead of
            spanning the whole section, mirroring ServicesHero's photo
            column. Circle asset + floating card sit on top of it. */}
        <div className="relative isolate min-h-[320px] overflow-hidden sm:min-h-[420px] md:min-h-[640px] lg:min-h-[820px] xl:min-h-[880px]">
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
            className="absolute top-1/2 left-1/2 w-[220px] -translate-x-1/2 -translate-y-1/2 sm:w-[280px] lg:w-[340px]"
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
              ServicesHero, copy adjusted for the About page. */}
          <div className="absolute bottom-6 left-6 max-w-[220px] rounded-[5px] bg-white-primary px-5 py-4 shadow-xl sm:bottom-8 sm:left-8">
            <p className="font-mono text-[11px] tracking-wide text-black-primary/50">
              A . 000
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
