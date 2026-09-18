"use client";

import { useId, useState } from "react";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import { renderBlogBlock } from "./renderBlogBlock";
import type { BlogBodyBlock } from "@/lib/content/types";

interface BlogAccordionItem {
  title: string;
  content: BlogBodyBlock[];
}

function BlogAccordionCard({
  item,
  open,
  onToggle,
}: {
  item: BlogAccordionItem;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  return (
    <div className="border-b border-white/20 last:border-b-0">
      <button
        type="button"
        data-stagger-hover
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="relative flex w-full items-center justify-between gap-6 overflow-hidden p-5 text-left sm:p-6"
      >
        <HorizontalStaggerRows />
        <span className="relative h3-section font-medium tracking-heading text-white-text">
          {item.title}
        </span>
        <span aria-hidden="true" className="relative text-xl text-accent">
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        id={id}
        aria-hidden={!open}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,0.8,0.22,1)] motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-4 border-t border-white/15 px-5 py-6 text-base leading-relaxed text-content sm:px-6">
            {item.content.map((block, index) => renderBlogBlock(block, index))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogAccordion({
  items,
}: {
  items: BlogAccordionItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="border border-white/20">
      {items.map((item, index) => (
        <BlogAccordionCard
          key={item.title}
          item={item}
          open={openIndex === index}
          onToggle={() =>
            setOpenIndex((current) => (current === index ? null : index))
          }
        />
      ))}
    </div>
  );
}
