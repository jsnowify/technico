// Services.tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";

import ReactiveGrid from "../../components/effects/ReactiveGrid";
import ScrambleReveal from "../../components/motion/Scramblereveal";
import ScrollRevealWords from "../../components/motion/ScrollRevealWords";
import { Blink, StatusDot } from "../../components/motion/Blink";

/**
 * "06 / Services" — see original header comment block for the full
 * design rationale (unchanged). This revision only touches the pin's
 * ScrollTrigger config and adds a post-mount refresh safety net —
 * nothing about the panel markup, geometry, or mobile stack changed.
 *
 * SMOOTHNESS FIX (earlier pass):
 *  - Removed `fastScrollEnd: true`. That flag makes ScrollTrigger
 *    snap/catch-up to the target progress on fast scrolls instead of
 *    tracking it continuously — which directly undoes the "one
 *    direct 1:1 transform" design this file is built around.
 *  - `scrub` is `true`, not a numeric delay. This project drives
 *    scroll through Lenis (see components/layout/SmoothScroll.tsx),
 *    which already applies its own inertial easing to raw wheel
 *    input before ScrollTrigger ever sees a scroll position. A
 *    numeric scrub value here would stack a SECOND, independent
 *    smoothing pass on top of Lenis's — two inertia systems settling
 *    at different rates. `scrub: true` means ScrollTrigger adds zero
 *    smoothing of its own and just mirrors Lenis's (already eased)
 *    position exactly, once.
 *  - A one-time `ScrollTrigger.refresh()` after mount (next frame)
 *    also fires SmoothScroll.tsx's `lenis.resize()` listener — see
 *    that file. If a web font swaps or an image above this section
 *    (Approach/Diagnostics) finishes loading after first measurement,
 *    this re-measures the pin AND resyncs Lenis's scroll limit
 *    against the pin-spacer height, instead of leaving either one
 *    silently stale.
 *
 * TIMING + FADE FIX (this pass): the reference has no opacity/scale
 * ramp at all going into or out of the pin — it's a hard, immediate
 * cut, confirmed frame-by-frame against services_inspo.mp4. The
 * in/out fade-scale-settle here has been removed entirely. What the
 * reference DOES have that this file was missing is dwell time: each
 * card holds on screen for a real beat of scrolling before the next
 * one slides in. That wasn't a fade problem, it was a distance
 * problem — the pin's scroll length was pixel-matched 1:1 to the
 * track's travel distance, so the whole six-card sequence consumed
 * barely any scroll input. `RUNWAY_MULTIPLIER` below stretches the
 * scroll distance the pin consumes without touching how far the track
 * itself travels, which is what gives the sequence an actual pace.
 */

type Service = {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  listLabel: string;
  items: readonly string[];
};

const SERVICES: readonly Service[] = [
  {
    index: "01",
    title: "SEO",
    subtitle: "Search Engine Optimization",
    description:
      "Let’s get your business found online. Our SEO work improves your search visibility through data, structure, and creative content. Every strategy we build aims to drive organic traffic, attract qualified leads, and improve long-term rankings.",
    listLabel: "Our SEO process includes",
    items: [
      "Keyword research and competitor analysis",
      "On-page and technical SEO optimization",
      "Link building and authority growth",
      "Content planning based on user intent",
    ],
  },
  {
    index: "02",
    title: "Website Development & Design",
    subtitle: "",
    description:
      "Make your website fast, functional, and easy to use. Every project starts with a plan that matches your brand and supports your digital goals. Each page loads quickly, guides users naturally, and helps convert visitors into customers.",
    listLabel: "With our web services, expect",
    items: [
      "Custom website design and layout",
      "Mobile and SEO-friendly development",
      "UI/UX design focused on smooth navigation",
      "Security setup and performance testing",
    ],
  },
  {
    index: "03",
    title: "Creative Design & Content Services",
    subtitle: "",
    description:
      "We combine visual creativity with strategic content planning. Every piece we create solidifies your brand and connects with your target market. From ad visuals to website copy, we keep your tone consistent and your message clear.",
    listLabel: "Our creative digital marketing services cover",
    items: [
      "Graphic design and marketing visuals",
      "Branding, digital signage, & logo development",
      "Copywriting and blog content creation",
      "Integrated campaign visuals & promotional assets",
    ],
  },
  {
    index: "04",
    title: "Media Buying & Digital Advertising",
    subtitle: "",
    description:
      "We plan, manage, and optimize campaigns that bring impressive results. Our team uses data-backed strategies to make every ad dollar count. From keyword targeting to audience segmentation, each decision is made with performance in mind.",
    listLabel: "Our focus areas include",
    items: [
      "SEM (Search Engine Marketing)",
      "PPC (Pay-Per-Click) Marketing",
      "Social Media Marketing",
    ],
  },
  {
    index: "05",
    title: "Social Media Management",
    subtitle: "",
    description:
      "We create, manage, and maintain a consistent brand identity across all your social platforms. Each post, story, and caption is based on a clear content plan that supports your business goals. Every piece of content adds value and strengthens your social media presence.",
    listLabel: "Our approach covers",
    items: [
      "Content scheduling and publishing",
      "Audience engagement and review response",
      "Trend-based updates to keep your feed relevant",
      "Performance tracking with monthly insights",
    ],
  },
  {
    index: "06",
    title: "Email Marketing",
    subtitle: "",
    description:
      "Connect directly with your target audience through our strategic email campaigns. From welcome emails to follow-up messages, our team creates every campaign to get responses. We keep messages concise, relevant, and consistent so your brand stays top of mind.",
    listLabel: "For consistent results, our digital marketing services include",
    items: [
      "List management & audience segmentation",
      "A/B testing to improve open & click rates",
      "Content planning & personalized email templates",
      "Reporting that shows campaign outcomes",
    ],
  },
];

