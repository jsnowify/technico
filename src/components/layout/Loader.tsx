import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { notifyPageReady } from "../../lib/pageReady";
import { loaderState } from "../../lib/loaderState";

const COLS = 8;
const ROWS = 5;
const CELL_COUNT = COLS * ROWS;
const COUNT_DURATION = 1.6; // seconds to count 0 -> 100
const FILL_DURATION = 0.7; // square scaling up to cover screen

/*
 * ============================================================
 * SHAPE MORPH KEYFRAMES
 *
 * The square is driven through square -> circle -> rounded square ->
 * diamond -> square purely via border-radius + rotation — no
 * clip-path, no extra dependency. A "diamond" is just the square
 * rotated 45deg; continuing that rotation to 90deg lands back on a
 * visually identical square (4-fold symmetry), so the loop closes
 * with no snap.
 *
 * `at` is a percentage of the 0-100 load progress, so shape changes
 * are driven directly off the same value being counted up on screen
 * rather than a separate parallel timer — they cannot drift out of
 * sync with each other.
 * ============================================================
 */
const SHAPE_KEYFRAMES = [
  { at: 0, radius: 0, rotate: 0 }, // square
  { at: 25, radius: 50, rotate: 0 }, // circle
  { at: 50, radius: 28, rotate: 0 }, // rounded square
  { at: 75, radius: 0, rotate: 45 }, // diamond
  { at: 100, radius: 0, rotate: 90 }, // square (rotation continues, reads identical)
] as const;

function getShapeAt(progress: number) {
  const p = gsap.utils.clamp(0, 100, progress);

  for (let i = 0; i < SHAPE_KEYFRAMES.length - 1; i++) {
    const a = SHAPE_KEYFRAMES[i];
    const b = SHAPE_KEYFRAMES[i + 1];

    if (p <= b.at) {
      const t = (p - a.at) / (b.at - a.at);

      return {
        radius: gsap.utils.interpolate(a.radius, b.radius, t),
        rotate: gsap.utils.interpolate(a.rotate, b.rotate, t),
      };
    }
  }

  const last = SHAPE_KEYFRAMES[SHAPE_KEYFRAMES.length - 1];
  return { radius: last.radius, rotate: last.rotate };
}

function CubeLayer({
  collect,
}: {
  collect: (i: number, el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      className="absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: CELL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => collect(i, el)}
          style={{ background: "var(--color-accent)" }}
        />
      ))}
    </div>
  );
}

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const countRef = useRef({ value: 0 });
  const [display, setDisplay] = useState("00");

  const cubes = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const ctx = gsap.context(() => {
      // Cube layer starts invisible (scaleY 0) — it only appears once the
      // square has already filled the screen, standing in for that same
      // solid purple so the swap is invisible.
      gsap.set(cubes.current, { scaleY: 0, transformOrigin: "bottom" });

      // Explicit starting shape state — square, unrotated — so this
      // reads identically on every mount.
      gsap.set(squareRef.current, { borderRadius: "0%", rotate: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          loaderState.isActive = false;
          // Let anything waiting (usePageEnter on the mounted page) know
          // it's safe to start its enter animation now.
          notifyPageReady();
        },
      });

      // Square pop-in.
      tl.fromTo(
        squareRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" },
      )

        // Count 0 -> 100, morphing the square's shape in lockstep with
        // the same value driving the on-screen counter.
        .to(
          countRef.current,
          {
            value: 100,
            duration: COUNT_DURATION,
            ease: "power1.inOut",
            onUpdate: () => {
              const value = countRef.current.value;

              setDisplay(String(Math.round(value)).padStart(2, "0"));

              if (squareRef.current) {
                const shape = getShapeAt(value);

                gsap.set(squareRef.current, {
                  borderRadius: `${shape.radius}%`,
                  rotate: shape.rotate,
                });
              }
            },
          },
          "-=0.1",
        )

        // Square scales up to swallow the whole viewport. By this point
        // the morph has already resolved back to a sharp-cornered square
        // (radius 0), so the fill reads as one continuous motion rather
        // than a shape snapping straight before scaling.
        .to(squareRef.current, {
          scale: 60,
          duration: FILL_DURATION,
          ease: "power4.in",
        })

        // Swap: cube layer snaps to full (scaleY 1, matches the square's
        // purple exactly), square hides — the swap reads as continuous.
        .set(cubes.current, { scaleY: 1 })
        .set(squareRef.current, { autoAlpha: 0 })

        // Flip anchor to top so cubes recede upward.
        .set(cubes.current, { transformOrigin: "top" })

        // OUT — slower, smoother wave reveal. Longer duration + wider
        // stagger gap so the wave visibly travels across the screen
        // instead of snapping, and power3 eases more gently than power4
        // at this length.
        .to(cubes.current, {
          scaleY: 0,
          duration: 1.1,
          ease: "power3.inOut",
          stagger: {
            each: 0.035,
            grid: [ROWS, COLS] as [number, number],
            from: "start",
            axis: "x",
          },
        })
        .set(loader, { autoAlpha: 0 });
    }, loader);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={loaderRef}
      className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: "var(--color-black)" }}
    >
      <CubeLayer
        collect={(i, el) => {
          if (el) cubes.current[i] = el;
        }}
      />

      <span className="absolute top-6 right-6 z-10 font-mono text-xs tracking-[0.15em] text-white/80">
        [ {display} ]
      </span>

      <div
        ref={squareRef}
        className="relative z-10 h-8 w-8"
        style={{ background: "var(--color-accent)" }}
      />
    </div>
  );
}
