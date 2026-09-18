"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { announceSiteReady } from "@/lib/site-ready";

// A separate column for every digit makes the count roll like an odometer,
// rather than replacing a text node 100 times or displaying "100 / 100".
const HUNDREDS = [0, 1];
const TENS = Array.from({ length: 11 }, (_, index) => index % 10);
const ONES = Array.from({ length: 101 }, (_, index) => index % 10);

const CRITICAL_IMAGES = [
  "/technico-digitals-solutions-inc-logo-white.svg",
  "/technico-digitals-solutions-inc-logo-black.svg",
];
const READY_TIMEOUT_MS = 2_500;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const image = new Image();
    const done = () => resolve();

    image.addEventListener(
      "load",
      () => {
        if (typeof image.decode === "function") {
          image.decode().catch(() => undefined).finally(done);
        } else {
          done();
        }
      },
      { once: true },
    );
    image.addEventListener("error", done, { once: true });
    image.src = src;
  });
}

function waitForCriticalContent(): Promise<void> {
  const fontsReady = document.fonts?.ready ?? Promise.resolve();

  return Promise.all([
    fontsReady,
    ...CRITICAL_IMAGES.map(preloadImage),
  ]).then(() => undefined);
}

/**
 * Persistent first-load intro. Four overlaid plus signs start as ONE mark,
 * split toward the square's four corners, and remain as registration marks.
 * The existing Technico square fills and expands; no reference logo is copied.
 */
