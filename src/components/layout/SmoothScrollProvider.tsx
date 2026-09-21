"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let activeLenis: Lenis | null = null;

/** One persistent Lenis instance on desktop and mobile (native touch handling). */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Keep the same scrolling feature available on all viewport sizes.
    // Lenis v1 leaves touchscreen input native unless syncTouch is enabled;
    // that preserves low-latency touch while still handling wheel/trackpad.
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    activeLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const update = (time: number) => lenis.raf(time * 1000);
    const updateVisibility = () => {
      gsap.ticker.remove(update);
      if (!document.hidden) gsap.ticker.add(update);
    };
    document.addEventListener("visibilitychange", updateVisibility);
    updateVisibility();

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      if (activeLenis === lenis) activeLenis = null;
    };
  }, []);

  useEffect(() => {
    // Don't destroy and recreate Lenis on every route, which creates a new
    // RAF driver and can interrupt a live scroll/page transition.
    const frame = window.requestAnimationFrame(() => {
      activeLenis?.resize();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return <>{children}</>;
}
