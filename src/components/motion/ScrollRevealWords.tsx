// src/components/motion/ScrollRevealWords.tsx
import { useMemo, useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

type ScrollRevealWordsProps = {
  children: string;
  as?: ElementType;
  className?: string;
  /**
   * ScrollTrigger start/end for the scrub range. Defaults assume the
   * block is roughly viewport-height sized; tighten `end` for shorter
   * blocks so the reveal doesn't finish too early.
   */
  start?: string;
  end?: string;
  /** Opacity of not-yet-revealed words. Lower = more dramatic. */
  dimOpacity?: number;
};

/**
 * Word-by-word reveal driven by scroll position (scrub, not
 * autoplay). Words are split at render time, not per-frame, so this
 * stays cheap even on long paragraphs.
 *
 * `scrub: 1.1` gives the animation a bit of inertia/lag behind the
 * actual scroll position — rather than tracking the scrollbar 1:1 —
 * which is what makes the reveal feel like it has weight instead of
 * snapping word-to-word as you scroll.
 */
export default function ScrollRevealWords({
  children,
  as: Tag = "p",
  className,
  start = "top 85%",
  end = "top 40%",
  dimOpacity = 0.16,
}: ScrollRevealWordsProps) {
  // Loosely typed on purpose — Tag is dynamic (p, h2, div, ...), so we
  // can't pin a single HTMLElement subtype at compile time.
  const containerRef = useRef<HTMLElement>(null);

  const words = useMemo(() => children.trim().split(/\s+/), [children]);

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const wordEls = el.querySelectorAll<HTMLElement>("[data-scroll-word]");
      if (!wordEls.length) return;

      if (prefersReducedMotion) {
        gsap.set(wordEls, { opacity: 1, filter: "blur(0px)" });
        return;
      }

      gsap.set(wordEls, {
        opacity: dimOpacity,
        filter: "blur(6px)",
      });

      gsap.to(wordEls, {
        opacity: 1,
        filter: "blur(0px)",
        ease: "none",
        stagger: {
          each: 1.4 / wordEls.length,
        },
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: 1.1,
        },
      });
    },
    {
      scope: containerRef,
      dependencies: [children, start, end, dimOpacity],
    },
  );

  return (
    <Tag ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block will-change-[filter,opacity]"
          data-scroll-word
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}
