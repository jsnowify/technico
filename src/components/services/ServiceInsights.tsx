"use client";
import { useState } from "react";
import Image from "next/image";
interface ServiceInsightsItem {
  title: string;
  description: string;
  /** Optional substring of `description` that renders as an external
   * link — same substring-match technique as ServiceIntroPanel's
   * paragraph `link` field. */
  link?: { label: string; href: string };
}
interface ServiceInsightsProps {
  image?: { src: string; alt: string };
  headline: string;
  intro: string;
  /** Optional substring of `intro` that renders as an external link. */
  introLink?: { label: string; href: string };
  items: ServiceInsightsItem[];
  closingParagraph?: string;
}

/** Renders `text` as plain text, with `link.label` (an exact
 * substring of `text`) swapped for an external link — opens in a new
 * tab since these point to outside sources (research, other sites),
 * not internal pages. Same substring-match approach as
 * ServiceIntroPanel's renderParagraph. */
function renderWithLink(text: string, link?: { label: string; href: string }) {
  if (!link) return text;

  const idx = text.indexOf(link.label);
  if (idx === -1) return text;

  return (
    <>
      {text.slice(0, idx)}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white underline decoration-1 underline-offset-4 hover:text-white/80"
      >
        {link.label}
      </a>
      {text.slice(idx + link.label.length)}
    </>
  );
}
/**
 * ServiceInsights
 * -----------------------------------------------------------------
 * Renders after the closing Cta on /services/[slug] (see
 * services_insights_section.png): a photo on the left, a headline +
 * intro paragraph on the right, then an accordion of items, and a
 * closing paragraph underneath.
 *
 * Accordion styling matches ServiceFAQ.tsx exactly: each item is its
 * own rounded #1A1B1E panel (not a border-b divider list), with a
 * circular white/10 button holding the same diagonal-arrow glyph used
 * by Button.tsx's purple CTA, rotating 180deg open->closed. The open
 * description renders justified, same as ServiceFAQ's answer text.
 *
 * All items start closed (no item forced open on load), and only one
 * item is open at a time — opening a new one closes whatever was
 * previously open, and clicking the open item closes it — same
 * toggle behavior as ServiceFAQ.
 *
 * The expand/collapse reuses MobileNav's own disclosure trick
 * (`grid-rows-[0fr]` -> `grid-rows-[1fr]` + overflow-hidden, same
 * cubic-bezier easing).
 *
 * The photo is clipped to a custom cut-corner card shape (bottom-right
 * corner beveled) via an SVG clipPath defined in objectBoundingBox
 * units, so it scales with the container instead of being tied to a
 * fixed pixel size. It's set taller (aspect-[3/4]) than the previous
 * 4:5 crop so the photo reads bigger next to the copy column.
 */
const PHOTO_CLIP_ID = "service-insights-photo-clip";
const PANEL_EASE = "ease-[cubic-bezier(0.77,0,0.175,1)]";

function InsightAccordionCard({
  item,
  isOpen,
  onToggle,
}: {
  item: ServiceInsightsItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[28px] bg-[#1A1B1E]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 p-7 text-left sm:p-8"
      >
        <span className="text-[24px] leading-snug font-medium tracking-tight text-white">
          {item.title}
        </span>
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 sm:h-10 sm:w-10 ${PANEL_EASE} ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-white"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
      </button>

      <div
        className={`grid transition-[grid-template-rows,opacity] duration-700 motion-reduce:transition-none ${PANEL_EASE} ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-7 pb-7 text-justify text-[18px] leading-relaxed font-light text-white/50 sm:px-8 sm:pb-8">
            {renderWithLink(item.description, item.link)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ServiceInsights({
  image,
  headline,
  intro,
  introLink,
  items,
  closingParagraph,
}: ServiceInsightsProps) {
  // First item starts open by default.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  // Falls back to a placeholder if no image is provided, so this
  // section never crashes the page when insightsSection.image is
  // missing from the content data.
  const resolvedImage = image ?? {
    src: "/images/placeholder.png",
    alt: "",
  };

  return (
    <section className="bg-black-bg px-10 pt-[80px] pb-[80px]">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div
          className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[4/5] md:aspect-auto md:min-h-[600px]"
          style={{ clipPath: `url(#${PHOTO_CLIP_ID})` }}
        >
          <Image
            src={resolvedImage.src}
            alt={resolvedImage.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        {/* Hidden SVG that defines the cut-corner clip path used above. */}
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <clipPath id={PHOTO_CLIP_ID} clipPathUnits="objectBoundingBox">
              <path d="M0.955882 0C0.980249 0 1 0.017956 1 0.040107V0.831744C1 0.841834 0.995909 0.851314 0.988527 0.858833L0.860490 0.986872C0.852129 0.995233 0.840275 1 0.827846 1H0.044118C0.019752 1 0 0.981903 0 0.959893V0.040107C0.0000000138 0.017956 0.019752 0 0.044118 0H0.955882Z" />
            </clipPath>
          </defs>
        </svg>
        <div>
          <h2 className="text-[44px] leading-[1.25] font-medium tracking-tight text-white">
            {headline}
          </h2>
          <p className="mt-4 text-[18px] leading-relaxed font-light text-white/50">
            {renderWithLink(intro, introLink)}
          </p>
          <div className="mt-10 flex flex-col gap-5">
            {items.map((item, i) => (
              <InsightAccordionCard
                key={item.title}
                item={item}
                isOpen={openIndex === i}
                onToggle={() => toggleItem(i)}
              />
            ))}
          </div>
          {closingParagraph && (
            <p className="mt-10 text-[18px] leading-relaxed font-light text-white/50">
              {closingParagraph}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
