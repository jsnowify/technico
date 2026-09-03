"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { BOTTOM_SAFE_PADDING_CLASSES } from "@/components/layout/BottomGlassBlur";
import RevealUpText from "@/components/motion/RevealUpText";
import SlidingText from "@/components/motion/SlidingText";
import SlidingIcon from "../motion/SlidingIcon";

/* ================================================================
   SERVICES CHAPTER REEL — v15 (REVEAL CARD, MATCHED TO wembi_faq_card_mockup.html)
   ================================================================
   v13 -> v14 changes:
   1. Switching tabs while the panel is OPEN no longer force-closes
      it. `goTo` used to always call `setIsOpen(false)`; now it only
      changes `activeIndex`, so an open panel stays open and just
      swaps to the new chapter's secondary content. The existing
      useGSAP effect already re-runs its word-reveal tween whenever
      `activeIndex` changes (it's in the dependency array), so the
      new chapter's words still animate in via the normal
      gsap.set(closed) -> gsap.to(open) sequence — they don't just
      snap in. Chapters with no `secondary` text (currently none —
      all four chapters have one) would just show an empty tinted
      panel if that ever changes.
   2. Card height increased since the panel content was starting to
      scroll internally at the old height.
   3. Quote and secondary paragraph font size reduced from 46px to
      36px (both the always-visible quote under the heading and the
      word-revealed secondary paragraph inside the panel).

   v14 -> v15 changes:
   4. Card height brought back down (see CARD_HEIGHT_CLASSES) — the
      36px font from change 3 needs noticeably less vertical room
      than the v14 height was sized for, so it was leaving too much
      empty space. Restored to the original pre-v14 values.
   5. Added `tracking-tight` to the quote and secondary paragraph,
      matching the letter-spacing/line-height treatment used on
      AboutStory's body copy (`text-[46px] leading-[1.15]
      tracking-tight`) — `leading-[1.15]` was already the same here,
      only `tracking-tight` was missing.
   6. ACCENT swapped from a one-off pastel purple (#9C89D9) to the
      real brand token, `var(--color-purple-accent)` (#6b26d9).
   7. PANEL_TINT/PANEL_TEXT swapped from a separate custom pastel
      pair (#F1EEFB / #3C3489) to the solid brand purple as the
      panel/footer background with white text on top
      (var(--color-purple-accent) / var(--color-white-primary)),
      matching the bg-purple-accent + white-text pattern used
      elsewhere in the codebase (AboutStory's pill, Approach's
      active tab, etc.) instead of a one-off tint.

   v15 -> v16 changes (this pass):
   8. Footer toggle label ("Read more" / "Close") now runs through
      <SlidingText>, the same hover-driven stacked-copy slide the
      chapter tabs already use — accessible name moved to the
      button's aria-label since SlidingText itself is aria-hidden.
   9. Prev/next arrow icons now run through a new sibling component,
      <SlidingIcon> (new file: components/motion/SlidingIcon.tsx) —
      same two-stacked-copies mechanic as SlidingText but on the X
      axis and rendering an icon instead of text. Each arrow slides
      the direction it points: "<" exits/enters along the left axis,
      ">" along the right axis.
   ================================================================ */

interface ChapterItem {
  title: string;
  desc: string;
}

interface ChapterData {
  id: string;
  /** Short kicker label, e.g. "Industries" — shown as "S.00X — Label". */
  label: string;
  headingLines: string[];
  quote?: string;
  secondary?: string;
  items?: ChapterItem[];
}

