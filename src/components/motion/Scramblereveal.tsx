import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";

const POOL_MICRO = "01#$%&*<>[]{}=+-_/\\?01234567890";
const POOL_DISPLAY = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type ScrambleRevealProps = {
  children: string;
  as?: ElementType;
  className?: string;
  variant?: "micro" | "display";
  /** ScrollTrigger scrub start. */
  start?: string;
  /** ScrollTrigger scrub end — how much scroll distance the decode
   *  takes to fully resolve. */
  end?: string;
};

/**
 * "Decode" text — a replacement for ScrambleText.
 *
 * WHY THIS EXISTS: ScrambleText ran its own independent rAF loop
 * (kicked off once by ScrollTrigger's onEnter/onEnterBack) racing
 * against Lenis's scroll-driven ticker. On fast or reversed scroll —
 * exactly what happens skimming through Diagnostics' five stacked
 * entries — the two clocks fell out of step: a scramble could still
 * be mid-run (or get re-queued behind the MAX_CONCURRENT cap) after
 * the text had already scrolled past its trigger, which read as the
 * label glitching/re-scrambling instead of resolving cleanly. That's
 * the "bug in scrolling."
 *
 * This version has no independent timer at all. Glyph resolution is
 * driven directly by ScrollTrigger's scrub progress (the same idiom
 * already used elsewhere on this page — ScrollRevealWords, the "05"
 * watermark parallax, the rail beam) via onUpdate. The revealed
 * character count IS the scroll position, so there's nothing to fall
 * out of sync with: scroll up mid-decode and it un-resolves smoothly,
 * scroll fast and it just jumps straight to wherever the scrollbar
 * is. No global concurrency queue is needed either, since there's no
 * competing rAF loop to throttle.
 */
export default function ScrambleReveal({
  children,
  as: Tag = "span",
  className,
  variant = "micro",
  start = "top 92%",
  end = "top 65%",
}: ScrambleRevealProps) {
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
      const glyphCache: string[] = new Array(finalText.length).fill("");
      let lastRevealCount = -1;

      const render = (progress: number) => {
        const revealCount = Math.floor(progress * finalText.length);
        const advanced = revealCount !== lastRevealCount;

        let out = "";
        for (let i = 0; i < finalText.length; i++) {
          const ch = finalText[i];
          if (ch === " " || ch === "\u00A0" || i < revealCount) {
            out += ch;
            glyphCache[i] = ch;
          } else {
            if (advanced || !glyphCache[i]) {
              glyphCache[i] = pool[Math.floor(Math.random() * pool.length)];
            }
            out += glyphCache[i];
          }
        }
        lastRevealCount = revealCount;
        el.textContent = out;
      };

      render(0);

      const st = ScrollTrigger.create({
        trigger: el,
        start,
        end,
        scrub: 0.4,
        onUpdate: (self) => render(self.progress),
        onRefresh: (self) => render(self.progress),
      });

      return () => {
        st.kill();
      };
    },
    { scope: ref, dependencies: [children, variant, start, end] },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
