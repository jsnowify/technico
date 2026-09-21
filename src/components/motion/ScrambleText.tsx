"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { isSiteReady, SITE_READY_EVENT } from "@/lib/site-ready";

/* ================================================================
   SCRAMBLE TEXT
   ================================================================
   Sci-fi "hacker terminal" reveal: characters cycle through a pool
   of random glyphs before settling into the real text, left to
   right. Driven by a single GSAP tween's progress — no plugin
   required (GSAP's ScrambleTextPlugin is Club GreenSock-only;
   onUpdate recomputes the scrambled string by hand every frame
   based on how far the tween has gotten through the string).

   Usage:
     <ScrambleText text="TECHNICO_" />                    // plays on mount
     <ScrambleText text="EXPLORE" trigger="hover" />       // replays on hover
     <ScrambleText text={label} trigger="inview" />        // plays once the
       element first enters the viewport; if `text` changes AFTER that
       first reveal (e.g. Overview.tsx swapping "Introduction" ->
       "Strategy" -> "Timeline" -> "Growth" while the label stays
       pinned on screen), it re-scrambles immediately on each change
       instead of waiting to re-enter the viewport.
     <ScrambleText
       text="TECHNICO_"
       trigger="inview-repeat"
       repeatEvery={5}
       waitForSiteReady
     />                                                     // repeats only
       while visible and pauses when the tab/element is out of view.
   ================================================================ */

/* Pool of scramble glyphs is built per-word (see getScramblePool) from
   that word's own letters — keeps the shuffle feeling related to the
   text instead of throwing in symbols/numbers that read as noisy. */
function getScramblePool(text: string): string {
  const letters = text
    .toUpperCase()
    .split("")
    .filter((ch) => /[A-Z]/.test(ch));
  const unique = Array.from(new Set(letters));
  // Fallback for all-symbol/number strings with no letters at all.
  return unique.length > 0 ? unique.join("") : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  /**
   * "mount" plays once on load; "hover" replays every time the
   * pointer enters; "inview" waits until the element first scrolls
   * into the viewport, then behaves like "mount" for every text
   * change after that (see file header).
   */
  trigger?: "mount" | "hover" | "inview" | "inview-repeat";
  /** Seconds for the scramble-to-resolve sweep. */
  duration?: number;
  /** Seconds between replays for `inview-repeat`. */
  repeatEvery?: number;
  /** Delay the first replay until PreLoader announces that the site is ready. */
  waitForSiteReady?: boolean;
}

export default function ScrambleText({
  text,
  className = "",
  trigger = "mount",
  duration = 1,
  repeatEvery = 5,
  waitForSiteReady = false,
}: ScrambleTextProps) {
  const elRef = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const hasEnteredRef = useRef(false);

  const scramble = () => {
    const el = elRef.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.textContent = text;
      return;
    }

    tweenRef.current?.kill();
    const length = text.length;
    const pool = getScramblePool(text);
    const progress = { value: 0 };
    let lastFrame = 0;

    tweenRef.current = gsap.to(progress, {
      value: 1,
      duration,
      ease: "none",
      onUpdate: () => {
        const now = performance.now();
        if (now - lastFrame < 40 && progress.value < 1) return;
        lastFrame = now;
        const revealCount = Math.floor(progress.value * length);
        let out = "";
        for (let i = 0; i < length; i++) {
          if (text[i] === " ") {
            out += " ";
          } else if (i < revealCount) {
            out += text[i];
          } else {
            out += pool[Math.floor(Math.random() * pool.length)];
          }
        }
        el.textContent = out;
      },
      onComplete: () => {
        el.textContent = text;
      },
    });
  };

  useGSAP(() => {
    if (trigger === "mount") {
      scramble();
      return () => {
        tweenRef.current?.kill();
      };
    }

    if (trigger === "inview") {
      // Already been seen once (e.g. Overview.tsx swapping the label
      // while it stays pinned on screen) — just re-scramble straight
      // away, no need to wait for another intersection.
      if (hasEnteredRef.current) {
        scramble();
        return () => {
          tweenRef.current?.kill();
        };
      }

      const el = elRef.current;
      if (!el) return;

      if (prefersReducedMotion) {
        hasEnteredRef.current = true;
        el.textContent = text;
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            hasEnteredRef.current = true;
            scramble();
            observer.disconnect();
          }
        },
        { threshold: 0.5 },
      );
      observer.observe(el);

      return () => {
        observer.disconnect();
        tweenRef.current?.kill();
      };
    }

    if (trigger === "inview-repeat") {
      const el = elRef.current;
      if (!el) return;

      if (prefersReducedMotion) {
        el.textContent = text;
        return;
      }

      let intervalId: number | null = null;
      let isIntersecting = false;
      let ready = !waitForSiteReady || isSiteReady();

      const clearReplay = () => {
        if (intervalId !== null) window.clearInterval(intervalId);
        intervalId = null;
      };

      const stop = () => {
        clearReplay();
        tweenRef.current?.kill();
        tweenRef.current = null;
        el.textContent = text;
      };

      const start = () => {
        if (!ready || !isIntersecting || document.hidden) return;

        clearReplay();
        scramble();
        if (repeatEvery > 0) {
          intervalId = window.setInterval(scramble, repeatEvery * 1000);
        }
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          isIntersecting = entry?.isIntersecting ?? false;
          if (isIntersecting) start();
          else stop();
        },
        { threshold: 0.5 },
      );

      const handleSiteReady = () => {
        ready = true;
        start();
      };

      const handleVisibilityChange = () => {
        if (document.hidden) stop();
        else start();
      };

      observer.observe(el);
      if (waitForSiteReady && !ready) {
        window.addEventListener(SITE_READY_EVENT, handleSiteReady, {
          once: true,
        });
      }
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        observer.disconnect();
        window.removeEventListener(SITE_READY_EVENT, handleSiteReady);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        stop();
      };
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, [text, trigger, duration, repeatEvery, waitForSiteReady]);

  return (
    <span
      ref={elRef}
      className={className}
      onMouseEnter={trigger === "hover" ? scramble : undefined}
    >
      {text}
    </span>
  );
}