const CHAPTERS: ChapterData[] = [
  {
    id: "industries",
    label: "Industries",
    headingLines: ["Industries We", "Know"],
    quote:
      "Your Digital Marketing Engagement Should Give You More Than A List Of Services. Depending On Your Business\u2019s Needs, Technico Digital Solutions Can Bring Together SEO, Website Development, Content, Paid Advertising, Social Media, And Email Marketing To Align With Your Business Goals. That Can Include:",
    secondary:
      "This range gives our digital marketers experience with different goals\u2014from generating local service leads and appointment requests to supporting ecommerce sales and multi-location visibility. For a local service company, that may mean being discovered when customers search for a nearby service. For a multi-location business, it can mean building visibility across several cities without losing the relevance of each individual location. For ecommerce businesses, the focus shifts toward attracting shoppers and moving them from discovery to purchase.",
    items: [
      {
        title: "Construction & Home Services",
        desc: "Builders, renovation contractors, drywall and steel stud framing, electrical, solar, painting, fencing, decking, concrete, and other trades",
      },
      {
        title: "Healthcare & Wellness",
        desc: "Dental clinics, physiotherapy and rehabilitation, wellness, and aesthetics",
      },
      {
        title: "Legal Services",
        desc: "Personal injury and family law",
      },
      {
        title: "Automotive & Transportation",
        desc: "Car rentals, detailing, limousine, and transportation services",
      },
      {
        title: "Retail & Ecommerce",
        desc: "Online stores and multi-location retail businesses",
      },
      {
        title: "Renewable Energy & Technology",
        desc: "Solar energy and security businesses",
      },
    ],
  },
  {
    id: "canada",
    label: "Canada",
    headingLines: ["Strengthen Your Digital", "Presence Across Canada"],
    quote:
      "Our client experience extends beyond a single city, with businesses operating in markets across several Canadian provinces.",
    secondary:
      "This geographic experience is particularly relevant for businesses that want to grow from one local market into multiple service areas or manage digital visibility across several locations.",
    items: [
      { title: "Alberta", desc: "Calgary and Edmonton" },
      { title: "Manitoba", desc: "Winnipeg and surrounding markets" },
      { title: "Nova Scotia", desc: "Halifax" },
      { title: "Newfoundland and Labrador", desc: "St. John\u2019s" },
      {
        title: "British Columbia",
        desc: "Vancouver, North Vancouver, Surrey, Richmond, Burnaby, Coquitlam, Delta, Maple Ridge, Abbotsford, Chilliwack, Mission, Nanaimo, Victoria, Prince Rupert and surrounding markets",
      },
    ],
  },
  {
    id: "deliverables",
    label: "Deliverables",
    headingLines: ["What Do You Get, Working", "With Technico?"],
    quote:
      "We\u2019ve worked across industries where the customer journey, competition, and conversion goals can look very different. That experience includes:",
    items: [
      {
        title: "Research and Audits",
        desc: "To understand your current digital presence, competitors, and opportunities",
      },
      {
        title: "A Tailored Strategy",
        desc: "That prioritizes the channels relevant to your audience and goals",
      },
      {
        title: "Campaign Execution",
        desc: "Across the digital marketing services included in your engagement",
      },
      {
        title: "Content and Creative Work",
        desc: "That supports search visibility, advertising, social media, and customer engagement",
      },
      {
        title: "Ongoing Monitoring and Optimization",
        desc: "To identify what is working and where campaigns can improve",
      },
      {
        title: "Performance Reporting",
        desc: "Focused on the KPIs tied to your marketing goals",
      },
    ],
  },
  {
    id: "one-strategy",
    label: "Strategy",
    headingLines: ["One Strategy, Even If You", "Need More Than One Channel"],
    quote:
      "Technico isn\u2019t being positioned only as an SEO provider or advertising agency. Its existing services cover the wider customer journey, from helping people find a business through search and advertising to providing a website and content that support conversion, and then using social and email to continue the relationship.",
    secondary:
      "For businesses operating across several locations, that approach can also adapt to different markets rather than treating every location as identical. The result is a digital strategy built around where your customers are, how they find you, and what needs to happen next to turn that visibility into leads, bookings, or sales.",
  },
];

// Panel and footer/toggle now share ONE color, same as the mock
// where the "answer" panel and the toggle button are both #C0DD97
// — no seam when the panel is fully open.
const PANEL_TINT = "var(--color-purple-accent)"; // solid brand purple (#6b26d9) — used for BOTH panel and footer bg
const PANEL_TEXT = "var(--color-white-primary)"; // white — readable on solid PANEL_TINT, used for panel copy AND footer text/icons
const ACCENT = "var(--color-purple-accent)"; // brand purple (#6b26d9) — small dots/heading highlight, not backgrounds

// ================================================================
// TIMING — tune the open/close animation here. Grouped in one place
// instead of scattered magic numbers inside the useGSAP effect below.
// ================================================================
// Panel clip-path wipe (the green->tint block sliding up over the
// card). Duration/ease matched to the mock's own CSS transition
// (`clip-path .6s cubic-bezier(.65,0,.35,1)`), nudged slightly
// slower here so it doesn't feel abrupt next to the word rise below.
const PANEL_WIPE_DURATION = 0.7;
const PANEL_WIPE_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

