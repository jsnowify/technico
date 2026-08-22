import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { getDeviceCapabilitySignals } from "../../lib/deviceCapability";

type ReactiveGridProps = {
  className?: string;
  opacity?: number;
  /**
   * When true, a second distortion source travels through the grid
   * tied to this element's scroll progress through the viewport (0 at
   * the moment it enters from the bottom, 1 as it exits the top) —
   * independent of the cursor ripple.
   */
  scrollReactive?: boolean;
  /**
   * Number of small ">" ships that glide along grid lines. 0 disables
   * them entirely. Each ship is assigned to a random line on mount and
   * follows that line's *current* (already-distorted) shape, so it
   * reads as riding the grid rather than floating over it.
   */
  shipCount?: number;
};

const VIEWBOX_WIDTH = 1600;
const VIEWBOX_HEIGHT = 1000;

/*
 * ============================================================
 * DEVICE TIER
 *
 * The grid's cost is dominated by (lines * segments) points, each
 * touched every frame. Rather than one fixed resolution for every
 * device, pick a resolution — and how often we're allowed to touch
 * the DOM — based on rough capability signals. This is read once on
 * mount; we intentionally don't chase every resize (a phone rotating
 * doesn't change its CPU).
 * ============================================================
 */
type Tier = "low" | "mid" | "high";

type TierConfig = {
  verticalLines: number;
  horizontalLines: number;
  segments: number;
  /** Skip this many ticks between updates. 0 = every frame. */
  frameSkip: number;
  /** Cursor ripple needs a sqrt + normalize per point — the single
   *  most expensive part of the loop. Coarse-pointer devices don't
   *  really benefit from it anyway (no persistent hover). */
  cursorEnabled: boolean;
};

const TIER_CONFIG: Record<Tier, TierConfig> = {
  low: {
    verticalLines: 9,
    horizontalLines: 7,
    segments: 18,
    frameSkip: 2,
    cursorEnabled: false,
  },
  mid: {
    verticalLines: 13,
    horizontalLines: 9,
    segments: 34,
    frameSkip: 1,
    cursorEnabled: true,
  },
  high: {
    verticalLines: 19,
    horizontalLines: 13,
    segments: 60,
    frameSkip: 0,
    cursorEnabled: true,
  },
};

function detectTier(): Tier {
  if (typeof window === "undefined") return "mid";

  const { coarsePointer, cores, memory, narrow } = getDeviceCapabilitySignals();

  if (
    coarsePointer &&
    (narrow || cores <= 4 || (memory !== undefined && memory <= 4))
  ) {
    return "low";
  }

  if (cores <= 6 || narrow) {
    return "mid";
  }

  return "high";
}

/*
 * Cursor interaction
 */
const CURSOR_RADIUS = 280;
const MAX_DISPLACEMENT = 95;

/*
 * Scroll interaction — a horizontal "scan band" sweeping from the
 * bottom of the viewBox to the top as the section scrolls through the
 * viewport. Cheap (abs + one multiply, no sqrt), so left on for every
 * tier when scrollReactive is set.
 */
const SCAN_BAND = 260;
const SCAN_DISPLACEMENT = 40;

/*
 * Ships
 */
const SHIP_MIN_SPEED = 0.045; // progress/sec along its line
const SHIP_MAX_SPEED = 0.085;

type LineData = {
  ox: Float32Array;
  oy: Float32Array;
  isVertical: boolean;
  phase: number;
};

function buildLine(
  index: number,
  count: number,
  segments: number,
  isVertical: boolean,
  phase: number,
): LineData {
  const ox = new Float32Array(segments + 1);
  const oy = new Float32Array(segments + 1);

  if (isVertical) {
    const x = (index / (count - 1)) * VIEWBOX_WIDTH;
    for (let s = 0; s <= segments; s++) {
      ox[s] = x;
      oy[s] = (s / segments) * VIEWBOX_HEIGHT;
    }
  } else {
    const y = (index / (count - 1)) * VIEWBOX_HEIGHT;
    for (let s = 0; s <= segments; s++) {
      ox[s] = (s / segments) * VIEWBOX_WIDTH;
      oy[s] = y;
    }
  }

  return { ox, oy, isVertical, phase };
}

/*
 * Builds the smoothed "d" attribute from two flat coordinate buffers
 * instead of an array of {x,y} objects — avoids allocating (segments
 * + 1) objects per line, per frame. `scratch` is a reused array of
 * string parts, shared across every line in a given frame since each
 * line is fully joined before the next one starts writing to it.
 */
