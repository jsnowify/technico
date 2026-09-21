"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import ScrambleText from "@/components/motion/ScrambleText";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { isSiteReady, SITE_READY_EVENT } from "@/lib/site-ready";

const SIGNAL = [34, 62, 47, 78, 56, 92, 68, 100, 74, 52, 38] as const;

interface EditorialPageHeroProps {
  id: string;
  page: string;
  code: string;
  eyebrow: string;
  lines: readonly string[];
  compact?: boolean;
}

function EditorialSignal({ page }: { page: string }) {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field || prefersReducedMotion) return;

    const bars = Array.from(
      field.querySelectorAll<HTMLElement>("[data-editorial-signal-bar]"),
    );
    let frame = 0;

    const update = (event: PointerEvent) => {
      const bounds = field.getBoundingClientRect();
      const active = Math.max(
        0,
        Math.min(
          bars.length - 1,
          Math.floor(
            ((event.clientY - bounds.top) / bounds.height) * bars.length,
          ),
        ),
      );

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        bars.forEach((bar, index) => {
          const distance = Math.abs(index - active);
          const width = Math.max(SIGNAL[index], 100 - distance * 15);
          gsap.to(bar, {
            width: `${width}%`,
            left: index % 2 ? `${100 - width}%` : "0%",
            duration: 0.38,
            delay: distance * 0.018,
            ease: "power3.out",
            overwrite: true,
          });
        });
      });
    };

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      bars.forEach((bar, index) => {
        gsap.to(bar, {
          width: `${SIGNAL[index]}%`,
          left: index % 2 ? `${100 - SIGNAL[index]}%` : "0%",
          duration: 0.55,
          delay: index * 0.012,
          ease: "power3.inOut",
          overwrite: true,
        });
      });
    };

    field.addEventListener("pointermove", update);
    field.addEventListener("pointerenter", update);
    field.addEventListener("pointerleave", reset);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      field.removeEventListener("pointermove", update);
      field.removeEventListener("pointerenter", update);
      field.removeEventListener("pointerleave", reset);
      gsap.killTweensOf(bars);
    };
  }, []);

  return (
    <div aria-hidden="true" className="min-w-0">
      <div className="mb-3 flex items-center justify-between border-b border-black-bg/40 pb-3 font-mono text-[9px] tracking-[0.06em] uppercase sm:text-[10px]">
        <span>/ {page} signal</span>
        <span className="opacity-55">Trace / interact</span>
      </div>
      <div
        ref={fieldRef}
        className="flex h-24 touch-pan-y cursor-crosshair flex-col justify-between overflow-hidden py-1 sm:h-32 lg:h-[clamp(190px,24svh,280px)]"
      >
        {SIGNAL.map((width, index) => (
          <div
            key={index}
            className="relative h-[clamp(3px,0.48vw,6px)] w-full"
          >
            <span
              data-editorial-signal-bar
              data-editorial-entrance
              className="absolute top-0 block h-full bg-black-bg"
              style={{
                width: `${width}%`,
                left: index % 2 ? `${100 - width}%` : "0%",
              }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-black-bg/40 pt-3 font-mono text-[9px] tracking-[0.06em] uppercase sm:text-[10px]">
        01 / 02 / Editorial stage
      </div>
    </div>
  );
}

export default function EditorialPageHero({
  id,
  page,
  code,
  eyebrow,
  lines,
  compact = false,
}: EditorialPageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const section = sectionRef.current;
      if (!section || prefersReducedMotion) return;
      const mobile = window.matchMedia(
        "(max-width: 767px), (pointer: coarse)",
      ).matches;

      const words = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-editorial-word]"),
      );
      const secondary = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-editorial-reveal]"),
      );
      const bars = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-editorial-entrance]"),
      );

      gsap.set(words, { autoAlpha: 0, yPercent: 112 });
      gsap.set(secondary, { autoAlpha: 0, y: 18 });
      gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });

      let timeline: gsap.core.Timeline | null = null;
      // Defer safely: the page owns its timeline, not the preloader.
      const runReveal = () => {
        if (timeline) return;
        timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
        timeline
          .to(words, {
            autoAlpha: 1,
            yPercent: 0,
            duration: mobile ? 0.48 : 0.9,
            stagger: mobile ? 0.04 : 0.095,
            ease: "power4.out",
          })
          .to(
            bars,
            {
              scaleX: 1,
              duration: mobile ? 0.34 : 0.64,
              stagger: { each: 0.028, from: "center" },
            },
            0.22,
          )
          .to(
            secondary,
            {
              autoAlpha: 1,
              y: 0,
              duration: mobile ? 0.32 : 0.55,
              stagger: mobile ? 0.02 : 0.05,
            },
            0.34,
          )
          .set([...words, ...bars, ...secondary], {
            clearProps: "opacity,visibility,transform,transformOrigin",
          });
      };
      const reveal = contextSafe?.(runReveal) ?? runReveal;

      if (isSiteReady()) reveal();
      else window.addEventListener(SITE_READY_EVENT, reveal, { once: true });

      return () => {
        window.removeEventListener(SITE_READY_EVENT, reveal);
        timeline?.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative isolate flex h-full min-h-svh flex-col overflow-hidden bg-purple-hero text-black-bg"
    >
      <div className="container-x mx-auto flex w-full max-w-[1920px] flex-1 flex-col pt-[clamp(104px,14svh,154px)] pb-[clamp(28px,5svh,60px)]">
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
            text={`2026 / ${page}`}
            trigger="inview-repeat"
            repeatEvery={5}
            waitForSiteReady
          />
          <ScrambleText
            text={code}
            trigger="inview-repeat"
            repeatEvery={5}
            waitForSiteReady
            className="text-right"
          />
        </div>

        <div
          className={`grid min-w-0 flex-1 items-end gap-x-[clamp(28px,5vw,96px)] gap-y-7 pt-[clamp(34px,7svh,92px)] lg:pb-[clamp(12px,3svh,38px)] ${
            compact
              ? "lg:grid-cols-[minmax(0,1.42fr)_minmax(210px,0.58fr)]"
              : "lg:grid-cols-[minmax(0,1.3fr)_minmax(230px,0.7fr)]"
          }`}
        >
          <div className="min-w-0 self-end">
            <p
              data-editorial-reveal
              className="mb-[clamp(20px,4svh,44px)] flex items-center gap-3 font-mono text-[10px] tracking-wider uppercase sm:text-xs"
            >
              <span aria-hidden="true" className="h-1.75 w-1.75 bg-black-bg" />/{" "}
              {eyebrow}
            </p>
            <h1
              id={`${id}-title`}
              className="min-w-0 font-bold uppercase"
              style={{
                fontSize: compact
                  ? "clamp(2rem, 6.55vw, 7.1rem)"
                  : "clamp(3.6rem, 11.5vw, 11.5rem)",
                letterSpacing: "-0.085em",
                lineHeight: 0.89,
              }}
            >
              {lines.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.1em]">
                  <span data-editorial-word className="block">
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <div data-editorial-reveal className="min-w-0 lg:pb-2">
            <EditorialSignal page={page} />
          </div>
        </div>

        <div
          data-editorial-reveal
          className="mt-6 flex items-center justify-between gap-5 border-t border-black-bg/40 pt-4 font-mono text-[10px] tracking-[0.04em] uppercase sm:text-xs"
        >
          <span>TECHNICO / {page}</span>
          <span>Stage 01 / 02</span>
        </div>
      </div>
    </section>
  );
}
