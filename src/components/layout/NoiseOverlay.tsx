"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const NOISE_SVG_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix in='t' type='matrix' values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 4 -1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** The subtle grain flickers only when idle on desktop AND mobile. */
export default function NoiseOverlay() {
  const grainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grain = grainRef.current;
    if (!grain || prefersReducedMotion) return;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const pause = () => {
      grain.style.animationPlayState = "paused";
    };
    const onScroll = () => {
      pause();
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (!document.hidden) grain.style.animationPlayState = "running";
      }, 220);
    };
    const onVisibility = () => {
      grain.style.animationPlayState = document.hidden ? "paused" : "running";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="technico-noise-overlay pointer-events-none fixed inset-0 z-[80] overflow-hidden opacity-[0.05]"
    >
      <div
        ref={grainRef}
        className="absolute -inset-4"
        style={{
          backgroundImage: NOISE_SVG_DATA_URI,
          animation: "noise-static-flicker-lite 0.8s steps(1) infinite",
        }}
      />
    </div>
  );
}