export default function PreLoader() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const hundredsRef = useRef<HTMLDivElement>(null);
  const tensRef = useRef<HTMLDivElement>(null);
  const onesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;

    const overlay = overlayRef.current;
    const square = squareRef.current;
    const fill = fillRef.current;
    const tagline = taglineRef.current;
    const counter = counterRef.current;
    const hundreds = hundredsRef.current;
    const tens = tensRef.current;
    const ones = onesRef.current;
    if (
      !overlay ||
      !square ||
      !fill ||
      !tagline ||
      !counter ||
      !hundreds ||
      !tens ||
      !ones
    ) {
      return;
    }

    if (prefersReducedMotion) {
      const id = window.requestAnimationFrame(() => {
        announceSiteReady();
        setVisible(false);
      });
      return () => window.cancelAnimationFrame(id);
    }

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    // Lock wheel/touch/keyboard too, including when Lenis is active.
    const preventScroll = (event: Event) => event.preventDefault();
    const preventScrollKeys = (event: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "PageUp",
          "PageDown",
          "Home",
          "End",
          " ",
        ].includes(event.key)
      ) {
        event.preventDefault();
      }
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys);

    let finished = false;
    let cancelled = false;
    let exitTimeline: gsap.core.Timeline | undefined;
    let readyTimeoutId: number | undefined;
    const restore = () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventScrollKeys);
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      restore();
      setVisible(false);
      // Recalculate pinned sections after the scroll lock and overlay leave.
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    // The effect itself only runs after React has hydrated this client tree,
    // so the page markup is already present behind the overlay. A slow
    // connection can hold on 100 briefly until the fonts and above-the-fold
    // brand art decode. We deliberately do not wait for window.load: this long
    // page contains below-the-fold images that should keep loading lazily.
    const contentReady = Promise.race([
      waitForCriticalContent(),
      new Promise<void>((resolve) => {
        readyTimeoutId = window.setTimeout(resolve, READY_TIMEOUT_MS);
      }),
    ]);

    const context = gsap.context(() => {
      const marks = Array.from(
        overlay.querySelectorAll<HTMLSpanElement>("[data-loader-marker]"),
      );

      gsap.set(overlay, { yPercent: 0 });
      gsap.set(square, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
      gsap.set(fill, { scaleY: 0, transformOrigin: "bottom center" });
      // The four marks occupy the exact same point at first: ONE visible +.
      gsap.set(marks, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        autoAlpha: 1,
      });
      gsap.set(tagline, { autoAlpha: 0, y: 10 });
      gsap.set(counter, { autoAlpha: 0 });
      gsap.set([hundreds, tens, ones], { y: 0 });

      const playExit = () => {
        contentReady.then(() => {
          if (cancelled) return;
          if (readyTimeoutId !== undefined) {
            window.clearTimeout(readyTimeoutId);
          }

          exitTimeline = gsap.timeline({ onComplete: finish });
          exitTimeline
            .to(
              [tagline, counter, ...marks],
              { autoAlpha: 0, duration: 0.22 },
              0,
            )
            .to(square, { borderColor: "transparent", duration: 0.12 }, 0.18)
            .to(
              square,
              {
                width: "110vw",
                height: "110dvh",
                duration: 0.8,
                ease: "expo.inOut",
              },
              0.31,
            )
            // Start the page entrance with the overlay's upward wipe. At this
            // point the preloader sequence and all readiness checks are done.
            .call(announceSiteReady, undefined, 1.13)
            .to(
              overlay,
              { yPercent: -100, duration: 0.82, ease: "power4.inOut" },
              1.12,
            );
        });
      };

      const timeline = gsap.timeline({ onComplete: playExit });

      // 01. Split the center + into FOUR separate + marks at the square corners.
      // Function values measure the real responsive square at tween start.
      timeline
        .to(
          marks,
          {
            x: (index) =>
              (index % 2 === 0 ? -1 : 1) * (square.offsetWidth / 2 + 6),
            y: (index) => (index < 2 ? -1 : 1) * (square.offsetHeight / 2 + 6),
            duration: 0.75,
            ease: "expo.inOut",
          },
          0.22,
        )
        .to(square, { autoAlpha: 1, duration: 0.28 }, 0.67)
        .to(tagline, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.9)
        .to(counter, { autoAlpha: 1, duration: 0.3 }, 0.94)

        // 02. Fill the original square while the number ROLLS 000 -> 100.
        // All three column tweens share the same duration and easing.
        .to(fill, { scaleY: 1, duration: 2.15, ease: "power2.inOut" }, 1.08)
        .to(hundreds, { y: "-1em", duration: 2.15, ease: "power2.inOut" }, 1.08)
        .to(tens, { y: "-10em", duration: 2.15, ease: "power2.inOut" }, 1.08)
        .to(ones, { y: "-100em", duration: 2.15, ease: "power2.inOut" }, 1.08);
    }, overlay);

    return () => {
      cancelled = true;
      if (readyTimeoutId !== undefined) window.clearTimeout(readyTimeoutId);
      exitTimeline?.kill();
      context.revert();
      restore();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      role="status"
      aria-label="Loading Technico Digital Solutions"
      className="fixed inset-0 z-[99999] overflow-hidden bg-white-bg text-black-text cursor-none motion-reduce:hidden"
      style={{ height: "100dvh" }}
    >
      {/* Identical, initially overlapping marks animate from center to corners. */}
      {[0, 1, 2, 3].map((index) => (
        <span
          key={index}
          data-loader-marker
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 font-mono text-xl font-light leading-none"
        >
          +
        </span>
      ))}

      <div
        ref={squareRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[clamp(140px,16vw,180px)] w-[clamp(140px,16vw,180px)] border border-black-text/35 opacity-0"
      >
        <div
          ref={fillRef}
          className="absolute inset-0 origin-bottom scale-y-0 bg-black-bg"
        />
      </div>

      <p
        ref={taglineRef}
        className="pointer-events-none absolute left-1/2 top-[calc(50%+105px)] -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.16em] opacity-0 sm:text-[10px]"
      >
        TECHNICO DIGITAL SOLUTIONS
      </p>

      {/* A single spinner counter, not "100 / 100". Each column rolls vertically. */}
      <div
        ref={counterRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[clamp(32px,7vh,76px)] left-1/2 flex -translate-x-1/2 gap-[0.08em] overflow-hidden font-mono text-[13px] font-medium tabular-nums tracking-normal opacity-0"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        <div className="h-[1em] overflow-hidden">
          <div ref={hundredsRef} className="flex flex-col">
            {HUNDREDS.map((digit, index) => (
              <span key={index} className="block h-[1em] shrink-0 leading-none">
                {digit}
              </span>
            ))}
          </div>
        </div>
        <div className="h-[1em] overflow-hidden">
          <div ref={tensRef} className="flex flex-col">
            {TENS.map((digit, index) => (
              <span key={index} className="block h-[1em] shrink-0 leading-none">
                {digit}
              </span>
            ))}
          </div>
        </div>
        <div className="h-[1em] overflow-hidden">
          <div ref={onesRef} className="flex flex-col">
            {ONES.map((digit, index) => (
              <span key={index} className="block h-[1em] shrink-0 leading-none">
                {digit}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
