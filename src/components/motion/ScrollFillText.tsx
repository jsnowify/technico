"use client";

import { Fragment, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* ================================================================
   SCROLL FILL TEXT
   ================================================================
   Word-by-word scroll-scrubbed "fill" for a single de-emphasized
   clause sitting inline after a static bold lead-in (see
   ServicesMarketOverview's closing section: the bold black sentence
   is plain static text, and only the dimmed follow-on clause — this
   component — animates in word by word as the page scrolls).

   Renders inline (a <span>, not a block element) so it can sit right
   after the static lead-in inside the same <p> and keep wrapping
   naturally as one paragraph.

   At rest every word sits at `restOpacity` (grayscale/dim); as the
   clause scrolls through the viewport each word's opacity ramps up
   to `targetOpacity` (fully solid) in reading order, tied to scroll
   position via ScrollTrigger's `scrub` — not a one-shot timed
   animation — so words fill in step with how far the user has
   actually scrolled.

   Optional `accent` mode (off by default, so every existing caller
   keeps its exact plain opacity-only fade): text is split down to
   individual characters, and a colored band sweeps through them as
   they fill — each character rides dim → `accentColor` → solid
   `finalColor`, tightly staggered so at any scroll position there's
   a narrow purple wipe sitting right at the reading boundary: solid
   black behind it, dim gray ahead of it. The purple is only ever the
   leading edge of the sweep, never the resting color — everything a
   user has "read" settles to plain `finalColor`. Existing callers
   that don't pass `accent` are untouched: same word-level markup,
   selector, and tween as before, so className-driven colors (e.g.
   `text-white`) still win exactly as they did.

   Accent mode duplicates the text as a `sr-only` node for screen
   readers/SEO and marks the per-character markup `aria-hidden`,
   since splitting into single-letter spans would otherwise read
   character-by-character to assistive tech.

   Optional `segments` (non-accent mode only) — an alternative to
   `text` for a run that isn't one plain string, e.g. a heading with
   an inline <Link> in the middle of it (ServicesMarketOverview's
   intro sentence: "...provides digital marketing services for...",
   where the middle clause is a link to /services). Each segment
   contributes its own words to the same reading-order word list and
   the same single scroll-scrub timeline, so the link's words fill in
   step with the plain words around it instead of animating on their
   own separate schedule; a segment with an `href` renders its words
   as a <Link> (with that segment's `className`, e.g. an underline)
   instead of a plain span, while still carrying `data-fill-word` so
   GSAP targets it exactly like any other word.
   ================================================================ */

interface ScrollFillSegment {
  text: string;
  href?: string;
  /** Extra classes for this segment's words only (e.g. underline styling for a link segment). */
  className?: string;
}

export default function ScrollFillText({
  text,
  segments,
  targetOpacity = 1,
  restOpacity = 0.35,
  accent = false,
  accentColor = "var(--color-purple-accent)",
  finalColor = "var(--color-black-text)",
  className = "",
}: {
  /** Plain-string mode — ignored if `segments` is provided. */
  text?: string;
  /** Mixed-content mode — a run of segments (some optionally linked) filled as one continuous word list. */
  segments?: ScrollFillSegment[];
  /** Opacity each word settles at once fully "filled"/solid (0–1). */
  targetOpacity?: number;
  /** Opacity every word starts at — the grayscale/dim resting state. */
  restOpacity?: number;
  /** Enable the per-character purple sweep + settle-to-`finalColor` treatment. */
  accent?: boolean;
  /** Color of the leading edge as it sweeps across, when `accent` is on. */
  accentColor?: string;
  /** Color each character settles at once the sweep has passed, when `accent` is on. */
  finalColor?: string;
  className?: string;
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
      const wordEls = containerRef.current?.querySelectorAll<HTMLElement>(
        accent ? "[data-fill-char]" : "[data-fill-word]",
      );
      if (!wordEls || wordEls.length === 0) return;

      if (prefersReducedMotion) {
        gsap.set(
          wordEls,
          accent
            ? { opacity: targetOpacity, color: finalColor }
            : { opacity: targetOpacity },
        );
        return;
      }

      if (!accent) {
        gsap.set(wordEls, { opacity: restOpacity });

        gsap.to(wordEls, {
          opacity: targetOpacity,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "bottom 55%",
            // `true`, not a lag value: Lenis (see SmoothScrollProvider)
            // already eases the scroll position itself. Stacking a
            // scrub lag on top of Lenis's own glide double-smooths the
            // motion, so it drifts out of sync with where the page
            // actually is — this keeps the fill locked to true scroll
            // position and lets Lenis be the only source of glide.
            scrub: true,
          },
        });
        return;
      }

      // Accent mode: a narrow purple band wipes across the characters —
      // short duration + tight stagger keeps the "currently filling"
      // band only a handful of characters wide, matching a sweep
      // rather than a wide gradient. Behind the band: solid finalColor.
      // Ahead of it: dim restOpacity/finalColor, untouched until the
      // sweep reaches it.
      gsap.set(wordEls, { opacity: restOpacity, color: finalColor });

      gsap.to(wordEls, {
        keyframes: {
          "0%": { opacity: restOpacity, color: finalColor },
          "50%": { opacity: 1, color: accentColor },
          "100%": { opacity: targetOpacity, color: finalColor },
        },
        duration: 0.15,
        stagger: 0.015,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "bottom 55%",
          // See the non-accent branch above: `true`, not a lag value,
          // so this doesn't double-smooth on top of Lenis.
          scrub: true,
        },
      });
    },
    {
      scope: containerRef,
      dependencies: [
        plainWords,
        segmentWords,
        targetOpacity,
        restOpacity,
        accent,
        accentColor,
        finalColor,
      ],
    },
  );

  if (!accent) {
    if (segmentWords) {
      return (
        <span ref={containerRef} className={className}>
          {segmentWords.map(({ word, href, className: wordClassName }, i) => (
            <Fragment key={segmentWords[i].key}>
              {href ? (
                <Link
                  href={href}
                  data-fill-word
                  className={`inline ${wordClassName ?? ""}`}
                >
                  {word}
                </Link>
              ) : (
                <span
                  data-fill-word
                  className={`inline ${wordClassName ?? ""}`}
                >
                  {word}
                </span>
              )}
              {i < segmentWords.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </span>
      );
    }

    return (
      <span ref={containerRef} className={className}>
        {plainWords.map((word, i) => (
          <Fragment key={i}>
            <span data-fill-word className="inline">
              {word}
            </span>
            {i < plainWords.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
    );
  }

  return (
    <span ref={containerRef} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {plainWords.map((word, wi) => (
          <Fragment key={wi}>
            <span className="inline-block whitespace-nowrap">
              {word.split("").map((char, ci) => (
                <span key={ci} data-fill-char className="inline-block">
                  {char}
                </span>
              ))}
            </span>
            {wi < plainWords.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
