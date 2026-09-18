"use client";

import Link from "next/link";
import { useState } from "react";
import HorizontalStagger from "@/components/layout/Header/HorizontalStagger";
import { QUESTIONS_ANSWERS } from "@/lib/constants";

const SOLUTION_META = [
  {
    label: "Search engine optimization",
    href: "/services/search-engine-optimization",
    layout: "lg:col-span-7",
  },
  {
    label: "Social media management",
    href: "/services/social-media-management",
    layout: "lg:col-span-5",
  },
  {
    label: "Website design + development",
    href: "/services/website-design-and-development",
    layout: "lg:col-span-4",
  },
  {
    label: "Creative design + content",
    href: "/services/creative-design-and-content",
    layout: "lg:col-span-4",
  },
  {
    label: "Digital advertising",
    href: "/services/advertising",
    layout: "md:col-span-2 lg:col-span-4",
  },
] as const;

interface SolutionCardProps {
  index: number;
  question: string;
  answer: string;
  label: string;
  href: string;
  layout: string;
}

function SolutionCard({
  index,
  question,
  answer,
  label,
  href,
  layout,
}: SolutionCardProps) {
  const [active, setActive] = useState(false);
  const number = String(index + 1).padStart(2, "0");

  return (
    <Link
      href={href}
      aria-label={`Explore our ${label} service`}
      data-cursor="highlight"
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setActive(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch") setActive(false);
      }}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={`group relative isolate flex min-h-[310px] flex-col overflow-hidden bg-black-bg p-5 text-white transition-colors duration-300 hover:text-black-bg focus-visible:text-black-bg focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black-bg sm:min-h-[340px] sm:p-7 lg:p-8 ${layout}`}
    >
      <HorizontalStagger active={active} rows={7} />

      <div className="relative z-10 flex items-start justify-between gap-5 border-b border-white/15 pb-4 font-mono text-[10px] tracking-[0.08em] uppercase transition-colors duration-300 group-hover:border-black/20 group-focus-visible:border-black/20 sm:text-xs">
        <span className="opacity-55">Solution / {number}</span>
        <span className="max-w-[20ch] text-right opacity-55">{label}</span>
      </div>

      <h3 className="h3-section relative z-10 mt-6 max-w-[25ch] leading-[1.15] font-medium tracking-heading">
        {question}
      </h3>

      <p className="body-copy relative z-10 mt-5 max-w-[62ch] leading-[1.6] tracking-[-0.02em] opacity-70">
        {answer}
      </p>

      <span className="relative z-10 mt-auto flex items-center justify-between gap-5 pt-8 font-mono text-[11px] tracking-[0.08em] uppercase sm:text-xs">
        <span>Explore service</span>
        <span
          aria-hidden="true"
          className="text-base transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:-translate-y-1"
        >
          ↗
        </span>
      </span>
    </Link>
  );
}

export default function QuestionsAnswers() {
  return (
    <section id="solutions" className="bg-black-bg text-white">
      <div className="container-x mx-auto w-full max-w-[1920px] section-y">
        <header className="grid grid-cols-1 gap-5 border-t border-white/20 pt-5 sm:grid-cols-[minmax(130px,0.35fr)_minmax(0,1.65fr)] sm:gap-8 lg:gap-16">
          <div className="flex items-start gap-3 font-mono text-[11px] tracking-[0.04em] text-white/50 uppercase sm:pt-1 sm:text-xs">
            <span aria-hidden="true">/</span>
            <span>Solutions</span>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:gap-12">
            <h2 className="h2-section max-w-[19ch] leading-[1.08] font-medium tracking-heading text-white">
              Tailored solutions for every marketing pain point.
            </h2>
            <p className="body-copy max-w-[48ch] leading-[1.6] tracking-[-0.02em] text-content uppercase lg:pt-1">
              If these challenges sound familiar, connect the problem directly
              to the service designed to solve it and start building measurable
              growth.
            </p>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden border border-white/15 bg-white/15 md:grid-cols-2 lg:mt-10 lg:grid-cols-12">
          {QUESTIONS_ANSWERS.map((item, index) => {
            const meta = SOLUTION_META[index];

            return (
              <SolutionCard
                key={item.question}
                index={index}
                question={item.question}
                answer={item.answer}
                label={meta.label}
                href={meta.href}
                layout={meta.layout}
              />
            );
          })}

          <Link
            href="/services"
            data-cursor="highlight"
            className="group col-span-full flex min-h-20 items-center justify-between gap-6 bg-purple-accent px-5 py-5 font-mono text-[11px] tracking-[0.08em] text-black-bg uppercase transition-colors hover:bg-accent-light focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-black-bg sm:px-7 sm:text-xs lg:px-8"
          >
            <span>View all digital marketing services</span>
            <span
              aria-hidden="true"
              className="text-lg transition-transform duration-300 ease-out group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
