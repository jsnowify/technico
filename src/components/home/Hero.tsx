"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
  usePrefersReducedMotion,
} from "@/lib/gsap";
import Button from "@/components/ui/Button";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   HOME HERO
   ================================================================
   ASSETS (both expected in /public):
     /technico-digital-solutions-inc-bg.webp     — full-bleed backdrop
     /technico-digital-solutions-inc-square.webp — floating 3D square

   The backdrop is a fixed decorative image (next/image, fill,
   priority — it's the largest above-the-fold paint on most viewports
   so it shouldn't be lazy-loaded). The square gets two motion layers,
   both skipped outright under prefersReducedMotion the same way
   SmoothScrollProvider / NavItem / SlidingText already do:

     1. IDLE FLOAT — a small continuous yoyo drift, purely decorative.
     2. SCROLL PARALLAX — tied to ScrollTrigger with scrub, so the
        square's vertical offset tracks how far the hero section has
        scrolled through the viewport rather than the raw scroll
        speed. Works whether or not Lenis is active, since
        SmoothScrollProvider keeps ScrollTrigger synced to Lenis on
        every tick already.

   All copy (H1, subhead, CTA, stats) is plain server-rendered-able
   JSX — nothing here is injected after the fact, so it's present in
   the initial HTML regardless of whether the animations ever run.
   ================================================================ */

const HERO_BG = "/technico-digital-solutions-inc-bg.webp";
const HERO_SQUARE = "/technico-digital-solutions-inc-square.webp";

const STATS = [
  { value: "2.5k+", label: "Project Completed" },
  { value: "100+", label: "Happy Client" },
  { value: "5+", label: "Years Of Experience" },
] as const;

// Zero-state text for each stat, matching its own suffix/decimals
// (e.g. "2.5k+" -> "0.0k+"), shown until the count-up animates in.
function zeroState(value: string): string {
  const match = value.match(/^([\d.]+)(.*)$/);
  if (!match) return value;
  const decimals = match[1].includes(".") ? 1 : 0;
  return `${(0).toFixed(decimals)}${match[2]}`;
}

export default function Hero() {
  // Hook version, used only for the stat text below, which reads
  // straight into render output. See the doc comment on the hooks in
  // lib/gsap.ts for why the plain module-level constant can't be used
  // directly in JSX without risking a hydration mismatch.
  const reducedMotion = usePrefersReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  // Two nested refs on purpose: the scroll-parallax offset and the
  // idle float both animate `y`/transform, and GSAP tweens a
  // property by writing the element's whole transform each tick —
  // two tweens sharing one element would silently overwrite each
  // other. Same reasoning useMagneticHover documents for why
  // targetRef/boundsRef must be different elements.
  const parallaxRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  // One entry per STATS item — filled in by the ref callback on each
  // number <p> below, read by the count-up ScrollTrigger effect.
  const statValueRefs = useRef<(HTMLParagraphElement | null)[]>([]);

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
    // square drifts from slightly below its resting spot to well
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

  // Count-up: each stat animates from 0 up to its real value the
  // moment it's scrolled into view from the bottom, snaps back down
  // to 0 the moment it scrolls back out (either direction), and
  // replays the count-up every time it re-enters — so it's never a
  // one-shot, it just tracks "currently visible or not".
  useGSAP(() => {
    if (prefersReducedMotion) return;

    const triggers = STATS.map((stat, i) => {
      const el = statValueRefs.current[i];
      if (!el) return null;

      const match = stat.value.match(/^([\d.]+)(.*)$/);
      if (!match) return null;

      const target = parseFloat(match[1]);
      const suffix = match[2];
      const decimals = match[1].includes(".") ? 1 : 0;
      const counter = { val: 0 };

      const render = () => {
        el.textContent = `${counter.val.toFixed(decimals)}${suffix}`;
      };

      let tween: gsap.core.Tween | null = null;
      const animateTo = (value: number, duration: number) => {
        tween?.kill();
        tween = gsap.to(counter, {
          val: value,
          duration,
          ease: value === 0 ? "power1.out" : "power2.out",
          onUpdate: render,
        });
      };

      return ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => animateTo(target, 1.4),
        onEnterBack: () => animateTo(target, 1.4),
        onLeave: () => animateTo(0, 0.3),
        onLeaveBack: () => animateTo(0, 0.3),
      });
    });

    return () => {
      triggers.forEach((t) => t?.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-black-bg"
    >
      {/* Decorative backdrop — largest above-the-fold image, so it's
          eager/priority rather than lazy-loaded. */}
      <div className="absolute inset-0 -z-20">
        <Image
          src={HERO_BG}
          loading="eager"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Soft gradient — the backdrop webp is a uniformly-lit purple
          checkerboard with no vignette baked in, so layering *more*
          purple on top of it was invisible (previous attempt). What
          the reference design actually needs is a real BLACK vignette
          crushing the corners/edges toward black, with the purple only
          surviving as a glow around the square/headline. Three stacked
          radial-gradients, painted back-to-front:
            1. wide vignette — darkens the far corners/edges to near-
               black so the center reads as a "glow" by contrast.
            2. soft wash behind the headline.
            3. bright, tight bloom behind the square, the hot-spot.
          Sits above the backdrop image but below the bottom fade and
          content. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[15]"
        style={{
          background:
            "radial-gradient(46% 40% at 50% 76%, rgba(168,85,247,0.85) 0%, rgba(139,92,246,0.4) 42%, rgba(139,92,246,0) 78%), " +
            "radial-gradient(60% 45% at 50% 34%, rgba(107,38,217,0.4) 0%, rgba(107,38,217,0.12) 50%, rgba(107,38,217,0) 78%), " +
            "radial-gradient(75% 85% at 50% 48%, transparent 0%, transparent 32%, rgba(1,1,4,0.55) 62%, rgba(1,1,4,0.95) 100%)",
        }}
      />

      {/* Soft fade so the hero hands off cleanly into the white
          stats bar below, independent of exactly where the source
          image itself fades out at different viewport heights. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-b from-transparent to-white-bg sm:h-36"
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 pb-14 text-center sm:pt-32 sm:pb-16 md:pt-36 lg:pt-40">
        <h1 className="max-w-3xl text-[2rem] leading-[1.15] font-normal tracking-tight text-white sm:text-[42px] sm:leading-[1.1] sm:tracking-[-1.5px] md:text-[50px] md:leading-[50px] md:tracking-[-2px]">
          Digital Marketing Agency That Prioritizes Your Profit, Not Just
          Traffic.
        </h1>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
          Achieve Business Success Through Effective Brand Development. Explore
          new digital marketing opportunities with Technico Digital Solutions.
        </p>

        <div className="mt-8 w-full max-w-xs sm:w-auto">
          <Button to={SITE_PHONE_HREF} variant="primary" size="lg">
            Book a Call
          </Button>
        </div>

        {/* Square asset — width scales down at each breakpoint so it
            never overwhelms the copy on small screens. Outer div
            carries the scroll-scrubbed parallax offset; inner div
            carries the continuous idle float — kept on separate
            elements so the two tweens don't fight over `transform`. */}
        <div
          ref={parallaxRef}
          className="relative mt-12 w-[200px] sm:mt-14 sm:w-[260px] md:w-[320px] lg:w-[380px]"
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
      </div>

      <div className="relative z-10 border-t border-black/5 bg-white-bg">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-8 px-6 py-16 text-center sm:gap-16 sm:py-20 md:py-24">
          {STATS.map((stat, i) => (
            <div key={stat.label}>
              <p
                ref={(el) => {
                  statValueRefs.current[i] = el;
                }}
                className="text-4xl font-normal tracking-tight text-black-text sm:text-5xl md:text-6xl lg:text-7xl"
              >
                {reducedMotion ? stat.value : zeroState(stat.value)}
              </p>
              <p className="mt-3 text-sm font-medium tracking-wide text-black-text/50 uppercase sm:mt-4 sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
