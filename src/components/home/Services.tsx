"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SERVICES, type Service } from "@/lib/constants";
import SlidingText from "@/components/motion/SlidingText";
import RevealUpText from "@/components/motion/RevealUpText";
import {
  SERVICES_FOCUS_EVENT,
  SERVICES_UNFOCUS_EVENT,
} from "@/components/layout/Header/header.config";

/* ================================================================
   SERVICES (fifth section)
   ================================================================
   Desktop mechanism, lifted from the reference video: the section
   pins in place (position stays fixed) while the user keeps
   scrolling, and that extra scroll distance drives a single
   scrubbed horizontal translation of the panel track — classic GSAP
   ScrollTrigger pin+scrub horizontal-scroll. Sized here to exactly 2
   panels visible at a time (w-1/2 each) to match the approved static
   layout, rather than the reference's fluid/uneven panel widths.

   RISE-IN ON ENTRY: in the reference, panels don't just glide in
   horizontally — each one starts a bit lower than the row and rises
   up into alignment as it slides in from the right, while whichever
   panel is already "present" (the initial pair) just stays put. That's
   a per-panel `y` tween, but it has to react to the *horizontal*
   track position rather than the page's vertical scroll — GSAP's
   `containerAnimation` option is exactly for this: it lets a nested
   ScrollTrigger read progress off another tween (the horizontal
   `scrollTween` below) instead of the viewport. Each incoming panel
   gets its own trigger keyed to `containerAnimation: scrollTween`,
   with `scrub: true` so the rise is driven directly by how far the
   user has scrolled (not an automatic timed animation) — it plays
   forward as a panel arrives and back again if the user scrolls
   back over it.

   gsap.matchMedia() scopes the pin/rise-in mechanism to md+ only.
   Below md, pinning a horizontal scroll fights the page's own
   vertical scroll and is a poor touch experience, so mobile instead
   gets a plain vertical stack of the same panels — ordinary page
   scroll, no horizontal swiping, no GSAP pin, just a normal list
   like every other section on the page. It's a full separate markup
   block (not a CSS reflow of the same one), same swap-the-whole-
   markup approach already used in QuestionsAnswers.tsx for its
   mobile/desktop split.

   Every icon also gets a small continuous idle float (`.service-icon`,
   set up once at the top of the effect, unconditional on breakpoint)
   so the panels feel alive rather than static, independent of scroll
   or pin state.

   prefersReducedMotion skips the whole effect — no icon float, no
   matchMedia registration — so reduced-motion users always get the
   plain scrollable row with static icons (never the pin or the
   rise-in), same as never registering the animation in the first
   place rather than disabling it after the fact.
   ================================================================ */

function ServicePanel({
  service,
  className = "",
  priority = false,
}: {
  service: Service;
  className?: string;
  priority?: boolean;
}) {
  // Local hover state drives the shared SlidingText effect on "Learn
  // More" — same mechanism as the header nav (NavItem.tsx) and the
  // Button component: brackets stay put, the label itself slides up
  // and out while a duplicate slides in from below.
  const [learnMoreHovered, setLearnMoreHovered] = useState(false);

  return (
    <div
      className={`service-panel flex items-center gap-8 border border-[#D9D9D9] bg-white px-8 py-12 sm:gap-10 sm:px-10 sm:py-12 md:px-10 md:py-10 lg:px-12 lg:py-12 ${className}`}
    >
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
        <div>
          <h3 className="text-2xl leading-tight font-normal text-balance tracking-tight text-black-text sm:text-3xl">
            {service.title}
          </h3>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-black-text/70 text-pretty sm:mt-5 sm:text-base">
            {service.description}
          </p>
        </div>

        <ul className="mt-7 space-y-2.5 sm:mt-7 sm:space-y-2.5">
          {service.bullets.map((bullet) => (
            <li
              key={bullet}
              className="text-sm leading-relaxed text-black-text/45 sm:text-base"
            >
              <span aria-hidden="true" className="mr-1 text-black-text/25">
                &gt;
              </span>
              {bullet}
            </li>
          ))}
        </ul>

        <Link
          href={service.href}
          aria-label="Learn More"
          onMouseEnter={() => setLearnMoreHovered(true)}
          onMouseLeave={() => setLearnMoreHovered(false)}
          className="mt-7 inline-flex w-fit items-center font-mono text-xs tracking-[0.14em] text-black-text uppercase transition-colors duration-300 hover:text-black-text/50 sm:mt-7 sm:text-sm"
        >
          <span aria-hidden="true">[&nbsp;</span>
          <SlidingText text="Learn More" isHovered={learnMoreHovered} />
          <span aria-hidden="true">&nbsp;]</span>
        </Link>
      </div>

      {/* `service-icon` gets a slow, continuous idle float (see the
          useGSAP effect below) — purely decorative, so it's the icon
          wrapper that moves rather than the Image itself. The tween
          uses `force3D: true`, which is what actually gets this onto
          the GPU compositor while it's animating — a static
          `will-change` class on every icon (most of which are
          off-canvas or below the fold most of the time) would just
          force permanent layer promotion for no benefit, so that's
          intentionally left off here. Intrinsic size is trimmed to
          what the largest rendered size (lg: 9rem = 144px, ~288px
          @2x) actually needs, with `sizes` so the browser never
          fetches more than that per breakpoint, and only the panels
          visible on first paint (`priority`) skip native lazy
          loading — everything else (off-canvas in the horizontal
          track, or further down the mobile stack) loads lazily. */}
      <div className="service-icon hidden w-28 shrink-0 sm:block md:w-28 lg:w-36">
        <Image
          src={service.icon}
          alt=""
          width={288}
          height={288}
          sizes="(min-width: 1024px) 9rem, 7rem"
          priority={priority}
          className="h-auto w-full object-contain"
        />
      </div>
    </div>
  );
}