/* ============================================================
   DECORATIVE GEOMETRY — unchanged from original.
   ============================================================ */
function PanelGeometry({
  flipped,
  fillRef,
  compact = false,
}: {
  flipped: boolean;
  fillRef?: (el: SVGCircleElement | null) => void;
  compact?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 300"
      className={`pointer-events-none absolute ${
        compact
          ? "h-[150px] w-[150px] xl:h-[190px] xl:w-[190px]"
          : "h-[220px] w-[220px] xl:h-[280px] xl:w-[280px]"
      } ${
        flipped
          ? compact
            ? "-bottom-10 -left-10 rotate-180"
            : "-bottom-16 -left-16 rotate-180"
          : compact
            ? "-right-10 -top-10"
            : "-right-16 -top-16"
      }`}
    >
      <circle
        cx="150"
        cy="150"
        r="120"
        fill="none"
        stroke="black"
        strokeOpacity="0.14"
        strokeWidth="1"
        strokeDasharray="1 7"
      />
      <circle
        cx="150"
        cy="150"
        r="90"
        fill="none"
        stroke="black"
        strokeOpacity="0.09"
        strokeWidth="1"
        strokeDasharray="1 7"
      />
      <circle
        ref={fillRef}
        cx="150"
        cy="150"
        r="120"
        fill="none"
        stroke="var(--color-accent)"
        strokeOpacity="0.55"
        strokeWidth="1.5"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="1"
        transform="rotate(-90 150 150)"
      />
      <circle
        cx="270"
        cy="150"
        r="3"
        fill="var(--color-accent)"
        opacity="0.7"
      />
    </svg>
  );
}

/* ============================================================
   SERVICE PANEL — unchanged from original.
   ============================================================ */
