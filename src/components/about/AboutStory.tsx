/* ================================================================
   ABOUT STORY
   ================================================================
   Second section of the About page. Reworked from the previous
   alternating sticky-image/text rows into an editorial, image-free
   layout modeled on a reference design (HackFirst-style About):

     1. A "hero" block per chapter — tag pill ("// LABEL"), a large
        chapter-label headline, and that chapter's first paragraph
        as the intro line. Matches the reference's tight, top-
        anchored spacing: pill sits close to the heading, heading
        sits close to the intro paragraph — no divider/hairline
        above the pill.
     2. A caption row underneath, separated from the hero block by
        a larger gap (this is where the reference puts its
        breathing room, not above the pill) — a short, all-caps
        two-line label on the left (derived from the chapter's own
        copy, no invented content) paired with the chapter's
        remaining paragraph(s) on the right, in a fixed-width-label
        / flexible-body grid.

   HORIZONTAL POSITION: the reference doesn't hug the left edge
   with a normal container gutter — the whole block sits inset from
   the left by roughly 30% of the viewport on large screens, reading
   as intentionally placed rather than full-bleed-left like a
   default site container. Mobile/tablet keep the normal, smaller
   gutter (there's no room to indent 30% on a phone); the larger
   left inset only kicks in from `lg` up, paired with a
   comparatively smaller right gutter so the text column doesn't get
   pushed too narrow.

   CHAPTER DIVIDER: a 0.5px horizontal hairline (`bg-white/15`) sits
   between chapters (never above the first one), with two small "+"
   cross marks along it — echoing the thin rule-with-"+"-marks
   treatment at the bottom of the reference design, applied here as
   a between-chapter separator instead. On `lg`/`xl`, where the
   section's own left padding insets the content by 22%/26%, the
   divider cancels that inset with a matching negative left margin
   plus an equal width increase (`-ml-[22%] w-[calc(100%+22%)]`,
   `xl:-ml-[26%] xl:w-[calc(100%+26%)]`) so it reaches the true left
   edge of the content container while its right edge stays put —
   rather than a viewport-width (`100vw`) breakout, which depends on
   no ancestor clipping the overflow and turned out unreliable here.

   The "A . 00X" kicker + hairline divider used in an earlier
   version (as an opener above each chapter's pill) isn't part of
   the reference's per-chapter rhythm, so it's been removed from
   there. Chapters are separated from each other purely by the
   larger outer gap between them.

   No sticky/video column, so no ScrollTrigger/JS is needed for
   layout — it's a normal top-to-bottom flex column on every
   breakpoint.

   TAG PILL: the "// LABEL" marker is now a filled solid pill (the
   chapter's accent color as the background) with white text, rather
   than a transparent/outlined pill with accent-colored text.

   PARAGRAPH TYPOGRAPHY: both the hero intro paragraph and the
   caption row's body paragraph(s) use a tighter `leading-snug` line
   height and `tracking-tight` letter spacing, instead of the looser
   `leading-relaxed` / default tracking used before.

   MOTION — swapped relative to how ServicesMarketOverview pairs
   these two (there, RevealUpText is on the big headings and
   ScrollFillText's accent sweep is on the small captions
   underneath). Here it's the opposite, per chapter:
     - The short left-hand LABEL (caption) uses ScrollFillText in
       `accent` mode — each word dim, then a purple/pink sweep,
       then settles solid white, same scroll-tied fill as the rest
       of the site.
     - The PARAGRAPHS (the hero intro line and the caption row's
       body copy) use RevealUpText — word-by-word rise-in-from-
       below-a-mask, replaying on restart/reverse as the row
       crosses its trigger.
   Both components already collapse cleanly under prefers-reduced-
   motion (straight to the settled state), so content stays correct
   and crawlable by construction either way — same "content first,
   animation second" rule as consideration.md.
   ================================================================ */

import ScrollFillText from "@/components/motion/ScrollFillText";
import RevealUpText from "@/components/motion/RevealUpText";
import Cta from "@/components/ui/CTA";
import { SITE_PHONE_HREF } from "@/lib/constants";

interface StoryChapter {
  number: string;
  label: string;
  /** Short, two-line all-caps caption shown left of the body copy
   *  in each chapter's row — kept separate from `paragraphs` so it
   *  can be a punchier fragment rather than a full sentence. */
  caption: string[];
  paragraphs: string[];
  /** Accent used for the tag pill background and the ScrollFillText sweep. */
  accent: "purple" | "pink";
}

const STORY: StoryChapter[] = [
  {
    number: "001",
    label: "About",
    accent: "purple",
    caption: ["DATA-DRIVEN.", "RESULTS-DRIVEN."],
    paragraphs: [
      "We focus on building online visibility and creating long-term growth for brands like yours.",
      "With our data-driven approach and modern digital marketing tactics, we make sure your strategies hit the mark every time. Forget generic solutions, our digital marketers deliver strategies that actually work.",
    ],
  },
  {
    number: "002",
    label: "Mission",
    accent: "pink",
    caption: ["SEEN, HEARD,", "REMEMBERED."],
    paragraphs: [
      "We help businesses grow by leveraging digital marketing channels that connect with target audiences. No fluff, just smart, innovative marketing strategies that hit the right message. Our goal? To simplify digital growth and make it accessible and effective for every client.",
      "Our team at Technico Digital Solutions believes in strategy that scales, creativity that connects, and marketing that makes an impact. By tapping into the right digital marketing tactics, we increase brand awareness and help you reach potential customers for your business expansion.",
    ],
  },
  {
    // Adapted from the "Approach" field's copy in
    // AboutFieldsAccordion.tsx — same wording, reshaped from that
    // component's heading + bullet-list + linked-paragraph content
    // into this section's flat intro-paragraph / caption-row-
    // paragraph shape (no JSX/links here, so the inline SERP link
    // is folded into plain text; nothing invented).
    number: "003",
    label: "Approach",
    accent: "purple",
    caption: ["STRATEGY FIRST,", "CONSISTENT EXECUTION."],
    paragraphs: [
      "Our approach starts with discovering important customer behaviours and analyzing trends to stay ahead of the curve, building integrated campaigns across SEO, social, design, and content that speak directly to your target, and measuring success through web analytics, key performance indicators (KPIs), and transparent reporting, so you always know where your business stands.",
      "Our digital marketing positions your brand on top of search engine results pages (SERPs) and social media channels. We fine-tune campaigns to build brand awareness. It's all about results, not just reach.",
    ],
  },
];

