"use client";

import { useState } from "react";
import { QUALIFYING_QUESTIONS } from "@/lib/constants";
import GeometricIcon from "@/components/ui/icons";
import Cta from "@/components/ui/CTA";

/* ================================================================
   QUALIFY (ninth section)
   ================================================================
   Black section. Redesigned to match the reference screenshot:

   1. Eyebrow / headline / paragraph laid out as the same row
      pattern used in Approach.tsx / Feedback.tsx (eyebrow left,
      headline + paragraph sharing the row, stacked on mobile) —
      except the headline here stays left-aligned rather than
      centered, per the reference. Eyebrow keeps the bracket
      "[ ] SERP" mark, now plain white.

   2. The four questions sit in a 2x2 grid on `md:` (single column
      below that) as soft dark cards (`bg-white/[0.04]`, `rounded-3xl`,
      plain/static — no scale or glow on these) — each with a
      pinwheel glyph top-left (GeometricIcon index 4, sized up to
      h-12 w-12) and a large translucent index numeral top-right, a
      bold question, and a plain-prose answer underneath.

   3. Purple connector dot sits centered on the 2x2 grid's crossing
      point (`md:` and up only). Click toggles `isActive`, which
      spins each icon 180deg and swaps its color white <-> purple
      accent — staggered 60ms per card (via inline `transitionDelay`)
      so the four spin in a quick ripple rather than all at once.
      Nothing else on the card moves.

      NOTE: GeometricIcon's prop type doesn't include `style`, so the
      transition-delay + transform/color classes live on a wrapping
      <span> around the icon rather than on GeometricIcon itself.

      Deliberately pure CSS (`transition-*` classes), NOT GSAP. The
      earlier GSAP version wrote its own inline `transform` on an
      element that also had a Tailwind translate class, and the two
      fought over the same CSS property — that's what caused the
      purple flash bug. Plain Tailwind transitions have no such
      conflict since only one system ever touches these properties.

   4. Closing CTA — this used to be its own bespoke section
      (Discuss.tsx's purple split-panel), but that markup turned out
      to just be a one-off CTA, so it's dropped here at the end of
      Qualify using the SAME shared `Cta` component every other
      closing CTA on the site already uses (see AboutStory.tsx,
      AboutBusinessMarketing.tsx, ServicesMarketStats.tsx,
      ServicesTailoredStrategy.tsx) instead of duplicating markup.
      Differences from those plain call sites, all because `Cta` has
      no matching slot for them:
        - Discuss.tsx's eyebrow ("Let's Discuss Your Project Right
          Away") is dropped — no other Cta call site adds one above
          it either, so this keeps the pattern consistent site-wide.
        - Discuss.tsx's two separate paragraphs (experience / how we
          work) are merged into Cta's single `description` string,
          since Cta only renders one <p> — `wide` is set so that
          longer combined paragraph gets Cta's roomier max-w-lg
          measure instead of the default max-w-sm built for a
          one-liner.
        - The outer wrapper's bottom padding (`pb-20/24/28`) was
          dropped once Cta was added: Cta already carries its own
          top padding (`py-16/20/24`), and the two stacking produced
          a much bigger gap above the CTA than the rest of the site
          uses before this component (see AboutStory.tsx,
          ServicesMarketStats.tsx, which likewise add no extra
          bottom spacing before `<Cta />`).
        - `title` needed a specific line break after "for" rather
          than whatever point natural wrapping would pick, so it's
          passed as JSX (`<>...<br />...</>`) instead of a plain
          string. `Cta`'s `title` prop was widened from `string` to
          `ReactNode` in CTA.tsx to allow this — every existing call
          site still just passes a string, which remains valid.
   ================================================================ */

export default function Qualify() {
  const [isActive, setIsActive] = useState(false);

  return (
    <section className="bg-black-bg">
      <div className="px-6 pt-20 sm:px-8 sm:pt-24 md:px-12 md:pt-28 lg:px-[90px]">
        {/* Eyebrow / headline / paragraph row */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 lg:shrink-0 lg:pt-2">
            <span className="font-mono text-xs tracking-[0.16em] whitespace-nowrap text-white uppercase sm:text-sm">
              [ ] SERP
            </span>
          </div>

          {/* Headline — left-aligned, unlike the centered headline
              pattern used elsewhere on the page. */}
          <h2 className="indent-8 text-[28px] leading-[1.2] font-medium tracking-tight text-white sm:indent-10 sm:text-[34px] md:indent-12 md:text-[40px] lg:w-[640px] lg:shrink-0">
            Outshine Your Competition And Secure Top Rankings On Search Engine
            Result Pages (SERPs)
          </h2>

          {/* Paragraph — 18px / 300 weight */}
          <p className="max-w-xs text-lg leading-relaxed font-light text-white/50 text-pretty lg:shrink-0 lg:pt-1">
            If Any Of These Questions Resonate With Your Business Goals, Then
            Book A Strategy Call To Explore Our Digital Marketing Solutions,
            Designed Specifically To Support Your Needs, Budget, And
            Aspirations.
          </p>
        </div>

        {/* Qualifying questions — 2x2 grid of soft dark cards, each
            with a pinwheel glyph + large index numeral, a bold
            question, and a plain-prose answer underneath. */}
        <div className="relative mt-16 sm:mt-20 md:mt-24">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {QUALIFYING_QUESTIONS.map((item, index) => (
              <div
                key={item.question}
                className="rounded-3xl bg-white/[0.04] p-8 sm:p-10"
              >
                <div className="flex items-start justify-between">
                  <span
                    style={{ transitionDelay: `${index * 60}ms` }}
                    className={`inline-block transition-all duration-500 ease-out ${
                      isActive
                        ? "rotate-180 text-purple-accent"
                        : "rotate-0 text-white"
                    }`}
                  >
                    <GeometricIcon index={4} className="h-12 w-12" />
                  </span>
                  <span className="text-6xl leading-none font-medium tracking-tight text-white/25 sm:text-7xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Question — 24px medium */}
                <h3 className="mt-8 text-2xl leading-snug font-medium tracking-tight text-white">
                  {item.question}
                </h3>
                {/* Answer — 18px / 300 weight */}
                <p className="mt-4 max-w-sm text-lg leading-relaxed font-light text-white/50 text-pretty">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Connector dot — sits exactly on the 2x2 grid's center
              crossing point; hidden on the single-column mobile
              layout where there's no crossing point for it to mark.
              Click toggles the icon spin + color above. */}
          <button
            type="button"
            onClick={() => setIsActive((prev) => !prev)}
            aria-label="Toggle icon color"
            aria-pressed={isActive}
            className={`absolute top-1/2 left-1/2 z-10 hidden h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-purple-accent transition-transform duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-accent active:scale-90 md:block ${
              isActive ? "scale-125" : "scale-100"
            }`}
          />
        </div>
      </div>

      {/* Closing CTA — see file-header note 4. */}
      <Cta
        title={
          <>
            No More Searching for
            <br />
            &ldquo;Digital Marketing Near Me&rdquo;
          </>
        }
        description="We have experience working with various industries, including e-commerce stores, local service providers, and entrepreneurs in the service sector. Technico Digital Solutions has helped businesses improve their rankings and drive profits. This includes businesses like yours, where we have successfully assisted clients in achieving their goals. Your business is managed by marketers who excel in navigating the complexities of Google algorithms, adopting innovative marketing strategies, and leveraging the psychology of impactful advertising to drive exceptional results for your business."
        cta={{
          label: "Secure Your Free Strategy Consultation Today",
          href: "/contact",
        }}
        wide
      />
    </section>
  );
}
