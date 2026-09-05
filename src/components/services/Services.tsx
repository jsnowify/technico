"use client";

import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion, supportsFinePointer } from "@/lib/gsap";
import type { Service } from "@/lib/content/types";

/* ================================================================
   SERVICES
   ================================================================
   Card grid where the active card expands in place — title, a
   divider rule, and that service's deliverable tags all render
   directly inside the card (not in a separate panel), matching the
   provided design reference. A single detail block still sits below
   each row for the longer subtitle/quote/description copy.

   - Each service has its own icon shape (paths below), recolored via
     `currentColor` so it goes white on the active purple card and
     pink/purple on the inactive white cards.
   - Tags are split into two columns via `chunk()`, same pattern
     used elsewhere in this codebase for splitting a flat list into
     side-by-side columns.
   - Assumes services are grouped into rows of 3 for the card grid;
     any count works, the last row just won't be full.
   ================================================================ */

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/* Per-service icons — paths copied from the provided SVGs, with the
   original hardcoded `fill` swapped for `currentColor` on each path
   so the same icon can render pink/purple (inactive) or white
   (active) via the wrapping element's text color, same as before. */

function SeoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 0C0 6.35086 2.52216 12.4416 7.0131 16.9319C11.504 21.4229 17.5948 23.9457 23.9456 23.9457V0H0ZM23.9456 23.9457H47.8918V0C41.5409 0 35.4497 2.52278 30.9587 7.0131C26.4678 11.504 23.9456 17.5942 23.9456 23.9457ZM23.9456 23.9457V47.8911H47.8918C47.8918 41.5404 45.3696 35.4497 40.8786 30.9588C36.3877 26.4684 30.2963 23.9457 23.9456 23.9457ZM23.9456 23.9457H0V47.8911C6.35086 47.8911 12.4422 45.3684 16.9331 40.878C21.4241 36.3871 23.9456 30.2964 23.9456 23.9457Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WebDevIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 0V20.9523H20.953L0 0ZM20.953 20.9523L41.9053 0H20.953V20.9523ZM20.953 20.9523L41.9053 41.9046V20.9523H20.953ZM20.953 20.9523L0 41.9046H20.953V20.9523Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DiamondIcon({ className }: { className?: string }) {
  // Shared by content-services and advertising — identical shape/color
  // in the provided source.
  return (
    <svg
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 0V41.9053C11.5717 41.9053 20.9523 32.5247 20.9523 20.9535C20.9523 9.38226 11.5717 0.00216774 0 0ZM20.9523 0V41.9053C32.524 41.9053 41.9047 32.5247 41.9047 20.9535C41.9047 9.38226 32.524 0.00216774 20.9523 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckerboardIcon({ className }: { className?: string }) {
  // Social media management
  return (
    <svg
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 0V10.4762H10.4756V0H0ZM10.4756 10.4762V20.9523H20.9518V10.4762H10.4756ZM20.9523 0V10.4762H31.4285V0H20.9523ZM31.4285 10.4762V20.9523H41.9048V10.4762H31.4285ZM0 20.9523V31.4285H10.4756V20.9523H0ZM10.4756 31.4285V41.9046H20.9518V31.4285H10.4756ZM20.9523 20.9523V31.4285H31.4285V20.9523H20.9523ZM31.4285 31.4285V41.9046H41.9048V31.4285H31.4285Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BowtieIcon({ className }: { className?: string }) {
  // Email marketing
  return (
    <svg
      viewBox="0 0 42 42"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M0 0V41.9053H41.9048V0L20.9523 20.9535L0 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

const SERVICE_ICON: Record<
  string,
  (props: { className?: string }) => JSX.Element
> = {
  seo: SeoIcon,
  "web-development": WebDevIcon,
  "content-services": DiamondIcon,
  advertising: DiamondIcon,
  "social-media-management": CheckerboardIcon,
  "email-marketing": BowtieIcon,
};

function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

const CARD_ACCENT: Record<string, "pink" | "purple"> = {
  seo: "purple",
  "web-development": "pink",
  "content-services": "purple",
  advertising: "pink",
  "social-media-management": "purple",
  "email-marketing": "pink",
};

// Shared by ServiceCard and ServiceDetail so the detail block below the
// grid always matches whichever card is currently active, instead of
// being hardcoded to one accent color.
function getAccentTextClass(slug: string): string {
  const accent = CARD_ACCENT[slug] ?? "purple";
  return accent === "pink" ? "text-pink-accent" : "text-purple-accent";
}

function ServiceCard({
  service,
  isActive,
  onSelect,
}: {
  service: Service;
  isActive: boolean;
  onSelect: () => void;
}) {
  const accent = CARD_ACCENT[service.slug] ?? "purple";
  const accentText = getAccentTextClass(service.slug);
  const accentBg = accent === "pink" ? "bg-pink-accent" : "bg-purple-accent";
  const accentBorder =
    accent === "pink" ? "border-pink-accent" : "border-purple-accent";
  const badgeFill = accent === "pink" ? "bg-pink-accent" : "bg-purple-accent";

  const tags = service.tags ?? [];
  const tagColumns = chunk(tags, Math.ceil(tags.length / 2) || 1);
  const Icon = SERVICE_ICON[service.slug] ?? SeoIcon;

  // Delays the tags block's appearance until the rising bg (below) is
  // most of the way filled in. Without this, `isActive` flips true
  // the instant a card is clicked, so the white/90 tags text used to
  // mount immediately — right as the bg was still just starting its
  // 0.5s rise from the card's white base, leaving near-white text on
  // a near-white card for a good chunk of that time. Hiding just
  // disables the delay instead (no risk there: it's disappearing,
  // not something that needs to stay visible).
  const [showTags, setShowTags] = useState(false);

  // Render-time state adjustment (not an effect) for the two cases
  // that need to happen synchronously with the `isActive` change
  // itself: hiding immediately when the card goes inactive, and
  // showing immediately under prefersReducedMotion (no rise-in delay
  // to wait for). Tracking `prevIsActive` lets us detect the change
  // during render, per React's "adjusting state when a prop changes"
  // pattern — this avoids calling setState directly in a useEffect
  // body, which triggers an extra render pass for no benefit here.
  const [prevIsActive, setPrevIsActive] = useState(isActive);
  if (isActive !== prevIsActive) {
    setPrevIsActive(isActive);
    if (!isActive) {
      setShowTags(false);
    } else if (prefersReducedMotion) {
      setShowTags(true);
    }
  }

  // Only the delayed (non-reduced-motion, becoming-active) case is
  // left here, since it's driven by a real external timer callback
  // rather than a synchronous state adjustment.
  useEffect(() => {
    if (!isActive || prefersReducedMotion) return;

    const id = setTimeout(() => setShowTags(true), 250);
    return () => clearTimeout(id);
  }, [isActive]);

  // Rising slide bg — fills the card from the bottom up in its own
  // accent color (pink or purple, per CARD_ACCENT) whenever it
  // becomes active, instead of an instant color swap. `bgRef` is a
  // full-cover layer sitting behind the card's content, scaled on
  // the Y axis from a bottom transform-origin: scaleY 0 hides it
  // (collapsed flat against the bottom edge), scaleY 1 covers the
  // whole card. Driven off the `isActive` prop via useGSAP's
  // dependencies array — same pattern as SlidingText.tsx's hover
  // tween — so both the rise-in (becoming active) and the drop-out
  // (another card taking over) animate through this one tween.
  const bgRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const bg = bgRef.current;
      if (!bg) return;

      if (prefersReducedMotion) {
        gsap.set(bg, { scaleY: isActive ? 1 : 0 });
        return;
      }

      gsap.to(bg, {
        scaleY: isActive ? 1 : 0,
        duration: 0.5,
        ease: isActive ? "power3.out" : "power3.in",
        overwrite: true,
      });
    },
    { dependencies: [isActive] },
  );

  // Cursor-following "View Service" pill — same mechanism as the
  // "Trusted by" pill in home/TrustedBy.tsx: a gsap.quickTo
  // trailing-pointer follow plus an enter/leave scale-and-fade,
  // scoped to this one card via cardRef so every card in the grid
  // gets its own independent pill.
  const cardRef = useRef<HTMLButtonElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const movePillXRef = useRef<((value: number) => void) | null>(null);
  const movePillYRef = useRef<((value: number) => void) | null>(null);
  const setPillScaleXRef = useRef<((value: number) => void) | null>(null);
  const setPillScaleYRef = useRef<((value: number) => void) | null>(null);
  const setPillOpacityRef = useRef<((value: number) => void) | null>(null);

  useGSAP(() => {
    const pill = pillRef.current;
    if (!pill || prefersReducedMotion || !supportsFinePointer) return;

    gsap.set(pill, {
      xPercent: -50,
      yPercent: -50,
      scaleX: 0.4,
      scaleY: 0.4,
      opacity: 0,
    });
    pill.style.willChange = "transform";

    movePillXRef.current = gsap.quickTo(pill, "x", {
      duration: 0.5,
      ease: "power3.out",
    });
    movePillYRef.current = gsap.quickTo(pill, "y", {
      duration: 0.5,
      ease: "power3.out",
    });
    setPillScaleXRef.current = gsap.quickTo(pill, "scaleX", {
      duration: 0.55,
      ease: "power3.out",
    });
    setPillScaleYRef.current = gsap.quickTo(pill, "scaleY", {
      duration: 0.55,
      ease: "power3.out",
    });
    setPillOpacityRef.current = gsap.quickTo(pill, "opacity", {
      duration: 0.18,
      ease: "power1.out",
    });

    return () => {
      movePillXRef.current = null;
      movePillYRef.current = null;
      setPillScaleXRef.current = null;
      setPillScaleYRef.current = null;
      setPillOpacityRef.current = null;
      gsap.killTweensOf(pill);
      pill.style.willChange = "auto";
    };
  }, []);

  const setPillScale = (value: number) => {
    setPillScaleXRef.current?.(value);
    setPillScaleYRef.current?.(value);
  };

  // Keeps the pill's center from sliding past the card's edge — same
  // clamp math as TrustedBy.tsx's clampPillPosition.
  const clampPillPosition = (x: number, y: number, cardRect: DOMRect) => {
    const pill = pillRef.current;
    if (!pill) return { x, y };

    const halfWidth = pill.offsetWidth / 2;
    const halfHeight = pill.offsetHeight / 2;

    return {
      x: Math.min(Math.max(x, halfWidth), cardRect.width - halfWidth),
      y: Math.min(Math.max(y, halfHeight), cardRect.height - halfHeight),
    };
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (
      prefersReducedMotion ||
      !supportsFinePointer ||
      event.pointerType !== "mouse" ||
      !cardRef.current ||
      !pillRef.current
    ) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const { x, y } = clampPillPosition(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect,
    );
    gsap.set(pillRef.current, { x, y });
    setPillScale(1);
    setPillOpacityRef.current?.(1);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (
      prefersReducedMotion ||
      !supportsFinePointer ||
      event.pointerType !== "mouse" ||
      !cardRef.current ||
      !movePillXRef.current ||
      !movePillYRef.current
    ) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const { x, y } = clampPillPosition(
      event.clientX - rect.left,
      event.clientY - rect.top,
      rect,
    );
    movePillXRef.current(x);
    movePillYRef.current(y);
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (
      prefersReducedMotion ||
      !supportsFinePointer ||
      event.pointerType !== "mouse"
    ) {
      return;
    }

    setPillScale(0.4);
    setPillOpacityRef.current?.(0);
  };

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-pressed={isActive}
      aria-label={`Show details for ${service.title}`}
      className={`group relative flex min-h-96 flex-col rounded-[30px] border p-6 text-left transition-colors duration-500 sm:min-h-112 sm:p-8 ${
        isActive
          ? `${accentBorder} text-white`
          : "border-black-text/10 bg-white hover:border-black-text/25"
      }`}
    >
      {/* Rising slide bg — see doc comment above. z-0 (implicit, no
          z-index set) so it sits behind every other child purely by
          DOM order; aria-hidden since it's decorative. */}
      <span
        ref={bgRef}
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom rounded-[30px] ${accentBg}`}
        style={{ transform: "scaleY(0)" }}
      />

      <Icon
        className={`service-icon absolute top-6 right-6 h-6 w-6 transition-colors duration-500 sm:top-8 sm:right-8 sm:h-7 sm:w-7 ${
          isActive ? "text-white" : accentText
        }`}
      />

      <span
        className={`relative z-10 max-w-[75%] text-2xl leading-[1.1] font-semibold tracking-tight transition-colors duration-500 sm:text-[28px] ${
          isActive ? "text-white" : accentText
        }`}
      >
        {service.title}
      </span>

      {showTags && tags.length > 0 && (
        <>
          <span className="relative z-10 mt-6 h-px w-full bg-white/30 sm:mt-7" />
          <div className="relative z-10 mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:mt-7">
            {tagColumns.map((column, i) => (
              <div key={i} className="space-y-3">
                {column.map((tag) => (
                  <p key={tag} className="text-sm text-white/90 sm:text-base">
                    {tag}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      <span
        aria-hidden="true"
        className={`absolute right-6 bottom-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-md transition-[transform,background-color,color] duration-500 group-hover:rotate-45 sm:right-8 sm:bottom-8 sm:h-12 sm:w-12 ${
          isActive ? `bg-white ${accentText}` : `${badgeFill} text-white`
        }`}
      >
        <ArrowGlyph className="h-4 w-4 sm:h-5 sm:w-5" />
      </span>

      {/* Cursor-following "View Service" pill — see doc comment above.
          pointer-events-none so it never steals the hover/move events
          it depends on off the card itself. Always solid dark bg +
          white text (not accent-colored) — a light pill with accent
          text was low-contrast and hard to read against the light
          card body, especially at this small mono/tracked size. Dark
          bg + white text stays legible no matter which accent color
          or bg state the card is in. */}
      <span
        ref={pillRef}
        className="pointer-events-none absolute top-0 left-0 z-10 rounded-[3px] bg-black-text px-4 py-2 font-mono text-xs font-semibold tracking-[0.14em] whitespace-nowrap text-white uppercase opacity-0"
      >
        View Service
      </span>
    </button>
  );
}

function ServiceDetail({ service }: { service: Service }) {
  const paragraphs = chunk(
    service.description,
    Math.ceil(service.description.length / 2) || 1,
  );

  // Matches whichever card is active — pink or purple — instead of
  // always defaulting to purple, so the heading/quote color underneath
  // always reflects the selected card's own accent.
  const accentText = getAccentTextClass(service.slug);

  // Text-in motion for every content swap — the parent keys this whole
  // component by `activeService.slug` (see Services below), so it fully
  // unmounts/remounts each time a different card is selected. That
  // makes a plain mount-time GSAP `from()` here double as the "content
  // changed" transition: heading, quote, and each paragraph column
  // fade + rise into place with a slight stagger instead of just
  // popping straight in. `:scope >` keeps the selector to this
  // component's own direct children/columns only, so nothing from a
  // sibling ServiceDetail (a different row) is ever caught by it.
  // Skipped entirely for prefersReducedMotion, same convention as
  // every other animation in this file.
  const detailRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion || !detailRef.current) return;

      const targets = detailRef.current.querySelectorAll(
        ":scope > h3, :scope > p, :scope > div > div",
      );

      gsap.from(targets, {
        y: 16,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.06,
      });
    },
    { scope: detailRef },
  );

  return (
    <div ref={detailRef} className="mt-10 sm:mt-12">
      <h3
        className={`text-2xl font-bold tracking-tight sm:text-3xl ${accentText}`}
      >
        {service.subtitle ?? service.title}
      </h3>

      {service.quote && (
        <p className={`mt-2 font-medium italic ${accentText}`}>
          &ldquo;{service.quote}&rdquo;
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10">
        {paragraphs.map((group, i) => (
          <div key={i} className="space-y-4">
            {group.map((paragraph, j) => (
              <p
                key={j}
                className="text-sm leading-relaxed text-black-text/70 sm:text-base"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Services({ services }: { services: Service[] }) {
  const [activeSlug, setActiveSlug] = useState<string>(services[0]?.slug ?? "");
  const sectionRef = useRef<HTMLElement>(null);
  const rows = chunk(services, 3);
  const activeService = services.find((s) => s.slug === activeSlug);
  const activeRowIndex = rows.findIndex((row) =>
    row.some((s) => s.slug === activeSlug),
  );

  // Idle spin on every card icon — small, continuous, independent of
  // which card is active. A single staggered tween targeting the
  // whole `.service-icon` list (rather than one gsap.to() per icon)
  // means one tween instance for GSAP's ticker to manage, and
  // `force3D: true` keeps it on the GPU compositor. Paused whenever
  // the tab isn't visible so it doesn't burn CPU/battery in the
  // background. Skipped entirely for prefersReducedMotion, same as
  // home/Services.tsx's icon float.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const icons = gsap.utils.toArray<HTMLElement>(".service-icon");
      const spinTween = gsap.to(icons, {
        rotation: 360,
        duration: 10,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
        force3D: true,
        stagger: { each: 0.15, from: "start" },
      });

      const handleVisibilityChange = () => {
        if (document.hidden) {
          spinTween.pause();
        } else {
          spinTween.play();
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white-bg px-5 py-20 sm:py-24 md:py-28"
    >
      <div className="w-full">
        <h2 className="text-[32px] leading-[1.05] tracking-tight font-medium text-purple-accent sm:text-[52px] sm:leading-[1.02] sm:tracking-[-0.01em] md:text-[72px] md:leading-[0.98] md:tracking-[-0.02em]">
          Turn More Online Attention Into Leads and Sales Use the right mix of
          digital services to build awareness, generate demand, &amp; support
          long-term growth.
        </h2>

        <div className="mt-10 space-y-8 sm:mt-14 sm:space-y-10">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
                {row.map((service) => (
                  <ServiceCard
                    key={service.slug}
                    service={service}
                    isActive={service.slug === activeSlug}
                    onSelect={() => setActiveSlug(service.slug)}
                  />
                ))}
              </div>

              {rowIndex === activeRowIndex && activeService && (
                <ServiceDetail
                  key={activeService.slug}
                  service={activeService}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
