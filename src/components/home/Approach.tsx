"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { APPROACH_STEPS } from "@/lib/constants";
import Button from "@/components/ui/Button";

/* ================================================================
   Landscape notch clip-path + placeholder image, copied verbatim
   from QuestionsAnswers.tsx so the rectangle under Approach's header
   matches it exactly.
   ================================================================ */

const LANDSCAPE_CLIP_PATH =
  "M1,0.89726 C1,0.954003 0.988628,1 0.974598,1 H0.025402 C0.011373,1 0,0.954003 0,0.89726 V0.424658 C0,0.367914 0.011373,0.321918 0.025402,0.321918 H0.054191 C0.068221,0.321918 0.079594,0.27592 0.079594,0.219178 V0.10274 C0.079594,0.045998 0.090966,0 0.104996,0 H0.974598 C0.988628,0 1,0.045998 1,0.10274 V0.89726 Z";

/* Temporary placeholder image */
const PLACEHOLDER_IMG =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg";

/* Placeholder photo for the three "how our experts do it" cards */
const EXPERT_CARD_IMG =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788935799/temporary-placeholder/Gemini_Generated_Image_3nu4uo3nu4uo3nu4_o2cn3b.jpg";

/* ================================================================
   APPROACH (seventh section)
   ================================================================
   Black section, three stacked blocks:

   1. Eyebrow + headline + paragraph, laid out as the same row as
      QuestionsAnswers.tsx / Services.tsx (eyebrow left, headline in
      its own centered column, paragraph right on `lg:`), followed by
      the landscape notch-clipped image + floating circle, copied
      directly from QuestionsAnswers.tsx's clipped-image treatment.
   2. A secondary "How Our Digital Marketing Experts Do It?" block —
      its own smaller centered heading, then a left-aligned intro
      paragraph, then the three proof points as an icon-led grid
      (1 column on mobile, 3 across from `sm:`) instead of a bulleted
      list — each point gets its own small square icon badge (square
      to match the eyebrow marker's motif, not a circle) whose glyph
      encodes what that point is actually about (target = qualified
      leads, overlapping squares = combined channels, ascending bars =
      performance tracking), then a final centered closing paragraph.
      Copy throughout is verbatim from the brief; only the "seo" ->
      "SEO" casing was normalized to match how the acronym is written
      everywhere else on the site (e.g. Services.tsx).
   3. The Step 1–4 panel: a left column of big "STEP N" rows, each its
      own click target with an underline and an arrow (straight when
      active, diagonal otherwise), and a right column showing the
      active step's title + description. Text-only — no per-step
      images, no CTA button.
   ================================================================ */

