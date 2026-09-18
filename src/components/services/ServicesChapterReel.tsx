"use client";

import { useId, useState } from "react";
import GeometricIcon from "@/components/ui/icons";

/* ================================================================
   SERVICES CHAPTER STACK — v19 (STACKED-CARD ACCORDION)
   ================================================================
   Replaces the old "scroll past four fully-expanded sections"
   layout with a single-open accordion styled as a loose stack of
   index cards: each chapter is a colored tab (its heading, always
   visible) sitting slightly rotated and overlapped behind the next
   one — like a hand of cards fanned downward, so every title peeks
   out even while closed. Clicking a tab straightens it, lifts it to
   the front (z-index + shadow), and drops open a dark content panel
   underneath with that chapter's full material. Closing it lets the
   tab settle back into the stack.

   The four colored tabs (white / pink / purple / dark) are the same
   rotation IndustryCard/PillarCard already use elsewhere on this
   page — carried over here so the stack reads as part of the same
   system rather than a new palette invented for this one section.
   Content panels stay on the page's own dark bg regardless of which
   tab opens them, so IndustryCard/RegionRow/ProcessStep below don't
   need reworking for light-card contrast.
   ================================================================ */

interface ChapterItem {
  title: string;
  desc: string;
}

interface ChapterData {
  id: string;
  /** Short kicker label, e.g. "Industries" — shown above the tab heading. */
  label: string;
  headingLines: string[];
  quote?: string;
  secondary?: string;
  items?: ChapterItem[];
}

const CHAPTERS: ChapterData[] = [
  {
    id: "industries",
    label: "Industries We Serve",
    headingLines: ["Industries We", "Know"],
    quote:
      "Your digital marketing engagement should give you more than a list of services. Depending on your business's needs, Technico Digital Solutions can bring together SEO, website development, content, paid advertising, social media, and email marketing to align with your business goals. That can include:",
    secondary:
      "This range gives our digital marketers experience with different goals — from generating local service leads and appointment requests to supporting ecommerce sales and multi-location visibility. For a local service company, that may mean being discovered when customers search for a nearby service. For a multi-location business, it can mean building visibility across several cities without losing the relevance of each individual location. For ecommerce businesses, the focus shifts toward attracting shoppers and moving them from discovery to purchase.",
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
    label: "Where We Work",
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
    label: "What You Get",
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
    label: "One Strategy",
    headingLines: ["One Strategy, Even If You", "Need More Than One Channel"],
    quote:
      "Technico isn\u2019t being positioned only as an SEO provider or advertising agency. Its existing services cover the wider customer journey, from helping people find a business through search and advertising to providing a website and content that support conversion, and then using social and email to continue the relationship.",
    secondary:
      "For businesses operating across several locations, that approach can also adapt to different markets rather than treating every location as identical. The result is a digital strategy built around where your customers are, how they find you, and what needs to happen next to turn that visibility into leads, bookings, or sales.",
  },
];

const ACCENT = "var(--color-purple-accent)"; // Home-derived brand purple
const PANEL_EASE = "ease-[cubic-bezier(0.77,0,0.175,1)]";
// Springy, slight-overshoot curve for hover/press feedback — mimics a
// tactile "click" rather than a flat linear/eased move, so hovers and
// taps feel like they have a bit of resistance and snap-back to them.
const SPRING_EASE = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";

// Same light/pink/purple/dark rotation as ServicePillarCards, so the
// stack reads as part of the same design system rather than a
// one-off palette invented just for this section.
const TAB_STYLES = [
  { bg: "bg-white-bg", text: "text-black-text", faint: "bg-black/10", icon: 0 },
  {
    bg: "bg-pink-accent",
    text: "text-black-text",
    faint: "bg-black/10",
    icon: 6,
  },
  {
    bg: "bg-purple-accent",
    text: "text-white",
    faint: "bg-white/15",
    icon: 13,
  },
  { bg: "bg-[#1A1A1A]", text: "text-white", faint: "bg-white/10", icon: 1 },
];

// Fixed, deliberate tilt per closed tab — not randomized, so the
// stack looks the same "tossed into place" way on every load instead
// of jittering between renders. Straightens to 0 the moment a tab
// opens (see isOpen check at the call site). Only kicks in from sm
// up — on small screens the tabs stay flat, separated cards instead
// of a fanned, overlapping stack (harder to read on narrow screens).
/** Diagonal-arrow toggle, same treatment as the site's FAQ accordion
 *  (circle badge, rotates 180° open->closed) recolored to whichever
 *  tab it sits on. */
