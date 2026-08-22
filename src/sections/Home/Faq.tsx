// Faq.tsx
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "../../lib/gsap";

import Button from "../../components/ui/Button";
import ScrambleText from "../../components/motion/ScrambleText";
import ScrambleReveal from "../../components/motion/Scramblereveal";
import ScrollRevealWords from "../../components/motion/ScrollRevealWords";
import { Blink, StatusDot } from "../../components/motion/Blink";

/**
 * "11 / FAQ" — rendered after Ignition (10) and before <Footer>.
 * Ignition already delivers the page's big final call to action, so
 * this section isn't another sales beat — it's the last obstacle
 * between "convinced" and "booked": the handful of comparison/
 * qualification questions (who do you work with, SEO vs PPC, and so
 * on) a visitor would otherwise have to leave the page to go answer
 * elsewhere.
 *
 * Black ground, alternating back off Ignition's white the same way
 * every other pair of neighbors on this page does. Chrome matches
 * every numbered section: top/footer meta bars, eyebrow dash+label,
 * hairline accent rule that draws itself in, numbered folio watermark,
 * `[data-io-reveal]` fade/slide-in, <ScrambleText>/<ScrambleReveal>
 * for labels and headings, <ScrollRevealWords> for the lead line.
 *
 * REWRITE NOTES (v2):
 *  - Layout: was a single centered column stacking a full-width hero
 *    header on top of a flat accordion list — the intro/CTA had
 *    nothing to do once read, and the list read as one undifferentiated
 *    wall on desktop. Now a two-column split: the pitch + "still have
 *    questions" CTA lives in a sticky rail on the left, the accordion
 *    lives on the right as its own set of bordered cards. Collapses to
 *    a single column under `lg`.
 *  - Perf: the old build re-measured every accordion item's height
 *    with GSAP (`scrollHeight` / `getBoundingClientRect` reads) on
 *    every open/close, and ran a per-frame canvas-style `<ReactiveGrid>`
 *    behind it — two independent sources of main-thread work stacked
 *    on a section people actively click around in. Both are gone:
 *    the accordion now expands via a CSS `grid-template-rows` 0fr→1fr
 *    transition (no JS measuring, no forced reflow), and the backdrop
 *    is a static CSS gradient instead of an animated SVG grid.
 */

type FaqItem = {
  index: string;
  question: string;
  answer: string;
};

