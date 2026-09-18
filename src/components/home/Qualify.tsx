"use client";

import { useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import HorizontalStagger from "@/components/layout/Header/HorizontalStagger";
import { QUALIFYING_QUESTIONS } from "@/lib/constants";
import Cta from "@/components/ui/CTA";

/* ================================================================
   QUALIFY (ninth section)
   ================================================================
   Re-skinned to match QuestionsAnswers.tsx's bento-grid card style
   (top eyebrow/headline/paragraph header, full-width grid of bordered
   cards below) instead of the old sticky-header + accordion-row
   layout. Kept: `HorizontalStagger`'s hover-fill wipe, the "LABEL /
   0X" numbered eyebrow row, and the question/answer card content —
   all lifted straight from QuestionsAnswers.tsx's `SolutionCard`.

   Deliberately dropped: everything that only makes sense for a card
   that LINKS somewhere — these questions aren't tied to individual
   service pages, so there's no `next/link`, no per-card "Explore
   service ↗" footer, no `SOLUTION_META` href/label list, and no
   trailing "View all digital marketing services" CTA bar. Cards are
   plain hoverable tiles (question + answer, both always visible)
   rather than a toggle/accordion, since there's no longer a
   click-to-reveal reason once the card isn't also a link target.

   Closing CTA banner below is unchanged — same shared `Cta` call-site
   pattern as AboutStory.tsx / ServicesMarketStats.tsx.
   ================================================================ */

interface QualifyCardProps {
  index: number;
  question: string;
  answer: string;
  layout: string;
}

function QualifyCard({ index, question, answer, layout }: QualifyCardProps) {
  const [active, setActive] = useState(false);
  const number = String(index + 1).padStart(2, "0");

  const handlePointerEnter = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") setActive(true);
  };
  const handlePointerLeave = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") setActive(false);
  };

  return (
    <div
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      tabIndex={0}
      className={`group relative isolate flex min-h-[310px] flex-col overflow-hidden bg-black-bg p-5 text-white transition-colors duration-300 hover:text-black-bg focus-visible:text-black-bg focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black-bg sm:min-h-[340px] sm:p-7 lg:p-8 ${layout}`}
    >
      <HorizontalStagger active={active} rows={7} />

      <div className="relative z-10 flex items-start justify-between gap-5 border-b border-white/15 pb-4 font-mono text-[10px] tracking-[0.08em] uppercase transition-colors duration-300 group-hover:border-black/20 sm:text-xs">
        <span className="opacity-55">SERP / {number}</span>
      </div>

      <h3 className="h3-section relative z-10 mt-6 max-w-[25ch] leading-[1.15] font-medium tracking-heading">
        {question}
      </h3>

      <p className="body-copy relative z-10 mt-5 max-w-[62ch] leading-[1.6] tracking-[-0.02em] opacity-70">
        {answer}
      </p>
    </div>
  );
}

// 4 questions -> 2x2 on lg (6 + 6 columns of the 12-col grid), same
// halves-of-12 approach as QuestionsAnswers.tsx's SOLUTION_META.
const QUALIFY_LAYOUT = [
  "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-6",
];

export default function Qualify() {
  return (
    <section className="bg-black-bg text-white">
      <div className="container-x mx-auto w-full max-w-[1920px] section-y">
        {/* ==========================================================
            HEADER — same eyebrow/headline/paragraph pattern as
            QuestionsAnswers.tsx / Overview.tsx.
           ========================================================== */}
        <header className="grid grid-cols-1 gap-5 border-t border-white/20 pt-5 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
          <div className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-white/50 uppercase sm:pt-1 sm:text-xs">
            <span aria-hidden="true">/</span>
            <span>SERP</span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:gap-12">
            <h2 className="h2-section max-w-[22ch] leading-[1.08] font-medium tracking-heading text-white">
              Outshine your competition and secure top rankings on search engine
              result pages{" "}
              <span className="text-purple-secondary underline decoration-1 underline-offset-2">
                (SERPs)
              </span>
            </h2>
            <p className="body-copy max-w-[48ch] leading-[1.6] tracking-[-0.02em] text-content uppercase lg:pt-1">
              If any of these questions resonate with your business goals, then
              book a strategy call to explore our{" "}
              <span className="text-purple-secondary underline decoration-1 underline-offset-2">
                digital marketing solutions
              </span>
              , designed specifically to support your needs, budget, and
              aspirations.
            </p>
          </div>
        </header>

        {/* ==========================================================
            GRID — bordered bento cards, no links, no "explore
            service" / "view all" CTA rows (see doc comment above).
           ========================================================== */}
        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 md:grid-cols-2 lg:mt-10 lg:grid-cols-12">
          {QUALIFYING_QUESTIONS.map((item, index) => (
            <QualifyCard
              key={item.question}
              index={index}
              question={item.question}
              answer={item.answer}
              layout={QUALIFY_LAYOUT[index] ?? "lg:col-span-6"}
            />
          ))}
        </div>
      </div>

      {/* Closing CTA — unchanged. */}
      <Cta
        title={
          <>
            No more searching for
            <br />
            &ldquo;digital marketing near me&rdquo;
          </>
        }
        description="We have experience working with various industries, including e-commerce stores, local service providers, and entrepreneurs in the service sector. Technico Digital Solutions has helped businesses improve their rankings and drive profits. This includes businesses like yours, where we have successfully assisted clients in achieving their goals. Your business is managed by marketers who excel in navigating the complexities of Google algorithms, adopting innovative marketing strategies, and leveraging the psychology of impactful advertising to drive exceptional results for your business."
        cta={{
          label: "FREE STRATEGY",
          href: "/contact",
        }}
        wide
      />
    </section>
  );
}
