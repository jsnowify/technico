"use client";

import { Fragment, useMemo, useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* ================================================================
   REVEAL UP TEXT
   ================================================================
   Word-by-word scroll-triggered rise-in — the same shape as the
   "Animate text on Scroll" GSAP demo:

     SplitText.create(quote, { type: "words,chars" })
     gsap.from(split.chars, {
       scrollTrigger: { trigger, toggleActions: "restart pause resume reverse", start: "center center" },
       duration: 0.6, ease: "circ.out", y: 80, stagger: 0.02,
     });

   ...adapted to this project's conventions rather than ported
   verbatim — notably `yPercent: 100` instead of the demo's fixed
   `y: 80`, since a flat px offset is shorter than this site's own
   line-height at large heading sizes and left a sliver of each
   word's ascenders visible before it triggered:

   - Same useGSAP + prefersReducedMotion + gsap.ts import pattern as
     every other motion component here (RevealUp, ScrollFillText) —
     `as`/`className` on the outer element, the actual animated
     wrapper is an inner ref, reduced-motion just snaps to the end
     state instead of animating.
   - No SplitText plugin dependency. lib/gsap.ts only registers
     ScrollTrigger, so nothing here reaches for the (paid/club)
     SplitText plugin — words are split at the JSX level, the same
     approach ScrollFillText's `accent` mode already uses for
     per-character splitting. Word-level granularity (not
     word+char) is used: fine enough to read as the same rise, and
     it means an `href` segment stays exactly one real `<Link>`
     rather than being sliced into single-letter spans.
   - `segments` works like ScrollFillText's segments prop: an array
     of { text, href?, className? } contributing to one continuous,
     one-timeline word list. This file exists specifically for
     ServicesMarketOverview's intro sentence — "...provides
     [digital marketing services](/services) for..." — so the
     linked clause needs to render as a real, crawlable <Link> (see
     consideration.md: real <a href>, content-before-animation) and
     rise in lockstep with the plain words around it, not on its
     own separate schedule.
   - Each word sits inside its own `overflow-hidden` mask (the
     demo's `.split-line`/`.quote { overflow: hidden }`), so the
     rise reads as the word emerging from behind a hard edge
     rather than sliding in from empty space above the line.
   - Uses ScrollTrigger's `toggleActions: "restart pause resume
     reverse"` — exactly like the demo — instead of RevealUp's
     one-shot `start: "top 80%"`. Scrolling back up past the
     trigger un-animates it and scrolling back down replays it.
   ================================================================ */

interface RevealUpTextSegment {
  text: string;
  href?: string;
  /** Extra classes for this segment's words only (e.g. underline styling for a link segment). */
  className?: string;
}

export default function RevealUpText({
  text,
  segments,
  as: Tag = "span",
  className = "",
  duration = 0.6,
  stagger = 0.02,
  yPercent = 100,
  start = "top 85%",
}: {
  /** Plain-string mode — ignored if `segments` is provided. */
  text?: string;
  /** Mixed-content mode — a run of segments (some optionally linked) risen as one continuous word list. */
  segments?: RevealUpTextSegment[];
  /** Outer semantic wrapper — defaults to an inline span so this can sit inside a heading. */
  as?: ElementType;
  className?: string;
  /** Per-word rise duration, seconds. */
  duration?: number;
  /** Delay between each word's rise, seconds. */
  stagger?: number;
  /**
   * Starting vertical offset each word rises up from, as a % of the
   * word's OWN box height (not a fixed px value). This has to scale
   * with the word, not be a flat number: the demo's fixed `y: 80` is
   * shorter than this site's line-height at large heading sizes
   * (xl:text-[104px]), so a flat 80px left the top sliver of each
   * word's ascenders poking out of its overflow-hidden mask even
   * before the word had triggered — reading as a smudged/blurry
   * line sitting below the fold. yPercent: 100 always starts exactly
   * one full box-height below, so the mask hides it completely no
   * matter the font size.
   */
  yPercent?: number;
  /** ScrollTrigger `start` position. */
  start?: string;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);

  const plainWords = useMemo(
    () => (text ?? "").split(/\s+/).filter(Boolean),
    [text],
  );

  const segmentWords = useMemo(() => {
    if (!segments) return null;
    return segments.flatMap((segment, segmentIndex) =>
      segment.text
        .split(/\s+/)
        .filter(Boolean)
        .map((word, wordIndex) => ({
          word,
          href: segment.href,
          className: segment.className,
          key: `${segmentIndex}-${wordIndex}`,
        })),
    );
  }, [segments]);

  useGSAP(
    () => {
      const wordEls =
        containerRef.current?.querySelectorAll<HTMLElement>(
          "[data-reveal-word]",
        );
      if (!wordEls || wordEls.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(wordEls, { yPercent: 0, opacity: 1 });
        return;
      }

      gsap.from(wordEls, {
        yPercent,
        duration,
        stagger,
        ease: "circ.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          toggleActions: "restart pause resume reverse",
          // A fast scrollbar drag (or Lenis catching up after a flick)
          // can cross this element's start AND end thresholds in the
          // same tick, so ScrollTrigger fires onEnter then onLeave
          // almost simultaneously — "restart" immediately followed by
          // "pause" freezes the 0.6s rise mid-transform, which is what
          // reads as words stuck half-risen/soft-edged inside their
          // masks. fastScrollEnd snaps the tween to its resolved end
          // state instead of leaving it paused mid-flight when that
          // happens.
          fastScrollEnd: true,
        },
      });
    },
    {
      scope: containerRef,
      dependencies: [
        plainWords,
        segmentWords,
        duration,
        stagger,
        yPercent,
        start,
      ],
    },
  );

  const words =
    segmentWords ??
    plainWords.map((word, i) => ({
      word,
      href: undefined as string | undefined,
      className: undefined as string | undefined,
      key: String(i),
    }));

  return (
    <Tag ref={containerRef} className={className}>
      {words.map(({ word, href, className: wordClassName }, i) => (
        <Fragment key={words[i].key}>
          <span className="inline-block overflow-hidden align-baseline">
            {href ? (
              <Link
                href={href}
                data-reveal-word
                className={`inline-block ${wordClassName ?? ""}`}
              >
                {word}
              </Link>
            ) : (
              <span
                data-reveal-word
                className={`inline-block ${wordClassName ?? ""}`}
              >
                {word}
              </span>
            )}
          </span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}
