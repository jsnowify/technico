import { useRef, type PointerEvent, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import {
  gsap,
  prefersReducedMotion,
  supportsFinePointer,
} from "../../lib/gsap";

const MAX_TILT = 11; // degrees, each axis
const LIFT = 24; // px, translateZ on hover
const TILT_DURATION = 0.5;
const GLARE_DURATION = 0.45;

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Wraps `children` in a pointer-reactive 3D tilt. The card itself
 * rotates toward the cursor and lifts slightly on the Z axis; any
 * child given its own `translateZ` (see StatCard below) rides that
 * same rotation at a different apparent depth, which is what reads
 * as "parallax" rather than a flat tilt.
 *
 * FIX (same bug documented in Header's NavItem): reset goes through
 * the identical quickTo setters used for pointer-move, never a
 * competing gsap.to — otherwise repeated hover/leave cycles silently
 * kill the internal quickTo tween via GSAP's overwrite manager.
 *
 * FIX (mobile/tablet): pointer events fire for touch too, so a
 * finger dragging across a card mid-scroll used to register as a
 * "hover" and run this tilt math every frame during a scroll —
 * exactly when a phone/tablet can least afford it — and could leave
 * the card visibly stuck mid-tilt when pointerleave never fires
 * cleanly for a touch gesture. Gated on `supportsFinePointer`
 * (pointer: fine) so touch/coarse-pointer devices, including
 * landscape iPad, skip the tilt entirely and the card just sits flat.
 */
export default function TiltCard({ children, className }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const rotateX = useRef<((v: number) => void) | null>(null);
  const rotateY = useRef<((v: number) => void) | null>(null);
  const lift = useRef<((v: number) => void) | null>(null);
  const glareX = useRef<((v: number) => void) | null>(null);
  const glareY = useRef<((v: number) => void) | null>(null);
  const glareOpacity = useRef<((v: number) => void) | null>(null);

  useGSAP(() => {
    const card = cardRef.current;
    const glare = glareRef.current;

    if (!card || !glare || prefersReducedMotion || !supportsFinePointer) return;

    gsap.set(card, { transformPerspective: 900 });

    rotateX.current = gsap.quickTo(card, "rotateX", {
      duration: TILT_DURATION,
      ease: "power3.out",
    });
    rotateY.current = gsap.quickTo(card, "rotateY", {
      duration: TILT_DURATION,
      ease: "power3.out",
    });
    lift.current = gsap.quickTo(card, "z", {
      duration: TILT_DURATION,
      ease: "power3.out",
    });

    glareX.current = gsap.quickTo(glare, "x", {
      duration: GLARE_DURATION,
      ease: "power3.out",
    });
    glareY.current = gsap.quickTo(glare, "y", {
      duration: GLARE_DURATION,
      ease: "power3.out",
    });
    glareOpacity.current = gsap.quickTo(glare, "opacity", {
      duration: GLARE_DURATION,
      ease: "power2.out",
    });

    return () => {
      rotateX.current = null;
      rotateY.current = null;
      lift.current = null;
      glareX.current = null;
      glareY.current = null;
      glareOpacity.current = null;

      gsap.killTweensOf([card, glare]);
    };
  }, []);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    // Matches Button.tsx's useMagnetic fix: only real mouse input
    // drives the tilt — touch pointermove during a scroll-drag over
    // the card is otherwise misread as a hover.
    if (
      prefersReducedMotion ||
      !supportsFinePointer ||
      event.pointerType !== "mouse" ||
      !cardRef.current
    ) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();

    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    rotateY.current?.((px - 0.5) * MAX_TILT * 2);
    rotateX.current?.((0.5 - py) * MAX_TILT * 2);
    lift.current?.(LIFT);

    glareX.current?.((px - 0.5) * rect.width * 0.6);
    glareY.current?.((py - 0.5) * rect.height * 0.6);
    glareOpacity.current?.(0.45);
  };

  const handleLeave = () => {
    rotateX.current?.(0);
    rotateY.current?.(0);
    lift.current?.(0);
    glareOpacity.current?.(0);
  };

  return (
    <div style={{ perspective: 900 }}>
      <div
        ref={cardRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className={`relative overflow-hidden will-change-transform ${className ?? ""}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}

        {/* Glare — a soft light that drifts with the pointer,
            clipped to the card. Purely additive; children handle
            their own depth via translateZ. */}
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1/2 opacity-0"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)",
          }}
        />
      </div>
    </div>
  );
}
