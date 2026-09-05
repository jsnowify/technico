"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import { QUESTIONS_ANSWERS, type QuestionAnswer } from "@/lib/constants";
import { ScrollTrigger } from "@/lib/gsap";
import RevealUpText from "@/components/motion/RevealUpText";

/* ================================================================
   QUESTIONS & ANSWERS (fourth section)
   ================================================================
   NOT the FAQ section — this is its own "Question & Answer" section:
   eyebrow + headline + subcopy (matching the eyebrow/heading pattern
   established in Overview and Strategy) wrapping the accordion block.

   Reuses the project's own existing accordion convention rather than
   introducing a new one: MobileNav's Services disclosure already
   solves "smooth, layout-safe expand/collapse" with a
   grid-rows-[0fr]->[1fr] + overflow-hidden trick, animated with the
   same cubic-bezier(0.77,0,0.175,1) easing used for its own chevron
   rotation. Both are reused here verbatim so this block moves and
   feels consistent with the rest of the site, entirely in CSS — no
   new animation library.

   State is a Set of open indices (not a single `openIndex`), so every
   item's open/closed state is independent — opening one never closes
   another, and any number can be open at once.

   Desktop layout is two independently-flowing stacks (left/right),
   not a single CSS Grid with grid-cols-2. A shared grid was the
   source of the "neighbor expands" bug: Grid's default
   align-items:stretch + grid-auto-rows:auto forces every item in the
   same row to match the tallest item's height, so opening the left
   item visually stretched the right item's box even though its
   content never changed. Splitting into two separate column flows
   removes that coupling entirely — each column's height is now only
   ever driven by its own items. The mobile view stays a single flat
   list in natural 1-2-3-4-5 order, matching the original design.
   ================================================================

   PERFORMANCE / CROSS-SECTION NOTES (added after a scroll-jank +
   spurious-ScrollTrigger-refresh bug report — same visual motion as
   before, just cheaper and better isolated):

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
      to re-measure a wider scope than necessary to redraw it. The
      section still legitimately grows/shrinks and pushes content
      below it, same as before — this only cheapens the per-frame
      cost of getting there.

   3) `will-change` is applied to the grid track only while it's
      actually mid-transition (tracked locally per item via
      transitionstart/transitionend on the grid-template-rows
      property specifically) and removed immediately after, so the
      browser gets a head start on the frames that matter without
      permanently pinning a compositor layer for closed content.

   4) This section sits above Services.tsx, which pins itself with a
      GSAP ScrollTrigger (pin + scrub) whose start/end are anchored
      to its absolute position in the document. GSAP auto-refreshes
      those positions on window `resize`, and treats a big enough
      layout shift the same way — so every accordion open/close here
      (which genuinely does grow/shrink this section and push
      Services down) was being read as a live position change
      mid-animation, firing Services' scroll-linked animation before
      the user ever scrolled there.

      Services' own trigger config is untouched. Instead, for the
      duration of any accordion transition in *this* section,
      `ScrollTrigger.config` temporarily drops `resize` out of its
      `autoRefreshEvents` list, so GSAP stops re-measuring off of our
      still-moving layout. Once every open/close in this section has
      settled (debounced ~200ms after the last one finishes, so
      rapid toggling only pays for one recalculation), the default
      events are restored and a single `ScrollTrigger.refresh()` is
      called manually — GSAP still ends up with correct, final
      positions, it just never sees the in-between frames.
   ================================================================ */

const PANEL_EASE = "ease-[cubic-bezier(0.77,0,0.175,1)]";

// Default GSAP ScrollTrigger.config().autoRefreshEvents. Restored
// after this section's accordion transitions settle — see note 4
// above. Kept as a constant rather than read back from GSAP so the
// "paused" and "restored" values are always exact opposites of each
// other, regardless of what other code on the page might have
// touched this config in between.
const DEFAULT_AUTO_REFRESH_EVENTS =
  "resize,visibilitychange,DOMContentLoaded,load";
const PAUSED_AUTO_REFRESH_EVENTS = "DOMContentLoaded,load";
const REFRESH_SETTLE_MS = 200;

