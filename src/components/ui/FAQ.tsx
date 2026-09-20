"use client";

import { useId, useState, type ReactNode } from "react";
import JsonLd from "@/components/seo/JsonLd";
import Button from "@/components/ui/Button";
import GridCorners from "@/components/ui/GridCorners";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";

export interface FaqItem {
  question: string;
  answer: string;
  emphasis?: string;
  link?: { label: string; href: string };
}

export interface FAQProps {
  eyebrow?: string;
  heading: ReactNode;
  description?: string;
  cta?: { label: string; href: string } | false;
  items: FaqItem[];
  includeJsonLd?: boolean;
}

function renderAnswer(
  answer: string,
  emphasis?: string,
  link?: { label: string; href: string },
) {
  const match = link?.label ?? emphasis;
  if (!match) return answer;
  const index = answer.indexOf(match);
  if (index < 0) return answer;

  const marked = link ? (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="circle"
      data-cursor-label="Explore"
      className="underline underline-offset-4 hover:text-accent-light"
    >
      {match}
    </a>
  ) : (
    <span className="underline underline-offset-4">{match}</span>
  );

  return (
    <>
      {answer.slice(0, index)}
      {marked}
      {answer.slice(index + match.length)}
    </>
  );
}

function FaqItemRow({
  item,
  index,
  open,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();

  return (
    <div className="border-b border-white/20 last:border-b-0">
      <button
        type="button"
        data-stagger-hover
        data-stagger-persist
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={id}
        className="relative grid w-full grid-cols-[38px_minmax(0,1fr)_28px] items-center gap-3 overflow-hidden px-5 py-6 text-left sm:grid-cols-[54px_minmax(0,1fr)_32px] sm:gap-5 sm:px-7 sm:py-8"
      >
        <HorizontalStaggerRows />
        <span className="relative font-mono text-[10px] tracking-[0.06em] text-content-muted sm:text-xs">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="relative h3-section leading-[1.15] font-medium tracking-heading text-white-text">
          {item.question}
        </span>
        <span
          aria-hidden="true"
          className="relative justify-self-end font-mono text-2xl font-light text-accent"
        >
          {open ? "\u2212" : "+"}
        </span>
      </button>

      <div
        id={id}
        aria-hidden={!open}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.22,0.8,0.22,1)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="grid border-t border-white/15 px-5 py-7 sm:grid-cols-[54px_minmax(0,1fr)_32px] sm:gap-5 sm:px-7 sm:py-8">
            <p className="body-copy max-w-[76ch] leading-[1.65] text-content sm:col-start-2">
              {renderAnswer(item.answer, item.emphasis, item.link)}
            </p>
          </div>
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqJsonLd = includeJsonLd
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      }
    : null;

  return (
    <section className="bg-black-bg py-20 sm:py-24 lg:py-28">
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <div className="container-x mx-auto w-full max-w-[1920px]">
        <header className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          {eyebrow && (
            <p className="font-mono text-xs tracking-[0.05em] text-content-muted uppercase">
              <span className="text-accent">{"// "}</span>
              {eyebrow}
            </p>
          )}
          <h2
            className={`h2-section max-w-[22ch] leading-[1.08] font-medium tracking-heading text-white-text text-balance ${
              eyebrow ? "mt-5" : ""
            }`}
          >
            {heading}
          </h2>
          {description && (
            <p className="body-copy mt-6 max-w-[62ch] leading-[1.65] text-content">
              {description}
            </p>
          )}
          {cta && (
            <div className="mt-8">
              <Button to={cta.href} variant="purple-fill" size="md">
                {cta.label}
              </Button>
            </div>
          )}
        </header>

        <div className="relative mt-12 border-y border-white/20 sm:mt-16">
          <GridCorners />
          {items.map((item, index) => (
            <FaqItemRow
              key={item.question}
              item={item}
              index={index}
              open={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
