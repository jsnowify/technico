"use client";

import { useId, useState } from "react";
import { renderBlogBlock } from "./renderBlogBlock";
import type { BlogBodyBlock } from "@/lib/content/types";

/* ================================================================
   BLOG ACCORDION — expandable stack inside the article column
   ----------------------------------------------------------------
   Same expand/collapse card visual as the shared FAQ accordion
   (dark #1A1B1E panel, title + circular arrow toggle rotating
   180deg open -> closed — see components/ui/FAQ.tsx's
   FaqAccordionItem), copied here for the blog's "accordion" content
   block. Unlike ui/FAQ, this isn't a full-width two-column section
   with a sticky headline/CTA — it's sized to sit inline in the
   article's own narrow column, same footprint as BlogTable.

   The other difference from a plain FAQ: each item's body isn't
   locked to plain text. It renders whatever BlogBodyBlock content
   the item carries (paragraph/list/table/columnTable/dataTable/
   image/cta, even a nested accordion) via the shared renderBlogBlock
   switch, so one item can hold a whole rich sub-section instead of a
   single answer paragraph.
   ================================================================ */

interface BlogAccordionItem {
  title: string;
  content: BlogBodyBlock[];
}

interface BlogAccordionProps {
  items: BlogAccordionItem[];
}

const PANEL_EASE = "ease-[cubic-bezier(0.77,0,0.175,1)]";

function BlogAccordionCard({
  item,
  isOpen,
  onToggle,
}: {
  item: BlogAccordionItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reactId = useId();
  const panelId = `blog-accordion-panel-${reactId}`;
  const buttonId = `blog-accordion-title-${reactId}`;

  return (
    <div className="overflow-hidden rounded-[20px] bg-[#1A1B1E]">
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-6 p-6 text-left"
      >
        <span className="text-lg leading-snug font-medium tracking-tight text-white">
          {item.title}
        </span>
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition-transform duration-500 ${PANEL_EASE} ${
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
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows,opacity] duration-700 motion-reduce:transition-none ${PANEL_EASE} ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 px-6 pb-6 text-base leading-relaxed text-white/60">
            {item.content.map((block, i) => renderBlogBlock(block, i))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogAccordion({ items }: BlogAccordionProps) {
  // Only one item open at a time, same behavior as ServiceFAQ — all
  // items start closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <BlogAccordionCard
          key={item.title}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => toggleItem(i)}
        />
      ))}
    </div>
  );
}