/**
 * Shared across every item in this section (both the mobile flat list
 * and the desktop two-column split render their own instances of the
 * same items, so this has to live once at the section level, not per
 * item) — see note 4 above.
 */
function useScrollTriggerRefreshGuard() {
  const inFlightRef = useRef(0);
  const settleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      // Don't leave ScrollTrigger's global config paused if this
      // section unmounts mid-transition.
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

interface QuestionAnswerItemProps {
  item: QuestionAnswer;
  isOpen: boolean;
  onToggle: () => void;
  onTransitionStart: () => void;
  onTransitionEnd: () => void;
}

function QuestionAnswerItem({
  item,
  isOpen,
  onToggle,
  onTransitionStart,
  onTransitionEnd,
}: QuestionAnswerItemProps) {
  const reactId = useId();
  const panelId = `qa-panel-${reactId}`;
  const buttonId = `qa-question-${reactId}`;

  // Local only — drives the temporary will-change hint on the grid
  // track (see note 3 above). Separate from the section-level
  // ScrollTrigger guard, which needs a cross-item count rather than
  // a per-item flag.
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

      {/* Layout-safe expand/collapse: grid-rows animates the track
          from 0fr to 1fr (never height:auto, never display:none) so
          the row above never jumps, and overflow-hidden clips the
          answer while its own track is still growing. Transition is
          scoped to the two properties that actually change (not
          `transition-all`), will-change is only applied while
          mid-transition, and onTransitionStart/End feed the
          section-level ScrollTrigger guard — see the file header. */}
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

export default function QuestionsAnswers() {
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
  // matching the original row-major reading order (1 left, 2 right,
  // 3 left, 4 right, 5 left).
  const indexedItems = QUESTIONS_ANSWERS.map((item, index) => ({
    item,
    index,
  }));
  const leftColumn = indexedItems.filter(({ index }) => index % 2 === 0);
  const rightColumn = indexedItems.filter(({ index }) => index % 2 === 1);

  return (
    <section className="bg-white-bg">
      {/* Top padding matched to Strategy.tsx's outer container
          (pt-16, no responsive step-up) instead of this section's
          previous pt-24 sm:pt-28 md:pt-32. Bottom padding (pb-24
          sm:pb-28 md:pb-32) left as-is — only the top was asked to
          match. */}
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-24 sm:pb-28 md:pb-32">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3">
          <span className="h-2.5 w-2.5 shrink-0 bg-black-text" />
          <span className="font-mono text-xs tracking-[0.16em] text-black-text uppercase text-balance sm:text-sm">
            Question &amp; Answer
          </span>
        </div>

        {/* Headline — word-by-word scroll rise-in via RevealUpText,
            same classes it replaced. */}
        <RevealUpText
          as="h2"
          text="We drive your brand forward, automate strategies, and boost revenue."
          className="mx-auto mt-7 max-w-4xl text-balance text-center text-[32px] leading-[1.2] font-medium tracking-tight text-black-text sm:mt-8 sm:text-[42px] sm:leading-[1.15] sm:tracking-[-1.5px] md:text-[56px] md:leading-[1.12] md:tracking-[-2px] lg:text-[64px]"
        />
        <p className="mx-auto mt-7 max-w-xl text-center text-sm leading-loose text-black-text/60 text-pretty sm:mt-8 sm:text-base">
          If you find yourself saying yes to these questions, it&rsquo;s time to
          take action to transform your digital marketing strategy and drive
          impactful results for your business. Schedule a strategy call with
          Technico Digital Solutions today.
        </p>

        {/* Accordion — see the header comment for why this is two
            independent column flows on desktop rather than a single
            CSS Grid: it's what stops an opened item from stretching
            its same-row neighbor. */}
        <div className="mt-20 border-t border-black-text/10 sm:mt-24 md:mt-28">
          {/* Mobile: single flat column, natural 1-2-3-4-5 order */}
          <div className="md:hidden">
            {indexedItems.map(({ item, index }) => (
              <QuestionAnswerItem
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
                <QuestionAnswerItem
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
                <QuestionAnswerItem
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
