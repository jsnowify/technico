import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";

const POOL_MICRO = "01#$%&*<>[]{}=+-_/\\?01234567890";
const POOL_DISPLAY = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Total time for the scramble → resolve pass. Long enough that
// characters visibly transition through states rather than snapping
// straight to final text.
const DURATION_MS = { display: 1300, micro: 950 };

// How often (ms) an unresolved character is allowed to change glyph.
// Throttling this — rather than re-rolling every rAF tick — is what
// keeps the effect reading as a slow, deliberate transition instead
// of rapid terminal-style flicker.
const FLICKER_INTERVAL_MS = { display: 70, micro: 55 };

// Minimum gap between the end of one run and the start of the next,
// even if the ScrollTrigger crosses again quickly (fast scroll
// oscillating near the trigger line). Prevents back-to-back re-runs.
const RETRIGGER_COOLDOWN_MS = 900;

// Slow start, quick middle, slow finish — characters resolve along
// this curve left-to-right rather than at a constant rate, so the
// "wave" of resolution feels considered rather than mechanical.
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/* ================================================================
   GLOBAL CONCURRENCY SCHEDULER

   Every ScrambleText instance drives its own rAF loop. On scroll-up,
   many instances can cross their trigger line in the same couple of
   frames (e.g. an entire section re-entering view at once), which
   previously meant a dozen+ simultaneous rAF loops all writing
   textContent every frame — enough main-thread load to make OTHER
   scroll-driven animations elsewhere on the page (Header's sticky
   pill morph, in particular) visibly stutter instead of gliding, even
   though nothing was actually wrong with their own tweens.

   Rather than removing onEnterBack (which would kill "replay on
   scroll back"), a shared queue caps how many scrambles can be
   actively animating at once. Anything past the cap waits a beat and
   starts as a slot frees — which also reads better: staggered
   resolution across a section rather than every label snapping to
   life in the same frame.
   ================================================================ */
const MAX_CONCURRENT = 4;
let activeCount = 0;
const queue: Array<() => void> = [];

function requestSlot(start: () => void) {
  if (activeCount < MAX_CONCURRENT) {
    activeCount++;
    start();
  } else {
    queue.push(start);
  }
}

function releaseSlot() {
  activeCount = Math.max(0, activeCount - 1);
  const next = queue.shift();
  if (next) {
    activeCount++;
    next();
  }
}

type ScrambleTextProps = {
  children: string;
  as?: ElementType;
  className?: string;
  /**
   * "micro" — small labels, metadata, numbers, coordinates, status text.
   *   Wider symbol pool, reads as gently "active."
   * "display" — headlines and larger content. Letters-only pool, longer
   *   duration but a much softer visual pass so it stays legible.
   */
  variant?: "micro" | "display";
  /** ScrollTrigger start position for when the scramble fires. */
  start?: string;
};

/**
 * Sci-fi "resolve" text effect — SCRAMBLE → TRANSITION → GRADUALLY
 * RESOLVE → SETTLE. Sets `textContent` directly via rAF rather than
 * rendering per-character spans, so it stays cheap even on long
 * headline strings.
 *
 * Triggered by ScrollTrigger's onEnter/onEnterBack, same one-shot
 * pattern as the site's other scroll reveals — fires once per
 * viewport crossing and naturally "replays" on scroll-back, but never
 * mid-run, never within its own cooldown window, and never more than
 * MAX_CONCURRENT instances at once page-wide (see scheduler above).
 */
export default function ScrambleText({
  children,
  as: Tag = "span",
  className,
  variant = "micro",
  start = "top 90%",
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const finalText = children;

      if (prefersReducedMotion) {
        el.textContent = finalText;
        return;
      }

      const pool = variant === "display" ? POOL_DISPLAY : POOL_MICRO;
      const duration = DURATION_MS[variant];
      const flickerInterval = FLICKER_INTERVAL_MS[variant];

      let rafId: number | null = null;
      let cancelled = false;
      let running = false;
      let queued = false;
      let lastRunEnd = 0;
      let lastFlickerAt = 0;
      // Per-character glyph cache so unresolved characters don't
      // re-roll every frame — only every `flickerInterval` ms.
      let glyphCache: string[] = [];

      const doRun = () => {
        running = true;
        const startTime = performance.now();
        glyphCache = new Array(finalText.length).fill("");
        lastFlickerAt = 0;

        const frame = (frameNow: number) => {
          if (cancelled) {
            releaseSlot();
            return;
          }

          const elapsed = frameNow - startTime;
          const rawProgress = Math.min(1, elapsed / duration);
          const eased = easeOutCubic(rawProgress);
          const revealCount = Math.floor(eased * finalText.length);

          const shouldFlicker = frameNow - lastFlickerAt >= flickerInterval;
          if (shouldFlicker) lastFlickerAt = frameNow;

          let out = "";
          for (let i = 0; i < finalText.length; i++) {
            const ch = finalText[i];
            if (ch === " " || ch === "\u00A0" || i < revealCount) {
              out += ch;
              glyphCache[i] = ch;
            } else {
              if (shouldFlicker || !glyphCache[i]) {
                glyphCache[i] = pool[Math.floor(Math.random() * pool.length)];
              }
              out += glyphCache[i];
            }
          }
          el.textContent = out;

          if (rawProgress < 1) {
            rafId = requestAnimationFrame(frame);
          } else {
            // Settle: final text holds stable until the trigger
            // crosses again (and clears the cooldown window).
            el.textContent = finalText;
            running = false;
            lastRunEnd = performance.now();
            releaseSlot();
          }
        };

        rafId = requestAnimationFrame(frame);
      };

      const runScramble = () => {
        const now = performance.now();
        // Already running, already queued, or finished too recently
        // — skip. This is what stops rapid scroll oscillation from
        // re-triggering the same text over and over.
        if (running || queued || now - lastRunEnd < RETRIGGER_COOLDOWN_MS) {
          return;
        }
        if (rafId) cancelAnimationFrame(rafId);

        queued = true;
        requestSlot(() => {
          queued = false;
          doRun();
        });
      };

      el.textContent = finalText;

      const st = ScrollTrigger.create({
        trigger: el,
        start,
        onEnter: runScramble,
        onEnterBack: runScramble,
      });

      return () => {
        cancelled = true;
        if (rafId) cancelAnimationFrame(rafId);
        // If this instance was mid-run when it unmounted, free its
        // slot so the queue doesn't permanently lose a concurrency
        // slot to a component that no longer exists.
        if (running) releaseSlot();
        st.kill();
      };
    },
    { scope: ref, dependencies: [children, variant, start] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
