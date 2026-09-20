"use client";

import { useRef, useSyncExternalStore } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { FEEDBACK, type FeedbackItem } from "@/lib/constants";
import CursorLabel from "@/components/ui/CursorLabel";
import PixelRevealImage from "./PixelRevealImage";

const LOOP_ITEMS = [...FEEDBACK, ...FEEDBACK];
const LOOP_DURATION = 48;
const HOVER_SPEED = 0.16;

function subscribeToMobile(callback: () => void) {
  const query = window.matchMedia("(max-width: 639px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribeToMobile,
    () => window.matchMedia("(max-width: 639px)").matches,
    () => false,
  );
}

function possessive(name: string) {
  return name.endsWith("s") ? `${name}'` : `${name}'s`;
}

function FeedbackCard({
  item,
  index,
  sizes,
}: {
  item: FeedbackItem;
  index: number;
  sizes: string;
}) {
  const number = String((index % FEEDBACK.length) + 1).padStart(2, "0");

  return (
    <article className="flex h-full min-w-0 flex-col border-y border-r border-white/15 bg-black-bg text-white-text first:border-l">
      <div className="flex min-h-11 items-center justify-between gap-5 border-b border-white/15 px-4 font-mono text-[9px] tracking-[0.04em] text-content-muted uppercase sm:px-5 sm:text-[10px]">
        <span>/ Client {number}</span>
        <span className="text-right">Growth story</span>
      </div>

      <figure className="relative aspect-[4/3] overflow-hidden border-b border-white/15 bg-white/5">
        <PixelRevealImage src={item.image} alt={item.name} sizes={sizes} />
        <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-4 bg-black-bg/80 px-3 py-2 font-mono text-[9px] tracking-[0.04em] text-content uppercase backdrop-blur-sm sm:inset-x-5 sm:bottom-5 sm:text-[10px]">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
            Verified result
          </span>
          <span>
            {number} / {String(FEEDBACK.length).padStart(2, "0")}
          </span>
        </figcaption>
      </figure>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="h3-section max-w-[24ch] leading-[1.12] font-medium tracking-heading text-white-text">
          {item.name}
        </h3>
        <p className="body-copy mt-4 max-w-[56ch] leading-[1.6] tracking-[-0.035em] text-content">
          &ldquo;{item.quote}&rdquo;
        </p>

        <div className="mt-auto flex items-center justify-between gap-5 border-t border-white/15 pt-4 font-mono text-[9px] tracking-[0.04em] text-content-muted uppercase sm:mt-6 sm:text-[10px]">
          <span>Technico / Canada</span>
          <span className="text-accent">+</span>
        </div>
      </div>
    </article>
  );
}

