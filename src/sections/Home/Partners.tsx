// Partners.tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../../lib/gsap";
import { Flip } from "gsap/Flip";

import Button from "../../components/ui/Button";
import TiltCard from "../../components/ui/TiltCard";
import ReactiveGrid from "../../components/effects/ReactiveGrid";
import ScrambleReveal from "../../components/motion/Scramblereveal";
import ScrollRevealWords from "../../components/motion/ScrollRevealWords";
import { Blink, StatusDot } from "../../components/motion/Blink";

import logo01 from "../../assets/partners/1.png";
import logo02 from "../../assets/partners/2.png";
import logo03 from "../../assets/partners/3.png";
import logo04 from "../../assets/partners/4.png";
import logo05 from "../../assets/partners/5.png";
import logo06 from "../../assets/partners/6.png";
import logo07 from "../../assets/partners/7.png";
import logo08 from "../../assets/partners/8.png";
import logo09 from "../../assets/partners/9.png";
import logo10 from "../../assets/partners/10.png";
import logo11 from "../../assets/partners/11.png";
import logo12 from "../../assets/partners/12.png";
import logo13 from "../../assets/partners/13.png";

// Registered locally rather than in lib/gsap.ts, since this is the
// only section that needs it — gsap.registerPlugin is idempotent, so
// this is safe even if it later gets centralized there too.
gsap.registerPlugin(Flip);

/**
 * "07 / Partners" — see original header comment for full design
 * rationale (unchanged). This revision adds two things:
 *
 * 1) SMOOTH GRID REFLOW (Flip): the tilt-enabled grid goes
 *    sm:grid-cols-3 → lg:grid-cols-4. Tailwind's responsive classes
 *    reflow that instantly on resize with no transition, so cards
 *    visibly "jump" to their new slot. A ResizeObserver on the cards
 *    now caches their rects every time the grid's box changes, and
 *    Flip.from() animates from the previously-cached rects to
 *    wherever the browser just placed them — the classic "First/
 *    Last" FLIP pattern applied reactively to a CSS-driven reflow,
 *    rather than trying to intercept the exact resize instant (which
 *    isn't reliably catchable). First observer firing is a no-op
 *    (nothing has moved yet).
 *
 * 2) MOBILE FALLBACK: TiltCard's pointer-tilt + glare is a
 *    hover/pointer-move effect — meaningless on touch, and the
 *    perspective transform it applies is a common source of blurry
 *    text on lower-end mobile browsers. Below `sm` (real phones),
 *    PartnerCardStatic renders the same content as a plain card with
 *    no perspective, no pointer tracking, no Flip observer — same
 *    convention Services.tsx already uses for its own mobile branch
 *    (two full renders, gated by Tailwind breakpoint classes, only
 *    one ever visible at a time).
 */

type Partner = {
  index: string;
  name: string;
  category: string;
  logo: string;
};

const PARTNERS: readonly Partner[] = [
  {
    index: "01",
    name: "Victoria Steel Stud",
    category: "Steel Framing",
    logo: logo01,
  },
  {
    index: "02",
    name: "Maple Ridge Fence & Deck",
    category: "Fencing & Decking",
    logo: logo02,
  },
  {
    index: "03",
    name: "Fade O'Clock Barbershop",
    category: "Grooming & Style",
    logo: logo03,
  },
  {
    index: "04",
    name: "Coquitlam Solar Energy",
    category: "Solar Energy",
    logo: logo04,
  },
  {
    index: "05",
    name: "Auto Flow Car Rental",
    category: "Car Rental",
    logo: logo05,
  },
  {
    index: "06",
    name: "Auto Flow Car Wash",
    category: "Car Wash & Detailing",
    logo: logo06,
  },
  {
    index: "07",
    name: "Abbotsford Solar Installation",
    category: "Solar Energy",
    logo: logo07,
  },
  {
    index: "08",
    name: "NG Sidhu Law",
    category: "Legal Services",
    logo: logo08,
  },
  { index: "09", name: "Mag Solar", category: "Solar Energy", logo: logo09 },
  {
    index: "10",
    name: "Sidhu Lawyers",
    category: "Legal Services",
    logo: logo10,
  },
  {
    index: "11",
    name: "Victoria Deck and Fence",
    category: "Fencing & Decking",
    logo: logo11,
  },
  {
    index: "12",
    name: "Westgate Dental Centre",
    category: "Dental Care",
    logo: logo12,
  },
  {
    index: "13",
    name: "Vancouver Steel Stud Framing",
    category: "Steel Framing",
    logo: logo13,
  },
] as const;

/* ============================================================
   PARTNER CARD — tilt-enabled, sm+ only.
   ============================================================ */
