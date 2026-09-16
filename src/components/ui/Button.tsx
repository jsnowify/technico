"use client";

import { useEffect, useId, useRef, useState } from "react";

import Link from "next/link";
import gsap from "gsap";

import SlidingText from "@/components/motion/SlidingText";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "light"
  | "white-static"
  | "purple"
  | "purple-fill"
  | "pink-fill"
  | "underline"
  | "outline";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: string;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-black-primary text-white-primary",

  secondary:
    "border border-black-primary text-black-primary hover:bg-black-primary hover:text-white-primary",

  // White pill for dark section backgrounds.
  light:
    "bg-white-primary text-black-primary hover:bg-black-primary hover:text-white-primary",

  // White pill that stays white on hover.
  "white-static":
    "bg-white-primary text-black-primary hover:bg-white-primary hover:text-black-primary",

  // Purple organic goo pill + arrow circle. Rendered separately below.
  purple: "bg-purple-accent text-white-primary",

  // Purple pill with a fill-expanding circle. Rendered separately below.
  "purple-fill": "bg-[#A78BFA] text-white-primary",

  // Pink pill with a fill-expanding circle — same mechanic as
  // "purple-fill", just recolored. Rendered separately below.
  "pink-fill": "bg-[#FE96C9] text-white-primary",

  // Text link with a hover underline sweep. Rendered separately below,
  // not used here.
  underline: "",

  // Dark outline pill + arrow circle that pops solid on hover.
  // Rendered separately below, not used here.
  outline: "",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-w-[140px] px-6 py-3 text-[11px]",
  md: "min-w-[170px] px-8 py-4 text-xs",
  lg: "min-w-[200px] px-10 py-5 text-sm",
};

