"use client";

import { useId, useState } from "react";
import GeometricIcon from "@/components/ui/icons";
import HorizontalStaggerRows from "@/components/ui/HorizontalStaggerRows";
import GridCorners from "@/components/ui/GridCorners";
import ServiceSectionHeader from "./ServiceSectionHeader";
import {
  SERVICE_ACCENT,
  SERVICE_EASE,
  type ServiceAccent,
} from "./serviceAccent";

interface ServicePillarCardsItem {
  title: string;
  description: string;
}

interface ServicePillarCardsProps {
  eyebrow: string;
  headline: string;
  intro: string;
  items: ServicePillarCardsItem[];
  closingParagraph?: string;
  accent?: ServiceAccent;
}

/** One expanded pillar at a time; descriptions retain their full contrast. */
export default function ServicePillarCards({
  eyebrow,
  headline,
  intro,
  items,
  closingParagraph,
  accent = "purple",
}: ServicePillarCardsProps) {
  const tone = SERVICE_ACCENT[accent];
  const id = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-black-bg">
      <ServiceSectionHeader
        eyebrow={eyebrow}
        headline={headline}
        accent={accent}
        paragraph={intro}
      />

      <div className="relative mt-12 grid grid-cols-1 border border-white/18 sm:mt-16 lg:grid-cols-2">
        <GridCorners accent={accent} />

        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => toggleItem(index)}
              aria-expanded={isOpen}
              aria-controls={`${id}-pillar-${index}`}
              data-stagger-hover
              className={`group relative flex min-h-[200px] flex-col overflow-hidden border-b border-white/18 p-5 text-left last:border-b-0 sm:p-7 lg:[&:nth-child(odd)]:border-r lg:[&:nth-last-child(2)]:border-b-0 ${SERVICE_EASE}`}
            >
              <HorizontalStaggerRows />

              <div className="relative flex items-start justify-between gap-4">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center transition-colors duration-500 ${
                    isOpen
                      ? `${tone.fill} text-black-bg`
                      : `border border-white/25 text-content group-hover:border-white/50`
                  }`}
                >
                  <GeometricIcon index={index} className="h-5 w-5" />
                </span>
                <span
                  className={`font-mono text-xs tracking-[0.06em] ${
                    isOpen ? tone.text : "text-content-muted"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="relative mt-auto pt-8">
                <h3 className="max-w-[16ch] text-[clamp(1.2rem,1.7vw,1.5rem)] leading-[1.15] font-medium tracking-heading text-white-text">
                  {item.title}
                </h3>

                <div
                  id={`${id}-pillar-${index}`}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-700 motion-reduce:transition-none ${SERVICE_EASE} ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="body-copy mt-4 border-t border-white/20 pt-4 leading-[1.6] text-content">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {closingParagraph && (
        <p className="body-copy mt-9 max-w-[76ch] leading-[1.62] text-content">
          {closingParagraph}
        </p>
      )}
    </section>
  );
}
