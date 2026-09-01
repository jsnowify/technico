"use client";

import { useState } from "react";
import Link from "next/link";
import SlidingText from "@/components/motion/SlidingText";

interface GlossyButtonProps {
  to: string;
  children: string;
}

/**
 * "Free Strategy" CTA — flat, static rectangle, same spacious
 * padding/sizing as ui/Button. No hover shape or color change of
 * any kind — the only thing that moves is the label, via the same
 * sliding-text swap as ui/Button. Fixed-size on mobile, no magnetic
 * hover.
 */
export default function GlossyButton({ to, children }: GlossyButtonProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={to}
      aria-label={children}
      data-cursor="highlight"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="
          flex w-full min-w-[200px] items-center justify-center
          rounded-[5px] bg-purple-secondary
          px-10 py-5
          font-mono text-sm uppercase tracking-[0.14em] text-white
          sm:inline-flex sm:w-auto
        "
    >
      <SlidingText text={children} isHovered={hovered} />
    </Link>
  );
}