export default function Button({
  to,
  variant = "primary",
  size = "md",
  children,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const filterId = useId();

  // Refs used only by the "purple-fill" / "pink-fill" variants (same
  // circle-expand mechanic, just recolored). Declared unconditionally
  // (Rules of Hooks) — simply unused for the other variants.
  const fillLinkRef = useRef<HTMLAnchorElement>(null);
  const fillCircleRef = useRef<HTMLSpanElement>(null);
  const fillArrowOutRef = useRef<SVGSVGElement>(null);
  const fillArrowInRef = useRef<SVGSVGElement>(null);
  const fillTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Refs used only by the "underline" variant.
  const underlineBarRef = useRef<HTMLSpanElement>(null);
  const underlineArrowOutRef = useRef<SVGSVGElement>(null);
  const underlineArrowInRef = useRef<SVGSVGElement>(null);
  const underlineTimelineRef = useRef<gsap.core.Timeline | null>(null);

  /*
   * ================================================================
   * PURPLE-FILL: circle expand hover
   * ================================================================
   * Light-purple pill with a darker purple circle inset on the
   * right, holding an up arrow. On hover the circle scales up from
   * its own center until it fully covers the pill (clipped by the
   * pill's rounded-full + overflow-hidden), so the button reads as
   * "filling" with the circle's color. The arrow itself does a
   * fly-out/fly-in swap: the resting arrow slides up-right and
   * fades out while a duplicate slides in from the bottom-left and
   * fades in, all in the same GSAP timeline as the circle so hover
   * in/out stays perfectly synced (reverse just plays it backwards).
   */
  useEffect(() => {
    if (variant !== "purple-fill" && variant !== "pink-fill") return;

    const button = fillLinkRef.current;
    const circle = fillCircleRef.current;
    const arrowOut = fillArrowOutRef.current;
    const arrowIn = fillArrowInRef.current;
    if (!button || !circle || !arrowOut || !arrowIn) return;

    const build = () => {
      const { width, height } = button.getBoundingClientRect();
      const circleSize = circle.offsetWidth;
      const inset = 6; // matches the p-1.5 padding on the pill

      // Distance from the circle's center to the pill's far corner —
      // the circle needs at least this much radius, scaled up, to
      // swallow the whole pill.
      const centerX = width - inset - circleSize / 2;
      const centerY = height / 2;
      const reach = Math.sqrt(centerX * centerX + centerY * centerY);
      const scale = (reach * 2.05) / circleSize;

      fillTimelineRef.current?.kill();
      gsap.set(circle, { scale: 1 });
      gsap.set(arrowOut, { x: 0, y: 0, opacity: 1, rotate: 45 });
      gsap.set(arrowIn, { x: -7, y: 7, opacity: 0, rotate: 45 });

      fillTimelineRef.current = gsap
        .timeline({ paused: true })
        .to(circle, { scale, duration: 0.6, ease: "power3.out" }, 0)
        .to(
          arrowOut,
          { x: 7, y: -7, opacity: 0, duration: 0.26, ease: "power2.in" },
          0,
        )
        .to(
          arrowIn,
          { x: 0, y: 0, opacity: 1, duration: 0.26, ease: "power2.out" },
          0.26,
        );
    };

    build();
    window.addEventListener("resize", build);
    return () => {
      window.removeEventListener("resize", build);
      fillTimelineRef.current?.kill();
    };
  }, [variant]);

  /*
   * ================================================================
   * UNDERLINE: text link with a hover underline sweep
   * ================================================================
   * Plain text label, no pill. On hover a thin bar sweeps in from
   * the left (scaleX 0 → 1, transform-origin left) in the accent
   * color. The arrow uses the exact same fly-out/fly-in swap as
   * "purple-fill" — out arrow flies clear before the in arrow
   * starts, so there's no double-arrow ghost — all on one timeline
   * so hover-out is just the same motion in reverse.
   */
  useEffect(() => {
    if (variant !== "underline") return;

    const bar = underlineBarRef.current;
    const arrowOut = underlineArrowOutRef.current;
    const arrowIn = underlineArrowInRef.current;
    if (!bar || !arrowOut || !arrowIn) return;

    underlineTimelineRef.current?.kill();
    gsap.set(bar, { scaleX: 0 });
    gsap.set(arrowOut, { x: 0, y: 0, opacity: 1, rotate: 45 });
    gsap.set(arrowIn, { x: -7, y: 7, opacity: 0, rotate: 45 });

    underlineTimelineRef.current = gsap
      .timeline({ paused: true })
      .to(bar, { scaleX: 1, duration: 0.45, ease: "power3.out" }, 0)
      .to(
        arrowOut,
        { x: 7, y: -7, opacity: 0, duration: 0.26, ease: "power2.in" },
        0,
      )
      .to(
        arrowIn,
        { x: 0, y: 0, opacity: 1, duration: 0.26, ease: "power2.out" },
        0.26,
      );

    return () => {
      underlineTimelineRef.current?.kill();
    };
  }, [variant]);

  if (variant === "purple-fill") {
    const handleEnter = () => {
      setHovered(true);
      fillTimelineRef.current?.play();
    };
    const handleLeave = () => {
      setHovered(false);
      fillTimelineRef.current?.reverse();
    };

    return (
      <Link
        ref={fillLinkRef}
        href={to}
        aria-label={children}
        data-cursor="highlight"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative inline-flex h-11 items-center overflow-hidden rounded-full bg-[#A78BFA] p-1.5"
      >
        {/* Expanding fill circle — sits below the label/arrow layer */}
        <span
          ref={fillCircleRef}
          aria-hidden="true"
          className="absolute top-1/2 right-1.5 z-0 h-8 w-8 -translate-y-1/2 rounded-full bg-[#6D28D9]"
          style={{ transformOrigin: "50% 50%", willChange: "transform" }}
        />

        {/* Label */}
        <span className="relative z-10 flex h-8 items-center pr-2 pl-4 text-[14px] font-light tracking-tight whitespace-nowrap text-white-primary uppercase">
          {children}
        </span>

        {/* Arrow circle */}
        <span className="relative z-10 ml-auto flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
          {/* Outgoing arrow — flies up-right and fades out on hover */}
          <svg
            ref={fillArrowOutRef}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute h-4 w-4 text-white-primary"
            style={{ transformOrigin: "50% 50%" }}
            aria-hidden="true"
          >
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>

          {/* Incoming arrow — starts bottom-left, slides in and fades on hover */}
          <svg
            ref={fillArrowInRef}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute h-4 w-4 text-white-primary opacity-0"
            style={{ transformOrigin: "50% 50%" }}
            aria-hidden="true"
          >
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </span>
      </Link>
    );
  }

  /*
   * ================================================================
   * PINK-FILL: circle expand hover
   * ================================================================
   * Identical mechanic to "purple-fill" (see above) — light pink
   * pill (#FE96C9) with a darker pink circle (#EC4899) that expands
   * to fill it on hover — just recolored for pink CTAs.
   */
  if (variant === "pink-fill") {
    const handleEnter = () => {
      setHovered(true);
      fillTimelineRef.current?.play();
    };
    const handleLeave = () => {
      setHovered(false);
      fillTimelineRef.current?.reverse();
    };

    return (
      <Link
        ref={fillLinkRef}
        href={to}
        aria-label={children}
        data-cursor="highlight"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative inline-flex h-11 items-center overflow-hidden rounded-full bg-[#FE96C9] p-1.5"
      >
        {/* Expanding fill circle — sits below the label/arrow layer */}
        <span
          ref={fillCircleRef}
          aria-hidden="true"
          className="absolute top-1/2 right-1.5 z-0 h-8 w-8 -translate-y-1/2 rounded-full bg-[#EC4899]"
          style={{ transformOrigin: "50% 50%", willChange: "transform" }}
        />

        {/* Label */}
        <span className="relative z-10 flex h-8 items-center pr-2 pl-4 text-[14px] font-light tracking-tight whitespace-nowrap text-white-primary uppercase">
          {children}
        </span>

        {/* Arrow circle */}
        <span className="relative z-10 ml-auto flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
          {/* Outgoing arrow — flies up-right and fades out on hover */}
          <svg
            ref={fillArrowOutRef}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute h-4 w-4 text-white-primary"
            style={{ transformOrigin: "50% 50%" }}
            aria-hidden="true"
          >
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>

          {/* Incoming arrow — starts bottom-left, slides in and fades on hover */}
          <svg
            ref={fillArrowInRef}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute h-4 w-4 text-white-primary opacity-0"
            style={{ transformOrigin: "50% 50%" }}
            aria-hidden="true"
          >
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </span>
      </Link>
    );
  }

  /*
   * ================================================================
   * UNDERLINE TEXT LINK
   * ================================================================
   * Plain uppercase label + arrow, no pill background — for use on
   * dark sections. Underline sweeps in from the left on hover in
   * the accent pink, and the arrow reuses the purple-fill fly swap.
   */
  if (variant === "underline") {
    const handleEnter = () => underlineTimelineRef.current?.play();
    const handleLeave = () => underlineTimelineRef.current?.reverse();

    return (
      <Link
        href={to}
        aria-label={children}
        data-cursor="highlight"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative inline-flex items-center gap-1.5 text-white-primary"
      >
        {/* Label + underline sweep */}
        <span className="relative inline-block">
          <span className="font-sans text-[15px] font-medium tracking-tight whitespace-nowrap uppercase">
            {children}
          </span>
          <span
            ref={underlineBarRef}
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-1 h-[2px] origin-left bg-[#EC4899]"
            style={{ transform: "scaleX(0)" }}
          />
        </span>

        {/* Arrow — same fly-out/fly-in swap as purple-fill */}
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden">
          <svg
            ref={underlineArrowOutRef}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute h-5 w-5 text-white-primary"
            style={{ transformOrigin: "50% 50%" }}
            aria-hidden="true"
          >
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>

          <svg
            ref={underlineArrowInRef}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute h-5 w-5 text-white-primary opacity-0"
            style={{ transformOrigin: "50% 50%" }}
            aria-hidden="true"
          >
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </span>
      </Link>
    );
  }

  /*
   * ================================================================
   * PURPLE GOO BUTTON
   * ================================================================
   *
   * Organic pill shape inspired by the reference:
   *
   *   ┌──────────────────────────╮
   *   │     Start a project      │  ↗
   *   └──────────────────────────╯
   *
   * At rest, the arrow circle slightly overlaps the pill.
   * On hover, it pulls away with an elastic movement.
   */
  if (variant === "purple") {
    return (
      <Link
        href={to}
        aria-label={children}
        data-cursor="highlight"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative inline-flex h-11 items-center"
        style={{
          contain: "layout paint",
        }}
      >
        {/* ============================================================
            SVG GOO FILTER
            Only the background shape layer uses this.
        ============================================================ */}
        <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
          <defs>
            <filter
              id={filterId}
              x="-30%"
              y="-40%"
              width="160%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              {/* Softens the intersection */}
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="7"
                result="blur"
              />

              {/* Converts the blur into a solid organic silhouette */}
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 28 -14
                "
                result="goo"
              />
            </filter>
          </defs>
        </svg>

        {/* ============================================================
            ORGANIC SHAPE LAYER
            This is the only layer affected by the goo filter.
        ============================================================ */}
        <div
          className="absolute inset-0 flex items-center"
          style={{
            filter: `url(#${filterId})`,
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        >
          {/* Main pill */}
          <span
            aria-hidden="true"
            className="
              flex
              h-11
              items-center
              justify-center
              whitespace-nowrap
              rounded-full
              bg-purple-accent
              px-6
              text-[14px]
              font-light
              tracking-tight
              text-transparent
              uppercase
            "
          >
            {children}
          </span>

          {/* Arrow circle / organic blob */}
          <span
            aria-hidden="true"
            className="
              h-11
              w-11
              shrink-0
              rounded-full
              bg-purple-accent
              transition-[margin]
              duration-[450ms]
              ease-[cubic-bezier(0.34,1.56,0.64,1)]
            "
            style={{
              /*
               * Smaller overlap than your original -16px.
               * This gives the junction a cleaner, more controlled
               * organic shape.
               */
              marginLeft: hovered ? "14px" : "-10px",
            }}
          />
        </div>

        {/* ============================================================
            CRISP CONTENT LAYER
            Completely unaffected by the goo filter.
        ============================================================ */}
        <div className="relative flex items-center">
          {/* Text */}
          <span
            className="
              flex
              h-11
              items-center
              justify-center
              overflow-hidden
              px-6
              text-[14px]
              font-light
              tracking-tight
              whitespace-nowrap
              text-white
              uppercase
            "
          >
            {children}
          </span>

          {/* Arrow */}
          <span
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              transition-[margin]
              duration-[450ms]
              ease-[cubic-bezier(0.34,1.56,0.64,1)]
            "
            style={{
              marginLeft: hovered ? "14px" : "-10px",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="
                h-4
                w-4
                text-white
                transition-transform
                duration-[450ms]
                ease-out
              "
              style={{
                transform: hovered ? "rotate(0deg)" : "rotate(-45deg)",
              }}
              aria-hidden="true"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </div>
      </Link>
    );
  }

  /*
   * ================================================================
   * OUTLINE PILL + ARROW CIRCLE
   * ================================================================
   *
   * Reference behavior (from user-supplied clip): a dark outline
   * pill where the arrow sits tucked in close (subtle, blended)
   * at rest, then on hover pops into a solid purple-accent circle
   * and slides away with the same elastic ease the purple variant
   * uses — same interaction language as "purple", just recolored
   * for a secondary/dark pill instead of a solid-fill primary one.
   * No SVG goo-merge filter here (that only reads well on a solid
   * fill pill); the border needs to stay crisp, so this is a plain
   * flex layout instead.
   */
  if (variant === "outline") {
    return (
      <Link
        href={to}
        aria-label={children}
        data-cursor="highlight"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative inline-flex h-11 items-center rounded-full border border-white/15 bg-white/[0.04] py-1 pr-1.5 pl-7 transition-colors duration-300 hover:border-white/30"
      >
        <span className="flex h-full items-center overflow-hidden whitespace-nowrap text-[14px] font-light tracking-tight text-white uppercase">
          {children}
        </span>

        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-[margin,background-color] duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:bg-purple-accent"
          style={{ marginLeft: hovered ? "10px" : "-4px" }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-white transition-transform duration-[450ms] ease-out"
            style={{ transform: hovered ? "rotate(0deg)" : "rotate(-45deg)" }}
            aria-hidden="true"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
      </Link>
    );
  }

  /*
   * ================================================================
   * STANDARD BUTTONS
   * ================================================================
   */
  return (
    <Link
      href={to}
      aria-label={children}
      data-cursor="highlight"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        flex
        w-full
        items-center
        justify-center
        rounded-[5px]
        font-mono
        uppercase
        tracking-[0.14em]
        transition-colors
        duration-300
        sm:inline-flex
        sm:w-auto
        ${VARIANT_CLASSES[variant]}
        ${SIZE_CLASSES[size]}
      `}
    >
      <SlidingText text={children} isHovered={hovered} />
    </Link>
  );
}
