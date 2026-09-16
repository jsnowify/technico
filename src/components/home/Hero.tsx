"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  prefersReducedMotion,
  usePrefersReducedMotion,
} from "@/lib/gsap";
import Button from "@/components/ui/Button";
import { SITE_PHONE_HREF } from "@/lib/constants";

const HERO_BG =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/q_auto:best/v1788870336/hero-bg-shapes/technico-bg_z3fyss.avif";
const HERO_CIRCLE =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/q_auto:best/v1788870624/hero-bg-shapes/hero-home-circle.avif";

/*
 * Portrait frame path, supplied at 667x896. Normalized to
 * objectBoundingBox (0-1) fractions so the clip-path scales cleanly
 * with the responsive container instead of being pinned to one
 * pixel size. The notch carved out of the top-right corner is what
 * the floating arrow badge sits into.
 */
const PORTRAIT_CLIP_PATH =
  "M0.655172,0 C0.671733,0 0.685157,0.009994 0.685157,0.022321 V0.212054 C0.685157,0.224381 0.698582,0.234375 0.715142,0.234375 H0.970015 C0.986575,0.234375 1,0.244369 1,0.256696 V0.977679 C1,0.990006 0.986575,1 0.970015,1 H0.029985 C0.013425,1 0,0.990006 0,0.977679 V0.022321 C0,0.009994 0.013425,0 0.029985,0 H0.655172 Z";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [strategyHovered, setStrategyHovered] = useState(false);
  const clipId = useId();
  const reduceMotion = usePrefersReducedMotion();

  useGSAP(() => {
    const section = sectionRef.current;
    const parallaxEl = parallaxRef.current;
    const floatEl = floatRef.current;
    if (!section || !parallaxEl || !floatEl || prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    // Fine-pointer (mouse/trackpad) devices get the full effect.
    mm.add("(pointer: fine)", () => {
      const float = gsap.fromTo(
        floatEl,
        { y: -15, rotation: -2 },
        {
          y: 45,
          rotation: 2,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
      );

      const parallax = gsap.fromTo(
        parallaxEl,
        { y: -60 },
        {
          y: 180,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.3,
          },
        },
      );

      return () => {
        float.kill();
        parallax.scrollTrigger?.kill();
        parallax.kill();
      };
    });

    // Touch/coarse-pointer devices: lighter bob, shorter scroll range, and
    // fastScrollEnd so a quick flick doesn't leave the scrub animation
    // visibly "catching up" after the finger lifts.
    mm.add("(pointer: coarse)", () => {
      const float = gsap.fromTo(
        floatEl,
        { y: -8, rotation: -1 },
        {
          y: 20,
          rotation: 1,
          duration: 3.4,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
      );

      const parallax = gsap.fromTo(
        parallaxEl,
        { y: -25 },
        {
          y: 70,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
            fastScrollEnd: true,
          },
        },
      );

      return () => {
        float.kill();
        parallax.scrollTrigger?.kill();
        parallax.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-black-bg text-white"
    >
      <div className="container-x mx-auto grid min-h-svh w-full max-w-360 grid-cols-1 pt-20 pb-10 lg:grid-cols-[minmax(0,1fr)_667px] lg:pt-18.25 lg:pb-13.75">
        {/* LEFT */}
        <div className="relative z-20 flex flex-col justify-center lg:justify-start lg:pt-29.5">
          <p className="mb-7 font-mono text-[14px] tracking-[-0.02em] text-white/85 uppercase">
            [ ] YOOHOOOO HELLOOOO{" "}
            <span
              className={
                reduceMotion ? "inline-block" : "eyebrow-wave inline-block"
              }
            >
              👋
            </span>
          </p>

          {/* Font-size now lives in globals.css (`.h1-hero`) as a
              fluid clamp() instead of stepped Tailwind breakpoints —
              see that class for the full reasoning. Letter-spacing
              switched from a fixed -2.5px to an em-based -0.04em so
              it scales together with the now-continuously-changing
              font-size instead of staying a flat px value. */}
          <h1 className="h1-hero max-w-132.5 leading-[0.98] font-medium tracking-[-0.04em] text-white">
            <span className="underline decoration-[#8B5CF6] underline-offset-4 text-[#8B5CF6]">
              Digital Marketing Agency
            </span>{" "}
            that prioritize your profit, not just traffic.
          </h1>

          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4 lg:mt-16">
            <Button to={SITE_PHONE_HREF} variant="purple-fill">
              BOOK A CALL
            </Button>
            <Button to={SITE_PHONE_HREF} variant="underline">
              Free Strategy
            </Button>
          </div>

          {/* Desktop overlapping statement card — fixed 617px width (matches
              the source design) so the overlap into the portrait stays
              consistent no matter how wide the left column gets. */}
          <div
            className="mt-14 hidden lg:mt-16 lg:block"
            style={{ width: "617px" }}
          >
            <div className="relative min-h-36.5 overflow-hidden rounded-[20px] border border-white/10 backdrop-blur-xl">
              <svg
                aria-hidden="true"
                viewBox="0 0 617 146"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                <rect
                  width="617"
                  height="146"
                  rx="20"
                  fill="#000000"
                  fillOpacity="0.25"
                />
              </svg>
              <div className="relative flex min-h-36.5 items-center gap-6 px-7 py-5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 102 102"
                  className="h-21.5 w-21.5 shrink-0"
                  fill="none"
                >
                  <path
                    d="M0 0C0 13.5263 5.37171 26.4985 14.9365 36.0621C24.5013 45.6271 37.4734 51.0002 50.9995 51.0002V0H0ZM50.9995 51.0002H102V0C88.4739 0 75.5008 5.3731 65.936 14.9367C56.3712 24.5017 50.9995 37.4726 50.9995 51.0002ZM50.9995 51.0002V102H102C102 88.4741 96.6282 75.5018 87.0634 65.9369C77.4986 56.3733 64.5252 51.0002 50.9995 51.0002ZM50.9995 51.0002H0V102C13.5261 102 26.4994 96.6269 36.0642 87.0633C45.6291 77.4983 50.9995 64.5261 50.9995 51.0002Z"
                    fill="white"
                  />
                </svg>
                <p className="max-w-102.5 text-[15px] leading-[1.35] text-white/95 xl:text-[17px]">
                  Achieve Business Success Through Effective Brand Development.
                  Explore new digital marketing opportunities with Technico
                  Digital Solutions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div
          className="relative z-10 mt-10 h-[72svh] min-h-155 w-full self-start overflow-visible lg:mt-0 lg:h-auto lg:min-h-0"
          style={{ aspectRatio: "667 / 896" }}
        >
          {/* Portrait frame — clipped to the supplied notch shape so the
              floating arrow badge sits flush into the cut top-right corner
              instead of merely overlapping a plain rounded rect. */}
          <svg aria-hidden="true" className="absolute h-0 w-0">
            <defs>
              <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                <path d={PORTRAIT_CLIP_PATH} />
              </clipPath>
            </defs>
          </svg>

          <div
            className="absolute inset-0 overflow-hidden bg-[#eceaf0]"
            style={{ clipPath: `url(#${clipId})` }}
          >
            <Image
              src={HERO_BG}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 667px, 100vw"
              className="object-cover object-center"
            />
          </div>

          <div
            ref={parallaxRef}
            className="absolute top-[45%] left-1/2 w-[54%] max-w-102.5 -translate-x-1/2 -translate-y-1/2 will-change-transform"
          >
            <div ref={floatRef} className="relative aspect-square w-full">
              <Image
                src={HERO_CIRCLE}
                alt=""
                fill
                draggable={false}
                sizes="(min-width: 1024px) 360px, 54vw"
                className="object-contain drop-shadow-[0_24px_35px_rgba(0,0,0,0.18)]"
              />
            </div>
          </div>

          {/* Floating arrow badge — sits inside the notch cut from the portrait */}
          <div className="absolute top-0 right-0 z-30 aspect-square w-[28%] overflow-hidden rounded-[20px] bg-[#8B5CF6]">
            <svg
              aria-hidden="true"
              viewBox="0 0 187 187"
              className="absolute inset-0 h-full w-full"
            >
              <rect width="187" height="187" rx="20" fill="#8B5CF6" />
            </svg>
            <a
              href={SITE_PHONE_HREF}
              aria-label="Book a free strategy call"
              data-cursor="highlight"
              onMouseEnter={() => setStrategyHovered(true)}
              onMouseLeave={() => setStrategyHovered(false)}
              className="relative flex h-full w-full items-center justify-center"
            >
              <svg
                viewBox="0 0 80 80"
                fill="none"
                className={`aspect-square w-[44%] text-black transition-transform duration-500 ease-out ${strategyHovered ? "rotate-45" : "rotate-0"}`}
                aria-hidden="true"
              >
                <path
                  d="M15 65L65 15M65 15H28M65 15V52"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Mobile statement card */}
          <div className="absolute right-4 bottom-4 left-4 z-30 lg:hidden">
            <div className="relative min-h-36.5 overflow-hidden rounded-[20px] border border-white/10 bg-black/25 backdrop-blur-md">
              <div className="relative flex min-h-36.5 items-center gap-5 px-6 py-5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 102 102"
                  className="h-16 w-16 shrink-0"
                  fill="none"
                >
                  <path
                    d="M0 0C0 13.5263 5.37171 26.4985 14.9365 36.0621C24.5013 45.6271 37.4734 51.0002 50.9995 51.0002V0H0ZM50.9995 51.0002H102V0C88.4739 0 75.5008 5.3731 65.936 14.9367C56.3712 24.5017 50.9995 37.4726 50.9995 51.0002ZM50.9995 51.0002V102H102C102 88.4741 96.6282 75.5018 87.0634 65.9369C77.4986 56.3733 64.5252 51.0002 50.9995 51.0002ZM50.9995 51.0002H0V102C13.5261 102 26.4994 96.6269 36.0642 87.0633C45.6291 77.4983 50.9995 64.5261 50.9995 51.0002Z"
                    fill="white"
                  />
                </svg>
                <p className="text-sm leading-snug text-white">
                  Achieve Business Success Through Effective Brand Development.
                  Explore new digital marketing opportunities with Technico
                  Digital Solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
