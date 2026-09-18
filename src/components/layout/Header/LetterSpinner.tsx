"use client";

import { prefersReducedMotion } from "@/lib/gsap";

interface LetterSpinnerProps {
  text: string;
  active: boolean;
}

/** Rolls a second copy of every character into the first copy's position. */
export default function LetterSpinner({ text, active }: LetterSpinnerProps) {
  const letters = Array.from(text);

  return (
    <span aria-hidden="true" className="inline-flex">
      {letters.map((letter, index) => {
        const glyph = letter === " " ? "\u00a0" : letter;
        const staggerIndex = active ? index : letters.length - index - 1;
        const transition = {
          transitionDelay: `${staggerIndex * 25}ms`,
          transitionDuration: prefersReducedMotion ? "0ms" : "420ms",
          transitionProperty: "transform",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        };

        return (
          <span
            key={`${letter}-${index}`}
            className="relative inline-block h-[1em] overflow-hidden leading-none"
          >
            <span
              className="block motion-reduce:transition-none"
              style={{
                ...transition,
                transform: active ? "translateY(-100%)" : "translateY(0%)",
              }}
            >
              {glyph}
            </span>
            <span
              className="absolute inset-0 motion-reduce:transition-none"
              style={{
                ...transition,
                transform: active ? "translateY(0%)" : "translateY(100%)",
              }}
            >
              {glyph}
            </span>
          </span>
        );
      })}
    </span>
  );
}
