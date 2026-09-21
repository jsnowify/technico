"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { announceSiteReady } from "@/lib/site-ready";

/**
 * ~1.46s brand intro on desktop AND mobile. Play on each full document load
 * (including refresh); the persistent root layout already prevents replaying
 * it on client-side route changes. Keep the square, four registration marks,
 * numeric counter and exit wipe. Never wait for fonts, images or window.load;
 * reduced-motion users see the real page immediately.
 */
export default function PreLoader() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible) return;
    const overlay = overlayRef.current;
    const square = squareRef.current;
    const fill = fillRef.current;
    const counter = counterRef.current;
    if (!overlay || !square || !fill || !counter) return;

    if (prefersReducedMotion) {
      announceSiteReady();
      const frame = window.requestAnimationFrame(() => setVisible(false));
      return () => window.cancelAnimationFrame(frame);
    }

    const markers = Array.from(
      overlay.querySelectorAll<HTMLElement>("[data-loader-marker]"),
    );
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      announceSiteReady();
      setVisible(false);
    };

    const context = gsap.context(() => {
      gsap.set(markers, { xPercent: -50, yPercent: -50 });
      gsap.set(square, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      gsap.set(fill, { scaleY: 0, transformOrigin: "bottom center" });

      gsap
        .timeline({ onComplete: finish })
        // A legible build / fill / settle / exit. Animate only transforms and
        // opacity, and never couple the timeline to network or image loading.
        .to(
          markers,
          {
            x: (i) => (i % 2 ? 1 : -1) * (square.offsetWidth / 2 + 6),
            y: (i) => (i < 2 ? -1 : 1) * (square.offsetHeight / 2 + 6),
            duration: 0.34,
            ease: "power2.out",
          },
          0,
        )
        .to(square, { autoAlpha: 1, duration: 0.19 }, 0.11)
        .to(fill, { scaleY: 1, duration: 0.52, ease: "power2.inOut" }, 0.27)
        .to(
          { value: 0 },
          {
            value: 100,
            roundProps: "value",
            duration: 0.64,
            ease: "power2.inOut",
            onUpdate: function () {
              counter.textContent = String(
                Math.round((this.targets()[0] as { value: number }).value),
              ).padStart(3, "0");
            },
          },
          0.2,
        )
        // Give 100 and the completed square a beat before the overlay exits.
        // Fire readiness late in the wipe so the hero entrance stays visible
        // instead of completing unseen behind an opaque preloader.
        .call(announceSiteReady, undefined, 1.26)
        .to(
          overlay,
          { yPercent: -100, duration: 0.46, ease: "power3.inOut" },
          1.0,
        );
    }, overlay);

    return () => {
      // Reverts only the preloader's own tweens. Page entrances that react to
      // the site-ready event must never be owned by this context; see the
      // note in announceSiteReady(). Strict Mode's throwaway first run is
      // killed here before it can announce, and the second run replays it.
      context.revert();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="technico-preloader fixed inset-0 z-[99999] overflow-hidden bg-white-bg text-black-text pointer-events-auto"
      style={{ height: "100dvh" }}
    >
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          data-loader-marker
          className="absolute top-1/2 left-1/2 font-mono text-xl leading-none"
        >
          +
        </span>
      ))}
      <div
        ref={squareRef}
        className="absolute top-1/2 left-1/2 h-[clamp(140px,16vw,180px)] w-[clamp(140px,16vw,180px)] border border-black-text/35 opacity-0"
      >
        <div
          ref={fillRef}
          className="absolute inset-0 origin-bottom scale-y-0 bg-black-bg"
        />
      </div>
      <span className="absolute top-[calc(50%+105px)] left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-[0.12em]">
        TECHNICO DIGITAL SOLUTIONS
      </span>
      <span
        ref={counterRef}
        aria-hidden="true"
        className="absolute bottom-[clamp(32px,7vh,76px)] left-1/2 -translate-x-1/2 font-mono text-[13px] tabular-nums"
      >
        000
      </span>
    </div>
  );
}