export default function Approach() {
  const clipId = useId();
  const [activeStep, setActiveStep] = useState(0);
  const current = APPROACH_STEPS[activeStep];
  const detailRef = useRef<HTMLDivElement>(null);

  /* Accordion-style "wipe" reveal on the detail panel every time the
     active step changes — a hard-edge clip-path sweep (like
     RevealUp's scroll entrance) instead of a plain opacity fade, so
     swapping steps reads as content actually opening up rather than
     just crossfading in place.
     Desktop hover-preview only — the mobile accordion below has its
     own independent open/closed state (openMobileStep), since it
     needs a "nothing open" state that the desktop preview doesn't. */
  useGSAP(
    () => {
      const el = detailRef.current;
      if (!el) return;

      if (prefersReducedMotion) {
        gsap.set(el, { clipPath: "inset(0% 0 0 0)", opacity: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        el,
        { clipPath: "inset(0 0 100% 0)", opacity: 0, y: 10 },
        {
          clipPath: "inset(0 0 0% 0)",
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power3.out",
        },
      );
    },
    { dependencies: [activeStep], scope: detailRef },
  );

  // Mobile accordion: independent from the desktop hover-preview
  // above — starts fully collapsed, and tapping the open item closes
  // it again (null), which the hover model has no equivalent for.
  const [openMobileStep, setOpenMobileStep] = useState<number | null>(null);

  return (
    <section className="bg-black-bg">
      <div className="px-6 pt-20 sm:px-8 sm:pt-24 md:px-12 md:pt-28 lg:px-[90px]">
        {/* ==========================================================
            HEADER — eyebrow / headline / paragraph, same row layout
            as QuestionsAnswers.tsx / Services.tsx: stacked on mobile,
            side-by-side (eyebrow left, headline centered in its own
            column, paragraph right) from lg up.
           ========================================================== */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 lg:shrink-0 lg:pt-2">
            <span className="font-mono text-xs tracking-[0.16em] whitespace-nowrap text-white/85 uppercase sm:text-sm">
              [ ] Proven Approach
            </span>
          </div>

          {/* Headline */}
          <h2 className="indent-8 text-center text-[32px] leading-[1.15] font-medium tracking-heading text-white sm:indent-10 sm:text-[40px] md:indent-12 md:text-[44px] lg:w-[700px] lg:shrink-0">
            Technico Digital Solutions Will Propel Your Business Forward.
          </h2>

          {/* Paragraph */}
          <p className="max-w-70 text-[18px] leading-relaxed font-light tracking-body text-white/50 text-pretty capitalize lg:shrink-0 lg:pt-1">
            We give you a tailored digital marketing strategy to boost
            appointments, optimize ad performance, enhance SEO efforts, and
            streamline client management for maximum growth and profitability.
          </p>
        </div>

        {/* ==========================================================
            LANDSCAPE IMAGE + NOTCH CIRCLE — copied from
            QuestionsAnswers.tsx's clipped image treatment.
           ========================================================== */}

        <svg aria-hidden="true" className="absolute h-0 w-0">
          <defs>
            <clipPath id={clipId} clipPathUnits="objectBoundingBox">
              <path d={LANDSCAPE_CLIP_PATH} />
            </clipPath>
          </defs>
        </svg>

        <div className="relative mt-16 w-full sm:mt-20">
          {/* Clipped image */}
          <div
            className="relative aspect-[1181/292] w-full overflow-hidden"
            style={{
              clipPath: `url(#${clipId})`,
            }}
          >
            <Image
              src={PLACEHOLDER_IMG}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>

          {/* Floating notch circle */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              top-0
              left-0
              z-20

              h-14
              w-14

              rounded-full
              bg-white

              md:h-16
              md:w-16
            "
          />
        </div>

        {/* How our experts do it — header row: left-aligned two-line
            heading, paragraph on the right, same row pattern as the
            eyebrow/headline/paragraph block above (minus the
            eyebrow). */}
        <div className="mt-16 flex flex-col gap-6 sm:mt-20 md:mt-24 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <h3 className="indent-8 max-w-sm text-[32px] leading-[1.1] font-medium tracking-heading text-white sm:indent-10 sm:text-[40px] md:indent-12 md:text-[44px] lg:shrink-0">
            How Our Digital Marketing Experts Do It
          </h3>

          <p className="max-w-sm text-[18px] leading-relaxed font-light tracking-body text-white/60 text-pretty capitalize lg:shrink-0 lg:pt-1">
            Technico&rsquo;s SEO strategists do so by implementing online
            marketing strategies because we believe that even the best products
            shine brighter in the spotlight.
          </p>
        </div>

        {/* Three columns: a rounded photo, then a dark card below it
            with a large faint index number and the point's copy. */}
        <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 sm:grid-cols-3 sm:gap-6">
          {[
            {
              text: "Data-driven campaigns attract qualified leads and convert them into paying clients.",
            },
            {
              text: "Combining SEO, paid advertising, social media, and email marketing into a coordinated strategy.",
            },
            {
              text: "Every campaign is backed by audience research, competitor analysis, and performance tracking, so your budget targets the people most likely to book, buy, or call.",
            },
          ].map((point, i) => (
            <div key={point.text} className="flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image
                  src={EXPERT_CARD_IMG}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-4 flex min-h-52 flex-1 flex-col justify-between rounded-3xl bg-white/[0.04] p-6">
                <span className="self-end text-6xl leading-none font-medium tracking-tight text-white/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[18px] leading-relaxed font-light tracking-body text-white text-pretty">
                  {point.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 indent-8 text-justify text-[18px] leading-relaxed font-light tracking-body text-white/50 text-pretty sm:mt-12">
          If you need more inbound leads, stronger local visibility, or a higher
          return on ad spend, let our digital marketing experts identify the
          highest-impact channels for your market and execute with precision. No
          guesswork here, just a clear strategy, consistent execution, and
          measurable results.
        </p>
      </div>

      {/* Step 1–4 panel.
          Desktop (`md:` and up): left column of big "STEP N" rows,
          each its own hover target, underlined, with a straight
          arrow on the active row and a diagonal arrow on the rest;
          right column shows the active step's title + description +
          CTA, swapped on hover.
          Mobile: a plain accordion instead — tap a step to expand
          its title/description/CTA directly underneath it, tap again
          (or a different step) to switch. No hover state exists on
          touch, so the two need genuinely different interaction
          models, not just a reflowed grid. */}
      <div className="px-6 pt-16 pb-20 sm:px-8 sm:pt-20 sm:pb-24 md:px-12 md:pt-24 md:pb-28 lg:px-[90px]">
        {/* Mobile accordion */}
        <div className="flex flex-col md:hidden">
          {APPROACH_STEPS.map((step, i) => {
            const isOpen = openMobileStep === i;

            return (
              <div key={step.step} className="border-b border-white/15">
                <button
                  type="button"
                  onClick={() => setOpenMobileStep(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                >
                  <span
                    className={`text-[40px] leading-none font-normal tracking-tight uppercase transition-colors duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                      isOpen ? "text-white" : "text-white/55"
                    }`}
                  >
                    {step.step}
                  </span>

                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center border border-white/20 transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>

                {/* Layout-safe expand/collapse — same grid-template-rows
                    technique used by FAQ.tsx / QuestionsAnswers.tsx. */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-6">
                      <h4 className="min-h-[1lh] text-[24px] leading-snug font-medium tracking-heading text-white">
                        {step.title}
                      </h4>
                      <p className="mt-3 text-[18px] leading-relaxed font-light tracking-body text-white/55 text-pretty">
                        {step.description}
                      </p>
                      <div className="mt-6">
                        <Button to="/contact" variant="purple">
                          Get Started
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop hover-preview */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-16">
          {/* Steps list */}
          <div className="flex flex-col gap-8 sm:gap-10">
            {APPROACH_STEPS.map((step, i) => {
              const isActive = activeStep === i;

              return (
                <button
                  key={step.step}
                  type="button"
                  onMouseEnter={() => setActiveStep(i)}
                  onFocus={() => setActiveStep(i)}
                  onClick={() => setActiveStep(i)}
                  aria-pressed={isActive}
                  className="group text-left"
                >
                  <span className="flex items-center justify-between gap-4">
                    <span
                      className={`text-[92px] leading-none font-normal tracking-tight uppercase transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                        isActive
                          ? "translate-x-3 text-white"
                          : "translate-x-0 text-white/55 group-hover:text-white/80"
                      }`}
                    >
                      {step.step}
                    </span>

                    {/* Same arrow throughout — it physically rotates
                        from a diagonal "external" tilt to pointing
                        straight right as the row becomes active, so
                        the change reads as motion, not a swap. */}
                    <span
                      className={`shrink-0 transition-colors duration-300 ease-[cubic-bezier(0.77,0,0.175,1)] ${
                        isActive
                          ? "text-white"
                          : "text-white/40 group-hover:text-white/70"
                      }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`h-6 w-6 origin-center transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] sm:h-7 sm:w-7 ${
                          isActive ? "rotate-0" : "-rotate-45"
                        }`}
                      >
                        <path
                          d="M4 12H20M20 12L14 6M20 12L14 18"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </span>

                  <span className="mt-4 block h-px w-full bg-white/20" />
                </button>
              );
            })}
          </div>

          {/* Active step detail — fades/drifts in on every step change */}
          <div ref={detailRef}>
            <h4 className="min-h-[1lh] text-[24px] leading-snug font-medium tracking-heading text-white">
              {current.title}
            </h4>
            <p className="mt-3 min-h-[7lh] max-w-md text-[18px] leading-relaxed font-light tracking-body text-white/55 text-pretty">
              {current.description}
            </p>

            <div className="mt-6">
              <Button to="/contact" variant="purple">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
