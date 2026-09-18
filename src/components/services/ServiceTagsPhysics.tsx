"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";

import { usePrefersReducedMotion } from "@/lib/gsap";

/* ================================================================
   SERVICE TAGS — physics stack
   ================================================================
   Six service pills drop into the hero image panel one after
   another and pile up into a tower, using Matter.js for the actual
   2D rigid-body simulation (gravity, collision, a bit of bounce).
   The DOM stays the source of visual truth — each pill is a real
   HTML element (so text stays crisp and matches the rest of the
   site's chip styling); Matter only supplies x/y/angle, which gets
   written to that element's `transform` every animation frame.

   REQUIRES the `matter-js` package (`npm install matter-js` — add
   `@types/matter-js` too if the project doesn't already ship its
   own types). Not part of this repo's existing dependencies, so
   this needs installing before the build will succeed.

   Order matters here: bodies are dropped in list order, and the
   first one dropped lands first (i.e. ends up at the BOTTOM of the
   pile, since later drops land on top of it). To land in the same
   top-to-bottom reading order as the reference design (SEO on top,
   Social Media Management at the base), the array below is written
   bottom-first.

   Lazily initializes only once the panel reports a non-zero size,
   so the hidden twin of this component (mobile vs desktop each
   render their own copy, one of them `hidden` at any given
   breakpoint per ServicesHero's existing layout split) doesn't spin
   up a broken 0×0 simulation.
   ================================================================ */

type TagTone = "white" | "pink" | "purple";

interface ServiceTag {
  label: string;
  tone: TagTone;
}

const TONE_CLASSES: Record<TagTone, string> = {
  white: "bg-white-primary text-black-text",
  pink: "bg-pink-accent text-black-bg",
  purple: "bg-purple-accent text-black-bg",
};

// Bottom-first drop order — see note above.
const TAGS: ServiceTag[] = [
  { label: "Social Media Management", tone: "white" },
  { label: "Content Services", tone: "pink" },
  { label: "Email Marketing", tone: "purple" },
  { label: "Advertising", tone: "white" },
  { label: "Web Dev", tone: "pink" },
  { label: "SEO", tone: "purple" },
];

// Static fallback order (top-to-bottom, matching the settled physics
// result) for prefers-reduced-motion — no simulation, just the pile
// as it would have landed.
const STATIC_STACK: ServiceTag[] = [...TAGS].reverse();

