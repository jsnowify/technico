import type { ReactNode } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import RevealUpText from "@/components/motion/RevealUpText";
import TiltIn from "@/components/motion/TiltIn";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   HOME OVERVIEW — redesigned to match the supplied reference:
     [ ] Technico Digital Solutions   (small eyebrow, top-left)
     Big left-aligned headline
     Book a Call (purple goo pill) / Free Strategy (dark outline pill)
     ---------------------------------------------------------
     3 standalone rounded cards, each with a solid purple "image"
     block up top, a title, and a paragraph underneath.
   ---------------------------------------------------------
   Whole section now sits on bg-black-bg (was bg-white-bg with
   black inset panels) — the reference is dark end-to-end. The old
   border-x-only frame + divided panel grid is gone; cards are now
   discrete rounded-[20px] boxes with their own border and gap,
   matching the reference's card spacing instead of a seamless
   divided strip.

   The old octagon-framed line-art icons are replaced with a solid
   purple-accent rounded block per card (the reference's "image"
   slot) — TiltIn still wraps it for the same scroll-settle entrance
   the rest of the site uses on this kind of element.
   ================================================================ */

type Panel = {
  title: string;
  text: ReactNode;
};

const PANELS: Panel[] = [
  {
    title: "Strategy",
    text: (
      <>
        Technico Digital Solutions is a{" "}
        <Link
          href="/services"
          className="text-purple-secondary underline decoration-1 underline-offset-2 transition-colors duration-300 hover:text-purple-accent"
        >
          digital marketing agency
        </Link>{" "}
        that will unlock your brand&rsquo;s potential to drive substantial
        growth. Benefit from our data-driven strategies focused on increasing
        your revenues and positioning your brand as a leader in the market.
      </>
    ),
  },
  {
    title: "Timeline",
    text: (
      <>
        Our digital marketing professionals establish a realistic timeline for
        implementing digital marketing strategies and setting milestones to
        track progress.
      </>
    ),
  },
  {
    title: "Growth",
    text: (
      <>
        Let us show you how we can elevate your revenue, amplify your profits,
        and expand your brand&rsquo;s reach in the digital realm.
      </>
    ),
  },
];

export default function Overview() {
  return (
    <section className="bg-black-bg">
      <div className="mx-4 px-4 pt-16 pb-16 sm:mx-[70px] sm:px-[30px] sm:pb-20">
        {/* Eyebrow + headline + CTAs share one grid: eyebrow sits in
            the fixed-width left column, headline and CTAs both sit
            in the right column so the buttons land directly under
            the headline's left edge instead of the eyebrow's. */}
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-8">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 lg:pt-2">
            <span className="eyebrow-text font-mono tracking-[0.16em] whitespace-nowrap text-white/50 uppercase">
              [ ] Technico Digital Solutions
            </span>
          </div>

          {/* Heading */}
          <h2 className="h2-section indent-12 leading-[1.1] font-medium tracking-heading text-white sm:indent-16 md:indent-20 lg:w-[700px]">
            Boost revenues, maximize profits, generate qualified leads, and
            enhance brand visibility.
          </h2>

          {/* Spacer — reserves the left grid column on the CTA row
              so the buttons below land in the right column, aligned
              under the heading rather than the eyebrow. */}
          <div className="hidden lg:block" aria-hidden />

          <div className="flex flex-col gap-10 sm:flex-row sm:items-center">
            <Button to={SITE_PHONE_HREF} variant="purple-fill">
              Book a Call
            </Button>

            <Button to="/contact" variant="underline">
              Free Strategy
            </Button>
          </div>
        </div>

        {/* Card grid — 3 standalone rounded cards with their own
            border + gap (was a single seamless divided strip). */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {PANELS.map((panel) => (
            <div
              key={panel.title}
              className="group rounded-[20px] border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/20 sm:p-7"
            >
              <TiltIn className="block">
                <div
                  aria-hidden
                  className="h-36 w-full rounded-2xl bg-purple-accent transition-transform duration-500 ease-out group-hover:scale-[1.02] sm:h-40"
                />
              </TiltIn>

              <RevealUpText
                as="h3"
                text={panel.title}
                className="card-title mt-6 block leading-snug font-medium tracking-heading text-white"
              />

              <p className="body-copy mt-3 leading-relaxed font-light tracking-body text-white/55">
                {panel.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
