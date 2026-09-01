"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
  usePrefersReducedMotion,
} from "@/lib/gsap";

/* ================================================================
   STAT COUNTER
   ================================================================
   Same count-up-on-scroll behavior as the home Hero's stats bar,
   pulled out into its own component so it can be reused here (and
   anywhere else a "0 -> real value" stat is needed) instead of
   copy-pasted. One difference from Hero's inline version: Hero's
   regex only split a trailing suffix off the number (e.g.
   "2.5k+" -> "2.5" + "k+"). This section's values also carry a
   LEADING prefix ("$21.1B", "+16%", "#1"), so the parse below splits
   prefix + number + suffix instead of just number + suffix.

   Decimal places are read off the source value itself (e.g. "1.37M"
   keeps 2 decimals, "21.1" keeps 1) rather than Hero's hardcoded
   "1 decimal if there's a dot", so values with more precision still
   count up correctly.

   Same lifecycle as Hero: counts up from 0 the moment it scrolls
   into view (either direction), resets to 0 the moment it scrolls
   out, and replays every time it re-enters. Falls back to the plain
   final value with no animation under prefers-reduced-motion.
   ================================================================ */

interface StatCounterProps {
  value: string;
  className?: string;
}

// Zero-state text matching the value's own prefix/suffix/decimals
// (e.g. "$21.1B" -> "$0.0B"), shown until the count-up animates in.
function zeroState(value: string): string {
  const match = value.match(/^([^\d]*)([\d.]+)([^\d]*)$/);
  if (!match) return value;
  const [, prefix, number, suffix] = match;
  const decimals = number.includes(".") ? number.split(".")[1].length : 0;
  return `${prefix}${(0).toFixed(decimals)}${suffix}`;
}

export default function StatCounter({
  value,
  className = "",
}: StatCounterProps) {
  const reducedMotion = usePrefersReducedMotion();
  const elRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    const el = elRef.current;
    if (!el || prefersReducedMotion) return;

    const match = value.match(/^([^\d]*)([\d.]+)([^\d]*)$/);
    if (!match) return;

    const [, prefix, number, suffix] = match;
    const target = parseFloat(number);
    const decimals = number.includes(".") ? number.split(".")[1].length : 0;
    const counter = { val: 0 };

    const render = () => {
      el.textContent = `${prefix}${counter.val.toFixed(decimals)}${suffix}`;
    };

    let tween: gsap.core.Tween | null = null;
    const animateTo = (val: number, duration: number) => {
      tween?.kill();
      tween = gsap.to(counter, {
        val,
        duration,
        ease: val === 0 ? "power1.out" : "power2.out",
        onUpdate: render,
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => animateTo(target, 1.4),
      onEnterBack: () => animateTo(target, 1.4),
      onLeave: () => animateTo(0, 0.3),
      onLeaveBack: () => animateTo(0, 0.3),
    });

    return () => {
      tween?.kill();
      trigger.kill();
    };
  }, [value]);

  return (
    <p ref={elRef} className={className}>
      {reducedMotion ? value : zeroState(value)}
    </p>
  );
}