export default function Services() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      // Idle float on every service icon — small, continuous,
      // independent of scroll — just enough motion so the icons read
      // as "alive" rather than static art. Runs on mobile and desktop
      // alike (outside the md+ matchMedia block below). A single
      // staggered tween targeting the whole `.service-icon` list
      // (rather than one gsap.to() per icon in a loop) means one
      // tween instance for GSAP's ticker to manage instead of N, and
      // `force3D: true` keeps it strictly on the GPU compositor —
      // no layout or paint per frame. Paused whenever the tab isn't
      // visible so it doesn't burn CPU/battery in a background tab.
      const icons = gsap.utils.toArray<HTMLElement>(".service-icon");
      const floatTween = gsap.to(icons, {
        y: -10,
        duration: 2.4,
        ease: "sine.inOut",
        force3D: true,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.2, from: "start" },
      });

      const handleVisibilityChange = () => {
        if (document.hidden) {
          floatTween.pause();
        } else {
          floatTween.play();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const pin = pinRef.current;
        const track = trackRef.current;
        if (!pin || !track) return;

        // Header has no ref into this component — Header and Services
        // are siblings composed in app/page.tsx — so rather than
        // reach for context/prop-drilling just for this, the same
        // ScrollTrigger that drives the horizontal scroll also
        // dispatches plain window events at the exact moments the pin
        // engages/releases. Header listens for these (see
        // Header/index.tsx's "SERVICES FOCUS MODE" effect) to morph
        // itself down to a logo-only badge for the duration of the
        // pin, in both scroll directions.
        const scrollTween = gsap.to(track, {
          x: () => -(track.scrollWidth - pin.offsetWidth),
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${track.scrollWidth - pin.offsetWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () =>
              window.dispatchEvent(new Event(SERVICES_FOCUS_EVENT)),
            onEnterBack: () =>
              window.dispatchEvent(new Event(SERVICES_FOCUS_EVENT)),
            onLeave: () =>
              window.dispatchEvent(new Event(SERVICES_UNFOCUS_EVENT)),
            onLeaveBack: () =>
              window.dispatchEvent(new Event(SERVICES_UNFOCUS_EVENT)),
          },
        });

        // Rise-in: each panel starts lower and animates up to its
        // settled position as it slides into view. `containerAnimation`
        // reads progress off scrollTween's horizontal position rather
        // than the page's vertical scroll, so this plays exactly as
        // each panel crosses into the pinned viewport — `scrub: true`
        // ties the tween directly to scroll position (not an automatic
        // timed animation), so it moves exactly as far as the user has
        // scrolled, in both directions.
        //
        // The only panels excluded from this are the pair already
        // fully onscreen before any scrolling happens (the initial
        // "present" pair) — those are set to their settled position
        // immediately so they're never lower to begin with. Every
        // other panel starts lower and rises as it arrives from the
        // right ("incoming"), scrubbed 1:1 with scroll.
        const panels = track.querySelectorAll<HTMLElement>(".service-panel");
        const panelWidth = pin.offsetWidth / 2; // 2 panels visible at a time (w-1/2 each)

        panels.forEach((panel, i) => {
          const startsOnscreen = i * panelWidth < pin.offsetWidth;

          if (startsOnscreen) {
            gsap.set(panel, { y: 0 });
            return;
          }

          gsap.fromTo(
            panel,
            { y: 72 },
            {
              y: 0,
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: "left 85%",
                end: "left 55%",
                scrub: true,
              },
            },
          );
        });

        return () => {
          scrollTween.scrollTrigger?.kill();
          scrollTween.kill();
          // Belt-and-suspenders: if this unmounts while the pin is
          // still engaged (e.g. navigating away mid-scroll), make sure
          // Header doesn't get left stuck in focus mode.
          window.dispatchEvent(new Event(SERVICES_UNFOCUS_EVENT));
        };
      });

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
        mm.revert();
      };
    },
    { scope: pinRef },
  );

  return (
    <section className="bg-white-bg">
      {/* Top padding matched to Strategy.tsx's outer container
          (pt-16, no responsive step-up) instead of this section's
          previous pt-20 sm:pt-24 md:pt-28. */}
      <div className="mx-auto max-w-6xl px-6 pt-16">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3">
          <span className="h-2.5 w-2.5 shrink-0 bg-black-text" />
          <span className="font-mono text-xs tracking-[0.16em] text-black-text uppercase text-balance sm:text-sm">
            Services
          </span>
        </div>

        {/* Headline — word-by-word scroll rise-in via RevealUpText,
            same classes it replaced. */}
        <RevealUpText
          as="h2"
          text="Accelerate your online growth with proven digital marketing services"
          className="mx-auto mt-7 max-w-4xl text-balance text-center text-[32px] leading-[1.2] font-medium tracking-tight text-black-text sm:mt-8 sm:text-[42px] sm:leading-[1.15] sm:tracking-[-1.5px] md:text-[56px] md:leading-[1.12] md:tracking-[-2px] lg:text-[64px]"
        />
        <p className="mx-auto mt-7 max-w-2xl text-center text-sm leading-loose text-black-text/60 text-pretty sm:mt-8 sm:text-base">
          Our specialty is to help businesses grow faster online through
          effective digital marketing services. If you&rsquo;re building
          visibility from scratch or scaling an established brand, our
          strategies are built around measurable outcomes: more traffic,
          stronger leads, and better ROI.
        </p>
      </div>

      {/* Panel strip — full-bleed, outside the max-w-6xl container.
          The label lives inside this pinned wrapper (not the
          container above) so that while the section is pinned and
          the track is scrubbed horizontally, the label itself never
          moves — GSAP only ever transforms `track`, so anything else
          inside the pin just stays put at the top, matching the
          reference.

          `md:h-screen md:flex md:flex-col md:justify-center`: GSAP's
          pin fixes this whole box in place for the scroll duration,
          so if its natural content height ever exceeds the viewport,
          the overflow is simply unreachable — there's no more page
          scroll left to reveal it. Locking the box to the viewport
          height and centering its contents (label + track) guarantees
          everything, including the bullets and "Learn More" link at
          the bottom of each panel, stays fully on-screen. */}
      <div
        ref={pinRef}
        className="overflow-hidden md:flex md:h-screen md:flex-col md:justify-center"
      >
        {/* Label */}
        <p className="mx-auto max-w-6xl px-6 pt-16 pb-10 text-center font-mono text-xs tracking-[0.14em] text-black-text/70 uppercase sm:pt-20 sm:pb-12 sm:text-sm md:shrink-0 md:pt-0 md:pb-8">
          [ As a full-service marketing agency, our core services include ]
        </p>

        {/* Mobile / tablet: normal vertical stack — plain page scroll,
            no horizontal swiping, matching every other section. */}
        <div className="flex flex-col gap-8 px-6 pb-16 sm:gap-8 sm:px-8 sm:pb-20 md:hidden">
          {SERVICES.map((service, i) => (
            <ServicePanel
              key={service.title}
              service={service}
              priority={i === 0}
            />
          ))}
        </div>

        {/* Desktop: pinned, GSAP-scrubbed horizontal track */}
        <div ref={trackRef} className="hidden shrink-0 md:flex">
          {SERVICES.map((service, i) => (
            <ServicePanel
              key={service.title}
              service={service}
              className="w-1/2 shrink-0"
              priority={i < 2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
