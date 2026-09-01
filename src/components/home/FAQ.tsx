"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import { FAQS, type FaqItem } from "@/lib/constants";
import { ScrollTrigger } from "@/lib/gsap";

/* ================================================================
   FAQ (eleventh section)
   ================================================================
   This is the dedicated FAQ section — distinct from
   QuestionsAnswers.tsx, which is its own earlier "Question & Answer"
   section higher up the page. The layout, accordion mechanics, and
   two-column split below are copied verbatim from QuestionsAnswers.tsx
   so this section moves and feels identical; only the eyebrow label
   and copy differ (eyebrow reads "FAQ" — short for
   "Questions = Answers" — instead of "Question & Answer").

   PERFORMANCE / CROSS-SECTION NOTES — copied verbatim from
   QuestionsAnswers.tsx along with everything else, so the two stay
   in sync. FAQ is currently the last section on the page, so there's
   nothing below it for a layout shift to misfire, but the ScrollTrigger
   guard is kept anyway rather than diverging — cheap no-op today,
   correct automatically if another pinned/scroll-linked section ever
   gets added after this one:

   1) `transition-all` on the grid track and on the answer <p> used to
      make the browser watch every animatable property for changes
      every frame, on every open item simultaneously. Both are now
      scoped to only the properties that actually move
      (`grid-template-rows`/opacity, and transform/opacity), which is
      what the browser needs to check either way — this is a no-op
      visually, just less work per frame.

   2) `grid-template-rows` is a layout property, so animating it is
      an unavoidable reflow, not a compositor-only transform. Adding
      `contain: layout` to each individual row (not the section)
      tells the browser that a row's internal layout changes can't
      affect anything outside that row's own box, so it doesn't have
      to re-measure a wider scope than necessary to redraw it.

   3) `will-change` is applied to the grid track only while it's
      actually mid-transition (tracked locally per item via
      transitionstart/transitionend on the grid-template-rows
      property specifically) and removed immediately after.

   4) `ScrollTrigger.config`'s `autoRefreshEvents` is temporarily
      stripped of `resize` for the duration of any accordion
      transition in this section, then restored and followed by one
      manual `ScrollTrigger.refresh()` ~200ms after the last item
      settles — see QuestionsAnswers.tsx for the full rationale.
   ================================================================ */

const PANEL_EASE = "ease-[cubic-bezier(0.77,0,0.175,1)]";

const DEFAULT_AUTO_REFRESH_EVENTS =
  "resize,visibilitychange,DOMContentLoaded,load";
const PAUSED_AUTO_REFRESH_EVENTS = "DOMContentLoaded,load";
const REFRESH_SETTLE_MS = 200;

function useScrollTriggerRefreshGuard() {
  const inFlightRef = useRef(0);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (inFlightRef.current > 0) {
        ScrollTrigger.config({
          autoRefreshEvents: DEFAULT_AUTO_REFRESH_EVENTS,
        });
      }
    };
  }, []);

  const handleTransitionStart = useCallback(() => {
    if (inFlightRef.current === 0) {
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
      ScrollTrigger.config({ autoRefreshEvents: PAUSED_AUTO_REFRESH_EVENTS });
    }
    inFlightRef.current += 1;
  }, []);

  const handleTransitionEnd = useCallback(() => {
    inFlightRef.current = Math.max(0, inFlightRef.current - 1);
    if (inFlightRef.current !== 0) return;

    if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    settleTimerRef.current = setTimeout(() => {
      ScrollTrigger.config({ autoRefreshEvents: DEFAULT_AUTO_REFRESH_EVENTS });
      ScrollTrigger.refresh();
    }, REFRESH_SETTLE_MS);
  }, []);

  return { handleTransitionStart, handleTransitionEnd };
}

interface FaqItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  onTransitionStart: () => void;
  onTransitionEnd: () => void;
}