// Heading blur/fade-out as the panel takes over (and fade back in on close).
const HEADING_FADE_DURATION = 0.45;
const HEADING_FADE_EASE = "power3.out";

// Secondary paragraph — word-by-word rise, driven directly by isOpen
// (NOT by RevealUpText's ScrollTrigger). RevealUpText triggers off
// scroll position, so by the time this panel is opened the words had
// already silently risen while hidden behind the clip-path — nothing
// to see when clicking "Read more". This block instead re-runs the
// same rise/fall every time isOpen (or activeIndex — see v14 note
// above) flips, so it's always in sync with the panel and with
// whichever chapter's content is currently showing. SECONDARY_OPEN_DELAY
// holds the words back until the panel wipe is mostly clear, so they
// read as landing INTO a revealed panel rather than popping in
// underneath it.
const SECONDARY_WORD_DURATION = 0.55;
const SECONDARY_WORD_STAGGER = 0.035;
const SECONDARY_WORD_EASE = "circ.out"; // same ease RevealUpText uses, for a consistent feel
const SECONDARY_OPEN_DELAY = 0.3; // opening: wait for the panel wipe to mostly clear
const SECONDARY_CLOSE_DELAY = 0; // closing: start immediately so nothing lingers after the panel snaps shut

// Fixed card height so nothing shifts switching chapters or
// opening/closing the panel. Sized to the tallest chapter —
// "Industries" has the most items (6, in a 2-col grid = 3 rows)
// plus the longest quote — with generous room around it to breathe
// rather than a tight fit; shorter chapters just get extra
// whitespace below their content instead of the card shrinking.
// Bumped up in v14 — the panel's inner content (secondary paragraph)
// was starting to scroll internally at the old height. overflow-y-auto
// is still left on as a safety net for narrow viewports where the
// quote wraps into more lines than desktop.
const CARD_HEIGHT_CLASSES = "h-[1180px] sm:h-[1100px] md:h-[1040px]";

