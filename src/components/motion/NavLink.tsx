"use client";

import { useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  prefersReducedMotion,
  supportsFinePointer,
} from "../../lib/gsap";
import TransitionLink from "../layout/TransitionLink";
import SlidingText from "./SlidingText";

/* ================================================================
   NAV LINK
   ================================================================
   Single shared link used by both Header (nav items + the Services
   trigger) and Footer (nav column + social/connect column). Merges
   what used to be two separate, near-identical implementations:
   Header's NavItem and Footer's MagneticSlideLink.

     1. MAGNETIC — inner span drifts a few px toward the pointer
        inside a radius around the link's center, snaps back on
        leave.
     2. SLIDING TEXT — delegated to the shared <SlidingText>.
     3. BRACKETS — "[ " / " ]" spread a few px further apart on
        hover.

   All three skip outright under prefersReducedMotion or on
   coarse-pointer devices.

   HOVER STATE:
   By default this component tracks its own hover internally
   (isHovered), which is all Footer needs. Header needs more than
   that — e.g. the Services trigger should stay visually "active"
   while a floating dropdown panel (not the link itself) has the
   pointer. So hover state can optionally be controlled from outside:
   pass `active` and the internal isHovered is ignored in favor of
   it, and `onHoverStart`/`onHoverEnd` fire instead of touching
   internal state directly.
   ================================================================ */

const MAGNETIC_MAX_X = 10;
const MAGNETIC_MAX_Y = 7;
const MAGNETIC_STRENGTH = 0.42;
const MAGNETIC_RADIUS = 110;
const MAGNETIC_PULL_DURATION = 0.22;

const BRACKET_IDLE_OFFSET = 5;
const BRACKET_HOVER_OFFSET = 8;

const clamp = (value: number, max: number) =>
  Math.max(-max, Math.min(max, value));

