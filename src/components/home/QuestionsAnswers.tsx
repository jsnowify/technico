"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

import { QUESTIONS_ANSWERS } from "@/lib/constants";
import GeometricIcon from "@/components/ui/icons";

/* ================================================================
   QUESTIONS & ANSWERS
   ----------------------------------------------------------------
   Cards are collapsible accordion items — same expand/collapse
   behavior and easing as the shared FAQ accordion (components/ui/
   FAQ.tsx's FaqAccordionItem / blog's BlogAccordion): title always
   visible, circular arrow toggle rotates 180deg, answer panel
   animates open/closed via the grid-rows trick. Only one card open
   at a time. Icon + card shell styling is kept as this section's
   own look (icon chip, #1a1a1a bg, border). The clipped notch image
   + floating circle below is untouched. On open, the icon chip and
   the circular arrow also trade places (icon left/arrow right ->
   arrow left/icon right) via an animated translateX, measured live
   off each element's width so it lines up at every breakpoint.
   ================================================================ */

const PANEL_EASE = "ease-[cubic-bezier(0.77,0,0.175,1)]";
/* Same curve as PANEL_EASE, as a raw value for inline transform styles */
const SWAP_EASE = "cubic-bezier(0.77,0,0.175,1)";

const LANDSCAPE_CLIP_PATH =
  "M1,0.89726 C1,0.954003 0.988628,1 0.974598,1 H0.025402 C0.011373,1 0,0.954003 0,0.89726 V0.424658 C0,0.367914 0.011373,0.321918 0.025402,0.321918 H0.054191 C0.068221,0.321918 0.079594,0.27592 0.079594,0.219178 V0.10274 C0.079594,0.045998 0.090966,0 0.104996,0 H0.974598 C0.988628,0 1,0.045998 1,0.10274 V0.89726 Z";

/* Temporary placeholder image */
const PLACEHOLDER_IMG =
  "https://res.cloudinary.com/dp9bjis3z/image/upload/v1788771108/temporary-placeholder/temporary_igtmhz.jpg";

/* One icon per question */
const QA_ICON_INDICES = [5, 14, 9, 22, 6];

/* ================================================================
   QA CARD
   ================================================================ */

interface QaCardProps {
  question: string;
  answer: string;
  iconIndex: number;
  isOpen: boolean;
  onToggle: () => void;
}