function ServicePanel({
  service,
  showGeometry,
  arcFillRef,
  numberRef,
}: {
  service: Service;
  showGeometry: boolean;
  arcFillRef?: (el: SVGCircleElement | null) => void;
  numberRef?: (el: HTMLDivElement | null) => void;
}) {
  const flipped = Number(service.index) % 2 === 0;

  return (
    <div className="relative mx-auto w-full max-w-6xl px-6 sm:px-10 lg:px-0">
      {showGeometry && <PanelGeometry flipped={flipped} fillRef={arcFillRef} />}

      <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-14">
        <div className="relative lg:col-span-6">
          <div
            ref={numberRef}
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 right-0 hidden select-none font-mono text-[9rem] font-black leading-none text-black/[0.05] will-change-transform md:block lg:-left-2 lg:right-auto lg:text-[11rem] xl:text-[13rem]"
          >
            {service.index}
          </div>

          <div className="relative z-10">
            <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-black/45">
              <span className="text-[var(--color-accent)]">{`S${service.index}`}</span>
              <span className="hidden text-black/30 sm:inline">{`§ 06.${service.index}`}</span>
              <span className="ml-auto hidden items-center gap-1.5 text-black/40 sm:inline-flex">
                <StatusDot />
                Active
              </span>
            </div>

            <h3 className="text-2xl font-semibold uppercase leading-[1.05] tracking-[-0.02em] text-black sm:text-3xl lg:text-[2.5rem]">
              {service.title}
            </h3>
            {service.subtitle && (
              <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-black/45">
                {service.subtitle}
              </div>
            )}

            <p className="mt-6 max-w-md text-sm leading-relaxed text-black/65 lg:text-[15px]">
              {service.description}
            </p>
          </div>
        </div>

        <div className="relative border-t border-black/10 pt-8 lg:col-span-6 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
          <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.14em] text-black/35">
            {service.listLabel}
          </div>
          <ul>
            {service.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 border-t border-black/10 py-3 text-sm text-black/75 first:border-t-0 lg:text-[15px]"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SERVICE PEEK PANEL — desktop pinned-track card only.
   Recreates the reference "blink" horizontal-scroll layout: a
   narrower card (not full-viewport) so the next/previous panel
   peeks in at the edges as the track slides, a big number+label
   stat block, and the title/description block, with the two
   swapping top/bottom position by parity (same `flipped` idea
   PanelGeometry already used). All six services' real copy is
   kept — the item list is compressed into a tag row instead of a
   bulleted column so it fits the narrower card the way the
   reference's short caption lines do. The rich two-column
   ServicePanel above is untouched and still powers the mobile /
   reduced-motion stacked fallback.
   ============================================================ */
function ServicePeekPanel({
  service,
  arcFillRef,
  numberRef,
}: {
  service: Service;
  arcFillRef?: (el: SVGCircleElement | null) => void;
  numberRef?: (el: HTMLDivElement | null) => void;
}) {
  const flipped = Number(service.index) % 2 === 0;
  const itemCount = service.items.length;

  const header = (
    <div className="relative z-10">
      <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-black/45">
        <span className="text-[var(--color-accent)]">{`S${service.index}`}</span>
        <span className="hidden text-black/30 sm:inline">{`§ 06.${service.index}`}</span>
        <span className="ml-auto hidden items-center gap-1.5 text-black/40 sm:inline-flex">
          <StatusDot />
          Active
        </span>
      </div>

      <h3 className="max-w-md text-[1.6rem] font-semibold uppercase leading-[1.08] tracking-[-0.02em] text-black xl:text-[2rem]">
        {service.title}
      </h3>
      {service.subtitle && (
        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-black/45">
          {service.subtitle}
        </div>
      )}

      <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-black/60 xl:text-sm">
        {service.description}
      </p>

      <div className="mt-6 flex max-w-sm flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9.5px] uppercase tracking-[0.13em] text-black/40">
        {service.items.map((item) => (
          <span key={item} className="flex items-center gap-1.5">
            <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );

  const stat = (
    <div className="relative z-10">
      <div
        ref={numberRef}
        className="flex items-baseline gap-3 will-change-transform"
      >
        <span className="font-mono text-[3.5rem] font-black leading-none tracking-[-0.03em] text-black xl:text-[4.5rem]">
          {String(itemCount).padStart(2, "0")}
        </span>
        <span className="font-mono text-sm uppercase tracking-[0.15em] text-black/40">
          {itemCount === 1 ? "Focus Area" : "Focus Areas"}
        </span>
      </div>
      <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-black/35">
        {service.listLabel}
      </div>
    </div>
  );

  return (
    <div className="relative flex h-full w-full flex-col justify-between py-6">
      <PanelGeometry flipped={flipped} fillRef={arcFillRef} compact />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute select-none font-mono text-[6rem] font-black leading-none text-black/[0.045] xl:text-[7.5rem] ${
          flipped ? "-bottom-2 -left-1" : "-top-2 -right-1"
        }`}
      >
        {service.index}
      </div>
      {flipped ? stat : header}
      {flipped ? header : stat}
    </div>
  );
}

/* ============================================================
   SERVICES SECTION
   ============================================================ */
export default function Services() {
  const rootRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<Array<HTMLDivElement | null>>([]);
  const arcRefs = useRef<Array<SVGCircleElement | null>>([]);
  const tickerRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const stackedRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const items = Array.from(
        root.querySelectorAll<HTMLElement>("[data-io-reveal]"),
      );

      if (prefersReducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        if (topLineRef.current) gsap.set(topLineRef.current, { scaleX: 1 });
        return;
      }

      if (items.length) {
        gsap.set(items, { autoAlpha: 0, y: 40 });
        items.forEach((el) => {
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          });
        });
      }

      const line = topLineRef.current;
      if (line) {
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(line, {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: line,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });
      }

      const watermark = watermarkRef.current;
      if (watermark) {
        gsap.fromTo(
          watermark,
          { xPercent: 6, opacity: 0.5 },
          {
            xPercent: -2,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: watermark,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.3,
            },
          },
        );
      }

      return () => {
        ScrollTrigger.getAll()
          .filter((st) => items.includes(st.trigger as HTMLElement))
          .forEach((st) => st.kill());
      };
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const mm = gsap.matchMedia();
      const panelCount = SERVICES.length;

      mm.add("(min-width: 1024px)", () => {
        const canvas = canvasRef.current;
        const track = trackRef.current;
        if (!canvas || !track) return;

        const maxIndex = panelCount - 1;

        const setTrackX = gsap.quickSetter(track, "x", "px");

        // TIMING FIX: the pin's scroll distance used to be exactly
        // `scrollLength` — the track's real pixel overflow — so one
        // wheel tick moved the track (roughly) one pixel and the
        // whole six-card sequence blew past in a couple of scrolls
        // with no perceptible pace. The reference has real dwell time
        // on each card. RUNWAY_MULTIPLIER stretches how much scroll
        // input the pin consumes WITHOUT changing how far the track
        // travels (`scrollLength`/the x math below are untouched) —
        // it just spreads that same travel over more scroll, which is
        // what actually reads as "timing" per card.
        const RUNWAY_MULTIPLIER = 1.6;

        // PEEK-CARD MATH: panels are no longer 100% of the canvas
        // width (that's what made xPercent-per-panel work before —
        // the track's own box width equalled each child's width, so
        // "xPercent -100" landed exactly one panel over). Panels are
        // now a fraction of the viewport so neighbours peek in at the
        // edges, so the track's rendered width no longer matches a
        // clean percentage step. Drive the transform in pixels
        // instead: scrollLength is how far the track has to travel
        // (its full scrollWidth minus the visible canvas width) so
        // progress 0 shows the first card flush left and progress 1
        // shows the last card flush right, same start/end guarantee
        // xPercent gave before, just measured instead of assumed.
        //
        // NOTE: this ONLY replaces the translateX math. The "which
        // card is active" figure below (`continuous`) deliberately
        // stays a plain `progress * maxIndex` — i.e. still keyed off
        // scroll progress, not off card pixel width or viewport
        // center. An earlier pass derived it from viewport-center
        // pixel position instead, which broke the moment cards
        // stopped being full-viewport width: with ~2 cards visible at
        // once, "viewport center" doesn't land on card 0 at scroll
        // start, so the section opened already reading "02 / 06" with
        // the second dot lit before any scrolling happened. Progress-
        // based indexing guarantees active=0 at progress 0 and
        // active=maxIndex at progress 1, no matter how wide the
        // peeking cards render at any breakpoint.
        let scrollLength = 0;
        const measure = () => {
          scrollLength = Math.max(0, track.scrollWidth - canvas.offsetWidth);
          return scrollLength;
        };
        measure();

        const setNumberY: Array<((v: number) => void) | undefined> = [];
        const setNumberScale: Array<((v: number) => void) | undefined> = [];
        for (let i = 0; i < panelCount; i++) {
          const el = numberRefs.current[i];
          if (!el) continue;
          setNumberY[i] = gsap.quickSetter(el, "yPercent") as (
            v: number,
          ) => void;
          setNumberScale[i] = gsap.quickSetter(el, "scale") as (
            v: number,
          ) => void;
        }

        const lastArcFill = new Array<number>(panelCount).fill(-1);
        let lastActive = -1;

        const render = (progress: number) => {
          const x = -progress * scrollLength;
          setTrackX(x);

          // Deliberately NOT derived from card pixel width or
          // viewport-center position — see the note above `measure`.
          // Plain progress-based indexing keeps this exact at the
          // pin's start/end regardless of card width.
          const continuous = progress * maxIndex;

          for (let i = 0; i < panelCount; i++) {
            const delta = i - continuous;
            const absDelta = delta < 0 ? -delta : delta;

            const setY = setNumberY[i];
            const setScale = setNumberScale[i];
            if (setY && setScale) {
              const yRaw = delta * 10;
              setY(yRaw < -12 ? -12 : yRaw > 12 ? 12 : yRaw);
              setScale(1 - (absDelta > 1 ? 1 : absDelta) * 0.06);
            }

            const arc = arcRefs.current[i];
            if (arc) {
              const fill = (absDelta > 1 ? 0 : 1 - absDelta) * 0.86;
              if (Math.abs(fill - lastArcFill[i]) > 0.001) {
                arc.style.strokeDashoffset = String(1 - fill);
                lastArcFill[i] = fill;
              }
            }
          }

          const active = Math.min(maxIndex, Math.round(continuous));

          if (active !== lastActive) {
            lastActive = active;

            if (tickerRef.current) {
              tickerRef.current.textContent = `0${active + 1} / 0${panelCount}`;
            }

            for (let i = 0; i < panelCount; i++) {
              const dot = dotRefs.current[i];
              if (!dot) continue;
              dot.style.backgroundColor =
                i === active ? "var(--color-accent)" : "";
              dot.style.transform = i === active ? "scale(1.6)" : "scale(1)";
            }
          }

          if (progressRef.current) {
            progressRef.current.style.transform = `scaleX(${progress})`;
          }
        };

        render(0);

        const st = ScrollTrigger.create({
          trigger: canvas,
          start: "top top",
          end: () => "+=" + measure() * RUNWAY_MULTIPLIER,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => render(self.progress),
          onRefresh: (self) => {
            measure();
            render(self.progress);
          },
        });

        // One-time settle: if content above this section reflows
        // after first measurement (late web font swap, an image in
        // Approach/Diagnostics finishing load), this re-measures the
        // pin's start position once, on the next frame, instead of
        // leaving it silently off.
        const refreshHandle = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });

        return () => {
          cancelAnimationFrame(refreshHandle);
          st.kill();
        };
      });

      mm.add("(max-width: 1023px)", () => {
        const entries = stackedRefs.current;
        const triggers: ScrollTrigger[] = [];

        entries.forEach((el) => {
          if (!el) return;

          gsap.set(el, {
            clipPath: "inset(24% 0% 24% 0%)",
            opacity: 0,
            scale: 0.98,
            transformOrigin: "center",
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });
          triggers.push(tl.scrollTrigger as ScrollTrigger);

          tl.to(el, {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
          });
        });

        return () => {
          triggers.forEach((t) => t.kill());
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-white py-24 text-black md:py-32 lg:py-40"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ReactiveGrid className="z-0 text-black" opacity={0.06} shipCount={1} />

        <div
          aria-hidden="true"
          ref={watermarkRef}
          className="absolute -right-[6vw] top-[4%] select-none text-[38vw] font-black leading-none tracking-[-0.05em] text-black/[0.035] md:top-[6%] md:text-[30vw]"
        >
          06
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-8 left-6 hidden select-none font-mono text-[8px] uppercase tracking-[0.15em] text-black/20 md:block lg:left-10"
        >
          Grid 06 / A—B
        </div>
      </div>

      <div className="relative z-10">
        {/*
           Header + intro copy get the section's normal side padding.
           The pinned horizontal track below is deliberately rendered
           OUTSIDE this padded wrapper (see the comment on canvasRef)
           so it spans the full viewport width on desktop instead of
           inheriting this padding.
        */}
        <div className="px-6 md:px-10 lg:px-12 xl:px-14">
          <div className="border-t border-black/15 pt-4">
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-black/55 lg:text-[10px]">
              <Blink as="span" className="text-[#6D28D9]">
                <ScrambleReveal as="span" variant="micro" start="top 95%">
                  Service Directory
                </ScrambleReveal>
              </Blink>
              <span className="hidden items-center gap-1.5 text-black/40 md:inline-flex">
                <StatusDot />
                <ScrambleReveal as="span" variant="micro" start="top 95%">
                  Sequence Active
                </ScrambleReveal>
              </span>
              <ScrambleReveal as="span" variant="micro" start="top 95%">
                06 / Services
              </ScrambleReveal>
            </div>

            <div
              ref={topLineRef}
              aria-hidden="true"
              className="mt-4 h-px w-full bg-[var(--color-accent)]/40"
            />
          </div>

          <div className="mt-14 lg:mt-20">
            <div
              data-io-reveal
              className="mb-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-black/40 lg:mb-7"
            >
              <span className="h-px w-8 bg-[var(--color-accent)]" />
              <ScrambleReveal as="span" variant="micro">
                Core Services
              </ScrambleReveal>
            </div>

            <h2
              data-io-reveal
              className="max-w-[880px] font-semibold uppercase tracking-[-0.03em] text-black lg:tracking-[-0.04em]"
            >
              <ScrollRevealWords
                as="span"
                className="block text-[2.15rem] leading-[1.06] sm:text-[2.75rem] lg:text-[3.75rem] lg:leading-[1.01] xl:text-[4.15rem]"
                start="top 85%"
                end="top 40%"
              >
                Accelerate Your Online Growth with Proven Digital Marketing
                Services
              </ScrollRevealWords>
            </h2>

            <p
              data-io-reveal
              className="mt-7 max-w-2xl text-base leading-relaxed text-black/65 lg:mt-8 lg:text-lg"
            >
              Our specialty is to help businesses grow faster online through
              effective digital marketing services. If you’re building
              visibility from scratch or scaling an established brand, our
              strategies are built around measurable outcomes: more traffic,
              stronger leads, and better ROI.
            </p>

            <div
              data-io-reveal
              className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-black/35 lg:mt-8"
            >
              <Blink as="span">
                <StatusDot />
              </Blink>
              <ScrambleReveal as="span" variant="micro">
                As a full-service marketing agency, our core services include:
              </ScrambleReveal>
            </div>
          </div>
        </div>

        <div
          ref={canvasRef}
          className={
            prefersReducedMotion
              ? "hidden"
              : /*
                 * FULL-BLEED FIX: this div is a SIBLING of the
                 * header's padded wrapper (`px-6 md:px-10 lg:px-12
                 * xl:px-14`), not a child of it, so it never inherits
                 * that side padding to begin with — same technique
                 * Feedback.tsx's drag carousel already uses. No
                 * negative-margin values to keep in sync with the
                 * padding elsewhere; it's full width by construction,
                 * at every breakpoint, including ones added later.
                 */
                "relative mt-20 hidden overflow-hidden lg:block"
          }
          style={{ height: "100vh" }}
          data-cursor="label"
          data-cursor-label="Scroll"
          data-cursor-variant="scroll"
        >
          {/*
             No entry/exit fade — matches the reference, which cuts
             straight into and out of the pin with no opacity/scale
             ramp. This wrapper just groups panels + overlays so the
             track and its UI move as one block; render() no longer
             touches this element's own opacity/scale/y.
          */}
          <div ref={contentRef} className="absolute inset-0">
            <div className="absolute inset-0 flex items-center">
              <div
                ref={trackRef}
                className="flex h-full w-full will-change-transform"
              >
                {SERVICES.map((service, i) => (
                  <div
                    key={service.index}
                    className="flex h-full w-[80vw] shrink-0 items-center border-r border-black/10 px-7 last:border-r-0 sm:w-[64vw] lg:w-[58vw] lg:px-9 xl:w-[46vw] xl:px-11 2xl:w-[40vw]"
                  >
                    <ServicePeekPanel
                      service={service}
                      arcFillRef={(el) => {
                        arcRefs.current[i] = el;
                      }}
                      numberRef={(el) => {
                        numberRefs.current[i] = el;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-28 z-20 flex items-center justify-between px-10 font-mono text-[10px] uppercase tracking-[0.15em] text-black/45 xl:px-16">
              <span ref={tickerRef}>01 / 06</span>
              <span>Service Sequence</span>
            </div>

            <div className="pointer-events-none absolute bottom-10 right-10 z-20 flex items-center gap-2 xl:right-16">
              {SERVICES.map((service, i) => (
                <span
                  key={service.index}
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  className="h-1.5 w-1.5 rounded-full bg-black/15 transition-transform"
                />
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-px bg-black/10">
              <div
                ref={progressRef}
                className="h-full origin-left bg-[var(--color-accent)]"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 lg:px-12 xl:px-14">
          <div
            className={prefersReducedMotion ? "mt-16 block" : "mt-16 lg:hidden"}
          >
            {SERVICES.map((service, i) => (
              <div
                key={service.index}
                ref={(el) => {
                  stackedRefs.current[i] = el;
                }}
                className="border-t border-black/10 py-12 first:border-t-0 sm:py-14"
              >
                <ServicePanel service={service} showGeometry={false} />
              </div>
            ))}
          </div>

          <div className="mt-16 flex items-center justify-between border-t border-black/10 pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-black/35 lg:mt-20 lg:text-[9px]">
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
                06.001
              </ScrambleReveal>
            </Blink>
          </div>
        </div>
      </div>
    </section>
  );
}
