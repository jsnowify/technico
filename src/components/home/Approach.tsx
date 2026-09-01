"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { APPROACH_STEPS, SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   APPROACH (seventh section)
   ================================================================
   Black section, three stacked blocks:

   1. Standard eyebrow + headline + subcopy (same pattern as
      Strategy.tsx / QuestionsAnswers.tsx).
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
   3. The interactive Step 1–4 panel. Below `md:` the tabbed switcher
      is dropped entirely — it doesn't work as a click target on
      mobile — and instead all four steps render as full stacked
      cards (image, title, description, button, in that order), one
      after another, revealed by ordinary vertical page scroll rather
      than a tab click. At `md:` and up this stacked list is hidden
      and the original bordered box with a four-tab row (divide-x so
      there's exactly one hairline between tabs, no doubled borders)
      and a single content panel that swaps text + image on click
      takes over. The title and description in that desktop panel
      reserve `min-h-[3lh]` / `min-h-[10lh]` (3 and 10 lines' worth of
      that element's own line-height) — generous enough to fit every
      step's copy at any screen size — so the left column's height is
      effectively constant across steps instead of following whichever
      copy is shortest or longest. Left column uses `flex h-full
      flex-col justify-between` so the CTA is pinned to the bottom of
      that now-fixed height, and CSS Grid's default row-stretch keeps
      the image column matched to it, so nothing shifts — panel,
      image, or button — when a different step is selected.
   ================================================================ */

export default function Approach() {
  const [activeStep, setActiveStep] = useState(0);
  const current = APPROACH_STEPS[activeStep];

  return (
    <section className="bg-black-bg">
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24 md:pt-28">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2.5">
          <span className="h-2.5 w-2.5 shrink-0 bg-white" />
          <span className="font-mono text-xs tracking-[0.14em] text-white/70 uppercase text-balance sm:text-sm">
            Our Proven Approach
          </span>
        </div>

        {/* Headline */}
        <h2 className="mx-auto mt-7 max-w-4xl text-balance text-center text-[2rem] leading-[1.2] font-normal tracking-tight text-white sm:mt-8 sm:text-[42px] sm:leading-[1.15] sm:tracking-[-1.5px] md:text-[50px] md:leading-[1.12] md:tracking-[-2px]">
          Technico Digital Solutions will propel your business forward.
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-center text-sm leading-loose text-white/50 text-pretty sm:mt-8 sm:text-base">
          We give you a tailored digital marketing strategy to boost
          appointments, optimize ad performance, enhance SEO efforts, and
          streamline client management for maximum growth and profitability.
        </p>

        {/* How our experts do it */}
        <h3 className="mx-auto mt-16 max-w-2xl text-balance text-center text-2xl leading-tight font-normal tracking-tight text-white sm:mt-20 sm:text-3xl md:mt-24">
          How Our Digital Marketing Experts Do It?
        </h3>

        <div className="mx-auto mt-7 max-w-3xl sm:mt-8">
          <p className="text-sm leading-relaxed text-white/60 text-pretty sm:text-base">
            Technico&rsquo;s SEO strategists do so by implementing online
            marketing strategies because we believe that even the best products
            shine brighter in the spotlight.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:mt-12 sm:grid-cols-3">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <rect
                      x="2.5"
                      y="2.5"
                      width="19"
                      height="19"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="8"
                      y="8"
                      width="8"
                      height="8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="11"
                      y="11"
                      width="2"
                      height="2"
                      fill="currentColor"
                    />
                  </svg>
                ),
                text: "Data-driven campaigns attract qualified leads and convert them into paying clients.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <rect
                      x="2.5"
                      y="2.5"
                      width="12"
                      height="12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <rect
                      x="9.5"
                      y="9.5"
                      width="12"
                      height="12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                ),
                text: "Combining SEO, paid advertising, social media, and email marketing into a coordinated strategy.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <rect
                      x="3"
                      y="14"
                      width="4"
                      height="7"
                      fill="currentColor"
                    />
                    <rect
                      x="10"
                      y="9"
                      width="4"
                      height="12"
                      fill="currentColor"
                    />
                    <rect
                      x="17"
                      y="3"
                      width="4"
                      height="18"
                      fill="currentColor"
                    />
                  </svg>
                ),
                text: "Every campaign is backed by audience research, competitor analysis, and performance tracking, so your budget targets the people most likely to book, buy, or call.",
              },
            ].map((point) => (
              <div key={point.text} className="flex flex-col items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 text-white/80">
                  {point.icon}
                </span>
                <p className="text-sm leading-relaxed text-white/75 text-pretty sm:text-base">
                  {point.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-loose text-white/50 text-pretty sm:mt-12 sm:text-base">
          If you need more inbound leads, stronger local visibility, or a higher
          return on ad spend, let our digital marketing experts identify the
          highest-impact channels for your market and execute with precision. No
          guesswork here, just a clear strategy, consistent execution, and
          measurable results.
        </p>
      </div>

      {/* Step 1–4 panel */}
      <div className="mx-auto mt-16 max-w-6xl px-6 pb-20 sm:mt-20 sm:pb-24 md:mt-24 md:pb-28">
        {/* Mobile / tablet: no tabs, every step stacked and scrollable */}
        <div className="flex flex-col gap-10 md:hidden">
          {APPROACH_STEPS.map((step) => (
            <div key={step.step} className="border border-white/15">
              <div className="p-4 sm:p-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="100vw"
                    quality={100}
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-8 px-6 pt-2 pb-10 sm:px-10 sm:pb-12">
                <span className="font-mono text-[10px] tracking-[0.1em] text-white/55 uppercase sm:text-xs sm:tracking-[0.14em]">
                  {step.step}
                </span>
                <div>
                  <h4 className="text-3xl leading-tight font-normal tracking-tight text-white sm:text-4xl">
                    {step.title}
                  </h4>
                  <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60 text-pretty sm:text-base">
                    {step.description}
                  </p>
                </div>

                <div className="w-full sm:w-auto">
                  <Button to={SITE_PHONE_HREF} variant="light" size="md">
                    Book a Call
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: bordered box with four-tab switcher + single swapping panel */}
        <div className="hidden border border-white/15 md:block">
          {/* Tabs */}
          <div className="flex divide-x divide-white/15 border-b border-white/15">
            {APPROACH_STEPS.map((step, i) => (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStep(i)}
                aria-pressed={activeStep === i}
                className={`flex-1 px-6 py-6 text-center font-mono text-xs tracking-[0.14em] uppercase transition-colors duration-300 sm:text-sm ${
                  activeStep === i
                    ? "bg-purple-accent text-white"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {step.step}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid grid-cols-2">
            <div className="flex h-full flex-col justify-between gap-12 px-10 py-16">
              <div>
                <h4 className="min-h-[3lh] text-4xl leading-tight font-normal tracking-tight text-white">
                  {current.title}
                </h4>
                <p className="mt-6 min-h-[10lh] max-w-md text-base leading-relaxed text-white/60 text-pretty">
                  {current.description}
                </p>
              </div>

              <div className="w-auto">
                <Button to={SITE_PHONE_HREF} variant="light" size="md">
                  Book a Call
                </Button>
              </div>
            </div>

            <div className="h-full">
              <div className="relative h-full overflow-hidden">
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  sizes="50vw"
                  quality={100}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