function QaCard({
  question,
  answer,
  iconIndex,
  isOpen,
  onToggle,
}: QaCardProps) {
  const reactId = useId();
  const panelId = `qa-panel-${reactId}`;
  const buttonId = `qa-question-${reactId}`;

  // Icon <-> arrow position swap. Icon sits left / arrow sits right by
  // default; while the card is open they trade places (arrow left,
  // icon right) via translateX. Distances are measured live off the
  // row + each element's own width, so the swap lines up exactly at
  // every breakpoint instead of using a guessed pixel value.
  const rowRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const [swap, setSwap] = useState({ icon: 0, arrow: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const row = rowRef.current;
      const icon = iconRef.current;
      const arrow = arrowRef.current;
      if (!row || !icon || !arrow) return;
      const rowWidth = row.offsetWidth;
      setSwap({
        icon: rowWidth - icon.offsetWidth,
        arrow: -(rowWidth - arrow.offsetWidth),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden rounded-[28px] border border-white/8 bg-[#1a1a1a]">
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full flex-col items-start p-8 text-left"
      >
        {/* Icon + toggle — swap places on open, animated via translateX */}
        <div
          ref={rowRef}
          className="flex w-full items-start justify-between gap-4"
        >
          <span
            ref={iconRef}
            className="flex h-16 w-16 shrink-0 items-center justify-center bg-purple-secondary text-black transition-transform duration-500 md:h-20 md:w-20"
            style={{
              borderRadius: "30px",
              transform: `translateX(${isOpen ? swap.icon : 0}px)`,
              transitionTimingFunction: SWAP_EASE,
            }}
          >
            <GeometricIcon
              index={iconIndex}
              className="h-10 w-10 md:h-12 md:w-12"
            />
          </span>

          <span
            ref={arrowRef}
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 sm:h-10 sm:w-10"
            style={{
              transform: isOpen
                ? `translateX(${swap.arrow}px) rotate(180deg)`
                : "translateX(0px) rotate(0deg)",
              transitionTimingFunction: SWAP_EASE,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </div>

        {/* Question */}
        <h3 className="card-title mt-8 min-h-[66px] leading-snug font-medium tracking-heading text-white">
          {question}
        </h3>
      </button>

      {/* Answer */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows,opacity] duration-700 motion-reduce:transition-none ${PANEL_EASE} ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="body-copy px-8 pb-8 leading-relaxed font-light tracking-body text-white/55">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MAIN SECTION
   ================================================================ */

export default function QuestionsAnswers() {
  const clipId = useId();

  // Only one card open at a time, same behavior as the shared FAQ
  // accordion / BlogAccordion. All cards start closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-black-bg text-white">
      <div className="px-6 pt-24 pb-24 sm:px-8 sm:pt-28 sm:pb-28 md:px-12 md:pt-32 md:pb-32 lg:px-[90px]">
        {/* ==========================================================
            HEADER
           ========================================================== */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 lg:shrink-0 lg:pt-2">
            <span className="eyebrow-text font-mono tracking-[0.16em] whitespace-nowrap text-white/85 uppercase">
              [ ] Question &amp; Answer
            </span>
          </div>

          {/* Heading */}
          <h2 className="h2-section indent-8 leading-[1.1] font-medium tracking-heading text-white sm:indent-10 md:indent-12 lg:w-[700px] lg:shrink-0">
            We drive your brand forward, automate strategies, and boost revenue.
          </h2>

          {/* Description */}
          <p className="body-copy max-w-70 leading-relaxed font-light tracking-body text-white text-pretty lg:shrink-0 lg:pt-1">
            If you find yourself saying yes to these questions, it&rsquo;s time
            to take action to transform your digital marketing strategy and
            drive impactful results for your business. Schedule a strategy call
            with Technico Digital Solutions today.
          </p>
        </div>

        {/* ==========================================================
            GRID
           ========================================================== */}

        <div className="mt-16 grid grid-cols-1 items-start gap-5 sm:mt-20 sm:grid-cols-2 sm:gap-6">
          {/* ========================================================
              QUESTION 01
             ======================================================== */}

          <QaCard
            question={QUESTIONS_ANSWERS[0].question}
            answer={QUESTIONS_ANSWERS[0].answer}
            iconIndex={QA_ICON_INDICES[0]}
            isOpen={openIndex === 0}
            onToggle={() => toggleItem(0)}
          />

          {/* ========================================================
              QUESTION 02
             ======================================================== */}

          <QaCard
            question={QUESTIONS_ANSWERS[1].question}
            answer={QUESTIONS_ANSWERS[1].answer}
            iconIndex={QA_ICON_INDICES[1]}
            isOpen={openIndex === 1}
            onToggle={() => toggleItem(1)}
          />

          {/* ========================================================
              SVG CLIP PATH
             ======================================================== */}

          <svg aria-hidden="true" className="absolute h-0 w-0">
            <defs>
              <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                <path d={LANDSCAPE_CLIP_PATH} />
              </clipPath>
            </defs>
          </svg>

          {/* ========================================================
              LANDSCAPE IMAGE + NOTCH CIRCLE
             ======================================================== */}

          <div className="relative col-span-1 w-full sm:col-span-2">
            {/* ------------------------------------------------------
                CLIPPED IMAGE

                The clip-path is applied ONLY to the image container.
                This keeps the notch shape intact.
               ------------------------------------------------------ */}

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

            {/* ------------------------------------------------------
                FLOATING WHITE CIRCLE

                IMPORTANT:
                This is OUTSIDE the clipped image.

                Size:
                mobile = 56px
                desktop = 64px

                Enlarged from the previous 44px/48px to better match
                the visual weight of the notch.
               ------------------------------------------------------ */}

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

          {/* ========================================================
              QUESTION 03
             ======================================================== */}

          <QaCard
            question={QUESTIONS_ANSWERS[2].question}
            answer={QUESTIONS_ANSWERS[2].answer}
            iconIndex={QA_ICON_INDICES[2]}
            isOpen={openIndex === 2}
            onToggle={() => toggleItem(2)}
          />

          {/* ========================================================
              QUESTION 04
             ======================================================== */}

          <QaCard
            question={QUESTIONS_ANSWERS[3].question}
            answer={QUESTIONS_ANSWERS[3].answer}
            iconIndex={QA_ICON_INDICES[3]}
            isOpen={openIndex === 3}
            onToggle={() => toggleItem(3)}
          />

          {/* ========================================================
              QUESTION 05
             ======================================================== */}

          <QaCard
            question={QUESTIONS_ANSWERS[4].question}
            answer={QUESTIONS_ANSWERS[4].answer}
            iconIndex={QA_ICON_INDICES[4]}
            isOpen={openIndex === 4}
            onToggle={() => toggleItem(4)}
          />

          {/* ========================================================
              FILLER PHOTO CARD
             ======================================================== */}

          <div className="relative min-h-60 overflow-hidden rounded-[28px]">
            <Image
              src={PLACEHOLDER_IMG}
              alt=""
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