export default function Feedback() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const pillNameRef = useRef<HTMLSpanElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrapper = wrapperRef.current;
      const track = trackRef.current;
      const pill = pillRef.current;
      const pillName = pillNameRef.current;
      const mobileViewport = window.matchMedia("(max-width: 639px)").matches;
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!wrapper || !track || isMobile || mobileViewport || reducedMotion) {
        return;
      }

      const marquee = gsap.to(track, {
        xPercent: -50,
        duration: LOOP_DURATION,
        ease: "none",
        repeat: -1,
        paused: true,
      });

      let inView = false;
      let pointerFrame: number | null = null;
      let latestPointer: PointerEvent | null = null;

      const updatePlayback = () => {
        const shouldRun = inView && !document.hidden;
        track.dataset.running = String(shouldRun);
        track.style.willChange = shouldRun ? "transform" : "auto";
        if (shouldRun) marquee.play();
        else marquee.pause();
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          inView = entry?.isIntersecting ?? false;
          updatePlayback();
        },
        { rootMargin: "120px 0px", threshold: 0.01 },
      );
      observer.observe(wrapper);

      const handleVisibility = () => updatePlayback();
      document.addEventListener("visibilitychange", handleVisibility);

      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
        .matches;
      const cards = Array.from(
        wrapper.querySelectorAll<HTMLElement>("[data-feedback-card]"),
      );
      const cardCleanups: Array<() => void> = [];

      if (finePointer && pill && pillName) {
        gsap.set(pill, {
          xPercent: -50,
          yPercent: -50,
          scaleX: 0.65,
          scaleY: 0.65,
          opacity: 0,
        });

        const positionPill = (event: PointerEvent) => {
          const bounds = wrapper.getBoundingClientRect();
          const halfWidth = pill.offsetWidth / 2;
          const halfHeight = pill.offsetHeight / 2;
          const x = Math.min(
            Math.max(event.clientX - bounds.left, halfWidth),
            bounds.width - halfWidth,
          );
          const y = Math.min(
            Math.max(event.clientY - bounds.top, halfHeight),
            bounds.height - halfHeight,
          );
          // Cursor position is deliberately 1:1. Only the tooltip's
          // enter/exit scale is eased; its movement never trails behind.
          gsap.set(pill, { x, y });
        };

        const handlePointerMove = (event: PointerEvent) => {
          latestPointer = event;
          if (pointerFrame !== null) return;
          pointerFrame = window.requestAnimationFrame(() => {
            pointerFrame = null;
            if (latestPointer) positionPill(latestPointer);
          });
        };

        const handleWrapperLeave = () => {
          gsap.killTweensOf(marquee);
          gsap.to(marquee, {
            timeScale: 1,
            duration: 0.7,
            ease: "power2.out",
          });
          gsap.to(pill, {
            scaleX: 0.65,
            scaleY: 0.65,
            opacity: 0,
            duration: 0.25,
            ease: "power2.out",
            overwrite: true,
            onComplete: () => {
              pill.style.willChange = "auto";
            },
          });
        };

        wrapper.addEventListener("pointermove", handlePointerMove);
        wrapper.addEventListener("pointerleave", handleWrapperLeave);

        for (const card of cards) {
          const handleCardEnter = (event: PointerEvent) => {
            pillName.textContent = `${possessive(card.dataset.feedbackName ?? "Client")} story`;
            pill.style.willChange = "transform, opacity";
            positionPill(event);
            gsap.killTweensOf(marquee);
            gsap.to(marquee, {
              timeScale: HOVER_SPEED,
              duration: 0.55,
              ease: "power2.out",
            });
            gsap.to(pill, {
              scaleX: 1,
              scaleY: 1,
              opacity: 1,
              duration: 0.4,
              ease: "power3.out",
              overwrite: true,
            });
          };
          card.addEventListener("pointerenter", handleCardEnter);
          cardCleanups.push(() =>
            card.removeEventListener("pointerenter", handleCardEnter),
          );
        }

        cardCleanups.push(() => {
          wrapper.removeEventListener("pointermove", handlePointerMove);
          wrapper.removeEventListener("pointerleave", handleWrapperLeave);
        });
      }

      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", handleVisibility);
        cardCleanups.forEach((cleanup) => cleanup());
        if (pointerFrame !== null) window.cancelAnimationFrame(pointerFrame);
        latestPointer = null;
        gsap.killTweensOf(marquee);
        marquee.kill();
        if (pill) gsap.killTweensOf(pill);
        track.style.willChange = "auto";
        track.dataset.running = "false";
      };
    },
    { scope: sectionRef, dependencies: [isMobile], revertOnUpdate: true },
  );

  const scrollByCard = (direction: 1 | -1) => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (!cards.length) return;

    const center = track.scrollLeft + track.clientWidth / 2;
    const current = cards.reduce(
      (closest, card, index) => {
        const distance = Math.abs(
          card.offsetLeft + card.offsetWidth / 2 - center,
        );
        return distance < closest.distance ? { index, distance } : closest;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY },
    ).index;
    const next = (current + direction + cards.length) % cards.length;
    const target =
      cards[next].offsetLeft - (track.clientWidth - cards[next].offsetWidth) / 2;

    track.scrollTo({
      left: Math.max(0, Math.min(target, track.scrollWidth - track.clientWidth)),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <section id="feedback" ref={sectionRef} className="bg-black-bg text-white-text">
      <div className="container-x mx-auto w-full max-w-[1920px] pt-10 sm:pt-12 md:pt-14 lg:pt-16">
        <header className="grid grid-cols-1 gap-5 border-t border-white/20 pt-5 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
          <div className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-content-muted uppercase sm:pt-1 sm:text-xs">
            <span aria-hidden="true">/</span>
            <span>Client feedback</span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:gap-12">
            <h2 className="h2-section max-w-[20ch] leading-[1.08] font-medium tracking-heading text-white-text">
              Where performance meets measurable results.
            </h2>
            <p className="body-copy max-w-[48ch] leading-[1.6] tracking-[-0.02em] text-content uppercase lg:pt-1">
              Our marketing solutions help businesses across Canada turn search
              visibility into measurable leads, bookings, and consultations.
              Explore the results behind each partnership.
            </p>
          </div>
        </header>
      </div>

      {isMobile ? (
        <div className="mt-8">
          <div
            ref={mobileTrackRef}
            data-feedback-mobile-track
            className="flex snap-x snap-mandatory overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {FEEDBACK.map((item, index) => (
              <div
                key={item.name}
                className="mr-px w-[84vw] shrink-0 snap-center last:mr-0"
              >
                <FeedbackCard item={item} index={index} sizes="84vw" />
              </div>
            ))}
          </div>

          <div className="container-x mt-4 flex items-center justify-between gap-5">
            <span className="font-mono text-[10px] tracking-[0.04em] text-content-muted uppercase">
              Swipe / explore stories
            </span>
            <div className="flex items-center gap-px">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() => scrollByCard(-1)}
                className="flex h-11 w-11 items-center justify-center border border-white/20 text-white-text transition-colors active:bg-accent active:text-black-bg"
              >
                <span aria-hidden="true">&larr;</span>
              </button>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => scrollByCard(1)}
                className="flex h-11 w-11 items-center justify-center border border-white/20 text-white-text transition-colors active:bg-accent active:text-black-bg"
              >
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div ref={wrapperRef} className="relative mt-10 overflow-hidden">
          <div
            ref={trackRef}
            data-feedback-track
            data-running="false"
            className="flex w-max items-stretch"
          >
            {LOOP_ITEMS.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                data-feedback-card
                data-feedback-name={item.name}
                aria-hidden={index >= FEEDBACK.length || undefined}
                className="mr-px w-[48vw] shrink-0 md:w-[26rem]"
              >
                <FeedbackCard
                  item={item}
                  index={index}
                  sizes="(min-width: 768px) 26rem, 48vw"
                />
              </div>
            ))}
          </div>

          <CursorLabel
            ref={pillRef}
            className="absolute top-0 left-0 z-10 opacity-0"
          >
            <span ref={pillNameRef}>Client story</span>
          </CursorLabel>
        </div>
      )}

      <div className="pb-10 sm:pb-12 md:pb-14 lg:pb-16" />
    </section>
  );
}
