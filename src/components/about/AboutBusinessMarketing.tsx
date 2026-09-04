/* ================================================================
   ABOUT BUSINESS MARKETING
   ================================================================
   Sits directly after AboutStory.tsx, but is deliberately its own
   component with its own layout rather than a 4th/5th chapter
   bolted onto AboutStory's stacked-chapter pattern:

     - AboutStory reads top-to-bottom, one big chapter at a time.
       This one is a 2-up split — Business and Marketing side by
       side on desktop (stacked on mobile), so it reads as a single
       comparison beat instead of two more full-width chapters.
     - Corner brackets on each panel (see <CornerBrackets> below)
       lean into a HUD/targeting-reticle look — a more overt "sci-fi"
       framing device than AboutStory uses, on top of the same
       mono-type, tag-pill, purple/pink-accent language the rest of
       the About page already speaks, so it reads as a variant beat,
       not an unrelated component.
     - The "A . 00X" index convention carries over from AboutStory's
       dividers (continuing 004/005 after that section's 001–003),
       but here it's a small corner readout instead of a divider
       mark, since there's no divider in a 2-up layout.

   Content is carried over verbatim from the "Business" and
   "Marketing" fields in AboutFieldsAccordion.tsx: Business's four
   bullets are joined into one flowing sentence (same bullets-to-
   prose treatment AboutStory used for "Approach"), and Marketing's
   single paragraph is split at its natural sentence break to fill
   two paragraph slots. Nothing invented — see the per-panel comment
   below for exactly which source paragraph each one maps to.
   ================================================================ */

import RevealUpText from "@/components/motion/RevealUpText";
import Cta from "@/components/ui/CTA";
import { SITE_PHONE_HREF } from "@/lib/constants";

interface Panel {
  number: string;
  label: string;
  accent: "purple" | "pink";
  paragraphs: string[];
}

const PANELS: Panel[] = [
  {
    // Source: AboutFieldsAccordion's "Business" field
    // (bg-pink-accent there — kept here for the same reason).
    number: "004",
    label: "Business",
    accent: "pink",
    paragraphs: [
      "We implement the perfect balance between creativity, data, and transparency to provide real results. Running a digital marketing campaign? Integrating content marketing? Our team brings the best of both worlds with modern digital tactics and a solid understanding of traditional marketing.",
      "Businesses choose us for a proven track record with measurable ROI, clear communication and a collaborative workflow, tailored strategies that are never one-size-fits-all, and ongoing optimization and support.",
    ],
  },
  {
    // Source: AboutFieldsAccordion's "Marketing" field
    // (bg-purple-secondary there — kept here for the same reason).
    number: "005",
    label: "Marketing",
    accent: "purple",
    paragraphs: [
      "Ready to see your business soar? If you're tired of ineffective campaigns and low engagement, it's time to work with a team that knows how to turn things around.",
      "Partner with the digital agency marketing team at Technico Digital Solutions and put your brand at the forefront of success today.",
    ],
  },
];

const ACCENT_TEXT: Record<Panel["accent"], string> = {
  purple: "text-purple-accent",
  pink: "text-pink-accent",
};

const ACCENT_BORDER: Record<Panel["accent"], string> = {
  purple: "border-purple-accent/40",
  pink: "border-pink-accent/40",
};

const ACCENT_STROKE: Record<Panel["accent"], string> = {
  purple: "stroke-purple-accent/70",
  pink: "stroke-pink-accent/70",
};

// HUD-style corner bracket — an open "]" / "[" drawn as two short
// strokes meeting at a right angle, rotated per corner via the
// `corner` prop. Reads as a targeting-reticle/viewfinder frame
// around the panel rather than a solid border, which is the more
// overt "sci-fi" cue this layout leans on that AboutStory doesn't.
function CornerBracket({
  corner,
  accent,
  className = "",
}: {
  corner: "tl" | "tr" | "bl" | "br";
  accent: Panel["accent"];
  className?: string;
}) {
  const rotation = { tl: 0, tr: 90, bl: 270, br: 180 }[corner];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 ${ACCENT_STROKE[accent]} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      fill="none"
    >
      <path d="M1 9V1H9" strokeWidth="1.5" />
    </svg>
  );
}

function BusinessMarketingPanel({ panel }: { panel: Panel }) {
  return (
    <div className="relative px-6 py-10 sm:px-10 sm:py-12">
      <CornerBracket
        corner="tl"
        accent={panel.accent}
        className="absolute top-0 left-0"
      />
      <CornerBracket
        corner="br"
        accent={panel.accent}
        className="absolute right-0 bottom-0"
      />

      {/* Top row — tag pill on the left, "A . 00X" HUD readout on
          the right, echoing AboutStory's divider index tags but as
          a corner readout instead of a divider mark. */}
      <div className="flex items-center justify-between gap-4">
        <span
          className={`inline-block w-fit border px-3 py-1.5 font-mono text-xs tracking-[0.14em] uppercase ${ACCENT_BORDER[panel.accent]} ${ACCENT_TEXT[panel.accent]}`}
        >
          {"// "}
          {panel.label}
        </span>
        <span className="font-mono text-xs tracking-[0.14em] text-white/30">
          {"A . "}
          {panel.number}
        </span>
      </div>

      <h2 className="mt-6 text-[40px] leading-[0.95] font-medium tracking-tight text-white sm:text-[52px]">
        {panel.label}
      </h2>

      <div className="mt-6 flex flex-col gap-5 text-base leading-relaxed font-normal text-white/70 sm:text-lg">
        {panel.paragraphs.map((paragraph, i) => (
          <p key={i}>
            <RevealUpText text={paragraph} />
          </p>
        ))}
      </div>
    </div>
  );
}

export default function AboutBusinessMarketing() {
  return (
    <section
      aria-label="About: Business, Marketing"
      className="w-full border-t border-white/15 bg-black-bg"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/15 sm:px-10 lg:grid-cols-2 lg:divide-x lg:divide-y-0 lg:px-16">
        {PANELS.map((panel) => (
          <BusinessMarketingPanel key={panel.label} panel={panel} />
        ))}
      </div>

      {/* Closing CTA — sits after the 2-column panels, as the final
          element of this section, same placement/pattern as the Cta
          at the bottom of AboutFieldsAccordion.tsx. */}
      <Cta
        title="Your business transformation starts with one conversation."
        cta={{ label: "Book a Call", href: SITE_PHONE_HREF }}
      />
    </section>
  );
}