function FaqAccordionItem({
  item,
  isOpen,
  onToggle,
  onTransitionStart,
  onTransitionEnd,
}: FaqItemProps) {
  const reactId = useId();
  const panelId = `faq-panel-${reactId}`;
  const buttonId = `faq-question-${reactId}`;

  const [isAnimating, setIsAnimating] = useState(false);

  const handleGridTransitionStart = (
    event: TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "grid-template-rows") return;
    setIsAnimating(true);
    onTransitionStart();
  };

  const handleGridTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.propertyName !== "grid-template-rows") return;
    setIsAnimating(false);
    onTransitionEnd();
  };

  return (
    <div className="border-b border-black-text/10 [contain:layout]">
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-8 py-8 text-left sm:py-9"
      >
        <span className="text-lg leading-relaxed font-medium tracking-tight text-black-text sm:text-xl">
          {item.question}
        </span>

        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center border border-black-text/15 transition-transform duration-500 sm:h-10 sm:w-10 ${PANEL_EASE} ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
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

      {/* Layout-safe expand/collapse — see QuestionsAnswers.tsx for
          the full rationale on the scoped transition, contain, and
          will-change usage below. */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        onTransitionStart={handleGridTransitionStart}
        onTransitionEnd={handleGridTransitionEnd}
        className={`grid transition-[grid-template-rows,opacity] duration-700 motion-reduce:transition-none ${PANEL_EASE} ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        } ${isAnimating ? "will-change-[grid-template-rows,opacity]" : ""}`}
      >
        <div className="overflow-hidden">
          <p
            className={`max-w-xl pb-9 text-sm leading-loose text-black-text/60 transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none sm:pb-10 sm:text-base ${
              isOpen ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
            } ${isAnimating ? "will-change-transform" : ""}`}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  // Per-item state: a Set of open indices, not a single active index.
  // This is what makes every item independent — toggling one only
  // ever adds/removes its own index, so it can never clear another
  // item's entry.
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const { handleTransitionStart, handleTransitionEnd } =
    useScrollTriggerRefreshGuard();

  const toggleItem = (index: number) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Pair each item with its original index (needed for the Set lookup
  // and preserved when the array is split into columns below) and
  // split into the two visual columns — evens left, odds right —
  // matching the original row-major reading order.
  const indexedItems = FAQS.map((item, index) => ({
    item,
    index,
  }));
  const leftColumn = indexedItems.filter(({ index }) => index % 2 === 0);
  const rightColumn = indexedItems.filter(({ index }) => index % 2 === 1);

  return (
    <section className="bg-white-bg">
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-24 sm:pt-28 sm:pb-28 md:pt-32 md:pb-32">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3">
          <span className="h-2.5 w-2.5 shrink-0 bg-black-text" />
          <span className="font-mono text-xs tracking-[0.16em] text-black-text uppercase text-balance sm:text-sm">
            QUESTIONS = ANSWERS
          </span>
        </div>

        {/* Headline */}
        <h2 className="mx-auto mt-7 max-w-4xl text-balance text-center text-[2rem] leading-[1.2] font-normal tracking-tight text-black-text sm:mt-8 sm:text-[42px] sm:leading-[1.15] sm:tracking-[-1.5px] md:text-[50px] md:leading-[1.12] md:tracking-[-2px]">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-7 max-w-xl text-center text-sm leading-loose text-black-text/60 text-pretty sm:mt-8 sm:text-base">
          Answers to the questions we hear most from businesses evaluating a
          digital marketing partner. Still have one? Schedule a strategy call
          with Technico Digital Solutions today.
        </p>

        {/* Accordion — two independently-flowing column stacks on
            desktop (not a shared CSS Grid), so an opened item never
            stretches its same-row neighbor. See QuestionsAnswers.tsx
            for the full rationale; this mirrors it exactly. */}
        <div className="mt-20 border-t border-black-text/10 sm:mt-24 md:mt-28">
          {/* Mobile: single flat column, natural reading order */}
          <div className="md:hidden">
            {indexedItems.map(({ item, index }) => (
              <FaqAccordionItem
                key={item.question}
                item={item}
                isOpen={openItems.has(index)}
                onToggle={() => toggleItem(index)}
                onTransitionStart={handleTransitionStart}
                onTransitionEnd={handleTransitionEnd}
              />
            ))}
          </div>

          {/* Desktop: two independently-flowing columns */}
          <div className="hidden md:flex md:gap-x-20">
            <div className="min-w-0 flex-1">
              {leftColumn.map(({ item, index }) => (
                <FaqAccordionItem
                  key={item.question}
                  item={item}
                  isOpen={openItems.has(index)}
                  onToggle={() => toggleItem(index)}
                  onTransitionStart={handleTransitionStart}
                  onTransitionEnd={handleTransitionEnd}
                />
              ))}
            </div>
            <div className="min-w-0 flex-1">
              {rightColumn.map(({ item, index }) => (
                <FaqAccordionItem
                  key={item.question}
                  item={item}
                  isOpen={openItems.has(index)}
                  onToggle={() => toggleItem(index)}
                  onTransitionStart={handleTransitionStart}
                  onTransitionEnd={handleTransitionEnd}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
