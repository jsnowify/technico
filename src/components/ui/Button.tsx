"use client";

import { useId, useState, type CSSProperties } from "react";

import Link from "next/link";
import styles from "./Button.module.css";

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

  // Beveled editorial buttons are rendered in the shared block below.
  "purple-fill": "",
  "pink-fill": "",

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

  if (variant === "purple-fill" || variant === "pink-fill") {
    const isPink = variant === "pink-fill";
    const widths: Record<ButtonSize, string> = {
      sm: "140px",
      md: "180px",
      lg: "220px",
    };
    const heights: Record<ButtonSize, string> = {
      sm: "42px",
      md: "clamp(46px, 3.5vw, 50px)",
      lg: "clamp(52px, 4vw, 58px)",
    };
    const cut = size === "sm" ? "8px" : "10px";
    const wipeColor = isPink
      ? "var(--color-accent)"
      : "var(--color-accent-light)";

    return (
      <Link
        data-button-fill
        href={to}
        aria-label={children}
        data-cursor="highlight"
        className={`${styles.fill} relative isolate inline-flex max-w-full shrink-0 items-center justify-center overflow-hidden font-mono font-medium tracking-[-0.035em] text-black-bg uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black-bg`}
        style={{
          width: "fit-content",
          minWidth: `min(${widths[size]}, 100%)`,
          maxWidth: "100%",
          minHeight: heights[size],
          padding: "14px 8px",
          backgroundColor: isPink
            ? "var(--color-accent-light)"
            : "var(--color-accent)",
          // Screenshot's cut top-left and bottom-right corners.
          clipPath: `polygon(${cut} 0, 100% 0, 100% calc(100% - ${cut}), calc(100% - ${cut}) 100%, 0 100%, 0 ${cut})`,
        }}
      >
        {/* 8 full-width horizontal sheets, alternately entering from
            the left and right, exactly like the page transition. */}
        {Array.from({ length: 8 }, (_, index) => (
          <span
            key={index}
            data-button-wipe
            aria-hidden="true"
            className={`${styles.sheet} pointer-events-none absolute left-0 w-full`}
            style={
              {
                top: `${(index * 100) / 8}%`,
                height: `calc(${100 / 8}% + 1px)`,
                "--button-band": index,
                transformOrigin:
                  index % 2 === 0 ? "left center" : "right center",
                backgroundColor: wipeColor,
              } as CSSProperties
            }
          />
        ))}
        <span
          className={`pointer-events-none relative z-10 min-w-0 px-3 text-center leading-[1.35] whitespace-normal ${
            size === "sm"
              ? "text-[11px] sm:text-[12px]"
              : size === "lg"
                ? "text-[clamp(13px,1.05vw,16px)]"
                : "text-[clamp(12px,0.9vw,14px)]"
          }`}
        >
          {children}
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
    return (
      <Link
        href={to}
        aria-label={children}
        data-cursor="highlight"
        className={`${styles.underline} relative inline-flex items-center gap-1.5 text-white-text`}
      >
        {/* Label + underline sweep */}
        <span className="relative inline-block">
          <span className="font-sans text-[15px] font-medium tracking-tight whitespace-nowrap uppercase">
            {children}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 -bottom-1.5 h-[3px] overflow-hidden"
          >
            {Array.from({ length: 3 }, (_, index) => (
              <span
                key={index}
                data-underline-wipe
                className={`${styles.underlineSheet} absolute left-0 w-full bg-accent`}
                style={
                  {
                    top: `${(index * 100) / 3}%`,
                    height: `calc(${100 / 3}% + 0.5px)`,
                    "--button-band": index,
                    transformOrigin:
                      index % 2 === 0 ? "left center" : "right center",
                  } as CSSProperties
                }
              />
            ))}
          </span>
        </span>

        {/* Arrow — same fly-out/fly-in swap as purple-fill */}
        <span className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${styles.arrowOut} absolute h-5 w-5`}
            style={{ transformOrigin: "50% 50%" }}
            aria-hidden="true"
          >
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>

          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${styles.arrowIn} absolute h-5 w-5`}
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
        className="relative inline-flex h-[var(--btn-h)] items-center"
        style={
          {
            contain: "layout paint",
            // Single source of truth for the pill's size at any
            // viewport width -- 36px tall/14px arrows on a small
            // phone up to 44px tall/16px arrows on desktop, scaling
            // continuously instead of jumping at breakpoints.
            "--btn-h": "clamp(2.25rem, 1.85rem + 1.9vw, 2.75rem)",
            "--btn-px": "clamp(1rem, 0.75rem + 1vw, 1.5rem)",
            "--btn-text": "clamp(0.75rem, 0.65rem + 0.45vw, 0.875rem)",
            "--btn-icon": "clamp(0.875rem, 0.8rem + 0.3vw, 1rem)",
          } as React.CSSProperties
        }
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
              h-[var(--btn-h)]
              items-center
              justify-center
              whitespace-nowrap
              rounded-full
              bg-purple-accent
              px-[var(--btn-px)]
              text-[length:var(--btn-text)]
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
              h-[var(--btn-h)]
              w-[var(--btn-h)]
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
              h-[var(--btn-h)]
              items-center
              justify-center
              overflow-hidden
              px-[var(--btn-px)]
              text-[length:var(--btn-text)]
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
              h-[var(--btn-h)]
              w-[var(--btn-h)]
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
                h-[var(--btn-icon)]
                w-[var(--btn-icon)]
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
