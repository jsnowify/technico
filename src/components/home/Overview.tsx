import type { ReactNode } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import GlossyButton from "@/components/ui/GlossyButton";
import RevealUpText from "@/components/motion/RevealUpText";
import TiltIn from "@/components/motion/TiltIn";
import { SITE_PHONE_HREF } from "@/lib/constants";

type Panel = {
  title: string;
  text: ReactNode;
  variant: "spread" | "cross" | "stack";
};

// Solid hover-fill color per panel — alternates purple → pink →
// purple, same pairing PanelIcon's old alternating scheme used.
const FILL_COLOR: Record<Panel["variant"], string> = {
  spread: "bg-purple-accent",
  cross: "bg-pink-accent",
  stack: "bg-purple-accent",
};

const PANELS: Panel[] = [
  {
    variant: "spread",
    title: "Strategy",
    text: (
      <>
        Technico Digital Solutions is a{" "}
        <Link
          href="/services"
          className="text-purple-secondary underline decoration-1 underline-offset-2 transition-colors duration-300 hover:text-purple-accent group-hover:text-white"
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
    variant: "cross",
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
    variant: "stack",
    title: "Growth",
    text: (
      <>
        Let us show you how we can elevate your revenue, amplify your profits,
        and expand your brand&rsquo;s reach in the digital realm.
      </>
    ),
  },
];

function PanelIcon({ variant }: { variant: Panel["variant"] }) {
  const OCTAGON = "M21 0H49L70 21V49L49 70H21L0 49V21Z";
  // Panels are now dark, so the icon sits light-on-black by default
  // and brightens to full white on hover for contrast against the
  // purple/pink fill (see FILL_COLOR above).
  const ICON_BOX =
    "h-24 w-24 text-white/60 transition-[color,transform] duration-500 ease-out group-hover:-rotate-6 group-hover:text-white";
  const octagon = (
    <path
      d={OCTAGON}
      stroke="var(--color-white-text)"
      strokeWidth={1}
      opacity={0.2}
    />
  );

  // "Strategy" — target-board glyph from strategy-svgrepo-com.svg,
  // recolored to currentColor and dropped into the 24x24 slot inset
  // inside the 70x70 octagon frame (translate 14, scale 42/24).
  if (variant === "spread") {
    return (
      <svg viewBox="0 0 70 70" className={ICON_BOX} fill="none">
        {octagon}
        <g transform="translate(14 14) scale(1.75)" fill="currentColor">
          <path d="M21,3H3A1,1,0,0,0,2,4V20a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V4A1,1,0,0,0,21,3ZM5.293,8.707A1,1,0,1,1,6.707,7.293l.793.793.793-.793A1,1,0,1,1,9.707,8.707L8.914,9.5l.793.793a1,1,0,0,1-1.414,1.414L7.5,10.914l-.793.793a1,1,0,0,1-1.414-1.414L6.086,9.5ZM19,14a1,1,0,0,1-2,0V12.414l-.192.192A14.9,14.9,0,0,1,6.2,17H6a1,1,0,0,1,0-2h.2a12.916,12.916,0,0,0,9.193-3.808L15.586,11H14a1,1,0,0,1,0-2h4a1,1,0,0,1,1,1Z" />
        </g>
      </svg>
    );
  }

  // "Timeline" — grid/checkpoint glyph from timeline-svgrepo-com.svg,
  // same 24x24-in-70x70 inset treatment as the other two.
  if (variant === "cross") {
    return (
      <svg viewBox="0 0 70 70" className={ICON_BOX} fill="none">
        {octagon}
        <g transform="translate(14 14) scale(1.75)" fill="currentColor">
          <path d="M7 7h4v4H7V7zm-2 6v-2h2v2H5zm0 0v4H1v-4h4zm8 0h-2v-2h2v2zm4 0h-4v4h4v-4zm2-2v2h-2v-2h2zm0 0h4V7h-4v4z" />
        </g>
      </svg>
    );
  }

  // "Growth" — bar-chart-with-trendline glyph from
  // growth-report-graph-svgrepo-com.svg. Source viewBox is
  // 6.35x6.35, so the inset scale is 42/6.35 instead of 42/24.
  return (
    <svg viewBox="0 0 70 70" className={ICON_BOX} fill="none">
      {octagon}
      <g transform="translate(14 14) scale(6.614173)" fill="currentColor">
        <path d="m 0.26485,5.8204456 a 0.2645835,0.2645835 0 0 0 -0.26563,0.26563 0.2645835,0.2645835 0 0 0 0.26563,0.26367 h 5.82031 a 0.2645835,0.2645835 0 0 0 0.26562,-0.26367 0.2645835,0.2645835 0 0 0 -0.26562,-0.26563 z" />
        <path d="m 1.16328,3.9688856 c -0.34722,0 -0.63476,0.28754 -0.63476,0.63477 v 1.48242 a 0.26460996,0.26460996 0 0 0 0.26562,0.26367 h 1.0586 a 0.26460996,0.26460996 0 0 0 0.26367,-0.26367 v -1.48242 c 0,-0.34723 -0.28755,-0.63477 -0.63477,-0.63477 z" />
        <path d="m 3.0168,3.0684956 c -0.34722,0 -0.63477,0.28753 -0.63477,0.63477 v 2.38281 a 0.26460996,0.26460996 0 0 0 0.26367,0.26367 h 1.0586 a 0.26460996,0.26460996 0 0 0 0.26367,-0.26367 v -2.38281 c 0,-0.34724 -0.28755,-0.63477 -0.63477,-0.63477 z" />
        <path d="m 4.86836,2.2755256 c -0.34722,0 -0.63477,0.28754 -0.63477,0.63477 v 3.17578 a 0.26460996,0.26460996 0 0 0 0.26368,0.26367 h 1.05859 a 0.26460996,0.26460996 0 0 0 0.26563,-0.26367 v -3.17578 c 0,-0.34723 -0.2895,-0.63477 -0.63672,-0.63477 z" />
        <path d="M 4.6205208,2.5237e-4 A 0.2645835,0.2645835 0 0 0 4.3564534,0.26380219 0.2645835,0.2645835 0 0 0 4.6205208,0.52941905 H 4.8938883 C 3.3974791,1.8159538 1.8306324,2.6151331 0.2161369,2.9142865 A 0.2645835,0.2645835 0 0 0 0.0052984,3.2227949 0.2645835,0.2645835 0 0 0 0.3117388,3.4357016 C 2.050091,3.1136013 3.722697,2.2498105 5.2923138,0.88753671 V 1.1991456 A 0.2645835,0.2645835 0 0 0 5.5558626,1.4647625 0.2645835,0.2645835 0 0 0 5.8214805,1.1991456 V 0.41986501 C 5.8215308,0.19150501 5.62816,2.0237e-4 5.3998008,2.5237e-4 Z" />
      </g>
    </svg>
  );
}

export default function Overview() {
  return (
    <section className="bg-white-bg">
      <div className="mx-4 border-x border-black-text/10 px-4 pt-16 sm:mx-[70px] sm:px-[30px]">
        {/* Eyebrow */}
        <p className="font-mono text-xs tracking-[0.14em] text-black-text/60 uppercase">
          [ TECHNICO DIGITAL SOLUTIONS ]
        </p>

        {/* Headline — word-by-word scroll rise-in via RevealUpText,
            same classes it replaced. */}
        <RevealUpText
          as="h2"
          text="Boost revenues, maximize profits, generate qualified leads, and enhance brand visibility."
          className="mt-4 max-w-4xl text-[32px] leading-[1.1] font-medium tracking-tight text-black-text sm:text-[42px] md:text-[56px] lg:text-[64px]"
        />

        {/* CTAs — same Book a Call / Free Strategy pairing as
            home/Strategy.tsx, swapped in for the old orange
            octagon "Learn More" button. */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <div className="w-full max-w-xs sm:w-auto">
            <Button to={SITE_PHONE_HREF} variant="primary" size="lg">
              Book a Call
            </Button>
          </div>
          <div className="w-full max-w-xs sm:w-auto">
            <GlossyButton to="/contact">Free Strategy</GlossyButton>
          </div>
        </div>

        {/* Feature grid — single shared top border + shared vertical
            dividers, so the line can't drift between columns. Panels
            are black against the section's white bg, so the divider
            uses white/10 (visible on the black panels, which is most
            of the grid's surface area) rather than black-text/10.

            `-mx-4 sm:-mx-[30px]` cancels out the parent's `px-4
            sm:px-[30px]` padding so the black panel bg runs edge-to-
            edge to the container's border-x lines, instead of
            leaving a white gap between the panels and the frame. */}
        <div className="mt-16 -mx-4 grid grid-cols-1 divide-y divide-white/10 border-t border-black-text/10 sm:mx-[-30px] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {PANELS.map((panel) => (
            <div
              key={panel.title}
              className="group relative overflow-hidden bg-black-bg px-4 py-16 sm:px-8 sm:py-20 md:py-24"
            >
              {/* Hover fill — solid purple/pink panel, hidden below
                  the fold (translate-y-full) and slid up to cover the
                  panel (translate-y-0) on hover, so it reads as rising
                  from the bottom rather than fading in place. */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 ${FILL_COLOR[panel.variant]}`}
              />

              <div className="relative">
                <TiltIn>
                  <PanelIcon variant={panel.variant} />
                </TiltIn>

                <RevealUpText
                  as="h3"
                  text={panel.title}
                  className="mt-8 text-[25px] font-medium tracking-wide text-white"
                />

                <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/90">
                  {panel.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
