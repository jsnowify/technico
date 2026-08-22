import { useEffect, useRef, useState } from "react";
import TiltCard from "../TiltCard";
import ScrambleText from "../../motion/ScrambleText";
import { StatusDot } from "../../motion/Blink";
import { prefersReducedMotion } from "../../../lib/gsap";

export type QuoteScreenProps = {
  /** The statement to type out. Required. */
  quote: string;
  /**
   * Small system label in the top-left of the header row (e.g. a
   * category or context tag). Optional — the header still renders
   * its "Verified" status on the right without it.
   */
  label?: string;
  /**
   * Author / source attribution shown bottom-left, terminal-log
   * style. Optional — falls back to a generic "Statement" tag.
   */
  source?: string;
  className?: string;
  /** Average ms per character. Each character jitters around this
   *  value so the reveal reads as typed, not metronomic. Default 34. */
  typingSpeed?: number;
  /** Ms to wait, once the card is visible, before typing starts. */
  startDelay?: number;
  /**
   * Start typing only once the card scrolls into view (default).
   * Set to false to start as soon as the component mounts.
   */
  triggerOnScroll?: boolean;
};

/**
 * Small corner-bracket chrome shared by QuoteScreen's card frame.
 * Lives on its own translateZ layer so it never competes with
 * TiltCard's own rotateX/rotateY/z target.
 */
function CornerBrackets() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-3 z-10 h-3 w-3 border-r border-t border-[var(--color-accent)]/60"
        style={{ transform: "translateZ(6px)" }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 left-3 z-10 h-3 w-3 border-b border-l border-[var(--color-accent)]/60"
        style={{ transform: "translateZ(6px)" }}
      />
    </>
  );
}

/**
 * QuoteScreen — a miniature futuristic "terminal" for quoted
 * statements: a compact black screen, framed like the rest of the
 * site's instrument chrome (corner brackets, verified/active status
 * rows, mono labels), with the quote typing itself out one character
 * at a time behind a blinking `|` cursor.
 *
 * See README.md in this folder for the full rationale and reuse
 * guidance — short version: any future quoted statement on the site
 * should reach for this component rather than a bespoke card.
 *
 * IMPLEMENTATION NOTES
 *
 * - Trigger: a plain IntersectionObserver (not GSAP/ScrollTrigger)
 *   starts the typing once the card is ~40% visible. The reveal
 *   itself is a handful of characters at a time, not a per-frame
 *   loop, so there's no case here where pulling in ScrollTrigger
 *   would buy anything CSS/React don't already give for free.
 *
 * - Reveal: recursive setTimeout, one character per hop, cleared on
 *   unmount. Nothing indefinite — it stops the moment the quote is
 *   fully revealed.
 *
 * - Layout stability: the quote is rendered TWICE — once invisible
 *   (full text, `invisible` so it still occupies space) to reserve
 *   the card's final height/width, and once absolutely positioned on
 *   top holding the actual in-progress reveal. This is what keeps
 *   the card (and anything laid out below it) from growing/shifting
 *   line-by-line as the quote types out.
 *
 * - Cursor: pure CSS blink (`quote-screen-cursor` in index.css), so
 *   it costs nothing in JS regardless of how many instances are on
 *   screen, and keeps blinking independent of the character-reveal
 *   re-renders.
 *
 * - Reduced motion: the full quote renders immediately, cursor holds
 *   steady (no blink) — see the prefers-reduced-motion block in
 *   index.css.
 */
