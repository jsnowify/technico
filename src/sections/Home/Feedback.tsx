import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

import ReactiveGrid from "../../components/effects/ReactiveGrid";
import ScrambleText from "../../components/motion/ScrambleText";
import ScrambleReveal from "../../components/motion/Scramblereveal";
import ScrollRevealWords from "../../components/motion/ScrollRevealWords";
import { Blink, StatusDot } from "../../components/motion/Blink";

type FeedbackItem = {
  order: number;
  index: string;
  client: string;
  tag: string;
  quote: string;
};

const FEEDBACKS: readonly FeedbackItem[] = [
  {
    order: 1,
    index: "0.001",
    client: "MAG Solar",
    tag: "Residential Solar",
    quote:
      "Improved search visibility and local engagement resulted in a steady increase in qualified leads and installation inquiries. MAG Solar experienced consistent monthly leads for residential solar system projects.",
  },
  {
    order: 2,
    index: "0.002",
    client: "Auburn Bay Dental",
    tag: "Dental — SE Calgary",
    quote:
      "Optimized digital presence increased appointment bookings and local engagement for Auburn Bay Dental. The clinic experienced better search performance and more patient visits from SE Calgary and nearby communities.",
  },
  {
    order: 3,
    index: "0.003",
    client: "AutoFlow Car Rental",
    tag: "Car Rental — Regional & Int'l",
    quote:
      "Targeted digital strategies helped AutoFlow Car Rental boost online reservations and customer retention. The brand achieved higher search rankings and improved conversion rates from regional and international traffic.",
  },
  {
    order: 4,
    index: "0.004",
    client: "Westgate Dental Centre",
    tag: "Dental — Maple Ridge",
    quote:
      "SEO-optimized content and search visibility elevated Westgate Dental Centre's patient reach. The clinic recorded consistent growth in appointment requests and online reputation improvements in Maple Ridge and beyond.",
  },
  {
    order: 5,
    index: "0.005",
    client: "Sidhu Personal Injury Lawyers",
    tag: "Personal Injury Law — Alberta",
    quote:
      "Strategic content optimization expanded Sidhu Personal Injury Lawyers' client base in Alberta. The firm noted measurable growth in case consultations and stronger regional recognition in personal injury law.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Feedback Card                                                              */
/* -------------------------------------------------------------------------- */

function FeedbackCard({ item }: { item: FeedbackItem }) {
  return (
    <article
      data-feedback-card
      data-cursor="label"
      data-cursor-label="Drag"
      className={[
        "relative flex shrink-0 flex-col overflow-hidden",
        "w-[min(88vw,920px)]",
        "sm:w-[min(82vw,920px)]",
        "lg:w-[min(72vw,920px)]",
        "rounded-[2px] border border-white/15 bg-[#111111]",
        "p-5 sm:p-8 md:p-10 lg:p-11 xl:p-12",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.025)]",
      ].join(" ")}
      style={{
        minHeight: "clamp(420px, 62dvh, 610px)",
      }}
      aria-label={`Feedback from ${item.client}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute inset-x-0 top-0 h-px bg-white/25" />
        <div className="absolute inset-y-0 left-0 w-px bg-white/10" />
        <div className="absolute inset-y-0 right-0 w-px bg-white/10" />
        <div className="absolute bottom-0 left-0 h-px w-full bg-white/20" />
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* Card header */}
        <div className="mb-7 flex shrink-0 items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-white/35 sm:mb-10">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            Verified Result
          </span>

          <span>{item.index}</span>
        </div>

        {/* Quote */}
        <div className="flex min-h-0 flex-1 items-center">
          <p
            className={[
              "max-w-[850px]",
              "break-words",
              "font-medium",
              "text-[clamp(1.35rem,2.6vw,2.85rem)]",
              "leading-[1.12]",
              "tracking-[-0.02em]",
              "text-white",
              "[text-wrap:pretty]",
              "lg:tracking-[-0.035em]",
              "xl:text-[clamp(2.35rem,2.75vw,3rem)]",
            ].join(" ")}
          >
            “{item.quote}
            <span
              aria-hidden="true"
              className="quote-screen-cursor quote-screen-cursor--idle"
            >
              |
            </span>
            ”
          </p>
        </div>
      </div>

      {/* Card footer */}
      <div className="relative mt-7 flex shrink-0 items-end justify-between gap-5 border-t border-white/10 pt-5 sm:mt-8 sm:pt-6">
        <div className="min-w-0">
          <p className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white sm:text-xs">
            {item.client}
          </p>

          <p className="mt-1 truncate font-mono text-[8px] uppercase tracking-[0.14em] text-white/35 sm:text-[10px]">
            {item.tag}
          </p>
        </div>

        <span className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-white/25 sm:block">
          Client Feedback
        </span>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Drag configuration                                                         */
/* -------------------------------------------------------------------------- */

const DRAG_LOCK_THRESHOLD = 8;
const RUBBER_BAND = 0.28;

type Bounds = { min: number; max: number };

/* -------------------------------------------------------------------------- */
/* Feedback                                                                   */
/* -------------------------------------------------------------------------- */

export default function Feedback() {
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /*
   * The live x-position lives in a ref.
   *
   * This is intentional. Pointer movement should NOT cause a React render.
   * Rendering React on every mousemove was the source of the desktop cursor
   * fighting/repositioning behavior.
   */
  const offsetRef = useRef(0);

  const dragRef = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    startOffset: 0,
    currentOffset: 0,
    lock: null as "x" | "y" | null,
    captured: false,
    /*
     * FIX (choppy/broken drag, especially on touch):
     * bounds used to be recomputed on every pointermove via
     * getBounds() -> getSnapPositions(), which reads offsetLeft /
     * offsetWidth off every card in the track. That forces a
     * synchronous layout reflow on every single drag frame. Now we
     * snapshot bounds once when the drag starts and reuse them for
     * the whole gesture — resize handling below still recalculates
     * when the viewport actually changes.
     */
    bounds: { min: 0, max: 0 } as Bounds,
  });

  const [isDragging, setIsDragging] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Scroll reveal                                                             */
  /* ------------------------------------------------------------------------ */

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const revealItems = Array.from(
        root.querySelectorAll<HTMLElement>("[data-feedback-reveal]"),
      );

      if (prefersReducedMotion) {
        gsap.set(revealItems, {
          autoAlpha: 1,
          y: 0,
        });

        return;
      }

      gsap.set(revealItems, {
        autoAlpha: 0,
        y: 24,
      });

      revealItems.forEach((item) => {
        gsap.to(item, {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    {
      scope: rootRef,
    },
  );

  /* ------------------------------------------------------------------------ */
  /* Track rendering                                                           */
  /* ------------------------------------------------------------------------ */

  const renderTrack = (value: number, animate = false) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    offsetRef.current = value;

    if (animate) {
      gsap.to(track, {
        x: value,
        duration: 0.52,
        ease: "power3.out",
        overwrite: true,
      });
    } else {
      gsap.set(track, {
        x: value,
      });
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Card positions                                                            */
  /* ------------------------------------------------------------------------ */

  const getSnapPositions = () => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track) {
      return [];
    }

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-feedback-card]"),
    );

    if (!cards.length) {
      return [];
    }

    const viewportCenter = viewport.clientWidth / 2;

    return cards.map((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;

      return viewportCenter - cardCenter;
    });
  };

  const getBounds = (): Bounds => {
    const positions = getSnapPositions();

    if (!positions.length) {
      return {
        min: 0,
        max: 0,
      };
    }

    return {
      min: Math.min(...positions),
      max: Math.max(...positions),
    };
  };

  const clampOffset = (value: number, bounds: Bounds = getBounds()) => {
    const { min, max } = bounds;

    return Math.min(max, Math.max(min, value));
  };

  const rubberBandOffset = (value: number, bounds: Bounds) => {
    const { min, max } = bounds;

    if (value > max) {
      return max + (value - max) * RUBBER_BAND;
    }

    if (value < min) {
      return min + (value - min) * RUBBER_BAND;
    }

    return value;
  };

  /* ------------------------------------------------------------------------ */
  /* Snap                                                                      */
  /* ------------------------------------------------------------------------ */

  const snapToCard = (value: number) => {
    const positions = getSnapPositions();

    if (!positions.length) {
      renderTrack(0, true);
      return;
    }

    let closest = positions[0];
    let closestDistance = Math.abs(value - closest);

    for (let i = 1; i < positions.length; i += 1) {
      const candidate = positions[i];

      const distance = Math.abs(value - candidate);

      if (distance < closestDistance) {
        closest = candidate;
        closestDistance = distance;
      }
    }

    renderTrack(clampOffset(closest), true);
  };

  /* ------------------------------------------------------------------------ */
  /* Responsive resize                                                         */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let frame = 0;

    const handleResize = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const positions = getSnapPositions();

        if (!positions.length) {
          renderTrack(0);
          return;
        }

        let nearest = positions[0];

        let nearestDistance = Math.abs(offsetRef.current - nearest);

        for (let i = 1; i < positions.length; i += 1) {
          const distance = Math.abs(offsetRef.current - positions[i]);

          if (distance < nearestDistance) {
            nearest = positions[i];

            nearestDistance = distance;
          }
        }

        renderTrack(nearest, true);
      });
    };

    window.addEventListener("resize", handleResize);

    window.addEventListener("orientationchange", handleResize);

    return () => {
      cancelAnimationFrame(frame);

      window.removeEventListener("resize", handleResize);

      window.removeEventListener("orientationchange", handleResize);
    };

    // These functions intentionally read refs at runtime.
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Pointer down                                                              */
  /* ------------------------------------------------------------------------ */

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    /*
     * Ignore right/middle mouse buttons.
     */
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    const track = trackRef.current;

    /*
     * If the carousel is currently snapping,
     * immediately stop that animation.
     *
     * Otherwise the animation and pointer drag can
     * compete for the same transform.
     */
    if (track) {
      gsap.killTweensOf(track);

      const currentX = gsap.getProperty(track, "x");

      if (typeof currentX === "number") {
        offsetRef.current = currentX;
      }
    }

    dragRef.current = {
      pointerId: event.pointerId,

      startX: event.clientX,

      startY: event.clientY,

      startOffset: offsetRef.current,

      currentOffset: offsetRef.current,

      lock: event.pointerType === "touch" ? null : "x",

      captured: false,

      // Snapshot once per gesture — see note on the dragRef declaration.
      bounds: getBounds(),
    };

    /*
     * Desktop mouse / pen:
     * immediately own the pointer.
     */
    if (event.pointerType !== "touch") {
      event.currentTarget.setPointerCapture(event.pointerId);

      dragRef.current.captured = true;

      setIsDragging(true);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Pointer move                                                              */
  /* ------------------------------------------------------------------------ */

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;

    const deltaY = event.clientY - drag.startY;

    /*
     * Touch:
     * decide whether the gesture is horizontal
     * or vertical before taking control.
     */
    if (drag.lock === null) {
      const absX = Math.abs(deltaX);

      const absY = Math.abs(deltaY);

      if (absX < DRAG_LOCK_THRESHOLD && absY < DRAG_LOCK_THRESHOLD) {
        return;
      }

      if (absX > absY) {
        drag.lock = "x";

        event.currentTarget.setPointerCapture(event.pointerId);

        drag.captured = true;

        setIsDragging(true);
      } else {
        /*
         * Vertical gesture belongs to the page.
         */
        drag.lock = "y";
        return;
      }
    }

    if (drag.lock !== "x") {
      return;
    }

    /*
     * Horizontal drag is now ours.
     */
    event.preventDefault();

    const nextOffset = rubberBandOffset(drag.startOffset + deltaX, drag.bounds);

    drag.currentOffset = nextOffset;

    /*
     * CRITICAL:
     *
     * No setState here.
     * No React render here.
     *
     * The DOM transform follows the physical
     * pointer directly.
     */
    renderTrack(nextOffset, false);
  };

  /* ------------------------------------------------------------------------ */
  /* Pointer end                                                               */
  /* ------------------------------------------------------------------------ */

  const finishDrag = (
    event: React.PointerEvent<HTMLDivElement>,
    cancelled = false,
  ) => {
    const drag = dragRef.current;

    if (drag.pointerId !== event.pointerId) {
      return;
    }

    if (
      drag.captured &&
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);

    if (drag.lock === "x") {
      if (cancelled) {
        renderTrack(clampOffset(drag.startOffset, drag.bounds), true);
      } else {
        snapToCard(drag.currentOffset);
      }
    }

    dragRef.current = {
      pointerId: -1,
      startX: 0,
      startY: 0,
      startOffset: offsetRef.current,
      currentOffset: offsetRef.current,
      lock: null,
      captured: false,
      bounds: { min: 0, max: 0 },
    };
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(event);
  };

  const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(event, true);
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-black py-16 text-white sm:py-24 md:py-32 lg:py-40"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ReactiveGrid className="z-0 text-white" opacity={0.1} shipCount={1} />

        <div
          aria-hidden="true"
          className="absolute -right-[6vw] top-[4%] select-none text-[38vw] font-black leading-none tracking-[-0.05em] text-white/[0.04] md:text-[30vw]"
        >
          09
        </div>
      </div>

      <div className="relative z-10">
        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
          <div className="border-t border-white/15 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-y-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/50 lg:text-[10px]">
              <Blink as="span" className="text-[#6D28D9]">
                <span
                  className="inline-block whitespace-nowrap"
                  data-feedback-header
                >
                  Client Results
                </span>
              </Blink>

              <span className="hidden items-center gap-1.5 text-white/35 md:inline-flex">
                <StatusDot />

                <span
                  className="inline-block whitespace-nowrap"
                  data-feedback-header
                >
                  System Nominal
                </span>
              </span>

              <span
                className="inline-block whitespace-nowrap"
                data-feedback-header
              >
                09 / Feedback
              </span>
            </div>

            <div className="mt-4 h-px w-full bg-[var(--color-accent)]/40" />
          </div>

          {/* Intro */}
          <div className="mt-10 lg:mt-20">
            <div
              data-feedback-reveal
              className="mb-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 lg:mb-8"
            >
              <span className="h-px w-8 bg-[var(--color-accent)]" />

              <ScrambleReveal as="span" variant="micro">
                Verified Outcomes
              </ScrambleReveal>
            </div>

            <h2 className="max-w-5xl uppercase tracking-[-0.03em] [text-wrap:balance] lg:tracking-[-0.05em]">
              <ScrambleText
                as="span"
                variant="display"
                className="block text-[2rem] font-semibold leading-[1.04] sm:text-[2.5rem] sm:leading-[1] lg:text-[4.25rem] lg:leading-[0.98] xl:text-[4.75rem]"
              >
                Where Performance Meets Results
              </ScrambleText>

              <ScrambleText
                as="span"
                variant="display"
                className="block text-[2rem] font-semibold leading-[1.04] text-[var(--color-accent)] sm:text-[2.5rem] sm:leading-[1] lg:text-[4.25rem] lg:leading-[0.98] xl:text-[4.75rem]"
              >
                How Our Solutions Deliver Success
              </ScrambleText>
            </h2>

            <ScrollRevealWords
              as="p"
              className="mt-8 max-w-3xl text-lg font-medium leading-snug text-white [text-wrap:pretty] sm:mt-10 sm:text-xl lg:mt-14 lg:text-[1.85rem]"
              start="top 85%"
              end="top 45%"
            >
              Our marketing solutions help businesses across Canada grow through
              targeted digital content strategies that turn search visibility
              into measurable leads, bookings, and consultations.
            </ScrollRevealWords>

            <div
              data-feedback-reveal
              className="mt-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/30 sm:mt-6 lg:mt-8"
            >
              <Blink as="span">
                <StatusDot />
              </Blink>

              <ScrambleReveal as="span" variant="micro">
                Drag To Explore Feedback
              </ScrambleReveal>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Carousel                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div
          ref={viewportRef}
          className={[
            "relative mt-10 overflow-hidden select-none",
            "sm:mt-14 lg:mt-16",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          ].join(" ")}
          style={{
            touchAction: "pan-y",

            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",

            maskImage:
              "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          onDragStart={(event) => event.preventDefault()}
        >
          <div
            ref={trackRef}
            className={[
              "flex w-max gap-4",
              "px-[6vw]",
              "sm:gap-6 sm:px-[8vw]",
              "lg:px-[10vw]",
            ].join(" ")}
            style={{
              transform: "translate3d(0, 0, 0)",
              willChange: "transform",
            }}
          >
            {FEEDBACKS.map((item) => (
              <FeedbackCard key={item.order} item={item} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          data-feedback-reveal
          className="mx-5 mt-8 flex flex-wrap items-center justify-between gap-y-2 border-t border-white/10 pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-white/30 sm:mx-6 md:mx-10 lg:mx-12 lg:mt-14 lg:text-[9px] xl:mx-14"
        >
          <ScrambleReveal as="span" variant="micro">
            Technico Digital Solutions Inc
          </ScrambleReveal>

          <span className="hidden items-center gap-1.5 md:inline-flex">
            <StatusDot />

            <ScrambleReveal as="span" variant="micro">
              System Nominal
            </ScrambleReveal>
          </span>

          <Blink as="span">
            <ScrambleReveal as="span" variant="micro">
              09.001
            </ScrambleReveal>
          </Blink>
        </div>
      </div>
    </section>
  );
}
