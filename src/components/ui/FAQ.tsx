"use client";

import { useId, useState, type ReactNode } from "react";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";

/**
 * FAQ (ui/FAQ.tsx)
 * -----------------------------------------------------------------
 * The one FAQ component for the whole site — every question/answer
 * accordion is this component called directly, with each call site
 * passing its own copy/data as props. No per-page wrapper
 * components sit in between anymore:
 *   - app/page.tsx (homepage FAQ) — eyebrow + 3-line heading +
 *     description + FAQS data.
 *   - app/services/page.tsx (/services list) — eyebrow + 1-line
 *     heading + SERVICES_FAQS data.
 *   - app/services/[slug]/page.tsx — the "faq" section, built from
 *     that service's own content data.
 *   - app/blog/[slug]/page.tsx — "faq" content blocks, built from
 *     that post's own content data.
 * Changing the visual design (spacing, colors, animation, markup)
 * only ever needs to happen in this one file.
 *
 * Layout/markup is carried over from the original
 * components/services/ServiceFAQ.tsx (the /services/[slug] version,
 * now retired) — two-column, no max-width cap on the grid, flat
 * (non-responsive) card type sizes, un-indented justified answers.
 * `eyebrow` and `description` are additive, optional slots on top
 * of that for the call sites that use them (home + services-list
 * intros) — omit both and you get the original ServiceFAQ look
 * exactly.
 */

export interface FaqItem {
  question: string;
  answer: string;
  /** Substring of `answer` to underline for emphasis, e.g. "Search Engine Marketing". */
  emphasis?: string;
  /** Substring of `answer` that renders as an external link instead — mutually exclusive with `emphasis`. */
  link?: { label: string; href: string };
}

export interface FAQProps {
  /** Small mono label above the heading, e.g. "[ ] Services FAQ". Omitted entirely when not set. */
  eyebrow?: string;
  /** Heading content. Pass your own <br /> between lines for multi-line headings. */
  heading: ReactNode;
  /** Optional supporting paragraph under the heading. */
  description?: string;
  /** CTA rendered under the heading. Defaults to "Get In Touch" -> /contact; pass `false` to hide it. */
  cta?: { label: string; href: string } | false;
  items: FaqItem[];
  /** Emits FAQPage JSON-LD structured data built from `items`. Default true. */
  includeJsonLd?: boolean;
}

const PANEL_EASE = "ease-[cubic-bezier(0.77,0,0.175,1)]";

function renderAnswer(
  answer: string,
  emphasis?: string,
  link?: { label: string; href: string },
) {
  if (link) {
    const idx = answer.indexOf(link.label);
    if (idx !== -1) {
      return (
        <>
          {answer.slice(0, idx)}
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="circle"
            className="text-white underline decoration-1 underline-offset-4 hover:text-white/80"
          >
            {link.label}
          </a>
          {answer.slice(idx + link.label.length)}
        </>
      );
    }
  }

  if (!emphasis) return answer;

  const idx = answer.indexOf(emphasis);
  if (idx === -1) return answer;

  return (
    <>
      {answer.slice(0, idx)}
      <span className="text-white underline decoration-1 underline-offset-4">
        {emphasis}
      </span>
      {answer.slice(idx + emphasis.length)}
    </>
  );
}

interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqAccordionItem({ item, isOpen, onToggle }: FaqAccordionItemProps) {
  const reactId = useId();
  const panelId = `faq-panel-${reactId}`;
  const buttonId = `faq-question-${reactId}`;

  return (
    <div className="overflow-hidden rounded-[28px] bg-[#1A1B1E]">
      <button
        id={buttonId}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-6 p-7 text-left sm:p-8"
      >
        <span className="text-[24px] leading-snug font-medium tracking-tight text-white">
          {item.question}
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
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-[grid-template-rows,opacity] duration-700 motion-reduce:transition-none ${PANEL_EASE} ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-7 pb-7 text-justify text-[18px] leading-relaxed font-light text-white/50 sm:px-8 sm:pb-8">
            {renderAnswer(item.answer, item.emphasis, item.link)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ({
  eyebrow,
  heading,
  description,
  cta = { label: "Get In Touch", href: "/contact" },
  items,
  includeJsonLd = true,
}: FAQProps) {
  // Only one question open at a time — opening a new one closes
  // whatever was previously open. All items start closed.
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  const faqJsonLd = includeJsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <section className="container-x bg-black-bg py-20 sm:py-24 md:py-28">
      {faqJsonLd && <JsonLd data={faqJsonLd} />}

      <div className="grid w-full grid-cols-1 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-x-16">
        {/* LEFT — FAQ INTRO */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          {eyebrow && (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tracking-[0.16em] text-white/60 uppercase sm:text-sm">
                {eyebrow}
              </span>
            </div>
          )}

          <h2
            className={`text-[32px] leading-[1.15] font-medium tracking-tight text-white sm:text-[40px] md:text-[44px] ${
              eyebrow ? "mt-7 sm:mt-8" : ""
            }`}
          >
            {heading}
          </h2>

          {description && (
            <p className="mt-7 max-w-md text-sm leading-loose text-white/45 sm:mt-8 sm:text-base">
              {description}
            </p>
          )}

          {cta && (
            <div className="mt-8">
              <Button to={cta.href} variant="purple" size="lg">
                {cta.label}
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT — FAQ CARDS */}
        <div className="flex flex-col gap-5">
          {items.map((item, index) => (
            <FaqAccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => toggleItem(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
