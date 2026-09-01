"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   SERVICES HERO
   ================================================================
   Rebuilt on the same pattern as home/Hero.tsx's backdrop, minus the
   stats bar (that's homepage-specific). Used to run a vanilla-three.js
   fragment-shader background (FractalGlass); that's been removed
   project-wide, so this is now a plain static `next/image` backdrop.

   ASSET: reuses the same backdrop as home/Hero.tsx (rather than a
   separate services-only image) so the two heroes are visibly the
   same design system, not just similarly styled.
     /technico-digital-solutions-inc-bg.webp

   FLOATING ASSET: same idle-float + scroll-parallax treatment as
   home/Hero.tsx's square (two nested refs, one per tween, same
   reasoning as there — a shared element would fight over transform),
   but using the circle asset instead of the square, so this page
   reads as the same family without being a literal duplicate.
     /technico-digital-solutions-inc-circle.png
   ================================================================ */

const HERO_IMAGE = "/technico-digital-solutions-inc-bg.webp";
const HERO_CIRCLE = "/technico-digital-solutions-inc-circle.png";

export default function ServicesHero() {
  const sectionRef = useRef<HTMLElement>(null);
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

    const float = gsap.to(floatEl, {
      y: -16,
      rotation: 2,
      duration: 3.2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Parallax: as the hero scrolls fully through the viewport the
    // circle drifts from slightly below its resting spot to well
    // above it, layered on top of (not replacing) the idle float.
    const parallax = gsap.fromTo(
      parallaxEl,
      { y: 40 },
      {
        y: -140,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
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
      {/* Decorative backdrop — largest above-the-fold image, so it's
          eager/priority rather than lazy-loaded, matching home/Hero.
          Scaled up ~1.25x: home/Hero's version of this same image sits
          inside a much taller <section> (it wraps the stats bar too),
          so object-cover naturally zooms it in more there. This
          section is shorter, so without the extra scale the image
          reads noticeably less zoomed-in than on the homepage. */}
      <div className="absolute inset-0 -z-20 scale-125">
        <Image
          src={HERO_IMAGE}
          loading="eager"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 pb-14 text-center sm:pt-32 sm:pb-16 md:pt-36 lg:pt-40">
        <h1 className="max-w-3xl text-[2rem] leading-[1.15] font-normal tracking-tight text-white sm:text-[42px] sm:leading-[1.1] sm:tracking-[-1.5px] md:text-[50px] md:leading-[50px] md:tracking-[-2px]">
          Digital Marketing Services That Deliver Real Business Growth
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
          Join the growing number of clients who trust Technico Digital
          Solutions.
        </p>

        <div className="mt-8 w-full max-w-xs sm:w-auto">
          <Button to={SITE_PHONE_HREF} variant="primary" size="lg">
            Book a Call
          </Button>
        </div>

        {/* Circle asset — width scales down at each breakpoint,
            mirroring home/Hero's square. Outer div carries the
            scroll-scrubbed parallax offset; inner div carries the
            continuous idle float — kept on separate elements so the
            two tweens don't fight over `transform`. */}
        <div
          ref={parallaxRef}
          className="relative mt-12 w-[200px] sm:mt-14 sm:w-[260px] md:w-[320px] lg:w-[380px]"
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
      </div>
    </section>
  );
}