type NavLinkProps = {
  label: string;
  /** Internal route — renders via TransitionLink. Mutually exclusive with `href`. */
  to?: string;
  /** External/mailto/etc. — renders via a plain <a>. Mutually exclusive with `to`. */
  href?: string;
  className?: string;

  /**
   * Controlled hover state, for Header's use case (a parent nav
   * tracks which single item is active across the whole row, and a
   * floating dropdown panel needs to be able to keep this item
   * looking hovered even when the pointer has left it). Footer
   * doesn't need this — omit it and the component manages its own
   * hover state internally.
   */
  active?: boolean;
  /** Fires instead of internal hover state when `active` is controlled. */
  onHoverStart?: () => void;
  onHoverEnd?: () => void;

  /** Fades the label toward a lower-opacity variant of the base color. */
  dimmed?: boolean;
  /** Swaps between light-on-dark and dark-on-light text color. Header only. */
  scrolled?: boolean;
  ariaExpanded?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export default function NavLink({
  label,
  to,
  href,
  className = "",
  active,
  onHoverStart,
  onHoverEnd,
  dimmed = false,
  scrolled,
  ariaExpanded,
  onClick,
}: NavLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const magneticRef = useRef<HTMLSpanElement>(null);
  const magneticXRef = useRef<((value: number) => void) | null>(null);
  const magneticYRef = useRef<((value: number) => void) | null>(null);

  const [internalHovered, setInternalHovered] = useState(false);
  const isControlled = active !== undefined;
  const isHovered = isControlled ? active : internalHovered;

  const leftBracketRef = useRef<HTMLSpanElement>(null);
  const rightBracketRef = useRef<HTMLSpanElement>(null);

  /* MAGNETIC SETUP — reset must go through the same quickTo setters,
     never a competing gsap.to, or the internal tween quickTo relies
     on gets silently killed after enough hover cycles. */
  useGSAP(() => {
    const magnetic = magneticRef.current;
    if (!magnetic || prefersReducedMotion || !supportsFinePointer) return;

    const moveX = gsap.quickTo(magnetic, "x", {
      duration: MAGNETIC_PULL_DURATION,
      ease: "power3.out",
      overwrite: true,
    });
    const moveY = gsap.quickTo(magnetic, "y", {
      duration: MAGNETIC_PULL_DURATION,
      ease: "power3.out",
      overwrite: true,
    });

    magneticXRef.current = moveX;
    magneticYRef.current = moveY;

    return () => {
      magneticXRef.current = null;
      magneticYRef.current = null;
      gsap.killTweensOf(magnetic);
    };
  }, []);

  /* BRACKETS — spread apart a few px on hover. */
  useGSAP(
    () => {
      const left = leftBracketRef.current;
      const right = rightBracketRef.current;
      if (!left || !right) return;

      const offset = isHovered ? BRACKET_HOVER_OFFSET : BRACKET_IDLE_OFFSET;

      if (prefersReducedMotion) {
        gsap.set(left, { x: -offset });
        gsap.set(right, { x: offset });
        return;
      }

      gsap.to(left, {
        x: -offset,
        duration: 0.26,
        ease: "power3.out",
        overwrite: true,
      });
      gsap.to(right, {
        x: offset,
        duration: 0.26,
        ease: "power3.out",
        overwrite: true,
      });
    },
    { dependencies: [isHovered] },
  );

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (
      prefersReducedMotion ||
      !supportsFinePointer ||
      event.pointerType !== "mouse" ||
      !magneticXRef.current ||
      !magneticYRef.current ||
      !linkRef.current
    ) {
      return;
    }

    const rect = linkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = event.clientX - centerX;
    const offsetY = event.clientY - centerY;
    const distance = Math.hypot(offsetX, offsetY);

    const linear = Math.max(0, 1 - distance / MAGNETIC_RADIUS);
    const falloff = linear * linear * (3 - 2 * linear);

    const targetX = clamp(
      offsetX * MAGNETIC_STRENGTH * falloff,
      MAGNETIC_MAX_X,
    );
    const targetY = clamp(
      offsetY * MAGNETIC_STRENGTH * falloff,
      MAGNETIC_MAX_Y,
    );

    magneticXRef.current(targetX);
    magneticYRef.current(targetY);
  };

  const resetMagnetic = () => {
    if (!magneticXRef.current || !magneticYRef.current) return;
    magneticXRef.current(0);
    magneticYRef.current(0);
  };

  const colorClasses =
    scrolled === undefined
      ? "" // Footer / non-color-swapping callers: color comes entirely from `className`.
      : scrolled
        ? dimmed
          ? "text-black/35"
          : "text-black"
        : dimmed
          ? "text-white/40"
          : "text-white";

  const sharedProps = {
    ref: linkRef,
    "aria-label": label,
    "aria-expanded": ariaExpanded,
    onClick,
    onPointerEnter: () => {
      if (isControlled) {
        onHoverStart?.();
      } else {
        setInternalHovered(true);
      }
    },
    onPointerMove: handlePointerMove,
    onPointerLeave: () => {
      resetMagnetic();
      if (isControlled) {
        onHoverEnd?.();
      } else {
        setInternalHovered(false);
      }
    },
    className: `relative inline-flex items-center transition-colors duration-300 ${colorClasses} ${className}`,
  };

  const inner = (
    <span
      ref={magneticRef}
      className="inline-flex items-center will-change-transform"
    >
      <span
        ref={leftBracketRef}
        aria-hidden="true"
        className="inline-block will-change-transform"
        style={{ transform: `translateX(-${BRACKET_IDLE_OFFSET}px)` }}
      >
        [
      </span>

      <SlidingText
        text={label}
        isHovered={isHovered ?? false}
        className="mx-1"
      />

      <span
        ref={rightBracketRef}
        aria-hidden="true"
        className="inline-block will-change-transform"
        style={{ transform: `translateX(${BRACKET_IDLE_OFFSET}px)` }}
      >
        ]
      </span>
    </span>
  );

  if (to) {
    return (
      <TransitionLink to={to} {...sharedProps}>
        {inner}
      </TransitionLink>
    );
  }

  return (
    <a href={href} {...sharedProps}>
      {inner}
    </a>
  );
}
