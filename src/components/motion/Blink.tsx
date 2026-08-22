import { useState, type ElementType, type ReactNode } from "react";
import { prefersReducedMotion } from "../../lib/gsap";

type BlinkProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** How far opacity dips during the blink, 0–1. */
  intensity?: number;
};

/**
 * Organic "living system" flicker for small labels/metadata — one
 * soft, brief opacity dip inside a long, per-instance-randomized
 * cycle (7–15s), then a long hold at full opacity before it repeats.
 * Pure CSS (see `technico-blink` keyframes in index.css), so there's
 * no per-frame JS cost no matter how many instances are on screen.
 * Randomized delay/duration per instance is what keeps multiple
 * labels from ever dipping in sync.
 */
export function Blink({
  children,
  as: Tag = "span",
  className,
  intensity = 0.4,
}: BlinkProps) {
  const [{ delay, duration }] = useState(() => ({
    delay: (Math.random() * 9).toFixed(2),
    duration: (7 + Math.random() * 8).toFixed(2),
  }));

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      style={{
        animation: `technico-blink ${duration}s ease-in-out ${delay}s infinite`,
        ["--blink-min" as string]: 1 - intensity,
      }}
    >
      {children}
    </Tag>
  );
}

type StatusDotProps = { className?: string };

/** Small accent-colored LED-style dot for "Online/Active" indicators. */
export function StatusDot({ className }: StatusDotProps) {
  const [{ delay, duration }] = useState(() => ({
    delay: (Math.random() * 6).toFixed(2),
    duration: (6 + Math.random() * 6).toFixed(2),
  }));

  return (
    <span
      aria-hidden="true"
      className={`inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] ${className ?? ""}`}
      style={
        prefersReducedMotion
          ? undefined
          : {
              animation: `technico-blink ${duration}s ease-in-out ${delay}s infinite`,
              ["--blink-min" as string]: 0.3,
            }
      }
    />
  );
}
