"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/* ================================================================
   TEXT REVEAL BLOCK
   ================================================================
   "Curtain" heading reveal: each line sits under two stacked solid
   rectangles, sized exactly to that line's text — a cover on top in
   a color that contrasts with the section behind it (white on a
   dark section, black on a light one — see `revealColorDark`), and
   a flash layer beneath it in the accent color. Both are opaque and
   present from the moment the component mounts, so nothing is
   visible/spoiled before the reveal fires. On mount, or on
   scroll-into-view for anything below the fold (see
   `scrollTrigger`), each line:
     1. the cover wipes away fast (scaleX 1 -> 0, anchored left),
        revealing the solid accent-color flash layer beneath it
     2. the flash layer then wipes away the same way, uncovering the
        line beneath it
   staggered line by line. Colors are never tweened against each
   other — each layer stays a flat, single color throughout, and the
   "flash" comes from one solid layer being swapped for another
   rather than blended into it.

   The text itself never animates — it's in the DOM at full opacity
   from the first paint. Only the rectangles' widths move, so
   there's no fade/blur or color-interpolation smear to fight with
   font rendering, and nothing reflows.

   Lines are passed explicitly (rather than splitting one string)
   because the mask has to match each visual line's width, and this
   component has no way to know where a fluid heading will actually
   wrap at a given breakpoint.
   ================================================================ */

interface TextRevealBlockProps {
  lines: string[];
  /** Tag for the outer wrapping element — a heading in most uses. */
  as?: "h1" | "h2" | "h3" | "div";
  /** Typography classes, applied to the outer element (color, size, etc). */
  className?: string;
  /** Mask color once fully bright, right before it wipes away. */
  revealColor?: string;
  /** Mask's resting/covering color before it flashes bright — pick one that contrasts with the section behind it. */
  revealColorDark?: string;
  /** Seconds between each line's reveal starting. */
  stagger?: number;
  /** Seconds the dark -> bright color flash takes. */
  colorDuration?: number;
  /** Seconds each line's rectangle takes to shrink away once bright. */
  duration?: number;
  /** Delay before the first line starts, e.g. to follow other intro motion. */
  delay?: number;
  /**
   * Play on scroll-into-view instead of on mount — for anything
   * below the fold, same `top 80%` / one-shot shape as this site's
   * other scroll entrances (see ServicesAccordion). Leave false for
   * above-the-fold headings (e.g. a hero), where mount-time is
   * exactly when the visitor is looking at it.
   */
  scrollTrigger?: boolean;
  /**
   * Horizontal alignment of the lines within the block. Defaults to
   * "center" (this component's original/only behavior, used by
   * ServicesHero and ServicesMarketOverview's centered/inline
   * copy). Pass "start" when this heading sits in a left-aligned
   * layout next to body copy — otherwise each line centers within
   * its own width independent of the text below it, so a
   * multi-line heading drifts out of alignment with everything
   * else on the page instead of sharing one left edge.
   */
  align?: "center" | "start";
}

export default function TextRevealBlock({
  lines,
  as: Tag = "h1",
  className = "",
  // Bright flash color from --color-purple-accent (#6b26d9). The
  // rectangle's resting/covering color needs contrast against
  // whatever section it sits on, not a fixed color — both current
  // usages (ServicesHero, ServicesMarketOverview's stats h2) sit on
  // bg-black-bg, so it defaults to white here. Pass
  // revealColorDark="#000000" (or similar) when using this on a
  // light-background section instead, so the cover reads as a
  // visible block rather than disappearing into the page.
  revealColor = "#6b26d9",
  revealColorDark = "#ffffff",
  stagger = 0.12,
  colorDuration = 0.15,
  duration = 0.6,
  delay = 0.15,
  scrollTrigger = false,
  align = "center",
}: TextRevealBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const covers = containerRef.current?.querySelectorAll<HTMLElement>(
        "[data-reveal-cover]",
      );
      const flashes = containerRef.current?.querySelectorAll<HTMLElement>(
        "[data-reveal-flash]",
      );
      if (!covers || covers.length === 0 || !flashes) return;

      // Two solid, stacked layers instead of one layer whose color
      // gets tweened — a backgroundColor tween interpolates through
      // the RGB values in between (e.g. white -> purple smears
      // through pale lavender), which reads as a muddy blend rather
      // than a crisp flash. Stacking a dark cover on top of a solid
      // purple flash layer and swapping between them with scaleX
      // keeps both colors flat at all times.
      gsap.set(covers, {
        scaleX: 1,
        transformOrigin: "left center",
        backgroundColor: revealColorDark,
      });
      gsap.set(flashes, {
        scaleX: 1,
        transformOrigin: "left center",
        backgroundColor: revealColor,
      });

      if (prefersReducedMotion) {
        gsap.set(covers, { scaleX: 0 });
        return;
      }

      const tl = gsap.timeline({
        delay,
        scrollTrigger: scrollTrigger
          ? { trigger: containerRef.current, start: "top 80%" }
          : undefined,
      });

      covers.forEach((cover, i) => {
        const start = i * stagger;
        const flash = flashes[i];
        // Cover wipes away fast to reveal the solid purple flash
        // layer underneath (no color blending, just a hard swap).
        tl.to(
          cover,
          { scaleX: 0, duration: colorDuration, ease: "power1.out" },
          start,
        ).to(
          // Then the purple layer itself wipes away to reveal the
          // text beneath it.
          flash,
          { scaleX: 0, duration, ease: "power4.inOut" },
          start + colorDuration - 0.05,
        );
      });
    },
    { scope: containerRef, dependencies: [scrollTrigger] },
  );

  return (
    <Tag className={className}>
      <div
        ref={containerRef}
        className={`flex flex-col ${align === "start" ? "items-start" : "items-center"}`}
      >
        {lines.map((line, i) => (
          <span key={i} className="relative inline-block overflow-hidden">
            {line}
            <span
              data-reveal-flash
              aria-hidden="true"
              className="absolute inset-0"
            />
            <span
              data-reveal-cover
              aria-hidden="true"
              className="absolute inset-0"
            />
          </span>
        ))}
      </div>
    </Tag>
  );
}
