"use client";

import Link from "next/link";
import { useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import HorizontalStagger from "@/components/layout/Header/HorizontalStagger";
import LetterSpinner from "@/components/layout/Header/LetterSpinner";

/**
 * The "Learn more" pill used on the /services gallery: a bordered button
 * with a staggered fill sweep, a letter-spinner label swap, and an arrow
 * that slides out/in on hover/focus. Shared so other sections (e.g. the
 * home services list) can reuse the same interaction instead of a plain
 * link.
 */
export default function ServiceLearnMore({
  href,
  title,
  dark,
  className = "",
}: {
  href: string;
  title: string;
  dark: boolean;
  /** Extra classes for margin/grid placement in the calling section. */
  className?: string;
}) {
  const [active, setActive] = useState(false);

  const handlePointerEnter = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "touch") setActive(true);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "touch") setActive(false);
  };

  return (
    <Link
      href={href}
      data-cursor="circle"
      aria-label={`Learn more about ${title}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={`group/link relative isolate inline-flex min-h-11 items-center overflow-hidden border px-4 font-mono text-[11px] tracking-[-0.025em] uppercase transition-[color,border-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-[12px] ${
        active
          ? "border-purple-accent text-black-bg"
          : dark
            ? "border-white-text/45 text-white-text"
            : "border-black-text/45 text-black-text"
      } ${dark ? "focus-visible:outline-white-text" : "focus-visible:outline-black-text"} ${className}`}
    >
      <HorizontalStagger active={active} rows={6} />

      <span className="relative z-10 inline-flex items-center gap-5 leading-none">
        <LetterSpinner text="Learn more" active={active} />

        <span aria-hidden="true" className="relative h-4 w-5 overflow-hidden">
          {[false, true].map((incoming) => (
            <svg
              key={String(incoming)}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className={`absolute inset-0 h-4 w-5 transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                incoming
                  ? active
                    ? "translate-x-0"
                    : "-translate-x-full"
                  : active
                    ? "translate-x-full"
                    : "translate-x-0"
              }`}
            >
              <path d="M3 12h17M14 6l6 6-6 6" />
            </svg>
          ))}
        </span>
      </span>
    </Link>
  );
}
