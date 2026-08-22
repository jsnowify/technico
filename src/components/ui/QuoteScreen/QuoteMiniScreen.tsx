import { useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../../lib/gsap";
import ScrambleText from "../../motion/ScrambleText";
import { StatusDot } from "../../motion/Blink";

export type QuoteMiniScreenProps = {
  /** The statement to display. Rendered exactly as given — this
   *  component never rewrites, retypes, shortens, or otherwise
   *  alters the string. */
  quote: string;
  /**
   * Who said it. Optional. When omitted, the metadata row falls
   * back to "No Author" rather than hiding — the row is part of
   * the display's fixed layout, not conditional chrome.
   */
  author?: string;
  /**
   * Small technical tag in the title bar, e.g. `"SYSTEM DISPLAY"`.
   * Defaults to that exact string, but any section can override it
   * with its own context label without losing the display's
   * identity.
   */
  label?: string;
  /**
   * Small technical line printed beneath the frame. Defaults to the
   * company name — most call sites won't need to pass this at all.
   */
  footer?: string;
  className?: string;
  /** ScrollTrigger start position for the reveal. Default "top 85%". */
  start?: string;
};

/**
 * QuoteMiniScreen — a small computer-monitor display for a quoted
 * statement: a light physical frame with a title bar (status light,
 * label, minimal window controls), and a black display area beneath
 * it holding the quote and its author line. A short technical line
 * sits below the frame like a hardware ID plate.
 *
 * IMPORTANT — THIS IS NOT TILTCARD
 *
 * QuoteMiniScreen is intentionally separate from `TiltCard`. It must
 * never be implemented using TiltCard or any TiltCard styling — no
 * pointer-driven 3D tilt, no hover rotation, no perspective card
 * movement, no glare, no "floating card" identity. Nothing here
 * imports or wraps TiltCard. Its only interaction is the scroll-
 * triggered reveal described below; at rest and on hover it is
 * static. If a future variant genuinely needs hover motion, that is
 * a different component — do not reintroduce TiltCard into this one.
 *
 * See README.md in this folder for full rationale and reuse
 * guidance — short version: any future quoted statement on the site
 * should reach for this component rather than a bespoke quote card,
 * and rather than TiltCard.
 *
 * TEXT REVEAL — NOT TYPING, NO CURSOR
 *
 * The quote text is fixed — this component never rewrites, retypes,
 * or holds back the actual string, and there is no cursor at any
 * point, blinking or otherwise. Two things happen once the display
 * scrolls into view:
 *
 * 1. The display area itself unmasks — a clip-path inset collapses
 *    from a thin horizontal band to the full screen, alongside a
 *    quick opacity fade-in. This reads as the screen switching on,
 *    not as a card animating in.
 * 2. Inside it, each word of the quote starts soft (dim + blurred,
 *    a few pixels low) and settles to fully legible in a short
 *    staggered cascade — a "resolving into focus" pass, not a
 *    character-by-character typewriter.
 *
 * Once both finish, the complete quote is visible, plainly, with
 * nothing left attached to it.
 *
 * IMPLEMENTATION NOTES
 *
 * - Words are split once at render time (useMemo), not per frame —
 *   cheap even on long quotes, same pattern as ScrollRevealWords
 *   elsewhere on the site. No `text.split("").map(...)`, no
 *   per-character state, no typing interval anywhere here.
 * - Both the display unmask and the word cascade live on one GSAP
 *   timeline driven by ScrollTrigger's onEnter/onEnterBack — one-
 *   shot per crossing, reverses on scroll-out, no continuous loop.
 * - The title-bar label and author line use the site's existing
 *   `ScrambleText` "resolve" effect, and the status light reuses
 *   `StatusDot` — both already used for every other technical label
 *   on the page, so nothing new is invented for those.
 * - Everything GSAP-driven is torn down (ScrollTrigger/tween
 *   cleanup) on unmount via useGSAP's own context.
 */
export default function QuoteMiniScreen({
  quote,
  author,
  label = "SYSTEM DISPLAY",
  footer = "TECHNICO DIGITAL SOLUTIONS INC.",
  className,
  start = "top 85%",
}: QuoteMiniScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const wordsHostRef = useRef<HTMLParagraphElement>(null);

  // Split once per `quote` change, not per render/frame.
  const words = useMemo(() => quote.trim().split(/\s+/), [quote]);
  const authorLine = `Author — ${author && author.trim() ? author : "No Author"}`;

  useGSAP(
    () => {
      const display = displayRef.current;
      const host = wordsHostRef.current;
      if (!display || !host) return;

      const wordEls = host.querySelectorAll<HTMLElement>("[data-quote-word]");
      if (!wordEls.length) return;

      if (prefersReducedMotion) {
        gsap.set(display, { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 });
        gsap.set(wordEls, { opacity: 1, y: 0, filter: "blur(0px)" });
        return;
      }

      gsap.set(display, {
        clipPath: "inset(42% 0% 42% 0%)",
        opacity: 0.5,
      });
      gsap.set(wordEls, { opacity: 0.08, y: 8, filter: "blur(6px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start,
          toggleActions: "play none none reverse",
        },
      });

      tl.to(display, {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        duration: 0.65,
        ease: "power3.out",
      });

      tl.to(
        wordEls,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          ease: "power2.out",
          stagger: { each: 0.04 },
        },
        0.25,
      );
    },
    { scope: rootRef, dependencies: [quote, start] },
  );

  return (
    <div ref={rootRef} className={className}>
      {/* Frame — the physical-looking casing. Light, not the screen
          itself, so FRAME and DISPLAY read as two distinct surfaces
          rather than one card. */}
      <div className="rounded-2xl border border-black/12 bg-neutral-50 p-2.5 sm:p-3">
        {/* Title bar — status light + label on the left, minimal
            window controls on the right. Lives on the frame, not on
            the black screen beneath it. */}
        <div className="flex items-center justify-between px-1.5 pb-2.5 pt-1 sm:px-2">
          <span className="flex items-center gap-2">
            <StatusDot />
            <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-black/45">
              <ScrambleText as="span" variant="micro">
                {label}
              </ScrambleText>
            </span>
          </span>

          {/* Minimal window controls — monochrome line glyphs, purely
              decorative, no color, no gloss. */}
          <span
            aria-hidden="true"
            className="flex items-center gap-1.5 text-black/25"
          >
            <span className="block h-px w-2.5 bg-current" />
            <span className="block h-2 w-2 border border-current" />
            <span className="relative block h-2 w-2">
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-current" />
            </span>
          </span>
        </div>

        {/* Display — the screen glass. Black, distinct from the
            frame, unmasks via clip-path when it enters the viewport. */}
        <div
          ref={displayRef}
          className="overflow-hidden rounded-xl border border-white/10 bg-black px-6 py-8 sm:px-8 sm:py-9 md:px-10 md:py-10"
        >
          <blockquote>
            <p
              ref={wordsHostRef}
              className="font-mono text-base leading-relaxed text-white/90 md:text-lg md:leading-relaxed"
            >
              &ldquo;
              {words.map((word, i) => (
                <span
                  key={i}
                  data-quote-word
                  className="inline-block will-change-[filter,opacity,transform]"
                >
                  {word}
                  {i < words.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
              &rdquo;
            </p>
          </blockquote>

          <div className="mt-7 border-t border-white/10 pt-4 text-right font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 md:mt-8">
            <ScrambleText as="span" variant="micro">
              {authorLine}
            </ScrambleText>
          </div>
        </div>
      </div>

      {/* ID plate — small technical line beneath the frame. */}
      <div className="pt-3 text-center font-mono text-[8px] uppercase tracking-[0.2em] text-black/30 sm:pt-3.5">
        <ScrambleText as="span" variant="micro">
          {footer}
        </ScrambleText>
      </div>
    </div>
  );
}
