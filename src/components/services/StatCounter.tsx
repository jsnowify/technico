"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, usePrefersReducedMotion } from "@/lib/gsap";

interface StatCounterProps {
  value: string;
  className?: string;
}

function parseValue(value: string) {
  const match = value.match(/^([^\d]*)([\d.]+)([^\d]*)$/);
  if (!match) return null;

  const [, prefix, number, suffix] = match;
  return {
    prefix,
    target: Number.parseFloat(number),
    suffix,
    decimals: number.includes(".") ? number.split(".")[1].length : 0,
  };
}

function zeroState(value: string) {
  const parsed = parseValue(value);
  if (!parsed) return value;
  return `${parsed.prefix}${(0).toFixed(parsed.decimals)}${parsed.suffix}`;
}

/** Counts once on first view, then disconnects its observer and releases GSAP. */
export default function StatCounter({
  value,
  className = "",
}: StatCounterProps) {
  const reducedMotion = usePrefersReducedMotion();
  const elementRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const element = elementRef.current;
      const parsed = parseValue(value);
      if (!element || !parsed) return;

      if (reducedMotion) {
        element.textContent = value;
        element.dataset.counterState = "complete";
        return;
      }

      const counter = { value: 0 };
      let tween: gsap.core.Tween | null = null;

      const render = () => {
        element.textContent = `${parsed.prefix}${counter.value.toFixed(
          parsed.decimals,
        )}${parsed.suffix}`;
      };

      const play = () => {
        if (element.dataset.counterState === "complete") return;
        element.dataset.counterState = "running";
        tween = gsap.to(counter, {
          value: parsed.target,
          duration: 1.25,
          ease: "power3.out",
          onUpdate: render,
          onComplete: () => {
            element.textContent = value;
            element.dataset.counterState = "complete";
            tween = null;
          },
        });
      };

      element.textContent = zeroState(value);
      element.dataset.counterState = "waiting";

      if (!("IntersectionObserver" in window)) {
        play();
        return () => tween?.kill();
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          observer.disconnect();
          play();
        },
        { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
      );
      observer.observe(element);

      return () => {
        observer.disconnect();
        tween?.kill();
      };
    },
    {
      scope: elementRef,
      dependencies: [value, reducedMotion],
      revertOnUpdate: true,
    },
  );

  return (
    <p
      ref={elementRef}
      aria-label={value}
      data-counter-state={reducedMotion ? "complete" : "waiting"}
      className={className}
    >
      {reducedMotion ? value : zeroState(value)}
    </p>
  );
}