export default function ServiceTagsPhysics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const container = containerRef.current;
    if (!container) return;

    let engine: Matter.Engine | null = null;
    let runner: Matter.Runner | null = null;
    let frame = 0;
    let started = false;
    let cancelled = false;
    const dropTimeouts: ReturnType<typeof setTimeout>[] = [];
    const mouse = { x: -9999, y: -9999 };
    let cleanupPointerListeners: (() => void) | null = null;
    let cleanupScrollListener: (() => void) | null = null;

    const { Engine, Runner, Bodies, Body, Composite } = Matter;

    const start = (width: number, height: number) => {
      if (started || cancelled) return;
      started = true;

      // The mobile/tablet panel (aspect-[4/3] or aspect-[16/10], full
      // section width) is much smaller than the desktop hero panel
      // (1243px wide). Reusing the same gravity/bounce/force tuning
      // for both meant the small panel felt way too violent — pills
      // dropping only a little distance were still hitting with full
      // desktop-speed gravity, bouncing hard off walls a few dozen
      // pixels apart, and reacting to hover/scroll forces sized for a
      // much bigger stage. Scale everything down together whenever
      // the panel is small, so the simulation looks calm and settled
      // there instead of jittery.
      const isSmallPanel = width < 500;

      engine = Engine.create();
      engine.gravity.y = isSmallPanel ? 0.55 : 1;
      const world = engine.world;

      const wallThickness = 80;
      const floor = Bodies.rectangle(
        width / 2,
        height + wallThickness / 2,
        width * 2,
        wallThickness,
        { isStatic: true },
      );
      const leftWall = Bodies.rectangle(
        -wallThickness / 2,
        height / 2,
        wallThickness,
        height * 3,
        { isStatic: true },
      );
      const rightWall = Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height * 3,
        { isStatic: true },
      );
      Composite.add(world, [floor, leftWall, rightWall]);

      const bodies: (Matter.Body | null)[] = TAGS.map(() => null);

      // Drop each pill in with a short stagger instead of spawning
      // all six at once (which reads as an explosion of overlapping
      // rectangles rather than a stack forming).
      TAGS.forEach((_, i) => {
        const timeout = setTimeout(() => {
          if (cancelled) return;
          const el = pillRefs.current[i];
          if (!el) return;
          const w = el.offsetWidth || 100;
          const h = el.offsetHeight || 36;
          const startX = width / 2 + (Math.random() - 0.5) * (width * 0.15);
          const startY = -h - i * 40;
          const angle = (Math.random() - 0.5) * (isSmallPanel ? 0.15 : 0.3);
          const body = Bodies.rectangle(startX, startY, w, h, {
            // Chamfer radius is capped at half the pill's own height so
            // the small mobile-size pills (much shorter than the
            // desktop/tablet ones) don't get a corner radius bigger
            // than the pill itself, which Matter renders/collides
            // oddly on very short rectangles.
            chamfer: { radius: Math.min(20, h / 2) },
            restitution: isSmallPanel ? 0.08 : 0.2,
            friction: 0.7,
            frictionStatic: 0.9,
            frictionAir: isSmallPanel ? 0.035 : 0.02,
            angle,
          });
          Body.setAngularVelocity(
            body,
            (Math.random() - 0.5) * (isSmallPanel ? 0.06 : 0.15),
          );

          // Snap the element to the body's spawn point (off-screen,
          // above the panel) BEFORE making it visible, so it never
          // flashes at its default top:0;left:0 CSS position for a
          // frame — that's what caused the clumped-pills-in-the-
          // corner glitch on refresh.
          el.style.transform = `translate(${startX - w / 2}px, ${
            startY - h / 2
          }px) rotate(${angle}rad)`;
          el.style.opacity = "1";

          bodies[i] = body;
          Composite.add(world, body);
        }, i * 220);
        dropTimeouts.push(timeout);
      });

      runner = Runner.create();
      Runner.run(runner, engine);

      // Hover disruption: cursor pushes nearby pills away like a
      // little shockwave, instead of just sitting inert once the
      // pile has settled. Radius/strength tuned so it reads as a
      // nudge, not an explosion — closer bodies get shoved harder.
      const HOVER_RADIUS = isSmallPanel ? 90 : 160;
      const HOVER_FORCE = isSmallPanel ? 0.018 : 0.045;
      mouse.x = -9999;
      mouse.y = -9999;

      const handlePointerMove = (e: PointerEvent) => {
        const rect = container!.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      };
      const handlePointerLeave = () => {
        mouse.x = -9999;
        mouse.y = -9999;
      };
      container.addEventListener("pointermove", handlePointerMove);
      container.addEventListener("pointerleave", handlePointerLeave);
      cleanupPointerListeners = () => {
        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerleave", handlePointerLeave);
      };

      // Scroll disruption: scrolling the page gives the pile a gentle
      // upward drift. Scroll events can fire many times per single
      // flick of a trackpad/wheel, so we DON'T touch body velocity
      // directly from the scroll handler — stacking discrete velocity
      // snaps from dozens of rapid-fire events is what caused the
      // jumpy/glitchy feel. Instead the handler only accumulates a
      // bounded "boost" value, and the render loop below bleeds it
      // out as a small continuous force each frame, decaying it back
      // to zero — same mechanism Matter already uses for real forces,
      // so it stays smooth and stays in sync with the engine's own
      // timestep.
      const SCROLL_TO_BOOST = isSmallPanel ? 0.0004 : 0.0009;
      const MAX_BOOST = isSmallPanel ? 0.012 : 0.026;
      const BOOST_DECAY = 0.91;
      let scrollBoost = 0;
      let lastScrollY = window.scrollY;

      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const rawDelta = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;
        if (rawDelta === 0) return;

        // Downward scroll → upward drift. Upward scroll → softer still.
        const contribution =
          rawDelta > 0
            ? rawDelta * SCROLL_TO_BOOST
            : rawDelta * SCROLL_TO_BOOST * 0.25;
        scrollBoost = Math.max(
          -MAX_BOOST,
          Math.min(MAX_BOOST, scrollBoost - contribution),
        );
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      cleanupScrollListener = () => {
        window.removeEventListener("scroll", handleScroll);
      };

      const tick = () => {
        bodies.forEach((body, i) => {
          const el = pillRefs.current[i];
          if (!el || !body) return;

          const dx = body.position.x - mouse.x;
          const dy = body.position.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < HOVER_RADIUS && dist > 0.01) {
            const falloff = 1 - dist / HOVER_RADIUS;
            const forceMag = HOVER_FORCE * falloff * falloff;
            Body.applyForce(body, body.position, {
              x: (dx / dist) * forceMag,
              y: (dy / dist) * forceMag,
            });
          }

          if (Math.abs(scrollBoost) > 0.00005) {
            Body.applyForce(body, body.position, { x: 0, y: scrollBoost });
          }

          const w = el.offsetWidth;
          const h = el.offsetHeight;
          el.style.transform = `translate(${body.position.x - w / 2}px, ${
            body.position.y - h / 2
          }px) rotate(${body.angle}rad)`;
        });
        scrollBoost *= BOOST_DECAY;
        frame = requestAnimationFrame(tick);
      };
      tick();
    };

    // Wait for the panel to report real dimensions before starting —
    // handles both first paint and the case where this instance is
    // currently the `hidden` breakpoint twin.
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        start(width, height);
      } else if (started && engine) {
        // Panel collapsed to 0 (its breakpoint twin is now the
        // hidden one) — nothing to do; the rAF loop just idles on
        // stale positions until it's visible again.
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelled = true;
      dropTimeouts.forEach(clearTimeout);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      if (cleanupPointerListeners) cleanupPointerListeners();
      if (cleanupScrollListener) cleanupScrollListener();
      if (runner) Runner.stop(runner);
      if (engine) {
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      }
    };
  }, [reduceMotion]);

  if (reduceMotion) {
    // No simulation — just render the settled pile directly, top to
    // bottom, centered in the panel.
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5 px-4 sm:gap-2 sm:px-6">
        {STATIC_STACK.map((tag) => (
          <span
            key={tag.label}
            className={`rounded-[12px] px-3 py-1.5 text-[10px] tracking-tight whitespace-nowrap uppercase shadow-[0_8px_20px_rgba(0,0,0,0.25)] sm:rounded-[20px] sm:px-8 sm:py-4 sm:text-xl lg:text-2xl ${TONE_CLASSES[tag.tone]}`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 z-10 overflow-hidden">
      {TAGS.map((tag, i) => (
        <div
          key={tag.label}
          ref={(el) => {
            pillRefs.current[i] = el;
          }}
          className={`absolute top-0 left-0 rounded-[12px] px-3 py-1.5 text-[10px] tracking-tight whitespace-nowrap uppercase opacity-0 shadow-[0_8px_20px_rgba(0,0,0,0.25)] sm:rounded-[20px] sm:px-8 sm:py-4 sm:text-xl lg:text-2xl ${TONE_CLASSES[tag.tone]}`}
          style={{ willChange: "transform" }}
        >
          {tag.label}
        </div>
      ))}
    </div>
  );
}
