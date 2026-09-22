"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import styles from "./ServiceArtwork.module.css";

const CAPTIONS = [
  ["Search intelligence", "Discover / rank / grow"],
  ["Digital architecture", "Design / build / launch"],
  ["Creative direction", "Shape / tell / connect"],
  ["Precision advertising", "Reach / test / convert"],
  ["Connected communities", "Listen / engage / grow"],
  ["Messages that move", "Segment / send / connect"],
];

const NODES = [
  [94, 94],
  [264, 104],
  [278, 242],
  [102, 274],
  [58, 180],
];

function Drawing({ index, id }: { index: number; id: string }) {
  switch (index) {
    case 0:
      return (
        <>
          {[0, 1, 2, 3].map((n) => (
            <g key={n} data-row>
              <rect
                x="58"
                y={92 + n * 42}
                width="218"
                height="30"
                className={styles.panel}
              />
              <path
                d={`M72 ${107 + n * 42}h${100 - n * 17}`}
                className={styles.soft}
              />
              <rect
                x="252"
                y={103 + n * 42}
                width="8"
                height="8"
                className={styles.solid}
              />
            </g>
          ))}
          <path
            data-trace
            d="M68 263 118 226 154 235 204 172 254 140"
            className={styles.accentLine}
            pathLength="1"
          />
          <g data-lens>
            <circle cx="218" cy="134" r="52" className={styles.glass} />
            <circle
              cx="218"
              cy="134"
              r="41"
              className={styles.accentLine}
              strokeDasharray="3 7"
            />
            <path
              d="m254 170 41 41"
              className={styles.accentLine}
              strokeWidth="12"
            />
            <path d="M205 134h26m-13-13v26" className={styles.accentLine} />
          </g>
          <path data-scan d="M48 82h246" className={styles.accentLine} />
        </>
      );
    case 1:
      return (
        <>
          <rect
            x="44"
            y="70"
            width="272"
            height="218"
            className={styles.panel}
          />
          <path d="M44 104h272" className={styles.soft} />
          {[60, 74, 88].map((x) => (
            <circle key={x} cx={x} cy="87" r="3" className={styles.solid} />
          ))}
          <g data-build>
            <rect
              x="62"
              y="122"
              width="112"
              height="80"
              className={styles.fill}
            />
            <path
              d="m78 180 24-36 18 22 21-29 19 43Z"
              className={styles.inkFill}
            />
          </g>
          <g data-build>
            <path d="M194 131h98m-98 18h72m-72 18h87" className={styles.line} />
            <rect
              x="194"
              y="185"
              width="66"
              height="17"
              className={styles.fill}
            />
          </g>
          {[0, 1, 2].map((n) => (
            <g data-build key={n}>
              <rect
                x={62 + n * 80}
                y="220"
                width="68"
                height="48"
                className={styles.glass}
              />
              <path
                d={`M${74 + n * 80} 236h28m-28 13h42`}
                className={styles.soft}
              />
            </g>
          ))}
          <g data-cursor>
            <path d="m233 201 5 42 11-13 16-3Z" className={styles.cursor} />
            <circle
              data-click
              cx="236"
              cy="208"
              r="15"
              className={styles.accentLine}
              opacity="0"
            />
          </g>
        </>
      );
    case 2:
      return (
        <>
          <path
            d="M62 62h236v236H62Z M180 46v268M46 180h268"
            className={styles.soft}
            strokeDasharray="3 7"
          />
          <rect
            data-shape
            x="82"
            y="82"
            width="118"
            height="118"
            rx="0"
            className={styles.fill}
          />
          <g data-orbit>
            <circle cx="224" cy="197" r="63" className={styles.glass} />
            <circle cx="224" cy="197" r="44" className={styles.line} />
            <path d="M224 145v104m-52-52h104" className={styles.soft} />
          </g>
          <g data-pen>
            <path
              d="m103 261 130-130 26 26-130 130-38 11Z"
              className={styles.panel}
            />
            <path
              d="m111 251 26 26m85-136 26 26m-125 95 112-112"
              className={styles.accentLine}
            />
            <path d="m91 298 12-37 26 26Z" className={styles.fill} />
          </g>
          {[
            [62, 62],
            [298, 62],
            [62, 298],
            [298, 298],
          ].map(([x, y]) => (
            <rect
              key={`${x}-${y}`}
              x={x - 4}
              y={y - 4}
              width="8"
              height="8"
              className={styles.solid}
            />
          ))}
        </>
      );
    case 3:
      return (
        <>
          <circle
            cx="180"
            cy="180"
            r="115"
            className={styles.soft}
            strokeDasharray="2 9"
          />
          <circle cx="180" cy="180" r="88" className={styles.line} />
          <circle cx="180" cy="180" r="57" className={styles.accentLine} />
          <circle cx="180" cy="180" r="24" className={styles.fill} />
          <g data-radar>
            <path
              d="M180 180V65a115 115 0 0 1 99 57Z"
              fill={`url(#${id}-beam)`}
              stroke="none"
            />
            <path d="M180 180V65" className={styles.accentLine} />
          </g>
          <circle
            data-impact
            cx="180"
            cy="180"
            r="26"
            className={styles.accentLine}
            opacity="0"
          />
          <g data-arrow>
            <path
              d="m180 180 101-101m-21-2h23v23"
              className={styles.accentLine}
              strokeWidth="5"
            />
            <path
              d="m255 86 1-25 21-21 2 39 39 2-21 21-25-1"
              className={styles.panel}
            />
          </g>
          <path
            d="M180 48v15m0 234v15M48 180h15m234 0h15"
            className={styles.line}
          />
        </>
      );
    case 4:
      return (
        <>
          {NODES.map(([x, y], n) => (
            <g key={n}>
              <path d={`M180 180 ${x} ${y}`} className={styles.soft} />
              <path
                data-signal
                d={`M180 180 ${x} ${y}`}
                className={styles.accentLine}
                pathLength="1"
                strokeDasharray="0.12 0.88"
              />
              <g data-node>
                <circle
                  cx={x}
                  cy={y}
                  r={n === 1 ? 31 : 23}
                  className={styles.panel}
                />
                <circle cx={x} cy={y - 4} r="5" className={styles.solid} />
                <path
                  d={`M${x - 10} ${y + 10}q10-14 20 0`}
                  className={styles.accentLine}
                />
              </g>
            </g>
          ))}
          <circle
            data-impact
            cx="180"
            cy="180"
            r="43"
            className={styles.accentLine}
            opacity="0"
          />
          <circle cx="180" cy="180" r="43" className={styles.fill} />
          <path
            d="M158 164h44v28h-23l-13 10v-10h-8Z"
            className={styles.inkLine}
          />
          {[168, 180, 192].map((x) => (
            <circle
              data-dot
              key={x}
              cx={x}
              cy="178"
              r="2.5"
              className={styles.inkFill}
            />
          ))}
        </>
      );
    default:
      return (
        <>
          <path
            d="M46 277C33 157 208 318 291 84"
            className={styles.soft}
            strokeDasharray="4 7"
          />
          <path
            data-trace
            d="M46 277C33 157 208 318 291 84"
            className={styles.accentLine}
            pathLength="1"
          />
          <path d="m72 154 108-81 108 81v130H72Z" className={styles.panel} />
          <g data-letter>
            <rect
              x="104"
              y="109"
              width="152"
              height="129"
              className={styles.panel}
            />
            <rect
              x="120"
              y="125"
              width="33"
              height="20"
              className={styles.fill}
            />
            <path
              d="M120 165h115m-115 17h94m-94 17h106"
              className={styles.soft}
            />
          </g>
          <path d="m72 154 108 80 108-80v130H72Z" className={styles.glass} />
          <path d="m72 284 79-71m137 71-79-71" className={styles.line} />
          <g data-plane>
            <path
              d="m198 111 103-48-37 104-20-39-46-17Z"
              className={styles.fill}
            />
            <path
              d="m244 128 57-65m-57 65-4 23 13-8"
              className={styles.inkLine}
            />
          </g>
        </>
      );
  }
}

