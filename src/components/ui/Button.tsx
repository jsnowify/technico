"use client";

import { useState } from "react";
import Link from "next/link";
import SlidingText from "@/components/motion/SlidingText";

type ButtonVariant = "primary" | "secondary" | "light";
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
  // Inverse of `primary` — a white pill for use on dark section
  // backgrounds, where `primary`'s black fill would disappear.
  light:
    "bg-white-primary text-black-primary hover:bg-black-primary hover:text-white-primary",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-w-[140px] px-6 py-3 text-[11px]",
  md: "min-w-[170px] px-8 py-4 text-xs",
  lg: "min-w-[200px] px-10 py-5 text-sm",
};

/**
 * Plain CTA button — no magnetic pointer-follow. `w-full` on mobile
 * so it reads as a fixed-size tap target matching whatever it's
 * stacked with, switching to auto-width from `sm:` up. Label uses
 * the shared SlidingText (same effect as the header nav) driven by
 * local hover state, so the current label slides up/out and a
 * duplicate slides in from below on hover.
 */
export default function Button({
  to,
  variant = "primary",
  size = "md",
  children,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={to}
      aria-label={children}
      data-cursor="highlight"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
          flex w-full items-center justify-center
          rounded-[5px]
          font-mono
          uppercase
          tracking-[0.14em]
          transition-colors
          duration-300
          sm:inline-flex sm:w-auto
          ${VARIANT_CLASSES[variant]}
          ${SIZE_CLASSES[size]}
        `}
    >
      <SlidingText text={children} isHovered={hovered} />
    </Link>
  );
}
