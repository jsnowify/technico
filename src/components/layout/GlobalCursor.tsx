"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import CursorLabel from "@/components/ui/CursorLabel";
import { gsap, prefersReducedMotion, supportsFinePointer } from "@/lib/gsap";

/* Deliberate opt-in: only marked text links receive the replacement cursor. */
const CURSOR_SELECTOR = 'a[data-cursor="circle"]';

export default function GlobalCursor() {
  const cursorRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label || prefersReducedMotion || !supportsFinePointer) {
      return;
    }

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      scaleX: 0.72,
      scaleY: 0.72,
      opacity: 0,
    });

    let activeTarget: HTMLElement | null = null;
    let frame: number | null = null;
    let pointer: PointerEvent | null = null;

    const release = () => {
      if (activeTarget) activeTarget.style.cursor = "";
      activeTarget = null;
      gsap.to(cursor, {
        scaleX: 0.72,
        scaleY: 0.72,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        overwrite: true,
      });
    };

    const claim = (target: HTMLElement) => {
      activeTarget = target;
      target.style.cursor = "none";
      label.textContent = target.dataset.cursorLabel || "Explore";
      gsap.to(cursor, {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        duration: 0.38,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = event;
      if (frame === null) {
        frame = requestAnimationFrame(() => {
          frame = null;
          if (!pointer) return;
          // The cursor position is 1:1. Only its reveal/hide is eased.
          gsap.set(cursor, { x: pointer.clientX, y: pointer.clientY });
        });
      }

      const next =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(CURSOR_SELECTOR)
          : null;
      if (next === activeTarget) return;
      release();
      if (next) claim(next);
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) release();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      if (frame !== null) cancelAnimationFrame(frame);
      pointer = null;
      if (activeTarget) activeTarget.style.cursor = "";
      gsap.killTweensOf(cursor);
    };
  }, []);

  return (
    <CursorLabel
      ref={cursorRef}
      className="fixed top-0 left-0 z-[140] hidden opacity-0 sm:flex"
    >
      <span ref={labelRef}>Explore</span>
    </CursorLabel>
  );
}
