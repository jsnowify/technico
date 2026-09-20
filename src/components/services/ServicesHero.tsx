"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";

import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { isSiteReady, SITE_READY_EVENT } from "@/lib/site-ready";
import ScrambleText from "@/components/motion/ScrambleText";

/**
 * A new visual direction, not a rearrangement of the old image hero:
 * purple editorial stage, oversized black typography, an abstract stepped
 * signal. The black sheet is now a separate ServicesHeroReveal component,
 * following the exact homepage two-viewport sticky stack.
 * All existing visible copy is retained verbatim.
 */
const SIGNAL = [
  { left: 0, width: 24 },
  { left: 8, width: 34 },
  { left: 2, width: 48 },
  { left: 18, width: 46 },
  { left: 7, width: 68 },
  { left: 0, width: 86 },
  { left: 12, width: 88 },
  { left: 0, width: 100 },
  { left: 22, width: 72 },
  { left: 7, width: 80 },
  { left: 28, width: 55 },
  { left: 14, width: 52 },
  { left: 38, width: 34 },
] as const;

/**
 * Pointer position selects one row. That row opens fully while nearby rows
 * follow from alternating sides with a distance-based delay. A slower echo
 * follows each solid bar, creating a horizontal trail without scaling bars.
 */
function InteractiveServicesSignal() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const bars = Array.from(
      field.querySelectorAll<HTMLElement>("[data-services-signal-bar]"),
    );
    const echoes = Array.from(
      field.querySelectorAll<HTMLElement>("[data-services-signal-echo]"),
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let animationFrame = 0;
    let pointerY = 0;
    let activeRow = Math.floor(SIGNAL.length / 2);

    const animateAtPointer = () => {
      animationFrame = 0;
      const rect = field.getBoundingClientRect();
      const rowPitch = rect.height / SIGNAL.length;
      activeRow = Math.max(
        0,
        Math.min(SIGNAL.length - 1, Math.floor(pointerY / rowPitch)),
      );

      bars.forEach((bar, index) => {
        const distance = Math.abs(index - activeRow);
        const influenced = distance <= 4;
        const width = influenced
          ? Math.max(SIGNAL[index].width, 100 - distance * 13)
          : SIGNAL[index].width;
        const fromLeft = (index - activeRow + 4) % 2 === 0;
        const left = influenced
          ? fromLeft
            ? 0
            : 100 - width
          : SIGNAL[index].left;

        gsap.to(bar, {
          left: `${left}%`,
          width: `${width}%`,
          opacity: influenced ? 1 : 0.72,
          duration: 0.34,
          delay: distance * 0.018,
          ease: "power3.out",
          overwrite: "auto",
        });

        gsap.to(echoes[index], {
          left: `${left}%`,
          width: `${width}%`,
          opacity: influenced ? 0.32 : 0.14,
          duration: 0.78,
          delay: 0.06 + distance * 0.025,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = field.getBoundingClientRect();
      pointerY = Math.max(
        0,
        Math.min(rect.height - 0.01, event.clientY - rect.top),
      );
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(animateAtPointer);
      }
    };

    const reset = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;

      bars.forEach((bar, index) => {
        const distance = Math.abs(index - activeRow);
        gsap.to(bar, {
          left: `${SIGNAL[index].left}%`,
          width: `${SIGNAL[index].width}%`,
          opacity: 1,
          duration: 0.46,
          delay: distance * 0.012,
          ease: "power3.inOut",
          overwrite: "auto",
        });
        gsap.to(echoes[index], {
          left: `${SIGNAL[index].left}%`,
          width: `${SIGNAL[index].width}%`,
          opacity: 0.16,
          duration: 0.82,
          delay: 0.04 + distance * 0.018,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      });
    };

    field.addEventListener("pointerenter", updatePointer);
    field.addEventListener("pointermove", updatePointer);
    field.addEventListener("pointerdown", updatePointer);
    field.addEventListener("pointerleave", reset);
    field.addEventListener("pointerup", reset);
    field.addEventListener("pointercancel", reset);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      field.removeEventListener("pointerenter", updatePointer);
      field.removeEventListener("pointermove", updatePointer);
      field.removeEventListener("pointerdown", updatePointer);
      field.removeEventListener("pointerleave", reset);
      field.removeEventListener("pointerup", reset);
      field.removeEventListener("pointercancel", reset);
      gsap.killTweensOf([...bars, ...echoes]);
    };
  }, []);

  return (
    <div aria-hidden="true" className="relative min-w-0 pb-1">
      <div className="mb-3 flex items-center justify-between gap-4 font-mono text-[9px] tracking-[0.08em] uppercase sm:mb-4 sm:text-[10px]">
        <span>/ Capability signal</span>
        <span className="opacity-55">Hover / trace</span>
      </div>

      <div className="mb-3 h-px w-full bg-black-bg/40 sm:mb-4" />
      <div
        ref={fieldRef}
        className="flex h-[clamp(112px,18svh,180px)] w-full touch-pan-y cursor-crosshair flex-col justify-between overflow-hidden py-1 sm:h-[clamp(150px,22svh,240px)] lg:h-[clamp(220px,28vw,340px)]"
      >
        {SIGNAL.map((bar, index) => (
          <div
            key={index}
            className="relative h-[clamp(3px,0.5vw,7px)] w-full shrink-0"
          >
            <span
              data-services-entrance-bar
              data-services-signal-echo
              className="absolute top-0 block h-full bg-black-bg/30 will-change-[left,width]"
              style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
            />
            <span
              data-services-entrance-bar
              data-services-signal-bar
              className="absolute top-0 block h-full bg-black-bg will-change-[left,width]"
              style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 h-px w-full bg-black-bg/40 sm:mt-4" />
    </div>
  );
}

export default function ServicesHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion) return;

      const words = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-services-word]"),
      );
      const bars = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-services-entrance-bar]"),
      );
      const secondary = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-services-reveal]"),
      );

      gsap.set(words, { autoAlpha: 0, yPercent: 115 });
      gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(secondary, { autoAlpha: 0, y: 20 });

      let entrance: gsap.core.Timeline | undefined;

      const reveal = () => {
        if (entrance) return;

        entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
        entrance
          .to(
            words,
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.95,
              stagger: 0.13,
              ease: "power4.out",
            },
            0.12,
          )
          .to(
            bars,
            {
              scaleX: 1,
              duration: 0.7,
              stagger: { each: 0.035, from: "center" },
              ease: "power3.out",
            },
            0.36,
          )
          .to(
            secondary,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.065,
            },
            0.55,
          )
          .set([...words, ...bars, ...secondary], {
            clearProps: "opacity,visibility,transform,transformOrigin",
          });
      };

      // Same preloader handshake as the homepage; no new loader or scroll pin.
      if (isSiteReady()) {
        reveal();
      } else {
        window.addEventListener(SITE_READY_EVENT, reveal, { once: true });
      }

      return () => {
        window.removeEventListener(SITE_READY_EVENT, reveal);
        entrance?.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-hero-title"
      className="relative isolate flex h-full min-h-[100svh] flex-col overflow-hidden bg-purple-hero text-black-bg"
    >
      {/* Violet stage: a full-height composition like the real homepage Hero. */}
      <div className="container-x mx-auto flex w-full max-w-[1920px] flex-1 flex-col pt-[clamp(104px,14svh,154px)] pb-[clamp(30px,5svh,62px)]">
        {/* The homepage's fine, technical metadata treatment. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-black-bg/45 pb-4 font-mono text-[10px] leading-[1.2] tracking-[-0.02em] uppercase sm:grid-cols-4 sm:text-xs">
          <ScrambleText
            text="TECHNICO_"
            trigger="inview-repeat"
            repeatEvery={5}
            waitForSiteReady
          />
          <ScrambleText
            text="DIGITAL SOLUTIONS"
            trigger="inview-repeat"
            repeatEvery={5}
            waitForSiteReady
            className="sm:text-center"
          />
          <ScrambleText
            text="2026 / SERVICES"
            trigger="inview-repeat"
            repeatEvery={5}
            waitForSiteReady
          />
          <ScrambleText
            text="06 / CAPABILITIES"
            trigger="inview-repeat"
            repeatEvery={5}
            waitForSiteReady
            className="text-right"
          />
        </div>

        {/* Entirely new asymmetric stage: monumental type + abstract signal. */}
        <div className="grid min-w-0 flex-1 items-end gap-x-[clamp(24px,4vw,84px)] gap-y-8 pt-[clamp(36px,7svh,94px)] lg:grid-cols-[minmax(0,1fr)_minmax(190px,0.31fr)] lg:pb-[clamp(14px,3svh,42px)]">
          <div className="min-w-0 self-end">
            <div
              data-services-reveal
              className="mb-[clamp(22px,4svh,48px)] flex items-center gap-3 font-mono text-[10px] font-medium tracking-[0.05em] uppercase sm:text-xs"
            >
              <span
                aria-hidden="true"
                className="h-[7px] w-[7px] bg-black-bg"
              />
              / WHAT WE DO
            </div>

            <h1
              id="services-hero-title"
              className="min-w-0 font-bold uppercase"
              style={{
                fontSize: "clamp(2.75rem, 9.45vw, 10.5rem)",
                letterSpacing: "-0.085em",
                lineHeight: 0.91,
              }}
            >
              <span className="block overflow-hidden pb-[0.11em]">
                <span data-services-word className="block">
                  Digital
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.11em]">
                <span data-services-word className="block">
                  Marketing
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.11em]">
                <span data-services-word className="block">
                  Services
                </span>
              </span>
            </h1>
          </div>

          {/* Graphic language from the homepage's stepped wave, newly composed
              as a vertical signal sculpture instead of reusing the old image. */}
          <div
            data-services-reveal
            className="relative flex min-w-0 flex-col justify-end lg:pb-[clamp(12px,2.4svh,32px)]"
          >
            <InteractiveServicesSignal />
          </div>
        </div>

        {/* Exploration remains in the purple stage, not hidden inside a notch. */}
        <div
          data-services-reveal
          className="mt-[clamp(22px,4svh,48px)] flex items-center justify-end gap-4 border-t border-black-bg/40 pt-4 font-mono text-[10px] font-medium uppercase sm:text-xs"
        >
          <a
            href="#services-gallery-heading"
            data-cursor="circle"
            data-cursor-label="Explore services"
            className="inline-flex min-h-9 shrink-0 items-center gap-3 transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black-bg sm:gap-6"
          >
            EXPLORE SERVICES <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
