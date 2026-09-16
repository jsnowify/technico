"use client";
import { useState } from "react";
import Image from "next/image";

interface ServiceContentPillarsItem {
  title: string;
  description: string;
}

interface ServiceContentPillarsProps {
  eyebrow: string;
  headline: string;
  paragraph: string;
  quote: string;
  quoteAttribution: string;
  image: { src: string; alt: string };
  items: ServiceContentPillarsItem[];
}

/**
 * ServiceContentPillars
 * -----------------------------------------------------------------
 * "Content Creation That Keeps Your Brand Message Consistent" —
 * left column carries a small square-bullet eyebrow, headline, and
 * intro paragraph, followed by a pull-quote (with attribution)
 * paired with a photo in a 2-up sub-grid; right column is an
 * accordion list of items.
 *
 * The accordion cards and their expand/collapse mechanics are the
 * same as ServiceInsights.tsx's InsightAccordionCard (same
 * grid-rows-[0fr]->[1fr] trick, same rounded #1A1B1E panel, same
 * diagonal-arrow glyph rotating 180deg) — first item open by
 * default, only one open at a time, opening a new one closes
 * whatever was previously open.
 */
const PANEL_EASE = "ease-[cubic-bezier(0.77,0,0.175,1)]";

function ContentAccordionCard({
  item,
  isOpen,
  onToggle,
}: {
  item: ServiceContentPillarsItem;
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
        <span className="text-[22px] leading-snug font-medium tracking-tight text-white">
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
          <p className="px-7 pb-7 text-justify text-[17px] leading-relaxed font-light text-white/50 sm:px-8 sm:pb-8">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ServiceContentPillars({
  eyebrow,
  headline,
  paragraph,
  quote,
  quoteAttribution,
  image,
  items,
}: ServiceContentPillarsProps) {
  // First item starts open by default, same as ServiceInsights.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-black-bg px-10 pt-[80px] pb-[80px]">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <div className="flex items-center gap-2.5">
            <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-white" />
            <p className="text-sm leading-none font-light tracking-wide text-white/70 uppercase">
              {eyebrow}
            </p>
          </div>
          <h2 className="mt-6 text-[32px] leading-[1.15] font-medium tracking-tight text-white sm:text-[40px] md:text-[44px]">
            {headline}
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed font-light text-white/60">
            {paragraph}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-[1.3fr_1fr] sm:items-start">
            <div>
              <p className="text-justify text-[15px] leading-relaxed font-light text-white/60">
                <span
                  aria-hidden="true"
                  className="float-left mr-1 -mt-3 font-serif text-7xl leading-[0.8] text-white/25"
                >
                  &ldquo;
                </span>
                {quote}
              </p>
              <p className="mt-4 text-[15px] leading-snug font-medium text-white">
                {quoteAttribution}
              </p>
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-[24px] sm:aspect-[4/5]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 20vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {items.map((item, i) => (
            <ContentAccordionCard
              key={item.title}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => toggleItem(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
