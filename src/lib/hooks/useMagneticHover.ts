"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, supportsFinePointer } from "@/lib/gsap";

interface MagneticOptions {
  maxX?: number;
  maxY?: number;
  strength?: number;
  radius?: number;
  duration?: number;
}

const clamp = (value: number, max: number) =>
  Math.max(-max, Math.min(max, value));

/**
 * Magnetic pointer-follow effect.
 *
 * `targetRef` is the element that visually moves (transform-only).
 * `boundsRef` is the stable element the pointer position is measured
 * against and the one that should own the pointer handlers — moving
 * the coordinate system out from under itself would make the pull
 * jitter, so the two must always be different elements.
 *
 * FIX carried over from the original NavItem implementation:
 * gsap.quickTo() holds one persistent internal tween per
 * target+property for the life of the closures it returns. Any
 * *other* tween that later touches the same properties on the same
 * element (e.g. an independent gsap.to(el, { x: 0 }, { overwrite:
 * true })) will kill that internal tween via GSAP's overwrite
 * manager — even if it wasn't the tween actually running at that
 * moment. Once killed, the quickTo setters are left driving a dead
 * tween, which degrades silently after repeated hover cycles rather
 * than failing immediately.
 *
 * The fix is that `reset()` below routes back through the SAME
 * quickTo setters instead of creating a competing tween, so there is
 * only ever one tween instance owning x/y on the target element for
 * its whole mounted life.
 */
export function useMagneticHover<
  TTarget extends HTMLElement = HTMLElement,
  TBounds extends HTMLElement = HTMLElement,
>({
  maxX = 10,
  maxY = 7,
  strength = 0.42,
  radius = 110,
  duration = 0.22,
}: MagneticOptions = {}) {
  const targetRef = useRef<TTarget>(null);
  const boundsRef = useRef<TBounds>(null);

  const moveXRef = useRef<((value: number) => void) | null>(null);
  const moveYRef = useRef<((value: number) => void) | null>(null);

  useGSAP(() => {
    const target = targetRef.current;

    // Coarse-pointer devices (phones, and wide tablets that hit the
    // desktop layout) never get a real hover — skip the quickTo
    // tweens entirely rather than let a touch tap register as one.
    if (!target || prefersReducedMotion || !supportsFinePointer) return;

    const moveX = gsap.quickTo(target, "x", {
      duration,
      ease: "power3.out",
      overwrite: true,
    });

    const moveY = gsap.quickTo(target, "y", {
      duration,
      ease: "power3.out",
      overwrite: true,
    });

    moveXRef.current = moveX;
    moveYRef.current = moveY;

    return () => {
      moveXRef.current = null;
      moveYRef.current = null;

      gsap.killTweensOf(target);
    };
  }, []);

  const handlePointerMove = (event: ReactPointerEvent<TBounds>) => {
    // Touch (and pen-as-touch) pointers fire pointermove during
    // ordinary scrolling/tapping, so reacting to those would drag the
    // element toward wherever the finger last was and, since touch
    // rarely fires a matching pointerleave, leave it stuck off-center.
    // Only real mouse input drives the pull.
    if (
      prefersReducedMotion ||
      !supportsFinePointer ||
      event.pointerType !== "mouse" ||
      !moveXRef.current ||
      !moveYRef.current ||
      !boundsRef.current
    ) {
      return;
    }

    const rect = boundsRef.current.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = event.clientX - centerX;
    const offsetY = event.clientY - centerY;

    const distance = Math.hypot(offsetX, offsetY);

    const linear = Math.max(0, 1 - distance / radius);

    // Smootherstep: strong pull near center, fading naturally toward
    // the edge of the field instead of cutting off abruptly.
    const falloff = linear * linear * (3 - 2 * linear);

    moveXRef.current(clamp(offsetX * strength * falloff, maxX));
    moveYRef.current(clamp(offsetY * strength * falloff, maxY));
  };

  const reset = () => {
    if (!moveXRef.current || !moveYRef.current) return;

    moveXRef.current(0);
    moveYRef.current(0);
  };

  return { targetRef, boundsRef, handlePointerMove, reset };
}
