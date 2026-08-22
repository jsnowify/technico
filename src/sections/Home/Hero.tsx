import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

import {
  useVisitorLocation,
  toDegreesMinutes,
  continentName,
} from "../../hooks/useVisitorLocation";

import RevealText from "../../components/motion/TextReveal";
import ScrollRevealWords from "../../components/motion/ScrollRevealWords";
import ScrambleText from "../../components/motion/ScrambleText";
import { Blink, StatusDot } from "../../components/motion/Blink";
import ReactiveGrid from "../../components/effects/ReactiveGrid";
import TiltCard from "../../components/ui/TiltCard";

const STATS = [
  { value: "2.5k+", label: "Happy Clients" },
  { value: "100+", label: "Projects Completed" },
  { value: "5+", label: "Years of Experience" },
] as const;

function CornerBrackets() {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute left-3 top-3 h-3 w-3 border-l border-t border-[var(--color-accent)]/70"
        style={{ transform: "translateZ(6px)" }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[var(--color-accent)]/70"
        style={{ transform: "translateZ(6px)" }}
      />
    </>
  );
}

/**
 * Home's hero — three stacked sections (intro headline, "02 / System"
 * readout, "03 / Metrics" stats) in plain normal document flow.
 *
 * The opening headline stays on RevealText's page-enter animation
 * (it's visible on load, not something the user "scrolls into"). The
 * System and Metrics sections below are scroll-triggered readouts, so
 * that's where <ScrambleText>/<Blink> are applied — metadata, the
 * coordinate/signal readout, and stat numbers resolve/flicker slowly
 * as the user scrolls through.
 *
 * Watermark parallax uses scrub: 1.3 (was 0.8) — more lag/inertia
 * behind actual scroll position, reading as weighted rather than
 * tightly tracking the scrollbar.
 */
