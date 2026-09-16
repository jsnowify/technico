import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import RevealUpText from "@/components/motion/RevealUpText";
import TiltIn from "@/components/motion/TiltIn";
import { SITE_PHONE_HREF } from "@/lib/constants";

/* ================================================================
   HOME STRATEGY (third section) — redesigned to match the supplied
   reference:
     [ ] Market Leader   (small eyebrow, top-left)
     Big left-aligned headline, paired with a short supporting
     paragraph to its right on large screens
     Book a Call (purple-fill pill) / Free Strategy (underline link)
     ---------------------------------------------------------
     2 standalone rounded cards, each with a solid purple "image"
     block up top, a small label, a title, and a paragraph.
   ---------------------------------------------------------
   This replaces the old bordered-frame + divide-x panel grid (white
   panels with octagon line-art icons, full-bleed against the
   section's black bg) with the exact same card language
   Overview.tsx uses one section up — discrete rounded-[20px] boxes
   with their own border/gap and a solid purple-accent block instead
   of an icon, so the two sections now read as one continuous system
   rather than two different eras of the design.

   HEADLINE + PARAGRAPH SIDE BY SIDE — the reference splits these
   into two columns on larger screens (headline left, ~2xl max-width;
   paragraph right, narrower, top-aligned) rather than stacking the
   paragraph underneath the headline. Both still sit inside Overview's
   [auto_1fr] eyebrow/content grid, so the CTA row below still lands
   flush under the heading's left edge via the same spacer-row trick
   Overview uses (an empty `lg:block` cell reserves the eyebrow
   column so the row after it starts in the content column).

   CARDS — 2 panels instead of Overview's 3 (this section only ever
   had two content blocks), same rounded border + solid purple block
   + title + paragraph structure. Both blocks use bg-purple-accent
   (not one purple / one pink) to match the reference, which renders
   both cards' image blocks in the same shade.
   ================================================================ */

type Panel = {
  eyebrow: string;
  title: string;
  text: ReactNode;
};

const PANELS: Panel[] = [
  {
    eyebrow: "Our Philosophy",
    title: "Revenue, By Design",
    text: (
      <>
        A powerful marketing strategy isn&rsquo;t just about promotions —
        it&rsquo;s about maximizing revenue opportunities through strategic
        outreach.
      </>
    ),
  },
  {
    eyebrow: "Why It Works",
    title: "Growth, Compounded",
    text: (
      <>
        Successful marketing strategies are the biggest driver of revenue
        acceleration. A strong digital campaign builds the recognition you
        deserve and brings in new, high-intent customers. Technico Digital
        Solutions supports businesses of every size with a holistic approach
        built to grow your online presence, market position, and revenue
        together.
      </>
    ),
  },
];

export default function Strategy() {
  return (
    <section className="bg-black-bg">
      <div className="mx-4 px-4 pt-16 pb-16 sm:mx-[70px] sm:px-[30px] sm:pb-20">
        {/* Eyebrow + headline/paragraph + CTAs share one grid, same
            convention as Overview.tsx: eyebrow sits in the
            fixed-width left column, everything else sits in the
            right column so the CTA row lands under the heading's
            left edge instead of the eyebrow's. */}
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-8">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 lg:pt-2">
            <span className="eyebrow-text font-mono tracking-[0.16em] whitespace-nowrap text-white/50 uppercase">
              [ ] Market Leader
            </span>
          </div>

          {/* Heading + supporting paragraph — side by side on large
              screens, stacked below that. */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            <h2 className="h2-section indent-12 max-w-2xl leading-[1.1] font-medium tracking-heading text-white sm:indent-16 md:indent-20">
              We drive your brand forward, automate strategies, and boost
              revenue.
            </h2>
            <p className="body-copy max-w-sm shrink-0 leading-relaxed font-light tracking-body text-white/55 lg:pt-2">
              Our expertise lies in leveraging the latest technology to help you
              scale — whether that means generating more appointments or driving
              increased sales.
            </p>
          </div>

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

        {/* Card grid — 2 standalone rounded cards with their own
            border + gap, matching Overview.tsx's card treatment. */}
        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {PANELS.map((panel) => (
            <div
              key={panel.eyebrow}
              className="group rounded-[20px] border border-white/10 bg-white/[0.02] p-6 transition-colors duration-300 hover:border-white/20 sm:p-7"
            >
              <TiltIn className="block">
                <div
                  aria-hidden
                  className="h-36 w-full rounded-2xl bg-purple-accent transition-transform duration-500 ease-out group-hover:scale-[1.02] sm:h-40"
                />
              </TiltIn>

              <span className="mt-6 mb-2 block font-mono text-xs tracking-[0.2em] text-white/50 uppercase">
                {panel.eyebrow}
              </span>

              <RevealUpText
                as="h3"
                text={panel.title}
                className="card-title leading-snug font-medium tracking-heading text-white"
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
