import { useRef, type PointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  prefersReducedMotion,
  supportsFinePointer,
} from "../../lib/gsap";

const MAX_TILT = 9; // degrees, each axis
const TARGET_RADIUS = 205; // matches the outer ring's SVG radius

type OrbitDialProps = {
  className?: string;
  /** Stroke color class for the base rings — defaults to the low-
   *  opacity white used everywhere else in this dark section's
   *  hairline chrome. */
  ringClassName?: string;
};

/**
 * The orbit motif from Hero's "02 / System" readout and
 * Introduction's sticky abstract visual — same concentric-ring +
 * tilted-ellipse SVG — reused here and made pointer-interactive
 * rather than purely decorative:
 *
 *  - Base rings still auto-rotate on their own independent loop
 *    (opposite directions, same as Hero) so the dial stays "alive"
 *    even if nobody touches it.
 *  - NEW — perspective tilt: the whole dial tilts toward the pointer
 *    in 3D, the same technique TiltCard uses (gsap.quickTo on
 *    rotateX/rotateY, reset through those same setters on pointer
 *    leave rather than a competing gsap.to, which is what avoids the
 *    quickTo/overwrite-manager bug documented in TiltCard/Header).
 *  - NEW — target lock: a small accent marker on the outer ring
 *    swings to the pointer's actual bearing off the dial's center
 *    (atan2), like a sensor slewing to track a contact, instead of
 *    just riding the ambient rotation. This is the one piece of real
 *    interactivity rather than decorative parallax.
 *
 * Respects prefers-reduced-motion: renders the static rings with no
 * rotation and no pointer handlers wired up at all.
 *
 * The pointer-tilt and target-lock pieces are further gated on
 * `supportsFinePointer` (pointer: fine) — the ambient ring rotation
 * still runs on touch/coarse-pointer devices, but the tilt/lock
 * math is skipped so a touch tap or scroll-drag across the dial on
 * phones and tablets (landscape iPad included) doesn't get read as
 * a pointer hover.
 */
export default function OrbitDial({
  className,
  ringClassName = "text-white/25",
}: OrbitDialProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<SVGGElement>(null);

  const rotateX = useRef<((v: number) => void) | null>(null);
  const rotateY = useRef<((v: number) => void) | null>(null);
  const targetAngle = useRef<((v: number) => void) | null>(null);

  useGSAP(
    () => {
      const dial = dialRef.current;
      if (!dial) return;

      if (prefersReducedMotion) return;

      const rings = dial.querySelectorAll<SVGGElement>("[data-orbit-ring]");

      gsap.to(rings[0], {
        rotation: 360,
        duration: 50,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });
      if (rings[1]) {
        gsap.to(rings[1], {
          rotation: -360,
          duration: 38,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
      }

      // Pointer-tilt + target-lock are pointer-driven effects, not
      // just decorative — skip setting them up at all on touch/
      // coarse-pointer devices (phones, and tablets like landscape
      // iPad) rather than let a touch tap register as a hover, the
      // same fix applied to TiltCard and Header's magnetic nav.
      // The ambient ring rotation above is unaffected either way.
      const target = targetRef.current;

      if (supportsFinePointer) {
        gsap.set(dial, { transformPerspective: 800 });

        rotateX.current = gsap.quickTo(dial, "rotateX", {
          duration: 0.6,
          ease: "power3.out",
        });
        rotateY.current = gsap.quickTo(dial, "rotateY", {
          duration: 0.6,
          ease: "power3.out",
        });

        if (target) {
          gsap.set(target, { transformOrigin: "250px 250px" });
          targetAngle.current = gsap.quickTo(target, "rotation", {
            duration: 0.5,
            ease: "power3.out",
          });
        }
      }

      return () => {
        rotateX.current = null;
        rotateY.current = null;
        targetAngle.current = null;
        gsap.killTweensOf(dial);
        if (target) gsap.killTweensOf(target);
        gsap.killTweensOf(rings);
      };
    },
    { scope: wrapRef },
  );

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    // Matches Button.tsx's useMagnetic fix: only real mouse input
    // drives the tilt/target-lock — touch pointermove during a
    // scroll-drag over the dial is otherwise misread as a hover.
    if (
      prefersReducedMotion ||
      !supportsFinePointer ||
      event.pointerType !== "mouse" ||
      !wrapRef.current
    ) {
      return;
    }

    const rect = wrapRef.current.getBoundingClientRect();

    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    rotateY.current?.((px - 0.5) * MAX_TILT * 2);
    rotateX.current?.((0.5 - py) * MAX_TILT * 2);

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    targetAngle.current?.(angleDeg);
  };

  const handleLeave = () => {
    rotateX.current?.(0);
    rotateY.current?.(0);
  };

  return (
    <div
      ref={wrapRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative ${className ?? ""}`}
      style={{ perspective: 800 }}
    >
      <div
        ref={dialRef}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg viewBox="0 0 500 500" className="h-full w-full" fill="none">
          <g data-orbit-ring>
            <circle
              cx="250"
              cy="250"
              r={TARGET_RADIUS}
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 8"
              className={ringClassName}
            />
            <ellipse
              cx="250"
              cy="250"
              rx={TARGET_RADIUS}
              ry="75"
              transform="rotate(-25 250 250)"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 9"
              className={ringClassName}
            />
          </g>

          <g data-orbit-ring>
            <circle
              cx="250"
              cy="250"
              r="145"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="1 6"
              className={ringClassName}
            />
          </g>

          <line
            x1="250"
            y1="25"
            x2="250"
            y2="475"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 9"
            className="text-white/10"
          />
          <line
            x1="25"
            y1="250"
            x2="475"
            y2="250"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 9"
            className="text-white/10"
          />

          <circle
            cx="250"
            cy="250"
            r="7"
            fill="currentColor"
            className="text-white"
          />
          <circle
            cx="250"
            cy="250"
            r="18"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/40"
          />

          {/* Target lock — tracks the pointer's live bearing off the
              dial's own center, riding the outer ring radius. */}
          <g ref={targetRef}>
            <circle
              cx="250"
              cy={250 - TARGET_RADIUS}
              r="5"
              fill="var(--color-accent)"
            />
            <circle
              cx="250"
              cy={250 - TARGET_RADIUS}
              r="13"
              stroke="var(--color-accent)"
              strokeWidth="1"
              strokeDasharray="2 4"
              opacity="0.6"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