const FAQS: readonly FaqItem[] = [
  {
    index: "01",
    question:
      "What type of clients does your digital marketing agency Canada work with?",
    answer:
      "Technico Digital Solutions works with small to medium-sized businesses across Canada that want to grow through data-driven digital strategies. Our clients include law firms, solar companies, trades businesses, dental clinics, e-commerce brands, and industries where targeted campaigns, SEO, and content directly move the needle. If your business needs a full digital strategy or support in one specific area, we tailor our services to fit your goals and budget.",
  },
  {
    index: "02",
    question: "What is the strongest marketing tactic?",
    answer:
      "The strongest marketing tactic for most businesses today is a combined digital marketing strategy that pairs SEO, paid ads, social media, and email into one unified approach. Each channel reinforces the others: SEO builds long-term visibility while paid ads deliver immediate traffic, and email marketing converts the audience both bring in. Paid search works especially well when supported by organic efforts to attract more customers and keep your brand visible in an increasingly complex landscape. By analyzing performance data, businesses can adjust campaigns for better results and stronger lead generation.",
  },
  {
    index: "03",
    question: "Which is better, SEO or PPC?",
    answer:
      "SEO is better for long-term, sustainable growth, while PPC is better when you need fast, targeted traffic. But the strongest results come from running both together. SEO (including search campaigns) builds compounding organic visibility over time, meaning your rankings keep working without ongoing ad spend. PPC or paid ads put you in front of the right audience immediately, but stop the moment your budget does. At Technico Digital Solutions, we combine both methods so clients aren't dependent on one channel to drive results.",
  },
  {
    index: "04",
    question: "How do digital marketing companies help start-up businesses?",
    answer:
      "Digital marketing agencies help startups compete from day one by giving them immediate access to SEO specialists, paid ad managers, content strategists, and web designers, without the cost of hiring each role in-house. For a new business with a lean team and limited budget, that means professional-grade campaigns, faster brand visibility, and growth strategies that scale as revenue grows. Instead of spending months building internal capacity, startups can focus on their product while an agency drives the traffic and leads.",
  },
  {
    index: "05",
    question: "Is digital marketing different from traditional marketing?",
    answer:
      "Digital marketing differs from traditional marketing in how it reaches and measures audiences. Traditional marketing relies on print, TV, or radio ads, while digital marketing uses online platforms for real-time results. Besides SEO, web development, and paid advertising, it includes strategies like influencer marketing to build brand trust through social media and performance marketing to track data, clicks, and conversions. Digital campaigns are more flexible, measurable, and cost-effective than traditional methods.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Accordion item — pure CSS expand/collapse, no JS height measuring         */
/* -------------------------------------------------------------------------- */

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      data-io-reveal
      className={[
        "group/item rounded-2xl border transition-colors duration-300",
        isOpen
          ? "border-[var(--color-accent)]/40 bg-white/[0.03]"
          : "border-white/10 bg-white/[0.015] hover:border-white/25",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        data-cursor="highlight"
        className="flex w-full items-center gap-4 px-5 py-5 text-left sm:gap-6 sm:px-7 sm:py-6"
      >
        <span
          className={[
            "font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300 lg:text-[11px]",
            isOpen ? "text-[var(--color-accent)]" : "text-white/35",
          ].join(" ")}
        >
          {item.index}
        </span>

        <span className="flex-1 text-base font-semibold leading-snug text-white [text-wrap:pretty] sm:text-lg lg:text-xl">
          {item.question}
        </span>

        <span
          aria-hidden="true"
          className={[
            "relative h-4 w-4 shrink-0 transition-transform duration-500 ease-out",
            isOpen ? "rotate-45" : "rotate-0",
          ].join(" ")}
        >
          <span className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-white/50 transition-colors duration-300 group-hover/item:bg-[var(--color-accent)]" />
          <span className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2 bg-white/50 transition-colors duration-300 group-hover/item:bg-[var(--color-accent)]" />
        </span>
      </button>

      {/* Height comes from the CSS grid-rows trick (0fr closed, 1fr
          open) instead of a JS-measured pixel value — the browser's
          own layout/compositor does the work, so there's nothing to
          recompute on toggle and nothing that can drift out of sync
          on resize. */}
      <div
        className={
          prefersReducedMotion
            ? "grid"
            : "grid transition-[grid-template-rows] duration-500 ease-out"
        }
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-6 pl-[3.05rem] text-sm leading-relaxed text-white/55 sm:px-7 sm:pb-7 sm:pl-[3.6rem] lg:text-[15px]">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

export default function FAQ() {
  const rootRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  /* ============================================================
     SCROLL REVEAL — identical to every other numbered section's
     [data-io-reveal].
     ============================================================ */
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

  /* ============================================================
     WATERMARK PARALLAX — same fromTo/scrub pattern as every prior
     section's own folio numeral.
     ============================================================ */
  useGSAP(
    () => {
      const watermark = watermarkRef.current;
      if (!watermark || prefersReducedMotion) return;

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
    },
    { scope: rootRef },
  );

  /* ============================================================
     TOP RULE — draws itself in, same power3.out one-shot as every
     other section's top rule.
     ============================================================ */
  useGSAP(
    () => {
      const line = topLineRef.current;
      if (!line) return;

      if (prefersReducedMotion) {
        gsap.set(line, { scaleX: 1 });
        return;
      }

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
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative bg-black py-16 text-white sm:py-24 md:py-32 lg:py-40"
    >
      {/* ======================================================
          AMBIENT BACKGROUND — static CSS gradients + hairline
          grid instead of an animated per-frame SVG. Same dark,
          faintly-technical read, none of the per-frame cost.
          ====================================================== */}
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
          className="absolute -left-[10%] top-0 h-[45vw] w-[45vw] rounded-full opacity-[0.12] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
          }}
        />

        <div
          ref={watermarkRef}
          className="absolute -right-[6vw] top-[4%] select-none text-[38vw] font-black leading-none tracking-[-0.05em] text-white/[0.04] md:text-[30vw]"
        >
          11
        </div>

        <div className="absolute bottom-8 left-6 hidden select-none font-mono text-[8px] uppercase tracking-[0.15em] text-white/15 md:block lg:left-10">
          Grid 11 / A—B
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
                Common Questions
              </ScrambleText>
            </Blink>

            <span className="hidden items-center gap-1.5 text-white/35 md:inline-flex">
              <StatusDot />
              <ScrambleText as="span" variant="micro">
                System Nominal
              </ScrambleText>
            </span>

            <ScrambleText as="span" variant="micro">
              11 / FAQ
            </ScrambleText>
          </div>

          <div
            ref={topLineRef}
            aria-hidden="true"
            className="mt-4 h-px w-full bg-[var(--color-accent)]/40"
          />
        </div>

        {/* ==================================================
            TWO-COLUMN SPLIT — sticky pitch/CTA rail (left) +
            accordion (right). Was a single stacked column before;
            splitting gives the intro somewhere to live once read
            instead of just sitting on top of the list, and stops
            the accordion from reading as one long undifferentiated
            wall on wide screens.
            ================================================== */}
        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          {/* ---- Left: intro + CTA ---- */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div
                data-io-reveal
                className="mb-5 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 lg:mb-8"
              >
                <span className="h-px w-8 bg-[var(--color-accent)]" />
                <ScrambleReveal as="span" variant="micro">
                  Support Channel
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
                  Frequently Asked
                </ScrambleText>
                <ScrambleText
                  as="span"
                  variant="display"
                  className="block text-[2rem] font-semibold leading-[1.04] text-[var(--color-accent)] sm:text-[2.5rem] sm:leading-[1] lg:text-[3rem] lg:leading-[0.98]"
                >
                  Questions
                </ScrambleText>
              </h2>

              <ScrollRevealWords
                as="p"
                className="mt-8 max-w-sm text-lg font-medium leading-snug text-white/70 [text-wrap:pretty] sm:mt-10 sm:text-xl lg:mt-8 lg:text-lg"
                start="top 85%"
                end="top 45%"
              >
                Straight answers on how we work, so you know exactly what you're
                signing up for before you book the call.
              </ScrollRevealWords>

              {/* ---- Closing nudge, folded into the rail instead of
                  a separate full-width band under the list. ---- */}
              <div
                data-io-reveal
                className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:mt-12"
              >
                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40">
                  <StatusDot />
                  <ScrambleReveal as="span" variant="micro">
                    Still Have Questions?
                  </ScrambleReveal>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-white/55 lg:text-[15px]">
                  Nothing above cover it? Send it straight to the team — we
                  answer every message ourselves.
                </p>

                <Button
                  to="/contact"
                  variant="secondary"
                  size="md"
                  icon
                  className="mt-5 w-full text-center whitespace-normal"
                >
                  Talk To Us
                </Button>
              </div>
            </div>
          </div>

          {/* ---- Right: accordion ---- */}
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-3 sm:gap-3.5">
              {FAQS.map((item, i) => (
                <AccordionItem
                  key={item.index}
                  item={item}
                  isOpen={openIndex === i}
                  onToggle={() => handleToggle(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          FOOTER META
          ====================================================== */}
      <div
        data-io-reveal
        className="relative z-10 mt-14 px-5 sm:px-6 md:px-10 lg:mt-20 lg:px-12 xl:px-14"
      >
        <div className="flex flex-wrap items-center justify-between gap-y-2 border-t border-white/10 pt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-white/30 lg:text-[9px]">
          <ScrambleReveal as="span" variant="micro">
            Technico Digital Solutions
          </ScrambleReveal>

          <span className="hidden items-center gap-1.5 md:inline-flex">
            <StatusDot />
            <ScrambleReveal as="span" variant="micro">
              System Nominal
            </ScrambleReveal>
          </span>

          <Blink as="span">
            <ScrambleReveal as="span" variant="micro">
              11.001
            </ScrambleReveal>
          </Blink>
        </div>
      </div>
    </section>
  );
}
