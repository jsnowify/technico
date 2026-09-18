"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Button from "@/components/ui/Button";
import { SITE_PHONE_HREF } from "@/lib/constants";

/**
 * Offset and width are percentages of the drawing area. These are actual
 * horizontal bars (not CSS gradients, tiny vertical ticks, or canvas shards).
 */
const SIGNAL_BARS = [
  { offset: 23, width: 75 },
  { offset: 20, width: 77 },
  { offset: 17, width: 81 },
  { offset: 14, width: 84 },
  { offset: 11, width: 87 },
  { offset: 8, width: 90 },
  { offset: 5, width: 93 },
  { offset: 2, width: 96 },
  { offset: 0, width: 98 },
  { offset: 4, width: 94 },
  { offset: 8, width: 90 },
  { offset: 12, width: 86 },
  { offset: 16, width: 82 },
  { offset: 12, width: 86 },
  { offset: 8, width: 90 },
  { offset: 4, width: 94 },
  { offset: 0, width: 98 },
  { offset: 6, width: 92 },
  { offset: 12, width: 86 },
  { offset: 17, width: 80 },
] as const;

/**
 * Hovering collapses the bars nearest the cursor. A slower, dimmer duplicate
 * follows each collapse, leaving a brief horizontal afterimage (trail).
 * Nearby rows follow in a distance-based stagger; the original staggered
 * widths return when the pointer leaves. No scroll hijacking or idle loop.
 */
