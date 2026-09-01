"use client";

import Link from "next/link";

interface LogoProps {
  scrolled: boolean;
  siteName: string;
}

/**
 * LOGO ASSETS: /public/technico-digitals-solutions-inc-logo-white.svg
 *              /public/technico-digitals-solutions-inc-logo-black.svg
 *
 * Two pre-colored lockups, swapped by `scrolled`:
 *  - normal / TOP_STATE (transparent top bar, not yet scrolled) ->
 *    white logo
 *  - once the scroll-triggered morph animation kicks in and the
 *    header settles into PILL_STATE -> black logo, matching the
 *    rest of the header's scrolled palette (nav text + burger icon
 *    flip to black at the same threshold).
 *
 * Both are stacked in the same box and cross-faded with opacity
 * instead of swapping `src` outright, so the change reads as a
 * smooth transition alongside the header morph rather than a pop.
 *
 * SIZE: the mark is 36px on phones, 40px on small tablets, and only
 * reaches its original 48px from lg: up. The wordmark is hidden below
 * sm: (640px): mark-only on the smallest screens, full lockup from
 * sm: up.
 */
const LOGO_WHITE = "/technico-digitals-solutions-inc-logo-white.svg";
const LOGO_BLACK = "/technico-digitals-solutions-inc-logo-black.svg";

export default function Logo({ scrolled, siteName }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={siteName}
      className="group relative z-10 flex items-center gap-2 sm:gap-3"
    >
      <span className="relative block h-9 w-9 shrink-0 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
        <img
          src={LOGO_WHITE}
          alt=""
          aria-hidden="true"
          className={`
              absolute inset-0 h-full w-full object-contain
              transition-opacity duration-300
              ${scrolled ? "opacity-0" : "opacity-100"}
            `}
        />
        <img
          src={LOGO_BLACK}
          alt=""
          aria-hidden="true"
          className={`
              absolute inset-0 h-full w-full object-contain
              transition-opacity duration-300
              ${scrolled ? "opacity-100" : "opacity-0"}
            `}
        />
      </span>

      {/* WORDMARK — only exists in the normal (unscrolled) state.
          Visible by default from sm: up; on hover of the lockup it
          fades out. Disappears entirely once the header morphs into
          the pill, leaving just the mark. */}
      {!scrolled && (
        <span className="hidden overflow-hidden sm:inline-block">
          <span
            className="
                block
                translate-x-0
                font-mono
                text-xs
                font-semibold
                uppercase
                tracking-[0.1em]
                text-white
                opacity-100
                transition-all
                duration-300
                ease-out
                group-hover:-translate-x-2
                group-hover:opacity-0
                sm:text-sm
                sm:tracking-[0.14em]
              "
          >
            TECHNICO
          </span>
        </span>
      )}
    </Link>
  );
}
