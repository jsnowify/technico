/* ================================================================
   ABOUT STORY
   ================================================================
   Second section of the About page. Editorial, wide-format layout.
   Each chapter — number, label, body paragraphs — is its own row
   with its own image, and the rows alternate sides: chapter 1 is
   image-left/text-right, chapter 2 is text-left/image-right, and
   so on.

   Each chapter carries an `accent` used only to color its
   number/label pill (About → purple, Mission → pink). The section
   itself stays on the plain page background throughout — no
   full-bleed colored panels. All paragraphs (including what used
   to be a styled "intro" line) share one plain treatment now —
   no special-cased emphasis line.

   The image is sticky on desktop: it pins in place while the
   paragraphs for that chapter scroll past, and releases once the
   row's content (its tallest column, i.e. the text) reaches its
   end — standard flex + sticky behavior, no ScrollTrigger/JS
   needed. On small screens every row collapses to a single column
   (image on top, text below) and stickiness is disabled, since
   there's nothing to scroll past in a single-column layout.

   Body paragraphs use ScrollFillText in `accent` mode: each word
   starts dim and, as the row scrolls through the viewport, flashes
   purple mid-fill before settling to solid black — same scroll-tied
   fill as the rest of the site, with a bit of purple sparkle on top.
   Reduced-motion collapses this straight to full-opacity black text
   (handled inside ScrollFillText), so content is still correct and
   crawlable by construction, per the "content first, animation
   second" rule in consideration.md.
   ================================================================ */

import ScrollFillText from "@/components/motion/ScrollFillText";

interface StoryChapter {
  number: string;
  label: string;
  paragraphs: string[];
  /** Accent used for the number/label pill. */
  accent: "purple" | "pink";
}

const STORY: StoryChapter[] = [
  {
    number: "01",
    label: "About",
    accent: "purple",
    paragraphs: [
      "We focus on building online visibility and creating long-term growth for brands like yours.",
      "With our data-driven approach and modern digital marketing tactics, we make sure your strategies hit the mark every time. Forget generic solutions, our digital marketers deliver strategies that actually work.",
    ],
  },
  {
    number: "02",
    label: "Mission",
    accent: "pink",
    paragraphs: [
      "Our Mission \u2014 To Make Every Business Seen, Heard, and Remembered.",
      "We help businesses grow by leveraging digital marketing channels that connect with target audiences. No fluff, just smart, innovative marketing strategies that hit the right message. Our goal? To simplify digital growth and make it accessible and effective for every client.",
      "Our team at Technico Digital Solutions believes in strategy that scales, creativity that connects, and marketing that makes an impact. By tapping into the right digital marketing tactics, we increase brand awareness and help you reach potential customers for your business expansion.",
    ],
  },
];

const ACCENT_PILL_BG: Record<StoryChapter["accent"], string> = {
  purple: "bg-purple-accent",
  pink: "bg-pink-accent",
};

export default function AboutStory() {
  return (
    <section aria-label="About: About, Mission" className="w-full bg-white-bg">
      <div className="w-full px-5 pt-12 pb-24 sm:pt-14 sm:pb-32 md:pt-16">
        {/* Kicker row — same mirrored-label header as
            services/ServicesMarketOverview.tsx's "S.001 / Overview /
            S.001" strip (same index left and right, section name
            centered), using "A.001" for the About page. */}
        <div className="mb-10 flex items-center justify-between gap-6 sm:mb-12 md:mb-14">
          <span className="font-mono text-xs tracking-[0.14em] text-black-text/50 uppercase sm:text-sm">
            A.001
          </span>
          <span className="font-mono text-xs tracking-[0.14em] text-black-text/50 uppercase sm:text-sm">
            Story
          </span>
          <span className="font-mono text-xs tracking-[0.14em] text-black-text/50 uppercase sm:text-sm">
            A.001
          </span>
        </div>

        <div className="flex flex-col gap-24">
          {STORY.map((chapter, ci) => (
            <div
              key={chapter.label}
              className={`flex flex-col gap-10 lg:items-start lg:gap-16 ${
                ci % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              {/* Image — alternates sides per chapter via the
                row-reverse above. Sticky on desktop only: pins at
                `lg:top-24` and holds position while the sibling
                text column (taller, since it has the body
                paragraphs) scrolls past. It naturally lets go once
                the row itself ends, i.e. once the last paragraph of
                this chapter has passed — no manual scroll math
                needed, that's just how sticky + a taller sibling in
                the same flex row behaves. Tune `lg:top-24` to match
                the sticky header's actual height. Plain placeholder
                box stands in for the real image/video for now. */}
              <div className="lg:sticky lg:top-24 lg:w-[42%] lg:flex-shrink-0">
                <video
                  className="aspect-[3/4] w-full bg-black-text/10 object-cover"
                  src="https://res.cloudinary.com/dp9bjis3z/video/upload/f_auto,q_auto:best/v1788415571/videos/technico-about_qkthtx.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>

              {/* Copy */}
              <div className="flex flex-col gap-10 lg:flex-1">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-6">
                    <span className="text-6xl font-medium tracking-tight text-black-text sm:text-7xl">
                      {chapter.number}
                    </span>
                    <span className="h-px flex-1 bg-black-text/15" />
                  </div>
                  <div className="flex items-center gap-6">
                    <span
                      className={`inline-block px-5 py-2 text-[28px] leading-none font-medium tracking-tight text-white-primary sm:text-[104px] ${ACCENT_PILL_BG[chapter.accent]}`}
                    >
                      {chapter.label}
                    </span>
                    <span className="h-px flex-1 bg-black-text/15" />
                  </div>
                </div>

                <div className="max-w-2xl space-y-6 text-[46px] leading-[1.15] tracking-tight text-black-text">
                  {chapter.paragraphs.map((paragraph, i) => (
                    <p key={i}>
                      <ScrollFillText text={paragraph} accent />
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