export default function QuoteScreen({
  quote,
  label,
  source,
  className,
  typingSpeed = 34,
  startDelay = 200,
  triggerOnScroll = true,
}: QuoteScreenProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  const [revealedCount, setRevealedCount] = useState(
    prefersReducedMotion ? quote.length : 0,
  );
  const [isComplete, setIsComplete] = useState(prefersReducedMotion);

  useEffect(() => {
    // Reduced motion: quote is already fully revealed via initial
    // state above — nothing to schedule.
    if (prefersReducedMotion) return;

    const node = cardRef.current;
    if (!node) return;

    const typeNext = (remaining: number) => {
      if (remaining <= 0) {
        setIsComplete(true);
        return;
      }

      // Small randomized jitter per character so the reveal reads as
      // typed rather than a metronome.
      const delay = typingSpeed * (0.6 + Math.random() * 0.8);

      timeoutRef.current = window.setTimeout(() => {
        setRevealedCount((count) => count + 1);
        typeNext(remaining - 1);
      }, delay);
    };

    const begin = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      timeoutRef.current = window.setTimeout(
        () => typeNext(quote.length),
        startDelay,
      );
    };

    if (!triggerOnScroll || typeof IntersectionObserver === "undefined") {
      begin();
      return () => {
        if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          begin();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
    // Intentionally re-runs only if the quote itself changes — a
    // parent swapping quotes should pass a `key` to remount cleanly
    // rather than rely on this effect to reset mid-flight state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote]);

  const revealedText = quote.slice(0, revealedCount);
  const quoteTextClasses =
    "max-w-md text-lg italic leading-relaxed md:text-xl lg:text-2xl";

  return (
    <TiltCard
      className={`border border-black/10 bg-black p-8 text-white shadow-[0_30px_80px_-24px_rgba(0,0,0,0.35)] md:p-10 lg:p-12 ${className ?? ""}`}
    >
      <div ref={cardRef}>
        {/* Header — optional label on the left, fixed "Verified"
            status readout on the right. Own translateZ layer, kept
            off TiltCard's own rotateX/rotateY/z target so the pointer
            tilt and this static depth never fight. */}
        <div
          className="relative z-10 mb-6 flex items-center justify-between gap-3 font-mono text-[8px] uppercase tracking-[0.15em] text-white/35 md:mb-8"
          style={{ transform: "translateZ(12px)" }}
        >
          {label ? (
            <ScrambleText as="span" variant="micro">
              {label}
            </ScrambleText>
          ) : (
            <span />
          )}
          <span className="inline-flex shrink-0 items-center gap-1.5">
            <StatusDot />
            <ScrambleText as="span" variant="micro">
              Verified
            </ScrambleText>
          </span>
        </div>

        {/* Decorative background glyph — sits inside TiltCard's own
            clipped bounds, low opacity/z-index so it reads as texture
            behind the quote rather than protruding. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-6 top-4 z-0 select-none text-[4.5rem] font-bold leading-none text-[var(--color-accent)]/40 md:left-8 md:top-6 md:text-[6rem]"
          style={{ transform: "translateZ(20px)" }}
        >
          &ldquo;
        </span>

        <blockquote
          className="relative z-10 border-l-2 border-[var(--color-accent)] py-2 pl-6 md:pl-8"
          style={{ transform: "translateZ(12px)" }}
        >
          {/* Reserves the card's final size (see IMPLEMENTATION NOTES
              above) so the typing reveal never shifts layout. */}
          <div className="relative">
            <p aria-hidden="true" className={`invisible ${quoteTextClasses}`}>
              &ldquo;{quote}&rdquo;
            </p>
            <p
              className={`absolute inset-0 text-white/90 ${quoteTextClasses}`}
            >
              &ldquo;{revealedText}
              <span
                aria-hidden="true"
                className={`quote-screen-cursor ${isComplete ? "quote-screen-cursor--idle" : ""}`}
              >
                |
              </span>
              {isComplete ? "\u201d" : null}
            </p>
          </div>
        </blockquote>

        {/* Footer — attribution on the left, live/receiving status on
            the right. Flips from "Receiving" to "Active" once the
            quote finishes typing. */}
        <div
          className="relative z-10 mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-white/30 md:mt-10"
          style={{ transform: "translateZ(12px)" }}
        >
          <ScrambleText as="span" variant="micro">
            {source ?? "Statement"}
          </ScrambleText>
          <span className="inline-flex shrink-0 items-center gap-1.5">
            <StatusDot />
            <ScrambleText as="span" variant="micro">
              {isComplete ? "Active" : "Receiving"}
            </ScrambleText>
          </span>
        </div>

        <CornerBrackets />
      </div>
    </TiltCard>
  );
}