// Per-chapter accent — tag pill fill color and ScrollFillText sweep
// color, so About reads purple and Mission reads pink, distinct
// from the site-wide `--color-purple-accent` brand token used solid
// elsewhere.
const ACCENT_BG: Record<StoryChapter["accent"], string> = {
  purple: "bg-purple-accent",
  pink: "bg-pink-accent",
};

const ACCENT_FILL_COLOR: Record<StoryChapter["accent"], string> = {
  purple: "#8B5CF6",
  pink: "#F472B6",
};

export default function AboutStory() {
  return (
    <section
      aria-label="About: About, Mission, Approach"
      className="relative w-full bg-black-bg"
    >
      <div className="w-full px-5 pt-12 pb-24 sm:pt-14 sm:pb-32 sm:px-10 md:pt-16 md:px-16 lg:pt-20 lg:pr-16 lg:pl-[22%] xl:pr-24 xl:pl-[26%]">
        <div className="flex flex-col gap-20 sm:gap-24">
          {STORY.map((chapter, index) => (
            <div
              key={chapter.label}
              className="flex flex-col gap-16 sm:gap-20 lg:gap-24"
            >
              {/* Chapter divider — a 0.5px hairline with two small
                  "+" cross marks along it, echoing the thin
                  scroll-bar-style rule (with its own "+" marks) at
                  the bottom of the reference design. Only rendered
                  between chapters, never above the first one. The
                  negative left margin + matching width increase on
                  lg/xl cancels this section's own left inset so the
                  hairline reaches the container's true left edge
                  (its right edge stays where it already was). */}
              {index > 0 && (
                <div
                  aria-hidden="true"
                  className="relative h-[0.5px] w-full bg-white/15 lg:-ml-[22%] lg:w-[calc(100%+22%)] xl:-ml-[26%] xl:w-[calc(100%+26%)]"
                >
                  <span className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-white/40 select-none">
                    +
                  </span>
                  <span className="absolute top-1/2 left-[70%] -translate-x-1/2 -translate-y-1/2 font-mono text-xs text-white/40 select-none">
                    +
                  </span>
                </div>
              )}
              {/* Hero block — tag pill, big headline, intro line.
                  Spacing here is tight (gap-3/4) to match the
                  reference: pill hugs the heading, heading hugs
                  the intro paragraph. No divider above the pill. */}
              <div className="flex flex-col gap-3 sm:gap-4">
                <span
                  className={`inline-block w-fit px-3 py-1.5 font-mono text-xs tracking-[0.14em] text-white uppercase ${ACCENT_BG[chapter.accent]}`}
                >
                  {"// "}
                  {chapter.label}
                </span>

                <h2 className="text-[56px] leading-[0.95] font-medium tracking-tight text-white sm:text-[80px] md:text-[96px]">
                  {chapter.label}
                </h2>

                {chapter.paragraphs[0] && (
                  <p className="max-w-2xl text-base leading-snug tracking-tight font-normal text-white/70 sm:text-lg">
                    <RevealUpText text={chapter.paragraphs[0]} />
                  </p>
                )}
              </div>

              {/* Caption / body row — short left-hand label paired
                  with the chapter's remaining paragraph(s). This is
                  where the reference's larger breathing room sits
                  (the gap above, on the parent), not above the
                  pill. Fixed label column on desktop, stacks on
                  mobile. */}
              {chapter.paragraphs.length > 1 && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:gap-16">
                  <div className="font-mono text-sm leading-relaxed tracking-wide text-white uppercase sm:text-base">
                    {chapter.caption.map((line) => (
                      <div key={line}>
                        <ScrollFillText
                          text={line}
                          accent
                          accentColor={ACCENT_FILL_COLOR[chapter.accent]}
                          finalColor="var(--color-white-primary)"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex max-w-2xl flex-col gap-6 text-lg leading-snug tracking-tight font-normal text-white/80 sm:text-xl">
                    {chapter.paragraphs.slice(1).map((paragraph, i) => (
                      <p key={i}>
                        <RevealUpText text={paragraph} />
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Closing CTA — sits after the last chapter, as the final
          element of the section. Same placement/usage as the one at
          the bottom of AboutFieldsAccordion.tsx, reusing its
          purple-tagged default rather than passing a redundant
          accent here. */}
      <Cta
        title="Take your brand to the next level"
        description="Our team of experts will help you connect with the right audience and grow your business."
        cta={{ label: "Free Strategy", href: SITE_PHONE_HREF }}
      />
    </section>
  );
}
