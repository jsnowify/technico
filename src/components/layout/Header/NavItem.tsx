"use client";

import type { MouseEvent } from "react";
import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import HorizontalStagger from "./HorizontalStagger";
import LetterSpinner from "./LetterSpinner";
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

  const color = active
    ? "text-white"
    : scrolled
      ? dimmed
        ? "text-black/35"
        : "text-black"
      : dimmed
        ? "text-white/40"
        : "text-white";

  return (
    <Link
      href={href}
      aria-label={label}
      aria-expanded={ariaExpanded}
      onClick={onClick}
      onPointerEnter={() => onHoverStart?.()}
      onPointerLeave={() => onHoverEnd?.()}
      onFocus={() => onHoverStart?.()}
      onBlur={() => onHoverEnd?.()}
      className={`relative isolate inline-flex items-center overflow-hidden px-2 py-2 font-mono text-sm tracking-wide transition-colors duration-300 ${color}`}
    >
      <HorizontalStagger active={active} />

      <span className="relative z-10 inline-flex items-center">
        <span
          ref={leftBracketRef}
          aria-hidden="true"
          className="inline-block"
          style={{ transform: `translateX(-${BRACKET_IDLE_OFFSET}px)` }}
        >
          [
        </span>

        <LetterSpinner text={label} active={active} />

        <span
          ref={rightBracketRef}
          aria-hidden="true"
          className="inline-block"
          style={{ transform: `translateX(${BRACKET_IDLE_OFFSET}px)` }}
        >
          ]
        </span>
      </span>
    </Link>
  );
}