function buildSmoothPath(
  xs: Float32Array,
  ys: Float32Array,
  length: number,
  scratch: string[],
): string {
  if (length < 2) return "";

  let i = 0;
  scratch[i++] = `M ${xs[0]} ${ys[0]}`;

  for (let p = 1; p < length - 1; p++) {
    const cx = xs[p];
    const cy = ys[p];
    const nx = xs[p + 1];
    const ny = ys[p + 1];

    scratch[i++] = `Q ${cx} ${cy} ${(cx + nx) / 2} ${(cy + ny) / 2}`;
  }

  scratch[i++] = `T ${xs[length - 1]} ${ys[length - 1]}`;
  scratch.length = i;

  return scratch.join(" ");
}

export default function ReactiveGrid({
  className = "",
  opacity = 0.18,
  scrollReactive = false,
  shipCount = 1,
}: ReactiveGridProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathsRef = useRef<SVGPathElement[]>([]);
  const shipsRef = useRef<SVGGElement[]>([]);

  const tier = useMemo(() => detectTier(), []);
  const config = TIER_CONFIG[tier];

  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const lines = useMemo(() => {
    const built: LineData[] = [];

    for (let i = 0; i < config.verticalLines; i++) {
      built.push(
        buildLine(i, config.verticalLines, config.segments, true, i * 0.35),
      );
    }

    for (let i = 0; i < config.horizontalLines; i++) {
      built.push(
        buildLine(
          i,
          config.horizontalLines,
          config.segments,
          false,
          (config.verticalLines + i) * 0.35,
        ),
      );
    }

    return built;
  }, [config.verticalLines, config.horizontalLines, config.segments]);

  const [ships] = useState(() => {
    if (reducedMotion || shipCount <= 0 || lines.length === 0) return [];

    return Array.from({ length: shipCount }, () => ({
      lineIndex: Math.floor(Math.random() * lines.length),
      t: Math.random(),
      speed: SHIP_MIN_SPEED + Math.random() * (SHIP_MAX_SPEED - SHIP_MIN_SPEED),
      direction: Math.random() < 0.5 ? 1 : -1,
    }));
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || reducedMotion) return;

    const mouse = { x: VIEWBOX_WIDTH / 2, y: VIEWBOX_HEIGHT / 2 };
    const target = { x: VIEWBOX_WIDTH / 2, y: VIEWBOX_HEIGHT / 2 };

    const scan = { y: VIEWBOX_HEIGHT + SCAN_BAND };
    const scanTarget = { y: VIEWBOX_HEIGHT + SCAN_BAND };

    // Reused every frame, for every line — the only per-frame
    // allocations left are the small `d` strings themselves, which
    // the DOM needs anyway.
    const scratchX = new Float32Array(config.segments + 1);
    const scratchY = new Float32Array(config.segments + 1);
    const scratchParts: string[] = [];

    const handlePointerMove = (event: PointerEvent) => {
      const rect = svg.getBoundingClientRect();

      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return;
      }

      target.x = ((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH;
      target.y = ((event.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT;
    };

    if (config.cursorEnabled) {
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
    }

    const updateScanTarget = () => {
      if (!scrollReactive) return;

      const rect = svg.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      const progress = gsap.utils.clamp(
        0,
        1,
        (vh - rect.top) / (vh + rect.height),
      );

      scanTarget.y =
        VIEWBOX_HEIGHT +
        SCAN_BAND -
        progress * (VIEWBOX_HEIGHT + 2 * SCAN_BAND);
    };

    if (scrollReactive) {
      updateScanTarget();
      window.addEventListener("scroll", updateScanTarget, { passive: true });
      window.addEventListener("resize", updateScanTarget);
    }

    // Pause entirely while off-screen — no point spending CPU on a
    // section scrolled three pages away.
    let ticking = false;
    let visible = false;

    const attach = () => {
      if (!ticking) {
        gsap.ticker.add(render);
        ticking = true;
      }
    };

    const detach = () => {
      if (ticking) {
        gsap.ticker.remove(render);
        ticking = false;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) attach();
        else detach();
      },
      { threshold: 0 },
    );

    observer.observe(svg);

    let frameCount = 0;
    const skipEvery = config.frameSkip + 1;
    let lastTime = performance.now();

    function render() {
      frameCount++;
      if (frameCount % skipEvery !== 0) return;

      mouse.x += (target.x - mouse.x) * 0.075;
      mouse.y += (target.y - mouse.y) * 0.075;
      scan.y += (scanTarget.y - scan.y) * 0.08;

      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const time = now * 0.001;

      for (let li = 0; li < lines.length; li++) {
        const line = lines[li];
        const path = pathsRef.current[li];
        if (!path) continue;

        const { ox, oy, isVertical, phase } = line;
        const len = ox.length;

        for (let p = 0; p < len; p++) {
          const px = ox[p];
          const py = oy[p];

          let cursorDX = 0;
          let cursorDY = 0;

          if (config.cursorEnabled) {
            const dx = mouse.x - px;
            const dy = mouse.y - py;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const normalized = Math.max(0, 1 - distance / CURSOR_RADIUS);
            const influence = normalized * normalized * (3 - 2 * normalized);
            const displacement = influence * MAX_DISPLACEMENT;
            const inv = 1 / Math.max(distance, 1);

            cursorDX = dx * inv * displacement;
            cursorDY = dy * inv * displacement;
          }

          const ambient = Math.sin(time * 0.35 + p * 0.18 + phase) * 1.8;
          const wobble = Math.sin(time * 0.3 + p * 0.2 + phase) * 0.7;

          let scanOffset = 0;
          if (scrollReactive) {
            const scanDistance = Math.abs(py - scan.y);
            const scanNormalized = Math.max(0, 1 - scanDistance / SCAN_BAND);
            scanOffset =
              scanNormalized *
              scanNormalized *
              (3 - 2 * scanNormalized) *
              SCAN_DISPLACEMENT;
          }

          if (isVertical) {
            scratchX[p] = px + ambient * 0.35 + cursorDX;
            scratchY[p] = py + wobble + scanOffset * 0.4;
          } else {
            scratchX[p] = px + wobble;
            scratchY[p] = py + ambient * 0.35 + cursorDY + scanOffset;
          }
        }

        path.setAttribute(
          "d",
          buildSmoothPath(scratchX, scratchY, len, scratchParts),
        );

        // Any ship riding this line samples the same displaced
        // coordinates we just wrote, so it tracks the live curve
        // instead of the flat original.
        for (let si = 0; si < ships.length; si++) {
          const ship = ships[si];
          if (ship.lineIndex !== li) continue;

          const el = shipsRef.current[si];
          if (!el) continue;

          ship.t += ship.speed * ship.direction * dt;
          if (ship.t > 1) ship.t -= 1;
          if (ship.t < 0) ship.t += 1;

          const scaled = ship.t * (len - 1);
          const i0 = Math.floor(scaled);
          const i1 = Math.min(i0 + 1, len - 1);
          const frac = scaled - i0;

          const sx = scratchX[i0] + (scratchX[i1] - scratchX[i0]) * frac;
          const sy = scratchY[i0] + (scratchY[i1] - scratchY[i0]) * frac;

          let angle =
            (Math.atan2(
              scratchY[i1] - scratchY[i0],
              scratchX[i1] - scratchX[i0],
            ) *
              180) /
            Math.PI;

          if (ship.direction < 0) angle += 180;

          el.setAttribute(
            "transform",
            `translate(${sx} ${sy}) rotate(${angle})`,
          );
        }
      }
    }

    return () => {
      observer.disconnect();
      detach();

      if (config.cursorEnabled) {
        window.removeEventListener("pointermove", handlePointerMove);
      }

      if (scrollReactive) {
        window.removeEventListener("scroll", updateScanTarget);
        window.removeEventListener("resize", updateScanTarget);
      }
    };
  }, [lines, ships, config, scrollReactive, reducedMotion]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{
        opacity,
        contain: "layout paint",
      }}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="2 7"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      >
        {lines.map((line, index) => (
          <path
            key={index}
            ref={(element) => {
              if (element) pathsRef.current[index] = element;
            }}
            d={buildSmoothPath(line.ox, line.oy, line.ox.length, [])}
          />
        ))}
      </g>

      {/* Ships — small ">" chevrons riding a line's live shape. Drawn
          in their own local coordinate space (tip at +x) and moved
          purely via `transform`, so per-frame updates are one
          attribute write each, not a path rebuild. */}
      {ships.map((_, index) => (
        <g
          key={index}
          ref={(element) => {
            if (element) shipsRef.current[index] = element;
          }}
          fill="var(--color-accent)"
        >
          <circle cx="-6" cy="0" r="3" opacity="0.35" />
          <path d="M -5 -4.5 L 5 0 L -5 4.5 Z" />
        </g>
      ))}
    </svg>
  );
}
