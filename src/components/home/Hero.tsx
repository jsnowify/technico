"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { isSiteReady, SITE_READY_EVENT } from "@/lib/site-ready";
import ScrambleText from "@/components/motion/ScrambleText";

/**
 * Two moving, stepped waveforms, based on the supplied motion reference.
 *
 * Each waveform is made of several THICK, stacked horizontal blocks of
 * different widths. Together they form visible crests and descending steps;
 * they are not six lanes of isolated, hairline strokes.
 *
 * Coordinates use percentages of ONE full-width pattern. Two identical
 * patterns sit side-by-side, so moving the 200%-wide track by exactly 50%
 * produces a seamless loop without a jump at the edge of the screen.
 */
type Step = readonly [left: number, width: number, level: number];

type Wave = {
  top: string;
  height: string;
  duration: number;
  steps: readonly Step[];
};

const WAVES: readonly Wave[] = [
  {
    top: "0%",
    height: "46%",
    duration: 19,
    steps: [
      // Broken baseline: leave breathing room between the crests.
      [0, 18, 0],
      [20, 30, 0],
      [53, 15, 0],
      [71, 29, 0],
      // First wide, terraced peak. Each higher step is shorter.
      [14, 37, 1],
      [19, 29, 2],
      [24, 22, 3],
      [29, 14, 4],
      [33, 7, 5],
      // Second peak flows back down into the following baseline.
      [61, 36, 1],
      [65, 29, 2],
      [70, 21, 3],
      [74, 13, 4],
      [78, 6, 5],
    ],
  },
  {
    top: "60%",
    height: "40%",
    duration: 24,
    steps: [
      // A quieter second wave, like the lower register in the reference.
      [0, 23, 0],
      [29, 43, 0],
      [78, 22, 0],
      [13, 25, 1],
      [19, 17, 2],
      [24, 9, 3],
      [43, 27, 1],
      [49, 18, 2],
      [54, 9, 3],
      [79, 18, 1],
      [83, 12, 2],
      [86, 6, 3],
    ],
  },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const exploreRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      // Reduced motion: show the completed composition without animating it.
      if (prefersReducedMotion) return;

      const motion = motionRef.current;
      if (!motion) return;

      const steps = gsap.utils.toArray<HTMLElement>(
        motion.querySelectorAll("[data-wave-step]"),
      );
      const tracks = gsap.utils.toArray<HTMLElement>(
        motion.querySelectorAll("[data-wave-track]"),
      );
      const metaItems = metaRef.current?.children;
      const title = titleRef.current;
      const explore = exploreRef.current;

      let entrance: gsap.core.Timeline | undefined;
      const loops: gsap.core.Tween[] = [];

      gsap.set(steps, { autoAlpha: 0 });
      if (metaItems) gsap.set(metaItems, { autoAlpha: 0, y: 14 });
      if (title) gsap.set(title, { autoAlpha: 0, y: 34 });
      if (explore) gsap.set(explore, { autoAlpha: 0, y: 16 });

      const startWaveMotion = () => {
        tracks.forEach((track, index) => {
          loops.push(
            gsap.fromTo(
              track,
              { xPercent: 0 },
              {
                xPercent: -50,
                duration: WAVES[index].duration,
                ease: "none",
                repeat: -1,
              },
            ),
          );
        });
      };

      const playEntrance = () => {
        if (entrance) return;

        entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
        entrance
          .to(steps, {
            autoAlpha: 1,
            duration: 0.65,
            stagger: { each: 0.018, from: "center" },
          })
          .to(
            metaItems ?? [],
            { autoAlpha: 1, y: 0, stagger: 0.045, duration: 0.5 },
            0.12,
          )
          .to(title, { autoAlpha: 1, y: 0, duration: 0.72 }, 0.32)
          .to(explore, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.48)
          .call(startWaveMotion, [], 0.38)
          .set(steps, { clearProps: "opacity,visibility" })
          .set([...(metaItems ? Array.from(metaItems) : []), title, explore], {
            clearProps: "transform,opacity,visibility",
          });
      };

      // Preserve your preloader's existing timing and site-ready event.
      if (isSiteReady()) {
        playEntrance();
      } else {
        window.addEventListener(SITE_READY_EVENT, playEntrance, { once: true });
      }

      return () => {
        window.removeEventListener(SITE_READY_EVENT, playEntrance);
        loops.forEach((loop) => loop.kill());
        entrance?.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Technico Digital Solutions"
      className="relative isolate overflow-hidden bg-purple-hero text-black-bg"
      style={{
        backgroundColor: "var(--color-purple-hero, #a78bfa)",
        color: "var(--color-black-bg, #080808)",
      }}
    >
      <div className="container-x mx-auto flex min-h-[100svh] w-full max-w-[1920px] flex-col pt-[clamp(96px,13svh,138px)] pb-[clamp(18px,3svh,36px)]">
        <div className="mt-auto min-w-0 pt-[clamp(8px,2svh,20px)]">
          <div
            ref={metaRef}
            className="mb-[clamp(10px,1.5svh,16px)] grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[10px] leading-none tracking-[-0.02em] uppercase sm:grid-cols-4 sm:text-xs"
          >
            <ScrambleText
              text="TECHNICO_"
              trigger="inview-repeat"
              repeatEvery={5}
              waitForSiteReady
            />
            <ScrambleText
              text="BUILT FOR GROWTH"
              trigger="inview-repeat"
              repeatEvery={5}
              waitForSiteReady
            />
            <ScrambleText
              text="2026 / HOME"
              trigger="inview-repeat"
              repeatEvery={5}
              waitForSiteReady
            />
            <ScrambleText
              text="DIGITAL SOLUTIONS_"
              trigger="inview-repeat"
              repeatEvery={5}
              waitForSiteReady
              className="sm:text-right"
            />
          </div>

          {/* Two layered, black stepped waveforms instead of isolated lines. */}
          <div
            ref={motionRef}
            aria-hidden="true"
            className="relative min-w-0 overflow-hidden"
            style={{ height: "clamp(82px, calc(60svh - 115px), 360px)" }}
          >
            {WAVES.map((wave, waveIndex) => (
              <div
                key={waveIndex}
                className="absolute inset-x-0"
                style={{ top: wave.top, height: wave.height }}
              >
                <div
                  data-wave-track
                  className="relative flex h-full w-[200%] will-change-transform"
                >
                  {[0, 1].map((copy) => (
                    <div key={copy} className="relative h-full w-1/2 shrink-0">
                      {wave.steps.map(([left, width, level], stepIndex) => (
                        <span
                          key={stepIndex}
                          data-wave-step
                          className="absolute block bg-black-bg"
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            // Layering progressively shorter strips makes a
                            // crest/valley silhouette instead of thin lines.
                            top: `${85 - level * 14}%`,
                            height: "clamp(3px, 0.85svh, 9px)",
                            backgroundColor: "var(--color-black-bg, #080808)",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-[clamp(12px,1.8svh,18px)] flex min-w-0 flex-col items-start gap-2 sm:gap-3 lg:flex-row lg:items-end lg:justify-between">
            <h1
              ref={titleRef}
              className="min-w-0 max-w-full whitespace-nowrap font-bold uppercase"
              style={{
                fontSize: "clamp(2.125rem, min(14.8vw, 21svh), 14rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.085em",
              }}
            >
              TECHNICO_
            </h1>
            <a
              ref={exploreRef}
              href="#services"
              data-cursor="highlight"
              className="inline-flex min-h-8 shrink-0 items-center gap-3 self-end font-mono text-[10px] font-medium tracking-[0.03em] uppercase transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black-bg sm:gap-6 sm:text-xs lg:mb-2"
            >
              <span className="hidden sm:inline">/</span>
              EXPLORE <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