export default function ServicesChapterReel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);
  const [hoveredReadMore, setHoveredReadMore] = useState(false);
  const [hoveredPrev, setHoveredPrev] = useState(false);
  const [hoveredNext, setHoveredNext] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const chapter = CHAPTERS[activeIndex];

  const secondaryWords = useMemo(
    () => (chapter.secondary ?? "").split(/\s+/).filter(Boolean),
    [chapter.secondary],
  );

  useGSAP(() => {
    const panel = panelRef.current;
    const heading = headingRef.current;
    const content = contentRef.current;
    if (!panel || !heading || !content) return;

    const secondaryWordEls = content.querySelectorAll<HTMLElement>(
      "[data-secondary-word]",
    );

    if (prefersReducedMotion) {
      gsap.set(panel, {
        clipPath: isOpen ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
      });
      gsap.set(heading, { opacity: isOpen ? 0 : 1, filter: "blur(0px)" });
      if (secondaryWordEls.length) {
        gsap.set(secondaryWordEls, { yPercent: 0, opacity: isOpen ? 1 : 0 });
      }
      return;
    }

    gsap.to(panel, {
      clipPath: isOpen ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
      duration: PANEL_WIPE_DURATION,
      ease: PANEL_WIPE_EASE,
      overwrite: true,
    });

    gsap.to(heading, {
      opacity: isOpen ? 0 : 1,
      filter: isOpen ? "blur(6px)" : "blur(0px)",
      duration: HEADING_FADE_DURATION,
      ease: HEADING_FADE_EASE,
      overwrite: true,
    });

    // Secondary paragraph — word-by-word, always synced to isOpen AND
    // to activeIndex (this effect re-runs on either change — see the
    // dependency array below). The closed state is (re)applied via
    // gsap.set every run so GSAP's transform cache stays the single
    // source of truth (see v13 fix note in the header comment) — this
    // also means that switching chapters while the panel is already
    // open correctly resets the NEW chapter's words to hidden first,
    // then tweens them in, instead of them just snapping into view.
    if (secondaryWordEls.length) {
      gsap.set(secondaryWordEls, { yPercent: 100, opacity: 0 });

      gsap.to(secondaryWordEls, {
        yPercent: isOpen ? 0 : 100,
        opacity: isOpen ? 1 : 0,
        duration: SECONDARY_WORD_DURATION,
        stagger: SECONDARY_WORD_STAGGER,
        delay: isOpen ? SECONDARY_OPEN_DELAY : SECONDARY_CLOSE_DELAY,
        ease: SECONDARY_WORD_EASE,
        overwrite: true,
      });
    }
  }, [isOpen, activeIndex]);

  // v14: no longer force-closes the panel on tab change. If the panel
  // is open, it stays open and the useGSAP effect above (triggered by
  // the activeIndex change) replays the reveal for the new chapter's
  // secondary content instead.
  const goTo = (index: number) => {
    setActiveIndex(
      ((index % CHAPTERS.length) + CHAPTERS.length) % CHAPTERS.length,
    );
  };

  return (
    <section
      aria-label="Services: Industries We Know, Strengthen Your Digital Presence Across Canada, What Do You Get When You Work With Technico, One Strategy Even When Your Business Needs More Than One Channel"
      className={`w-full bg-white-bg ${BOTTOM_SAFE_PADDING_CLASSES}`}
    >
      <div className="mx-auto max-w-7xl px-5 pt-24 pb-24 sm:pt-28 sm:pb-28 md:pt-32 md:pb-32">
        {/* Tabs — each fully bordered with a small gap between them
            (gap-[2px]), matching the mock exactly rather than the
            merged-border look. Big N°0X label, active tab marked
            with an accent dot. */}
        <div className="flex gap-[2px]">
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => goTo(i)}
              onPointerEnter={() => setHoveredTabIndex(i)}
              onPointerLeave={() =>
                setHoveredTabIndex((current) =>
                  current === i ? null : current,
                )
              }
              aria-current={i === activeIndex}
              aria-label={`Go to ${c.label}`}
              className={`flex flex-1 items-center gap-2 border border-black-text/15 px-5 py-4 text-xl font-medium text-black-text sm:text-2xl ${
                i === activeIndex ? "bg-white-bg" : "bg-black-text/[0.03]"
              }`}
            >
              {i === activeIndex && (
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: ACCENT }}
                />
              )}
              <SlidingText
                text={`S . ${c.label}`}
                isHovered={hoveredTabIndex === i}
              />
            </button>
          ))}
        </div>

        {/* Card — fixed height (see CARD_HEIGHT_CLASSES), so
            switching chapters or opening/closing the panel never
            shifts the page. */}
        <div
          className={`relative flex flex-col overflow-hidden border border-t-0 border-black-text/15 bg-white-bg ${CARD_HEIGHT_CLASSES}`}
        >
          {/* Content area — clips both the heading (flow) and the
              reveal panel (absolute inset-0) to the same rectangle,
              leaving the footer bar below as a fixed-height sibling. */}
          <div className="relative flex-1 overflow-hidden">
            <div className="relative z-[1] flex h-full flex-col overflow-y-auto px-10 pt-14 pb-8">
              <div className="mb-2 flex items-center gap-2">
                <RevealUpText
                  key={`kicker-${chapter.id}`}
                  text={`S.${String(activeIndex + 1).padStart(3, "0")} — Technico Digital Solutions`}
                  as="span"
                  className="text-[13px] font-medium text-black-text"
                />
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: ACCENT }}
                />
              </div>
              <div className="mb-10 h-px w-full bg-black-text/15" />

              <h1
                ref={headingRef}
                className="m-0 text-[46px] leading-[1.15] font-medium text-black-text"
              >
                {chapter.headingLines.map((line, i) => (
                  <span
                    key={`${chapter.id}-${line}`}
                    className="block"
                    style={
                      i === chapter.headingLines.length - 1
                        ? { color: ACCENT }
                        : undefined
                    }
                  >
                    <RevealUpText
                      key={`${chapter.id}-${line}-reveal`}
                      text={line}
                      as="span"
                      className="block"
                    />
                  </span>
                ))}
              </h1>

              {/* Quote — always visible, right under the heading.
                  Only the secondary paragraph lives behind the
                  "Read more" reveal panel now. Font size dropped to
                  36px in v14 (was 46px). */}
              {chapter.quote && (
                <RevealUpText
                  key={`quote-${chapter.id}`}
                  text={chapter.quote}
                  as="p"
                  className="m-0 mt-10 text-[36px] leading-[1.15] tracking-tight font-normal text-black-text/85"
                />
              )}

              {/* Items — always visible, filling the empty space
                  below the heading/quote. Only rendered for chapters
                  that have them; the reveal panel still covers this
                  same area when "Read more" is opened. */}
              {chapter.items && (
                <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2">
                  {chapter.items.map((item) => (
                    <div key={item.title} className="flex flex-col gap-2">
                      <RevealUpText
                        key={`${chapter.id}-${item.title}-title`}
                        text={item.title}
                        as="p"
                        className="text-[14px] font-medium text-black-text"
                      />
                      <RevealUpText
                        key={`${chapter.id}-${item.title}-desc`}
                        text={item.desc}
                        as="p"
                        className="text-[14px] leading-relaxed font-normal text-black-text/70"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reveal panel — clip-path animated in useGSAP above,
                matching the mock's inset(100% 0 0 0) -> inset(0 0 0
                0) tween, now with the mock's own cubic-bezier ease.
                Background now matches the footer/toggle bar
                (PANEL_TINT) so opening it reads as one seamless
                color block, same as the mock's shared #C0DD97.
                Pointer events are only enabled while open, so the
                panel never blocks clicks on the heading beneath it
                while closed. */}
            <div
              ref={panelRef}
              className={`absolute inset-0 z-[2] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
              style={{ background: PANEL_TINT, clipPath: "inset(100% 0 0 0)" }}
            >
              <div
                ref={contentRef}
                className="h-full overflow-y-auto px-10 pt-14 pb-24"
              >
                {chapter.secondary && (
                  <div
                    className="text-[36px] leading-[1.15] tracking-tight font-normal"
                    style={{ color: PANEL_TEXT, opacity: 0.85 }}
                  >
                    <p className="m-0">
                      {secondaryWords.map((word, i) => (
                        <Fragment key={`${chapter.id}-sec-${i}`}>
                          <span className="inline-block overflow-hidden align-baseline">
                            {/*
                              Closed state is applied by GSAP itself
                              (gsap.set in useGSAP above) so its
                              transform cache and the subsequent
                              yPercent tween stay in sync — see v13
                              fix note in the header comment.
                            */}
                            <span data-secondary-word className="inline-block">
                              {word}
                            </span>
                          </span>
                          {i < secondaryWords.length - 1 ? " " : ""}
                        </Fragment>
                      ))}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer bar — toggle + prev/next, gap-[2px] between
              segments (a thin background-colored seam, same as the
              mock's border-left: 2px solid var(--surface-2)) rather
              than a visible divider line. Background switched to
              PANEL_TINT (matches the panel — see above) and text/
              icon color switched from white to PANEL_TEXT to stay
              readable on the now-lighter background, mirroring the
              mock's dark-green-on-light-green button styling.

              Toggle label now runs through <SlidingText>, same
              hover-driven stacked-copy slide the chapter tabs use —
              the accessible name lives on the button's aria-label,
              SlidingText itself is aria-hidden. Prev/next icons run
              through the new <SlidingIcon>, the same mechanic on the
              X axis: the "<" slides left on hover, the ">" slides
              right — each arrow slides the way it points. */}
          <div className="relative z-[3] flex gap-[2px]">
            <button
              type="button"
              onClick={() => setIsOpen((v) => !v)}
              onPointerEnter={() => setHoveredReadMore(true)}
              onPointerLeave={() => setHoveredReadMore(false)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close" : "Read more"}
              className="flex-1 py-4 text-left text-sm font-medium"
              style={{ background: PANEL_TINT, color: PANEL_TEXT }}
            >
              <span className="px-8">
                <SlidingText
                  text={isOpen ? "Close" : "Read more"}
                  isHovered={hoveredReadMore}
                />
              </span>
            </button>
            <button
              type="button"
              aria-label="Previous chapter"
              onClick={() => goTo(activeIndex - 1)}
              onPointerEnter={() => setHoveredPrev(true)}
              onPointerLeave={() => setHoveredPrev(false)}
              className="flex w-14 items-center justify-center"
              style={{ background: PANEL_TINT, color: PANEL_TEXT }}
            >
              <SlidingIcon
                isHovered={hoveredPrev}
                direction="left"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M15 5l-7 7 7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </button>
            <button
              type="button"
              aria-label="Next chapter"
              onClick={() => goTo(activeIndex + 1)}
              onPointerEnter={() => setHoveredNext(true)}
              onPointerLeave={() => setHoveredNext(false)}
              className="flex w-14 items-center justify-center"
              style={{ background: PANEL_TINT, color: PANEL_TEXT }}
            >
              <SlidingIcon
                isHovered={hoveredNext}
                direction="right"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <path
                      d="M9 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
