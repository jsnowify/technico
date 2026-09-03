"use client";

import { useId, useState } from "react";
import { SERVICES_FAQS, type FaqItem } from "@/lib/constants";

const PANEL_EASE = "ease-[cubic-bezier(0.77,0,0.175,1)]";

function ServicesFaqAccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reactId = useId();
  const panelId = `services-faq-panel-${reactId}`;
  const buttonId = `services-faq-question-${reactId}`;

  return (
    <div className="border-b border-black-text/10">
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-8 py-8 text-left sm:py-9"
      >
        <span className="text-lg leading-relaxed font-medium tracking-tight text-black-text sm:text-xl">
          {item.question}
        </span>
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center border border-black-text/15 transition-transform duration-500 sm:h-10 sm:w-10 ${PANEL_EASE} ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
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
          <p className="max-w-xl pb-9 text-sm leading-loose text-black-text/60 sm:pb-10 sm:text-base">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ServicesFAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section className="bg-white-bg">
      <div className="mx-auto max-w-4xl px-6 pt-24 pb-24 sm:pt-28 sm:pb-28 md:pt-32 md:pb-32">
        <div className="flex items-center justify-center gap-3">
          <span className="h-2.5 w-2.5 shrink-0 bg-black-text" />
          <span className="font-mono text-xs tracking-[0.16em] text-black-text uppercase sm:text-sm">
            SERVICES FAQ
          </span>
        </div>

        <h2 className="mx-auto mt-7 max-w-3xl text-balance text-center text-[2rem] leading-[1.2] font-normal tracking-tight text-black-text sm:mt-8 sm:text-[42px] sm:leading-[1.15] sm:tracking-[-1.5px] md:text-[50px] md:leading-[1.12] md:tracking-[-2px]">
          Frequently asked questions
        </h2>

        <div className="mt-20 border-t border-black-text/10 sm:mt-24 md:mt-28">
          {SERVICES_FAQS.map((item, index) => (
            <ServicesFaqAccordionItem
              key={item.question}
              item={item}
              isOpen={openItems.has(index)}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