function PartnerCard({
  partner,
  cardRef,
}: {
  partner: Partner;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={cardRef} className="will-change-transform">
      <TiltCard className="group relative block h-full border border-white/10 bg-white/[0.02] transition-colors duration-300 hover:border-[var(--color-accent)]/40">
        <div className="flex h-full flex-col">
          <div className="relative aspect-[4/3] overflow-hidden bg-white p-6 sm:p-7">
            <img
              src={partner.logo}
              alt={partner.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />

            <span className="pointer-events-none absolute left-2 top-2 font-mono text-[8px] uppercase tracking-[0.15em] text-black/25">
              {`P${partner.index}`}
            </span>
          </div>

          <div className="flex flex-1 items-center justify-between gap-2 border-t border-white/10 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-white/75">
                {partner.name}
              </div>
              <div className="truncate font-mono text-[8px] uppercase tracking-[0.15em] text-white/30">
                {partner.category}
              </div>
            </div>
            <StatusDot />
          </div>
        </div>
      </TiltCard>
    </div>
  );
}

/* ============================================================
   PARTNER CARD (STATIC) — mobile fallback, no tilt/perspective.
   ============================================================ */
function PartnerCardStatic({ partner }: { partner: Partner }) {
  return (
    <div className="relative block h-full border border-white/10 bg-white/[0.02] active:border-[var(--color-accent)]/40">
      <div className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-white p-6">
          <img
            src={partner.logo}
            alt={partner.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
          />
          <span className="pointer-events-none absolute left-2 top-2 font-mono text-[8px] uppercase tracking-[0.15em] text-black/25">
            {`P${partner.index}`}
          </span>
        </div>

        <div className="flex flex-1 items-center justify-between gap-2 border-t border-white/10 px-4 py-3">
          <div className="min-w-0">
            <div className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-white/75">
              {partner.name}
            </div>
            <div className="truncate font-mono text-[8px] uppercase tracking-[0.15em] text-white/30">
              {partner.category}
            </div>
          </div>
          <StatusDot />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PARTNERS SECTION
   ============================================================ */
export default function Partners() {
  const rootRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const mobileGridRef = useRef<HTMLDivElement>(null);
  const mobileCardRefs = useRef<Array<HTMLDivElement | null>>([]);

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

  /* ============================================================
     LOGO GRID (sm+, tilt-enabled) — entrance stagger.
     ============================================================ */
  useGSAP(
    () => {
      const grid = gridRef.current;
      const cards = cardRefs.current.filter(
        (el): el is HTMLDivElement => el !== null,
      );
      if (!grid || !cards.length) return;

      if (prefersReducedMotion) {
        gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(cards, { autoAlpha: 0, y: 28, scale: 0.94 });

      const tween = gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: { each: 0.05, from: "start" },
        scrollTrigger: {
          trigger: grid,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
      };
    },
    { scope: rootRef },
  );

  /* ============================================================
     LOGO GRID (sm+) — smooth column-count reflow via Flip.
     Runs independently of the entrance tween above; skipped
     entirely under reduced motion, same as everything else here.
     ============================================================ */
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const cards = cardRefs.current.filter(
        (el): el is HTMLDivElement => el !== null,
      );
      if (cards.length < 2) return;

      let prevState = Flip.getState(cards);
      let isFirstEntry = true;

      const ro = new ResizeObserver(() => {
        // First firing just establishes a baseline — nothing has
        // actually reflowed yet at mount time.
        if (isFirstEntry) {
          isFirstEntry = false;
          prevState = Flip.getState(cards);
          return;
        }

        Flip.from(prevState, {
          duration: 0.6,
          ease: "power2.inOut",
          stagger: 0.02,
        });
        prevState = Flip.getState(cards);
      });

      cards.forEach((card) => ro.observe(card));

      return () => ro.disconnect();
    },
    { scope: rootRef },
  );

  /* ============================================================
     LOGO GRID (mobile, <sm) — plain fade-in, no tilt, no Flip.
     ============================================================ */
  useGSAP(
    () => {
      const grid = mobileGridRef.current;
      const cards = mobileCardRefs.current.filter(
        (el): el is HTMLDivElement => el !== null,
      );
      if (!grid || !cards.length) return;

      if (prefersReducedMotion) {
        gsap.set(cards, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(cards, { autoAlpha: 0, y: 20 });

      const tween = gsap.to(cards, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: {
          trigger: grid,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-black py-24 text-white md:py-32 lg:py-40"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ReactiveGrid className="z-0 text-white" opacity={0.1} shipCount={1} />

        <div
          aria-hidden="true"
          ref={watermarkRef}
          className="absolute -right-[6vw] top-[4%] select-none text-[38vw] font-black leading-none tracking-[-0.05em] text-white/[0.04] md:top-[6%] md:text-[30vw]"
        >
          07
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-8 left-6 hidden select-none font-mono text-[8px] uppercase tracking-[0.15em] text-white/15 md:block lg:left-10"
        >
          Grid 07 / A—B
        </div>
      </div>

      <div className="relative z-10 px-6 md:px-10 lg:px-12 xl:px-14">
        <div className="border-t border-white/15 pt-4">
          <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-white/50 lg:text-[10px]">
            <Blink as="span" className="text-[#6D28D9]">
              <ScrambleReveal as="span" variant="micro" start="top 95%">
                Partner Network
              </ScrambleReveal>
            </Blink>
            <span className="hidden items-center gap-1.5 text-white/35 md:inline-flex">
              <StatusDot />
              <ScrambleReveal as="span" variant="micro" start="top 95%">
                Verified Clients
              </ScrambleReveal>
            </span>
            <ScrambleReveal as="span" variant="micro" start="top 95%">
              07 / Partners
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
            className="mb-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/35 lg:mb-7"
          >
            <span className="h-px w-8 bg-[var(--color-accent)]" />
            <ScrambleReveal as="span" variant="micro">
              Our Partners
            </ScrambleReveal>
          </div>

          <h2
            data-io-reveal
            className="max-w-[880px] font-semibold uppercase tracking-[-0.03em] lg:tracking-[-0.04em]"
          >
            <ScrollRevealWords
              as="span"
              className="block text-[2.15rem] leading-[1.06] sm:text-[2.75rem] lg:text-[3.75rem] lg:leading-[1.01] xl:text-[4.15rem]"
              start="top 85%"
              end="top 40%"
            >
              From Steel Framing to Solar Energy, We've Powered Growth for
              Businesses Like Yours
            </ScrollRevealWords>
          </h2>

          <p
            data-io-reveal
            className="mt-7 max-w-2xl text-base leading-relaxed text-white/60 lg:mt-8 lg:text-lg"
          >
            Thirteen local businesses, one shared goal: turning digital
            marketing into measurable growth. Every partner on this wall trusted
            our team to build their SEO, web presence, and brand from the ground
            up.
          </p>

          <div
            data-io-reveal
            className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/30 lg:mt-8"
          >
            <Blink as="span">
              <StatusDot />
            </Blink>
            <ScrambleReveal as="span" variant="micro">
              13 Partners Connected — Network Active
            </ScrambleReveal>
          </div>
        </div>

        {/* Tilt-enabled grid — tablet and up. Column count changes
            (3 → 4) between here and lg, which is what the Flip
            reflow above is smoothing. */}
        <div
          ref={gridRef}
          className="mt-16 hidden grid-cols-3 gap-5 sm:grid lg:mt-20 lg:grid-cols-4 lg:gap-6"
        >
          {PARTNERS.map((partner, i) => (
            <PartnerCard
              key={partner.name}
              partner={partner}
              cardRef={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
        </div>

        {/* Mobile fallback — phones only. No TiltCard/perspective,
            no pointer tracking, no Flip observer. */}
        <div
          ref={mobileGridRef}
          className="mt-16 grid grid-cols-2 gap-4 sm:hidden"
        >
          {PARTNERS.map((partner, i) => (
            <div
              key={partner.name}
              ref={(el) => {
                mobileCardRefs.current[i] = el;
              }}
            >
              <PartnerCardStatic partner={partner} />
            </div>
          ))}
        </div>

        <div
          data-io-reveal
          className="mt-16 border-t border-white/15 pt-14 md:mt-20 md:pt-16 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-x-10"
        >
          <div className="lg:col-span-4">
            <TiltCard className="h-full border border-white/10 bg-white/[0.02]">
              <div
                className="flex h-full flex-col justify-between p-8 md:p-10"
                style={{ minHeight: 180 }}
              >
                <ScrambleReveal
                  as="span"
                  variant="micro"
                  className="font-mono text-5xl font-bold uppercase leading-none tracking-[-0.03em] text-white md:text-6xl"
                >
                  13/13
                </ScrambleReveal>
                <span className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-white/50">
                  <ScrambleReveal as="span" variant="micro">
                    Active Partnerships
                  </ScrambleReveal>
                </span>
              </div>
            </TiltCard>
          </div>

          <div className="mt-8 lg:col-span-8 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:pl-10">
            <div className="mb-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40">
              <StatusDot />
              <ScrambleReveal as="span" variant="micro">
                Onboarding Open
              </ScrambleReveal>
            </div>

            <p className="text-xl leading-snug text-white sm:text-2xl lg:text-[1.75rem]">
              Every partnership on this wall started with a single strategy
              call. If you're ready to see your brand grow the same way, let's
              talk about what's possible for your business.
            </p>

            <div className="mt-8">
              <Button
                to="/contact"
                variant="primary"
                size="lg"
                icon
                className="w-full text-center whitespace-normal sm:w-auto sm:whitespace-nowrap"
              >
                Become Our Next Partner
              </Button>
            </div>
          </div>
        </div>

        <div
          data-io-reveal
          className="mt-10 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-white/30 lg:mt-14 lg:text-[9px]"
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
              07.001
            </ScrambleReveal>
          </Blink>
        </div>
      </div>
    </section>
  );
}