export default function ServiceArtwork({
  index,
  title,
  dark,
  compact = false,
}: {
  index: number;
  title: string;
  dark: boolean;
  /**
   * Renders just the animated drawing (no header, caption or replay/pause
   * controls) so the same artwork can drop into a small square icon slot,
   * e.g. replacing a static <img> service icon.
   */
  compact?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, "");
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const controls = useRef<{ sync: () => void; replay: () => void } | null>(
    null,
  );

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const q = gsap.utils.selector(element);
        const loop = gsap.timeline({
          paused: true,
          repeat: -1,
          repeatDelay: 1.2,
          defaults: { ease: "power2.inOut" },
        });
        const trace = q("[data-trace]");
        if (trace.length)
          loop.fromTo(
            trace,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 2.4 },
            0.5,
          );
        switch (index) {
          case 0:
            loop
              .fromTo(
                q("[data-row]"),
                { x: -12, opacity: 0.3 },
                { x: 0, opacity: 1, duration: 0.8, stagger: 0.16 },
                0,
              )
              .fromTo(
                q("[data-scan]"),
                { y: 0, opacity: 0 },
                { y: 190, opacity: 0.7, duration: 2.6, ease: "none" },
                0,
              )
              .to(q("[data-scan]"), { opacity: 0, duration: 0.3 }, 2.6)
              .to(q("[data-lens]"), { x: -46, y: 73, duration: 1.4 }, 0.4)
              .to(q("[data-lens]"), { x: 0, y: 0, duration: 1.6 }, 2.3);
            break;
          case 1:
            loop
              .fromTo(
                q("[data-build]"),
                { y: 22, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.9, stagger: 0.22 },
                0,
              )
              .fromTo(
                q("[data-cursor]"),
                { x: 37, y: 40 },
                { x: 0, y: 0, duration: 1.5 },
                1,
              )
              .fromTo(
                q("[data-click]"),
                { attr: { r: 5 }, opacity: 0.8 },
                { attr: { r: 30 }, opacity: 0, duration: 0.8 },
                2.5,
              );
            break;
          case 2:
            loop
              .to(
                q("[data-shape]"),
                {
                  attr: { rx: 59 },
                  rotation: 90,
                  svgOrigin: "141 141",
                  duration: 1.8,
                },
                0,
              )
              .to(
                q("[data-orbit]"),
                { rotation: 25, svgOrigin: "180 180", duration: 1.8 },
                0,
              )
              .to(q("[data-pen]"), { x: -18, y: 12, duration: 1.4 }, 0.2)
              .to(
                q("[data-shape]"),
                { attr: { rx: 0 }, rotation: 180, duration: 1.8 },
                2.1,
              )
              .to(q("[data-orbit]"), { rotation: 0, duration: 1.8 }, 2.1)
              .to(q("[data-pen]"), { x: 0, y: 0, duration: 1.4 }, 2.1);
            break;
          case 3:
            loop
              .to(
                q("[data-radar]"),
                {
                  rotation: 360,
                  svgOrigin: "180 180",
                  duration: 4,
                  ease: "none",
                },
                0,
              )
              .fromTo(
                q("[data-arrow]"),
                { x: 35, y: -35, opacity: 0 },
                { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
                1.4,
              )
              .fromTo(
                q("[data-impact]"),
                { attr: { r: 26 }, opacity: 0.8 },
                { attr: { r: 108 }, opacity: 0, duration: 1.3 },
                2.1,
              );
            break;
          case 4:
            loop
              .fromTo(
                q("[data-signal]"),
                { strokeDashoffset: 1 },
                {
                  strokeDashoffset: 0,
                  duration: 1.5,
                  stagger: 0.25,
                  ease: "none",
                },
                0,
              )
              .fromTo(
                q("[data-node]"),
                { opacity: 0.3 },
                { opacity: 1, duration: 0.7, stagger: 0.25 },
                0.7,
              )
              .fromTo(
                q("[data-dot]"),
                { y: 0 },
                { y: -4, duration: 0.3, stagger: 0.12, repeat: 3, yoyo: true },
                0,
              )
              .fromTo(
                q("[data-impact]"),
                { attr: { r: 43 }, opacity: 0.8 },
                { attr: { r: 115 }, opacity: 0, duration: 1.5 },
                2,
              );
            break;
          default:
            loop
              .to(q("[data-letter]"), { y: -32, duration: 1.2 }, 0)
              .fromTo(
                q("[data-plane]"),
                { x: -70, y: 68, opacity: 0 },
                { x: 0, y: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
                0.8,
              )
              .to(
                q("[data-plane]"),
                { x: 52, y: -50, opacity: 0, duration: 1.1, ease: "power2.in" },
                2.4,
              )
              .to(q("[data-letter]"), { y: 0, duration: 1.2 }, 2.7);
        }
        // Give every drawing a quiet hold before its next cycle.
        loop.to({}, { duration: 0.6 }, 4);

        let intersecting = false;
        let frame = 0;
        const sync = () => {
          cancelAnimationFrame(frame);
          frame = 0;
          let visible = intersecting && !document.hidden && !pausedRef.current;
          if (visible) {
            // Sticky spreads remain intersecting when a later spread covers them.
            // Hit-test the visible portion to stop animation behind those sheets.
            const rect = element.getBoundingClientRect();
            const x = Math.max(
              0,
              Math.min(innerWidth - 1, rect.left + rect.width / 2),
            );
            const y =
              (Math.max(0, rect.top) + Math.min(innerHeight, rect.bottom)) / 2;
            visible = element.contains(document.elementFromPoint(x, y));
          }
          loop.paused(!visible);
          element.dataset.running = String(visible);
        };
        const schedule = () => {
          if (intersecting && !document.hidden && !frame) {
            frame = requestAnimationFrame(sync);
          }
        };
        const observer = new IntersectionObserver(
          ([entry]) => {
            intersecting = entry.isIntersecting;
            sync();
          },
          { threshold: [0, 0.15, 0.5, 1] },
        );
        observer.observe(element);
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        document.addEventListener("visibilitychange", sync);
        controls.current = {
          sync,
          replay: () => {
            loop.pause(0);
            sync();
          },
        };

        const stage = q("[data-parallax]");
        const moveX = gsap.quickTo(stage, "x", {
          duration: 0.65,
          ease: "power3.out",
        });
        const moveY = gsap.quickTo(stage, "y", {
          duration: 0.65,
          ease: "power3.out",
        });
        const move = (event: PointerEvent) => {
          if (
            event.pointerType !== "mouse" ||
            pausedRef.current ||
            loop.paused()
          )
            return;
          const rect = element.getBoundingClientRect();
          moveX(((event.clientX - rect.left) / rect.width - 0.5) * 14);
          moveY(((event.clientY - rect.top) / rect.height - 0.5) * 14);
        };
        const reset = () => {
          moveX(0);
          moveY(0);
        };
        element.addEventListener("pointermove", move);
        element.addEventListener("pointerleave", reset);
        return () => {
          observer.disconnect();
          cancelAnimationFrame(frame);
          window.removeEventListener("scroll", schedule);
          window.removeEventListener("resize", schedule);
          document.removeEventListener("visibilitychange", sync);
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", reset);
          controls.current = null;
          delete element.dataset.running;
        };
      },
      element,
    );
    return () => media.revert();
  }, [index]);

  return (
    <div
      ref={root}
      data-service-visual
      data-dark={dark}
      data-compact={compact}
      className={compact ? styles.iconCard : styles.card}
    >
      {!compact && (
        <div className={styles.header}>
          <span>/ {String(index + 1).padStart(2, "0")}</span>
          <span>{CAPTIONS[index][0]}</span>
        </div>
      )}
      <div
        className={compact ? styles.iconStage : styles.stage}
        role="img"
        aria-label={`${title} illustration`}
      >
        <svg viewBox="0 0 360 360" aria-hidden="true" focusable="false">
          <defs>
            <pattern
              id={`${id}-grid`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M24 0H0V24"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.075"
                strokeWidth="0.6"
              />
            </pattern>
            <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="var(--color-purple-accent)" stopOpacity="0.5" />
              <stop
                offset="1"
                stopColor="var(--color-purple-accent)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          {!compact && (
            <rect
              x="20"
              y="20"
              width="320"
              height="320"
              fill={`url(#${id}-grid)`}
            />
          )}
          {!compact && (
            <path
              d="M20 40V20h20m280 0h20v20M20 320v20h20m280 0h20v-20"
              className={styles.soft}
            />
          )}
          <g data-parallax>
            <Drawing index={index} id={id} />
          </g>
        </svg>
      </div>
      {!compact && (
        <div className={styles.footer}>
          <span className={styles.caption}>{CAPTIONS[index][1]}</span>
          <div className={styles.controls}>
            <button
              type="button"
              aria-label={`Replay ${title} animation`}
              onClick={() => {
                pausedRef.current = false;
                setPaused(false);
                controls.current?.replay();
              }}
            >
              ↻
            </button>
            <button
              type="button"
              aria-label={`Pause ${title} animation`}
              aria-pressed={paused}
              onClick={() => {
                pausedRef.current = !pausedRef.current;
                setPaused(pausedRef.current);
                controls.current?.sync();
              }}
            >
              {paused ? "▶" : "Ⅱ"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