function ToggleGlyph({
  isOpen,
  faintBg,
  textClass,
}: {
  isOpen: boolean;
  faintBg: string;
  textClass: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-500 sm:h-11 sm:w-11 ${SPRING_EASE} ${faintBg} ${
        isOpen ? "rotate-180" : "rotate-0 group-hover:scale-110"
      } group-active:scale-90`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`h-4 w-4 ${textClass}`}
      >
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </span>
  );
}

/** Industries card — same colors/icon/index treatment as
 *  ServicePillarCards, always-expanded (no per-card accordion here;
 *  the accordion behavior now lives one level up, on the chapter
 *  tabs themselves). */
function IndustryCard({ item, index }: { item: ChapterItem; index: number }) {
  const style = TAB_STYLES[index % TAB_STYLES.length];
  return (
    <div
      className={`flex h-full min-h-[280px] flex-col border border-white/15 p-7 sm:min-h-[300px] sm:p-8 ${style.bg} ${style.text}`}
    >
      <GeometricIcon index={style.icon} className="h-8 w-8" />
      <span className="mt-6 block text-sm font-medium opacity-60">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-2 text-[22px] leading-snug font-medium tracking-heading">
        {item.title}
      </h3>
      <p className="mt-3 text-[16px] leading-relaxed font-light tracking-body opacity-80">
        {item.desc}
      </p>
    </div>
  );
}

function RegionRow({ item, index }: { item: ChapterItem; index: number }) {
  return (
    <div className="flex gap-4 border-b border-white/15 p-5 last:border-b-0">
      <span
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-sm font-medium text-white/35"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div>
        <h4 className="text-[22px] leading-snug font-medium tracking-heading text-white">
          {item.title}
        </h4>
        <p className="mt-1 text-[16px] leading-relaxed font-light tracking-body text-white/60">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

function ProcessStep({
  item,
  index,
  isLast,
}: {
  item: ChapterItem;
  index: number;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-6 pb-8 last:pb-0">
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute top-9 left-[15px] h-[calc(100%-2.25rem)] w-px bg-white/15"
        />
      )}
      <span
        aria-hidden="true"
        className="relative z-1 flex h-8 w-8 shrink-0 items-center justify-center text-xs font-medium text-white"
        style={{ background: ACCENT }}
      >
        {index + 1}
      </span>
      <div className="pt-0.5">
        <h4 className="text-[22px] leading-snug font-medium tracking-heading text-white">
          {item.title}
        </h4>
        <p className="mt-1 max-w-xl text-[16px] leading-relaxed font-light tracking-body text-white/60">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

/** One chapter's expanded content — the same three body layouts the
 *  old always-open reel used (industry grid / region list / numbered
 *  steps), plus the plain quote+secondary closing statement for
 *  "One Strategy" which has no `items` at all. */
function ChapterBody({ chapter }: { chapter: ChapterData }) {
  const isSteps = chapter.id === "deliverables";
  const isRegions = chapter.id === "canada";
  const isClosing = !chapter.items;

  return (
    <div>
      {chapter.quote && (
        <p className="text-left indent-16 text-[18px] leading-relaxed font-light tracking-body text-white/60">
          {chapter.quote}
        </p>
      )}

      {chapter.items && (
        <div
          className={
            isSteps || isRegions
              ? "mt-8"
              : "mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          }
        >
          {isSteps &&
            chapter.items.map((item, i) => (
              <ProcessStep
                key={item.title}
                item={item}
                index={i}
                isLast={i === chapter.items!.length - 1}
              />
            ))}
          {isRegions && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {chapter.items.map((item, i) => (
                <RegionRow key={item.title} item={item} index={i} />
              ))}
            </div>
          )}
          {!isSteps &&
            !isRegions &&
            chapter.items.map((item, i) => (
              <IndustryCard key={item.title} item={item} index={i} />
            ))}
        </div>
      )}

      {chapter.secondary && (
        <p
          className={`text-left indent-16 text-[18px] leading-relaxed font-light tracking-body text-white/50 ${
            isClosing ? "mt-4" : "mt-8"
          }`}
        >
          {chapter.secondary}
        </p>
      )}
    </div>
  );
}

function ChapterTab({
  chapter,
  index,
  isOpen,
  onToggle,
}: {
  chapter: ChapterData;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const style = TAB_STYLES[index % TAB_STYLES.length];
  const reactId = useId();
  const panelId = `chapter-panel-${reactId}`;
  const buttonId = `chapter-heading-${reactId}`;

  return (
    <div className={`group relative overflow-hidden ${style.bg}`}>
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 border-b border-black/15 p-5 text-left sm:gap-6 sm:p-7 md:p-8"
      >
        <span
          aria-hidden="true"
          className={`hidden text-sm font-medium opacity-50 sm:block ${style.text}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={`block font-mono text-xs tracking-[0.16em] uppercase opacity-60 ${style.text}`}
          >
            {chapter.label}
          </span>
          <span
            className={`mt-1 block text-[22px] leading-[1.15] font-medium tracking-heading sm:text-[28px] md:text-[32px] ${style.text}`}
          >
            {chapter.headingLines.join(" ")}
          </span>
        </span>

        <ToggleGlyph
          isOpen={isOpen}
          faintBg={style.faint}
          textClass={style.text}
        />
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid bg-black-bg transition-[grid-template-rows,opacity] duration-700 motion-reduce:transition-none ${PANEL_EASE} ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pt-8 pb-10 sm:px-8 md:px-10 md:pb-12">
            <ChapterBody chapter={chapter} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesChapterReel() {
  // Single-open accordion — first tab starts open so there's
  // something to read the moment the section scrolls into view,
  // same first-open-by-default behavior as ServicePillarCards.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleChapter = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section
      aria-label="Services: Industries We Know, Strengthen Your Digital Presence Across Canada, What Do You Get When You Work With Technico, One Strategy Even When Your Business Needs More Than One Channel"
      className="w-full bg-black-bg"
    >
      <div className="container-x mx-auto w-full max-w-[1920px] section-y">
        <header className="grid grid-cols-1 gap-5 border-t border-white/20 pt-5 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
          <div className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-white/50 uppercase sm:pt-1 sm:text-xs">
            <span aria-hidden="true">/</span>
            <span>Built around you</span>
          </div>
          <h2 className="h2-section max-w-[21ch] leading-[1.08] font-medium tracking-heading text-white">
            One connected strategy across industries, markets, and channels.
          </h2>
        </header>

        <div className="mt-8 grid gap-px overflow-hidden border border-white/15 bg-white/15 lg:mt-10">
          {CHAPTERS.map((chapter, i) => (
            <ChapterTab
              key={chapter.id}
              chapter={chapter}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggleChapter(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