function CollapsingHorizontalSignal() {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const bars = Array.from(
      field.querySelectorAll<HTMLElement>("[data-signal-bar]"),
    );
    const echoes = Array.from(
      field.querySelectorAll<HTMLElement>("[data-signal-echo]"),
    );
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    let raf = 0;
    let nearestRow = 0;
    let pointerY = 0;

    const collapse = () => {
      raf = 0;
      const height = field.getBoundingClientRect().height;
      const rowPitch = height / bars.length;
      nearestRow = Math.max(
        0,
        Math.min(bars.length - 1, Math.floor(pointerY / rowPitch)),
      );

      // Strongest collapse beneath the cursor; adjacent rows taper away.
      const targetScale = (index: number) => {
        const distance = Math.abs(index + 0.5 - pointerY / rowPitch);
        const influence = Math.pow(Math.max(0, 1 - distance / 5.25), 1.5);
        return 1 - influence * 0.9;
      };

      gsap.to(bars, {
        scaleX: (index) => targetScale(index),
        duration: 0.3,
        stagger: { each: 0.012, from: nearestRow },
        ease: "power3.out",
        overwrite: "auto",
      });

      // The translucent full-width copy contracts later, creating a visible
      // trailing tail instead of simply sliding the whole bars upward.
      gsap.to(echoes, {
        scaleX: (index) => targetScale(index),
        duration: 0.72,
        stagger: { each: 0.018, from: nearestRow },
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = field.getBoundingClientRect();
      pointerY = Math.max(
        0,
        Math.min(rect.height - 0.01, event.clientY - rect.top),
      );
      if (!raf) raf = window.requestAnimationFrame(collapse);
    };

    const onLeave = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      gsap.to(bars, {
        scaleX: 1,
        duration: 0.48,
        stagger: { each: 0.016, from: nearestRow },
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(echoes, {
        scaleX: 1,
        duration: 0.85,
        stagger: { each: 0.022, from: nearestRow },
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    field.addEventListener("pointerenter", onMove);
    field.addEventListener("pointermove", onMove);
    field.addEventListener("pointerleave", onLeave);
    field.addEventListener("pointercancel", onLeave);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      field.removeEventListener("pointerenter", onMove);
      field.removeEventListener("pointermove", onMove);
      field.removeEventListener("pointerleave", onLeave);
      field.removeEventListener("pointercancel", onLeave);
      gsap.killTweensOf([...bars, ...echoes]);
      gsap.set([...bars, ...echoes], { clearProps: "transform" });
    };
  }, []);

  return (
    <div
      className="hero-reveal-signal relative w-full overflow-hidden"
      aria-hidden="true"
    >
      <div className="mb-3 font-mono text-[10px] tracking-[0.08em] text-white-text/45 uppercase sm:mb-4">
        / SIGNAL FIELD
      </div>

      <div
        ref={fieldRef}
        className="relative flex h-[clamp(110px,20svh,240px)] w-full touch-pan-y flex-col justify-between overflow-hidden py-3 sm:h-[clamp(160px,24svh,280px)] sm:py-4 lg:h-[clamp(240px,29vw,360px)] lg:py-5"
      >
        {SIGNAL_BARS.map((bar, index) => (
          <div
            key={index}
            className="relative h-[clamp(3px,0.42vw,5px)] shrink-0"
            style={{
              marginLeft: `${bar.offset}%`,
              width: `${bar.width}%`,
            }}
          >
            <span
              data-signal-echo
              className="absolute inset-0 block origin-left bg-white-text/30"
            />
            <span
              data-signal-bar
              className="absolute inset-0 block origin-left bg-white-text/90"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 h-px w-full bg-white-text/20 sm:mt-4 lg:mt-5" />
    </div>
  );
}

/**
 * Underlying black sheet. The homepage owns its stacking / scroll behavior;
 * this component adds no sticky element or scroll-triggered animation.
 */
export default function HeroReveal() {
  return (
    <section
      id="hero-reveal"
      aria-labelledby="hero-reveal-title"
      className="relative z-10 min-h-[100svh] bg-black-bg text-white-text"
    >
      <div className="hero-reveal-shell container-x mx-auto flex min-h-[100svh] w-full max-w-[1920px] flex-col pt-[clamp(84px,11svh,132px)] pb-[clamp(24px,4svh,56px)] lg:pt-[clamp(100px,13svh,152px)] lg:pb-[clamp(38px,6svh,72px)]">
        <div className="hero-reveal-meta grid grid-cols-2 gap-x-4 gap-y-3 border-b border-white-text/40 pb-3 font-mono text-[9px] leading-[1.2] uppercase sm:grid-cols-3 sm:gap-x-5 sm:pb-4 sm:text-xs">
          <span>TECHNICO_</span>
          <span className="sm:text-center">DIGITAL MARKETING AGENCY</span>
          <span className="col-span-2 text-right sm:col-span-1">
            PROFIT OVER TRAFFIC_
          </span>
        </div>

        <div className="hero-reveal-content grid flex-1 grid-cols-1 items-center gap-x-[clamp(24px,4vw,82px)] gap-y-6 pt-[clamp(24px,4svh,54px)] sm:gap-y-9 lg:grid-cols-[minmax(0,1.16fr)_minmax(0,0.84fr)] lg:gap-y-12 lg:pt-[clamp(42px,7svh,90px)]">
          <div className="min-w-0">
            <h2
              id="hero-reveal-title"
              className="h2-section max-w-[19ch] leading-[1.08] font-medium tracking-heading text-balance"
            >
              Digital Marketing Agency that prioritize your profit, not just
              traffic.
            </h2>

            <p className="hero-reveal-copy body-copy mt-4 max-w-[48ch] leading-[1.55] tracking-[-0.02em] text-content uppercase sm:mt-5 lg:mt-6 lg:max-w-[43ch]">
              Achieve business success through effective brand development.
              Explore new digital marketing opportunities with Technico Digital
              Solutions.
            </p>

            <div className="hero-reveal-actions mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 sm:mt-8 lg:mt-9 lg:gap-x-9">
              <Button to={SITE_PHONE_HREF} variant="purple-fill" size="md">
                BOOK A CALL
              </Button>
              <Button to="/contact" variant="underline" size="md">
                FREE STRATEGY
              </Button>
            </div>
          </div>

          <div className="hero-reveal-signal-column min-w-0 lg:self-center">
            <CollapsingHorizontalSignal />
          </div>
        </div>
      </div>
    </section>
  );
}
