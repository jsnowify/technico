// Booking.tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

import ScrambleText from "../../components/motion/ScrambleText";
import ScrambleReveal from "../../components/motion/Scramblereveal";
import ScrollRevealWords from "../../components/motion/ScrollRevealWords";
import { Blink, StatusDot } from "../../components/motion/Blink";
import BookingForm from "../../sections/Contact/BookingForm";

/**
 * "12 / Book a Call" — the page's closing section, rendered directly
 * after FAQ (11) and before <Footer>. FAQ clears the visitor's last
 * qualification questions; this section is where that turns into an
 * actual booked slot, instead of making them click through to
 * /contact to find the same form. Reuses `BookingForm` from
 * sections/Contact/BookingForm.tsx as-is (same working "when" +
 * "who/what" two-panel layout, same mailto handoff, same timezone
 * search) — only the surrounding chrome is new here.
 *
 * Chrome matches every other numbered section on this page: black
 * ground (BookingForm's own field styling assumes it), top/footer
 * meta bar, eyebrow dash+label, hairline accent rule that draws
 * itself in, numbered folio watermark, `[data-io-reveal]` fade/slide,
 * <ScrambleText>/<ScrambleReveal> for labels and headings,
 * <ScrollRevealWords> for the lead line — same pattern Faq.tsx (11)
 * uses, see that file's header comment for the shared reasoning.
 */
export default function Booking() {
  const rootRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const items = Array.from(
        root.querySelectorAll<HTMLElement>("[data-io-reveal]"),
      );
      if (!items.length) return;

      if (prefersReducedMotion) {
        gsap.set(items, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.set(items, { autoAlpha: 0, y: 32 });

      items.forEach((el) => {
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      const line = topLineRef.current;
      if (!line) return;

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

      if (!watermarkRef.current || prefersReducedMotion) return;

      gsap.fromTo(
        watermarkRef.current,
        { yPercent: 12 },
        {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative bg-black py-16 text-white sm:py-24 md:py-32 lg:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          className="absolute -right-[10%] top-0 h-[45vw] w-[45vw] rounded-full opacity-[0.12] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
          }}
        />

        <div
          ref={watermarkRef}
          className="absolute -left-[4vw] top-[4%] select-none text-[38vw] font-black leading-none tracking-[-0.05em] text-white/[0.04] md:text-[30vw]"
        >
          12
        </div>

        <div className="absolute bottom-8 right-6 hidden select-none font-mono text-[8px] uppercase tracking-[0.15em] text-white/15 md:block lg:right-10">
          Grid 12 / A—B
        </div>
      </div>

      <div className="relative z-10 px-5 sm:px-6 md:px-10 lg:px-12 xl:px-14">
        {/* ==================================================
            TOP META
            ================================================== */}
        <div className="border-t border-white/15 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-y-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/50 lg:text-[10px]">
            <Blink as="span" className="text-[#6D28D9]">
              <ScrambleText as="span" variant="micro">
                Book Appointment
              </ScrambleText>
            </Blink>

            <span className="hidden items-center gap-1.5 text-white/35 md:inline-flex">
              <StatusDot />
              <ScrambleText as="span" variant="micro">
                Calendar Open
              </ScrambleText>
            </span>

            <ScrambleText as="span" variant="micro">
              12 / Booking
            </ScrambleText>
          </div>

          <div
            ref={topLineRef}
            aria-hidden="true"
            className="mt-4 h-px w-full bg-[var(--color-accent)]/40"
          />
        </div>

        {/* ==================================================
            HEADLINE
            ================================================== */}
        <div className="mt-14 max-w-3xl lg:mt-20">
          <div
            data-io-reveal
            className="mb-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 lg:mb-8"
          >
            <span className="h-px w-8 bg-[var(--color-accent)]" />
            <ScrambleReveal as="span" variant="micro">
              Let's Build Something
            </ScrambleReveal>
          </div>

          <h2
            data-io-reveal
            className="uppercase tracking-[-0.03em] [text-wrap:balance] lg:tracking-[-0.05em]"
          >
            <ScrambleText
              as="span"
              variant="display"
              className="block text-[2rem] font-semibold leading-[1.04] sm:text-[2.5rem] sm:leading-[1] lg:text-[3rem] lg:leading-[0.98]"
            >
              Pick a Time,
            </ScrambleText>
            <ScrambleText
              as="span"
              variant="display"
              className="block text-[2rem] font-semibold leading-[1.04] text-white/40 sm:text-[2.5rem] sm:leading-[1] lg:text-[3rem] lg:leading-[0.98]"
            >
              We'll Take It From There.
            </ScrambleText>
          </h2>

          <div data-io-reveal className="mt-6">
            <ScrollRevealWords
              as="p"
              className="max-w-xl text-lg text-white/60"
            >
              Choose a date, a time slot, and your own time zone — we&apos;ll
              confirm within one business day.
            </ScrollRevealWords>
          </div>
        </div>

        {/* ==================================================
            FORM — same BookingForm used on /contact.
            ================================================== */}
        <div data-io-reveal>
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
