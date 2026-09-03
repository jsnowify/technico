import Link from "next/link";
import TextRevealBlock from "@/components/motion/TextRevealBlock";

/* ================================================================
   SERVICES AGENCY INTRO
   ================================================================
   Next section after ServicesChapterReel on /services. Two pieces:
   1. The "Digital Marketing Agency in Canada" intro copy — heading
      + two paragraphs, one of which carries the inline
      "digital marketing services agency" link back to
      https://technicosolutions.com/ (given verbatim, including that
      it's a full absolute URL rather than a relative "/" — kept
      exactly as supplied rather than assumed/rewritten).
   2. A 4-up trust-pillar card grid (Partner-Focused, Transparency,
      Proven Track Record, Guaranteed Success) — visual language
      lifted directly from ServicesMarketOverview's STATS grid
      (bg-[#f3f4ee] card, circular icon badge, centered content) so
      this reads as the same design system rather than a new pattern.
      Only the four labels were supplied, no descriptions — so, same
      as everywhere else in this codebase, nothing was invented to
      fill that in. The icons are decorative-only (aria-hidden), not
      sourced copy.

   Server component (no "use client"): TextRevealBlock is a client
   component internally, but the section itself doesn't need to be
   one — same pattern as ServicesTailoredStrategy — which keeps this
   content in the server-rendered HTML per the project's SEO notes
   (consideration.md: core text should exist before JS/animation
   runs).
   ================================================================ */

interface Pillar {
  title: string;
  icon: React.ReactNode;
}

const PILLARS: Pillar[] = [
  {
    title: "Partner-Focused",
    // Two overlapping circles — represents a close working partnership.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="9" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="15" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Transparency",
    // Open eye — represents clarity/visibility into the work.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: "Proven Track Record",
    // Medal on a ribbon — represents a track record of results.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M9 12.5 7 21l5-3 5 3-2-8.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Guaranteed Success",
    // Shield with a checkmark — represents a guaranteed outcome.
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <path
          d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function ServicesAgencyIntro() {
  return (
    <section className="bg-white-bg">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24 md:py-28">
        <TextRevealBlock
          as="h2"
          lines={[
            "Digital Marketing Agency in Canada",
            "\u2013 Technico Digital Solutions",
          ]}
          className="mx-auto max-w-4xl text-center text-3xl leading-[1.2] font-semibold tracking-tight text-black-text sm:text-4xl md:text-5xl md:leading-[1.15] lg:text-[45px]"
          revealColorDark="#000000"
          scrollTrigger
        />

        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-black-text/70 text-pretty sm:mt-10 sm:text-base">
          As A Trusted Internet Marketing Agency, We Deliver Measurable Results
          For Your Business. Our Team Of Digital Marketers And SEO Specialists
          Believe In Building Strong Partnerships And Guaranteeing Your Success.
        </p>

        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-black-text/70 text-pretty sm:text-base">
          Imagine Where Your Business Could Be Six Months From Now. Let&rsquo;s
          Make It Happen. Our{" "}
          <Link
            href="https://technicosolutions.com/"
            className="text-purple-secondary underline decoration-1 underline-offset-4 hover:text-purple-accent"
          >
            Digital Marketing Services Agency
          </Link>{" "}
          Is Ready To Help You Get Your Business Moving.
        </p>

        {/* Trust pillars */}
        <div className="mt-16 grid grid-cols-2 gap-5 sm:mt-20 md:grid-cols-4 md:gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-[#f3f4ee] px-6 py-10 text-center sm:px-8 sm:py-12"
            >
              <span
                aria-hidden="true"
                className="mx-auto mb-7 flex h-8 w-8 items-center justify-center rounded-full border border-black-text/15 text-black-text/60 sm:mb-9"
              >
                {pillar.icon}
              </span>
              <p className="text-lg font-semibold tracking-tight text-black-text sm:text-xl">
                {pillar.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
