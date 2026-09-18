"use client";

import type { CSSProperties } from "react";
import styles from "./Header.module.css";

interface HorizontalStaggerProps {
  active: boolean;
  className?: string;
  rows?: number;
}

/** A compact left-to-right stripe wipe shared by header interactions. */
export default function HorizontalStagger({
  active,
  className = "bg-purple-accent",
  rows = 5,
}: HorizontalStaggerProps) {
  return (
    <span
      data-active={active}
      aria-hidden="true"
      className={`${styles.wipe} pointer-events-none absolute inset-0 overflow-hidden`}
    >
      {Array.from({ length: rows }, (_, index) => (
        <span
          key={index}
          data-header-stripe
          className={`${styles.stripe} absolute left-0 w-full origin-left ${className}`}
          style={
            {
              top: `${(index / rows) * 100}%`,
              height: `${100 / rows + 0.5}%`,
              "--stripe-in": `${index * 22}ms`,
              "--stripe-out": `${(rows - index - 1) * 16}ms`,
            } as CSSProperties
          }
        />
      ))}
    </span>
  );
}