export default function Hero() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  const { location, isFallback } = useVisitorLocation();

  /* ============================================================
     ORBIT ANIMATION (System)
     ============================================================ */
  useGSAP(
    () => {
      if (!orbitRef.current) return;

      const orbit = orbitRef.current.querySelector("[data-orbit]");
      const satellite = orbitRef.current.querySelector("[data-satellite]");

      if (!orbit || !satellite) return;

      gsap.to(orbit, {
        rotation: 360,
        duration: 45,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(satellite, {
        rotation: -360,
        duration: 45,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
    },
    { scope: orbitRef },
  );

  /* ============================================================
     BACKGROUND WATERMARK PARALLAX (System)
     ============================================================ */
  useGSAP(
    () => {
      const watermark = watermarkRef.current;
      if (!watermark || prefersReducedMotion) return;

      gsap.fromTo(
        watermark,
        { xPercent: -4, opacity: 0.4 },
        {
          xPercent: 4,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: watermark,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.3,
          },
        },
      );
    },
    { scope: watermarkRef },
  );

  return (
    <div className="bg-black">
      {/* ==========================================================
          HERO INTRO
          ========================================================== */}
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <ReactiveGrid className="z-0 text-white" opacity={0.2} shipCount={2} />

        <div className="relative z-10 px-6 pb-24 pt-24 md:px-10 md:pb-28 md:pt-28 lg:px-12 lg:pb-32 lg:pt-32">
          <div className="w-full">
            <RevealText
              as="p"
              className="mb-8 font-mono text-xs uppercase tracking-[0.2em] text-[#6D28D9]"
            >
              Technico Solutions Inc.
            </RevealText>

            <RevealText
              as="h1"
              className="max-w-[1200px] text-[3.5rem] font-bold uppercase leading-[0.82] tracking-[-0.055em] sm:text-6xl md:text-8xl lg:text-[8rem] xl:text-[9rem]"
              lines={[
                "Digital Marketing Agency",
                "That Prioritizes Your Profit,",
                "Not Just Traffic.",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ==========================================================
          02 / SYSTEM
          ========================================================== */}
      <section className="relative min-h-screen overflow-hidden bg-[#d9d9d9] text-black">
        <ReactiveGrid
          className="z-0 text-black"
          opacity={0.18}
          scrollReactive
          shipCount={1}
        />

        <div className="absolute left-0 right-0 top-0 z-20 border-b border-black/20">
          <div className="flex items-center justify-between px-6 py-5 font-mono text-[9px] uppercase tracking-[0.15em] md:px-10 lg:px-12">
            <ScrambleText as="span" variant="micro">
              02 / System
            </ScrambleText>
            <span className="hidden md:block">
              <ScrambleText as="span" variant="micro">
                Technico Digital Solutions
              </ScrambleText>
            </span>
            <Blink as="span">
              <ScrambleText as="span" variant="micro">
                02.001
              </ScrambleText>
            </Blink>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[18%] z-[1] overflow-hidden"
        >
          <div
            ref={watermarkRef}
            className="whitespace-nowrap text-[18vw] font-bold uppercase leading-none tracking-[-0.08em] text-black/[0.045]"
          >
            TECHNICO
          </div>
        </div>

        <div
          ref={orbitRef}
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] top-[18%] z-[2] hidden h-[320px] w-[320px] md:block lg:h-[420px] lg:w-[420px]"
        >
          <svg viewBox="0 0 500 500" className="h-full w-full" fill="none">
            <g data-orbit>
              <circle
                cx="250"
                cy="250"
                r="205"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 8"
                className="text-black/30"
              />
              <circle
                cx="250"
                cy="250"
                r="145"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="1 6"
                className="text-black/20"
              />
              <ellipse
                cx="250"
                cy="250"
                rx="205"
                ry="75"
                transform="rotate(-25 250 250)"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="3 9"
                className="text-black/25"
              />
            </g>

            <g data-satellite>
              <circle
                cx="414"
                cy="177"
                r="4"
                fill="currentColor"
                className="text-[#6D28D9]"
              />
              <circle
                cx="414"
                cy="177"
                r="11"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 4"
                className="text-black/30"
              />
            </g>

            <line
              x1="250"
              y1="25"
              x2="250"
              y2="475"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 9"
              className="text-black/15"
            />

            <line
              x1="25"
              y1="250"
              x2="475"
              y2="250"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 9"
              className="text-black/15"
            />

            <circle
              cx="250"
              cy="250"
              r="7"
              fill="currentColor"
              className="text-black"
            />

            <circle
              cx="250"
              cy="250"
              r="18"
              stroke="currentColor"
              strokeWidth="1"
              className="text-black/40"
            />

            <path
              d="
                M226 226h-18v18
                M274 226h18v18
                M226 274h-18v-18
                M274 274h18v-18
              "
              stroke="currentColor"
              strokeWidth="1"
              className="text-black/50"
            />
          </svg>
        </div>

        <div className="relative z-10 flex min-h-screen items-end px-6 pb-16 pt-32 md:px-10 md:pb-20 lg:px-12">
          <div className="grid w-full gap-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-3">
              <div className="border-t border-black/30 pt-4">
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em]">
                  <ScrambleText as="span" variant="micro">
                    Mission
                  </ScrambleText>
                  <ScrambleText as="span" variant="micro">
                    02
                  </ScrambleText>
                </div>

                <div className="mt-12">
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-black/50">
                    <ScrambleText as="span" variant="micro">
                      Coordinates
                    </ScrambleText>
                  </span>

                  <p className="mt-2 font-mono text-[10px] uppercase leading-[1.5]">
                    {toDegreesMinutes(location.latitude, "N", "S")} /{" "}
                    {toDegreesMinutes(location.longitude, "E", "W")}
                    <br />
                    {location.countryCode} /{" "}
                    {continentName(location.continentCode)}
                    <br />
                    {isFallback ? "DIGITAL SYSTEM" : "VISITOR LOCATED"}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 lg:col-start-5">
              <div className="border-t border-black pt-5">
                <div className="mb-10 flex items-start justify-between font-mono text-[9px] uppercase tracking-[0.14em]">
                  <ScrambleText as="span" variant="micro">
                    Objective
                  </ScrambleText>

                  <span className="text-right text-black/50">
                    <ScrambleText as="span" variant="micro">
                      Growth
                    </ScrambleText>
                    <br />
                    <ScrambleText as="span" variant="micro">
                      Visibility
                    </ScrambleText>
                    <br />
                    <ScrambleText as="span" variant="micro">
                      Performance
                    </ScrambleText>
                  </span>
                </div>

                <ScrollRevealWords
                  as="p"
                  className="max-w-2xl font-mono text-base uppercase leading-[1.3] tracking-[0.025em] sm:text-lg md:text-xl"
                  start="top 90%"
                  end="top 40%"
                >
                  Achieve Business Success Through Effective Brand Development
                  Explore new digital marketing opportunities with Technico
                  Digital Solutions.
                </ScrollRevealWords>
              </div>
            </div>

            <div className="hidden lg:col-span-2 lg:col-start-11 lg:block">
              <div className="border-t border-black/30 pt-4">
                <div className="font-mono text-[9px] uppercase tracking-[0.12em]">
                  <div className="flex justify-between">
                    <ScrambleText as="span" variant="micro">
                      Signal
                    </ScrambleText>
                    <ScrambleText as="span" variant="micro">
                      100%
                    </ScrambleText>
                  </div>

                  <div className="mt-3 h-px w-full bg-black/30">
                    <div className="h-px w-full bg-black" />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <ScrambleText as="span" variant="micro">
                      Status
                    </ScrambleText>
                    <span className="inline-flex items-center gap-1.5">
                      <StatusDot />
                      <ScrambleText as="span" variant="micro">
                        Active
                      </ScrambleText>
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <ScrambleText as="span" variant="micro">
                      System
                    </ScrambleText>
                    <span className="inline-flex items-center gap-1.5">
                      <StatusDot />
                      <ScrambleText as="span" variant="micro">
                        Online
                      </ScrambleText>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-black/20">
          <div className="flex items-center justify-between px-6 py-4 font-mono text-[8px] uppercase tracking-[0.15em] text-black/50 md:px-10 lg:px-12">
            <ScrambleText as="span" variant="micro">
              Technico / 2026
            </ScrambleText>
            <span className="hidden sm:block">
              <ScrambleText as="span" variant="micro">
                Digital Infrastructure
              </ScrambleText>
            </span>
            <ScrambleText as="span" variant="micro">
              System 001
            </ScrambleText>
          </div>
        </div>
      </section>

      {/* ==========================================================
          03 / METRICS
          ========================================================== */}
      <section className="relative overflow-hidden bg-black px-6 py-20 text-white md:px-10 md:py-28 lg:px-12">
        <ReactiveGrid className="z-0 text-white" opacity={0.1} />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-14 flex items-center justify-between border-t border-white/15 pt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-white/50">
            <ScrambleText as="span" variant="micro">
              03 / Metrics
            </ScrambleText>
            <span className="hidden md:block">
              <ScrambleText as="span" variant="micro">
                Track Record
              </ScrambleText>
            </span>
            <Blink as="span">
              <ScrambleText as="span" variant="micro">
                03.001
              </ScrambleText>
            </Blink>
          </div>

          <div className="grid gap-px overflow-hidden bg-white/10 sm:grid-cols-3">
            {STATS.map((stat) => (
              <TiltCard key={stat.label} className="bg-black">
                <div
                  className="flex h-full flex-col justify-between p-8 md:p-10"
                  style={{ minHeight: 200 }}
                >
                  <ScrambleText
                    as="span"
                    variant="micro"
                    start="top 92%"
                    className="font-mono text-5xl font-bold uppercase leading-none tracking-[-0.03em] text-white md:text-6xl"
                  >
                    {stat.value}
                  </ScrambleText>

                  <span className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                    <ScrambleText as="span" variant="micro">
                      {stat.label}
                    </ScrambleText>
                  </span>
                </div>

                <CornerBrackets />
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
