"use client";

import type { MouseEvent } from "react";
import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useMagneticHover } from "@/lib/hooks/useMagneticHover";
import SlidingText from "@/components/motion/SlidingText";
import { BRACKET_HOVER_OFFSET, BRACKET_IDLE_OFFSET } from "./header.config";

interface NavItemProps {
  label: string;
  href: string;
  active: boolean;
  dimmed: boolean;
  scrolled: boolean;
  ariaExpanded?: boolean;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export default function NavItem({
  label,
  href,
  active,
  dimmed,
  scrolled,
  ariaExpanded,
  onHoverStart,
  onHoverEnd,
  onClick,
}: NavItemProps) {
  const leftBracketRef = useRef<HTMLSpanElement>(null);
  const rightBracketRef = useRef<HTMLSpanElement>(null);

  /* ==============================================================
      MAGNETIC PULL

      The pointer position is always measured against the stationary
      `boundsRef` (the <a>), never against `targetRef` (the inner
      span that actually moves) — boundsRef is the stable coordinate
      system the pull is calculated from.
      ============================================================== */
  const { targetRef, boundsRef, handlePointerMove, reset } = useMagneticHover<
    HTMLSpanElement,
    HTMLAnchorElement
  >();

  /* ==============================================================
      BRACKET ANIMATION
      ============================================================== */
  useGSAP(
    () => {
      const left = leftBracketRef.current;
      const right = rightBracketRef.current;

      if (!left || !right) return;

      const offset = active ? BRACKET_HOVER_OFFSET : BRACKET_IDLE_OFFSET;

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
    { dependencies: [active] },
  );

  /* ==============================================================
      RENDER

      TEXT COLOR:

      Normal state (not scrolled, transparent top bar)   -> text-white
      Scrolled / white pill state                        -> text-black

      The "dimmed" hover-fade behavior is preserved in both states,
      it just fades toward the appropriate base color.
      ============================================================== */
  return (
    <Link
      ref={boundsRef}
      href={href}
      aria-label={label}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      onPointerEnter={() => onHoverStart?.()}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        reset();
        onHoverEnd?.();
      }}
      className={`
          relative
          inline-flex
          items-center
          font-mono
          text-sm
          tracking-wide
          transition-colors
          duration-300
          ${
            scrolled
              ? dimmed
                ? "text-black/35"
                : "text-black"
              : dimmed
                ? "text-white/40"
                : "text-white"
          }
        `}
    >
      <span
        ref={targetRef}
        className="inline-flex items-center will-change-transform"
      >
        {/* LEFT BRACKET */}
        <span
          ref={leftBracketRef}
          aria-hidden="true"
          className="inline-block will-change-transform"
          style={{ transform: `translateX(-${BRACKET_IDLE_OFFSET}px)` }}
        >
          [
        </span>

        {/* TEXT */}
        <SlidingText text={label} isHovered={active} />

        {/* RIGHT BRACKET */}
        <span
          ref={rightBracketRef}
          aria-hidden="true"
          className="inline-block will-change-transform"
          style={{ transform: `translateX(${BRACKET_IDLE_OFFSET}px)` }}
        >
          ]
        </span>
      </span>
    </Link>
  );
}
